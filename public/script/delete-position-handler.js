/**
 * Delete Position Handler for LINCSSA VOTES
 * Handles functionality for the delete position button and modal
 */

document.addEventListener("DOMContentLoaded", function () {
  // Get all delete position buttons
  const deleteButtons = document.querySelectorAll(".delete-position-btn");

  // Get the delete position form and hidden input
  const deleteForm = document.getElementById("deletePositionForm");
  const deleteIdInput = document.getElementById("deletePositionId");
  const deletePositionTitle = document.getElementById("deletePositionTitle");
  const deleteModal = new bootstrap.Modal(
    document.getElementById("deletePositionModal"),
    {}
  );

  // Add event listeners to all delete buttons
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Get the position ID and title from the button's data attributes
      const positionId = this.getAttribute("data-position-id");
      const positionTitle = this.getAttribute("data-position-title");

      // Update the form's hidden input with the position ID
      if (deleteIdInput) {
        deleteIdInput.value = positionId;
      }

      // Update the modal text with the position title
      if (deletePositionTitle) {
        deletePositionTitle.textContent = positionTitle;
      }

      // Update the form action to include the position ID
      if (deleteForm) {
        deleteForm.action = `/admin/positions/delete/${positionId}`;
      }

      // Show the delete confirmation modal
      deleteModal.show();
    });
  });
});
