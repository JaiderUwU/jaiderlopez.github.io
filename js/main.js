// Scroll horizontal con rueda del mouse
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
    if (window.innerWidth > 768) {
        e.preventDefault();
        targetScroll += e.deltaY;
        const maxScroll = getScrollWidth();
        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
    }
}, { passive: false });

// ========== MÓVIL: Touch swipe ==========
let touchStartX = 0;
let touchCurrentX = 0;
let isTouching = false;

document.addEventListener('touchstart', (e) => {
    isTouching = true;
    touchStartX = e.touches[0].clientX;
    touchCurrentX = scrollAmount;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    if (!isTouching) return;
    
    const touchX = e.touches[0].clientX;
    const diff = touchStartX - touchX;
    
    targetScroll = touchCurrentX + diff;
    
    const maxScroll = getScrollWidth();
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
}, { passive: true });

document.addEventListener('touchend', () => {
    isTouching = false;
});

// ========== ANIMACIÓN SUAVE ==========
function animate() {
    scrollAmount += (targetScroll - scrollAmount) * ease;
    container.style.transform = `translateX(-${scrollAmount}px)`;
    
    const progress = (scrollAmount / getScrollWidth()) * 100;
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
