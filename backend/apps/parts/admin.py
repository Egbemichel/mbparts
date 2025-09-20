from django.contrib import admin
from django.utils.html import format_html

from .models import PartsAdmin, Part, ProductImage, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'parent')
    search_fields = ('name',)

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(PartsAdmin)
class PartsAdminAdmin(admin.ModelAdmin):
    list_display = [
        "name", "new_category", "price", "stars",
        "stock_status", "warranty", "delivery_days", "return_days"
    ]
    list_filter = ["new_category", "stock_status"]
    search_fields = ["name"]
    raw_id_fields = ('new_category',)
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline]

@admin.register(Part)
class PartAdmin(admin.ModelAdmin):
    list_display = [
        "product_name", "make", "model", "year_start", "year_end",
        "trim", "drive_type", "body_class"
    ]
    list_filter = ["make", "model", "body_class", "drive_type"]
    search_fields = ["make", "model", "product__name"]

    # helper to show the related product's name
    def product_name(self, obj):
        return obj.product.name
    product_name.admin_order_field = "product__name"
    product_name.short_description = "Product Name"

    def thumbnail(self, obj):
        if obj.image_url:
            return format_html(f'<img src="{obj.image_url}" style="height:50px;width:50px;object-fit:cover;" />')
        return "-"

    thumbnail.short_description = "Image"
