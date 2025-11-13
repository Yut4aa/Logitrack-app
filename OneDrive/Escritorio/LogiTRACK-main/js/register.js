const API_URL = 'http://127.0.0.1:8000/api';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerButton = document.getElementById('registerButton');

    async function handleRegister(event) {
        event.preventDefault();
        
        const fullname = document.getElementById('fullname').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // (Añade tus validaciones de 'confirm-password' y 'terms' aquí si quieres)

        registerButton.textContent = "Creando cuenta...";
        registerButton.disabled = true;
        
        try {
            const response = await fetch(`${API_URL}/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    email: email,
                    first_name: fullname
                })
            });

            if (response.ok) { 
                // Redirige inmediatamente al login
                window.location.href = "login.html";

            } else {
                const errorData = await response.json();
                let errorMessage = 'Error al crear la cuenta.';
                if (errorData.username) {
                    errorMessage = `Usuario: ${errorData.username[0]}`;
                } else if (errorData.email) {
                    errorMessage = `Email: ${errorData.email[0]}`;
                }
                alert(errorMessage);
                registerButton.textContent = "Crear Cuenta";
                registerButton.disabled = false;
            }
        
        } catch (error) {
            console.error('Error de red:', error);
            alert('No se pudo conectar con el servidor.');
            registerButton.textContent = "Crear Cuenta";
            registerButton.disabled = false;
        }
    }

    if (registerForm) registerForm.addEventListener('submit', handleRegister);
});