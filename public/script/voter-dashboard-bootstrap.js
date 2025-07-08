/**
 * Dashboard Bootstrap Enhancements
 * Additional functionality for the Bootstrap voter dashboard
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Add pulsing animation to countdown
  const countdownElement = document.getElementById("voting-countdown");
  if (countdownElement) {
    setInterval(() => {
      countdownElement.classList.add("text-pulse");
      setTimeout(() => {
        countdownElement.classList.remove("text-pulse");
      }, 1000);
    }, 2000);
  }

  // Show welcome toast on first visit
  const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
  if (!hasSeenWelcome) {
    setTimeout(() => {
      showToast(
        "Welcome to the LINCSSA Voting Dashboard! Cast your vote today.",
        "info"
      );
      localStorage.setItem("hasSeenWelcome", "true");
    }, 1500);
  }

  // Function to show toast notification
  window.showToast = function (message, type = "info") {
    const toastElement = document.createElement("div");
    toastElement.className = `toast ${type} align-items-center`;
    toastElement.setAttribute("role", "alert");
    toastElement.setAttribute("aria-live", "assertive");
    toastElement.setAttribute("aria-atomic", "true");

    // Add icon based on type
    let icon = "info-circle";
    if (type === "success") icon = "check-circle";
    if (type === "warning") icon = "exclamation-triangle";
    if (type === "error") icon = "times-circle";

    toastElement.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <i class="fas fa-${icon} me-2"></i>
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    const container = document.querySelector(".toast-container");
    container.appendChild(toastElement);

    const toast = new bootstrap.Toast(toastElement, {
      autohide: true,
      delay: 5000,
    });
    toast.show();

    toastElement.addEventListener("hidden.bs.toast", function () {
      toastElement.remove();
    });
  };

  // Add visual feedback to buttons
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      ripple.classList.add("ripple-effect");

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

  // Update progress indicators
  updateVoteProgress();
});

// Function to update vote progress indicators
function updateVoteProgress() {
  const progressBar = document.querySelector(".progress-bar");
  if (!progressBar) return;

  const width = progressBar.style.width;
  const numericWidth = parseInt(width);

  // Add color based on progress
  if (numericWidth >= 100) {
    progressBar.classList.add("bg-success");
  } else if (numericWidth > 50) {
    progressBar.style.background = "linear-gradient(90deg, #5e60ce, #4cc9f0)";
  } else if (numericWidth > 0) {
    progressBar.style.background = "linear-gradient(90deg, #5e60ce, #5e60ce)";
  }
}

// Add CSS styles for animations
const style = document.createElement("style");
style.innerHTML = `
  .text-pulse {
    animation: pulse 1s;
  }

  @keyframes pulse {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
    100% { opacity: 1; transform: scale(1); }
  }

  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.3);
    pointer-events: none;
    transform: scale(0);
    animation: ripple 0.6s linear;
  }

  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  .btn {
    position: relative;
    overflow: hidden;
  }
`;
document.head.appendChild(style);
