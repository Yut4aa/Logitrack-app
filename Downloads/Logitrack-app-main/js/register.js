/**
 * js/register.js
 * SIMULACIÓN de registro.
 * No crea un usuario real, solo anima y redirige.
 */
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerButton = document.getElementById('registerButton');

    function simulateRegister(event) {
        event.preventDefault();
        
        const fullname = document.getElementById('fullname').value;
        // Asumo que tienes un campo 'username' en 'register.html'
        const username = document.getElementById('username') ? document.getElementById('username').value : 'user'; 
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const terms = document.getElementById('terms').checked;
        
        if (!fullname || !username || !email || !password || !confirmPassword) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }
        if (!terms) {
            alert('Debe aceptar los términos y condiciones.');
            return;
        }

        registerButton.textContent = "Creando cuenta...";
        registerButton.disabled = true;

        // Simular creación de cuenta
        setTimeout(() => {
            registerButton.textContent = "✓ Cuenta creada";
            registerButton.style.backgroundColor = "#2e7d32";
            
            alert('¡Cuenta creada con éxito! Serás redirigido al login.');
            
            setTimeout(() => {
                window.location.href = "login.html"; // Redirigir al login
            }, 1500);

        }, 1500);
    }

    if (registerForm) registerForm.addEventListener('submit', simulateRegister);
    if (registerButton) registerButton.addEventListener('click', simulateRegister);
    
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