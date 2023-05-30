from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Product, Order , OrderItem , ShippingAddress
from django.contrib.auth.models import User
from rest_framework import status
from datetime import datetime

from base.serializers import OrderSerializer, OrderItemSerializer, ShippingAddressSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data['orderItems']
    print(data)

    if orderItems and len(orderItems)==0:
        message = {
        'detail':'No order Items'
        }
        return Response (message, status=status.HTTP_400_BAD_REQUEST)
    else:
        #(1) Create Order
        order = Order.objects.create(
            user = user,
            paymentMethod = data['paymentMethod'],
            taxPrice = data['taxPrice'],
            shippingPrice = data['shippingPrice'],
            totalPrice = data['totalPrice']
        )

        #(2) Create Shipping address
        shipping = ShippingAddress.objects.create(
            order = order,
            address = data['shipping']['address'],
            city = data['shipping']['city'],
            postalCode = data['shipping']['pincode'],
            country = data['shipping']['state'],
            shippingPrice = data['shippingPrice']
        )

        #(3) Create relationship b/w the order and order items
        for item in orderItems:
            product = Product.objects.get(_id =item['_id'])

            itemDetails = OrderItem.objects.create(
                product = product,
                order = order,
                name = product.name,
                qty = item['qty'],
                price = item['price'],
                image = product.image.url
            )
                
            
            #(4) update the stock
            product.countInStock-=itemDetails.qty
            product.save()
        
        serializer = OrderSerializer(order,many=False)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAllOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request,pk):
    user = request.user
    try:
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({'details':'User not authorized view the order'},status= status.HTTP_401_UNAUTHORIZED)
    
    except:
            return Response({'details':'Requested order not present'},status= status.HTTP_401_UNAUTHORIZED)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def payOrder(request,pk):
    order = Order.objects.get(_id=pk)

    order.isPaid = True
    order.paidAt = datetime.now()

    order.save()

    serializer = OrderSerializer(order, many=False)


    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def deliverOrder(request,pk):
    order = Order.objects.get(_id=pk)

    order.isDelivered = True
    order.deliveredAt = datetime.now()

    order.save()

    serializer = OrderSerializer(order, many=False)


    return Response(serializer.data)