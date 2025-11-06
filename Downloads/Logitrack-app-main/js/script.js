/**
 * js/script.js
 * Script principal de la app (versión localStorage).
 * Maneja la navegación, el estado inicial y el logout (simulado).
 */

// Variables globales
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
let currentDate = new Date();

/**
 * Muestra una sección de la app y oculta las demás.
 * @param {string} sectionId El ID de la sección a mostrar ('upload', 'calendar', 'vehicles').
 */
function showSection(sectionId) {
    // Comprobar si hay camiones antes de ir a 'subir' o 'calendario'
    const trucks = JSON.parse(localStorage.getItem('logitrack_trucks')) || [];
    if (trucks.length === 0 && (sectionId === 'upload' || sectionId === 'calendar')) {
        alert('Debe agregar al menos un camión para usar esta sección.');
        showSection('vehicles'); // Forzar a la sección de vehículos
        return;
    }

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }
}

/**
 * Habilita o deshabilita los botones de la barra lateral
 * basado en si existen camiones registrados.
 */
function updateSidebarButtons() {
    const trucks = JSON.parse(localStorage.getItem('logitrack_trucks')) || [];
    const btnUpload = document.getElementById('btn-upload');
    const btnCalendar = document.getElementById('btn-calendar');
    
    const sharedStyle = (btn, enabled) => {
        if (!btn) return;
        btn.disabled = !enabled;
        btn.style.opacity = enabled ? '1' : '0.5';
        btn.style.cursor = enabled ? 'pointer' : 'not-allowed';
    };

    const hasTrucks = trucks.length > 0;
    sharedStyle(btnUpload, hasTrucks);
    sharedStyle(btnCalendar, hasTrucks);
    return hasTrucks;
}

/**
 * Simula un cierre de sesión y redirige a login.html.
 */
function logout() {
    if (confirm('¿Está seguro de que desea cerrar sesión?')) {
        // En una app real, aquí se invalidaría un token.
        // En esta simulación, solo redirigimos.
        window.location.href = 'login.html';
    }
}

/**
 * Inicialización de la aplicación
 */
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar animaciones AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    }

    // Código de estrellas (asumo que existe en tu HTML)
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
    
    // Cargar datos (los scripts individuales se auto-ejecutan en DOMContentLoaded)
    if (typeof renderCalendar === 'function') {
        renderCalendar();
    }
    if (typeof renderTrucksList === 'function') {
        renderTrucksList();
    }
    if (typeof populateTruckSelectForUpload === 'function') {
        populateTruckSelectForUpload();
    }
    
    // Comprobar si hay camiones al cargar
    const hasTrucks = updateSidebarButtons();
    
    // Decidir qué sección mostrar al inicio
    if (!hasTrucks) {
        alert('Bienvenido. Para comenzar, por favor registre su primer camión.');
        showSection('vehicles');
    } else {
        showSection('upload');
    }
});