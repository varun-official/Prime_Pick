from django.urls import path
from base.views import user_views as views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)


urlpatterns = [
    path('register/',views.registerUser,name='user_register'),
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("all/",views.getUsers,name='all_users'),
    path('profile/', views.getUserProfile,name='user_profile'),
    path('profile/update/',views.updateUserProfile,name='user_profile_update'),
    path('<str:pk>/',views.getUserId,name='user_delete'),
    path('delete/<str:pk>/',views.deleteUser,name='user_delete'),
    path('update/<str:pk>/',views.updateUser,name='user_update'),
]
