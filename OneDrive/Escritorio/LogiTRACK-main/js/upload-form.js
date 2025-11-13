/**
 * js/upload-form.js
 * VERSIÓN CORREGIDA - Modificado para tipos de usuario
 */

// --- FUNCIONES DE SESIÓN SIMPLIFICADAS ---
function getSession() {
    const sessionData = localStorage.getItem('logitrack_session');
    if (!sessionData) {
        console.error('No hay sesión guardada.');
        window.location.href = 'login.html';
        return null;
    }
    const session = JSON.parse(sessionData);
    if (!session.token) {
        console.error('La sesión no tiene token.');
        window.location.href = 'login.html';
        return null;
    }
    return session;
}

function getFormDataHeaders() {
    const session = getSession();
    if (!session) return null;

    return {
        'Authorization': `Token ${session.token}`
    };
}

/**
 * Puebla el <select> de camiones para subir documentos (solo empresas)
 */
function populateTruckSelectForUpload() {
    const truckSelect = document.getElementById('truck-plate-select');
    const submitBtn = document.getElementById('upload-submit-btn');
    if (!truckSelect) return;

    const session = getSession();
    if (!session) return;
    
    // Solo empresas pueden seleccionar camión
    if (session.user_type === 'camionero') {
        // Para camioneros, el select debe estar oculto y no requerido
        if (truckSelect) {
            truckSelect.style.display = 'none';
            truckSelect.required = false;
        }
        return;
    }

    const trucks = JSON.parse(localStorage.getItem('logitrack_trucks')) || [];
    
    truckSelect.innerHTML = '';

    if (trucks.length > 0) {
        trucks.sort((a, b) => a.patente.localeCompare(b.patente));
        
        truckSelect.appendChild(new Option('Selecciona un camión...', ''));
        trucks.forEach(truck => {
            const optionText = `${truck.patente} (${truck.conductor_nombre})`;
            truckSelect.appendChild(new Option(optionText, truck.patente));
        });
        
        truckSelect.disabled = false;
        truckSelect.required = true;
        if (submitBtn) submitBtn.disabled = false;
    } else {
        truckSelect.appendChild(new Option('Agregue un camión primero', ''));
        truckSelect.disabled = true;
        truckSelect.required = false;
        if (submitBtn) submitBtn.disabled = true;
    }
}

/**
 * Maneja el evento de submit del formulario - VERSIÓN MEJORADA
 */
async function handleUploadSubmit(event) {
    event.preventDefault();

    const submitButton = event.target.querySelector('button[type="submit"]');
    const plateSelect = document.getElementById('truck-plate-select');
    const fileInput = document.getElementById('document-file');
    const typeSelect = document.getElementById('document-type-select');
    
    const API_URL = 'http://127.0.0.1:8000/api';

    const session = getSession();
    if (!session) return;

    let plate;
    if (session.user_type === 'camionero') {
        // Camioneros usan su vehículo asignado automáticamente
        plate = session.vehiculo_asignado;
        if (!plate) {
            alert('No tienes un camión asignado.');
            return;
        }
    } else {
        // Empresas seleccionan el camión
        plate = plateSelect.value;
        if (!plate) {
            alert('Por favor, selecciona un camión.');
            return;
        }
    }

    const file = fileInput.files[0];
    const documentType = typeSelect.value;

    if (!plate || !file || !documentType) {
        alert('Por favor, complete todos los campos.');
        return;
    }
    
    submitButton.disabled = true;
    submitButton.innerHTML = '<i data-feather="loader" class="spin"></i> Subiendo...';
    if (typeof feather !== 'undefined') feather.replace();

    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('tipo', documentType);
    formData.append('vehiculo', plate);

    const headers = getFormDataHeaders();
    
    if (!headers) {
        alert('Error de sesión. Por favor, inicie sesión de nuevo.');
        submitButton.disabled = false;
        submitButton.innerHTML = '<i data-feather="upload-cloud"></i> Subir Documento';
        if (typeof feather !== 'undefined') feather.replace();
        return;
    }

    try {
        console.log('Enviando archivo:', file.name, 'Tipo:', file.type);
        console.log('Vehículo:', plate);
        
        const response = await fetch(`${API_URL}/documentos/`, {
            method: 'POST',
            headers: headers,
            body: formData
        });

        console.log('Respuesta del servidor:', response.status, response.statusText);

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            console.error('Error de API:', errorData);
            let errorMsg = 'Error al subir el archivo.';
            
            if (errorData.detail) {
                errorMsg = errorData.detail;
            } else if (errorData.vehiculo) {
                errorMsg = `Vehículo: ${errorData.vehiculo[0]}`;
            } else if (errorData.archivo) {
                errorMsg = `Archivo: ${errorData.archivo[0]}`;
            } else if (errorData.tipo) {
                errorMsg = `Tipo: ${errorData.tipo[0]}`;
            } else if (errorData.non_field_errors) {
                errorMsg = errorData.non_field_errors[0];
            }
            
            throw new Error(errorMsg);
        }

        const newDocument = await response.json();
        console.log('Documento subido correctamente:', newDocument);
        
        alert('✓ Documento subido con éxito');
        
        // Limpiar formulario
        fileInput.value = '';
        typeSelect.value = ''; 
        const fileNameDisplay = document.getElementById('file-name-display');
        if (fileNameDisplay) {
            fileNameDisplay.textContent = 'Seleccionar Archivo';
        }

    } catch (error) {
        console.error('Error completo:', error);
        alert(`Error al subir: ${error.message}`);
    
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i data-feather="upload-cloud"></i> Subir Documento';
        if (typeof feather !== 'undefined') feather.replace();
    }
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUploadSubmit);
    }
    
    // Inicializar para ambos tipos de usuario
    if (typeof populateTruckSelectForUpload === 'function') {
        populateTruckSelectForUpload();
    }
    
    const fileInput = document.getElementById('document-file');
    const fileNameDisplay = document.getElementById('file-name-display');
    
    if (fileInput && fileNameDisplay) {
        fileInput.addEventListener('change', function() {
            if (fileInput.files.length > 0) {
                fileNameDisplay.textContent = fileInput.files[0].name;
            } else {
                fileNameDisplay.textContent = 'Seleccionar Archivo';
            }
        });
    }

    if (!document.querySelector('#spin-style')) {
        const style = document.createElement('style');
        style.id = 'spin-style';
        style.textContent = `
            .spin {
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
});