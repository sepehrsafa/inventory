from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import ItemViewSet, ShipmentViewSet, index

app_name='dashboard'

router = DefaultRouter()
router.register(r'items', ItemViewSet, basename='item')
router.register(r'shipments', ShipmentViewSet, basename='shipment')

urlpatterns = [
    path('', index, name='index'),
    path('api/', include((router.urls, 'api'))),
]



