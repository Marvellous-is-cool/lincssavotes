/**
 * LINCSSA VOTES - Futuristic Admin Dashboard JS
 * Advanced animations and interactions for a mind-blowing admin experience
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize loading screen
  initLoadingSequence();

  // Initialize navigation effects
  initNavigationEffects();

  // Initialize card animations
  initCardAnimations();

  // Initialize 3D effects
  init3DEffects();

  // Initialize data animations
  initDataAnimations();

  // Initialize responsive behaviors
  initResponsiveNavigation();
});

// Loading screen with animated sequence
function initLoadingSequence() {
  const loader = document.querySelector(".dashboard-loading");
  if (!loader) return;

  // Simulate loading - in production you'd tie this to actual data loading
  setTimeout(() => {
    loader.classList.add("loaded");

    // Animate stats counting up
    initCountUpAnimation();
  }, 800);
}

// Initialize count-up animation for statistics
function initCountUpAnimation() {
  const statValues = document.querySelectorAll(".stat-value[data-value]");

  statValues.forEach((stat) => {
    const targetValue = parseInt(stat.getAttribute("data-value"), 10);
    const suffix = stat.getAttribute("data-suffix") || "";
    const duration = 2000; // Animation duration in milliseconds
    const startTime = performance.now();
    const startValue = 0;

    function updateValue(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smoother animation
      const easedProgress =
        progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const currentValue = Math.floor(
        startValue + easedProgress * (targetValue - startValue)
      );
      stat.textContent = `${currentValue}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    }

    requestAnimationFrame(updateValue);
  });
}

// Navigation effects and animations
function initNavigationEffects() {
  // Add shimmer effect to navigation on hover
  const navItems = document.querySelectorAll(".admin-menu li a");

  navItems.forEach((item) => {
    item.addEventListener("mouseover", function () {
      this.classList.add("shimmer-effect");
    });

    item.addEventListener("mouseout", function () {
      this.classList.remove("shimmer-effect");
    });
  });

  // Active navigation indicator animation
  const activeNavItem = document.querySelector(".admin-menu li.active a");
  if (activeNavItem) {
    // Pulse animation for active item
    setInterval(() => {
      activeNavItem.classList.add("pulse-active");
      setTimeout(() => {
        activeNavItem.classList.remove("pulse-active");
      }, 1000);
    }, 5000);
  }
}

// Card hover and interaction animations
function initCardAnimations() {
  // Add hover effects to cards
  const cards = document.querySelectorAll(
    ".stat-card, .system-card, .results-card"
  );

  cards.forEach((card) => {
    // Add shimmer effect class
    card.classList.add("card-shimmer");

    // Add mouse tracking glow effect
    card.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.style.setProperty("--mouse-x", `${x}px`);
      this.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  // Add special pulsing effect to system status cards
  const systemCards = document.querySelectorAll(".system-card");

  systemCards.forEach((card) => {
    // Find status indicators in system cards
    const statusIndicator = card.querySelector(".text-success, .text-danger");

    if (statusIndicator) {
      setInterval(() => {
        statusIndicator.classList.add("status-pulse");
        setTimeout(() => {
          statusIndicator.classList.remove("status-pulse");
        }, 1000);
      }, 3000);
    }
  });
}

// 3D tilt effect for cards
function init3DEffects() {
  const cards = document.querySelectorAll(".card-3d");

  cards.forEach((card) => {
    card.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateY = (e.clientX - centerX) / 20;
      const rotateX = -(e.clientY - centerY) / 20;

      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    });
  });
}

// Data visualization animations
function initDataAnimations() {
  // Animate progress bars
  const progressBars = document.querySelectorAll(".progress-bar");

  progressBars.forEach((bar) => {
    const targetWidth = bar.getAttribute("data-width") || "0%";

    // Start at 0 width and animate to target
    bar.style.width = "0%";

    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 300);
  });

  // Pulsating dot for "live" indicators
  const liveIndicators = document.querySelectorAll(".live-indicator");

  liveIndicators.forEach((indicator) => {
    // Create pulsing dot
    const dot = document.createElement("span");
    dot.classList.add("live-dot");
    indicator.appendChild(dot);
  });
}

// Responsive navigation management
function initResponsiveNavigation() {
  const toggleBtn = document.querySelector(".toggle-admin-sidebar");
  const sidebar = document.querySelector(".admin-sidebar");

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", function () {
      sidebar.classList.toggle("active");
      this.classList.toggle("active");
    });

    // Close sidebar when clicking outside on small screens
    document.addEventListener("click", function (e) {
      if (window.innerWidth < 992) {
        if (
          !sidebar.contains(e.target) &&
          !toggleBtn.contains(e.target) &&
          sidebar.classList.contains("active")
        ) {
          sidebar.classList.remove("active");
          toggleBtn.classList.remove("active");
        }
      }
    });
  }
}

// Create dynamic starfield background effect
function createStarfieldBackground() {
  const starfield = document.createElement("div");
  starfield.className = "starfield";
  document.body.appendChild(starfield);

  const numStars = 200;

  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div");
    star.className = "star";

    // Random position
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    // Random size
    const size = Math.random() * 2 + 1;

    // Random opacity and animation delay
    const opacity = Math.random() * 0.8 + 0.2;
    const delay = Math.random() * 10;

    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.opacity = opacity;
    star.style.animationDelay = `${delay}s`;

    starfield.appendChild(star);
  }
}

// Function to create notification effect
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;

  notification.innerHTML = `
    <div class="notification-content">
      <i class="notification-icon fas ${
        type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
      }"></i>
      <p>${message}</p>
    </div>
    <div class="notification-progress"></div>
  `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Animate out after 5 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    notification.classList.add("hide");

    // Remove from DOM after animation completes
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 5000);
}
