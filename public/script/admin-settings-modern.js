/**
 * Advanced Settings Page JavaScript
 * Handles UI interactions and settings functionality
 * For the modernized LINCSSA VOTES admin panel
 *
 * Features:
 * - Theme preview and selection
 * - Dark mode toggle with persistence
 * - Logo upload preview
 * - Settings backup and restore
 * - Form validation and enhancements
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Initialize Bootstrap tabs
  const tabElms = document.querySelectorAll('button[data-bs-toggle="pill"]');
  tabElms.forEach((tabEl) => {
    tabEl.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("data-bs-target");
      const targetTab = document.querySelector(targetId);

      // Remove active class from all tabs and contents
      document
        .querySelectorAll(".nav-link")
        .forEach((tab) => tab.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach((pane) => {
        pane.classList.remove("show", "active");
      });

      // Add active class to clicked tab and its content
      this.classList.add("active");
      targetTab.classList.add("show", "active");
    });
  });

  // Initialize flatpickr for date inputs
  if (typeof flatpickr !== "undefined") {
    flatpickr(".date-picker", {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      altInput: true,
      altFormat: "F j, Y at h:i K",
      disableMobile: true,
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

      // Set the hidden input value
      const themeValue = this.getAttribute("data-value");
      colorThemeInput.value = themeValue;

      // Update the theme preview
      updateThemePreview(themeValue);

      // Apply theme colors to the preview
      document.documentElement.style.setProperty(
        "--primary-color",
        getThemeColor(themeValue)
      );
      document.documentElement.style.setProperty(
        "--secondary-color",
        adjustColor(getThemeColor(themeValue), -20)
      );
      document.documentElement.style.setProperty(
        "--header-gradient",
        `linear-gradient(135deg, ${getThemeColor(themeValue)}, ${adjustColor(
          getThemeColor(themeValue),
          -20
        )})`
      );
    });
  });

  // Layout style switcher
  const layoutStyleSelect = document.getElementById("layoutStyle");
  if (layoutStyleSelect) {
    layoutStyleSelect.addEventListener("change", function () {
      updateLayoutPreview(this.value);
    });
  }

  // Dark mode toggle
  const darkModeToggle = document.getElementById("darkModeToggle");
  if (darkModeToggle) {
    // Load saved preference from localStorage
    const isDarkMode = localStorage.getItem("darkMode") === "true";

    // Set initial state based on saved preference
    document.body.classList.toggle("dark-mode", isDarkMode);
    darkModeToggle.checked = isDarkMode;

    // Handle toggle change
    darkModeToggle.addEventListener("change", function () {
      const isDark = this.checked;
      document.body.classList.toggle("dark-mode", isDark);
      // Save preference to localStorage
      localStorage.setItem("darkMode", isDark);
    });
  }

  // Custom logo preview
  const customLogoInput = document.getElementById("customLogo");
  const logoPreviewImage = document.getElementById("logoPreviewImage");
  const logoPreviewPlaceholder = document.getElementById(
    "logoPreviewPlaceholder"
  );

  if (customLogoInput && logoPreviewImage) {
    customLogoInput.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
          logoPreviewImage.src = e.target.result;
          logoPreviewImage.style.display = "block";
          if (logoPreviewPlaceholder) {
            logoPreviewPlaceholder.style.display = "none";
          }
        };

        reader.readAsDataURL(this.files[0]);
      }
    });
  }

  // Backup settings
  const backupSettingsBtn = document.getElementById("backupSettingsBtn");
  if (backupSettingsBtn) {
    backupSettingsBtn.addEventListener("click", function () {
      // Show loading state
      const originalText = this.innerHTML;
      this.innerHTML =
        '<i class="fas fa-spinner fa-spin me-2"></i> Preparing Backup...';
      this.disabled = true;

      // Send AJAX request to get current settings
      fetch("/admin/api/settings")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Create a download link for the settings JSON
          const settingsBlob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });
          const downloadLink = document.createElement("a");
          downloadLink.href = URL.createObjectURL(settingsBlob);
          downloadLink.download = `lincssa_settings_backup_${
            new Date().toISOString().split("T")[0]
          }.json`;
          downloadLink.click();

          // Show success message
          showToast("Settings backup created successfully!", "success");
        })
        .catch((error) => {
          console.error("Error backing up settings:", error);
          showToast("Failed to create settings backup", "error");
        })
        .finally(() => {
          // Reset button state
          this.innerHTML = originalText;
          this.disabled = false;
        });
    });
  }

  // Restore settings
  const restoreSettingsBtn = document.getElementById("restoreSettingsBtn");
  const settingsRestoreFile = document.getElementById("settingsRestoreFile");

  if (restoreSettingsBtn && settingsRestoreFile) {
    restoreSettingsBtn.addEventListener("click", function () {
      if (!settingsRestoreFile.files || !settingsRestoreFile.files[0]) {
        showToast("Please select a backup file first", "warning");
        return;
      }

      // Show loading state
      const originalText = this.innerHTML;
      this.innerHTML =
        '<i class="fas fa-spinner fa-spin me-2"></i> Restoring...';
      this.disabled = true;

      // Read the file
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const settings = JSON.parse(e.target.result);

          // Send settings to server
          fetch("/admin/api/settings/restore", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(settings),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to restore settings");
              }
              return response.json();
            })
            .then((data) => {
              if (data.success) {
                showToast(
                  "Settings restored successfully! Reloading page...",
                  "success"
                );
                // Reload the page after a short delay
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              } else {
                throw new Error(data.error || "Failed to restore settings");
              }
            })
            .catch((error) => {
              console.error("Error restoring settings:", error);
              showToast(
                "Failed to restore settings: " + error.message,
                "error"
              );
              // Reset button state
              restoreSettingsBtn.innerHTML = originalText;
              restoreSettingsBtn.disabled = false;
            });
        } catch (error) {
          console.error("Error parsing settings file:", error);
          showToast("Invalid backup file format", "error");
          // Reset button state
          restoreSettingsBtn.innerHTML = originalText;
          restoreSettingsBtn.disabled = false;
        }
      };
      reader.readAsText(settingsRestoreFile.files[0]);
    });
  }

  // Helper functions
  function updateThemePreview(theme) {
    if (!themePreview) return;

    const themeColor = getThemeColor(theme);

    // Update the preview header background
    const header = themePreview.querySelector(".theme-preview-header");
    if (header) {
      header.style.background = `linear-gradient(135deg, ${themeColor}, ${adjustColor(
        themeColor,
        -20
      )})`;
    }

    // Update the preview button background
    const button = themePreview.querySelector(".theme-preview-button");
    if (button) {
      button.style.background = themeColor;
    }
  }

  function updateLayoutPreview(layout) {
    // Update layout preview based on selected layout
    const layoutPreviews = {
      modern: "Modern layout with cards and gradients",
      classic: "Classic layout with clean lines and subtle shadows",
      minimal: "Minimal layout with focus on content",
    };

    console.log("Layout changed to:", layoutPreviews[layout] || layout);

    // This could be expanded to show different layout previews visually
  }

  // Get color for theme
  function getThemeColor(theme) {
    // Define colors for each theme
    const themeColors = {
      default: "#3498db",
      blue: "#4361ee",
      green: "#2ecc71",
      orange: "#f39c12",
      purple: "#9b59b6",
      red: "#e74c3c",
    };

    return themeColors[theme] || themeColors["default"];
  }

  // Helper function to adjust color brightness
  function adjustColor(color, amount) {
    return (
      "#" +
      color
        .replace(/^#/, "")
        .replace(/../g, (color) =>
          (
            "0" +
            Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(
              16
            )
          ).substr(-2)
        )
    );
  }

  // Toast notification helper
  function showToast(message, type = "info") {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.className =
        "toast-container position-fixed bottom-0 end-0 p-3";
      document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toastEl = document.createElement("div");
    toastEl.className = `toast align-items-center text-white bg-${
      type === "error" ? "danger" : type
    }`;
    toastEl.setAttribute("role", "alert");
    toastEl.setAttribute("aria-live", "assertive");
    toastEl.setAttribute("aria-atomic", "true");

    // Toast content
    toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

    // Add to container
    toastContainer.appendChild(toastEl);

    // Initialize and show toast
    const toast = new bootstrap.Toast(toastEl, {
      autohide: true,
      delay: 5000,
    });
    toast.show();

    // Remove after hiding
    toastEl.addEventListener("hidden.bs.toast", function () {
      toastEl.remove();
    });
  }

  // Initialize the theme preview with the current theme
  const initialTheme = colorThemeInput ? colorThemeInput.value : "default";
  updateThemePreview(initialTheme);

  // Initialize AOS animation library if available
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }

  // Add form validation
  const settingsForm = document.getElementById("settingsForm");
  if (settingsForm) {
    settingsForm.addEventListener("submit", function (event) {
      // Add Bootstrap validation
      if (!this.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.classList.add("was-validated");
    });
  }
});
