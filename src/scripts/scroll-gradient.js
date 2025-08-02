// Scroll-based gradient effect
let scrollGradientEffect = null;

function initScrollGradient() {
  const gradientElement = document.querySelector('body::before');
  
  function updateGradientOnScroll() {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    
    // Calculate dynamic gradient based on scroll position
    const hueShift = scrollProgress * 60; // Shift hue by up to 60 degrees
    const intensity = 0.1 + (scrollProgress * 0.1); // Increase intensity slightly on scroll
    
    // Update CSS custom property for dynamic gradient
    document.documentElement.style.setProperty('--scroll-gradient-shift', `${hueShift}deg`);
    document.documentElement.style.setProperty('--scroll-gradient-intensity', intensity);
  }
  
  // Throttled scroll listener for performance
  function throttledScrollHandler() {
    if (scrollGradientEffect) return;
    
    scrollGradientEffect = requestAnimationFrame(() => {
      updateGradientOnScroll();
      scrollGradientEffect = null;
    });
  }
  
  window.addEventListener('scroll', throttledScrollHandler, { passive: true });
  
  // Initial call
  updateGradientOnScroll();
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollGradient);
} else {
  initScrollGradient();
}