/**
 * js/nosotros.js
 * Solo inicializa animaciones para la página 'nosotros.html'.
 */
document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }

    // Inicializar iconos (si usas Feather en esta página)
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});