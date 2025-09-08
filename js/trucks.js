// Array para almacenar los camiones
let trucks = JSON.parse(localStorage.getItem('logitrack_trucks')) || [];

// Función para renderizar la lista de camiones
function renderTrucksList() {
    const trucksContainer = document.getElementById('trucks-container');
    
    if (!trucksContainer) return;
    
    if (trucks.length === 0) {
        trucksContainer.innerHTML = `
            <div class="empty-state">
                <i data-feather="truck" width="48" height="48"></i>
                <p>No hay camiones registrados</p>
            </div>
        `;
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        return;
    }
    
    trucksContainer.innerHTML = trucks.map((truck, index) => `
        <div class="truck-card" data-truck-id="${index}">
            <div class="truck-header">
                <h4>${truck.plate}</h4>
                <button class="delete-truck" onclick="deleteTruck(${index})">
                    <i data-feather="trash-2" width="16" height="16"></i>
                </button>
            </div>
            <div class="truck-info">
                ${truck.model ? `<p><strong>Modelo:</strong> ${truck.model}</p>` : ''}
                ${truck.driver ? `<p><strong>Conductor:</strong> ${truck.driver}</p>` : ''}
                <p><strong>Documentos:</strong> ${getDocumentCount(truck.plate)}</p>
            </div>
            <button class="view-documents" onclick="viewTruckDocuments('${truck.plate}')">
                Ver Documentos
            </button>
        </div>
    `).join('');
    
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

// Función para contar documentos de un camión
function getDocumentCount(plate) {
    const documents = JSON.parse(localStorage.getItem('logitrack_documents')) || {};
    let count = 0;
    
    for (const date in documents) {
        count += documents[date].filter(doc => doc.plate === plate).length;
    }
    
    return count;
}

// Función para agregar un nuevo camión
function addTruck(event) {
    event.preventDefault();
    
    const plate = document.getElementById('truck-plate').value.trim().toUpperCase();
    const model = document.getElementById('truck-model').value.trim();
    const driver = document.getElementById('truck-driver').value.trim();
    
    if (!plate) {
        alert('La patente es obligatoria');
        return;
    }
    
    // Verificar si la patente ya existe
    if (trucks.some(truck => truck.plate === plate)) {
        alert('Ya existe un camión con esta patente');
        return;
    }
    
    const newTruck = {
        plate: plate,
        model: model,
        driver: driver,
        createdAt: new Date().toISOString()
    };
    
    trucks.push(newTruck);
    saveTrucks();
    renderTrucksList();
    
    // Limpiar formulario
    document.getElementById('add-truck-form').reset();
    
    alert('Camión agregado correctamente');
}

// Función para eliminar un camión
function deleteTruck(index) {
    if (confirm('¿Estás seguro de que quieres eliminar este camión?')) {
        const plate = trucks[index].plate;
        
        // Verificar si tiene documentos asociados
        const docCount = getDocumentCount(plate);
        if (docCount > 0) {
            if (!confirm(`Este camión tiene ${docCount} documento(s) asociado(s). ¿Deseas eliminarlo de todos modos?`)) {
                return;
            }
        }
        
        trucks.splice(index, 1);
        saveTrucks();
        renderTrucksList();
    }
}

// Función para ver documentos de un camión
function viewTruckDocuments(plate) {
    // Mostrar la sección de calendario y filtrar por camión
    showSection('calendar');
    
    // Aquí podrías implementar un filtro para mostrar solo los documentos de este camión
    setTimeout(() => {
        alert(`Mostrando documentos del camión ${plate}`);
        // En una implementación completa, aquí filtrarías el calendario
    }, 500);
}

// Función para guardar camiones en localStorage
function saveTrucks() {
    localStorage.setItem('logitrack_trucks', JSON.stringify(trucks));
}

// Inicializar eventos cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    const addTruckForm = document.getElementById('add-truck-form');
    if (addTruckForm) {
        addTruckForm.addEventListener('submit', addTruck);
    }
    
    // Cargar camiones al iniciar
    renderTrucksList();
});