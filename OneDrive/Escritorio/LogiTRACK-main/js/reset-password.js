/**
 * js/reset-password.js
 * Confirmación de nueva contraseña
 */

const API_URL = 'http://127.0.0.1:8000/api';

document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('resetPasswordForm');
    const resetButton = document.getElementById('resetButton');

    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('uid');
    const token = urlParams.get('token');

    // Llenar campos ocultos
    document.getElementById('uid').value = uid || '';
    document.getElementById('token').value = token || '';

    // Validar que tenemos los parámetros necesarios
    if (!uid || !token) {
        alert('Enlace inválido o expirado.');
        window.location.href = 'forgot-password.html';
        return;
    }

    async function handlePasswordResetConfirm(event) {
        event.preventDefault();
        
        const newPassword = document.getElementById('new_password').value;
        const confirmPassword = document.getElementById('confirm_password').value;
        
        if (!newPassword || !confirmPassword) {
            alert('Por favor, complete todos los campos.');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }
        
        if (newPassword.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        
        resetButton.textContent = "Actualizando...";
        resetButton.disabled = true;
        
        try {
            const response = await fetch(`${API_URL}/password-reset-confirm/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: uid,
                    token: token,
                    new_password: newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                resetButton.textContent = "✓ Contraseña Actualizada";
                resetButton.style.backgroundColor = "#2e7d32";
                
                alert('Contraseña actualizada correctamente. Ahora puede iniciar sesión.');

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
                
            } else {
                alert(data.error || 'Error al actualizar la contraseña');
                resetButton.textContent = "Actualizar Contraseña";
                resetButton.disabled = false;
            }

        } catch (error) {
            console.error('Error de red:', error);
            alert('No se pudo conectar con el servidor.');
            resetButton.textContent = "Actualizar Contraseña";
            resetButton.disabled = false;
        }
    }

    if (resetForm) {
        resetForm.addEventListener('submit', handlePasswordResetConfirm);
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