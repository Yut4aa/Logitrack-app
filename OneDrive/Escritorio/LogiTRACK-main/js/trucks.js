/**
 * js/trucks.js
 * VERSIÓN API: Maneja el CRUD de vehículos contra la API de Django.
 * MODIFICADO: Incluye campo email_camionero
 */

const API_URL = 'http://127.0.0.1:8000/api';

// --- Funciones de Sesión y Headers ---
function getSession() {
    const sessionData = localStorage.getItem('logitrack_session');
    if (!sessionData) {
        console.error('No hay sesión guardada. Redirigiendo a login.');
        window.location.href = 'login.html';
        return null;
    }
    const session = JSON.parse(sessionData);
    if (!session.token) {
        console.error('La sesión no tiene token. Redirigiendo a login.');
        window.location.href = 'login.html';
        return null;
    }
    return session;
}

function getAuthHeaders() {
    const session = getSession();
    if (!session) return null; 
    return {
        'Content-Type': 'application/json',
        'Authorization': `Token ${session.token}`
    };
}

/**
 * Renderiza la lista de camiones desde la API.
 */
async function renderTrucksList() {
    const trucksContainer = document.getElementById('trucks-container');
    if (!trucksContainer) return;
    
    const headers = getAuthHeaders();
    if (!headers) return; 

    try {
        const response = await fetch(`${API_URL}/vehiculos/`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                console.error('Autenticación fallida. Redirigiendo a login.');
                window.location.href = 'login.html';
                return;
            }
            throw new Error('Error al cargar los camiones');
        }

        const trucks = await response.json(); 
        
        localStorage.setItem('logitrack_trucks', JSON.stringify(trucks));
        
        if (trucks.length === 0) {
            trucksContainer.innerHTML = `<div class="card"><div class="empty-state"><i data-feather="truck" width="48" height="48"></i><p>No hay camiones registrados</p></div></div>`;
        } else {
            trucksContainer.innerHTML = trucks.map(truck => `
                <div class="card" data-aos="fade-up"> 
                    <div class="truck-card-info" onclick="viewTruckDocuments('${truck.patente}')" title="Clic para ver detalles">
                        <div class="truck-header"><h4>${truck.patente}</h4></div>
                        <div class="truck-info">
                            <p><strong>Modelo:</strong> ${truck.modelo}</p>
                            <p><strong>Conductor:</strong> ${truck.conductor_nombre}</p>
                            ${truck.email_camionero ? `<p><strong>Email Camionero:</strong> ${truck.email_camionero}</p>` : ''}
                            <p><strong>Documentos:</strong> <span id="doc-count-${truck.patente}">${truck.documentos_count}</span></p>
                        </div>
                    </div>
                    <div class="truck-card-actions">
                        <button class="qr-btn" onclick="generateVehicleQR('${truck.patente}', event)">
                            <i data-feather="maximize-2" width="16" height="16"></i> Generar QR
                        </button>
                        <button class="delete-truck" onclick="deleteTruck('${truck.patente}', event)">
                            <i data-feather="trash-2" width="16" height="16"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
        
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
    } catch (error) {
        console.error('Error:', error);
        trucksContainer.innerHTML = `<div class="card"><div class="empty-state"><p>Error al cargar camiones.</p></div></div>`;
    }
}

/**
 * Maneja el evento de submit del formulario 'add-truck-form'.
 */
async function addTruck(event) {
    event.preventDefault();
    const submitButton = event.target.querySelector('button[type="submit"]');
    
    const plateInput = document.getElementById('truck-plate');
    const modelInput = document.getElementById('truck-model');
    const driverInput = document.getElementById('truck-driver');
    const emailInput = document.getElementById('truck-driver-email');
    
    const plate = plateInput.value.trim().toUpperCase();
    const model = modelInput.value.trim();
    const driver = driverInput.value.trim();
    const email = emailInput.value.trim();
    
    if (!plate || !model || !driver) {
        alert('Los campos Patente, Modelo y Conductor son obligatorios.');
        return;
    }
    
    const headers = getAuthHeaders();
    if (!headers) return;
    
    submitButton.disabled = true;
    submitButton.textContent = 'Agregando...';

    try {
        const requestBody = {
            patente: plate,
            modelo: model,
            conductor_nombre: driver
        };
        
        if (email) {
            requestBody.email_camionero = email;
        }
        
        const response = await fetch(`${API_URL}/vehiculos/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (response.status === 201) { 
            plateInput.value = '';
            modelInput.value = '';
            driverInput.value = '';
            emailInput.value = '';
            
            await renderTrucksList();
            
            if (typeof populateTruckSelectForUpload === 'function') {
                populateTruckSelectForUpload();
            }
            
            if (typeof updateSidebarButtons === 'function') {
                updateSidebarButtons();
            }
            
            if (email) {
                alert('Camión agregado correctamente. Se ha enviado un email al camionero con sus credenciales.');
            } else {
                alert('Camión agregado correctamente.');
            }
            
        } else if (response.status === 400) {
            const errorData = await response.json();
            alert(`Error: ${errorData.patente ? errorData.patente[0] : 'Error de validación'}`);
        } else {
            throw new Error('Error del servidor');
        }

    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo conectar con el servidor.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Agregar Camión';
    }
}

/**
 * Elimina un camión de la API.
 */
async function deleteTruck(plate, event) {
    if (event) event.stopPropagation();

    if (confirm(`¿Estás seguro de que quieres eliminar el camión ${plate}?`)) {
        
        const headers = getAuthHeaders();
        if (!headers) return;

        try {
            const response = await fetch(`${API_URL}/vehiculos/${plate}/`, {
                method: 'DELETE',
                headers: headers
            });

            if (response.status === 204) { 
                alert('Camión eliminado.');
                await renderTrucksList();
                if (typeof populateTruckSelectForUpload === 'function') {
                    populateTruckSelectForUpload();
                }
                if (typeof updateSidebarButtons === 'function') {
                    updateSidebarButtons();
                }
            } else {
                throw new Error('No se pudo eliminar el camión');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al intentar eliminar el camión.');
        }
    }
}

function viewTruckDocuments(plate) {
    window.location.href = `vehiculo.html?patente=${plate}`;
}

// --- Funciones del Modal de QR ---
function generateVehicleQR(plate, event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('qr-modal');
    const qrCodeContainer = document.getElementById('qr-modal-code');
    const title = document.getElementById('qr-modal-title');
    const downloadLink = document.getElementById('qr-modal-download');
    if (!modal || !qrCodeContainer || !title || !downloadLink) return;
    const vehicleURL = `${window.location.origin}${window.location.pathname.replace('index.html', '')}vehiculo.html?patente=${encodeURIComponent(plate)}`;
    title.textContent = `QR del Vehículo: ${plate}`;
    qrCodeContainer.innerHTML = ""; 
    new QRCode(qrCodeContainer, { text: vehicleURL, width: 250, height: 250 });
    setTimeout(() => {
        const img = qrCodeContainer.querySelector('img');
        if (img) {
            downloadLink.href = img.src;
            downloadLink.download = `QR_${plate}.png`;
        }
    }, 100);
    modal.style.display = 'flex';
}

function closeQrModal() {
    const modal = document.getElementById('qr-modal');
    if (modal) modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const addTruckForm = document.getElementById('add-truck-form');
    if (addTruckForm) {
        addTruckForm.addEventListener('submit', addTruck);
    }
});