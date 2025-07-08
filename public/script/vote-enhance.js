/**
 * LINCSSA VOTES - Vote Enhancement Scripts
 * Adds animations, interactivity, and validation to the voting interface
 * July 2025
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS animations
  AOS.init({
    duration: 800,
    easing: "ease-out",
    once: false,
  });

  // Display current time
  function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const timeDisplay = document.getElementById("current-time");
    if (timeDisplay) {
      timeDisplay.textContent = timeString;
    }
  }

  // Update time every minute
  updateTime();
  setInterval(updateTime, 60000);

  // Sidebar toggle functionality
  const sidebarToggle = document.getElementById("sidebar-toggle");
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", function () {
      document.querySelector(".sidebar").classList.toggle("collapsed");
    });
  }

  // Add enhanced interactive elements to contestant cards
  const contestantCards = document.querySelectorAll(".contestant-card");
  contestantCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      // Don't execute if clicking on the label itself (to prevent double-toggling)
      if (e.target.tagName.toLowerCase() === "label") return;

      // Find the radio input in this card and toggle it
      const radio = this.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;

        // Add ripple effect
        const ripple = document.createElement("div");
        ripple.className = "ripple";
        this.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      }
    });
  });

  // Form validation
  const voteForm = document.getElementById("vote-form");
  if (voteForm) {
    voteForm.addEventListener("submit", function (e) {
      const selectedContestant = document.querySelector(
        'input[name="contestantId"]:checked'
      );

      if (!selectedContestant) {
        e.preventDefault();

        // Create alert if not exists
        if (!document.querySelector(".alert.alert-warning")) {
          const alert = document.createElement("div");
          alert.className = "alert alert-warning fade-in";
          alert.innerHTML =
            '<i class="fas fa-exclamation-triangle alert-icon"></i> Please select a contestant before submitting your vote.';

          const contentWrapper = document.querySelector(".content-wrapper");
          contentWrapper.insertBefore(alert, contentWrapper.firstChild);

          // Scroll to top
          window.scrollTo({ top: 0, behavior: "smooth" });

          // Auto remove after 5 seconds
          setTimeout(() => {
            alert.classList.add("fade-out");
            setTimeout(() => {
              alert.remove();
            }, 300);
          }, 5000);
        }
      }
    });
  }

  // Vote success celebration (if there's a success message)
  if (document.querySelector(".alert.alert-success")) {
    createConfetti();
  }

  // Create confetti animation
  function createConfetti() {
    const confettiContainer = document.createElement("div");
    confettiContainer.className = "confetti-container";
    document.body.appendChild(confettiContainer);

    const colors = ["#4831d4", "#00e4ff", "#ff2e63", "#0cce6b", "#ffcc00"];

    // Create 100 confetti pieces
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";

      // Random position, size, color and animation duration
      const left = Math.random() * 100 + "vw";
      const size = Math.random() * 10 + 5 + "px";
      const color = colors[Math.floor(Math.random() * colors.length)];
      const duration = Math.random() * 3 + 2 + "s";
      const delay = Math.random() * 2 + "s";

      confetti.style.left = left;
      confetti.style.width = size;
      confetti.style.height = size;
      confetti.style.backgroundColor = color;
      confetti.style.animation = `confetti ${duration} forwards ${delay}`;

      confettiContainer.appendChild(confetti);
    }

    // Remove confetti after 5 seconds
    setTimeout(() => {
      confettiContainer.remove();
    }, 7000);
  }

  // Dark mode toggle
  const darkModeToggle = document.querySelector(".dark-mode-toggle");
  if (darkModeToggle) {
    const isDarkMode = localStorage.getItem("darkMode") === "true";

    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    }

    darkModeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      const isDarkModeNow = document.body.classList.contains("dark-mode");
      localStorage.setItem("darkMode", isDarkModeNow);
    });
  }

  // Add hover effects to position status cards
  const positionStatusCards = document.querySelectorAll(
    ".position-status-card"
  );
  positionStatusCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
      this.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.1)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "none";
    });
  });
});
