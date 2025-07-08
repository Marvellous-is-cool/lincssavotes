/**
 * Script to handle multiple candidate selection and enforce maximum selection limits
 */

document.addEventListener("DOMContentLoaded", function () {
  // Get all contestant checkboxes
  const checkboxes = document.querySelectorAll(".contestant-checkbox");
  if (!checkboxes.length) return;

  // Get maxSelection value from the first checkbox's data attribute
  const maxSelection = parseInt(checkboxes[0].dataset.maxSelections || 1);
  const selectionCountDisplay = document.getElementById("selectionCount");
  const selectedCandidatesContainer = document.getElementById(
    "selectedCandidatesContainer"
  );
  const submitButton = document.getElementById("submitMultipleVotes");

  // Add event listeners to all checkboxes
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      enforceMaxSelections();
      updateSelectionSummary();
    });
  });

  // Initialize the UI
  updateSelectionSummary();

  /**
   * Enforce the maximum selection limit
   */
  function enforceMaxSelections() {
    const checked = document.querySelectorAll(".contestant-checkbox:checked");

    // If max selections reached, disable unchecked boxes
    if (checked.length >= maxSelection) {
      checkboxes.forEach((cb) => {
        if (!cb.checked) {
          cb.disabled = true;
        }
      });
    } else {
      // Enable all checkboxes if under the limit
      checkboxes.forEach((cb) => {
        cb.disabled = false;
      });
    }

    // Update submit button state
    if (submitButton) {
      submitButton.disabled = checked.length === 0;

      // Update the button text to show selection count
      const selectionCountBtn = document.getElementById("selectionCountBtn");
      if (selectionCountBtn) {
        selectionCountBtn.textContent = checked.length;
      }
    }
  }

  /**
   * Update the selection summary display
   */
  function updateSelectionSummary() {
    const checked = document.querySelectorAll(".contestant-checkbox:checked");

    // Update count display
    if (selectionCountDisplay) {
      selectionCountDisplay.textContent = checked.length;
    }

    // Update selected candidates display
    if (selectedCandidatesContainer) {
      if (checked.length === 0) {
        selectedCandidatesContainer.innerHTML =
          "<p>No candidates selected yet.</p>";
      } else {
        const selectedList = document.createElement("ul");
        selectedList.className = "list-group";

        checked.forEach((checkbox) => {
          const listItem = document.createElement("li");
          listItem.className =
            "list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-light";
          listItem.innerHTML = `
            <span>${checkbox.dataset.contestantName}</span>
            <button type="button" class="btn btn-sm btn-outline-danger remove-selection" data-checkbox-id="${checkbox.id}">
              <i class="fas fa-times"></i>
            </button>
          `;
          selectedList.appendChild(listItem);
        });

        selectedCandidatesContainer.innerHTML = "";
        selectedCandidatesContainer.appendChild(selectedList);

        // Add event listeners to remove buttons
        document.querySelectorAll(".remove-selection").forEach((button) => {
          button.addEventListener("click", function () {
            const checkboxId = this.dataset.checkboxId;
            const checkbox = document.getElementById(checkboxId);
            if (checkbox) {
              checkbox.checked = false;
              enforceMaxSelections();
              updateSelectionSummary();
            }
          });
        });
      }
    }

    // Update notification about selection limit
    const limitNote = document.getElementById("selectionLimitNote");
    if (limitNote) {
      if (checked.length === maxSelection) {
        limitNote.innerHTML = `<i class="fas fa-info-circle me-2"></i> You've reached the maximum of ${maxSelection} selections.`;
        limitNote.classList.remove("d-none");
      } else {
        limitNote.classList.add("d-none");
      }
    }
  }
});
