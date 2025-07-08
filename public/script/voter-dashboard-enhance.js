document.addEventListener("DOMContentLoaded", function () {
  // Add visual feedback for Vote Now and View Results buttons
  const voteButtons = document.querySelectorAll(".card-link, .btn-vote");

  voteButtons.forEach((button) => {
    button.addEventListener("mouseover", function () {
      this.style.transform = "scale(1.05)";
      this.style.transition = "all 0.3s ease";
    });

    button.addEventListener("mouseout", function () {
      this.style.transform = "scale(1)";
    });

    button.addEventListener("click", function () {
      // Create ripple effect
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 800);
    });
  });

  // Enhance the progress bar with animation
  const progressFill = document.querySelector(".progress-fill");
  if (progressFill) {
    setTimeout(() => {
      progressFill.style.opacity = "1";
    }, 300);
  }

  // Show a welcome toast
  setTimeout(() => {
    showToast("Welcome to your voter dashboard!", "info");
  }, 1000);

  // Add pulsing effect to countdown
  const countdown = document.getElementById("voting-countdown");
  if (countdown) {
    setInterval(() => {
      countdown.classList.add("pulse");
      setTimeout(() => {
        countdown.classList.remove("pulse");
      }, 1000);
    }, 5000);
  }

  // Simple toast notification function
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
            <div class="toast-content">
                <i class="${
                  type === "success"
                    ? "fas fa-check-circle"
                    : type === "error"
                    ? "fas fa-exclamation-circle"
                    : "fas fa-info-circle"
                }"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;

    const container = document.querySelector(".toast-container");
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "1";
    }, 10);

    // Close button functionality
    const closeBtn = toast.querySelector(".toast-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
      });
    }

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }

  // Optional: Add additional UI enhancements and animations
});
