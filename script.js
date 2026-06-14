document.addEventListener('DOMContentLoaded', () => {
  initPageLoadAnimations();
  initHeaderScroll();
  initMobileNav();
  initScrollReveal();
  initTestimonials();
  initActiveNavHighlighting();
  initContactForm();
  initSmoothScroll();
  initServicesAccordion();
  initFloatingActions();
});

/* ==========================================================================
   Page Load Animations (Staggered Hero Entrance)
   ========================================================================== */
function initPageLoadAnimations() {
  const elementsToFade = document.querySelectorAll('.hero-fade-in');
  elementsToFade.forEach((el, index) => {
    // Stagger each element by 120ms
    setTimeout(() => {
      el.classList.add('load-fade-active');
    }, index * 120);
  });
}

/* ==========================================================================
   Header Scroll State (Border & Shadow Reveal)
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  // Run once on load to catch current position
  handleScroll();
}

/* ==========================================================================
   Mobile Navigation Drawer Logic
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');
  
  const toggleMenu = () => {
    const isOpen = toggleBtn.classList.contains('open');
    if (isOpen) {
      toggleBtn.classList.remove('open');
      mobileNav.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      toggleBtn.classList.add('open');
      mobileNav.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden'; // Prevents background scroll
    }
  };

  toggleBtn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);
  
  // Close menu when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('open');
      mobileNav.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   Scroll-driven Reveal System (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  // Check if reduced motion is requested
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters fully
  });
  
  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   Testimonial Crossfade Carousel
   ========================================================================== */
function initTestimonials() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dots .dot');
  
  if (slides.length === 0) return;
  
  let currentIdx = 0;
  let intervalId = null;
  const ROTATION_TIME = 8000; // 8 seconds cycle
  
  const showSlide = (index) => {
    // Clean states
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Set active
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentIdx = index;
  };
  
  const startAutoplay = () => {
    stopAutoplay();
    intervalId = setInterval(() => {
      let nextIdx = (currentIdx + 1) % slides.length;
      showSlide(nextIdx);
    }, ROTATION_TIME);
  };
  
  const stopAutoplay = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
  
  // Handle dots interactivity
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startAutoplay(); // Reset timer upon user interaction
    });
  });
  
  // Setup hover pausing
  const container = document.querySelector('.testimonial-container');
  if (container) {
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);
  }
  
  // Initialize
  showSlide(0);
  startAutoplay();
}

/* ==========================================================================
   Active Navigation Highlight (Scrollspy)
   ========================================================================== */
function initActiveNavHighlighting() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (sections.length === 0) return;

  const highlightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3, // Trigger when 30% of section is visible
    rootMargin: '-80px 0px -40% 0px' // Adjust for header height
  });
  
  sections.forEach(sec => highlightObserver.observe(sec));
}

/* ==========================================================================
   Contact Form Validation & Feedback Toast
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('consultation-form');
  const formWrapper = document.querySelector('.contact-form-wrapper');
  const successMessage = document.querySelector('.form-success-message');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Perform simple HTML5 validation check
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    // Get form values (can be used for debugging or API submission)
    const formData = {
      name: document.getElementById('form-name').value,
      email: document.getElementById('form-email').value,
      phone: document.getElementById('form-phone').value,
      inquiry: document.getElementById('form-inquiry').value,
      message: document.getElementById('form-message').value
    };
    
    // Simulate API request and show success message
    const submitButton = form.querySelector('button[type="submit"]');
    const originalBtnText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    setTimeout(() => {
      // Fade out form wrapper and show success message
      form.style.display = 'none';
      successMessage.style.display = 'block';
      
      // Scroll to the contact section top smoothly so the user sees the confirmation
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const headerOffset = 80;
        const elementPosition = contactSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 1200);
  });
}

/* ==========================================================================
   Smooth Scrolling for Local Anchor Links
   ========================================================================== */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        const headerOffset = 80; // height of the sticky nav
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   Services Accordion Logic (Mobile Only)
   ========================================================================== */
function initServicesAccordion() {
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    // Make cards keyboard-accessible on mobile
    if (window.innerWidth < 768) {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-expanded', 'false');
    }

    const toggleAccordion = () => {
      if (window.innerWidth >= 768) return;
      
      const isOpen = card.classList.contains('open');
      
      // Close other accordions
      serviceCards.forEach(c => {
        c.classList.remove('open');
        c.setAttribute('aria-expanded', 'false');
      });
      
      if (!isOpen) {
        card.classList.add('open');
        card.setAttribute('aria-expanded', 'true');
      }
    };

    card.addEventListener('click', toggleAccordion);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordion();
      }
    });
  });
  
  // Re-adjust accessibility properties on window resize
  window.addEventListener('resize', () => {
    serviceCards.forEach(card => {
      if (window.innerWidth >= 768) {
        card.removeAttribute('tabindex');
        card.removeAttribute('role');
        card.removeAttribute('aria-expanded');
        card.classList.remove('open');
      } else {
        if (!card.hasAttribute('tabindex')) {
          card.setAttribute('tabindex', '0');
          card.setAttribute('role', 'button');
          card.setAttribute('aria-expanded', card.classList.contains('open') ? 'true' : 'false');
        }
      }
    });
  });
}

/* ==========================================================================
   Floating Action Buttons (Go to Top Scroll & Hover Visibility)
   ========================================================================== */
function initFloatingActions() {
  const backToTopBtn = document.getElementById('btn-back-to-top');
  
  if (!backToTopBtn) return;
  
  const handleScroll = () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
