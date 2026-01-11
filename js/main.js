// Accessible responsive nav + simple form validation

(function () {
  const toggleBtn = document.querySelector(".nav__toggle");
  const navLinks = document.querySelector("#primary-navigation");
  const navAnchors = navLinks ? navLinks.querySelectorAll("a") : [];

  // Footer year
  const yearEl = document.querySelector("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu toggle
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));

      // If opening, move focus to first link for keyboard users
      if (isOpen && navAnchors.length) navAnchors[0].focus();
    });

    // Close menu on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("is-open")) {
        navLinks.classList.remove("is-open");
        toggleBtn.setAttribute("aria-expanded", "false");
        toggleBtn.focus();
      }
    });

    // Close menu after clicking a link (mobile)
    navAnchors.forEach((a) => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        toggleBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // aria-current handling on scroll/click
  function setCurrent(hash) {
    navAnchors.forEach((a) => a.removeAttribute("aria-current"));
    const active = Array.from(navAnchors).find((a) => a.getAttribute("href") === hash);
    if (active) active.setAttribute("aria-current", "page");
  }

  navAnchors.forEach((a) => {
    a.addEventListener("click", () => setCurrent(a.getAttribute("href")));
  });

  // Contact form validation (optional requirement)
  const form = document.querySelector("#contactForm");
  if (form) {
    const nameEl = document.querySelector("#name");
    const emailEl = document.querySelector("#email");
    const messageEl = document.querySelector("#message");

    const nameErr = document.querySelector("#nameError");
    const emailErr = document.querySelector("#emailError");
    const messageErr = document.querySelector("#messageError");
    const successEl = document.querySelector("#formSuccess");

    function showError(el, errEl, msg) {
      if (!errEl) return;
      errEl.textContent = msg;
      errEl.hidden = false;
      el.setAttribute("aria-invalid", "true");
    }

    function clearError(el, errEl) {
      if (!errEl) return;
      errEl.textContent = "";
      errEl.hidden = true;
      el.removeAttribute("aria-invalid");
    }

    function isValidEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (successEl) {
        successEl.hidden = true;
        successEl.textContent = "";
      }

      let ok = true;

      if (!nameEl.value.trim()) {
        showError(nameEl, nameErr, "Please enter your name.");
        ok = false;
      } else clearError(nameEl, nameErr);

      if (!emailEl.value.trim()) {
        showError(emailEl, emailErr, "Please enter your email address.");
        ok = false;
      } else if (!isValidEmail(emailEl.value.trim())) {
        showError(emailEl, emailErr, "Please enter a valid email address (example: name@domain.com).");
        ok = false;
      } else clearError(emailEl, emailErr);

      if (!messageEl.value.trim()) {
        showError(messageEl, messageErr, "Please enter a message.");
        ok = false;
      } else clearError(messageEl, messageErr);

      if (!ok) return;

      // Demo success (no backend submission required for this assignment)
      if (successEl) {
        successEl.textContent = "Thanks! Your message has been validated and is ready to send.";
        successEl.hidden = false;
      }

      form.reset();
    });
  }
})();
