from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Avatar(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name="avatar")
    image = models.ImageField(upload_to="avatars/",null=True,blank=True)
    
    def __str__(self):
        return f"Avatar của {self.user.username}"
    
class PlantDisease(models.Model):
    disease = models.CharField(max_length=255)
    cach_xu_ly = models.TextField()
    nguyen_nhan = models.TextField()
    phong_ngua = models.TextField()
    thuoc = models.TextField()
    image = models.URLField(max_length=500, blank=True, null=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="user")
    hash = models.CharField(max_length=64, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True)
    def __str__(self):
        return self.disease
    
class DiseaseSolution(models.Model):
    key = models.CharField(max_length=100, unique=True)  # ví dụ: 'den_than'
    disease = models.CharField(max_length=255)  # Tên bệnh đầy đủ
    cach_xu_ly = models.TextField()
    nguyen_nhan = models.TextField()
    phong_ngua = models.TextField()
    thuoc = models.TextField()

    def __str__(self):
        return self.disease
