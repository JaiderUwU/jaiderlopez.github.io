function updateUI() {
    const slideWidth = window.innerWidth - 60;
    const currentIndex = Math.round(scrollAmount / slideWidth);
    const clampedIndex = Math.max(0, Math.min(currentIndex, TOTAL - 1));

    // Contador de páginas (arriba derecha)
    const pageNum = String(clampedIndex + 1).padStart(2, '0');
    document.getElementById('slideCurrentNum').textContent = pageNum;

    // Título de sección
    const title = panels[clampedIndex]?.dataset?.title || '';
    document.getElementById('slideTitleDisplay').textContent = title;

    // Contador de fotos (solo en slides 1-6)
    const photoCounter = document.getElementById('photoCounter');
    const photoCurrentNum = document.getElementById('photoCurrentNum');
    
    if (clampedIndex >= 1 && clampedIndex <= 6) {
        photoCounter.style.display = 'flex';
        photoCurrentNum.textContent = clampedIndex; // 1, 2, 3, 4, 5, 6
    } else {
        photoCounter.style.display = 'none';
    }

    // Menú activo
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', parseInt(el.dataset.slide) === clampedIndex);
    });

    // Progress bar
    const max = getScrollWidth();
    progressFill.style.width = `${max > 0 ? (scrollAmount / max) * 100 : 0}%`;
}
