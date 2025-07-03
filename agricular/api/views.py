from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer,LoginSerializer,UpdateUserSerializer,PassWordUpdateSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken,TokenError

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