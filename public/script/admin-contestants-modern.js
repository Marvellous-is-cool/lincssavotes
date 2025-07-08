/**
 * Modern Contestants Management JavaScript
 * Enhanced functionality for the contestants management page
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Enhanced search functionality
  const searchInput = document.getElementById("searchContestants");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase().trim();
      const contestantCards = document.querySelectorAll(
        ".contestant-card-wrapper"
      );

      contestantCards.forEach((cardWrapper) => {
        const card = cardWrapper.querySelector(".contestant-card");
        const name =
          card.querySelector(".contestant-name")?.textContent.toLowerCase() ||
          "";
        const level =
          card
            .querySelector(".contestant-details")
            ?.textContent.toLowerCase() || "";
        const position =
          cardWrapper
            .querySelector(".position-badge")
            ?.textContent.toLowerCase() || "";

        if (
          searchTerm === "" ||
          name.includes(searchTerm) ||
          level.includes(searchTerm) ||
          position.includes(searchTerm)
        ) {
          cardWrapper.style.display = "";
          // Add a subtle animation for appearing items
          card.style.opacity = "0";
          setTimeout(() => {
            card.style.opacity = "1";
          }, 50);
        } else {
          cardWrapper.style.display = "none";
        }
      });

      // Also update the list view
      const tableRows = document.querySelectorAll("#contestantsTable tbody tr");
      tableRows.forEach((row) => {
        const name =
          row.querySelector("td:nth-child(2)")?.textContent.toLowerCase() || "";
        const position =
          row.querySelector("td:nth-child(3)")?.textContent.toLowerCase() || "";
        const level =
          row.querySelector("td:nth-child(4)")?.textContent.toLowerCase() || "";

        if (
          searchTerm === "" ||
          name.includes(searchTerm) ||
          level.includes(searchTerm) ||
          position.includes(searchTerm)
        ) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });

      // Show empty state message if no results found
      checkForEmptyResults();
    });
  }

  // Position filter with animation
  const positionFilter = document.getElementById("positionFilter");
  if (positionFilter) {
    positionFilter.addEventListener("change", function () {
      const selectedPosition = this.value;
      const contestantCards = document.querySelectorAll(
        ".contestant-card-wrapper"
      );

      contestantCards.forEach((cardWrapper) => {
        if (
          selectedPosition === "all" ||
          cardWrapper.getAttribute("data-position") === selectedPosition
        ) {
          cardWrapper.style.display = "";
          // Add animation for appearing items
          const card = cardWrapper.querySelector(".contestant-card");
          card.style.transform = "scale(0.95)";
          card.style.opacity = "0";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "";
          }, 50);
        } else {
          cardWrapper.style.display = "none";
        }
      });

      // Also update the list view
      const tableRows = document.querySelectorAll("#contestantsTable tbody tr");
      tableRows.forEach((row) => {
        const rowPosition = row.getAttribute("data-position");
        if (selectedPosition === "all" || rowPosition === selectedPosition) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });

      // Show empty state message if no results found
      checkForEmptyResults();
    });
  }

  // Check if search/filter returned empty results
  function checkForEmptyResults() {
    const gridContainer = document.querySelector("#contestantsGrid");
    const tableContainer = document.querySelector(".contestants-list");

    if (gridContainer) {
      const visibleCards = gridContainer.querySelectorAll(
        '.contestant-card-wrapper[style=""]'
      );
      let emptyState = gridContainer.querySelector(".empty-search-results");

      if (visibleCards.length === 0) {
        // Show empty state message
        if (!emptyState) {
          emptyState = document.createElement("div");
          emptyState.className = "col-12 empty-search-results";
          emptyState.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">
                                <i class="fas fa-search"></i>
                            </div>
                            <h4>No Contestants Found</h4>
                            <p>Try adjusting your search or filter criteria</p>
                            <button class="btn btn-primary" id="clearSearchBtn">
                                <i class="fas fa-times me-2"></i>Clear Search
                            </button>
                        </div>
                    `;
          gridContainer.appendChild(emptyState);

          // Add event listener to clear search button
          document
            .getElementById("clearSearchBtn")
            .addEventListener("click", clearSearch);
        }
      } else if (emptyState) {
        // Remove empty state message if results are found
        emptyState.remove();
      }
    }

    // Do the same for table view
    if (tableContainer) {
      const visibleRows = tableContainer.querySelectorAll('tbody tr[style=""]');
      let emptyState = tableContainer.querySelector(".empty-search-results");

      if (visibleRows.length === 0) {
        if (!emptyState) {
          emptyState = document.createElement("tr");
          emptyState.className = "empty-search-results";
          emptyState.innerHTML = `
                        <td colspan="6" class="text-center py-4">
                            <div class="empty-state-icon mb-2">
                                <i class="fas fa-search"></i>
                            </div>
                            <h5>No Contestants Found</h5>
                            <p class="text-muted">Try adjusting your search or filter criteria</p>
                            <button class="btn btn-sm btn-primary" id="clearSearchTableBtn">
                                <i class="fas fa-times me-2"></i>Clear Search
                            </button>
                        </td>
                    `;
          tableContainer.querySelector("tbody").appendChild(emptyState);

          // Add event listener to clear search button
          document
            .getElementById("clearSearchTableBtn")
            .addEventListener("click", clearSearch);
        }
      } else if (emptyState) {
        emptyState.remove();
      }
    }
  }

  // Clear search and filter
  function clearSearch() {
    const searchInput = document.getElementById("searchContestants");
    const positionFilter = document.getElementById("positionFilter");

    if (searchInput) searchInput.value = "";
    if (positionFilter) positionFilter.value = "all";

    // Show all contestants
    document.querySelectorAll(".contestant-card-wrapper").forEach((card) => {
      card.style.display = "";
    });

    document.querySelectorAll("#contestantsTable tbody tr").forEach((row) => {
      row.style.display = "";
    });

    // Remove empty state messages
    document.querySelectorAll(".empty-search-results").forEach((el) => {
      el.remove();
    });
  }

  // Photo preview in add/edit forms
  const photoInput = document.getElementById("photo");
  if (photoInput) {
    photoInput.addEventListener("change", function () {
      previewImage(this, "photoPreview");
    });
  }

  const editPhotoInput = document.getElementById("editPhoto");
  if (editPhotoInput) {
    editPhotoInput.addEventListener("change", function () {
      previewImage(this, "editPhotoPreview");
    });
  }

  // Image preview function
  function previewImage(input, previewId) {
    const previewElement = document.getElementById(previewId);
    if (!previewElement) {
      // Create a preview container if it doesn't exist
      const container = input.parentElement.parentElement;
      const previewDiv = document.createElement("div");
      previewDiv.innerHTML = `
                <div class="mt-2 position-relative" style="max-width: 150px">
                    <img id="${previewId}" src="" alt="Preview" class="img-thumbnail" style="display:none">
                    <button type="button" class="btn-close position-absolute top-0 end-0 bg-light rounded-circle p-1" 
                        style="display:none; transform: translate(25%, -25%)"></button>
                </div>
            `;
      container.appendChild(previewDiv);

      // Add event listener to close button
      const closeBtn = previewDiv.querySelector(".btn-close");
      closeBtn.addEventListener("click", function () {
        document.getElementById(previewId).style.display = "none";
        closeBtn.style.display = "none";
        input.value = ""; // Clear the file input
      });
    }

    const preview = document.getElementById(previewId);
    const closeBtn = preview.nextElementSibling;

    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
        closeBtn.style.display = "block";
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // View toggle (grid/list)
  const viewGridBtn = document.getElementById("viewGrid");
  const viewListBtn = document.getElementById("viewList");
  if (viewGridBtn && viewListBtn) {
    viewGridBtn.addEventListener("click", function () {
      setActiveView("grid");
      localStorage.setItem("contestantsView", "grid");
    });

    viewListBtn.addEventListener("click", function () {
      setActiveView("list");
      localStorage.setItem("contestantsView", "list");
    });

    // Load saved view preference
    const savedView = localStorage.getItem("contestantsView");
    if (savedView) {
      setActiveView(savedView);
    }
  }

  function setActiveView(view) {
    const grid = document.getElementById("contestantsGrid");
    const list = document.querySelector(".contestants-list");

    if (view === "list") {
      // Show list view
      if (grid) grid.classList.add("d-none");
      if (list) list.classList.remove("d-none");
      if (viewGridBtn) viewGridBtn.classList.remove("active");
      if (viewListBtn) viewListBtn.classList.add("active");
    } else {
      // Show grid view
      if (grid) grid.classList.remove("d-none");
      if (list) list.classList.add("d-none");
      if (viewGridBtn) viewGridBtn.classList.add("active");
      if (viewListBtn) viewListBtn.classList.remove("active");
    }
  }

  // Add animation to cards
  const animateCards = () => {
    const cards = document.querySelectorAll(".contestant-card");
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("animate__animated", "animate__fadeInUp");
        setTimeout(() => {
          card.classList.remove("animate__animated", "animate__fadeInUp");
        }, 1000);
      }, index * 50);
    });
  };

  // Position-specific contestant button
  const addPositionContestantBtns = document.querySelectorAll(
    ".add-position-contestant-btn"
  );
  if (addPositionContestantBtns.length > 0) {
    addPositionContestantBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const positionId = this.getAttribute("data-position-id");
        const positionTitle = this.getAttribute("data-position-title");

        // Set the position in the form
        const positionSelect = document.querySelector(
          '#addContestantModal select[name="position"]'
        );
        if (positionSelect) {
          positionSelect.value = positionId;

          // Update the modal title
          const modalTitle = document.querySelector(
            "#addContestantModal .modal-title"
          );
          if (modalTitle) {
            modalTitle.innerHTML = `<i class="fas fa-plus me-2"></i> Add New ${positionTitle} Contestant`;
          }
        }
      });
    });
  }

  // Initialize AOS animation library if available
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }
});
