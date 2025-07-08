/**
 * LINCSSA VOTES - Positions Handler JavaScript
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

  // Initialize sortable positions
  function initializeSortable() {
    console.log("Attempting to initialize Sortable.js...");

    // First try the specific element ID
    let positionsList = document.getElementById("positionsList");

    // If not found, try alternative ID
    if (!positionsList) {
      positionsList = document.getElementById("sortablePositions");
      if (positionsList) {
        console.log(
          "Found element with ID 'sortablePositions' instead of 'positionsList'"
        );
      }
    }

    // If still not found, try by class name as last resort
    if (!positionsList) {
      positionsList = document.querySelector(".position-drag-container");
      if (positionsList) {
        console.log("Found element with class 'position-drag-container'");
      }
    }

    if (positionsList && typeof Sortable !== "undefined") {
      console.log(
        "Initializing Sortable on positions list with ID:",
        positionsList.id
      );
      const sortable = new Sortable(positionsList, {
        animation: 150,
        handle: ".position-drag-handle", // Use the drag handle element
        ghostClass: "sortable-ghost", // Class for the drop placeholder
        chosenClass: "sortable-chosen", // Class for the chosen item
        dragClass: "sortable-drag", // Class for the dragging item
        onEnd: function (evt) {
          console.log("Sort ended, updating position order");
          // Update position order in backend
          updatePositionOrder();
        },
      });

      console.log(
        "Sortable initialized successfully on element:",
        positionsList.id || positionsList.className
      );
    } else {
      console.error("Sortable container not found or Sortable.js not loaded");

      // Log element information to help debugging
      if (!positionsList) {
        console.error(
          "Could not find any suitable container for position sorting"
        );
        console.log("Available elements with similar classes:");
        document
          .querySelectorAll("[id*='position']")
          .forEach((el) =>
            console.log(
              "- Element:",
              el.tagName,
              "ID:",
              el.id,
              "Class:",
              el.className
            )
          );
      }

      if (typeof Sortable === "undefined") {
        console.error("Sortable.js library is not loaded properly");
      }
    }
  }

  // Call initialize function
  initializeSortable();

  // Function to update position order
  function updatePositionOrder() {
    // Try more specific selector first - target the tbody with ID "positionsList"
    let positionsContainer = document.getElementById("positionsList");
    let positionItems = [];

    if (positionsContainer) {
      // Get direct position items from the container
      positionItems = Array.from(positionsContainer.children);
      console.log(`Found ${positionItems.length} positions in #positionsList`);
    } else {
      // Fall back to more generic selectors
      positionItems = Array.from(
        document.querySelectorAll(
          "tr.position-item, .position-item, tbody[id*='position'] > tr"
        )
      );
      console.log(
        `Found ${positionItems.length} positions using fallback selectors`
      );
    }

    if (positionItems.length === 0) {
      console.warn("No position items found for ordering");
      return;
    }

    console.log(`Updating order for ${positionItems.length} positions`);
    const orderData = [];

    positionItems.forEach((item, index) => {
      // Try different ways of getting position ID
      let positionId = null;

      // Check for data attributes first (preferred method)
      if (item.dataset.positionId) {
        positionId = item.dataset.positionId;
      } else if (item.dataset.id) {
        positionId = item.dataset.id;
      }

      // If no data attribute, try regular attributes
      if (!positionId) {
        positionId =
          item.getAttribute("data-position-id") || item.getAttribute("data-id");
      }

      // Last resort - try to find a child element with the ID
      if (!positionId) {
        const idElement = item.querySelector("[data-position-id], [data-id]");
        if (idElement) {
          positionId = idElement.dataset.positionId || idElement.dataset.id;
        }
      }

      console.log(`Position ${index + 1}:`, positionId);

      if (positionId) {
        orderData.push({
          id: positionId,
          _id: positionId, // Include both formats for compatibility
          order: index + 1,
        });
      }
    });

    if (orderData.length === 0) {
      console.warn("No valid position IDs found, cannot update order");
      return;
    }

    // Send AJAX request to update positions order
    console.log("Sending order data:", orderData);
    fetch("/admin/positions/update-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ positions: orderData }),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Server responded with status:", response.status);
          return response.text().then((text) => {
            try {
              return JSON.parse(text);
            } catch (e) {
              return {
                success: false,
                message: text || "Unknown error occurred",
              };
            }
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          showToast("Position order updated successfully");

          // Update the displayed order numbers if they exist
          positionItems.forEach((item, index) => {
            const orderDisplay = item.querySelector(".position-order");
            if (orderDisplay) {
              orderDisplay.textContent = index + 1;
            }
          });
        } else {
          showToast(
            "Failed to update position order: " +
              (data.message || "Unknown error"),
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Error updating position order:", error);
        showToast("Error updating position order", "error");
      });
  }

  // Search functionality
  const searchInput = document.getElementById("searchPositions");
  const positionItems = document.querySelectorAll(".position-item");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();

      positionItems.forEach((item) => {
        const title = item
          .querySelector(".position-title")
          .textContent.toLowerCase();
        const description = item
          .querySelector(".position-description")
          .textContent.toLowerCase();

        if (title.includes(searchTerm) || description.includes(searchTerm)) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    });
  }

  // Status filter
  const statusFilter = document.getElementById("statusFilter");

  if (statusFilter) {
    statusFilter.addEventListener("change", function () {
      const selectedStatus = this.value;

      positionItems.forEach((item) => {
        const isActive = item
          .querySelector(".status-indicator")
          .classList.contains("active");

        if (
          selectedStatus === "all" ||
          (selectedStatus === "active" && isActive) ||
          (selectedStatus === "inactive" && !isActive)
        ) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    });
  }

  // Position status toggle
  const statusToggles = document.querySelectorAll(".toggle-position-status");

  statusToggles.forEach((toggle) => {
    toggle.addEventListener("change", function () {
      const positionId = this.dataset.positionId;
      const isActive = this.checked;

      // Send AJAX request to update status
      fetch("/admin/positions/toggle-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: positionId, isActive }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Update UI
            const statusIndicator = toggle
              .closest(".position-item")
              .querySelector(".status-indicator");
            if (isActive) {
              statusIndicator.classList.remove("inactive");
              statusIndicator.classList.add("active");
            } else {
              statusIndicator.classList.remove("active");
              statusIndicator.classList.add("inactive");
            }

            // Show toast notification
            showToast(
              `Position ${isActive ? "activated" : "deactivated"} successfully`
            );
          } else {
            // Show error and revert toggle
            showToast("Error updating position status", "error");
            toggle.checked = !isActive;
          }
        })
        .catch((error) => {
          console.error("Error updating position status:", error);
          showToast("Error updating position status", "error");
          toggle.checked = !isActive;
        });
    });
  });

  // Edit position modal
  const editPositionModal = document.getElementById("editPositionModal");
  if (editPositionModal) {
    editPositionModal.addEventListener("show.bs.modal", function (event) {
      const button = event.relatedTarget;
      const positionId = button.getAttribute("data-position-id");

      // Fetch position data via AJAX
      fetch(`/admin/positions/${positionId}/json`)
        .then((response) => response.json())
        .then((data) => {
          document.getElementById("editPositionId").value = data._id;
          document.getElementById("editTitle").value = data.title;
          document.getElementById("editDescription").value =
            data.description || "";
          document.getElementById("editIsActive").checked = data.isActive;
          document.getElementById("editDisplayResults").checked =
            data.displayResults;
          document.getElementById("editMaxSelection").value =
            data.maxSelection || 1;
        })
        .catch((error) =>
          console.error("Error fetching position data:", error)
        );
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

  // Load position data and contestants
  function loadPositionData() {
    fetch("/admin/positions/data")
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.positions) {
          console.log(
            "Positions data loaded successfully:",
            data.positions.length
          );
          // Initialize the data for the positions
          initializePositionsData(data.positions);
          // Update the UI to reflect the loaded data
          updatePositionsUI(data.positions);
        } else {
          console.error("Failed to load positions data");
          showToast("Failed to load positions data", "error");
        }
      })
      .catch((error) => {
        console.error("Error loading positions data:", error);
        showToast("Error loading positions data", "error");
      });
  }

  // Initialize the positions data
  function initializePositionsData(positions) {
    // Store positions in global window object for access by other scripts
    window.positionsData = positions;

    // Create any necessary data structures for the positions
    positions.forEach((position) => {
      // Add any additional initialization here
      console.log(
        `Position ${position.title} has ${
          position.contestants ? position.contestants.length : 0
        } contestants`
      );
    });
  }

  // Update the UI based on positions data
  function updatePositionsUI(positions) {
    // Update status indicators
    positions.forEach((position) => {
      const positionItem = document.querySelector(
        `.position-item[data-position-id="${position._id}"]`
      );
      if (positionItem) {
        const statusIndicator = positionItem.querySelector(".status-indicator");
        const statusToggle = positionItem.querySelector(
          ".toggle-position-status"
        );

        if (statusIndicator) {
          statusIndicator.classList.remove("active", "inactive");
          statusIndicator.classList.add(
            position.isActive ? "active" : "inactive"
          );
          statusIndicator.textContent = position.isActive
            ? "Active"
            : "Inactive";
        }

        if (statusToggle) {
          statusToggle.checked = position.isActive;
        }
      }
    });
  }

  // Attempt to load position data on page load
  loadPositionData();
});
