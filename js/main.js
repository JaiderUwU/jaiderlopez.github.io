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

// FUNCIÓN GLOBAL para ir a un slide
window.goToSlide = function(index) {
    const slideWidth = window.innerWidth - 60;
    targetScroll = index * slideWidth;
    targetScroll = Math.max(0, Math.min(targetScroll, getScrollWidth()));
};

// Actualizar UI
function updateUI() {
    const slideWidth = window.innerWidth - 60;
    const currentIndex = Math.round(scrollAmount / slideWidth);
    const clampedIndex = Math.max(0, Math.min(currentIndex, TOTAL - 1));

    // Contador de páginas
    const pageNum = String(clampedIndex + 1).padStart(2, '0');
    const pageCurrent = document.getElementById('slideCurrentNum');
    if (pageCurrent) pageCurrent.textContent = pageNum;

    // Título
    const titleEl = document.getElementById('slideTitleDisplay');
    if (titleEl) titleEl.textContent = panels[clampedIndex]?.dataset?.title || '';

    // Contador de fotos
    const photoCounter = document.getElementById('photoCounter');
    const photoCurrentNum = document.getElementById('photoCurrentNum');
    
    if (photoCounter && photoCurrentNum) {
        if (clampedIndex >= 1 && clampedIndex <= 6) {
            photoCounter.style.display = 'flex';
            photoCurrentNum.textContent = clampedIndex;
        } else {
            photoCounter.style.display = 'none';
        }
    }

    // Menú activo
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', parseInt(el.dataset.slide) === clampedIndex);
    });

    // Progress bar
    if (progressFill) {
        const max = getScrollWidth();
        progressFill.style.width = `${max > 0 ? (scrollAmount / max) * 100 : 0}%`;
    }
}

// Scroll con rueda
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
    if (container) {
        container.style.transform = `translateX(-${scrollAmount}px)`;
    }
    updateUI();
    requestAnimationFrame(animate);
}

// Iniciar
if (container && panels.length > 0) {
    animate();
} else {
    console.error('Error: No se encontró el contenedor o los paneles');
}

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

if (roleEl) {
    setInterval(nextRole, 2500);
}
