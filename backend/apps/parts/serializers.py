from rest_framework import serializers
from .models import Part, PartsAdmin, ProductImage, Category


# ------------------------------
# Category serializer (CRUD + nested)
# ------------------------------
class CategorySerializer(serializers.ModelSerializer):
    parent = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), required=False, allow_null=True
    )

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent', 'description']
        read_only_fields = ['slug']

# For nested display in products
class CategoryNestedSerializer(serializers.ModelSerializer):
    parent = serializers.StringRelatedField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image_url", "alt_text", "is_primary"]


# Product detail serializer with multiple images
class PartsAdminDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    new_category = CategorySerializer(read_only=True)

    class Meta:
        model = PartsAdmin
        fields = [
            "id",
            "name",
            "slug",
            "image_url",  # can still keep one "cover image"
            "images",     # ✅ all additional images
            "price",
            "stars",
            "new_category",
            "stock_status",
            "warranty",
            "delivery_days",
            "return_days",
            "description",
        ]

class PublicPartSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='product.name', default='—')
    slug = serializers.CharField(source='product.slug', default='')
    category = serializers.CharField(source='product.new_category.name', default='uncategorized')
    price = serializers.FloatField(source='product.price', default=0)
    stars = serializers.FloatField(source='product.stars', default=None)
    stock_status = serializers.BooleanField(source='product.stock_status', default=False)
    image_url = serializers.URLField(source='product.image_url', allow_null=True, required=False)
    warranty = serializers.IntegerField(source='product.warranty', default=0)
    delivery_days = serializers.IntegerField(source='product.delivery_days', default=0)
    return_days = serializers.IntegerField(source='product.return_days', default=0)

    category_name = serializers.SerializerMethodField()
    category_slug = serializers.SerializerMethodField()

    class Meta:
        model = Part
        fields = [
            "id",
            "slug",
            "make",
            "model",
            "year_start",
            "year_end",
            "trim",
            "drive_type",
            "body_class",
            "name",
            "category_name",
            "category_slug",
            "category",
            "price",
            "stars",
            "stock_status",
            "image_url",
            "warranty",
            "delivery_days",
            "return_days",
        ]

    # These MUST be outside Meta
    def get_category_name(self, obj):
        if obj.product and obj.product.new_category:
            return obj.product.new_category.name
        return "uncategorized"

    def get_category_slug(self, obj):
        if obj.product and obj.product.new_category:
            return obj.product.new_category.slug
        return "uncategorized"

# Admin serializer
class PartsAdminSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, required=False)

    # 🔑 Add human-readable category info
    category_name = serializers.CharField(source="new_category.name", read_only=True)
    category_slug = serializers.CharField(source="new_category.slug", read_only=True)

    class Meta:
        model = PartsAdmin
        fields = [
            "id",
            "name",
            "slug",
            "image_url",   # cover image
            "images",
            "price",
            "stars",
            "new_category",   # FK ID for writes
            "category_name",  # readable name
            "category_slug",  # readable slug
            "stock_status",
            "warranty",
            "delivery_days",
            "return_days",
            "description",
        ]

    def create(self, validated_data):
        images_data = validated_data.pop("images", [])
        product = PartsAdmin.objects.create(**validated_data)
        for img in images_data:
            ProductImage.objects.create(product=product, **img)
        return product

    def update(self, instance, validated_data):
        images_data = validated_data.pop("images", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if images_data is not None:
            instance.images.all().delete()
            for img in images_data:
                ProductImage.objects.create(product=instance, **img)

        return instance

    # ✅ validations stay the same
    def validate_stars(self, value):
        if value is not None and (value < 0 or value > 9.9):
            raise serializers.ValidationError("Stars must be between 0 and 9.9")
        return value

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price must be a positive number")
        return value

    def validate_warranty(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("Warranty must be between 0 and 100 years")
        return value

    def validate_delivery_days(self, value):
        if value < 0 or value > 365:
            raise serializers.ValidationError("Delivery days must be between 0 and 365")
        return value

    def validate_return_days(self, value):
        if value < 0 or value > 365:
            raise serializers.ValidationError("Return days must be between 0 and 365")
        return value


# Part serializer with nested product
class PartSerializer(serializers.ModelSerializer):
    product = PartsAdminSerializer(read_only=True)

    class Meta:
        model = Part
        fields = [
            "id",
            "product",
            "make",
            "model",
            "year_start",
            "year_end",
            "trim",
            "drive_type",
            "body_class",
        ]
class CategoryWithProductsSerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    first_product_image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "product_count", "first_product_image"]

    def get_product_count(self, obj):
        return PartsAdmin.objects.filter(new_category=obj).count()

    def get_first_product_image(self, obj):
        product = PartsAdmin.objects.filter(new_category=obj).first()
        return product.image_url if product else None