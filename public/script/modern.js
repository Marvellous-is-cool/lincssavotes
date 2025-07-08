// LINCSSA VOTES - Modern UI JavaScript

// DOM Elements
document.addEventListener("DOMContentLoaded", function () {
  // Initialize particles background
  initParticles();

  // Initialize header scroll effect
  initHeaderScroll();

  // Initialize mobile menu
  initMobileMenu();

  // Initialize Dark Mode toggle
  initDarkMode();

  // Initialize vote animations
  initVoteAnimations();

  // Initialize progress bars animation
  initProgressBars();

  // Reason cards glow effect
  initReasonCardsGlow();

  // CTA Countdown Timer functionality
  initCTACountdown();
});

// Create particle background
function initParticles() {
  const particles = document.querySelector(".particles");
  if (!particles) return;

  const colors = [
    "rgba(93, 73, 210, 0.3)", // primary
    "rgba(43, 195, 215, 0.3)", // secondary
    "rgba(255, 107, 107, 0.3)", // accent
  ];

  // Create particles
  for (let i = 0; i < 30; i++) {
    const size = Math.random() * 20 + 5;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const moveX = (Math.random() - 0.5) * 30;
    const moveY = (Math.random() - 0.5) * 30;

    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.setProperty("--duration", `${duration}s`);
    particle.style.setProperty("--x", `${moveX}px`);
    particle.style.setProperty("--y", `${moveY}px`);

    particles.appendChild(particle);
  }
}

// Header scroll effect
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

// Mobile menu
function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });
}

// Dark Mode toggle
function initDarkMode() {
  const darkModeToggle = document.querySelector(".dark-mode-toggle");
  if (!darkModeToggle) return;

  // Check for saved dark mode preference
  const isDarkMode = localStorage.getItem("darkMode") === "true";

  // Set initial state
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }

  // Toggle dark mode on click
  darkModeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem("darkMode", isDark);

    if (isDark) {
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  });
}

// Vote button animations
function initVoteAnimations() {
  const voteButtons = document.querySelectorAll(".vote-btn");

  voteButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Only add animation if it doesn't have vote-submitted class already
      if (!this.classList.contains("vote-submitted")) {
        this.classList.add("vote-submitted");

        // Create and add the checkmark element
        const checkmark = document.createElement("span");
        checkmark.classList.add("vote-checkmark");
        checkmark.innerHTML = '<i class="fas fa-check-circle"></i>';

        // Replace button text with animation
        const originalText = this.innerHTML;
        this.innerHTML = "";
        this.appendChild(checkmark);

        // Restore button after animation
        setTimeout(() => {
          this.innerHTML = "Vote Submitted";
        }, 1500);
      }
    });
  });
}

// Animate progress bars on scroll
function initProgressBars() {
  const progressBars = document.querySelectorAll(".progress-bar");

  if (progressBars.length === 0) return;

  const animateProgressBars = () => {
    progressBars.forEach((bar) => {
      const rect = bar.getBoundingClientRect();
      const isVisible = rect.top <= window.innerHeight * 0.8;

      if (isVisible) {
        const percentWidth = bar.getAttribute("data-width");
        bar.style.width = percentWidth;
      }
    });
  };

  // Set initial width to 0
  progressBars.forEach((bar) => {
    const percentWidth = bar.style.width;
    bar.setAttribute("data-width", percentWidth);
    bar.style.width = "0%";
  });

  // Check on scroll
  window.addEventListener("scroll", animateProgressBars);

  // Initial check
  setTimeout(animateProgressBars, 300);
}

// Live results update (using setInterval to simulate real-time updates)
function initLiveResults() {
  const resultsContainer = document.querySelector(".live-results");
  if (!resultsContainer) return;

  // Update results every 5 seconds
  setInterval(async function () {
    try {
      const response = await fetch("/api/results");
      const data = await response.json();

      // Update the results in the UI
      updateResultsDisplay(data);
    } catch (error) {
      console.error("Error fetching live results:", error);
    }
  }, 5000);
}

function updateResultsDisplay(data) {
  // This function would update the DOM with new results data
  // Implementation would depend on the specific structure of your results
}

// Matric number validation
function validateMatricNumber(input) {
  const matricPattern = /^\d{4}\/\d{5}$/;
  const isValid = matricPattern.test(input.value);

  if (isValid) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

// Phone number validation
function validatePhoneNumber(input) {
  const phonePattern = /^[0-9]{11}$/;
  const isValid = phonePattern.test(input.value);

  if (isValid) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

// Form validation
function initFormValidation() {
  const forms = document.querySelectorAll(".needs-validation");

  forms.forEach((form) => {
    form.addEventListener("submit", function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add("was-validated");
    });
  });
}

// Countdown timer for voting
function initCountdown() {
  const countdownElement = document.querySelector(".countdown-timer");
  if (!countdownElement) return;

  const endDate = new Date(countdownElement.getAttribute("data-end-date"));

  function updateCountdown() {
    const now = new Date();
    const distance = endDate - now;

    if (distance <= 0) {
      countdownElement.innerHTML = "Voting has ended";
      return;
    }

    // Calculate days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result
    countdownElement.innerHTML = `
      <div class="countdown-item">
        <span class="countdown-value">${days}</span>
        <span class="countdown-label">Days</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-value">${hours}</span>
        <span class="countdown-label">Hours</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-value">${minutes}</span>
        <span class="countdown-label">Minutes</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-value">${seconds}</span>
        <span class="countdown-label">Seconds</span>
      </div>
    `;
  }

  // Update countdown every second
  setInterval(updateCountdown, 1000);

  // Initial update
  updateCountdown();
}

// Initialize confetti animation for successful vote
function initConfetti() {
  // This would initialize a confetti animation library
  // For example, using canvas-confetti library
}

// Reason cards glow effect
function initReasonCardsGlow() {
  const reasonCards = document.querySelectorAll(".reason-card");

  reasonCards.forEach((card) => {
    card.addEventListener("mousemove", function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });

    card.addEventListener("mouseleave", function () {
      card.style.setProperty("--mouse-x", `${card.offsetWidth / 2}px`);
      card.style.setProperty("--mouse-y", `${card.offsetHeight / 2}px`);
    });

    // Set default position
    card.style.setProperty("--mouse-x", `${card.offsetWidth / 2}px`);
    card.style.setProperty("--mouse-y", `${card.offsetHeight / 2}px`);
  });
}

// CTA Countdown Timer functionality
function initCTACountdown() {
  // Set the date 7 days from now for the demo
  const countDownDate = new Date();
  countDownDate.setDate(countDownDate.getDate() + 7);

  // Update the count down every 1 second
  const x = setInterval(function () {
    // Get today's date and time
    const now = new Date().getTime();

    // Find the distance between now and the count down date
    const distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result
    const daysEl = document.getElementById("cta-days");
    const hoursEl = document.getElementById("cta-hours");
    const minsEl = document.getElementById("cta-mins");
    const secsEl = document.getElementById("cta-secs");

    if (daysEl && hoursEl && minsEl && secsEl) {
      daysEl.innerHTML = days < 10 ? "0" + days : days;
      hoursEl.innerHTML = hours < 10 ? "0" + hours : hours;
      minsEl.innerHTML = minutes < 10 ? "0" + minutes : minutes;
      secsEl.innerHTML = seconds < 10 ? "0" + seconds : seconds;
    }

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(x);
      if (daysEl && hoursEl && minsEl && secsEl) {
        daysEl.innerHTML = "00";
        hoursEl.innerHTML = "00";
        minsEl.innerHTML = "00";
        secsEl.innerHTML = "00";
      }
    }
  }, 1000);
}

// Export functions for use in other scripts
window.LINCSSA = {
  validateMatricNumber,
  validatePhoneNumber,
  initConfetti,
};
