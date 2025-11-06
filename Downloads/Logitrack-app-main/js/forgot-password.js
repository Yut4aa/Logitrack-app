/**
 * js/forgot-password.js
 * SIMULACIÓN de reseteo de contraseña.
 */
document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('resetForm');
    const resetButton = document.getElementById('resetButton');

    async function simulateReset(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        
        if (!email) {
            alert('Por favor, ingrese su correo electrónico.');
            return;
        }
        
        resetButton.textContent = "Enviando...";
        resetButton.disabled = true;
        
        // Simular envío de correo
        setTimeout(() => {
            resetButton.textContent = "✓ Correo Enviado";
            resetButton.style.backgroundColor = "#2e7d32";
            
            alert('Se ha enviado un enlace de restablecimiento (simulado) a su correo.');

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        }, 1500);
    }

    if (resetForm) resetForm.addEventListener('submit', simulateReset);
    if (resetButton) resetButton.addEventListener('click', simulateReset);

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