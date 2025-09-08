// Manejar el envío del formulario
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('upload-form');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const plate = document.getElementById('truck-plate').value;
            const fileInput = document.getElementById('document-file');
            const file = fileInput.files[0];
            
            if (!file) {
                alert('Por favor, selecciona un archivo.');
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
            
            alert('Documento subido con éxito.');
            
            // Limpiar el formulario
            document.getElementById('truck-plate').value = '';
            fileInput.value = '';
        });
    }
});