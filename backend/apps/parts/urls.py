# apps/parts/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PartViewSet,
    PartsAdminViewSet,
    FitmentView,
    ProductDetailView,
    CategoryViewSet,
    public_parts_admin_list,
    parts_children, accessories_children,
)
from .auth_view import CookieLoginView, CookieRefreshView, MeView, LogoutView
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r"parts", PartViewSet, basename="parts")
router.register(r"parts-admin", PartsAdminViewSet, basename="parts-admin")
router.register(r"categories", CategoryViewSet, basename="categories")

urlpatterns = [
    # Auth
    path("auth/login/", CookieLoginView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", CookieRefreshView.as_view(), name="token_refresh"),
    path("auth/logout/", LogoutView.as_view(), name="auth_logout"),
    path("auth/me/", MeView.as_view(), name="auth_me"),

    # ✅ Custom endpoint (no extra 'api/' prefix here)
    path("categories/parts/children/", parts_children, name="parts-children"),
    path("categories/accessories/children/", accessories_children, name="accessories-children"),


    # Public parts
    path("parts-public/", public_parts_admin_list, name="parts-public"),

    # Product detail
    path("parts/<slug:slug>/", ProductDetailView.as_view(), name="part-detail"),

    # VIN fitment
    path("fitment/", FitmentView.as_view(), name="vin-fitment"),

    # Include router URLs (parts, parts-admin, categories)
    path("", include(router.urls)),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
