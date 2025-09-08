// Crear elementos decorativos de fondo
function createBackgroundElements() {
    const container = document.getElementById('backgroundElements');
    const elementCount = 12;
    
    for (let i = 0; i < elementCount; i++) {
        const element = document.createElement('div');
        element.classList.add('element');
        
        // Tamaño aleatorio
        const width = Math.random() * 80 + 20;
        const height = Math.random() * 80 + 20;
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
        
        // Posición aleatoria
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * 100}%`;
        
        // Retraso aleatorio en la animación
        element.style.animationDelay = `${Math.random() * 5}s`;
        element.style.animationDuration = `${Math.random() * 10 + 20}s`;
        
        // Opacidad aleatoria
        element.style.opacity = Math.random() * 0.1 + 0.03;
        
        container.appendChild(element);
    }
}

// Inicializar elementos de fondo cuando se carga la página
window.addEventListener('load', createBackgroundElements);