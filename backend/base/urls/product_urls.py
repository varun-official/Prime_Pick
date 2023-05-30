from django.urls import path
from base.views import product_views as views


urlpatterns = [
    path('',views.getProducts, name='products'),
    path('create/',views.createProduct, name='product-create '),
    path('upload/',views.uploadImage, name='product-image-upload '),
    path('top/',views.getTopProducts, name='product-top '),
    path('<str:pk>/',views.getProduct, name='product'),
    path('<str:pk>/review/create/',views.createReview, name='create-review'),
    path('delete/<str:pk>/',views.deleteProduct, name='product-delete '),
    path('update/<str:pk>/',views.updateProduct, name='product-update '),
]
