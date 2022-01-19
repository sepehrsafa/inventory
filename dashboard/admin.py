from django.contrib import admin

from .models import Item, Shipment, ShipmentThrough

admin.site.register(Item)
admin.site.register(Shipment)
admin.site.register(ShipmentThrough)