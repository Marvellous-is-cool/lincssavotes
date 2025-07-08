/**
 * LINCSSA VOTES - Admin Settings Page JavaScript
 * Created: July 4, 2025
 */

// Wait for DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS animations
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
    });
  }

  // Initialize Flatpickr date pickers
  if (typeof flatpickr !== "undefined") {
    const datePickers = document.querySelectorAll(".date-picker");
    if (datePickers.length) {
      datePickers.forEach((picker) => {
        flatpickr(picker, {
          enableTime: true,
          dateFormat: "Y-m-d H:i",
          time_24hr: true,
        });
      });
    }
  }

  // Form validation
  const settingsForm = document.getElementById("settingsForm");
  if (settingsForm) {
    settingsForm.addEventListener("submit", function (event) {
      if (!this.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.classList.add("was-validated");
    });
  }

  // Password strength meter
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const passwordStrengthMeter = document.querySelector(
    ".password-strength-meter"
  );
  const progressBar = document.querySelector(
    ".password-strength-meter .progress-bar"
  );
  const passwordFeedback = document.querySelector(".password-feedback");

  if (newPasswordInput && passwordStrengthMeter) {
    newPasswordInput.addEventListener("focus", function () {
      passwordStrengthMeter.classList.remove("d-none");
    });

    newPasswordInput.addEventListener("input", function () {
      const password = this.value;
      let strength = 0;
      let feedback = "";

      if (password.length >= 8) {
        strength += 25;
      }

      if (password.match(/[A-Z]/)) {
        strength += 25;
      }

      if (password.match(/[0-9]/)) {
        strength += 25;
      }

      if (password.match(/[^A-Za-z0-9]/)) {
        strength += 25;
      }

      if (strength < 50) {
        feedback = "Password is weak. Add more variety.";
        progressBar.className = "progress-bar bg-danger";
      } else if (strength < 75) {
        feedback = "Password is moderate. Add more variety.";
        progressBar.className = "progress-bar bg-warning";
      } else {
        feedback = "Password is strong!";
        progressBar.className = "progress-bar bg-success";
      }

      progressBar.style.width = strength + "%";
      passwordFeedback.textContent = feedback;
    });

    if (confirmPasswordInput) {
      confirmPasswordInput.addEventListener("input", function () {
        if (this.value !== newPasswordInput.value) {
          this.setCustomValidity("Passwords do not match");
        } else {
          this.setCustomValidity("");
        }
      });
    }
  }

  // Reset confirmation field
  const resetConfirmInput = document.getElementById("resetConfirmInput");
  const resetSubmitBtn = document.getElementById("resetSubmitBtn");
  if (resetConfirmInput && resetSubmitBtn) {
    resetConfirmInput.addEventListener("input", function () {
      resetSubmitBtn.disabled = this.value !== "RESET";
    });
  }

  // Show toast notification
  window.showToast = function (message, type = "success") {
    const toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type} show`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");

    toast.innerHTML = `
      <div class="toast-header">
        <i class="fas ${
          type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
        } me-2"></i>
        <strong class="me-auto">${
          type === "success" ? "Success" : "Error"
        }</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 5000);
  };

  // Loading screen
  const loadingContainer = document.getElementById("loadingContainer");
  if (loadingContainer) {
    loadingContainer.classList.add("show");
    setTimeout(() => {
      loadingContainer.classList.remove("show");
    }, 800);
  }

  // Sidebar toggle functionality
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const mobileSidebarToggle = document.getElementById("mobileSidebarToggle");
  const mobileOverlay = document.getElementById("mobileOverlay");

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }

  if (mobileSidebarToggle) {
    mobileSidebarToggle.addEventListener("click", () => {
      sidebar.classList.add("show");
      mobileOverlay.classList.add("show");
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", () => {
      sidebar.classList.remove("show");
      mobileOverlay.classList.remove("show");
    });
  }

  // Theme switch
  const themeSwitch = document.getElementById("themeSwitch");
  if (themeSwitch) {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      themeSwitch.checked = true;
    }

    themeSwitch.addEventListener("change", function () {
      if (this.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
      }
    });
  }
});
