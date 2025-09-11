from django.contrib.sitemaps import Sitemap
from .models import PartsAdmin

class PartsSitemap(Sitemap):
    changefreq = "weekly"   # Suggests Google how often the page changes
    priority = 0.8           # Page importance (0.0 - 1.0)

    def items(self):
        # Only include products that are active or visible
        return PartsAdmin.objects.filter(is_active=True)

    def location(self, obj):
        # Matches your Next.js routes
        return f"/product/{obj.slug}/"

    def lastmod(self, obj):
        # Return last updated timestamp if available
        return getattr(obj, "updated_at", None)

    def get_urls(self, site=None, **kwargs):
        """
        Override to add images for Google Product Rich Results.
        """
        urls = super().get_urls(site=site, **kwargs)
        for url, obj in zip(urls, self.items()):
            images = []
            if obj.image_url:
                images.append({
                    "loc": obj.image_url,
                    "title": obj.name,
                    "caption": obj.name
                })
            if hasattr(obj, "images") and obj.images.exists():
                for img in obj.images.all():
                    images.append({
                        "loc": img.image_url,
                        "title": getattr(img, "title", obj.name),
                        "caption": getattr(img, "caption", obj.name)
                    })
            if images:
                url["images"] = images
        return urls
