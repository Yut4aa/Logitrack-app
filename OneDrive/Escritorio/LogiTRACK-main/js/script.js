/**
 * js/script.js
 * Script principal de la app - MODIFICADO PARA TIPOS DE USUARIO
 */

// Variables globales
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
let currentDate = new Date();
let currentUserType = 'empresa';
let assignedTruck = null;

/**
 * Muestra una seccion de la app y oculta las demas.
 */
function showSection(sectionId) {
    console.log('Mostrando sección:', sectionId, 'Tipo usuario:', currentUserType);
    
    // Para camioneros, solo permitir ciertas secciones
    if (currentUserType === 'camionero' && (sectionId === 'vehicles')) {
        alert('No tienes permisos para acceder a esta sección.');
        return;
    }

    const trucks = JSON.parse(localStorage.getItem('logitrack_trucks')) || [];
    
    if (trucks.length === 0 && (sectionId === 'upload' || sectionId === 'label-maker') && currentUserType === 'empresa') {
        alert('Debe agregar al menos un camion para usar esta seccion.');
        showSection('vehicles'); 
        return;
    }

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }

    setTimeout(() => {
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }, 200);
}

/**
 * Cierra la sesion y redirige al login.
 */
function logout() {
    localStorage.removeItem('logitrack_session');
    window.location.href = 'login.html';
}

/**
 * Habilita o deshabilita los botones de la barra lateral.
 */
function updateSidebarButtons() {
    const trucks = JSON.parse(localStorage.getItem('logitrack_trucks')) || [];
    const uploadBtn = document.getElementById('btn-upload');
    const labelBtn = document.getElementById('btn-label-maker');
    const vehiclesBtn = document.getElementById('btn-vehicles');
    
    console.log('Actualizando botones sidebar - Tipo:', currentUserType);
    
    // Mostrar/ocultar elementos según tipo de usuario
    const empresaElements = document.querySelectorAll('.empresa-only');
    const camioneroElements = document.querySelectorAll('.camionero-only');
    
    if (currentUserType === 'empresa') {
        empresaElements.forEach(el => el.style.display = 'block');
        camioneroElements.forEach(el => el.style.display = 'none');
        
        if (trucks.length > 0) {
            if (uploadBtn) uploadBtn.disabled = false;
            if (labelBtn) labelBtn.disabled = false;
        } else {
            if (uploadBtn) uploadBtn.disabled = true;
            if (labelBtn) labelBtn.disabled = true;
        }
        if (vehiclesBtn) vehiclesBtn.disabled = false;
    } else {
        // Camionero - mostrar todo excepto vehículos
        empresaElements.forEach(el => el.style.display = 'none');
        camioneroElements.forEach(el => el.style.display = 'block');
        
        // Para camioneros, siempre habilitar upload y label-maker
        if (uploadBtn) {
            uploadBtn.disabled = false;
            uploadBtn.style.display = 'flex';
        }
        if (labelBtn) {
            labelBtn.disabled = false;
            labelBtn.style.display = 'flex';
        }
        if (vehiclesBtn) {
            vehiclesBtn.disabled = true;
            vehiclesBtn.style.display = 'none';
        }
    }
    
    return trucks.length > 0 || currentUserType === 'camionero';
}

/**
 * Obtiene el nombre del conductor desde los camiones guardados
 */
function getDriverName(plate) {
    const trucks = JSON.parse(localStorage.getItem('logitrack_trucks')) || [];
    const truck = trucks.find(t => t.patente === plate);
    return truck ? truck.conductor_nombre : 'Conductor';
}

/**
 * Muestra el mensaje de bienvenida en el sidebar.
 */
function displayWelcomeMessage() {
    const session = JSON.parse(localStorage.getItem('logitrack_session'));
    const welcomeEl = document.getElementById('sidebar-welcome');
    const badgeEl = document.getElementById('user-type-badge');

    if (!session || !welcomeEl) {
        alert('Debe iniciar sesion para acceder a la aplicacion.');
        window.location.href = 'login.html';
        return null;
    }
    
    let displayName = session.fullname || session.username || 'Usuario';
    
    // Obtener tipo de usuario de la sesión
    currentUserType = session.user_type || 'empresa';
    assignedTruck = session.vehiculo_asignado || null;
    
    console.log('Sesión cargada:', { 
        user_type: currentUserType, 
        assigned_truck: assignedTruck,
        display_name: displayName 
    });
    
    // Para camioneros, usar el nombre del conductor
    if (currentUserType === 'camionero' && assignedTruck) {
        const driverName = getDriverName(assignedTruck);
        displayName = driverName;
    } else {
        // Para empresas, usar el primer nombre
        const firstName = displayName.split(' ')[0];
        displayName = firstName;
    }
    
    welcomeEl.innerHTML = 'Hola, <strong>' + displayName + '</strong>';
    
    // Mostrar badge según tipo de usuario
    if (badgeEl) {
        if (currentUserType === 'empresa') {
            badgeEl.textContent = 'Empresa';
            badgeEl.className = 'user-type-badge user-type-empresa';
        } else {
            badgeEl.textContent = 'Camionero';
            badgeEl.className = 'user-type-badge user-type-camionero';
        }
    }
    
    // Mostrar información del camión asignado para camioneros
    if (currentUserType === 'camionero' && assignedTruck) {
        const assignedTruckEl = document.getElementById('assigned-truck-plate');
        if (assignedTruckEl) {
            assignedTruckEl.textContent = assignedTruck;
        }
        const assignedTruckInfo = document.getElementById('assigned-truck-info');
        const truckSelectGroup = document.getElementById('truck-select-group');
        if (assignedTruckInfo) assignedTruckInfo.style.display = 'block';
        if (truckSelectGroup) truckSelectGroup.style.display = 'none';
        
        const uploadTitle = document.getElementById('upload-title');
        if (uploadTitle) {
            uploadTitle.textContent = 'Subir Documento - ' + assignedTruck;
        }
    }
    
    return session;
}

// Inicializacion principal
document.addEventListener('DOMContentLoaded', function() {
    
    const session = displayWelcomeMessage();
    if (!session) return;

    AOS.init({
        duration: 800,
        once: true
    });

    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Cargar datos según tipo de usuario
    if (currentUserType === 'empresa') {
        if (typeof renderTrucksList === 'function') {
            renderTrucksList();
        }
        if (typeof populateTruckSelectForUpload === 'function') {
            populateTruckSelectForUpload();
        }
    } else {
        // Para camioneros, cargar la lista de camiones para obtener el nombre del conductor
        if (typeof renderTrucksList === 'function') {
            renderTrucksList();
        }
        // Inicializar formulario de upload para camioneros
        if (typeof populateTruckSelectForUpload === 'function') {
            populateTruckSelectForUpload();
        }
    }
    
    const hasTrucks = updateSidebarButtons();
    
    // Mostrar sección inicial según tipo de usuario
    if (currentUserType === 'camionero') {
        console.log('Usuario camionero - mostrando sección upload');
        showSection('upload');
    } else {
        if (!hasTrucks) {
            showSection('vehicles');
        } else {
            showSection('upload'); 
        }
    }
});