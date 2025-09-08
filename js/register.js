// Función para registrar usuario y redireccionar
function registerUser() {
    // Validar campos antes de registrar
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const terms = document.getElementById('terms').checked;
    
    if (!fullname || !email || !password || !confirmPassword) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }
    
    if (!terms) {
        alert('Debe aceptar los términos y condiciones para continuar.');
        return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, ingrese un correo electrónico válido.');
        return;
    }
    
    // Animación de carga
    const registerButton = document.getElementById('registerButton');
    const originalText = registerButton.textContent;
    
    registerButton.textContent = "Creando cuenta...";
    registerButton.disabled = true;
    
    // Simular proceso de registro
    setTimeout(() => {
        registerButton.textContent = "✓ Cuenta creada";
        registerButton.style.backgroundColor = "#2e7d32";
        
        // Redireccionar después de la animación
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    }, 1500);
}

// Asignar la función al botón
document.getElementById('registerButton').addEventListener('click', registerUser);

// También se puede enviar el formulario con la tecla Enter
document.getElementById('registerForm').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        registerUser();
    }
});

// Efectos de entrada en los campos
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

// Inicializar elementos de fondo cuando se carga la página
window.addEventListener('load', function() {
    // Esta función está en background-elements.js
    if (typeof createBackgroundElements === 'function') {
        createBackgroundElements();
    }
});