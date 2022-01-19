from django.db import IntegrityError, transaction
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Item, Shipment, ShipmentThrough
from .serializer import ItemSerializer, ShipmentSerializer, ItemAddSerializer

def index(request):
    """
    Resturns Base HTML File
    """
    return render(request, template_name="index.html")

class ItemViewSet(viewsets.ViewSet):
    """
    A ViewSet for listing or retrieving, creating, deleting, and updating Item Model.
    """
    
    def list(self, request):
        """
        Returns a list of ALL available Items in database
        """
        queryset = Item.objects.all()
        serializer = ItemSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def retrieve_for_shipment(self, request):
        """
        Returns a list of available Items ready for shipment.
        To be ready for shipment the item quantity should be greater than 0
        """
        queryset = Item.objects.filter(quantity__gt=0)
        serializer = ItemSerializer(queryset,many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """
        Returns the item based on primary key
        """
        queryset = Item.objects.all()
        item = get_object_or_404(queryset, pk=pk)
        serializer = ItemSerializer(item)
        return Response(serializer.data)
    
    def create(self, request):
        """
        Creates a new Item instance in the database
        """
        item = ItemAddSerializer(data=request.data, context={'request': request})
        if item.is_valid():
            item.save()
            return Response({"success": True, 'errors': {}})
        return Response({"success": False, 'errors': item.errors})

    def update(self, request, pk=None):
        """
        Updates an Item instance based on the provided primary key
        """
        queryset = Item.objects.all()
        item = get_object_or_404(queryset, pk=pk)
        item = ItemAddSerializer(item,request.data)
        if item.is_valid():
            item.save()
            return Response({"success": True, 'errors': {}})
        return Response({"success": False, 'errors': item.errors})

    def destroy(self, request, pk=None):
        """
        Deletes an Item instance based on the provided primary key
        """
        queryset = Item.objects.all()
        item = get_object_or_404(queryset, pk=pk)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ShipmentViewSet(viewsets.ViewSet):
    """
    A ViewSet for listing or retrieving, creating, deleting, and updating Shipment Model.
    """

    def list(self, request):
        """
        Returns a list of ALL available Shipment instances in database
        """
        queryset = Shipment.objects.all()
        serializer = ShipmentSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """
        Returns an shipment instance based on primary key
        """
        queryset = Shipment.objects.all()
        shipment = get_object_or_404(queryset, pk=pk)
        serializer = ShipmentSerializer(shipment)
        return Response(serializer.data)
        
    @transaction.atomic
    def create(self, request):
        """
        Creates a new Shipment instance in the database
        Note: if any error happens, all database transactions will be cancelled.
        if any changes where made, they will reverse back.
        """        
        shipment = ShipmentSerializer(data=request.data, context={'request': request})
        if shipment.is_valid():
            shipment.save()
            return Response({"success": True, 'errors': {}})
        return Response({"success": False, 'errors': shipment.errors})