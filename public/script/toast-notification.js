/**
 * Global Toast Notification System
 * Provides a way to show toast notifications without using browser alerts
 */

// Initialize toast notification system
document.addEventListener("DOMContentLoaded", function () {
  // Create toast container if it doesn't exist
  if (!document.querySelector(".toast-container")) {
    const toastContainer = document.createElement("div");
    toastContainer.className = "toast-container position-fixed top-0 end-0 p-3";
    toastContainer.style.zIndex = "9999";
    document.body.appendChild(toastContainer);
  }
});

// Global toast notification function
window.showToast = function (message, type = "info") {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container position-fixed top-0 end-0 p-3";
    toastContainer.style.zIndex = "9999";
    document.body.appendChild(toastContainer);
  }

  // Create toast element
  const toastId = "toast-" + Date.now();
  const toastElement = document.createElement("div");
  toastElement.className = `toast align-items-center text-white bg-${
    type === "info" ? "primary" : type
  }`;
  toastElement.id = toastId;
  toastElement.setAttribute("role", "alert");
  toastElement.setAttribute("aria-live", "assertive");
  toastElement.setAttribute("aria-atomic", "true");

  toastElement.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  toastContainer.appendChild(toastElement);

  // Initialize and show toast using Bootstrap if available
  if (typeof bootstrap !== "undefined" && bootstrap.Toast) {
    const toastInstance = new bootstrap.Toast(toastElement, {
      animation: true,
      autohide: true,
      delay: 4000,
    });
    toastInstance.show();
  } else {
    // Fallback if Bootstrap is not available
    toastElement.style.display = "block";
    toastElement.style.opacity = "1";

    setTimeout(() => {
      toastElement.style.opacity = "0";
      toastElement.style.transition = "opacity 0.5s ease";

      setTimeout(() => {
        toastElement.remove();
      }, 500);
    }, 4000);
  }

  // Remove toast element after it's hidden
  toastElement.addEventListener("hidden.bs.toast", function () {
    toastElement.remove();
  });
};
