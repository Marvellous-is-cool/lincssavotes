/**
 * LINCSSA VOTES - Admin Dashboard Common JavaScript
 * Created: July 5, 2025
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

  // Show toast notification
  window.showToast = function (message, type = "success") {
    const toastContainer =
      document.getElementById("toastContainer") || createToastContainer();

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

  // Create toast container if it doesn't exist
  function createToastContainer() {
    const toastContainer = document.createElement("div");
    toastContainer.id = "toastContainer";
    toastContainer.className =
      "toast-container position-fixed bottom-0 end-0 p-3";
    document.body.appendChild(toastContainer);
    return toastContainer;
  }

  // Light theme only - dark mode functionality removed
});
