/**
 * Tab Test Utility
 * Runs immediately to test if tabs are correctly working
 */

(function () {
  console.log("Tab Test Utility running...");

  // Function to test if tabs are working properly
  function testTabsFunctionality() {
    const tabLinks = document.querySelectorAll('button[data-bs-toggle="pill"]');
    const tabPanes = document.querySelectorAll(".tab-pane");

    console.log(
      `Found ${tabLinks.length} tab links and ${tabPanes.length} tab panes`
    );

    // Log the current active tab
    const activeTab = document.querySelector(
      'button[data-bs-toggle="pill"].active'
    );
    if (activeTab) {
      console.log(
        `Currently active tab: ${activeTab.textContent.trim()} with target ${activeTab.getAttribute(
          "data-bs-target"
        )}`
      );

      // Check if corresponding tab pane is active
      const activeTabPane = document.querySelector(
        activeTab.getAttribute("data-bs-target")
      );
      if (activeTabPane && activeTabPane.classList.contains("active")) {
        console.log("✅ Active tab pane correctly matches active tab");
      } else {
        console.error("❌ Active tab pane does not match active tab");
        fixTabContentVisibility(activeTab);
      }
    }

    // Verify all tab panes exist for each tab
    tabLinks.forEach((tabLink) => {
      const tabId = tabLink.getAttribute("data-bs-target");
      const tabPane = document.querySelector(tabId);

      if (tabPane) {
        console.log(
          `✅ Tab pane ${tabId} exists for tab ${tabLink.textContent.trim()}`
        );
      } else {
        console.error(`❌ No tab pane found for ${tabId}`);
      }
    });

    // Automatic fix for any display issues
    fixAllTabsDisplay();
  }

  // Function to ensure active tab's content is visible
  function fixTabContentVisibility(activeTabLink) {
    if (!activeTabLink) return;

    console.log("Attempting to fix tab content visibility...");

    const tabId = activeTabLink.getAttribute("data-bs-target");
    const tabPane = document.querySelector(tabId);

    if (tabPane) {
      // Hide all tab panes
      document.querySelectorAll(".tab-pane").forEach((pane) => {
        pane.classList.remove("show", "active");
        pane.style.display = "none";
      });

      // Show the active one
      tabPane.classList.add("show", "active");
      tabPane.style.display = "block";

      console.log(`Fixed visibility for ${tabId}`);
    }
  }

  // Fix display for all tabs
  function fixAllTabsDisplay() {
    console.log("Setting inline styles for tab panes as backup fix");

    // Make sure all tab panes have correct display style
    document.querySelectorAll(".tab-pane").forEach((pane) => {
      if (pane.classList.contains("active")) {
        pane.style.display = "block";
      } else {
        pane.style.display = "none";
      }
    });
  }

  // Run tests after a slight delay to ensure DOM is ready
  setTimeout(() => {
    testTabsFunctionality();
  }, 1000);
})();
