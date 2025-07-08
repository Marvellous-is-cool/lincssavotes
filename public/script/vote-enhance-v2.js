/**
 * LINCSSA VOTES - Ultra-Modern Voting Interface
 * Version: 2.0
 * Date: July 3, 2025
 * Enhanced interactive features and animations
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS animations with enhanced configuration
  AOS.init({
    duration: 800,
    easing: "ease-out",
    once: false,
    mirror: true,
    anchorPlacement: "top-bottom",
  });

  // Current time display with animated digital clock
  function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const timeDisplay = document.getElementById("current-time");

    if (timeDisplay) {
      // Split time into individual characters for animation
      const currentDigits = timeDisplay.querySelectorAll(".digit");
      const newTimeArray = timeString.split("");

      // If the element already has digits, animate the change
      if (currentDigits.length > 0) {
        newTimeArray.forEach((digit, index) => {
          if (
            currentDigits[index] &&
            currentDigits[index].textContent !== digit
          ) {
            currentDigits[index].classList.add("flip");
            setTimeout(() => {
              currentDigits[index].textContent = digit;
              currentDigits[index].classList.remove("flip");
            }, 150);
          }
        });
      } else {
        // First time setup, create the digital display
        timeDisplay.innerHTML = "";
        newTimeArray.forEach((digit) => {
          const digitSpan = document.createElement("span");
          digitSpan.className = "digit";
          digitSpan.textContent = digit;
          timeDisplay.appendChild(digitSpan);
        });
      }
    }
  }

  // Update time every second
  updateTime();
  setInterval(updateTime, 1000);

  // Enhanced contestant card selection interaction
  const contestantCards = document.querySelectorAll(".contestant-card");
  const radioButtons = document.querySelectorAll(
    '.contestant-select input[type="radio"]'
  );

  contestantCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      // Don't trigger if clicking on the radio button itself (prevents double-toggling)
      if (
        e.target.tagName.toLowerCase() === "input" ||
        e.target.closest(".radio-button") === e.target
      ) {
        return;
      }

      // Find the radio input in this card and select it
      const radio = this.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;

        // Add active class to this card and remove from others
        contestantCards.forEach((otherCard) => {
          otherCard.classList.remove("active");
        });
        this.classList.add("active");

        // Trigger change event to ensure any listeners know about the selection
        const event = new Event("change", { bubbles: true });
        radio.dispatchEvent(event);

        // Add selection animation effect
        const ripple = document.createElement("div");
        ripple.classList.add("selection-ripple");
        this.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 1000);
      }
    });
  });

  // Listen for manual radio button changes
  radioButtons.forEach((radio) => {
    radio.addEventListener("change", function () {
      contestantCards.forEach((card) => {
        card.classList.remove("active");
      });

      // Add active class to the parent card
      if (this.checked) {
        const parentCard = this.closest(".contestant-card");
        if (parentCard) {
          parentCard.classList.add("active");

          // Smooth scroll to the vote button if it's out of view
          const voteButton = document.querySelector(".btn-vote");
          if (voteButton) {
            const buttonRect = voteButton.getBoundingClientRect();
            const isVisible =
              buttonRect.top >= 0 && buttonRect.bottom <= window.innerHeight;

            if (!isVisible) {
              voteButton.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }
        }
      }
    });
  });

  // Vote button animation and feedback
  const voteButton = document.querySelector(".btn-vote");
  if (voteButton) {
    voteButton.addEventListener("click", function (e) {
      // Check if a contestant is selected
      const selectedRadio = document.querySelector(
        '.contestant-select input[type="radio"]:checked'
      );

      if (!selectedRadio) {
        // Show "please select a contestant" toast notification
        showToast("Please select a contestant to vote for", "warning");

        // Highlight the contestant cards with a shake animation
        contestantCards.forEach((card) => {
          card.classList.add("shake-animation");
          setTimeout(() => {
            card.classList.remove("shake-animation");
          }, 500);
        });

        // Prevent default form submission
        e.preventDefault();
        return false;
      }

      // If contestant is selected, add loading state to button
      this.disabled = true;
      const originalText = this.innerHTML;
      this.innerHTML = '<span class="loading-spinner"></span> Processing...';

      // Submit the form or process the vote
      // This would be replaced with your actual form submission logic
      // For demo purposes, we'll simulate with a timeout
      setTimeout(() => {
        // Show success modal or redirect
        showVoteSuccess();

        // Reset button state
        this.disabled = false;
        this.innerHTML = originalText;
      }, 1500);
    });
  }

  // Vote success modal
  function showVoteSuccess() {
    const selectedRadio = document.querySelector(
      '.contestant-select input[type="radio"]:checked'
    );
    const selectedContestantName = selectedRadio
      ? selectedRadio
          .closest(".contestant-card")
          .querySelector(".contestant-name").textContent
      : "your selected contestant";

    // Create success modal dynamically
    const modal = document.createElement("div");
    modal.className = "vote-modal";
    modal.innerHTML = `
      <div class="vote-modal-content">
        <div class="vote-modal-header">
          <h2 class="vote-modal-title">Vote Successful!</h2>
          <button class="vote-modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="vote-modal-body text-center">
          <div class="vote-success-animation">
            <div class="circle"></div>
            <div class="checkmark"></div>
          </div>
          <h3>Thank you for voting!</h3>
          <p>Your vote for <strong>${selectedContestantName}</strong> has been recorded.</p>
        </div>
        <div class="vote-modal-footer">
          <button class="btn-vote modal-close-btn">
            <i class="fas fa-check"></i> Done
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Show modal with animation
    setTimeout(() => {
      modal.classList.add("active");
    }, 10);

    // Set up close button and backdrop click
    const closeBtn = modal.querySelector(".vote-modal-close");
    const doneBtn = modal.querySelector(".modal-close-btn");

    [closeBtn, doneBtn].forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", () => {
          modal.classList.remove("active");
          setTimeout(() => {
            modal.remove();
            // Redirect to results or success page
            window.location.href = "/voting-success";
          }, 300);
        });
      }
    });
  }

  // Toast notification system
  function showToast(message, type = "info") {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.className = "toast-container";
      document.body.appendChild(toastContainer);
    }

    // Icon based on type
    let icon = "fa-info-circle";
    if (type === "success") icon = "fa-check-circle";
    if (type === "error") icon = "fa-exclamation-circle";
    if (type === "warning") icon = "fa-exclamation-triangle";

    // Create toast element
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fas ${icon}"></i>
      </div>
      <div class="toast-content">
        ${message}
      </div>
      <button class="toast-close">
        <i class="fas fa-times"></i>
      </button>
    `;

    // Add to container
    toastContainer.appendChild(toast);

    // Set up close button
    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => {
      toast.style.opacity = "0";
      setTimeout(() => {
        toast.remove();
      }, 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 5000);
  }

  // Copy voting link to clipboard
  const copyLinkBtn = document.getElementById("copy-link-btn");
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", function () {
      const currentURL = window.location.href;

      // Create temporary input element
      const tempInput = document.createElement("input");
      tempInput.value = currentURL;
      document.body.appendChild(tempInput);

      // Select and copy
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);

      // Show success toast
      showToast("Voting link copied to clipboard", "success");

      // Visual feedback on button
      this.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-link"></i> Copy Link';
      }, 2000);
    });
  }

  // Voting countdown timer
  const countdownElement = document.getElementById("voting-countdown");
  if (countdownElement) {
    const endTime = new Date(countdownElement.dataset.endtime).getTime();

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        // Voting period has ended
        countdownElement.innerHTML =
          '<span class="ended">Voting has ended</span>';
        return;
      }

      // Calculate time components
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Create countdown display
      countdownElement.innerHTML = `
        <div class="countdown-unit">
          <div class="countdown-value">${days}</div>
          <div class="countdown-label">Days</div>
        </div>
        <div class="countdown-unit">
          <div class="countdown-value">${hours}</div>
          <div class="countdown-label">Hours</div>
        </div>
        <div class="countdown-unit">
          <div class="countdown-value">${minutes}</div>
          <div class="countdown-label">Minutes</div>
        </div>
        <div class="countdown-unit">
          <div class="countdown-value">${seconds}</div>
          <div class="countdown-label">Seconds</div>
        </div>
      `;
    }

    // Initial update
    updateCountdown();

    // Update every second
    setInterval(updateCountdown, 1000);
  }

  // Animated statistics counters
  function animateCounters() {
    const counters = document.querySelectorAll(".stat-value[data-count]");

    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-count"));
      const duration = 2000; // Animation duration in milliseconds
      const step = target / (duration / 16); // 60fps
      let current = 0;

      const updateCounter = () => {
        current += step;

        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    });
  }

  // Trigger counter animation when elements are in view
  const observerOptions = {
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect(); // Only animate once
      }
    });
  }, observerOptions);

  const statsSection = document.querySelector(".vote-stats");
  if (statsSection) {
    observer.observe(statsSection);
  }

  // Enhanced hover effects for interactive elements
  const interactiveElements = document.querySelectorAll(
    ".contestant-card, .btn-vote, .stat-card"
  );

  interactiveElements.forEach((element) => {
    element.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top; // y position within the element

      // Calculate rotation based on cursor position
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      // Apply the 3D rotation effect
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    element.addEventListener("mouseleave", function () {
      // Reset the transform when mouse leaves
      this.style.transform = "";
    });
  });

  // Particle background effect for vote page
  function createParticles() {
    const particlesContainer = document.querySelector(".particles-container");
    if (!particlesContainer) return;

    const COUNT = 20;

    for (let i = 0; i < COUNT; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";

      // Random position
      const x = Math.random() * 100;
      const y = Math.random() * 100;

      // Random size
      const size = Math.random() * 10 + 5;

      // Random animation duration and delay
      const duration = Math.random() * 20 + 10;
      const delay = Math.random() * 5;

      // Random opacity
      const opacity = Math.random() * 0.3 + 0.1;

      // Apply styles
      particle.style.cssText = `
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        opacity: ${opacity};
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
      `;

      particlesContainer.appendChild(particle);
    }
  }

  // Initialize particles if container exists
  createParticles();

  // Parallax effect on scroll
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const parallaxElements = document.querySelectorAll(".parallax");

    parallaxElements.forEach((element) => {
      const speed = parseFloat(element.dataset.speed) || 0.2;
      element.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });

  // Form validation for email/phone input
  const emailForm = document.querySelector(".voter-verification-form");
  if (emailForm) {
    const emailInput = emailForm.querySelector('input[type="email"]');
    const submitBtn = emailForm.querySelector('button[type="submit"]');

    emailInput.addEventListener("input", function () {
      const email = this.value.trim();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (isValid) {
        this.classList.remove("is-invalid");
        this.classList.add("is-valid");
        submitBtn.disabled = false;
      } else {
        this.classList.remove("is-valid");
        this.classList.add("is-invalid");
        submitBtn.disabled = true;
      }
    });
  }

  // Position category tabs
  const categoryTabs = document.querySelectorAll(".category-tab");
  const positionSections = document.querySelectorAll(".position-section");

  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const category = this.dataset.category;

      // Update active tab
      categoryTabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Show relevant position section
      positionSections.forEach((section) => {
        if (section.dataset.category === category || category === "all") {
          section.style.display = "block";

          // Trigger AOS refresh for newly visible elements
          setTimeout(() => {
            AOS.refresh();
          }, 100);
        } else {
          section.style.display = "none";
        }
      });
    });
  });
});

// SVG Wave animation for background
function createWaveAnimation() {
  const waveContainer = document.querySelector(".wave-background");
  if (!waveContainer) return;

  // Create SVG element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("preserveAspectRatio", "none");

  // Create waves with different animations
  const waves = [
    {
      color: "rgba(94, 96, 206, 0.1)",
      animationDuration: "20s",
      animationDelay: "0s",
    },
    {
      color: "rgba(76, 201, 240, 0.1)",
      animationDuration: "25s",
      animationDelay: "-5s",
    },
    {
      color: "rgba(116, 0, 184, 0.05)",
      animationDuration: "30s",
      animationDelay: "-2s",
    },
  ];

  waves.forEach((wave, index) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    // Create wave path with random heights
    path.setAttribute("d", createWavePath(index));
    path.setAttribute("fill", wave.color);
    path.style.animationDuration = wave.animationDuration;
    path.style.animationDelay = wave.animationDelay;
    path.classList.add("wave-path");

    svg.appendChild(path);
  });

  waveContainer.appendChild(svg);
}

// Generate wave path with variation based on index
function createWavePath(index) {
  const amplitude = 20 + index * 10;
  const frequency = 0.005 - index * 0.001;
  const points = [];

  points.push("M0,100");

  for (let x = 0; x <= 100; x += 0.5) {
    const y = Math.sin(x * frequency) * amplitude + 50;
    points.push(`${x},${y}`);
  }

  points.push("100,100 0,100");

  return points.join(" ");
}

// Initialize wave animation when page loads
window.addEventListener("load", createWaveAnimation);
