from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import viewsets, filters, status, generics
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend

from .models import Part, Category, PartsAdmin
from .serializers import PartSerializer, PartsAdminDetailSerializer, PartsAdminSerializer, CategorySerializer, \
    CategoryWithProductsSerializer
from rest_framework.permissions import IsAuthenticated  # restrict to logged-in admin


# ------------------------------
# Pagination
# ------------------------------
class FitmentPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


# ------------------------------
# Category CRUD ViewSet
# ------------------------------
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name']
    filterset_fields = ['parent']
    pagination_class = FitmentPagination


# ------------------------------
# Product Detail Views
# ------------------------------
class ProductDetailView(generics.RetrieveAPIView):
    queryset = PartsAdmin.objects.all()
    serializer_class = PartsAdminDetailSerializer
    lookup_field = "slug"


class PartsDetailBySlug(generics.RetrieveAPIView):
    queryset = PartsAdmin.objects.all()
    serializer_class = PartsAdminSerializer
    lookup_field = "slug"


# ------------------------------
# PartsAdmin & Part ViewSets
# ------------------------------
class PartsAdminViewSet(viewsets.ModelViewSet):
    queryset = PartsAdmin.objects.all().order_by("id")
    serializer_class = PartsAdminSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = FitmentPagination


class PartViewSet(viewsets.ModelViewSet):
    queryset = Part.objects.all().select_related("product")
    serializer_class = PartSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    filterset_fields = {
        "product__new_category": ["exact"],
        "make": ["iexact"],
        "model": ["iexact"],
        "body_class": ["icontains"],
        "drive_type": ["icontains"],
    }

    search_fields = ["product__name"]
    ordering_fields = ["product__price", "product__stars"]
    ordering = ["-product__price"]

    @method_decorator(cache_page(60 * 10))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


# ------------------------------
# Fitment / Synonym helpers
# ------------------------------
DRIVE_TYPE_MAP = {
    "fwd": ["fwd", "front wheel drive", "2wd front", "4x2"],
    "rwd": ["rwd", "rear wheel drive", "2wd rear"],
    "awd": ["awd", "all wheel drive", "4wd", "4x4"],
}

BODY_CLASS_MAP = {
    "sedan": ["sedan", "saloon", "passenger car"],
    "suv": ["suv", "crossover", "sport utility", "Sport Utility Vehicle (SUV)/Multi-Purpose Vehicle (MPV)"],
    "hatchback": ["hatchback", "5-dr", "3-dr"],
    "truck": ["pickup", "truck", "light truck", "pickup truck"],
}


def normalize(value: str, mapping: dict) -> str | None:
    if not value:
        return None
    val = value.lower()
    for key, synonyms in mapping.items():
        if any(s in val for s in synonyms):
            return key
    return val


def get_compatible_parts(vehicle_info):
    try:
        year = int(vehicle_info.get("year", 0))
    except (ValueError, TypeError):
        year = 0

    make = vehicle_info.get("make", "")
    model = vehicle_info.get("model", "")
    body_class = normalize(vehicle_info.get("bodyClass", ""), BODY_CLASS_MAP)
    drive_type = normalize(vehicle_info.get("driveType", ""), DRIVE_TYPE_MAP)

    base_qs = Part.objects.filter(
        make__iexact=make,
        model__iexact=model,
        year_start__lte=year + 10,
        year_end__gte=year - 10,
    )

    # --- Tiered filtering ---
    qs = base_qs
    if body_class:
        qs = qs.filter(body_class__icontains=body_class)
    if drive_type:
        qs = qs.filter(drive_type__icontains=drive_type)
    if qs.exists():
        return qs

    qs = base_qs
    if body_class:
        qs = qs.filter(body_class__icontains=body_class)
    if qs.exists():
        return qs

    qs = base_qs
    if drive_type:
        qs = qs.filter(drive_type__icontains=drive_type)
    if qs.exists():
        return qs

    return base_qs


# ------------------------------
# Fitment API
# ------------------------------
class FitmentView(APIView):
    """
    Accepts vehicleInfo JSON from frontend and returns grouped parts
    with pagination per category (supports parent + subcategories)
    """
    pagination_class = FitmentPagination

    def post(self, request):
        vehicle_info = request.data

        if not vehicle_info.get("vin"):
            return Response({"error": "VIN is required"}, status=status.HTTP_400_BAD_REQUEST)

        compatible_parts = get_compatible_parts(vehicle_info).select_related("product__new_category")

        # Use category ID for uniqueness
        categories = compatible_parts.values_list("product__new_category__id", flat=True).distinct()
        grouped_results = {}
        paginator = self.pagination_class()

        for category_id in categories:
            parts_in_category = compatible_parts.filter(product__new_category__id=category_id)
            category_obj = Category.objects.filter(id=category_id).first()
            category_slug = category_obj.slug if category_obj else str(category_id)

            # Pagination
            page_number = request.query_params.get(f"page_{category_slug}", 1)
            request.query_params._mutable = True
            request.query_params['page'] = page_number
            request.query_params._mutable = False

            page = paginator.paginate_queryset(parts_in_category, request)
            serializer = PartSerializer(page, many=True)

            grouped_results[category_slug] = {
                "category_name": category_obj.name if category_obj else "",
                "count": parts_in_category.count(),
                "next": paginator.get_next_link(),
                "previous": paginator.get_previous_link(),
                "results": serializer.data,
            }

        return Response(grouped_results)

@api_view(["GET"])
def accessories_children(request):
    """
    Return all subcategories of Accessories with product count and first product image.
    """
    try:
        parent = Category.objects.get(slug="accessories")
    except Category.DoesNotExist:
        return Response({"detail": "Accessories category not found"}, status=404)

    children = Category.objects.filter(parent=parent)
    serializer = CategoryWithProductsSerializer(children, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def parts_children(request):
    try:
        parent = Category.objects.get(slug="parts")
    except Category.DoesNotExist:
        return Response({"detail": "Parts category not found"}, status=404)

    children = Category.objects.filter(parent=parent)
    serializer = CategoryWithProductsSerializer(children, many=True)
    return Response(serializer.data)

# ------------------------------
# Public Parts Admin List API
# ------------------------------
@api_view(['GET'])
def public_parts_admin_list(request):
    """
    Returns all admin-uploaded products (PartsAdmin) without auth, paginated
    Supports filters: category (parent + children), min_price, max_price, ordering
    """
    parts = PartsAdmin.objects.all()

    # --- Filter by category (including subcategories) ---
    category_slug = request.query_params.get("new_category")
    if category_slug and category_slug.lower() != "all":
        category_obj = Category.objects.filter(slug=category_slug).first()
        if category_obj:
            descendants = category_obj.children.all()  # direct children
            descendant_ids = list(descendants.values_list('id', flat=True))
            descendant_ids.append(category_obj.id)
            parts = parts.filter(new_category__id__in=descendant_ids)
        else:
            parts = parts.none()

    # --- Price filtering ---
    min_price = request.query_params.get("min_price")
    max_price = request.query_params.get("max_price")
    if min_price:
        parts = parts.filter(price__gte=min_price)
    if max_price:
        parts = parts.filter(price__lte=max_price)

    # --- Sorting ---
    ordering = request.query_params.get("ordering")
    if ordering:
        parts = parts.order_by(ordering)
    else:
        parts = parts.order_by("id")

    # --- Pagination ---
    paginator = PageNumberPagination()
    paginator.page_size = int(request.query_params.get("page_size", 20))
    result_page = paginator.paginate_queryset(parts, request)
    serializer = PartsAdminSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)
