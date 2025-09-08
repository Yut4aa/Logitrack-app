// Manejar el envío del formulario
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('upload-form');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const plateInput = document.getElementById('truck-plate');
            const plate = plateInput.value.toUpperCase().trim(); // Convertir a mayúsculas y quitar espacios
            const fileInput = document.getElementById('document-file');
            const file = fileInput.files[0];
            
            if (!file) {
                alert('Por favor, selecciona un archivo.');
                return;
            }

            if (!plate) {
                alert('Por favor, ingresa la patente del camión.');
                return;
            }
            
            // Simulación de subida de archivo para obtener una URL
            const fileUrl = URL.createObjectURL(file);
            const today = new Date();
            const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
            
            if (!documents[dateKey]) {
                documents[dateKey] = [];
            }
            
            documents[dateKey].push({
                plate: plate,
                type: 'Factura/Devolución',
                fileUrl: fileUrl,
                date: today.toISOString()
            });

            // Actualizar el calendario para mostrar que este día tiene datos
            if (typeof renderCalendar === 'function') {
                renderCalendar();
            }

            // ACTUALIZAR LA LISTA DE VEHÍCULOS POR SI SE AÑADIÓ UNA NUEVA PATENTE
            if (typeof renderVehicles === 'function') {
                renderVehicles();
            }
            
            alert('Documento subido con éxito.');
            
            // Limpiar el formulario
            plateInput.value = '';
            fileInput.value = '';
        });
    }
});