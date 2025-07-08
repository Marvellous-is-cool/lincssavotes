/**
 * LINCSSA VOTES - Modern UI JavaScript
 * Version 2.0 - July 2025
 */

document.addEventListener("DOMContentLoaded", function () {
  // Global toast notification function
  window.showToast = function (message, type = "info") {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.className =
        "toast-container position-fixed top-0 end-0 p-3";
      document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toastId = "toast-" + Date.now();
    const toastElement = document.createElement("div");
    toastElement.className = `toast align-items-center text-white bg-${
      type === "info" ? "primary" : type
    }`;
    toastElement.id = toastId;
    toastElement.setAttribute("role", "alert");
    toastElement.setAttribute("aria-live", "assertive");
    toastElement.setAttribute("aria-atomic", "true");

    toastElement.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    toastContainer.appendChild(toastElement);

    // Initialize and show toast
    const toastInstance = new bootstrap.Toast(toastElement, {
      animation: true,
      autohide: true,
      delay: 4000,
    });
    toastInstance.show();

    // Remove toast element after it's hidden
    toastElement.addEventListener("hidden.bs.toast", function () {
      toastElement.remove();
    });
  };

  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
    });
  }

  // Dark mode toggle
  const darkModeToggle = document.querySelector(".dark-mode-toggle");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Check for saved theme preference or use the system preference
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
  } else if (currentTheme === "light") {
    document.body.classList.remove("dark-mode");
  } else if (prefersDarkScheme.matches) {
    document.body.classList.add("dark-mode");
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");

      // Save preference
      if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    });
  }

  // Password visibility toggle
  const togglePasswordButtons = document.querySelectorAll(".toggle-password");
  if (togglePasswordButtons) {
    togglePasswordButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const input = document.getElementById(this.getAttribute("data-target"));
        if (input.type === "password") {
          input.type = "text";
          button.querySelector(".fa-eye").style.display = "none";
          button.querySelector(".fa-eye-slash").style.display = "inline-block";
        } else {
          input.type = "password";
          button.querySelector(".fa-eye").style.display = "inline-block";
          button.querySelector(".fa-eye-slash").style.display = "none";
        }
      });
    });
  }

  // Ultra-modern countdown timer with smooth updates
  const countdownContainer = document.querySelector(".countdown-timer");
  if (countdownContainer) {
    // Fix the date handling: ensure we properly parse the date string
    let endDateStr = countdownContainer.dataset.endDate;
    console.log("Date from data attribute:", endDateStr);

    // Try to handle different date formats
    let endDate;
    if (endDateStr) {
      try {
        // Additional logging to help debug the date format
        console.log("Original date string format:", endDateStr);

        // First try: Direct parsing (works for ISO format and many standard formats)
        endDate = new Date(endDateStr);
        console.log("First parse attempt result:", endDate);

        // Validate the date
        if (isNaN(endDate.getTime())) {
          console.log("Direct parsing failed, trying alternative formats");

          // Special handling for MongoDB ISODate format which might include extra characters
          if (endDateStr.includes("ISODate")) {
            // Extract the date string from ISODate("date-string") format
            const dateMatch = endDateStr.match(/ISODate\("(.+?)"\)/);
            if (dateMatch && dateMatch[1]) {
              console.log("Extracted date from ISODate format:", dateMatch[1]);
              endDate = new Date(dateMatch[1]);
            }
          }
          // Handle MM/DD/YYYY format
          else if (endDateStr.includes("/")) {
            const parts = endDateStr.split("/");
            console.log("Parsed date parts (MM/DD/YYYY):", parts);
            endDate = new Date(parts[2], parts[0] - 1, parts[1]);
          }
          // Handle YYYY-MM-DD format
          else if (endDateStr.includes("-")) {
            const parts = endDateStr.split("-");
            console.log("Parsed date parts (YYYY-MM-DD):", parts);

            // Check if we have time components as well (YYYY-MM-DDTHH:MM:SS)
            if (parts[2] && parts[2].includes("T")) {
              const datePart = parts[2].split("T")[0];
              const timePart = parts[2].split("T")[1];
              console.log("Split date and time parts:", datePart, timePart);

              // Reconstruct the date string in a standard format
              const standardFormat = `${parts[0]}-${parts[1]}-${datePart}T${timePart}`;
              console.log("Reconstructed standard format:", standardFormat);
              endDate = new Date(standardFormat);
            } else {
              endDate = new Date(parts[0], parts[1] - 1, parts[2]);
            }
          }

          // Final validation
          if (isNaN(endDate.getTime())) {
            console.error("All parsing attempts failed for date:", endDateStr);
            throw new Error("Invalid date format");
          }
        }
        console.log("Successfully parsed end date:", endDate);
        console.log("End date timestamp:", endDate.getTime());
        console.log("Current timestamp:", new Date().getTime());
        console.log("Time remaining (ms):", endDate - new Date());
      } catch (e) {
        console.error("Error parsing date:", e);
        // Fallback to a future date to show something
        endDate = new Date();
        endDate.setDate(endDate.getDate() + 7); // 7 days from now
        console.log("Using fallback date:", endDate);
      }
    } else {
      // If no date is provided, use a default future date
      console.warn("No end date provided, using default");
      endDate = new Date();
      endDate.setDate(endDate.getDate() + 7); // 7 days from now
    }

    // Initialize countdown structure only once
    function initializeCountdown() {
      if (
        countdownContainer.children.length === 0 ||
        !countdownContainer.querySelector("#countdown-days")
      ) {
        countdownContainer.innerHTML = `
          <div class="countdown-digit-container" id="days-container">
            <div class="countdown-digit" id="countdown-days">00</div>
            <div class="countdown-label">Days</div>
          </div>
          
          <div class="countdown-separator pulse-animation">:</div>
          
          <div class="countdown-digit-container" id="hours-container">
            <div class="countdown-digit" id="countdown-hours">00</div>
            <div class="countdown-label">Hours</div>
          </div>
          
          <div class="countdown-separator pulse-animation">:</div>
          
          <div class="countdown-digit-container" id="minutes-container">
            <div class="countdown-digit" id="countdown-minutes">00</div>
            <div class="countdown-label">Minutes</div>
          </div>
          
          <div class="countdown-separator pulse-animation">:</div>
          
          <div class="countdown-digit-container" id="seconds-container">
            <div class="countdown-digit" id="countdown-seconds">00</div>
            <div class="countdown-label">Seconds</div>
          </div>
        `;
      }
    }

    // Update countdown without replacing entire HTML
    function updateCountdown() {
      const now = new Date();
      const diff = endDate - now;

      console.log("Current time:", now);
      console.log("Time difference (ms):", diff);

      if (diff <= 0) {
        // Check if we're showing the voting start or end time
        const isVotingStarted = document
          .querySelector(".countdown-title")
          ?.textContent.includes("Starts In");
        const message = isVotingStarted
          ? "Voting has started!"
          : "Voting has ended!";

        countdownContainer.innerHTML = `<div class="text-center"><p class="countdown-complete">${message}</p></div>`;

        // Never show alerts - remove the confirm dialog completely

        return;
      }

      // Make sure the countdown is initialized
      initializeCountdown();

      // Calculate time remaining
      const days = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(
        2,
        "0"
      );
      const hours = String(
        Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      ).padStart(2, "0");
      const minutes = String(
        Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      ).padStart(2, "0");
      const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(
        2,
        "0"
      );

      // Update only the digits that changed
      updateDigitIfChanged("countdown-days", days);
      updateDigitIfChanged("countdown-hours", hours);
      updateDigitIfChanged("countdown-minutes", minutes);
      updateDigitIfChanged("countdown-seconds", seconds);

      // Log the remaining time for debugging
      if (diff < 60000) {
        // Only log if less than 1 minute remaining
        console.log(
          `Time remaining: ${days}d ${hours}h ${minutes}m ${seconds}s`
        );
      }
    }

    // Helper function to update a digit only if it changed
    function updateDigitIfChanged(elementId, newValue) {
      const element = document.getElementById(elementId);
      if (element && element.textContent !== newValue) {
        // Apply a smooth transition effect
        element.classList.add("digit-change");
        setTimeout(() => {
          element.textContent = newValue;
          element.classList.remove("digit-change");
        }, 250); // Half the animation time
      }
    }

    // Initial call and set interval
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Particle background
  function createParticle() {
    const particles = document.querySelector(".particles");
    if (!particles) return;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");

      // Random positioning
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";

      // Random size between 3px and 8px
      const size = Math.floor(Math.random() * 6) + 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Random opacity between 0.1 and 0.5
      particle.style.opacity = Math.random() * 0.4 + 0.1;

      // Random animation delay and duration
      particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;

      particles.appendChild(particle);
    }
  }

  // Initialize particles on larger screens only
  if (window.innerWidth > 768) {
    createParticle();
  }

  // Form validation
  const forms = document.querySelectorAll(".needs-validation");
  if (forms) {
    Array.prototype.slice.call(forms).forEach((form) => {
      form.addEventListener(
        "submit",
        (event) => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add("was-validated");
        },
        false
      );
    });
  }

  // Matric number validation
  const matricInput = document.getElementById("matricNumber");
  if (matricInput) {
    matricInput.addEventListener("input", function () {
      // Format: XXXX/XXXXX
      let value = this.value.replace(/[^0-9\/]/g, "");

      // Check if we need to add slash
      if (value.length > 4 && !value.includes("/")) {
        value = value.substring(0, 4) + "/" + value.substring(4);
      }

      // Limit to 10 characters (4 + / + 5)
      if (value.length > 10) {
        value = value.substring(0, 10);
      }

      this.value = value;
    });
  }
});
