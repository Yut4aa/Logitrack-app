/**
 * js/forgot-password.js
 * VERSIÓN REAL: Integración con API Django
 */

const API_URL = 'http://127.0.0.1:8000/api';

document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('resetForm');
    const resetButton = document.getElementById('resetButton');

    async function handlePasswordReset(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        
        if (!email) {
            alert('Por favor, ingrese su correo electrónico.');
            return;
        }
        
        resetButton.textContent = "Enviando...";
        resetButton.disabled = true;
        
        try {
            const response = await fetch(`${API_URL}/password-reset/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email })
            });

            const data = await response.json();

            if (response.ok) {
                resetButton.textContent = "✓ Email Enviado";
                resetButton.style.backgroundColor = "#2e7d32";
                
                alert('Se ha enviado un enlace de recuperación a tu email. Revisa tu bandeja de entrada.');

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 3000);
                
            } else {
                alert(data.error || 'Error al procesar la solicitud');
                resetButton.textContent = "Enviar Enlace";
                resetButton.disabled = false;
            }

        } catch (error) {
            console.error('Error de red:', error);
            alert('No se pudo conectar con el servidor.');
            resetButton.textContent = "Enviar Enlace";
            resetButton.disabled = false;
        }
    }

    if (resetForm) {
        resetForm.addEventListener('submit', handlePasswordReset);
    }

    // Efectos de focus
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'translateY(-2px)';
            input.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'translateY(0)';
        });
    });
});