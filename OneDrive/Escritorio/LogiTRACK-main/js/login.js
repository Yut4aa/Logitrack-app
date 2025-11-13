/**
 * js/login.js
 * VERSIÓN CORREGIDA: Incluye información de tipo de usuario
 */

const API_URL = 'http://127.0.0.1:8000/api';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');

    async function attemptLogin(username, password) {
        return await fetch(`${API_URL}/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
    }

    async function handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            alert('Por favor, complete todos los campos');
            return;
        }
        
        loginButton.textContent = "Verificando...";
        loginButton.disabled = true;
        
        try {
            let response = await attemptLogin(username, password);

            if (!response.ok && response.status === 400) {
                await new Promise(resolve => setTimeout(resolve, 1500));
                console.log("Primer intento falló (400), reintentando...");
                response = await attemptLogin(username, password);
            }

            if (response.ok) {
                const data = await response.json();
                
                localStorage.setItem('logitrack_session', JSON.stringify({
                    token: data.token,
                    username: data.username,
                    fullname: data.fullname,
                    user_type: data.user_type,
                    vehiculo_asignado: data.vehiculo_asignado
                }));
                
                loginButton.textContent = "✓ Acceso confirmado";
                loginButton.style.backgroundColor = "#2e7d32";
                
                setTimeout(() => {
                    window.location.href = "index.html"; 
                }, 1000);
                
            } else {
                alert('Usuario o contraseña incorrectos.');
                loginButton.textContent = "Iniciar Sesión";
                loginButton.disabled = false;
            }
        
        } catch (error) {
            console.error('Error de red:', error);
            alert('No se pudo conectar con el servidor.');
            loginButton.textContent = "Iniciar Sesión";
            loginButton.disabled = false;
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});