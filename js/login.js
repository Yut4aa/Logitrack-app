// Función para redireccionar a index.html
function redirectToIndex() {
    // Validar campos antes de redireccionar (puedes agregar más validaciones)
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Por favor, complete todos los campos');
        return;
    }
    
    // Animación de carga
    const loginButton = document.getElementById('loginButton');
    const originalText = loginButton.textContent;
    
    loginButton.textContent = "Verificando...";
    loginButton.disabled = true;
    
    // Simular proceso de verificación
    setTimeout(() => {
        loginButton.textContent = "✓ Acceso confirmado";
        loginButton.style.backgroundColor = "#2e7d32";
        
        // Redireccionar después de la animación
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    }, 1500);
}

// Asignar la función al botón
document.getElementById('loginButton').addEventListener('click', redirectToIndex);

// También se puede enviar el formulario con la tecla Enter
document.getElementById('loginForm').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        redirectToIndex();
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