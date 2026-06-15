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
  initQuoteModal();
  initChatWidget();
  initNavigatorTabs();
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

/* ==========================================================================
   Get a Quote Modal Logic (New)
   ========================================================================== */
function initQuoteModal() {
  const modal = document.getElementById('quote-modal');
  const openBtns = document.querySelectorAll('.open-quote-btn');
  const closeBtn = document.getElementById('modal-close-btn');
  const form = document.getElementById('quote-form');
  const successMsg = document.getElementById('modal-success-message');
  const closeSuccessBtn = document.getElementById('close-success-modal-btn');
  
  if (!modal) return;
  
  const openModal = () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Reset state after transition completes
    setTimeout(() => {
      form.style.display = 'block';
      successMsg.style.display = 'none';
      form.reset();
    }, 400);
  };
  
  openBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));
  
  closeBtn.addEventListener('click', closeModal);
  closeSuccessBtn.addEventListener('click', closeModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    // Simulate server request
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      form.style.display = 'none';
      successMsg.style.display = 'block';
    }, 1000);
  });
}

/* ==========================================================================
   Chat Widget Logic (New)
   ========================================================================== */
function initChatWidget() {
  const toggleBtn = document.getElementById('chat-toggle-btn');
  const chatBox = document.getElementById('chat-box');
  const closeBtn = document.getElementById('chat-close-btn');
  const badge = document.getElementById('chat-badge');
  const messagesContainer = document.getElementById('chat-messages');
  const inputForm = document.getElementById('chat-input-form');
  const msgInput = document.getElementById('chat-message-input');
  const repliesContainer = document.getElementById('chat-quick-replies');
  
  if (!toggleBtn || !chatBox) return;
  
  let isChatStarted = false;
  
  const toggleChat = () => {
    const isOpen = chatBox.classList.contains('open');
    if (isOpen) {
      chatBox.classList.remove('open');
      chatBox.setAttribute('aria-hidden', 'true');
    } else {
      chatBox.classList.add('open');
      chatBox.setAttribute('aria-hidden', 'false');
      badge.classList.add('hidden'); // Clear badge on first open
      
      if (!isChatStarted) {
        startChat();
      }
    }
  };
  
  toggleBtn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);
  
  const appendMessage = (sender, text) => {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-msg', sender === 'bot' ? 'chat-msg-bot' : 'chat-msg-user');
    msgDiv.textContent = text;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };
  
  const showTypingIndicator = () => {
    const indicatorDiv = document.createElement('div');
    indicatorDiv.classList.add('chat-msg', 'chat-msg-bot', 'chat-typing-indicator');
    indicatorDiv.innerHTML = '<span style="display:inline-block;animation:bounce 1.4s infinite ease-in-out;width:6px;height:6px;background:#8A8A8A;border-radius:50%;margin:0 2px;"></span><span style="display:inline-block;animation:bounce 1.4s infinite ease-in-out 0.2s;width:6px;height:6px;background:#8A8A8A;border-radius:50%;margin:0 2px;"></span><span style="display:inline-block;animation:bounce 1.4s infinite ease-in-out 0.4s;width:6px;height:6px;background:#8A8A8A;border-radius:50%;margin:0 2px;"></span>';
    messagesContainer.appendChild(indicatorDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add bounce animation style inline if not in css
    if (!document.getElementById('bounce-animation-style')) {
      const style = document.createElement('style');
      style.id = 'bounce-animation-style';
      style.textContent = '@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }';
      document.head.appendChild(style);
    }
    
    return indicatorDiv;
  };
  
  const botReply = (text, delay = 1000) => {
    const indicator = showTypingIndicator();
    setTimeout(() => {
      indicator.remove();
      appendMessage('bot', text);
    }, delay);
  };
  
  const quickReplies = [
    { label: 'File ITR 📄', text: 'I want to file my Income Tax Return (ITR).' },
    { label: 'GST Help 💼', text: 'I need assistance with GST Registration or Return Filing.' },
    { label: 'Company Setup 🏢', text: 'I want to register a new Private Limited Company or LLP.' },
    { label: 'Get a Quote 💰', text: 'I want to request a custom pricing quote.' }
  ];
  
  const renderQuickReplies = () => {
    repliesContainer.innerHTML = '';
    quickReplies.forEach(reply => {
      const btn = document.createElement('button');
      btn.classList.add('quick-reply-btn');
      btn.textContent = reply.label;
      btn.addEventListener('click', () => {
        handleUserMessage(reply.text);
      });
      repliesContainer.appendChild(btn);
    });
  };
  
  const handleUserMessage = (text) => {
    if (!text.trim()) return;
    
    // Append user message
    appendMessage('user', text);
    
    // Determine response
    const lowerText = text.toLowerCase();
    let reply = "Thanks for your message! Our tax consultants will get back to you shortly. You can also request an instant pricing estimate by clicking 'Get a Quote' at the bottom.";
    
    if (lowerText.includes('itr') || lowerText.includes('income tax')) {
      reply = "For Income Tax Return filing, we handle salaried individuals, professionals, and corporate returns. We will need your Form 16, bank statements, and investment details. Would you like to schedule a callback?";
    } else if (lowerText.includes('gst')) {
      reply = "We offer complete GST support: registrations, monthly/quarterly returns, and ITC reconciliations. Our packages start from ₹1,500/month. Let us know if you want our team to call you.";
    } else if (lowerText.includes('company') || lowerText.includes('pvt ltd') || lowerText.includes('register') || lowerText.includes('llp')) {
      reply = "We specialize in registering Private Limited Companies, LLPs, One Person Companies, and MSMEs. Incorporation typically takes 5-7 working days. Would you like us to share the document checklist?";
    } else if (lowerText.includes('quote') || lowerText.includes('pricing') || lowerText.includes('cost') || lowerText.includes('fee')) {
      reply = "Our pricing is transparent and fixed. You can request a custom proposal directly. Alternatively, leave your phone number here and a partner will call you in 1 hour.";
    } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
      reply = "Hello! I am the virtual assistant for SR Tax Consulting. How can I help you with your filing or registration requirements today?";
    }
    
    botReply(reply);
  };
  
  const startChat = () => {
    isChatStarted = true;
    appendMessage('bot', "Hello! Thank you for visiting SR Tax Consulting. How can we help you with your tax filing, business registration, or compliance today?");
    renderQuickReplies();
  };
  
  inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = msgInput.value;
    msgInput.value = '';
    handleUserMessage(text);
  });
}

/* ==========================================================================
   Financial Navigator Tabs Logic (New)
   ========================================================================== */
function initNavigatorTabs() {
  const tabButtons = document.querySelectorAll('.navigator-tab-btn');
  const tabPanels = document.querySelectorAll('.navigator-panel');
  
  if (tabButtons.length === 0) return;
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Deactivate all buttons
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      
      // Activate clicked button
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      
      // Hide all panels
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        panel.style.display = 'none';
      });
      
      // Show selected panel
      const targetPanelId = button.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.style.display = 'block';
      }
    });
  });
}
