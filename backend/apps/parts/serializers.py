from rest_framework import serializers
from .models import Part, PartsAdmin, ProductImage


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image_url", "alt_text", "is_primary"]


# Product detail serializer with multiple images
class PartsAdminDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

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
            "category",
            "stock_status",
            "warranty",
            "delivery_days",
            "return_days",
            "description",
        ]


# For public-facing parts
class PublicPartSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='product.name', default='—')
    slug = serializers.CharField(source='product.slug', default='')  # ✅ Added
    category = serializers.CharField(source='product.category', default='uncategorized')
    price = serializers.FloatField(source='product.price', default=0)
    stars = serializers.FloatField(source='product.stars', default=None)
    stock_status = serializers.BooleanField(source='product.stock_status', default=False)
    image_url = serializers.URLField(source='product.image_url', allow_null=True, required=False)
    warranty = serializers.IntegerField(source='product.warranty', default=0)
    delivery_days = serializers.IntegerField(source='product.delivery_days', default=0)
    return_days = serializers.IntegerField(source='product.return_days', default=0)

    class Meta:
        model = Part
        fields = [
            "id",
            "slug",  # ✅ now frontend can build links
            "make",
            "model",
            "year_start",
            "year_end",
            "trim",
            "drive_type",
            "body_class",
            "name",
            "category",
            "price",
            "stars",
            "stock_status",
            "image_url",
            "warranty",
            "delivery_days",
            "return_days",
        ]


# Admin serializer
class PartsAdminSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, required=False)

    class Meta:
        model = PartsAdmin
        fields = [
            "id",
            "name",
            "slug",
            "image_url",  # now just a URL
            "images",
            "price",
            "stars",
            "category",
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

        # Update fields normally
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Replace images if provided
        if images_data is not None:
            instance.images.all().delete()
            for img in images_data:
                ProductImage.objects.create(product=instance, **img)

        return instance

    # Optional: keep validations
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
