from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError

from rest_framework import serializers

from .models import Item, Shipment, ShipmentThrough

class ItemAddSerializer(serializers.ModelSerializer):
    """
    ItemAddSerializer, allows items to be created using
    the following fields: ['id', 'name', 'quantity', 'price', 'description']
    """

    class Meta:
        model = Item
        fields = ['id', 'name', 'quantity', 'price', 'description']

class ItemSerializer(serializers.ModelSerializer):
    """
    ItemSerializer, allows items to be retrived in JSON
    the following fields: ['id', 'name', 'quantity', 'price'] will be provided
    """
    
    id = serializers.IntegerField()
    name = serializers.CharField(required=False, max_length=200, allow_blank=True)
    quantity = serializers.IntegerField(required=False)
    price = serializers.DecimalField(decimal_places=2, max_digits=10, required=False)
    description = serializers.CharField(required=False, max_length=200, allow_blank=True)
    
    class Meta:
        model = Item
        fields = ['id', 'name', 'quantity', 'price','description']

class ShipmentThroughSerializer(serializers.ModelSerializer):
    """
    ShipmentThroughSerializer, allows ShipmentThrough to be retrived in JSON
    """

    item = ItemSerializer(many=False)

    class Meta:
        model = ShipmentThrough
        fields = ['quantity', 'item']

class ShipmentSerializer(serializers.ModelSerializer):
    """
    ShipmentSerializer, allows ShipmentSerializer to be retrived in JSON and
    Shipment item to be created
    """

    shipments = ShipmentThroughSerializer(many=True,source='shipmentthrough_set')

    class Meta:
        model = Shipment
        fields = ['id','destination_address', 'shipments']

    def create(self, validated_data):
        shipmet = Shipment.objects.create(destination_address=validated_data["destination_address"])
        if not validated_data['shipmentthrough_set']:
            raise serializers.ValidationError({"detail": "Shipment MUST have an Item inside"})
        for item in validated_data['shipmentthrough_set']:
            item_obj = get_object_or_404(Item,pk=item['item']['id'])
            ShipmentThrough.objects.create(shipment=shipmet,item=item_obj,quantity=item['quantity'])
            item_obj.quantity-=item['quantity']
            try:
                item_obj.full_clean()
                item_obj.save()
            except ValidationError as e:
                raise serializers.ValidationError({"detail": f"Item {item_obj} out of stock"})
        return shipmet