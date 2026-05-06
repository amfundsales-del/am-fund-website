document.addEventListener('DOMContentLoaded', () => {

  // --- Header Scroll Effect ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Animated Counters ---
  const counters = document.querySelectorAll('.counter');
  const speed = 200;

  const animateCounters = () => {
    counters.forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText.replace(/,/g, '');

        const inc = target / speed;

        if (count < target) {
          counter.innerText = Math.ceil(count + inc).toLocaleString();
          setTimeout(updateCount, 10);
        } else {
          counter.innerText = target.toLocaleString();
        }
      };
      updateCount();
    });
  };

  // --- Intersection Observer for Scroll Reveals & Counters ---
  const revealElements = document.querySelectorAll('.reveal');
  const achievementSection = document.querySelector('.achievements');
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // Handle Reveals
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Handle Counters if this is the achievement section or a counter box
        if (entry.target.classList.contains('achievements') || entry.target.classList.contains('counter-box')) {
           // We only want to trigger counter animation once
           if(!entry.target.dataset.counted) {
              animateCounters();
              entry.target.dataset.counted = true;
           }
        }

        // Optional: Stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all reveal elements
  revealElements.forEach(el => observer.observe(el));
  
  // Explicitly observe achievements if it exists but doesn't have reveal class
  if (achievementSection && !achievementSection.classList.contains('reveal')) {
      observer.observe(achievementSection);
  }

});
