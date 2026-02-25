const container = document.querySelector('.horizontal-container');
const progressBar = document.querySelector('.progress-bar');

let scrollAmount = 0;
let targetScroll = 0;
const ease = 0.1;

function getScrollWidth() {
    return container.scrollWidth - window.innerWidth;
}

// ========== DESKTOP: Scroll con rueda ==========
window.addEventListener('wheel', (e) => {
    e.preventDefault();
    targetScroll += e.deltaY;
    
    const maxScroll = getScrollWidth();
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
}, { passive: false });

// ========== MÓVIL: Touch swipe horizontal ==========
let touchStartX = 0;
let touchCurrentX = 0;
let isTouching = false;
let velocity = 0;
let lastTouchX = 0;
let lastTime = 0;

document.addEventListener('touchstart', (e) => {
    isTouching = true;
    touchStartX = e.touches[0].clientX;
    touchCurrentX = targetScroll;
    lastTouchX = touchStartX;
    lastTime = Date.now();
    velocity = 0;
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (!isTouching) return;
    e.preventDefault(); // Prevenir scroll nativo
    
    const touchX = e.touches[0].clientX;
    const diff = touchStartX - touchX;
    
    // Calcular velocidad para inercia
    const now = Date.now();
    const dt = now - lastTime;
    if (dt > 0) {
        velocity = (lastTouchX - touchX) / dt;
    }
    lastTouchX = touchX;
    lastTime = now;
    
    targetScroll = touchCurrentX + diff;
    
    const maxScroll = getScrollWidth();
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
}, { passive: false });

document.addEventListener('touchend', () => {
    isTouching = false;
    
    // Inercia: continuar movimiento después de soltar
    const inertia = velocity * 200; // Ajustar para más/menos deslizamiento
    targetScroll += inertia;
    
    const maxScroll = getScrollWidth();
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
});

// ========== ANIMACIÓN ==========
function animate() {
    scrollAmount += (targetScroll - scrollAmount) * ease;
    container.style.transform = `translateX(-${scrollAmount}px)`;
    
    const maxScroll = getScrollWidth();
    const progress = maxScroll > 0 ? (scrollAmount / maxScroll) * 100 : 0;
    progressBar.style.width = `${progress}%`;
    
    requestAnimationFrame(animate);
}

animate();

// ========== TECLAS ==========
window.addEventListener('keydown', (e) => {
    const scrollStep = window.innerWidth * 0.8;
    
    if (e.key === 'ArrowRight') targetScroll += scrollStep;
    if (e.key === 'ArrowLeft') targetScroll -= scrollStep;
    
    const maxScroll = getScrollWidth();
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
});
