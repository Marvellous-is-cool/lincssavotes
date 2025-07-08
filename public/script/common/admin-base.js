/**
 * LINCSSA VOTES - Admin Common Base Script
 * This script provides common functionality for all admin pages
 * Created: July 5, 2025
 */

// Wait for DOM content to be loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("Admin common script loaded");

  // Initialize AOS animations if available
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
    });
  }

  // Handle loading screen
  const loadingContainer = document.getElementById("loadingContainer");
  if (loadingContainer) {
    loadingContainer.classList.add("show");
    setTimeout(() => {
      loadingContainer.classList.remove("show");
    }, 800);
  }

  // Create toast container if it doesn't exist
  if (!document.getElementById("toastContainer")) {
    const toastContainer = document.createElement("div");
    toastContainer.id = "toastContainer";
    toastContainer.className =
      "toast-container position-fixed bottom-0 end-0 p-3";
    document.body.appendChild(toastContainer);
  }

  // Sidebar toggle functionality
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const mobileSidebarToggle = document.getElementById("mobileSidebarToggle");
  const mobileOverlay = document.getElementById("mobileOverlay");

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }

  if (mobileSidebarToggle && sidebar) {
    mobileSidebarToggle.addEventListener("click", () => {
      sidebar.classList.add("show");
      if (mobileOverlay) mobileOverlay.classList.add("show");
    });
  }

  if (mobileOverlay && sidebar) {
    mobileOverlay.addEventListener("click", () => {
      sidebar.classList.remove("show");
      mobileOverlay.classList.remove("show");
    });
  }

  // Initialize date pickers if available
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

  // Initialize tooltips if Bootstrap is available
  if (typeof bootstrap !== "undefined") {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
});

// Global toast notification function
window.showToast = function (message, type = "success") {
  const toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) {
    console.error("Toast container not found");
    return;
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type} show`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  const iconClass =
    type === "success"
      ? "fa-check-circle"
      : type === "error"
      ? "fa-exclamation-circle"
      : type === "warning"
      ? "fa-exclamation-triangle"
      : "fa-info-circle";

  toast.innerHTML = `
        <div class="toast-header">
            <i class="fas ${iconClass} me-2"></i>
            <strong class="me-auto">${
              type.charAt(0).toUpperCase() + type.slice(1)
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
