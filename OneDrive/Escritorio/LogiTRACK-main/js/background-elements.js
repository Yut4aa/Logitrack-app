/**
 * js/background-elements.js
 * Crea los elementos decorativos de fondo para las páginas de login/registro.
 */
function createBackgroundElements() {
    const container = document.getElementById('backgroundElements');
    if (!container) return; // No hacer nada si el contenedor no existe
    
    const elementCount = 12;
    
    for (let i = 0; i < elementCount; i++) {
        const element = document.createElement('div');
        element.classList.add('element');
        
        const width = Math.random() * 80 + 20;
        const height = Math.random() * 80 + 20;
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
        
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * 100}%`;
        
        element.style.animationDelay = `${Math.random() * 5}s`;
        element.style.animationDuration = `${Math.random() * 10 + 20}s`;
        
        element.style.opacity = Math.random() * 0.1 + 0.03;
        
        container.appendChild(element);
    }
}

window.addEventListener('load', createBackgroundElements);