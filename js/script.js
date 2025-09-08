// Variables globales
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const documents = {}; // Usaremos un objeto para almacenar los documentos por fecha

let currentDate = new Date();

// Función para mostrar secciones
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }
}

// Función para cerrar sesión
function logout() {
    if (confirm('¿Está seguro de que desea cerrar sesión?')) {
        window.location.href = 'login.html';
    }
}

// NUEVA FUNCIÓN: Renderizar la lista de vehículos
function renderVehicles() {
    const vehicleListEl = document.getElementById('vehicle-list');
    if (!vehicleListEl) return;

    // 1. Obtener todas las patentes únicas
    const allDocs = Object.values(documents).flat();
    const uniquePlates = [...new Set(allDocs.map(doc => doc.plate))];
    
    vehicleListEl.innerHTML = ''; // Limpiar lista

    if (uniquePlates.length === 0) {
        vehicleListEl.innerHTML = '<p>No hay vehículos con documentos registrados.</p>';
        return;
    }

    // 2. Crear un elemento por cada patente
    uniquePlates.sort().forEach(plate => {
        const vehicleItem = document.createElement('div');
        vehicleItem.classList.add('vehicle-item');
        vehicleItem.textContent = plate;
        vehicleItem.dataset.plate = plate; // Guardar la patente en un data attribute

        vehicleItem.addEventListener('click', () => {
            // Marcar como seleccionado
            document.querySelectorAll('.vehicle-item').forEach(item => item.classList.remove('selected'));
            vehicleItem.classList.add('selected');
            
            showDocumentsForVehicle(plate);
        });

        vehicleListEl.appendChild(vehicleItem);
    });
}

// NUEVA FUNCIÓN: Mostrar documentos para un vehículo específico
function showDocumentsForVehicle(plate) {
    const docListEl = document.getElementById('vehicle-documents-list');
    if (!docListEl) return;

    docListEl.innerHTML = ''; // Limpiar la lista de documentos

    // 1. Filtrar todos los documentos para encontrar los que coincidan con la patente
    const allDocs = Object.values(documents).flat();
    const vehicleDocs = allDocs.filter(doc => doc.plate === plate);
    
    // 2. Mostrar los documentos
    if (vehicleDocs.length > 0) {
        const title = document.createElement('h3');
        title.textContent = `Documentos para la patente ${plate}`;
        docListEl.appendChild(title);
        
        vehicleDocs.forEach(doc => {
            const docDate = new Date(doc.date);
            const formattedDate = docDate.toLocaleDateString('es-ES');

            const docItem = document.createElement('div');
            docItem.classList.add('document-item');
            docItem.innerHTML = `
                <div>
                    <strong>Fecha:</strong> ${formattedDate}<br>
                    <strong>Tipo:</strong> ${doc.type}
                </div>
                <img src="${doc.fileUrl}" alt="Documento">
            `;
            docListEl.appendChild(docItem);
        });
    } else {
        const message = document.createElement('p');
        message.textContent = `No se encontraron documentos para la patente ${plate}.`;
        docListEl.appendChild(message);
    }
}


// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar animaciones
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }

    // Crear estrellas para el fondo del formulario
    const starsContainer = document.getElementById('stars-container');
    if (starsContainer) {
        const starCount = 50;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            const size = Math.random() * 3 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 5 + 3;
            const delay = Math.random() * 5;
            
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.setProperty('--duration', `${duration}s`);
            star.style.animationDelay = `${delay}s`;
            
            starsContainer.appendChild(star);
        }
    }
    
    // Inicializar iconos Feather
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Inicializar calendario si existe
    if (typeof renderCalendar === 'function') {
        renderCalendar();
    }

    // INICIALIZAR LA LISTA DE VEHÍCULOS
    renderVehicles();
});