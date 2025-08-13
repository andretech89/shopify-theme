// Homepage JavaScript - Animations and Interactions

function initGridAnimations() {
  if ('IntersectionObserver' in window) {
    const gridItems = document.querySelectorAll('.featured-grid-item');
    
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animated');
          }, index * 100); 
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
    });
    
    gridItems.forEach(item => {
      observer.observe(item);
    });
  } else {
      // Fallback for browsers that don't support IntersectionObserver
      const gridItems = document.querySelectorAll('.featured-grid-item');
      gridItems.forEach(item => item.classList.add('animated'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    initGridAnimations();
    
    // Add smooth scrolling for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});