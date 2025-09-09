from django.conf import settings
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken

COOKIE_NAME = "refresh_token"

def set_refresh_cookie(resp, refresh: str):
    # HttpOnly refresh cookie
    resp.set_cookie(
        COOKIE_NAME,
        refresh,
        max_age=14 * 24 * 60 * 60,   # 14 days
        httponly=True,
        secure=False,                # True in production with HTTPS
        samesite="Lax",
        path="/",                    # whole site
    )
    return resp

def clear_refresh_cookie(resp):
    resp.delete_cookie(COOKIE_NAME, path="/")
    return resp

class CookieLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        res = super().post(request, *args, **kwargs)
        if res.status_code == 200 and "refresh" in res.data:
            refresh = res.data.pop("refresh")
            set_refresh_cookie(res, refresh)
        return res

class CookieRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # read refresh from cookie if not in body
        data = request.data.copy()
        if "refresh" not in data:
            refresh_cookie = request.COOKIES.get(COOKIE_NAME)
            if not refresh_cookie:
                return Response({"detail": "No refresh cookie"}, status=401)
            data["refresh"] = refresh_cookie
        request._full_data = data
        res = super().post(request, *args, **kwargs)
        # rotate refresh: set new cookie if provided
        if res.status_code == 200 and "refresh" in res.data:
            refresh = res.data.pop("refresh")
            set_refresh_cookie(res, refresh)
        return res

class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # If you want to blacklist the refresh, try to read it and blacklist
        refresh_cookie = request.COOKIES.get(COOKIE_NAME)
        if refresh_cookie:
            try:
                token = RefreshToken(refresh_cookie)
                token.blacklist()  # requires token_blacklist app
            except Exception:
                pass
        res = Response({"detail": "Logged out"})
        clear_refresh_cookie(res)
        return res

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_staff": user.is_staff,
            "date": timezone.now(),
        })
