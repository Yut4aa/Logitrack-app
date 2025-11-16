from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Vehiculo, Documento, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user_type', 'vehiculo_asignado', 'rut', 'nombre_empresa']  # CAMPOS AGREGADOS

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    # NUEVOS CAMPOS PARA EL REGISTRO
    rut = serializers.CharField(write_only=True, required=False, allow_blank=True)
    nombre_empresa = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'email', 'profile', 'rut', 'nombre_empresa']  # CAMPOS AGREGADOS
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Extraer los nuevos campos
        rut = validated_data.pop('rut', '')
        nombre_empresa = validated_data.pop('nombre_empresa', '')
        
        # Crear el usuario
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            password=validated_data['password']
        )
        
        # Crear perfil automáticamente como empresa con los nuevos campos
        UserProfile.objects.create(
            user=user, 
            user_type='empresa',
            rut=rut,
            nombre_empresa=nombre_empresa
        )
        return user

class VehiculoSerializer(serializers.ModelSerializer):
    documentos_count = serializers.SerializerMethodField()
    creado_por = serializers.ReadOnlyField(source='creado_por.username')

    class Meta:
        model = Vehiculo
        fields = ['patente', 'modelo', 'conductor_nombre', 'email_camionero', 'creado_en', 'documentos_count', 'creado_por']

    def get_documentos_count(self, obj):
        return obj.documentos.count()

class DocumentoSerializer(serializers.ModelSerializer):
    vehiculo = serializers.SlugRelatedField(
        slug_field='patente', 
        queryset=Vehiculo.objects.all()
    )
    subido_por = serializers.ReadOnlyField(source='subido_por.username')
    
    class Meta:
        model = Documento
        fields = ['id', 'vehiculo', 'tipo', 'fecha_subida', 'archivo', 'subido_por']
        read_only_fields = ['fecha_subida']