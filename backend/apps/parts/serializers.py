from rest_framework import serializers
from .models import Part, PartsAdmin

# For public-facing parts
class PublicPartSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='product.name', default='—')
    category = serializers.CharField(source='product.category', default='uncategorized')
    price = serializers.FloatField(source='product.price', default=0)
    stars = serializers.FloatField(source='product.stars', default=None)
    stock_status = serializers.BooleanField(source='product.stock_status', default=False)
    image_url = serializers.URLField(source='product.image_url', allow_null=True, required=False)  # ✅ URLField
    warranty = serializers.IntegerField(source='product.warranty', default=0)
    delivery_days = serializers.IntegerField(source='product.delivery_days', default=0)
    return_days = serializers.IntegerField(source='product.return_days', default=0)

    class Meta:
        model = Part
        fields = [
            "id",
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
    class Meta:
        model = PartsAdmin
        fields = [
            "id",
            "name",
            "image_url",  # now just a URL
            "price",
            "stars",
            "category",
            "stock_status",
            "warranty",
            "delivery_days",
            "return_days",
        ]

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
