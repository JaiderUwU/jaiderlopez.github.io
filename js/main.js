// Variables globales
const container = document.getElementById('hContainer');
const progressFill = document.getElementById('progressFill');
const panels = Array.from(document.querySelectorAll('.panel'));
const TOTAL = panels.length;
let scrollAmount = 0;
let targetScroll = 0;
const ease = 0.1;

// Calcular ancho de scroll
function getScrollWidth() {
    return container.scrollWidth - window.innerWidth;
}

// FUNCIÓN GLOBAL para ir a un slide específico
window.goToSlide = function(index) {
    const slideWidth = window.innerWidth - 60; // Restar ancho del menú
    targetScroll = index * slideWidth;
    targetScroll = Math.max(0, Math.min(targetScroll, getScrollWidth()));
};

// Actualizar UI (contador, título, menú activo)
function updateUI() {
    const slideWidth = window.innerWidth - 60;
    const currentIndex = Math.round(scrollAmount / slideWidth);
    const clampedIndex = Math.max(0, Math.min(currentIndex, TOTAL - 1));

    // Contador
    const num = String(clampedIndex + 1).padStart(2, '0');
    document.getElementById('slideCurrentNum').textContent = num;

    // Título
    const title = panels[clampedIndex]?.dataset?.title || '';
    document.getElementById('slideTitleDisplay').textContent = title;

    // Menú activo
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', parseInt(el.dataset.slide) === clampedIndex);
    });

    // Progress bar
    const max = getScrollWidth();
    progressFill.style.width = `${max > 0 ? (scrollAmount / max) * 100 : 0}%`;
}

// Scroll con rueda del mouse
window.addEventListener('wheel', (e) => {
    e.preventDefault();
    targetScroll += e.deltaY;
    targetScroll = Math.max(0, Math.min(targetScroll, getScrollWidth()));
}, { passive: false });

// Touch para móvil
let touchStartX = 0;
let touchCurrentX = 0;
let isTouching = false;

document.addEventListener('touchstart', (e) => {
    isTouching = true;
    touchStartX = e.touches[0].clientX;
    touchCurrentX = targetScroll;
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (!isTouching) return;
    e.preventDefault();
    const touchX = e.touches[0].clientX;
    const diff = touchStartX - touchX;
    targetScroll = touchCurrentX + diff;
    targetScroll = Math.max(0, Math.min(targetScroll, getScrollWidth()));
}, { passive: false });

document.addEventListener('touchend', () => {
    isTouching = false;
});

// Teclado
window.addEventListener('keydown', (e) => {
    const slideWidth = window.innerWidth - 60;
    if (e.key === 'ArrowRight') targetScroll = Math.min(targetScroll + slideWidth, getScrollWidth());
    if (e.key === 'ArrowLeft') targetScroll = Math.max(targetScroll - slideWidth, 0);
});

// Animación
function animate() {
    scrollAmount += (targetScroll - scrollAmount) * ease;
    container.style.transform = `translateX(-${scrollAmount}px)`;
    updateUI();
    requestAnimationFrame(animate);
}

// Iniciar
animate();

// Animación de roles
const roles = ["Procesamiento de Datos", "Automatización", "Fotografía", "Inteligencia Artificial", "Análisis de Datos"];
let roleIndex = 0;
const roleEl = document.getElementById('role-display');

function nextRole() {
    if (!roleEl) return;
    
    roleEl.style.opacity = '0';
    roleEl.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        roleIndex = (roleIndex + 1) % roles.length;
        roleEl.textContent = roles[roleIndex];
        roleEl.style.transition = 'none';
        roleEl.style.transform = 'translateY(10px)';
        
        requestAnimationFrame(() => {
            roleEl.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            roleEl.style.transform = 'translateY(0)';
            roleEl.style.opacity = '1';
        });
    }, 300);
}

// Iniciar rotación de roles
setInterval(nextRole, 2500);
