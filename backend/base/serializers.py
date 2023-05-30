from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Product, Order, OrderItem, ShippingAddress, Review

class UserSerializer(serializers.ModelSerializer):
   name = serializers.SerializerMethodField(read_only=True)
   _id = serializers.SerializerMethodField(read_only=True)
   isAdmin = serializers.SerializerMethodField(read_only=True)

   class Meta:
      model = User
      fields = ['_id','username','email','name','isAdmin']
   
   def get__id(self,obj):
      return obj.id
   
   def get_isAdmin(self,obj):
      return obj.is_staff

   def get_name(self,obj):
      name = obj.first_name
      if name == '':
         name=obj.email
      return name

class UserSerializerWithToken(serializers.ModelSerializer):
   name = serializers.SerializerMethodField(read_only=True)
   _id = serializers.SerializerMethodField(read_only=True)
   isAdmin = serializers.SerializerMethodField(read_only=True)
   token = serializers.SerializerMethodField(read_only=True)

   class Meta:
      model = User
      fields = ['_id','username','email','name','isAdmin','token']
   
   def get_token(self,obj):
      token = RefreshToken.for_user(obj)
      return str(token.access_token)
   
   def get__id(self,obj):
      return obj.id
   
   def get_isAdmin(self,obj):
      return obj.is_staff

   def get_name(self,obj):
      name = obj.first_name
      if name == '':
         name=obj.email
      return name

class ReviewSerializer(serializers.ModelSerializer):
   class Meta:
      model = Review
      fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
   reviews = serializers.SerializerMethodField(read_only = True)
   class Meta:
      model = Product
      fields = '__all__'
   
   def get_reviews(self,obj):
      reviews = obj.review_set.all()
      serializers = ReviewSerializer(reviews, many=True)
      return serializers.data


class OrderItemSerializer(serializers.ModelSerializer):
   class Meta:
      model = OrderItem
      fields = '__all__'

class ShippingAddressSerializer(serializers.ModelSerializer):
   class Meta:
      model = ShippingAddress
      fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
   orderitems = serializers.SerializerMethodField(read_only = True)
   shippingAddress = serializers.SerializerMethodField(read_only = True)
   user = serializers.SerializerMethodField(read_only = True)
   class Meta:
      model = Order
      fields = '__all__'
   
   def get_orderitems(self,obj):
      items = obj.orderitem_set.all()
      serializers = OrderItemSerializer(items,many=True)
      return serializers.data
   
   def get_shippingAddress(self,obj):
      try:
         serializers = ShippingAddressSerializer(obj.shippingaddress,many=False)
         address  = serializers.data
      except:
         address = False
      return address
   
   def get_user(self,obj):
      user = obj.user
      serializers = UserSerializer(user,many=False)
      return serializers.data
