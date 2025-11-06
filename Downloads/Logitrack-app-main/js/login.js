/**
 * js/login.js
 * SIMULACIÓN de inicio de sesión.
 * No verifica un usuario real, solo anima y redirige.
 */
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');

    function simulateLogin(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            alert('Por favor, complete todos los campos');
            return;
        }
        
        loginButton.textContent = "Verificando...";
        loginButton.disabled = true;
        
        // Simular una pequeña demora de red
        setTimeout(() => {
            loginButton.textContent = "✓ Acceso confirmado";
            loginButton.style.backgroundColor = "#2e7d32";
            
            // Redireccionar a la app principal
            setTimeout(() => {
                window.location.href = "index.html"; 
            }, 1000);
        }, 1500);
    }

    if (loginForm) loginForm.addEventListener('submit', simulateLogin);
    if (loginButton) loginButton.addEventListener('click', simulateLogin);
    
    // Efectos de focus en los campos
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