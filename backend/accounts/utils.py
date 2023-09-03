import requests
from django.conf import settings


def send_otp(mobile, otp):
    """
    Send message.
    """
    # url = f"https://2factor.in/API/V1/{settings.SMS_API_KEY}/SMS/{mobile}/{otp}/Your OTP is"
    # payload = ""
    # headers = {'content-type': 'application/x-www-form-urlencoded'}
    # response = requests.get(url, data=payload, headers=headers)
    api_key="UqS8jzhtyvmC7wInJZaLc3foOK4Wd260iHN1YuFQBgPpkEV59DFaGBIl3U6oVSMb9CRAsJOtLp0vz14n"
    # url = f"https://www.fast2sms.com/dev/bulkV2?authorization={api_key}&variables_values={otp}&route=otp&numbers={mobile}"
    payload = ""
    # headers = {'content-type': 'application/x-www-form-urlencoded'}
    url = f"https://www.fast2sms.com/dev/1bulkV2?authorization=UqS8jzhtyvmC7wInJZaLc3foOK4Wd260iHN1YuFQBgPpkEV59DFaGBIl3U6oVSMb9CRAsJOtLp0vz14n&route=otp&variables_values={otp}&flash=0&numbers={mobile}"
    response = requests.get(url)
    print(response)

    return bool(response.ok)
