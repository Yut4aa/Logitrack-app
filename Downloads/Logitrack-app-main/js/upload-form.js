/**
 * js/upload-form.js
 * Maneja la subida de documentos y el select de camiones (localStorage).
 */

/**
 * Puebla el <select> en la sección 'Subir Factura'
 * con los camiones guardados en localStorage.
 */
function populateTruckSelectForUpload() {
    const truckSelect = document.getElementById('truck-plate-select');
    const submitBtn = document.getElementById('upload-submit-btn');
    if (!truckSelect) return;

    const trucks = JSON.parse(localStorage.getItem('logitrack_trucks')) || [];
    
    truckSelect.innerHTML = ''; // Limpiar opciones

    if (trucks.length > 0) {
        // Ordenar alfabéticamente
        trucks.sort((a, b) => a.plate.localeCompare(b.plate));
        
        truckSelect.appendChild(new Option('Selecciona un camión...', ''));
        trucks.forEach(truck => {
            const optionText = `${truck.plate} (${truck.driver})`;
            truckSelect.appendChild(new Option(optionText, truck.plate));
        });
        
        truckSelect.disabled = false;
        if (submitBtn) submitBtn.disabled = false;
    } else {
        truckSelect.appendChild(new Option('Agregue un camión primero', ''));
        truckSelect.disabled = true;
        if (submitBtn) submitBtn.disabled = true;
    }
}

/**
 * Maneja el evento de submit del formulario 'upload-form'.
 */
function handleUploadSubmit(event) {
    event.preventDefault();

    const submitButton = event.target.querySelector('button[type="submit"]');
    const plateSelect = document.getElementById('truck-plate-select');
    const plate = plateSelect.value;
    const fileInput = document.getElementById('document-file');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Por favor, selecciona un archivo.');
        return;
    }
    if (!plate) {
        alert('Por favor, selecciona un camión de la lista.');
        return;
    }
    
    // --- CORRECCIÓN BUG DOBLE CLIC ---
    submitButton.disabled = true;
    submitButton.textContent = 'Subiendo...';

    // Simular carga (el createObjectURL es casi instantáneo)
    setTimeout(() => {
        // Generar una URL temporal (Blob) para la imagen
        // Advertencia: Esta URL solo funciona mientras el navegador esté abierto.
        const fileUrl = URL.createObjectURL(file);
        const today = new Date();
        const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        
        const documents = JSON.parse(localStorage.getItem('logitrack_documents')) || {};

        if (!documents[dateKey]) {
            documents[dateKey] = [];
        }
        
        documents[dateKey].push({
            plate: plate,
            type: 'Factura/Devolución',
            fileUrl: fileUrl,
            date: today.toISOString()
        });
        
        // Guardar los documentos actualizados
        localStorage.setItem('logitrack_documents', JSON.stringify(documents));

        // Actualizar las vistas
        if (typeof renderCalendar === 'function') {
            renderCalendar();
        }
        if (typeof renderTrucksList === 'function') {
            renderTrucksList();
        }
        
        alert('Documento subido con éxito.');
        
        // Limpiar formulario
        plateSelect.value = '';
        fileInput.value = '';

        // --- CORRECCIÓN BUG DOBLE CLIC ---
        submitButton.disabled = false;
        submitButton.textContent = 'Subir Documento';
    }, 300); // 300ms de demora simulada
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUploadSubmit);
    }
    // La primera población del select la llama script.js
});