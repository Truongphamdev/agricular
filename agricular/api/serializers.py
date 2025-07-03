from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Avatar
import os
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True,min_length=6)
    email = serializers.EmailField()
    avatar = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id','username','email','password','avatar']
    def validate_email(self,value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("email đã tồn tại")
        return value
    def get_avatar(self,obj):
        try:
                avatar_obj, created = Avatar.objects.get_or_create(user=obj)
                if avatar_obj.image:  # Kiểm tra xem có ảnh không
                    request = self.context.get('request')
                    if request:
                        return request.build_absolute_uri(avatar_obj.image.url)
                    else:

                        return f"{'http://localhost:8000/'}{avatar_obj.image.url}"
                return None
        except Exception as e:
            print(f"Error in get_avatar: {e}")
            return None
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({'email':['email không tồn tại.']})
        
        if not user.check_password(password):
            raise serializers.ValidationError({'password':['mật khẩu không đúng']})
        data['user']= user
        return data
# update user
class UpdateUserSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    avatar = serializers.ImageField(required=False, allow_null=True)
    class Meta:
        fields = ['username','email','avatar']
    def validate_email(self,value):
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("Email đã tồn tại.")
        return value
    def validate_avatar(self, value):
        if value and not hasattr(value, 'file'):
            raise serializers.ValidationError("Dữ liệu gửi lên cho avatar không phải là file.")
        return value
    def update(self,instance,validated_data):
        instance.username = validated_data.get('username',instance.username)
        instance.email = validated_data.get('email',instance.email)
        print(instance.username)
        instance.save()

        avatar_image = validated_data.get('avatar',None)
        if avatar_image:
            avatar_obj,created = Avatar.objects.get_or_create(user=instance)
            if not created and avatar_obj.image and avatar_obj.image.name:
                old_path_image = avatar_obj.image.path
                if os.path.exists(old_path_image):
                    try:
                        os.remove(old_path_image)
                    except OSError as e:
                        print(f"Error deleting old avatar: {e}")

            avatar_obj.image = avatar_image
            avatar_obj.save()
        return instance
    def to_representation(self, instance):
        request = self.context.get('request')
        avatar_obj, created = Avatar.objects.get_or_create(user=instance)
        avatar_url = request.build_absolute_uri(avatar_obj.image.url) if avatar_obj.image else None
        return {
            'username': instance.username,
            'email': instance.email,
            'avatar': avatar_url,
        }
# đổi mật khẩu
class PassWordUpdateSerializer(serializers.Serializer):
    password = serializers.CharField(write_only = True,min_length=6)
    current_password = serializers.CharField(write_only = True,min_length = 6)
    def validate_current_password(self,value):
        user = self.instance
        if not user.check_password(value):
            raise serializers.ValidationError("mật khẩu cũ không đúng")
        return value
    def save(self, **kwargs):
        user = self.instance
        try:
            user.set_password(self.validated_data['password'])
            user.save()
            return user
        except Exception as e:
            raise serializers.ValidationError(f"Lỗi khi lưu mật khẩu: {str(e)}")

