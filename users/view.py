from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.views import APIView
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterView(generics.CreateAPIView):
    serializer_class=RegisterSerializer

class LoginView(APIView):
    def post(self, request):
        serializer= LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username= serializer.validated_data["username"],
                password=serializer.validated_data["password"],

            )
            if user:
                refresh= RefreshToken.for_user(user)
                return Response({
                    "refresh":str(refresh),
                    "access":str(refresh.access_token),
                    "username":user.username
                })
        return Response({"error":"Invalid Credentials"},status=status.HTTP_401_UNAUTHORIZED)
