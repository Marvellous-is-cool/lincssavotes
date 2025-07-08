/**
 * LINCSSA VOTES - Ultra-Modern Admin UI JavaScript
 * Created: July 3, 2025
 * Updated: July 4, 2025
 */

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
    setTimeout(() => {
      loadingContainer.classList.add("loaded");
      setTimeout(() => {
        loadingContainer.style.display = "none";
      }, 500);
    }, 500);
  }

  // Initialize Bootstrap tooltips
  if (
    typeof bootstrap !== "undefined" &&
    typeof bootstrap.Tooltip !== "undefined"
  ) {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  // Initialize Bootstrap popovers
  if (
    typeof bootstrap !== "undefined" &&
    typeof bootstrap.Popover !== "undefined"
  ) {
    const popoverTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="popover"]')
    );
    popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl, {
        html: true,
        trigger: "focus",
      });
    });
  }

  // Mobile Sidebar Toggle
  const mobileOverlay = document.getElementById("mobileOverlay");
  const sidebar = document.getElementById("sidebar");

  document
    .getElementById("mobileSidebarToggle")
    ?.addEventListener("click", function () {
      sidebar.classList.toggle("active");
      mobileOverlay.classList.toggle("active");
      document.body.classList.toggle("sidebar-open");
    });

  document
    .getElementById("sidebarToggle")
    ?.addEventListener("click", function () {
      sidebar.classList.toggle("collapsed");
      document.querySelector(".main-content")?.classList.toggle("expanded");
    });

  mobileOverlay?.addEventListener("click", function () {
    sidebar.classList.remove("active");
    mobileOverlay.classList.remove("active");
    document.body.classList.remove("sidebar-open");
  });

  /**
   * Animated Counter Function
   * Animates counting from 0 to target value
   * @param {HTMLElement} element - The element to animate
   * @param {number} target - The target value to count to
   * @param {number} duration - Animation duration in milliseconds
   */
  function animateCounter(element, target, duration = 2000) {
    if (!element) return;

    const startTime = performance.now();

    // Make element visible
    element.classList.add("visible");

    function updateCounter(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Easing function for smoother animation
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const value = Math.floor(easeProgress * target);
      element.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // Start counter animations if counters exist
  const counters = document.querySelectorAll(".counter-value");
  if (counters.length > 0) {
    setTimeout(() => {
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-target"));
        animateCounter(counter, target);
      });
    }, 800);
  }

  /**
   * Toast Notification System
   * Creates and displays toast notifications
   * @param {string} title - Toast notification title
   * @param {string} message - Toast notification message
   * @param {string} type - Toast type (success, error, warning, info)
   */
  function showToast(title, message, type = "info") {
    const toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) return;

    const iconClass = {
      success: "fas fa-check-circle text-success",
      error: "fas fa-exclamation-circle text-danger",
      warning: "fas fa-exclamation-triangle text-warning",
      info: "fas fa-info-circle text-info",
    };

    const toast = document.createElement("div");
    toast.className = "toast align-items-center border-0";
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");

    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <div class="d-flex">
            <div class="me-2">
              <i class="${iconClass[type] || iconClass.info}"></i>
            </div>
            <div>
              <strong>${title}</strong>
              <div>${message}</div>
            </div>
          </div>
        </div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, { delay: 5000 });
    bsToast.show();

    toast.addEventListener("hidden.bs.toast", function () {
      toast.remove();
    });
  }

  // Expose the toast function globally
  window.showToast = showToast;

  // Export Results Button (if exists)
  document
    .getElementById("exportVotersBtn")
    ?.addEventListener("click", function () {
      showToast(
        "Export Initiated",
        "Exporting voter data to CSV file...",
        "info"
      );

      // Simulate export completion (in a real app, you'd handle the AJAX export here)
      setTimeout(() => {
        showToast(
          "Export Complete",
          "Voter data has been exported successfully!",
          "success"
        );
      }, 2000);
    });

  // Export Results Button (if exists)
  document
    .getElementById("exportResultsBtn")
    ?.addEventListener("click", function () {
      showToast("Export Initiated", "Exporting results data...", "info");

      // Simulate export completion (in a real app, you'd handle the AJAX export here)
      setTimeout(() => {
        showToast(
          "Export Complete",
          "Results data has been exported successfully!",
          "success"
        );
      }, 2000);
    });

  // Print Results Button (if exists)
  document
    .getElementById("printResultsBtn")
    ?.addEventListener("click", function () {
      window.print();
    });

  // Reset confirmation input validation (if exists)
  const resetConfirmationInput = document.getElementById("resetConfirmation");
  const resetAllVotesButton = document.getElementById("resetAllVotesButton");

  if (resetConfirmationInput && resetAllVotesButton) {
    resetConfirmationInput.addEventListener("input", function () {
      resetAllVotesButton.disabled = this.value !== "RESET ALL VOTES";
    });
  }

  // Toggle public results display (if exists)
  document
    .getElementById("showResultsPublicToggle")
    ?.addEventListener("change", function () {
      const isChecked = this.checked;

      // Send AJAX request to update setting
      fetch("/admin/settings/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayResults: isChecked,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            showToast(
              "Settings Updated",
              "Results visibility setting has been updated successfully.",
              "success"
            );
          } else {
            showToast(
              "Update Failed",
              "Failed to update results visibility setting.",
              "error"
            );
            // Revert the toggle if the update failed
            this.checked = !isChecked;
          }
        })
        .catch((error) => {
          console.error("Error updating setting:", error);
          showToast(
            "Update Failed",
            "An error occurred while updating the setting.",
            "error"
          );
          // Revert the toggle if the update failed
          this.checked = !isChecked;
        });
    });

  // Reset votes modal handling
  const resetVotesModal = document.getElementById("resetVotesModal");
  if (resetVotesModal) {
    resetVotesModal.addEventListener("show.bs.modal", function (event) {
      const button = event.relatedTarget;
      const id = button.getAttribute("data-id");
      const matric = button.getAttribute("data-matric");

      document.getElementById("resetVoterId").value = id;
      document.getElementById("resetVoterMatric").textContent = matric;
    });
  }

  // Delete voter modal handling
  const deleteVoterModal = document.getElementById("deleteVoterModal");
  if (deleteVoterModal) {
    deleteVoterModal.addEventListener("show.bs.modal", function (event) {
      const button = event.relatedTarget;
      const id = button.getAttribute("data-id");
      const matric = button.getAttribute("data-matric");

      document.getElementById("deleteVoterId").value = id;
      document.getElementById("deleteVoterMatric").textContent = matric;
    });
  }

  // Filter dropdown actions for voter list
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");
      let rows = document.querySelectorAll("#votersTable tbody tr");

      rows.forEach((row) => {
        if (filter === "all") {
          row.classList.remove("d-none");
        } else if (filter === "voted") {
          row.classList.toggle(
            "d-none",
            !row.querySelector(".badge.bg-success-subtle")
          );
        } else if (filter === "not-voted") {
          row.classList.toggle(
            "d-none",
            !row.querySelector(".badge.bg-warning-subtle")
          );
        }
      });
    });
  });

  // Search functionality for tables (when DataTables is not initialized)
  document
    .querySelector("#searchVoters")
    ?.addEventListener("keyup", function () {
      const value = this.value.toLowerCase();
      const rows = document.querySelectorAll("#votersTable tbody tr");

      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.indexOf(value) > -1 ? "" : "none";
      });
    });
});
