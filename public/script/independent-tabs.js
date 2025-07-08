/**
 * Independent Tab Handler
 * A completely standalone implementation that doesn't rely on Bootstrap's JavaScript
 */

// Self-executing function to avoid global scope pollution
(function () {
  // Function to handle all tabs on the page
  function makeTabsWork() {
    console.log("Independent tab handler running...");

    // Find all tab buttons
    const tabButtons = document.querySelectorAll('[data-bs-toggle="pill"]');
    if (!tabButtons || tabButtons.length === 0) {
      console.log("No tab buttons found");
      return;
    }

    console.log(`Found ${tabButtons.length} tab buttons`);

    // For each tab button
    tabButtons.forEach(function (button) {
      // Add click event handler
      button.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();

        const targetId = this.getAttribute("data-bs-target");
        console.log(
          `Tab clicked: ${this.textContent.trim()}, target: ${targetId}`
        );

        // Remove active class from all tabs
        tabButtons.forEach(function (btn) {
          btn.classList.remove("active");
        });

        // Add active class to clicked tab
        this.classList.add("active");

        // Hide all content panes
        const tabPanes = document.querySelectorAll(".tab-pane");
        tabPanes.forEach(function (pane) {
          pane.classList.remove("show", "active");
          pane.style.display = "none";
        });

        // Show the target content pane
        const targetPane = document.querySelector(targetId);
        if (targetPane) {
          targetPane.classList.add("show", "active");
          targetPane.style.display = "block";
          console.log(`Activated tab pane: ${targetId}`);
        } else {
          console.error(`Target pane not found: ${targetId}`);
        }

        return false;
      };
    });

    // Find active tab
    let activeTab = document.querySelector('[data-bs-toggle="pill"].active');

    // If no active tab, set the first one as active
    if (!activeTab && tabButtons.length > 0) {
      activeTab = tabButtons[0];
      activeTab.classList.add("active");
      console.log("No active tab found, setting the first one as active");
    }

    // Show content for active tab
    if (activeTab) {
      const targetId = activeTab.getAttribute("data-bs-target");
      const targetPane = document.querySelector(targetId);

      // Hide all panes first
      document.querySelectorAll(".tab-pane").forEach(function (pane) {
        pane.classList.remove("show", "active");
        pane.style.display = "none";
      });

      // Show active pane
      if (targetPane) {
        targetPane.classList.add("show", "active");
        targetPane.style.display = "block";
        console.log(`Initial active tab pane: ${targetId}`);
      }
    }

    // Enable tab key navigation
    document.addEventListener("keydown", function (e) {
      if (e.key === "Tab" && e.altKey) {
        e.preventDefault();

        // Find active tab
        const activeTab = document.querySelector(
          '[data-bs-toggle="pill"].active'
        );
        if (!activeTab) return;

        // Get all tabs
        const tabs = Array.from(tabButtons);
        const currentIndex = tabs.indexOf(activeTab);

        // Calculate next tab index (with wrapping)
        const nextIndex = e.shiftKey
          ? (currentIndex - 1 + tabs.length) % tabs.length
          : (currentIndex + 1) % tabs.length;

        // Activate next tab
        tabs[nextIndex].click();
      }
    });
  }

  // Run when DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", makeTabsWork);
  } else {
    // DOM already loaded, run now
    makeTabsWork();
  }

  // Also run after a short delay
  setTimeout(makeTabsWork, 500);

  // And run again after window load
  window.addEventListener("load", makeTabsWork);
})();
