from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from base.models import Product,Review
from rest_framework import status

from base.serializers import ProductSerializer

@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')
    if not query:
        query=""    
    products = Product.objects.filter(name__icontains = query)
    page = request.query_params.get('page')

    paginator = Paginator(products,5)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        page = paginator.num_pages
        products = paginator.page(paginator.num_pages)
    
    if page == None:
        page = 1

    page = int(page)

    serializer = ProductSerializer(products, many=True)    
    return Response({'products':serializer.data, 'page':page, 'pages': paginator.num_pages})

@api_view(['GET'])
def getProduct(request,pk):
    product= Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)    
    return Response(serializer.data)

@api_view(['GET'])
def getTopProducts(request):
    products= Product.objects.all().order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)    
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user

    product= Product.objects.create(
        user=user,
        name='Sample Name',
        price = 0,
        brand='Sample Brand',
        countInStock = 0,
        category = 'Sample Category',
        description=''
    )
    serializer = ProductSerializer(product, many=False)    
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request,pk):
    data = request.data
    product= Product.objects.get(_id=pk)

    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']
    product.save()

    serializer = ProductSerializer(product, many=False)    
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request,pk):
    product= Product.objects.get(_id=pk)
    product.delete()

    return Response("Product Deleted")

@api_view(['POST'])
def uploadImage(request):
    data = request.data

    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)

    product.image = request.FILES.get('image')
    product.save()

    return Response('Image was uploaded')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createReview(request,pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    #1 if customer already wrote the review for product

    alreadyExists = product.review_set.filter(user=user).exists()

    if alreadyExists:
        content = {
            'details': "Product already reviewed"
        }

        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    #2 No rating or 0

    elif data['rating']==0:
        content = {
            'details': "Please select a rating it can't be zero"
        }

        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    
    #3 create the review
    else:
        review = Review.objects.create(
            user = user,
            product = product,
            name = user.first_name,
            rating = data['rating'],
            comment = data['comment'],
        )

        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        totalRating=0
        for item in reviews:
            totalRating+=item.rating
        
        product.rating = totalRating / len(reviews)

        product.save()
        
        return Response(ProductSerializer(product,many=False).data)