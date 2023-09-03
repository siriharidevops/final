import datetime
import random
import requests

from django.conf import settings
from django.utils import timezone
from rest_framework import status, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import send_otp

from .models import UserModel
from .serializers import UserSerializer,PhonePasswordResetRequestSerializer,PhonePasswordResetConfirmSerializer
# from .serializers import PhonePasswordResetRequestSerializer, PhonePasswordResetConfirmSerializer
from .serializers import VerifyCodeSerializer,UserLoginSerializer,MyTokenObtainPairSerializer, PhoneNumberCheckSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAuthenticated



# class UserViewSet(APIView):
#     """
#     UserModel View.
#     """

#     queryset = UserModel.objects.all()
#     serializer_class = UserSerializer


class PhoneNumberCheckView(APIView):
    def get(self, request, phone_number):
        try:
            user = UserModel.objects.get(phone_number=phone_number)
            serializer = PhoneNumberCheckSerializer(user)
            return Response({'exists': True})
        except UserModel.DoesNotExist:
            return Response({'exists': True}, status=404)

def get_tokens_for_user(user):
  refresh = RefreshToken.for_user(user)
  return {
      'refresh': str(refresh),
      'access': str(refresh.access_token),
  }

class UserListView(generics.ListAPIView):
    queryset = UserModel.objects.all()  # Queryset to fetch all users
    serializer_class = UserSerializer

class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # token = get_tokens_for_user(user)
            refresh = RefreshToken.for_user(user)
            tokens = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            }


            # # Generate and send the verification code (simulated here)
            # verification_code = str(random.randint(100000, 999999))
            # user.verification_code = verification_code
            # user.save()
            # api_key="UqS8jzhtyvmC7wInJZaLc3foOK4Wd260iHN1YuFQBgPpkEV59DFaGBIl3U6oVSMb9CRAsJOtLp0vz14n"
            # # Simulate sending the code via SMS (replace with your actual SMS API)
            # sms_api_url = f"https://www.fast2sms.com/dev/1bulkV2?authorization={api_key}&route=otp&variables_values={verification_code}&flash=0&numbers={user.phone_number}"
            # sms_data = {
            #     "to": user.phone_number.as_e164,
            #     "message": f"Your verification code: {verification_code}"
            # }
            # response = requests.get(sms_api_url)
            # print(response)
            # response = requests.post(sms_api_url, json=sms_data)

            return Response(tokens,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyCodeView(APIView):
    def post(self, request):
        serializer = VerifyCodeSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            verification_code = serializer.validated_data['verification_code']
            
            try:
                user = UserModel.objects.get(phone_number=phone_number)
            except UserModel.DoesNotExist:
                return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            if ( 
                not user.is_active
                and user.otp == verification_code
                and user.otp_expiry
                and timezone.now() < user.otp_expiry
            ):
                user.is_active = True
                user.otp_expiry = None
                user.max_otp_try = settings.MAX_OTP_TRY
                user.otp_max_out = None
                user.save()
                return Response(
                    "Successfully verified the user.", status=status.HTTP_200_OK
                )
            
            return Response({'detail': 'Invalid verification code'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegenerateOTPView(APIView):
    def post(self, request):
        phone_number = request.data.get('phone_number')
        
        try:
            user = UserModel.objects.get(phone_number=phone_number)
        except UserModel.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        if int(user.max_otp_try) == 0 and timezone.now() < user.otp_max_out:
            return Response(
                "Max OTP try reached, try after an hour",
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Generate and send a new verification code (simulated here)
        new_verification_code = str(random.randint(100000, 999999))
        user.verification_code = new_verification_code
        user.save()
        otp_expiry = timezone.now() + datetime.timedelta(minutes=10)
        max_otp_try = int(user.max_otp_try) - 1

        user.otp = new_verification_code
        user.otp_expiry = otp_expiry
        user.max_otp_try = max_otp_try
        if max_otp_try == 0:
            # Set cool down time
            otp_max_out = timezone.now() + datetime.timedelta(hours=1)
            user.otp_max_out = otp_max_out
        elif max_otp_try == -1:
            user.max_otp_try = settings.MAX_OTP_TRY
        else:
            user.otp_max_out = None
            user.max_otp_try = max_otp_try
        user.save()
        send_otp(user.phone_number, new_verification_code)
        # Simulate sending the new code via SMS (replace with your actual SMS API)
        # sms_api_url = "YOUR_SMS_API_URL"
        # sms_data = {
        #     "to": user.phone_number.as_e164,
        #     "message": f"Your new verification code: {new_verification_code}"
        # }
        # response = requests.post(sms_api_url, json=sms_data)

        return Response({'detail': 'New verification code sent'}, status=status.HTTP_200_OK)


class PhonePasswordResetRequestView(APIView):
    def post(self, request):
        print(request.data)
        serializer = PhonePasswordResetRequestSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            try:
                instance = UserModel.objects.get(phone_number=phone_number)
                # user.generate_reset_code()
                # instance = self.get_object()
                if int(instance.max_otp_try) == 0 and timezone.now() < instance.otp_max_out:
                    return Response("Max OTP try reached, try after an hour",status=status.HTTP_400_BAD_REQUEST)
                otp = random.randint(100000, 999999)
                otp_expiry = timezone.now() + datetime.timedelta(minutes=10)
                max_otp_try = int(instance.max_otp_try) - 1

                instance.otp = otp
                instance.otp_expiry = otp_expiry
                instance.max_otp_try = max_otp_try
                if max_otp_try == 0:
                    # Set cool down time
                    otp_max_out = timezone.now() + datetime.timedelta(hours=1)
                    instance.otp_max_out = otp_max_out
                elif max_otp_try == -1:
                    instance.max_otp_try = settings.MAX_OTP_TRY
                else:
                    instance.otp_max_out = None
                    instance.max_otp_try = max_otp_try
                instance.save()
                send_otp(instance.phone_number, otp)
                # Send SMS with reset code
                return Response({'detail': 'Verification code sent.'}, status=status.HTTP_200_OK)
            except UserModel.DoesNotExist:
                return Response({'detail': 'User with this phone number not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PhonePasswordResetConfirmView(APIView):
    def post(self, request):
        print(request.data)
        serializer = PhonePasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            verification_code = serializer.validated_data['verification_code']
            new_password = serializer.validated_data['password1']

            try:
                user = UserModel.objects.get(phone_number=phone_number)
                if user.otp == verification_code:
                    user.set_password(new_password)
                    user.save()
                    return Response({'detail': 'Password reset successful.'}, status=status.HTTP_200_OK)
                else:
                    return Response({'detail': 'Invalid verification code.'}, status=status.HTTP_400_BAD_REQUEST)
            except UserModel.DoesNotExist:
                return Response({'detail': 'User with this phone number not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






class UserLoginView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer



class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            # Serialize the user data if needed
            # user_data = UserSerializer(user).data
            data = {
                'phone_number': user.phone_number,
                'name': user.name,
                # 'email': user.profile.email,
                # 'address': user.profile.address,
                # Include any other fields you want to retrieve
            }

            return Response(data, status=status.HTTP_200_OK)
        except UserModel.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


