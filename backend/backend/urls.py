from django.contrib import admin
from django.urls import path, include
from django.views.decorators.cache import cache_page
from django.views.generic import RedirectView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from django.contrib.sitemaps.views import sitemap
from apps.parts.sitemap import PartsSitemap

sitemaps = {
    "products": PartsSitemap,
}

urlpatterns = [
    path("", RedirectView.as_view(url="/api/docs/")),
    path("admin/", admin.site.urls),

    # OpenAPI schema + Swagger UI
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),

    # Parts app
    path("api/parts/", include("apps.parts.urls")),  # this points to your app's urls.py

    path("sitemap.xml", cache_page(60*60)(sitemap), {"sitemaps": sitemaps}, name="sitemap"),
]
