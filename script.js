/**
 * JEEVITHA MANI S - PORTFOLIO INTERACTIVITY SCRIPT
 * Plain JavaScript (ES6+) - Zero dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. THEME SWITCHER (Dark & Light Mode with LocalStorage)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check stored theme or default to dark
  const currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      
      // Update canvas particle colors
      if (typeof updateCanvasTheme === 'function') {
        updateCanvasTheme(newTheme);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. MOBILE NAVIGATION DRAWER
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close mobile menu when clicking any nav link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. STICKY NAVBAR & SCROLLSPY (ACTIVE SECTION HIGHLIGHT)
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Sticky shadow
    if (navbar) {
      if (scrollPos > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Scrollspy highlight
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. ANIMATED TYPING EFFECT (HERO SECTION)
  // --------------------------------------------------------------------------
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const roles = [
      'Electrical & Electronics Engineer',
      'IoT & Embedded Systems Innovator',
      'Hardware & Firmware Developer',
      'Patent Applicant & Researcher'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;

    function type() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 45;
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 95;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        // Pause at end of word
        typingDelay = 1800;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingDelay = 400;
      }

      setTimeout(type, typingDelay);
    }

    setTimeout(type, 600);
  }

  // --------------------------------------------------------------------------
  // 5. ANIMATED NUMBER COUNTERS (STATS SECTION)
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  function countUp(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const isDecimal = element.getAttribute('data-decimal') === 'true';
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';
    const duration = 1800;
    const frameRate = 30;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out cubic
      const currentProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = target * currentProgress;

      if (isDecimal) {
        element.textContent = prefix + currentVal.toFixed(2) + suffix;
      } else {
        element.textContent = prefix + Math.floor(currentVal) + suffix;
      }

      if (frame >= totalFrames) {
        clearInterval(counter);
        element.textContent = prefix + (isDecimal ? target.toFixed(2) : target) + suffix;
      }
    }, frameRate);
  }

  // Intersection Observer for Stats
  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          statNumbers.forEach(stat => countUp(stat));
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // --------------------------------------------------------------------------
  // 6. SCROLL REVEAL ANIMATIONS
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once animated
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => revealObserver.observe(el));

  // --------------------------------------------------------------------------
  // 7. SKILLS CATEGORY FILTER
  // --------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 8. CONTACT FORM (OPENS VISITOR'S EMAIL APP WITH PRE-FILLED CONTENT)
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        alert('Please fill in your Name, Email, and Message.');
        return;
      }

      // Prepare mailto link
      const emailRecipient = 'jeevithasenthil71@gmail.com';
      const mailSubject = encodeURIComponent(subject || `Portfolio Inquiry from ${name}`);
      const mailBody = encodeURIComponent(
        `Hello Jeevitha,\n\n` +
        `My name is ${name} (${email}).\n\n` +
        `Message:\n${message}\n\n` +
        `Best regards,\n${name}`
      );

      const mailtoUrl = `mailto:${emailRecipient}?subject=${mailSubject}&body=${mailBody}`;

      // Open email client
      window.location.href = mailtoUrl;

      // Show user feedback notification
      if (formSuccess) {
        formSuccess.style.display = 'block';
        formSuccess.innerHTML = `
          <div style="margin-top: 1rem; padding: 0.85rem 1rem; background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 8px; color: #34d399; font-size: 0.9rem;">
            ✓ Your email client is opening with your message prepared for Jeevitha! You can review and click send.
          </div>
        `;
        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 7000);
      }

      contactForm.reset();
    });
  }

  // --------------------------------------------------------------------------
  // 9. BACK TO TOP BUTTON
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. INTERACTIVE CIRCUIT CANVAS SIMULATION
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('circuit-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    });

    let currentThemeMode = document.documentElement.getAttribute('data-theme') || 'dark';
    
    window.updateCanvasTheme = function(theme) {
      currentThemeMode = theme;
    };

    // Circuit particle node
    class CircuitNode {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 2 + 1.2;
        this.pulse = Math.random() * Math.PI;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += 0.03;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        const isLight = currentThemeMode === 'light';
        const pulseAlpha = Math.sin(this.pulse) * 0.3 + 0.5;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isLight
          ? `rgba(2, 132, 199, ${pulseAlpha * 0.5})`
          : `rgba(0, 240, 255, ${pulseAlpha * 0.8})`;
        ctx.fill();
      }
    }

    const nodeCount = Math.min(Math.floor((width * height) / 22000), 55);
    let nodes = [];

    function initNodes() {
      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        nodes.push(new CircuitNode());
      }
    }

    initNodes();

    function animate() {
      ctx.clearRect(0, 0, width, height);
      const isLight = currentThemeMode === 'light';
      const maxDistance = 140;

      // Draw connections (circuit traces)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isLight ? 0.08 : 0.16);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            
            // Draw circuit-style 90-degree or direct path
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = isLight
              ? `rgba(2, 132, 199, ${alpha})`
              : `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Update & draw nodes
      nodes.forEach(node => {
        node.update();
        node.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }
});
