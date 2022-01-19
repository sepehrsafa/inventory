from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator

class Item(models.Model):
    """
    Item Model provides the ability to store store information
    for an Item available in the inventory.
    """
    name = models.CharField(
        verbose_name="Item's Name",
        max_length=200,
    )
    description = models.TextField(
        verbose_name="Description (Optional)",
        blank=True,
        null=True
    )
    quantity = models.IntegerField(
        verbose_name="Quantity",
        validators=[MinValueValidator(0)]
    )
    price = models.DecimalField(
        verbose_name="Price",
        decimal_places=2,
        max_digits=10,
        validators=[MinValueValidator(Decimal('0.00'))]
    )

    class Meta:
        db_table = "item"

    def __str__(self):
        return f"Name: {self.name}, Price: {self.price}, Quantity: {self.quantity}"

class Shipment(models.Model):
    """
    Shipment Model provides the ability to store store information for a Shipment
    """

    destination_address = models.CharField(
        verbose_name="Destination Address",
        max_length=200
    )
    items = models.ManyToManyField(
        to='Item',
        related_name="shipments",
        verbose_name="Items",
        through='ShipmentThrough'
    )

    class Meta:
        db_table = "shipment"

    def __str__(self):
        return f"Address: {self.destination_address} - Items: {self.items.all()}"

class ShipmentThrough(models.Model):
    """
    ShipmentThrough Model acts as a through model which
    enables the items field in Shipment Model to select
    how many of that item needs to be shipped.
    """

    shipment = models.ForeignKey(
        to='Shipment',
        on_delete=models.CASCADE,
        verbose_name="shipment"
    )
    item = models.ForeignKey(
        to='Item',
        on_delete=models.CASCADE,
        verbose_name="item"

    )
    quantity = models.IntegerField(
        verbose_name="Quantity",
        validators=[MinValueValidator(1)]
    )

    class Meta:
        db_table = "shipment_through"
    
    def __str__(self):
        return f"{self.shipment}, {self.item}, Quantity: {self.quantity}"