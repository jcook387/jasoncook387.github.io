document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      
      if (window.scrollY >= (sectionTop - 100)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      
      const href = link.getAttribute('href');
      
      if (href && href.substring(1) === current) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  let scrollTimer;
  window.addEventListener('scroll', () => {
    if (scrollTimer) {
      window.cancelAnimationFrame(scrollTimer);
    }
    
    scrollTimer = window.requestAnimationFrame(() => {
      updateActiveNavLink();
    });
  });

  updateActiveNavLink();
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    
    if (href === '#' || href === '') return;
    
    e.preventDefault();
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
      
      const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
      const targetPosition = targetElement.offsetTop - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      history.pushState(null, null, href);
      
      if (!targetElement.hasAttribute('tabindex')) {
        targetElement.setAttribute('tabindex', '-1');
      }
      targetElement.focus();
    }
  });
});

const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');
const formSuccess = document.getElementById('formSuccess');
const successMessage = document.getElementById('successMessage');

function validateName(name) {
  if (name.trim() === '') {
    return 'Name is required.';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long.';
  }
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes.';
  }
  return '';
}

function validateEmail(email) {
  if (email.trim() === '') {
    return 'Email is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address.';
  }
  return '';
}

function validateMessage(message) {
  if (message.trim() === '') {
    return 'Message is required.';
  }
  if (message.trim().length < 10) {
    return 'Message must be at least 10 characters long.';
  }
  if (message.trim().length > 1000) {
    return 'Message must not exceed 1000 characters.';
  }
  return '';
}

function showError(input, errorElement, message) {
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  input.classList.add('is-invalid');
  input.classList.remove('is-valid');
  input.setAttribute('aria-invalid', 'true');
}

function clearError(input, errorElement) {
  errorElement.textContent = '';
  errorElement.style.display = 'none';
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  input.setAttribute('aria-invalid', 'false');
}

if (nameInput) {
  nameInput.addEventListener('blur', () => {
    const error = validateName(nameInput.value);
    if (error) {
      showError(nameInput, nameError, error);
    } else if (nameInput.value.trim() !== '') {
      clearError(nameInput, nameError);
    }
  });
  
  nameInput.addEventListener('input', () => {
    if (nameError.textContent !== '') {
      const error = validateName(nameInput.value);
      if (!error && nameInput.value.trim() !== '') {
        clearError(nameInput, nameError);
      }
    }
  });
}

if (emailInput) {
  emailInput.addEventListener('blur', () => {
    const error = validateEmail(emailInput.value);
    if (error) {
      showError(emailInput, emailError, error);
    } else if (emailInput.value.trim() !== '') {
      clearError(emailInput, emailError);
    }
  });
  
  emailInput.addEventListener('input', () => {
    if (emailError.textContent !== '') {
      const error = validateEmail(emailInput.value);
      if (!error && emailInput.value.trim() !== '') {
        clearError(emailInput, emailError);
      }
    }
  });
}

if (messageInput) {
  messageInput.addEventListener('blur', () => {
    const error = validateMessage(messageInput.value);
    if (error) {
      showError(messageInput, messageError, error);
    } else if (messageInput.value.trim() !== '') {
      clearError(messageInput, messageError);
    }
  });
  
  messageInput.addEventListener('input', () => {
    if (messageError.textContent !== '') {
      const error = validateMessage(messageInput.value);
      if (!error && messageInput.value.trim() !== '') {
        clearError(messageInput, messageError);
      }
    }
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', () => {
    formSuccess.classList.add('d-none');
    successMessage.textContent = '';
    
    const nameErrorMsg = validateName(nameInput.value);
    const emailErrorMsg = validateEmail(emailInput.value);
    const messageErrorMsg = validateMessage(messageInput.value);
    
    let hasErrors = false;
    
    if (nameErrorMsg) {
      showError(nameInput, nameError, nameErrorMsg);
      hasErrors = true;
    } else if (nameInput.value.trim() !== '') {
      clearError(nameInput, nameError);
    }
    
    if (emailErrorMsg) {
      showError(emailInput, emailError, emailErrorMsg);
      hasErrors = true;
    } else if (emailInput.value.trim() !== '') {
      clearError(emailInput, emailError);
    }
    
    if (messageErrorMsg) {
      showError(messageInput, messageError, messageErrorMsg);
      hasErrors = true;
    } else if (messageInput.value.trim() !== '') {
      clearError(messageInput, messageError);
    }
    
    if (!hasErrors) {
      successMessage.textContent = 'Thank you for your message! I will get back to you soon.';
      formSuccess.classList.remove('d-none');
      
      contactForm.reset();
      
      nameInput.classList.remove('is-valid', 'is-invalid');
      emailInput.classList.remove('is-valid', 'is-invalid');
      messageInput.classList.remove('is-valid', 'is-invalid');
      
      nameError.style.display = 'none';
      emailError.style.display = 'none';
      messageError.style.display = 'none';
      
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      formSuccess.focus();
      
      setTimeout(() => {
        formSuccess.classList.add('d-none');
        successMessage.textContent = '';
      }, 5000);
      
    } else {
      if (nameErrorMsg) {
        nameInput.focus();
      } else if (emailErrorMsg) {
        emailInput.focus();
      } else if (messageErrorMsg) {
        messageInput.focus();
      }
    }
  });
}

const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 0) {
    navbar?.classList.add('shadow');
  } else {
    navbar?.classList.remove('shadow');
  }
  
  lastScroll = currentScroll;
});

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-8px)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });
});

const liveRegion = document.createElement('div');
liveRegion.setAttribute('role', 'status');
liveRegion.setAttribute('aria-live', 'polite');
liveRegion.setAttribute('aria-atomic', 'true');
liveRegion.className = 'visually-hidden';
document.body.appendChild(liveRegion);

function announce(message, priority = 'polite') {
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.textContent = message;
  
  setTimeout(() => {
    liveRegion.textContent = '';
  }, 1000);
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const sectionName = link.textContent.trim();
      announce(`Navigating to ${sectionName} section`);
    }
  });
});

if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach(img => {
    img.setAttribute('loading', 'lazy');
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse) {
        bsCollapse.hide();
      }
    }
  }
});

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

console.log('%c👋 Welcome to Jason Cook\'s Portfolio!', 'font-size: 20px; font-weight: bold; color: #0066cc;');
console.log('%cBuilt with Bootstrap 5.3 and custom JavaScript', 'font-size: 14px; color: #666;');
console.log('%cFully accessible and responsive! 🎉', 'font-size: 14px; color: #28a745;');

document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio website initialized successfully!');
});
