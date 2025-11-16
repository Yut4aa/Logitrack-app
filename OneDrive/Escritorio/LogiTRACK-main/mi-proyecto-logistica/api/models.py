from django.db import models
from django.contrib.auth.models import User 
from cloudinary_storage.storage import MediaCloudinaryStorage
import secrets
import string

class UserProfile(models.Model):
    USER_TYPE_CHOICES = [
        ('empresa', 'Empresa'),
        ('camionero', 'Camionero'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='empresa')
    vehiculo_asignado = models.ForeignKey('Vehiculo', on_delete=models.SET_NULL, null=True, blank=True)
    # NUEVOS CAMPOS
    rut = models.CharField(max_length=20, blank=True, null=True)
    nombre_empresa = models.CharField(max_length=200, blank=True, null=True)

class Vehiculo(models.Model):
    patente = models.CharField(max_length=10, unique=True, primary_key=True)
    modelo = models.CharField(max_length=100)
    conductor_nombre = models.CharField(max_length=200)
    email_camionero = models.EmailField(null=True, blank=True)
    
    # Clave: Lo enlazamos al usuario que lo creó
    creado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.patente

    def generar_password_aleatoria(self):
        alphabet = string.ascii_letters + string.digits
        return ''.join(secrets.choice(alphabet) for i in range(8))

class Documento(models.Model):
    TIPO_DOCUMENTO = [
        ('Factura', 'Factura'),
        ('Devolucion', 'Devolución'),  # CAMBIADO: Sin acento en el valor
    ]

    vehiculo = models.ForeignKey(Vehiculo, on_delete=models.CASCADE, related_name='documentos')
    tipo = models.CharField(max_length=20, choices=TIPO_DOCUMENTO)
    fecha_subida = models.DateTimeField(auto_now_add=True)
    archivo = models.FileField(
        upload_to='documentos/',
        storage=MediaCloudinaryStorage()
    ) 
    subido_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.tipo} para {self.vehiculo.patente} el {self.fecha_subida.strftime('%Y-%m-%d')}"