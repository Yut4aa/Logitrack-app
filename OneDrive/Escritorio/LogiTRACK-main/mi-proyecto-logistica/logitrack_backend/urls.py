"""
URL configuration for logitrack_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""



# En logitrack_backend/urls.py

from django.contrib import admin
from django.urls import path, include

# --- AÑADE ESTAS 2 LÍNEAS ---
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), 
]

# --- AÑADE ESTA LÍNEA AL FINAL ---
# Esto es para que el servidor de desarrollo (runserver)
# sepa cómo manejar las URLs de los archivos subidos (ej: .../mi-factura.pdf)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)