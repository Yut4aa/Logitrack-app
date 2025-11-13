/**
 * js/qr-label-maker.js
 * GENERADOR DE ETIQUETAS QR - VERSION FINAL
 * Textarea autoexpandible + Formato JSON exacto
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('qr-label-form');
    const qrContainer = document.getElementById('qr-package-code');
    const downloadLink = document.getElementById('qr-package-download');

    if (!form) {
        return;
    }

    // Configuracion
    const MAX_CHARS = 2500;

    // Inicializar
    qrContainer.innerHTML = '<p style="color:#aaa; margin:0; text-align:center;">El QR aparecera aqui</p>';
    downloadLink.style.display = 'none';

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Obtener valores
        const guia = document.getElementById('qr-guia-id').value.trim();
        const patente = document.getElementById('qr-patente').value.trim();
        const destino = document.getElementById('qr-destino').value.trim();
        const notas = document.getElementById('qr-notas').value.trim();

        // Validaciones basicas
        if (!guia) {
            alert('Por favor ingresa el ID de Factura/Guia');
            return;
        }
        if (!destino) {
            alert('Por favor ingresa el Destino/Cliente');
            return;
        }

        // Crear objeto con el formato EXACTO requerido
        const packageData = {
            "guia": guia,
            "patente": patente || "",
            "destino": destino,
            "notas": notas || "",
            "fecha": new Date().toLocaleDateString('es-ES'),
            "hora": new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        };

        // Convertir a JSON
        const qrText = JSON.stringify(packageData, null, 2);
        const textLength = qrText.length;

        console.log('Texto QR:', qrText);
        console.log('Longitud:', textLength, 'caracteres');

        // Validar longitud
        if (textLength > MAX_CHARS) {
            alert('Demasiado texto: ' + textLength + ' caracteres\nMaximo permitido: ' + MAX_CHARS + '\n\nReduce el texto en las notas.');
            return;
        }

        // Limpiar contenedor
        qrContainer.innerHTML = '';
        downloadLink.style.display = 'none';

        try {
            // Generar QR con nivel L para maxima capacidad
            new QRCode(qrContainer, {
                text: qrText,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.L
            });

            // Preparar descarga
            setTimeout(() => {
                const img = qrContainer.querySelector('img');
                if (img) {
                    downloadLink.href = img.src;
                    downloadLink.download = 'etiqueta-' + guia + '.png';
                    downloadLink.style.display = 'inline-block';
                    
                    // Mostrar exito
                    const successMsg = document.createElement('div');
                    successMsg.style.cssText = 'font-size: 12px; color: #4ecdc4; margin-top: 10px; text-align: center;';
                    successMsg.textContent = 'QR generado: ' + textLength + ' caracteres';
                    qrContainer.appendChild(successMsg);
                    
                } else {
                    qrContainer.innerHTML = '<p style="color:red; text-align:center;">Error al generar el QR</p>';
                }
            }, 100);

        } catch (error) {
            console.error('Error:', error);
            if (error.message.includes('code length overflow')) {
                qrContainer.innerHTML = '<p style="color:red; text-align:center;">Error: El texto es demasiado largo para el QR (' + textLength + ' caracteres)</p>';
            } else {
                qrContainer.innerHTML = '<p style="color:red; text-align:center;">Error tecnico al generar QR</p>';
            }
        }
    });
});