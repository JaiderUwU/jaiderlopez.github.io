const container = document.querySelector('.horizontal-container');
const progressBar = document.querySelector('.progress-bar');

let scrollAmount = 0;
let targetScroll = 0;
const ease = 0.1;

function getScrollWidth() {
    return container.scrollWidth - window.innerWidth;
}

// Solo en desktop (pantallas grandes)
if (window.innerWidth > 768) {
    // Scroll con rueda del mouse
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        targetScroll += e.deltaY;
        const maxScroll = getScrollWidth();
        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
    }, { passive: false });

    // Animación
    function animate() {
        scrollAmount += (targetScroll - scrollAmount) * ease;
        container.style.transform = `translateX(-${scrollAmount}px)`;
        
        const progress = (scrollAmount / getScrollWidth()) * 100;
        progressBar.style.width = `${progress}%`;
        
        requestAnimationFrame(animate);
    }
    animate();

    // Teclas
    window.addEventListener('keydown', (e) => {
        const scrollStep = window.innerWidth * 0.8;
        
        if (e.key === 'ArrowRight') targetScroll += scrollStep;
        if (e.key === 'ArrowLeft') targetScroll -= scrollStep;
        
        const maxScroll = getScrollWidth();
        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
    });
}
// En móvil: no hacemos nada, dejamos el scroll nativo vertical
