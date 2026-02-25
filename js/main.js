// Scroll horizontal con rueda del mouse
const container = document.querySelector('.horizontal-container');
const progressBar = document.querySelector('.progress-bar');

let scrollAmount = 0;
let targetScroll = 0;
const ease = 0.1; // Suavidad del scroll

// Calcular ancho total
function getScrollWidth() {
    return container.scrollWidth - window.innerWidth;
}

// Evento de rueda del mouse - convertir vertical a horizontal
window.addEventListener('wheel', (e) => {
    e.preventDefault();
    targetScroll += e.deltaY;
    
    // Limites
    const maxScroll = getScrollWidth();
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
}, { passive: false });

// Animación suave
function animate() {
    // Interpolación suave
    scrollAmount += (targetScroll - scrollAmount) * ease;
    
    // Aplicar transform
    container.style.transform = `translateX(-${scrollAmount}px)`;
    
    // Actualizar barra de progreso
    const progress = (scrollAmount / getScrollWidth()) * 100;
    progressBar.style.width = `${progress}%`;
    
    requestAnimationFrame(animate);
}

animate();

// Teclas de dirección
window.addEventListener('keydown', (e) => {
    const scrollStep = window.innerWidth * 0.8;
    
    if (e.key === 'ArrowRight') {
        targetScroll += scrollStep;
    } else if (e.key === 'ArrowLeft') {
        targetScroll -= scrollStep;
    }
    
    const maxScroll = getScrollWidth();
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
});

// Touch/drag para móvil
let isDragging = false;
let startX;
let scrollLeft;

container.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX;
    scrollLeft = targetScroll;
});

container.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.touches[0].pageX;
    const walk = (startX - x) * 1.5;
    targetScroll = scrollLeft + walk;
    
    const maxScroll = getScrollWidth();
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
});

container.addEventListener('touchend', () => {
    isDragging = false;
});
