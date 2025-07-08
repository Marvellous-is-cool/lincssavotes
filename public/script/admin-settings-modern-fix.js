/**
 * Advanced Settings Page JavaScript - Fixed version
 * Handles UI interactions and settings functionality
 * For the modernized LINCSSA VOTES admin panel
 *
 * Features:
 * - Theme preview and selection
 * - Dark mode toggle with persistence
 * - Logo upload preview
 * - Settings backup and restore
 * - Form validation and enhancements
 * - Fixed tabs initialization for Bootstrap 5
 */

document.addEventListener("DOMContentLoaded", function () {
  console.log("admin-settings-modern-fix.js loaded");

  // Add console debug messages to help diagnose issues
  console.log("Page URL:", window.location.href);
  console.log(
    "Bootstrap version:",
    typeof bootstrap !== "undefined" ? "Loaded" : "Not loaded"
  );
  console.log(
    "jQuery version:",
    typeof jQuery !== "undefined" ? jQuery.fn.jquery : "Not loaded"
  );

  // Fix Bootstrap 5 tabs functionality - manual implementation
  const navLinks = document.querySelectorAll("#settings-tabs .nav-link");
  console.log("Nav links found:", navLinks.length);

  // First let's manually activate the first tab if none is active
  let hasActiveTab = false;
  navLinks.forEach((link) => {
    if (link.classList.contains("active")) {
      hasActiveTab = true;

      // Force activate the corresponding content
      const tabId = link.getAttribute("data-bs-target");
      const tabContent = document.querySelector(tabId);
      if (tabContent) {
        console.log("Activating tab content:", tabId);
        document.querySelectorAll(".tab-pane").forEach((pane) => {
          pane.classList.remove("show", "active");
        });
        tabContent.classList.add("show", "active");
      }
    }
  });

  if (!hasActiveTab && navLinks.length > 0) {
    console.log("No active tab found, activating first tab");
    navLinks[0].classList.add("active");
    const tabId = navLinks[0].getAttribute("data-bs-target");
    const tabContent = document.querySelector(tabId);
    if (tabContent) {
      tabContent.classList.add("show", "active");
    }
  }

  // Now set up click handlers
  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      console.log("Tab clicked:", this.textContent.trim());
      event.preventDefault();

      // Clear active class from all tabs
      navLinks.forEach((l) => l.classList.remove("active"));

      // Add active class to current tab
      this.classList.add("active");

      // Show the corresponding tab content
      const tabId = this.getAttribute("data-bs-target");
      console.log("Target tab:", tabId);
      document.querySelectorAll(".tab-pane").forEach((pane) => {
        pane.classList.remove("show", "active");
      });
      const targetPane = document.querySelector(tabId);
      if (targetPane) {
        targetPane.classList.add("show", "active");
      } else {
        console.error("Tab pane not found:", tabId);
      }
    });
  });

  // Initialize tooltips
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Initialize datepickers
  if (typeof flatpickr !== "undefined") {
    flatpickr(".datepicker", {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      time_24hr: true,
      altInput: true,
      altFormat: "F j, Y at h:i K",
    });
  }

  // Color theme switcher with live preview
  const colorSwatches = document.querySelectorAll(".color-swatch");
  const colorThemeInput = document.getElementById("colorTheme");
  const themePreview = document.querySelector(".theme-preview");

  colorSwatches.forEach((swatch) => {
    swatch.addEventListener("click", function () {
      // Remove active class from all swatches
      colorSwatches.forEach((s) => s.classList.remove("active"));

      // Add active class to clicked swatch
      this.classList.add("active");

      // Update hidden input value
      const themeValue = this.getAttribute("data-value");
      if (colorThemeInput) {
        colorThemeInput.value = themeValue;
      }
    });
  });

  // Dark mode toggle with localStorage persistence
  const darkModeToggle = document.getElementById("toggleDarkMode");
  if (darkModeToggle) {
    // Load saved preference
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    }

    // Toggle dark mode
    darkModeToggle.addEventListener("click", function (e) {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("darkMode", isDark);
    });
  }

  // Logo preview functionality
  const logoInput = document.getElementById("customLogo");
  const logoPreview = document.getElementById("logoPreview");
  if (logoInput && logoPreview) {
    logoInput.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
          logoPreview.src = e.target.result;
          logoPreview.style.display = "block";
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  }

  // Password strength meter
  const passwordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const passwordStrength = document.getElementById("passwordStrength");

  if (passwordInput && passwordStrength) {
    passwordInput.addEventListener("input", function () {
      const password = this.value;
      let strength = 0;
      let feedback = "";

      if (password.length > 8) strength += 20;
      if (password.match(/[A-Z]/)) strength += 20;
      if (password.match(/[a-z]/)) strength += 20;
      if (password.match(/[0-9]/)) strength += 20;
      if (password.match(/[^A-Za-z0-9]/)) strength += 20;

      const progressBar = passwordStrength.querySelector(".progress-bar");
      const passwordFeedback = document.getElementById("passwordFeedback");

      if (strength < 40) {
        feedback = "Password is weak";
        progressBar.className = "progress-bar bg-danger";
      } else if (strength < 80) {
        feedback = "Password is moderate";
        progressBar.className = "progress-bar bg-warning";
      } else {
        feedback = "Password is strong!";
        progressBar.className = "progress-bar bg-success";
      }

      progressBar.style.width = strength + "%";
      if (passwordFeedback) {
        passwordFeedback.textContent = feedback;
      }
    });
  }

  // Settings backup functionality
  const backupSettingsBtn = document.getElementById("backupSettingsBtn");
  if (backupSettingsBtn) {
    backupSettingsBtn.addEventListener("click", function () {
      // Show loading state
      const originalText = this.innerHTML;
      this.innerHTML =
        '<i class="fas fa-spinner fa-spin me-2"></i> Creating Backup...';
      this.disabled = true;

      fetch("/admin/api/settings")
        .then((response) => response.json())
        .then((data) => {
          // Create download link
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download =
            "lincssa_settings_" +
            new Date().toISOString().split("T")[0] +
            ".json";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          alert("Settings backup created successfully!");
        })
        .catch((error) => {
          console.error("Error creating backup:", error);
          alert("Failed to create settings backup");
        })
        .finally(() => {
          // Reset button
          this.innerHTML = originalText;
          this.disabled = false;
        });
    });
  }

  // Settings restore functionality
  const restoreSettingsBtn = document.getElementById("restoreSettingsBtn");
  const settingsFileInput = document.getElementById("settingsRestoreFile");

  if (restoreSettingsBtn && settingsFileInput) {
    restoreSettingsBtn.addEventListener("click", function () {
      if (!settingsFileInput.files || !settingsFileInput.files[0]) {
        alert("Please select a settings backup file first");
        return;
      }

      const file = settingsFileInput.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        try {
          const settings = JSON.parse(e.target.result);

          // Show loading state
          const originalText = restoreSettingsBtn.innerHTML;
          restoreSettingsBtn.innerHTML =
            '<i class="fas fa-spinner fa-spin me-2"></i> Restoring...';
          restoreSettingsBtn.disabled = true;

          // Send to server
          fetch("/admin/api/settings/restore", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(settings),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                alert("Settings restored successfully! Page will reload now.");
                setTimeout(() => window.location.reload(), 1000);
              } else {
                throw new Error(data.error || "Unknown error");
              }
            })
            .catch((error) => {
              console.error("Error restoring settings:", error);
              alert("Failed to restore settings: " + error.message);

              // Reset button
              restoreSettingsBtn.innerHTML = originalText;
              restoreSettingsBtn.disabled = false;
            });
        } catch (e) {
          alert("Invalid settings file format");
          console.error(e);
        }
      };

      reader.readAsText(file);
    });
  }

  // System statistics update functionality
  function updateSystemStats() {
    // This would fetch the latest system stats from a server API
    // For now we'll just use placeholder data
    document.getElementById("totalVoters").textContent = "1,245";
    document.getElementById("totalVotes").textContent = "3,782";
    document.getElementById("votingRate").textContent = "76%";
  }

  // Call once on page load
  updateSystemStats();

  // Initialize AOS animations
  if (typeof AOS !== "undefined") {
    console.log("Initializing AOS animations");
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }

  // Enable all form elements now that JavaScript is loaded
  document
    .querySelectorAll("form input, form select, form textarea, form button")
    .forEach((el) => {
      el.removeAttribute("disabled");
    });
});
