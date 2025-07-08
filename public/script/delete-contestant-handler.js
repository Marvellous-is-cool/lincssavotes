/**
 * Delete Contestant Handler for LINCSSA VOTES
 * Handles functionality for the delete contestant button and modal
 */

document.addEventListener("DOMContentLoaded", function () {
  // Get all delete contestant buttons
  const deleteButtons = document.querySelectorAll(".delete-contestant-btn");

  // Get the delete contestant form and hidden input
  const deleteForm = document.getElementById("deleteContestantForm");
  const deleteIdInput = document.getElementById("deleteContestantId");
  const deleteContestantName = document.getElementById("deleteContestantName");

  // Add event listeners to all delete buttons
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Get the contestant ID and name from the button's data attributes
      const contestantId = this.getAttribute("data-contestant-id");
      const contestantName = this.getAttribute("data-contestant-name");

      // Update the form's hidden input with the contestant ID
      if (deleteIdInput) {
        deleteIdInput.value = contestantId;
      }

      // Update the modal text with the contestant name
      if (deleteContestantName) {
        deleteContestantName.textContent = contestantName;
      }

      // Update the form action to include the contestant ID
      if (deleteForm) {
        deleteForm.action = `/admin/contestants/delete/${contestantId}`;
      }

      // The modal is shown by Bootstrap data attributes
    });
  });
});
