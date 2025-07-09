from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer,LoginSerializer,UpdateUserSerializer,PassWordUpdateSerializer,AnalysisSerializer,PlanDiseaseSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken,TokenError
from agricular.settings import URL,PAT
from clarifai.client.model import Model
import logging
import asyncio
from django.core.files.base import ContentFile
import hashlib
from .models import PlantDisease, DiseaseSolution
from rest_framework.parsers import MultiPartParser, FormParser
import cloudinary.uploader
import os
from django.conf import settings
import json
# Create your views here.
class Register(APIView):
    permission_classes=[AllowAny]
    def post(self,request,*args, **kwargs):
       print(request.data)
       serializer = UserSerializer(data = request.data)
       if serializer.is_valid():
        serializer.save()
        return Response({
            'result':"Đăng ký thành công"
        },status=status.HTTP_201_CREATED)
       else:
          return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
class Login(APIView):
   permission_classes = [AllowAny]
   def post(self,request,*args, **kwargs):
        serializer = LoginSerializer(data = request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            user_serializer = UserSerializer(user)

            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': user_serializer.data,
            }, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# update user
class UpdatedUser(APIView):
   permission_classes= [IsAuthenticated]

   def put(self,request):
      user = request.user
      serializer = UpdateUserSerializer(user,data=request.data,context={'request':request},partial=True)
      print(request.data)
      if serializer.is_valid():
            serializer.save()
            print('Serializer data:', serializer.data)
            return Response({
                    "message": "Cập nhật thông tin thành công",
                    "user": serializer.data
                }, status=status.HTTP_200_OK)

      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# đổi mật khẩu
class ChangePassword(APIView):
    permission_classes = [IsAuthenticated]
    def put(self,request):
        user = request.user
        serializer = PassWordUpdateSerializer(user,data = request.data,context={'request':request})
        if serializer.is_valid():
            serializer.save()
            print('Serializer data:', serializer.data)
            return Response({
                    "message": "Cập nhật thông tin thành công",
                    "user": serializer.data
                }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# phân tích
logger =logging.getLogger(__name__)

class Anylysis(APIView):
    parser_classes = (MultiPartParser, FormParser)

    permission_classes = [IsAuthenticated]
    def post(self,request,*args, **kwargs):
        image_file = request.FILES.get('image')
        print(request.data)
        print('FILES:', request.FILES)
        if not image_file:
            logger.error("No image provided in request")
            return Response({"error": "Không cung cấp ảnh"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            try:
                loop = asyncio.get_running_loop()
            except RuntimeError:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)

            image_content = image_file.read()
            image_file.seek(0)
            image_hash = hashlib.sha256(image_content).hexdigest()
            existing = PlantDisease.objects.filter(hash=image_hash, user=request.user).first()
            if existing:
                serializer = AnalysisSerializer(existing, context={'request': request})
                return Response({
                    "message": "Ảnh đã được phân tích trước đó.",
                    "data": serializer.data
                }, status=status.HTTP_200_OK)
            model = Model(url=URL,pat=PAT)
            logger.info("Đã khởi tạo Clarifai model")

            try:
                response = model.predict_by_bytes(image_content,input_type='image')
                logger.info(f"Phản hồi từ Clarifai: {response}")
            except Exception as clarifai_er:
                logger.error(f"Lỗi Clarifai: {str(clarifai_er)}")

                return Response({"error": f"Lỗi Clarifai: {str(clarifai_er)}"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            if not response.outputs or not response.outputs[0].data.concepts:
                return Response({"error": "Không phát hiện bệnh trong ảnh"}, 
                               status=status.HTTP_400_BAD_REQUEST)
            if image_file.size > 10 * 1024 * 1024:  # 10MB
                logger.error(f"File too large: {image_file.size} bytes")
                return Response({"error": "File ảnh vượt quá 10MB."}, status=status.HTTP_400_BAD_REQUEST)
            # Upload lên Cloudinary
            try:
                upload_result = cloudinary.uploader.upload(image_file, resource_type="image")
                logger.info(f"Cloudinary upload success: {upload_result['secure_url']}")
                image_url = upload_result['secure_url']
            except Exception as cloudinary_er:
                logger.exception(f"Cloudinary upload error: {str(cloudinary_er)}")
                return Response({"error": f"Lỗi khi upload ảnh lên Cloudinary: {str(cloudinary_er)}"},
                               status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            concepts = response.outputs[0].data.concepts
            concept_dict = {concept.name: concept.value for concept in concepts}
            # lấy dữ liệu cao nhất
            if concept_dict:
                disease_key = max(concept_dict,key=concept_dict.get,default="Không xác định") if concept_dict else "Không xác định"
                confident = concept_dict[disease_key]
                print(confident)
                if confident < 0.7:
                    return Response(
                    {"error": f"Độ tin cậy ({disease_key.value*100:.2f}%) thấp hơn 70%, không đủ cơ sở kết luận bệnh."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # lấy dữ liệu từ bảng solution
            try:
                disease_solution = DiseaseSolution.objects.get(key=disease_key)
            except DiseaseSolution.DoesNotExist:
                return Response(
                    {"error": f"Bệnh với key '{disease_key}' chưa tồn tại trong hệ thống."},
                    status=status.HTTP_404_NOT_FOUND
                )
# Chuẩn bị dữ liệu cho serializer
            data = {
                "disease": disease_solution.disease,
                "cach_xu_ly": disease_solution.cach_xu_ly,
                "nguyen_nhan": disease_solution.nguyen_nhan,
                "phong_ngua": disease_solution.phong_ngua,
                "thuoc": disease_solution.thuoc,
                "image": image_url,
                "hash": image_hash
            }
            serializer = AnalysisSerializer(data=data,context = {'request':request})
            if serializer.is_valid():
                serializer.save()
                return Response({
                "message": "Ảnh đã được upload và phân tích thành công.",
                "data": serializer.data
                }, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # logger.error(f"Serializer errors: {serializer.errors}")
            return Response({"error": "loại bệnh trong ảnh không có trong hệ thống! "}, 
                           status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Plandisease(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        try:
            diseases = PlantDisease.objects.filter(user=request.user).order_by('-created_at')[:8]
            serializer = PlanDiseaseSerializer(diseases,many=True)
            return Response(serializer.data)
        except PlantDisease.DoesNotExist:
            return Response({"error": "Không tìm thấy đối tượng"}, status=status.HTTP_404_NOT_FOUND)

# hàm xóa
class DeleteDisease(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self,request,pk):
        try:
            instance = PlantDisease.objects.get(pk=pk)
            instance.delete()
            return Response({'message':"xóa thành công"})
        except PlantDisease.DoesNotExist:
            return Response({"error": "Không tìm thấy đối tượng"}, status=status.HTTP_404_NOT_FOUND)

class DetailPlanDisease(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,pk):
        try:
            disease = PlantDisease.objects.get(user = request.user,pk=pk)
            serializer = PlanDiseaseSerializer(disease)
            return Response(serializer.data)
        except PlantDisease.DoesNotExist:
            return Response({"error": "Không tìm thấy đối tượng"}, status=status.HTTP_404_NOT_FOUND)




