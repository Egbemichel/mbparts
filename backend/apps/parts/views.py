from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import viewsets, filters, status
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend

from .models import Part
from .serializers import PartSerializer, PublicPartSerializer

from .models import PartsAdmin
from .serializers import PartsAdminSerializer
from rest_framework.permissions import IsAuthenticated  # restrict to logged-in admin


class PartsAdminViewSet(viewsets.ModelViewSet):
    queryset = PartsAdmin.objects.all().order_by("id")
    serializer_class = PartsAdminSerializer
    permission_classes = [IsAuthenticated]

class PartViewSet(viewsets.ModelViewSet):
    queryset = Part.objects.all().select_related("product")
    serializer_class = PartSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    filterset_fields = {
        "product__category": ["exact"],
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



class FitmentPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


# Synonym maps
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
    """
    Normalize a VIN field using predefined synonyms.
    Returns the normalized key (e.g. 'sedan') or the raw value if no match.
    """
    if not value:
        return None
    val = value.lower()
    for key, synonyms in mapping.items():
        if any(s in val for s in synonyms):
            return key
    return val  # fallback to raw

def get_compatible_parts(vehicle_info):
    """
    Returns a queryset of parts compatible with the vehicle_info object,
    progressively relaxing filters if too strict.
    """
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

    # --- Tiered Filtering ---
    # 1. Try with body_class + drive_type
    qs = base_qs
    if body_class:
        qs = qs.filter(body_class__icontains=body_class)
    if drive_type:
        qs = qs.filter(drive_type__icontains=drive_type)
    if qs.exists():
        return qs

    # 2. Retry without drive_type
    qs = base_qs
    if body_class:
        qs = qs.filter(body_class__icontains=body_class)
    if qs.exists():
        return qs

    # 3. Retry without body_class
    qs = base_qs
    if drive_type:
        qs = qs.filter(drive_type__icontains=drive_type)
    if qs.exists():
        return qs

    # 4. Fallback: only make/model/year
    return base_qs
class FitmentView(APIView):
    """
    Accepts full vehicleInfo JSON from frontend and returns grouped parts
    with pagination per category (using PartsAdmin.product__category).
    """
    pagination_class = FitmentPagination

    def post(self, request):
        vehicle_info = request.data

        if not vehicle_info.get("vin"):
            return Response({"error": "VIN is required"}, status=status.HTTP_400_BAD_REQUEST)

        compatible_parts = get_compatible_parts(vehicle_info).select_related("product")

        # group by PartsAdmin.category instead of Part.category
        categories = compatible_parts.values_list("product__category", flat=True).distinct()

        grouped_results = {}
        paginator = self.pagination_class()

        for category in categories:
            parts_in_category = compatible_parts.filter(product__category=category)

            # Handle pagination per category using query params like ?page_engine=2
            page_param = f"page_{category.lower().replace(' ', '_')}"
            page_number = request.query_params.get(page_param, 1)

            # Copy query params to make them mutable for pagination
            mutable_get = request._request.GET.copy()
            mutable_get["page"] = page_number
            request._request.GET = mutable_get

            page = paginator.paginate_queryset(parts_in_category, request)
            serializer = PartSerializer(page, many=True)

            grouped_results[category] = {
                "count": parts_in_category.count(),
                "next": paginator.get_next_link(),
                "previous": paginator.get_previous_link(),
                "results": serializer.data,
            }

        return Response(grouped_results)


@api_view(['GET'])
def public_parts_admin_list(request):
    """
    Returns all admin-uploaded products (PartsAdmin) without auth
    """
    parts = PartsAdmin.objects.all()  # no filtering, all products
    serializer = PartsAdminSerializer(parts, many=True)
    return Response(serializer.data)
