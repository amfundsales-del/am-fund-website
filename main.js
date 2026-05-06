document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.replace('ph-list', 'ph-x');
        } else {
            icon.classList.replace('ph-x', 'ph-list');
        }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileToggle.querySelector('i').classList.replace('ph-x', 'ph-list');
        });
    });

    // 3. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 4. Animated Counters
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // lower is faster

    const startCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetEl = entry.target;
                const countersInTarget = targetEl.querySelectorAll('.counter');
                
                countersInTarget.forEach(counter => {
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText.replace(/,/g, '');
                        
                        // Lower inc to slow and higher to speed up
                        const inc = target / speed;

                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc).toLocaleString('en-IN');
                            setTimeout(updateCount, 15);
                        } else {
                            counter.innerText = target.toLocaleString('en-IN');
                        }
                    };
                    updateCount();
                });
                observer.unobserve(targetEl);
            }
        });
    };

    const counterObserver = new IntersectionObserver(startCounters, {
        threshold: 0.5
    });

    // Observe sections that contain counters
    const statSections = document.querySelectorAll('.hero-stats, .trust-grid, .performance-stats');
    statSections.forEach(section => {
        counterObserver.observe(section);
    });

    // 5. FAQ Accordion
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Close other open items
            const currentActive = document.querySelector('.accordion-item.active');
            if (currentActive && currentActive !== item) {
                currentActive.classList.remove('active');
                currentActive.querySelector('.accordion-content').style.maxHeight = null;
            }

            // Toggle current item
            item.classList.toggle('active');
            const content = item.querySelector('.accordion-content');
            
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // 6. Contact Form Submission Handling
    const partnerForm = document.getElementById('partnerForm');
    if (partnerForm) {
        partnerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect form data
            const btn = partnerForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            
            // Show loading state
            btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Submitting...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                btn.innerHTML = '<i class="ph-fill ph-check-circle"></i> Application Submitted';
                btn.style.backgroundColor = '#10B981'; // green
                
                // Reset form
                partnerForm.reset();

                // Reset button after 3 seconds
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

});
