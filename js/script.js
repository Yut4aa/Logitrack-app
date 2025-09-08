// Variables globales
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const documents = {}; // Usaremos un objeto para almacenar los documentos por fecha

let currentDate = new Date();

// Función para mostrar secciones
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }
}

// Función para cerrar sesión
function logout() {
    if (confirm('¿Está seguro de que desea cerrar sesión?')) {
        window.location.href = 'login.html';
    }
}

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar animaciones
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }

    // Crear estrellas para el fondo del formulario
    const starsContainer = document.getElementById('stars-container');
    if (starsContainer) {
        const starCount = 50;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            const size = Math.random() * 3 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 5 + 3;
            const delay = Math.random() * 5;
            
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.setProperty('--duration', `${duration}s`);
            star.style.animationDelay = `${delay}s`;
            
            starsContainer.appendChild(star);
        }
    }
    
    // Inicializar iconos Feather
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Inicializar calendario si existe
    if (typeof renderCalendar === 'function') {
        renderCalendar();
    }
});