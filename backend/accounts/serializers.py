from datetime import datetime, timedelta
import random
from django.conf import settings
from rest_framework import serializers
from .utils import send_otp

from .models import UserModel



from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        # Add custom claims
        token['username'] = user.phone_number
        return token

class UserLoginSerializer(serializers.ModelSerializer):
  phone_number = serializers.CharField(max_length=10)
  class Meta:
    model = UserModel
    fields = ['phone_number', 'password']

class UserSerializer(serializers.ModelSerializer):
    """
    User Serializer.

    Used in POST and GET
    """
    # otp = serializers.CharField(write_only=True, required=False)  # For OTP verification
    password1 = serializers.CharField(
        write_only=True,
        min_length=settings.MIN_PASSWORD_LENGTH,
        error_messages={
            "min_length": "Password must be longer than {} characters".format(
                settings.MIN_PASSWORD_LENGTH
            )
        },
    )
    password2 = serializers.CharField(
        write_only=True,
        min_length=settings.MIN_PASSWORD_LENGTH,
        error_messages={
            "min_length": "Password must be longer than {} characters".format(
                settings.MIN_PASSWORD_LENGTH
            )
        },
    )

    class Meta:
        model = UserModel
        fields = (
            "id",
            "name",
            "phone_number",
            "password1",
            "password2",
        )
        read_only_fields = ("id",)

    def validate(self, data):
        """
        Validates if both password are same or not.
        """

        if data["password1"] != data["password2"]:
            raise serializers.ValidationError("Passwords do not match")
        return data
    

    def create(self, validated_data):
        """
        Create method.

        Used to create the user
        """
        otp = random.randint(1000, 9999)
        otp_expiry = datetime.now() + timedelta(minutes = 10)

        user = UserModel(
            phone_number=validated_data["phone_number"],
            name=validated_data["name"],
            otp=otp,
            otp_expiry=otp_expiry,
            max_otp_try=settings.MAX_OTP_TRY
        )
        user.set_password(validated_data["password1"])
        user.save()
        send_otp(validated_data["phone_number"], otp)
        return user

class VerifyCodeSerializer(serializers.Serializer):
    verification_code = serializers.CharField(max_length=6)
    phone_number = serializers.CharField()


class PhonePasswordResetRequestSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField()
    class Meta:
        model = UserModel
        fields = (
            "phone_number",
        )

class PhonePasswordResetConfirmSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    verification_code = serializers.CharField()
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    class Meta:
        model = UserModel
        fields = (
            "phone_number",
            "password1",
            "password2"
        )

    def validate(self, data):
        """
        Validates if both password are same or not.
        """

        if data["password1"] != data["password2"]:
            raise serializers.ValidationError("Passwords do not match")
        return data



class PhoneNumberCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['phone_number']