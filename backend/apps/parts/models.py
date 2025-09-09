from django.db import models

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

class PartsAdmin(models.Model):
    name = models.CharField(max_length=255)
    image_url = models.URLField(max_length=500, blank=True, null=True)  # ✅ Changed to URLField
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stars = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    stock_status = models.BooleanField(default=True)
    warranty = models.IntegerField(default=0)  # years
    delivery_days = models.IntegerField(default=0)
    return_days = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name} ({self.category})"


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
