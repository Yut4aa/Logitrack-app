from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import UserProfile, Vehiculo, Documento

# Registrar UserProfile inline con User
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Perfil'

# Extender el UserAdmin para incluir UserProfile
class CustomUserAdmin(UserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_rut', 'get_nombre_empresa', 'is_staff')
    
    def get_rut(self, obj):
        try:
            return obj.profile.rut
        except UserProfile.DoesNotExist:
            return "-"
    get_rut.short_description = 'RUT'
    
    def get_nombre_empresa(self, obj):
        try:
            return obj.profile.nombre_empresa
        except UserProfile.DoesNotExist:
            return "-"
    get_nombre_empresa.short_description = 'Nombre Empresa'

# Registrar los modelos
admin.site.register(Vehiculo)
admin.site.register(Documento)

# Re-registrar User con el admin personalizado
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# También registrar UserProfile por separado por si quieres verlo individualmente
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'user_type', 'rut', 'nombre_empresa', 'vehiculo_asignado')
    list_filter = ('user_type',)
    search_fields = ('user__username', 'rut', 'nombre_empresa')