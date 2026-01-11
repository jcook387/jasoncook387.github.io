// ============================================
// BOOTSTRAP PORTFOLIO - JAVASCRIPT
// Student-Friendly Version with Detailed Comments
// ============================================

// ============================================
// ACTIVE NAVIGATION LINK HIGHLIGHTING
// Updates which nav link is "active" based on scroll position
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Get all sections that have an ID (home, about, projects, etc.)
  const sections = document.querySelectorAll('section[id]');
  
  // Get all navigation links
  const navLinks = document.querySelectorAll('.nav-link');

  // Function to check which section is currently visible
  function updateActiveNavLink() {
    let current = '';  // Will hold the ID of the current section
    
    // Loop through each section
    sections.forEach(section => {
      const sectionTop = section.offsetTop;      // Distance from top of page
      const sectionHeight = section.clientHeight; // Height of the section
      
      // Check if we've scrolled to this section
      // Subtract 100 so we highlight the link a bit before reaching the section
      if (window.scrollY >= (sectionTop - 100)) {
        current = section.getAttribute('id');  // Store this section's ID
      }
    });
    
    // Update the nav links
    navLinks.forEach(link => {
      // Remove active class and aria-current from all links
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      
      // Get the href attribute (like "#home" or "#about")
      const href = link.getAttribute('href');
      
      // If this link matches the current section
      if (href && href.substring(1) === current) {
        link.classList.add('active');  // Add active class for styling
        link.setAttribute('aria-current', 'page');  // For screen readers
      }
    });
  }

  // THROTTLE: Limit how often this runs for better performance
  // Instead of running on every single scroll, we use requestAnimationFrame
  let scrollTimer;
  window.addEventListener('scroll', () => {
    // Cancel previous animation frame if it exists
    if (scrollTimer) {
      window.cancelAnimationFrame(scrollTimer);
    }
    
    // Schedule the function to run on the next animation frame
    scrollTimer = window.requestAnimationFrame(() => {
      updateActiveNavLink();
    });
  });

  // Run once when page loads
  updateActiveNavLink();
});

// ============================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// Makes clicking nav links scroll smoothly instead of jumping
// ============================================

// Find all links that start with # (anchor links)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    
    // Don't do anything for empty hash or just "#"
    if (href === '#' || href === '') return;
    
    // Prevent the default jump behavior
    e.preventDefault();
    
    // Get the ID without the # symbol
    const targetId = href.substring(1);
    // Find the element with that ID
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // CLOSE MOBILE MENU if it's open
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        // Get Bootstrap's collapse instance
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();  // Close the menu
        }
      }
      
      // Calculate where to scroll to (account for navbar height)
      const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
      const targetPosition = targetElement.offsetTop - navbarHeight;
      
      // Scroll smoothly to the target position
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'  // This makes it smooth!
      });
      
      // Update the URL without causing a jump
      history.pushState(null, null, href);
      
      // Focus on the target for accessibility
      if (!targetElement.hasAttribute('tabindex')) {
        targetElement.setAttribute('tabindex', '-1');  // Make it focusable
      }
      targetElement.focus();  // Move keyboard focus to the section
    }
  });
});

// ============================================
// FORM VALIDATION
// Validates the contact form fields
// ============================================

// Get all the form elements we need
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');
const formSuccess = document.getElementById('formSuccess');
const successMessage = document.getElementById('successMessage');

// ============================================
// VALIDATION FUNCTIONS
// Each function returns an error message or empty string if valid
// ============================================

// Validate name field
function validateName(name) {
  // Check if empty
  if (name.trim() === '') {
    return 'Name is required.';
  }
  // Check minimum length
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long.';
  }
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes.';
  }
  return '';  // No error
}

// Validate email field
function validateEmail(email) {
  // Check if empty
  if (email.trim() === '') {
    return 'Email is required.';
  }
  // Regular expression to check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address.';
  }
  return '';  // No error
}

// Validate message field
function validateMessage(message) {
  // Check if empty
  if (message.trim() === '') {
    return 'Message is required.';
  }
  // Check minimum length
  if (message.trim().length < 10) {
    return 'Message must be at least 10 characters long.';
  }
  // Check maximum length
  if (message.trim().length > 1000) {
    return 'Message must not exceed 1000 characters.';
  }
  return '';  // No error
}

// ============================================
// SHOW/HIDE ERROR MESSAGES
// These functions add/remove Bootstrap's validation classes
// ============================================

// Show error message and style input as invalid
function showError(input, errorElement, message) {
  errorElement.textContent = message;  // Set the error message text
  errorElement.style.display = 'block';  // Make it visible
  input.classList.add('is-invalid');  // Bootstrap's invalid class (red border)
  input.classList.remove('is-valid');  // Remove valid class if present
  input.setAttribute('aria-invalid', 'true');  // For screen readers
}

// Clear error message and style input as valid
function clearError(input, errorElement) {
  errorElement.textContent = '';  // Remove error text
  errorElement.style.display = 'none';  // Hide error message
  input.classList.remove('is-invalid');  // Remove invalid styling
  input.classList.add('is-valid');  // Add valid styling (green border)
  input.setAttribute('aria-invalid', 'false');  // For screen readers
}

// ============================================
// REAL-TIME VALIDATION (on blur)
// Validate fields when user leaves the input
// ============================================

// Validate name when user leaves the field
if (nameInput) {
  nameInput.addEventListener('blur', () => {
    const error = validateName(nameInput.value);
    if (error) {
      showError(nameInput, nameError, error);
    } else if (nameInput.value.trim() !== '') {
      clearError(nameInput, nameError);
    }
  });
  
  // Clear error as user types (if there was an error)
  nameInput.addEventListener('input', () => {
    if (nameError.textContent !== '') {
      const error = validateName(nameInput.value);
      if (!error && nameInput.value.trim() !== '') {
        clearError(nameInput, nameError);
      }
    }
  });
}

// Validate email when user leaves the field
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

// Validate message when user leaves the field
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

// ============================================
// FORM SUBMISSION
// Handle the form when user clicks "Send Message"
// ============================================

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    // Prevent the form from actually submitting (we're doing a simulation)
    e.preventDefault();
    
    // Hide any previous success message
    formSuccess.classList.add('d-none');
    successMessage.textContent = '';
    
    // Validate ALL fields
    const nameErrorMsg = validateName(nameInput.value);
    const emailErrorMsg = validateEmail(emailInput.value);
    const messageErrorMsg = validateMessage(messageInput.value);
    
    let hasErrors = false;  // Track if there are any errors
    
    // Check name field
    if (nameErrorMsg) {
      showError(nameInput, nameError, nameErrorMsg);
      hasErrors = true;
    } else if (nameInput.value.trim() !== '') {
      clearError(nameInput, nameError);
    }
    
    // Check email field
    if (emailErrorMsg) {
      showError(emailInput, emailError, emailErrorMsg);
      hasErrors = true;
    } else if (emailInput.value.trim() !== '') {
      clearError(emailInput, emailError);
    }
    
    // Check message field
    if (messageErrorMsg) {
      showError(messageInput, messageError, messageErrorMsg);
      hasErrors = true;
    } else if (messageInput.value.trim() !== '') {
      clearError(messageInput, messageError);
    }
    
    // If everything is valid, "submit" the form
    if (!hasErrors) {
      // In a real application, you would send this data to a server
      // For this demo, we just show a success message
      
      // Show success message
      successMessage.textContent = 'Thank you for your message! I will get back to you soon.';
      formSuccess.classList.remove('d-none');
      
      // Clear the form fields
      contactForm.reset();
      
      // Remove all validation styling
      nameInput.classList.remove('is-valid', 'is-invalid');
      emailInput.classList.remove('is-valid', 'is-invalid');
      messageInput.classList.remove('is-valid', 'is-invalid');
      
      // Hide error messages
      nameError.style.display = 'none';
      emailError.style.display = 'none';
      messageError.style.display = 'none';
      
      // Scroll to success message so user sees it
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      // Focus on success message for screen readers
      formSuccess.focus();
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        formSuccess.classList.add('d-none');
        successMessage.textContent = '';
      }, 5000);  // 5000 milliseconds = 5 seconds
      
    } else {
      // If there are errors, focus on the first error field
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

// ============================================
// DYNAMIC YEAR IN FOOTER
// Automatically shows current year
// ============================================

const yearSpan = document.getElementById('year');
if (yearSpan) {
  // Get current year and put it in the span
  yearSpan.textContent = new Date().getFullYear();
}

// ============================================
// NAVBAR BEHAVIOR ON SCROLL
// Adds shadow to navbar when scrolling down
// ============================================

let lastScroll = 0;  // Keep track of scroll position
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;  // Current scroll position
  
  // Add shadow when scrolled away from top
  if (currentScroll > 0) {
    navbar?.classList.add('shadow');  // ?. is "optional chaining" - only runs if navbar exists
  } else {
    navbar?.classList.remove('shadow');
  }
  
  lastScroll = currentScroll;  // Remember this scroll position
});

// ============================================
// CARD HOVER EFFECTS
// Extra hover effects for project cards
// ============================================

document.querySelectorAll('.project-card').forEach(card => {
  // When mouse enters the card
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-8px)';  // Move up 8 pixels
  });
  
  // When mouse leaves the card
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';  // Move back to original position
  });
});

// ============================================
// ACCESSIBILITY ANNOUNCEMENTS
// Creates a hidden area for screen reader announcements
// ============================================

// Create a hidden div for screen reader announcements
const liveRegion = document.createElement('div');
liveRegion.setAttribute('role', 'status');
liveRegion.setAttribute('aria-live', 'polite');  // Announce politely (not interrupting)
liveRegion.setAttribute('aria-atomic', 'true');  // Read entire message
liveRegion.className = 'visually-hidden';  // Bootstrap class to hide visually but keep for screen readers
document.body.appendChild(liveRegion);

// Function to announce a message to screen readers
function announce(message, priority = 'polite') {
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.textContent = message;  // Screen reader will read this
  
  // Clear the message after 1 second
  setTimeout(() => {
    liveRegion.textContent = '';
  }, 1000);
}

// Announce when navigating to a new section
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const sectionName = link.textContent.trim();
      announce(`Navigating to ${sectionName} section`);
    }
  });
});

// ============================================
// LAZY LOADING IMAGES
// Only load images when they're about to be visible
// ============================================

// Check if browser supports lazy loading
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach(img => {
    img.setAttribute('loading', 'lazy');  // Browser will handle the lazy loading
  });
}

// ============================================
// KEYBOARD NAVIGATION ENHANCEMENT
// Better keyboard support
// ============================================

document.addEventListener('keydown', (e) => {
  // Close mobile menu when user presses Escape key
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

// ============================================
// TOOLTIP INITIALIZATION
// Initialize Bootstrap tooltips (if you add any)
// ============================================

// Find all elements with data-bs-toggle="tooltip"
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
// Initialize each tooltip
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// ============================================
// CONSOLE MESSAGES
// Fun messages in the browser console!
// ============================================

console.log('%c👋 Welcome to Jason Cook\'s Portfolio!', 'font-size: 20px; font-weight: bold; color: #0066cc;');
console.log('%cBuilt with Bootstrap 5.3 and custom JavaScript', 'font-size: 14px; color: #666;');
console.log('%cFully accessible and responsive! 🎉', 'font-size: 14px; color: #28a745;');

// ============================================
// INITIALIZATION COMPLETE
// Log when everything is ready
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio website initialized successfully!');
});