from django.contrib import admin

# Register your models here.

# En api/admin.py
from django.contrib import admin
from .models import Vehiculo, Documento

admin.site.register(Vehiculo)
admin.site.register(Documento)