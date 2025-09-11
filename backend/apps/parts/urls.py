# apps/parts/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartViewSet, PartsAdminViewSet, FitmentView, ProductDetailView
from .auth_view import CookieLoginView, CookieRefreshView, MeView, LogoutView
from django.conf import settings
from django.conf.urls.static import static
from . import views

router = DefaultRouter()
router.register(r"parts", PartViewSet, basename="parts")
router.register(r"parts-admin", PartsAdminViewSet, basename="parts-admin")

urlpatterns = [
    # Auth
    path("auth/login/", CookieLoginView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", CookieRefreshView.as_view(), name="token_refresh"),
    path("auth/logout/", LogoutView.as_view(), name="auth_logout"),
    path("auth/me/", MeView.as_view(), name="auth_me"),

    path('parts-public/', views.public_parts_admin_list, name='parts-public'),

    path("parts/<slug:slug>/", ProductDetailView.as_view(), name="part-detail"),


    # VIN fitment
    path("fitment/", FitmentView.as_view(), name="vin-fitment"),

    # Include router URLs
    path("", include(router.urls)),  # <-- keeps /parts-admin/ at /api/parts-admin/
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
