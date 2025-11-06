/**
 * js/trucks.js
 * Maneja la lógica de vehículos (CRUD) usando localStorage.
 * Incluye la lógica del modal de QR.
 */

// Cargar camiones desde localStorage al inicio
let trucks = JSON.parse(localStorage.getItem('logitrack_trucks')) || [];

/**
 * Renderiza la lista de camiones en el contenedor #trucks-container
 */
function renderTrucksList() {
    const trucksContainer = document.getElementById('trucks-container');
    if (!trucksContainer) return;
    
    if (trucks.length === 0) {
        trucksContainer.innerHTML = `<div class="empty-state"><i data-feather="truck" width="48" height="48"></i><p>No hay camiones registrados</p></div>`;
    } else {
        trucksContainer.innerHTML = trucks.map((truck, index) => `
            <div class="truck-card">
                <div class="truck-card-info" onclick="viewTruckDocuments('${truck.plate}')" title="Clic para ver detalles">
                    <div class="truck-header"><h4>${truck.plate}</h4></div>
                    <div class="truck-info">
                        <p><strong>Modelo:</strong> ${truck.model}</p>
                        <p><strong>Conductor:</strong> ${truck.driver}</p>
                        <p><strong>Documentos:</strong> ${getDocumentCount(truck.plate)}</p>
                    </div>
                </div>
                <div class="truck-card-actions">
                    <button class="qr-btn" onclick="generateVehicleQR('${truck.plate}', event)">
                        <i data-feather="maximize-2" width="16" height="16"></i> Generar QR
                    </button>
                    <button class="delete-truck" onclick="deleteTruck(${index}, event)">
                        <i data-feather="trash-2" width="16" height="16"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    // Re-inicializar iconos Feather
    if (typeof feather !== 'undefined') feather.replace();
}

/**
 * Cuenta cuántos documentos tiene una patente específica.
 * @param {string} plate - La patente del camión.
 * @returns {number} - El número de documentos.
 */
function getDocumentCount(plate) {
    const documents = JSON.parse(localStorage.getItem('logitrack_documents')) || {};
    let count = 0;
    for (const date in documents) {
        count += documents[date].filter(doc => doc.plate === plate).length;
    }
    return count;
}

/**
 * Guarda el array de camiones actual en localStorage.
 */
function saveTrucks() {
    localStorage.setItem('logitrack_trucks', JSON.stringify(trucks));
}

/**
 * Maneja el evento de submit del formulario 'add-truck-form'.
 */
function addTruck(event) {
    event.preventDefault();
    const submitButton = event.target.querySelector('button[type="submit"]');
    
    const plateInput = document.getElementById('truck-plate');
    const modelInput = document.getElementById('truck-model');
    const driverInput = document.getElementById('truck-driver');
    
    const plate = plateInput.value.trim().toUpperCase();
    const model = modelInput.value.trim();
    const driver = driverInput.value.trim();
    
    if (!plate || !model || !driver) {
        alert('Todos los campos son obligatorios.');
        return;
    }
    
    if (trucks.some(truck => truck.plate === plate)) {
        alert('Ya existe un camión con esta patente');
        return;
    }
    
    // --- CORRECCIÓN BUG DOBLE CLIC ---
    submitButton.disabled = true;
    submitButton.textContent = 'Agregando...';

    // Simular una pequeña demora (opcional, pero mejora la UX)
    setTimeout(() => {
        trucks.push({
            plate: plate,
            model: model,
            driver: driver,
            createdAt: new Date().toISOString()
        });
        
        saveTrucks();
        renderTrucksList();
        
        // Limpiar formulario
        plateInput.value = '';
        modelInput.value = '';
        driverInput.value = '';
        
        alert('Camión agregado correctamente');
        
        // Actualizar otras partes de la UI
        if (typeof populateTruckSelectForUpload === 'function') {
            populateTruckSelectForUpload();
        }
        if (typeof updateSidebarButtons === 'function') {
            updateSidebarButtons();
        }

        // --- CORRECCIÓN BUG DOBLE CLIC ---
        submitButton.disabled = false;
        submitButton.textContent = 'Agregar Camión';
    }, 300); // 300ms de demora
}

/**
 * Elimina un camión del array y de localStorage.
 * @param {number} index - El índice del camión a eliminar.
 * @param {Event} event - El evento de clic.
 */
function deleteTruck(index, event) {
    if (event) event.stopPropagation(); // Evitar que el clic active la tarjeta

    const plate = trucks[index].plate;
    if (confirm(`¿Estás seguro de que quieres eliminar el camión ${plate}?`)) {
        const docCount = getDocumentCount(plate);
        if (docCount > 0) {
            if (!confirm(`Este camión tiene ${docCount} documento(s) asociado(s). ¿Deseas eliminarlo de todos modos?`)) {
                return;
            }
        }
        
        trucks.splice(index, 1); // Eliminar del array
        saveTrucks(); // Guardar cambios
        renderTrucksList(); // Volver a dibujar
        
        // Actualizar otras partes de la UI
        if (typeof populateTruckSelectForUpload === 'function') {
            populateTruckSelectForUpload();
        }
        if (typeof updateSidebarButtons === 'function') {
            updateSidebarButtons();
        }
    }
}

/**
 * Redirige a la página de detalle del vehículo.
 * @param {string} plate - La patente del camión.
 */
function viewTruckDocuments(plate) {
    window.location.href = `vehiculo.html?patente=${plate}`;
}

// --- Funciones del Modal de QR ---

/**
 * Muestra el modal y genera el QR.
 * @param {string} plate - La patente para la cual generar el QR.
 * @param {Event} event - El evento de clic.
 */
function generateVehicleQR(plate, event) {
    if (event) event.stopPropagation();

    const modal = document.getElementById('qr-modal');
    const qrCodeContainer = document.getElementById('qr-modal-code');
    const title = document.getElementById('qr-modal-title');
    const downloadLink = document.getElementById('qr-modal-download');
    
    if (!modal || !qrCodeContainer || !title || !downloadLink) return;

    // Genera la URL completa a la página del vehículo
    const vehicleURL = `${window.location.origin}${window.location.pathname.replace('index.html', '')}vehiculo.html?patente=${encodeURIComponent(plate)}`;

    title.textContent = `QR del Vehículo: ${plate}`;
    qrCodeContainer.innerHTML = ""; // Limpiar QR anterior

    // Generar nuevo QR usando la librería qrcode.min.js
    new QRCode(qrCodeContainer, {
        text: vehicleURL,
        width: 250,
        height: 250,
    });

    // Esperar que se genere la <img> del QR para el link de descarga
    setTimeout(() => {
        const img = qrCodeContainer.querySelector('img');
        if (img) {
            downloadLink.href = img.src;
            downloadLink.download = `QR_${plate}.png`;
        }
    }, 100);

    modal.style.display = 'flex';
}

/**
 * Cierra el modal de QR.
 */
function closeQrModal() {
    const modal = document.getElementById('qr-modal');
    if (modal) modal.style.display = 'none';
}

// Inicializar el formulario al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const addTruckForm = document.getElementById('add-truck-form');
    if (addTruckForm) {
        addTruckForm.addEventListener('submit', addTruck);
    }
    // La primera renderización la llama script.js
});