from django.urls import path
from .views import Register,Login,UpdatedUser,ChangePassword,Anylysis,Plandisease,DeleteDisease,DetailPlanDisease
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('register/',Register.as_view(),name="register"),
    path('login/',Login.as_view(),name="login"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # update user
    path('update/',UpdatedUser.as_view(),name="update"),
    # update password
    path('changepassword/',ChangePassword.as_view(),name="changepassword"),
    # anylysis
    path('analysis/',Anylysis.as_view(),name="analysis"),
    # lấy dữ liệu cho profile
    path('profile/',Plandisease.as_view(),name="plandisease"),
    # xóa
    path('<int:pk>/delete/',DeleteDisease.as_view(),name='delete'),
    # trang chi tiết
    path('<int:pk>/detail/',DetailPlanDisease.as_view(),name="detail")
]
