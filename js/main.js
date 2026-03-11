// ── ROLES ANIMADOS ──
const roles = ["Procesamiento de Datos","Automatización","Fotografía","Inteligencia Artificial","Análisis de Datos"];
let roleIndex = 0;
const roleEl = document.getElementById('role-display');
function nextRole() {
    roleEl.style.opacity = '0';
    roleEl.style.transform = 'translateY(-8px)';
    setTimeout(() => {
        roleIndex = (roleIndex + 1) % roles.length;
        roleEl.textContent = roles[roleIndex];
        roleEl.style.transition = 'none';
        roleEl.style.transform = 'translateY(8px)';
        roleEl.style.opacity = '0';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            roleEl.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            roleEl.style.transform = 'translateY(0)';
            roleEl.style.opacity = '1';
        }));
    }, 400);
}
setTimeout(() => setInterval(nextRole, 2500), 2000);

// ── SCROLL HORIZONTAL ──
const container = document.getElementById('hContainer');
const progressFill = document.getElementById('progressFill');
const panels = Array.from(document.querySelectorAll('.panel'));
const TOTAL = panels.length;
let scrollAmount = 0, targetScroll = 0;
const ease = 0.1;

const getScrollWidth = () => container.scrollWidth - window.innerWidth;

// ── NAV: ir a slide ──
function goToSlide(index) {
    const slideWidth = window.innerWidth;
    targetScroll = index * slideWidth;
    targetScroll = Math.max(0, Math.min(targetScroll, getScrollWidth()));
}

// ── ACTUALIZAR NAV Y CONTADOR ──
function updateUI() {
    const slideWidth = window.innerWidth;
    const currentIndex = Math.round(scrollAmount / slideWidth);
    const clampedIndex = Math.max(0, Math.min(currentIndex, TOTAL - 1));

    // Contador
    const num = String(clampedIndex + 1).padStart(2, '0');
    document.getElementById('slideCurrentNum').textContent = num;

    // Título
    const title = panels[clampedIndex]?.dataset?.title || '';
    document.getElementById('slideTitleDisplay').textContent = title;

    // Nav activo
    document.querySelectorAll('.nav-item[data-slide]').forEach(el => {
        el.classList.toggle('active', parseInt(el.dataset.slide) === clampedIndex);
    });

    // Progress
    const max = getScrollWidth();
    progressFill.style.width = `${max > 0 ? (scrollAmount / max) * 100 : 0}%`;
}

// ── RUEDA ──
window.addEventListener('wheel', (e) => {
    e.preventDefault();
    targetScroll = Math.max(0, Math.min(targetScroll + e.deltaY, getScrollWidth()));
}, { passive: false });

// ── TOUCH ──
let touchStartX = 0, touchCurrentX = 0, isTouching = false;
let velocity = 0, lastTouchX = 0, lastTime = 0;

document.addEventListener('touchstart', (e) => {
    isTouching = true; touchStartX = e.touches[0].clientX;
    touchCurrentX = targetScroll; lastTouchX = touchStartX;
    lastTime = Date.now(); velocity = 0;
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (!isTouching) return;
    e.preventDefault();
    const tx = e.touches[0].clientX, now = Date.now(), dt = now - lastTime;
    if (dt > 0) velocity = (lastTouchX - tx) / dt;
    lastTouchX = tx; lastTime = now;
    targetScroll = Math.max(0, Math.min(touchCurrentX + (touchStartX - tx), getScrollWidth()));
}, { passive: false });

document.addEventListener('touchend', () => {
    isTouching = false;
    targetScroll = Math.max(0, Math.min(targetScroll + velocity * 200, getScrollWidth()));
});

// ── TECLADO ──
window.addEventListener('keydown', (e) => {
    const step = window.innerWidth;
    if (e.key === 'ArrowRight') targetScroll = Math.min(targetScroll + step, getScrollWidth());
    if (e.key === 'ArrowLeft') targetScroll = Math.max(targetScroll - step, 0);
});

// ── ANIMACIÓN ──
function animate() {
    scrollAmount += (targetScroll - scrollAmount) * ease;
    container.style.transform = `translateX(-${scrollAmount}px)`;
    updateUI();
    requestAnimationFrame(animate);
}
animate();
