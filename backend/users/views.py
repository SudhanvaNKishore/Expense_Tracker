from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model, authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from .serializers import UserRegistrationSerializer, UserSerializer
from .models import CustomUser
from django.db.models.signals import post_save
from django.dispatch import receiver
from expenses.models import Category

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegistrationSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Create default categories for the new user
        default_categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Others']
        for category_name in default_categories:
            Category.objects.create(name=category_name, user=user)
        
        refresh = RefreshToken.for_user(user)
        response_data = {
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }
        return Response(response_data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    print(f"Login attempt for email: {email}")  # Debug print
    
    if not email or not password:
        return Response({'error': 'Please provide both email and password'},
                      status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        print(f"Found user: {user.email}")  # Debug print
        
        if user.check_password(password):
            print("Password check passed")  # Debug print
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            print("Password check failed")  # Debug print
            
    except User.DoesNotExist:
        print(f"No user found with email: {email}")  # Debug print
        
    return Response({'error': 'Invalid credentials'},
                   status=status.HTTP_401_UNAUTHORIZED)
