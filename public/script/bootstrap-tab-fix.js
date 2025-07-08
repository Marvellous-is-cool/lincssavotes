/**
 * Direct Tab Fix Script
 * A simpler, more direct approach to make tabs work
 */

// Run immediately with no dependencies
window.onload = function () {
  console.log("Direct Tab Fix running - window loaded");
  fixTabs();
};

// Also run after DOM is ready for redundancy
document.addEventListener("DOMContentLoaded", function () {
  console.log("Direct Tab Fix running - DOM content loaded");
  fixTabs();
});

// Ultra-simple tab handler
function fixTabs() {
  console.log("Running simple tab fix");

  // Make sure all tabs can be clicked
  var tabButtons = document.querySelectorAll('button[data-bs-toggle="pill"]');
  console.log("Found " + tabButtons.length + " tab buttons");

  tabButtons.forEach(function (button) {
    // Remove previous event listeners by cloning
    var newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);

    // Add a simple click handler
    newButton.addEventListener("click", function (e) {
      e.preventDefault();

      // Get target tab ID
      var targetId = this.getAttribute("data-bs-target");
      console.log(
        "Tab clicked: " + this.textContent.trim() + ", Target: " + targetId
      );

      // Remove active class from all tab buttons
      tabButtons.forEach(function (btn) {
        btn.classList.remove("active");
      });

      // Add active class to clicked button
      this.classList.add("active");

      // Hide all tab panes first
      var allPanes = document.querySelectorAll(".tab-pane");
      allPanes.forEach(function (pane) {
        pane.classList.remove("show", "active");
        pane.style.display = "none";
      });

      // Show the target pane
      var targetPane = document.querySelector(targetId);
      if (targetPane) {
        targetPane.classList.add("show", "active");
        targetPane.style.display = "block";
        console.log("Activated tab pane: " + targetId);
      }
    });
  });

  // Force the currently active tab to display its content
  var activeTab = document.querySelector(
    'button[data-bs-toggle="pill"].active'
  );
  if (activeTab) {
    // Simulate a click on the active tab
    activeTab.click();
    console.log(
      "Forced active tab to show content: " + activeTab.textContent.trim()
    );
  } else if (tabButtons.length > 0) {
    // If no active tab, activate the first one
    tabButtons[0].classList.add("active");
    tabButtons[0].click();
    console.log("No active tab found, activating the first tab");
  }
}

// For instant execution
(function () {
  // Run immediately
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(fixTabs, 1);
  }
})();
