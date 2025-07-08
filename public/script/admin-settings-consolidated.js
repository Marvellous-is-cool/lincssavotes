/**
 * Consolidated Settings Page JavaScript
 * Combines all functionality from modern and fix scripts
 * For the LINCSSA VOTES admin panel settings page
 */

// Add some debugging before DOM content loaded
console.log("Script loaded - waiting for DOM ready");

// Check for script loading conflicts
window.lincssaSettingsLoaded = window.lincssaSettingsLoaded || false;
if (window.lincssaSettingsLoaded) {
  console.warn("Settings script loaded multiple times!");
} else {
  window.lincssaSettingsLoaded = true;
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("admin-settings-consolidated.js loaded");

  // Add console debug messages
  console.log("Page URL:", window.location.href);
  console.log(
    "Bootstrap version:",
    typeof bootstrap !== "undefined" ? "Loaded" : "Not loaded"
  );
  console.log(
    "jQuery version:",
    typeof jQuery !== "undefined" ? jQuery.fn.jquery : "Not loaded"
  );

  // -------------- BOOTSTRAP TAB HANDLING --------------
  // Removed custom tab handling to avoid conflicts with dedicated tab fix script
  console.log("Tab handling moved to dedicated bootstrap-tab-fix.js script");

  // We'll use the dedicated bootstrap-tab-fix.js for tab functionality
  // This avoids conflicts between multiple scripts trying to handle the same tabs

  // Light theme only - dark mode functionality removed

  // -------------- COLOR THEME SELECTION --------------
  const initColorThemes = () => {
    const colorSwatches = document.querySelectorAll(".color-swatch");
    const colorThemeInput = document.getElementById("colorTheme");

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

        // Live preview functionality
        updateThemePreview(themeValue);
      });
    });
  };

  // Function to update theme preview
  const updateThemePreview = (themeValue) => {
    // Get theme color based on value
    let themeColor;
    switch (themeValue) {
      case "blue":
        themeColor = "#4361ee";
        break;
      case "green":
        themeColor = "#2ecc71";
        break;
      case "orange":
        themeColor = "#f39c12";
        break;
      case "purple":
        themeColor = "#9b59b6";
        break;
      case "red":
        themeColor = "#e74c3c";
        break;
      default:
        themeColor = "#3498db"; // default color
    }

    // Update preview elements
    const previewHeader = document.querySelector(".theme-preview-header");
    const previewButton = document.querySelector(".theme-preview-button");

    if (previewHeader) previewHeader.style.backgroundColor = themeColor;
    if (previewButton) previewButton.style.backgroundColor = themeColor;

    // Set CSS variable for real-time theme changes
    document.documentElement.style.setProperty("--primary-color", themeColor);
  };

  // Initialize color themes
  initColorThemes();

  // Set initial theme preview based on current value
  const initialTheme =
    document.getElementById("colorTheme")?.value || "default";
  updateThemePreview(initialTheme);

  // -------------- DATE PICKER INITIALIZATION --------------
  if (typeof flatpickr !== "undefined") {
    flatpickr(".datepicker", {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      time_24hr: true,
      altInput: true,
      altFormat: "F j, Y at h:i K",
    });
  }

  // -------------- TOOLTIP INITIALIZATION --------------
  if (typeof bootstrap !== "undefined" && bootstrap.Tooltip) {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  // -------------- LOGO PREVIEW FUNCTIONALITY --------------
  const initLogoPreview = () => {
    const logoInput = document.getElementById("customLogo");
    const logoPreviewImage = document.getElementById("logoPreviewImage");
    const logoPreviewPlaceholder = document.getElementById(
      "logoPreviewPlaceholder"
    );
    const uploadLogoBtn = document.getElementById("uploadLogoBtn");

    if (logoInput && logoPreviewImage) {
      logoInput.addEventListener("change", function () {
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

    // Handle upload button click
    if (uploadLogoBtn && logoInput) {
      uploadLogoBtn.addEventListener("click", function () {
        logoInput.click();
      });
    }
  };

  // Initialize logo preview functionality
  initLogoPreview();

  // -------------- SETTINGS BACKUP/RESTORE --------------
  // Backup settings functionality
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

  // Reset confirmation button
  const confirmTextInput = document.getElementById("confirmText");
  const confirmResetBtn = document.getElementById("confirmResetBtn");

  if (confirmTextInput && confirmResetBtn) {
    confirmTextInput.addEventListener("input", function () {
      confirmResetBtn.disabled = this.value !== "RESET";
    });
  }

  // Initialize AOS animations if available
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
    });
  }

  // Hide debug info after 5 seconds
  setTimeout(function () {
    const debugInfo = document.getElementById("debugInfo");
    if (debugInfo) {
      debugInfo.style.display = "none";
    }
  }, 5000);
});
