from django.urls import path
from base.views import order_views as views

urlpatterns = [
 path('add/',views.addOrderItems,name='order_add'),
 path('myorders/',views.getAllOrders,name='myorders'),
 path('all/',views.getOrders,name='allOrder'),
 path('<str:pk>/',views.getOrderById,name='user_order'),
 path('<str:pk>/pay/',views.payOrder,name='pay'),
 path('<str:pk>/deliver/',views.deliverOrder,name='deliver'),

]
