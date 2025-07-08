/*
 * LINCSSA VOTES - Modern Authentication Scripts
 * Ultra-modern, professional animations and interactions
 * July 2025
 */

// Create and animate background shapes
document.addEventListener("DOMContentLoaded", function () {
  console.log("LINCSSA VOTES - Loading modern auth UI");

  // Initialize background animations
  initBackgroundEffects();

  // Initialize form validation
  initFormValidation();

  // Initialize floating labels
  initFloatingLabels();

  // Initialize button effects
  initButtonEffects();

  // Add subtle entrance animations
  animateAuthCard();

  // Add focus effects
  addInputFocusEffects();
});

// Create background shapes
function initBackgroundEffects() {
  // Create background shapes only if the auth-bg element exists
  const authBg = document.querySelector(".auth-bg");
  if (!authBg) return;

  // Create animated background shapes
  for (let i = 0; i < 2; i++) {
    const shape = document.createElement("div");
    shape.classList.add("auth-bg-shape");

    // Randomize position and size slightly
    const size = 60 + Math.random() * 30; // 60-90% of viewport width
    const top = i === 0 ? -15 - Math.random() * 10 : null; // Top position for first shape
    const bottom = i === 1 ? -25 - Math.random() * 10 : null; // Bottom position for second shape
    const left = i === 1 ? -10 - Math.random() * 5 : null; // Left position for second shape
    const right = i === 0 ? -5 - Math.random() * 5 : null; // Right position for first shape

    shape.style.width = `${size}vw`;
    shape.style.height = `${size}vw`;
    if (top !== null) shape.style.top = `${top}%`;
    if (bottom !== null) shape.style.bottom = `${bottom}%`;
    if (left !== null) shape.style.left = `${left}%`;
    if (right !== null) shape.style.right = `${right}%`;

    // Add unique animation
    const duration = 15 + Math.random() * 15; // 15-30s
    shape.style.animation = `float ${duration}s infinite ${
      i === 0 ? "alternate" : "alternate-reverse"
    }`;

    authBg.appendChild(shape);
  }
}

// Form validation
function initFormValidation() {
  // Matric number validation
  const matricInput = document.getElementById("matricNumber");
  if (matricInput) {
    matricInput.addEventListener("input", function () {
      const matricPattern = /^\d{4}\/\d{5}$/;
      validateInput(
        this,
        matricPattern,
        "Matric number must be in the format XXXX/XXXXX (e.g., 2021/34825)"
      );
    });
  }

  // Phone number validation
  const phoneInput = document.getElementById("phoneNumber");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      const phonePattern = /^[0-9]{11}$/;
      validateInput(
        this,
        phonePattern,
        "Please enter a valid 11-digit phone number"
      );
    });
  }

  // Password validation
  const passwordInput = document.getElementById("password");
  if (passwordInput) {
    passwordInput.addEventListener("input", function () {
      const passwordPattern = /.{6,}/; // At least 6 characters
      validateInput(
        this,
        passwordPattern,
        "Password must be at least 6 characters long"
      );
    });
  }

  // Confirm password validation
  const confirmPasswordInput = document.getElementById("confirmPassword");
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener("input", function () {
      const password = document.getElementById("password").value;
      if (this.value !== password) {
        setInvalid(this, "Passwords do not match");
      } else {
        setValid(this);
      }
    });
  }
}

// Input validation helper function
function validateInput(input, pattern, errorMessage) {
  if (input.value && !pattern.test(input.value)) {
    setInvalid(input, errorMessage);
  } else {
    input.value ? setValid(input) : resetValidation(input);
  }
}

// Set invalid state for an input
function setInvalid(input, message) {
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");

  // Create or update feedback message
  let feedback = input.parentElement.querySelector(".invalid-feedback");
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.classList.add("invalid-feedback");
    input.parentElement.appendChild(feedback);
  }
  feedback.textContent = message;

  // Set custom validation message (for HTML5 validation)
  input.setCustomValidity(message);
}

// Set valid state for an input
function setValid(input) {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
  input.setCustomValidity("");
}

// Reset validation state
function resetValidation(input) {
  input.classList.remove("is-invalid");
  input.classList.remove("is-valid");
  input.setCustomValidity("");
}

// Initialize floating labels
function initFloatingLabels() {
  const inputs = document.querySelectorAll(".form-control");

  inputs.forEach((input) => {
    // Add focus class when input is focused
    input.addEventListener("focus", () => {
      input.parentElement.classList.add("focused");
    });

    // Remove focus class when input loses focus (only if empty)
    input.addEventListener("blur", () => {
      if (!input.value) {
        input.parentElement.classList.remove("focused");
      }
    });

    // Check initial state (for pre-filled inputs)
    if (input.value) {
      input.parentElement.classList.add("focused");
    }
  });
}

// Initialize button effects
function initButtonEffects() {
  const buttons = document.querySelectorAll(".btn-primary");

  buttons.forEach((button) => {
    // Add ripple effect on click
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Add subtle entrance animations for auth card
function animateAuthCard() {
  const authCard = document.querySelector(".auth-card");
  if (!authCard) return;

  // Add a subtle entrance animation if AOS is not being used
  if (typeof AOS === "undefined") {
    authCard.style.opacity = "0";
    authCard.style.transform = "translateY(20px)";

    setTimeout(() => {
      authCard.style.transition =
        "opacity 0.8s ease-out, transform 0.8s ease-out";
      authCard.style.opacity = "1";
      authCard.style.transform = "translateY(0)";
    }, 100);
  }

  // Add a subtle hover animation for the card
  authCard.addEventListener("mouseenter", () => {
    document.querySelectorAll(".auth-bg-shape").forEach((shape) => {
      shape.style.transition = "transform 1.2s ease-out";
      shape.style.transform = "scale(1.05)";
    });
  });

  authCard.addEventListener("mouseleave", () => {
    document.querySelectorAll(".auth-bg-shape").forEach((shape) => {
      shape.style.transition = "transform 1.2s ease-out";
      shape.style.transform = "scale(1)";
    });
  });
}

// Add enhanced focus effects to inputs
function addInputFocusEffects() {
  const inputs = document.querySelectorAll(".auth-form .form-control");
  if (!inputs.length) return;

  inputs.forEach((input) => {
    // Create a focus highlight element
    const highlight = document.createElement("span");
    highlight.classList.add("input-focus-highlight");
    highlight.style.position = "absolute";
    highlight.style.bottom = "0";
    highlight.style.left = "0";
    highlight.style.width = "0";
    highlight.style.height = "2px";
    highlight.style.background = "var(--gradient-primary)";
    highlight.style.transition = "width 0.3s ease";
    highlight.style.zIndex = "1";

    // Make the parent relative positioned if not already
    if (window.getComputedStyle(input.parentElement).position !== "relative") {
      input.parentElement.style.position = "relative";
    }

    input.parentElement.appendChild(highlight);

    // Animate the highlight on focus
    input.addEventListener("focus", () => {
      highlight.style.width = "100%";
    });

    input.addEventListener("blur", () => {
      highlight.style.width = "0";
    });

    // Initial state check
    if (document.activeElement === input) {
      highlight.style.width = "100%";
    }
  });
}
