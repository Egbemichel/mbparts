from django.db import models
from django.db.models.signals import pre_save
from django.utils.text import slugify
from django.urls import reverse

CATEGORY_CHOICES = [
    ('body', 'Body Parts'),
    ('exterior', 'Exterior'),
    ('interior', 'Interior'),
    ('audio', 'Audio & Electronics'),
    ('parts', 'Parts'),
    ('performance', 'Performance'),
    ('lighting', 'Lighting'),
    ('uncategorized', 'Uncategorized'),
]


class ProductImage(models.Model):
    product = models.ForeignKey(
        "PartsAdmin",
        on_delete=models.CASCADE,
        related_name="images"
    )
    image_url = models.URLField(max_length=500)  # store multiple image URLs
    alt_text = models.CharField(max_length=255, blank=True, null=True)  # SEO-friendly alt text
    is_primary = models.BooleanField(default=False)  # optional: mark a featured image

    class Meta:
        ordering = ["-is_primary", "id"]  # primary image comes first

    def __str__(self):
        return f"Image for {self.product.name}"

class PartsAdmin(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)  # ✅ Changed to URLField
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stars = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='uncategorized')
    stock_status = models.BooleanField(default=True)
    warranty = models.IntegerField(default=0)  # years
    delivery_days = models.IntegerField(default=0)
    return_days = models.IntegerField(default=0)
    description = models.TextField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.category})"

    def get_absolute_url(self):
        return reverse("product_detail", kwargs={"slug": self.slug})

def ensure_unique_slug(instance):
    base = slugify(instance.name)[:200]
    slug = base
    i = 1
    Model = instance.__class__
    while Model.objects.filter(slug=slug).exclude(pk=instance.pk).exists():
        slug = f"{base}-{i}"
        i += 1
    return slug

def partsadmin_pre_save(sender, instance, **kwargs):
    if not instance.slug:
        instance.slug = ensure_unique_slug(instance)

pre_save.connect(partsadmin_pre_save, sender=PartsAdmin)



class Part(models.Model):
    product = models.ForeignKey(PartsAdmin, on_delete=models.CASCADE, related_name="fitments", null=True, blank=True)

    # Fitment info
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year_start = models.IntegerField()
    year_end = models.IntegerField()
    trim = models.CharField(max_length=50, blank=True, null=True)
    drive_type = models.CharField(max_length=50, blank=True, null=True)
    body_class = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.product.name} for {self.make} {self.model} ({self.year_start}-{self.year_end})"
