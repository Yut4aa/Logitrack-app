# api/views.py

from rest_framework import viewsets, permissions, generics, filters, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Vehiculo, Documento, UserProfile
from .serializers import UserSerializer, VehiculoSerializer, DocumentoSerializer
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from rest_framework.decorators import api_view, permission_classes
import secrets
import string
from django_filters.rest_framework import DjangoFilterBackend

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_request(request):
    email = request.data.get('email')
    
    if not email:
        return Response({'error': 'El email es requerido'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        users = User.objects.filter(email=email)
        
        if not users.exists():
            return Response({
                'message': 'Si el email existe, se ha enviado un enlace de recuperación'
            })
        
        user = users.first()
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        frontend_url = 'http://127.0.0.1:5500'
        reset_link = f"{frontend_url}/reset-password.html?uid={uid}&token={token}"
        
        try:
            from django.template.loader import render_to_string
            from django.utils.html import strip_tags
            
            subject = 'Restablecer Contraseña - LogiTrack'
            
            html_message = render_to_string('email/password_reset.html', {
                'user_name': user.username,
                'reset_link': reset_link,
            })
            
            plain_message = strip_tags(html_message)
            
            send_mail(
                subject,
                plain_message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                html_message=html_message,
                fail_silently=False,
            )
            
            print(f"Email HTML enviado exitosamente a: {user.email}")
            print(f"Enlace enviado: {reset_link}")
            
        except Exception as email_error:
            print(f"Error enviando email HTML: {email_error}")
            try:
                subject = 'Restablecer Contraseña - LogiTrack'
                message = f'''
Hola {user.username},

Has solicitado restablecer tu contraseña en LogiTrack.
Haz clic en el siguiente enlace para crear una nueva contraseña:

{reset_link}

Este enlace expirará en 24 horas.

Si no solicitaste este cambio, ignora este mensaje.

Saludos,
El equipo de LogiTrack
'''
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )
                print(f"Email de texto plano enviado a: {user.email}")
            except Exception as fallback_error:
                print(f"Error critico enviando email: {fallback_error}")
                return Response({
                    'error': 'Error al enviar el email. Por favor contacta al administrador.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({
            'message': 'Se ha enviado un enlace de recuperación a tu email'
        })
        
    except Exception as e:
        print(f"Error en password_reset_request: {e}")
        return Response({
            'message': 'Error en el servidor. Por favor intenta más tarde.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_confirm(request):
    uid = request.data.get('uid')
    token = request.data.get('token')
    new_password = request.data.get('new_password')
    
    if not all([uid, token, new_password]):
        return Response({'error': 'Todos los campos son requeridos'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
        
        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            
            try:
                subject = 'Contraseña Actualizada - LogiTrack'
                user_name = user.username
                
                message = f'''
Hola {user_name},

Tu contraseña en LogiTrack ha sido actualizada exitosamente.

Si no realizaste este cambio, por contacta inmediatamente al administrador.

Saludos,
El equipo de LogiTrack
'''
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )
                print(f"Email de confirmación enviado a: {user.email}")
            except Exception as email_error:
                print(f"Error enviando email de confirmación: {email_error}")
            
            return Response({'message': 'Contraseña actualizada correctamente'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Token inválido o expirado'}, status=status.HTTP_400_BAD_REQUEST)
            
    except (User.DoesNotExist, ValueError, TypeError):
        return Response({'error': 'Enlace inválido'}, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class CustomLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        try:
            user_profile = UserProfile.objects.get(user=user)
            user_type = user_profile.user_type
            vehiculo_asignado = user_profile.vehiculo_asignado.patente if user_profile.vehiculo_asignado else None
        except UserProfile.DoesNotExist:
            user_type = 'empresa'
            vehiculo_asignado = None
        
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'fullname': user.first_name,
            'user_type': user_type,
            'vehiculo_asignado': vehiculo_asignado
        })

class VehiculoViewSet(viewsets.ModelViewSet):
    queryset = Vehiculo.objects.all() 
    serializer_class = VehiculoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            user_profile = UserProfile.objects.get(user=self.request.user)
            if user_profile.user_type == 'camionero':
                return Vehiculo.objects.filter(patente=user_profile.vehiculo_asignado.patente)
            else:
                return Vehiculo.objects.filter(creado_por=self.request.user)
        except UserProfile.DoesNotExist:
            return Vehiculo.objects.filter(creado_por=self.request.user)

    def perform_create(self, serializer):
        vehiculo = serializer.save(creado_por=self.request.user)
        
        if vehiculo.email_camionero:
            self.crear_usuario_camionero(vehiculo)

    def crear_usuario_camionero(self, vehiculo):
        try:
            base_username = f"camionero_{vehiculo.patente.lower()}"
            username = base_username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}_{counter}"
                counter += 1
            
            alphabet = string.ascii_letters + string.digits
            password = ''.join(secrets.choice(alphabet) for i in range(8))
            
            user = User.objects.create_user(
                username=username,
                email=vehiculo.email_camionero,
                first_name=f"Conductor {vehiculo.patente}",
                password=password
            )
            
            UserProfile.objects.create(
                user=user,
                user_type='camionero',
                vehiculo_asignado=vehiculo
            )
            
            self.enviar_credenciales_camionero(vehiculo, username, password)
            
        except Exception as e:
            print(f"Error creando usuario camionero: {e}")

    def enviar_credenciales_camionero(self, vehiculo, username, password):
        try:
            subject = 'Credenciales de Acceso - LogiTrack Camionero'
            
            message = f'''
Hola,

Se te ha asignado el camión {vehiculo.patente} ({vehiculo.modelo}) en el sistema LogiTrack.

Tus credenciales de acceso son:
Usuario: {username}
Contraseña: {password}

Puedes acceder al sistema en: http://127.0.0.1:5500/login.html

Una vez dentro, podrás:
- Subir documentos para tu camión asignado
- Generar etiquetas QR
- Gestionar tu cuenta

Saludos,
El equipo de LogiTrack
'''
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [vehiculo.email_camionero],
                fail_silently=False,
            )
            print(f"Credenciales enviadas a: {vehiculo.email_camionero}")
            
        except Exception as e:
            print(f"Error enviando credenciales: {e}")

class DocumentoViewSet(viewsets.ModelViewSet):
    queryset = Documento.objects.all()
    serializer_class = DocumentoSerializer
    permission_classes = [permissions.IsAuthenticated]

    parser_classes = [MultiPartParser, FormParser]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['vehiculo__patente']
    filterset_fields = ['vehiculo__patente']

    def get_queryset(self):
        # Obtener parámetros de filtro
        vehiculo_patente = self.request.query_params.get('vehiculo', None)
        
        try:
            user_profile = UserProfile.objects.get(user=self.request.user)
            if user_profile.user_type == 'camionero':
                # Camioneros solo ven documentos de su vehículo asignado
                queryset = Documento.objects.filter(vehiculo=user_profile.vehiculo_asignado)
            else:
                # Empresas ven TODOS los documentos de sus vehículos
                # (no solo los que ellos subieron, sino también los de los camioneros)
                vehiculos_empresa = Vehiculo.objects.filter(creado_por=self.request.user)
                queryset = Documento.objects.filter(vehiculo__in=vehiculos_empresa)
                
                # Si se especifica un vehículo, filtrar por él
                if vehiculo_patente:
                    queryset = queryset.filter(vehiculo__patente=vehiculo_patente)
                    
        except UserProfile.DoesNotExist:
            # Usuario sin perfil (empresa por defecto)
            vehiculos_empresa = Vehiculo.objects.filter(creado_por=self.request.user)
            queryset = Documento.objects.filter(vehiculo__in=vehiculos_empresa)
            if vehiculo_patente:
                queryset = queryset.filter(vehiculo__patente=vehiculo_patente)
        
        return queryset
        
    def perform_create(self, serializer):
        try:
            user_profile = UserProfile.objects.get(user=self.request.user)
            if user_profile.user_type == 'camionero':
                serializer.save(
                    subido_por=self.request.user,
                    vehiculo=user_profile.vehiculo_asignado
                )
            else:
                serializer.save(subido_por=self.request.user)
        except UserProfile.DoesNotExist:
            serializer.save(subido_por=self.request.user)

    def perform_destroy(self, instance):
        instance.archivo.delete(save=False)
        instance.delete()