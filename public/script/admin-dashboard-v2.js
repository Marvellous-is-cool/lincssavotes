/**
 * LINCSSA VOTES - Modern Admin Dashboard JS v4.0
 * Clean, minimal and contemporary interface interactions
 * July 2025
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize loading sequence
  initLoadingSequence();

  // Initialize navigation
  initNavigation();

  // Initialize counter animations
  initCounterAnimations();

  // Initialize responsive behaviors
  initResponsiveNavigation();

  // Initialize theme toggling
  initThemeToggle();

  // Initialize tooltips
  initTooltips();

  // Initialize interactive elements
  initInteractiveElements();

  // Initialize toast notification system
  initToastSystem();

  // Initialize data refresh system
  initDataRefresh();

  // Initialize charts after everything else is loaded
  setTimeout(() => {
    initCharts();
  }, 1000);
});

// Clean loading sequence
function initLoadingSequence() {
  const loader = document.querySelector(".dashboard-loading");
  if (!loader) return;

  const progressBar = document.querySelector(".loading-progress-bar");
  const loadingText = document.querySelector(".loading-text");

  // Simulate loading stages with smooth progression
  let progress = 0;
  let loadingSpeed = 1;
  const loadingMessages = [
    "Initializing...",
    "Loading data...",
    "Preparing dashboard...",
  ];

  const loadingInterval = setInterval(() => {
    progress += loadingSpeed;
    progress = Math.min(progress, 100);

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (loadingText && progress % 33 === 0) {
      const messageIndex = Math.floor(progress / 33);
      if (messageIndex < loadingMessages.length) {
        loadingText.textContent = loadingMessages[messageIndex];
      }
    }

    if (progress >= 100) {
      clearInterval(loadingInterval);

      setTimeout(() => {
        loader.classList.add("loaded");
        setTimeout(() => {
          initializeAfterLoading();
        }, 300);
      }, 500);
    }
  }, 20);
}

// Initialize after loading completes
function initializeAfterLoading() {
  // Fade in main content with subtle animation
  const mainContent = document.querySelector(".admin-main");
  if (mainContent) {
    mainContent.style.opacity = "0";
    mainContent.style.transform = "translateY(10px)";

    setTimeout(() => {
      mainContent.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      mainContent.style.opacity = "1";
      mainContent.style.transform = "translateY(0)";
    }, 100);
  }

  // Add subtle entrance animations to cards
  const cards = document.querySelectorAll(".stat-card, .quick-action-btn");
  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(10px)";

    setTimeout(() => {
      card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 100 + index * 50);
  });
}

// Initialize navigation effects
function initNavigation() {
  const navItems = document.querySelectorAll(".admin-menu li a");

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      // Remove active class from all items
      navItems.forEach((navItem) => {
        navItem.parentElement.classList.remove("active");
      });

      // Add active class to clicked item
      item.parentElement.classList.add("active");
    });
  });
}

// Counter animations
function initCounterAnimations() {
  const counters = document.querySelectorAll(".stat-value");

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-value") || "0");
    const suffix = counter.getAttribute("data-suffix") || "";
    const duration = 1000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    const easeOutQuad = (t) => t * (2 - t);

    let frame = 0;

    // Use Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(counter);

    function animate() {
      frame++;
      const progress = easeOutQuad(frame / totalFrames);
      const currentValue = Math.round(progress * target);

      counter.textContent = currentValue + suffix;

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      }
    }
  });
}

// Responsive navigation
function initResponsiveNavigation() {
  const toggleBtn = document.querySelector(".toggle-admin-sidebar");
  const adminSidebar = document.querySelector(".admin-sidebar");
  const adminMain = document.querySelector(".admin-main");
  const overlay = document.createElement("div");

  overlay.className = "sidebar-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
  overlay.style.zIndex = "5";
  overlay.style.opacity = "0";
  overlay.style.visibility = "hidden";
  overlay.style.transition = "opacity 0.3s, visibility 0.3s";
  document.body.appendChild(overlay);

  if (!toggleBtn || !adminSidebar) return;

  // Toggle sidebar on button click
  toggleBtn.addEventListener("click", () => {
    adminSidebar.classList.toggle("active");

    if (adminSidebar.classList.contains("active")) {
      overlay.style.opacity = "1";
      overlay.style.visibility = "visible";
    } else {
      overlay.style.opacity = "0";
      overlay.style.visibility = "hidden";
    }
  });

  // Close sidebar when clicking overlay
  overlay.addEventListener("click", () => {
    adminSidebar.classList.remove("active");
    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";
  });

  // Auto-collapse sidebar on small screens
  const checkScreenSize = () => {
    if (window.innerWidth < 992) {
      adminSidebar.classList.remove("active");
      overlay.style.opacity = "0";
      overlay.style.visibility = "hidden";
    }
  };

  // Initial check
  checkScreenSize();

  // Check on resize
  window.addEventListener("resize", () => {
    checkScreenSize();
  });
}

// Theme toggle functionality
function initThemeToggle() {
  // Check for saved theme preference or respect OS preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Apply theme if saved, otherwise respect OS preference
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.body.classList.add("dark-mode");
    updateThemeIcons(true);
  } else {
    updateThemeIcons(false);
  }

  // Create theme toggle if it doesn't exist
  if (!document.querySelector(".theme-toggle")) {
    const themeToggle = document.createElement("button");
    themeToggle.className = "theme-toggle";
    themeToggle.setAttribute("aria-label", "Toggle theme");
    themeToggle.innerHTML = document.body.classList.contains("dark-mode")
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';

    // Add to header
    const headerActions = document.querySelector(
      ".admin-header .d-flex:last-child"
    );
    if (headerActions) {
      headerActions.prepend(themeToggle);
    }

    // Toggle theme on click
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");

      // Save preference
      localStorage.setItem("theme", isDark ? "dark" : "light");

      // Update icons
      updateThemeIcons(isDark);
    });
  }
}

// Update theme icons based on current theme
function updateThemeIcons(isDark) {
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.innerHTML = isDark
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
  }
}

// Initialize tooltips
function initTooltips() {
  const tooltipElements = document.querySelectorAll("[data-tooltip]");

  tooltipElements.forEach((element) => {
    const tooltipText = element.getAttribute("data-tooltip");

    element.addEventListener("mouseenter", () => {
      const tooltip = document.createElement("div");
      tooltip.className = "admin-tooltip";
      tooltip.textContent = tooltipText;

      document.body.appendChild(tooltip);

      const elementRect = element.getBoundingClientRect();
      tooltip.style.top = `${elementRect.bottom + window.scrollY + 10}px`;
      tooltip.style.left = `${
        elementRect.left +
        window.scrollX +
        elementRect.width / 2 -
        tooltip.offsetWidth / 2
      }px`;

      setTimeout(() => tooltip.classList.add("visible"), 10);
    });

    element.addEventListener("mouseleave", () => {
      const tooltip = document.querySelector(".admin-tooltip");
      if (tooltip) {
        tooltip.classList.remove("visible");
        setTimeout(() => tooltip.remove(), 300);
      }
    });
  });
}

// Initialize interactive elements
function initInteractiveElements() {
  // Add ripple effect to buttons
  const buttons = document.querySelectorAll(
    ".btn, .action-btn, .quick-action-btn"
  );

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement("span");
      ripple.className = "ripple-effect";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Initialize collapsible elements
  const collapsibleHeaders = document.querySelectorAll(".collapsible-header");

  collapsibleHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const content = this.nextElementSibling;
      header.classList.toggle("active");

      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  // Modernize buttons
  modernizeButtons();

  // Modernize cards
  modernizeCards();

  // Convert flash messages to modern toasts
  convertFlashMessages();
}

// Toast notification system
function initToastSystem() {
  // Create toast container if it doesn't exist
  if (!document.querySelector(".toast-container")) {
    const toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  // Make showToast available globally
  window.showToast = function (message, type = "info", duration = 3000) {
    const toastContainer = document.querySelector(".toast-container");

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icon = document.createElement("div");
    icon.className = "toast-icon";

    // Add appropriate icon based on type
    switch (type) {
      case "success":
        icon.innerHTML = '<i class="fas fa-check-circle"></i>';
        break;
      case "error":
        icon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
        break;
      case "warning":
        icon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        break;
      default:
        icon.innerHTML = '<i class="fas fa-info-circle"></i>';
    }

    const content = document.createElement("div");
    content.className = "toast-content";
    content.textContent = message;

    const closeBtn = document.createElement("button");
    closeBtn.className = "toast-close";
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.addEventListener("click", () => {
      toast.classList.add("toast-hiding");
      setTimeout(() => toast.remove(), 300);
    });

    toast.appendChild(icon);
    toast.appendChild(content);
    toast.appendChild(closeBtn);

    toastContainer.appendChild(toast);

    // Show with animation
    setTimeout(() => toast.classList.add("toast-visible"), 10);

    // Auto-close after duration
    if (duration !== 0) {
      setTimeout(() => {
        if (toast.parentElement) {
          toast.classList.add("toast-hiding");
          setTimeout(() => toast.remove(), 300);
        }
      }, duration);
    }

    return toast;
  };
}

// Initialize data refresh functionality
function initDataRefresh() {
  // Find refresh buttons
  const refreshButtons = document.querySelectorAll("[data-refresh]");

  refreshButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      // Get container to refresh
      const targetId = this.getAttribute("data-refresh");
      const targetElement = document.getElementById(targetId);

      if (!targetElement) return;

      // Show loading indicator
      this.classList.add("refreshing");

      // Optional: Add shimmer effect to the refreshing content
      targetElement.classList.add("refreshing");

      // Simulate data fetch - replace with actual API call
      setTimeout(() => {
        // Remove loading states
        this.classList.remove("refreshing");
        targetElement.classList.remove("refreshing");

        // Show success notification
        window.showToast("Data refreshed successfully", "success");

        // If you have real API calls, implement them here
        // fetchDashboardData(targetId).then(data => {
        //   updateDashboardSection(targetId, data);
        //   window.showToast('Data refreshed successfully', 'success');
        // }).catch(error => {
        //   window.showToast('Error refreshing data', 'error');
        // });
      }, 1200);
    });
  });

  // Function to update dashboard sections with new data
  window.updateDashboardSection = function (sectionId, data) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    // Implementation depends on your dashboard structure
    // Example: Update voter stats
    if (sectionId === "voter-stats") {
      const voterCountElement = section.querySelector(
        '[data-stat="total-voters"]'
      );
      if (voterCountElement && data.totalVoters) {
        animateNumber(
          voterCountElement,
          parseInt(voterCountElement.textContent),
          data.totalVoters
        );
      }
    }
  };

  // Helper function for number animation
  function animateNumber(element, start, end, duration = 800) {
    let startTimestamp = null;

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      element.textContent = current.toLocaleString();

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = end.toLocaleString();
      }
    }

    window.requestAnimationFrame(step);
  }
}

// Set up real-time data updates
function setupRealTimeUpdates() {
  // Find all sections that could use real-time updates
  const refreshableElements = document.querySelectorAll(
    "[data-refresh-interval]"
  );

  refreshableElements.forEach((element) => {
    const interval = parseInt(element.getAttribute("data-refresh-interval"));
    if (!isNaN(interval) && interval > 0) {
      // Set up periodic refresh
      setInterval(() => {
        refreshElement(element);
      }, interval * 1000); // Convert to milliseconds
    }
  });

  // Add manual refresh buttons to refreshable sections
  document.querySelectorAll(".section-header").forEach((header) => {
    const sectionId = header.nextElementSibling?.id;
    if (
      sectionId &&
      document.getElementById(sectionId)?.getAttribute("data-refresh-interval")
    ) {
      if (!header.querySelector(".refresh-btn")) {
        const refreshBtn = document.createElement("button");
        refreshBtn.className = "refresh-btn";
        refreshBtn.setAttribute("data-refresh", sectionId);
        refreshBtn.setAttribute("aria-label", "Refresh data");
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
        header.appendChild(refreshBtn);
      }
    }
  });

  // Add global last update indicator
  const adminHeader = document.querySelector(
    ".admin-header .d-flex:last-child"
  );
  if (adminHeader && !document.querySelector(".last-update-indicator")) {
    const lastUpdateIndicator = document.createElement("div");
    lastUpdateIndicator.className = "last-update-indicator me-4";
    lastUpdateIndicator.innerHTML = `
      <i class="fas fa-sync-alt me-2"></i>
      <span>Last updated: ${new Date().toLocaleTimeString()}</span>
    `;
    adminHeader.prepend(lastUpdateIndicator);

    // Update the timestamp whenever any data is refreshed
    document.addEventListener("dataRefreshed", () => {
      const timeSpan = lastUpdateIndicator.querySelector("span");
      if (timeSpan) {
        timeSpan.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
      }
    });
  }
}

// Function to refresh a specific element
function refreshElement(element) {
  const elementId = element.id;
  if (!elementId) return;

  // Show subtle loading state
  element.classList.add("refreshing-subtle");

  // In a real app, fetch data from the server here
  // For demo purposes, we'll simulate a server request
  setTimeout(() => {
    // Remove loading state
    element.classList.remove("refreshing-subtle");

    // Update the element with "new" data
    updateElementWithData(element);

    // Dispatch event for timestamp update
    document.dispatchEvent(
      new CustomEvent("dataRefreshed", {
        detail: { elementId },
      })
    );
  }, 700);
}

// Update element with new data
function updateElementWithData(element) {
  // This is where you would update the element with real data
  // For demo, we'll just update counters slightly

  const statValues = element.querySelectorAll(".stat-value");
  statValues.forEach((statValue) => {
    if (statValue.hasAttribute("data-value")) {
      const currentValue = parseInt(statValue.getAttribute("data-value"));
      const suffix = statValue.getAttribute("data-suffix") || "";

      // Generate a small random change
      const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
      const newValue = Math.max(0, currentValue + change);

      // Update the displayed value with animation
      animateNumber(statValue, currentValue, newValue);

      // Update the data attribute
      statValue.setAttribute("data-value", newValue);
    }
  });

  // If element contains charts, update them too
  const charts = element.querySelectorAll("canvas");
  charts.forEach((chart) => {
    const chartInstance = Chart.getChart(chart);
    if (chartInstance) {
      // Update chart data with small random changes
      chartInstance.data.datasets.forEach((dataset) => {
        dataset.data = dataset.data.map((value) => {
          const change = Math.floor(Math.random() * 10) - 5; // -5 to +5
          return Math.max(0, value + change);
        });
      });
      chartInstance.update();
    }
  });
}

// Call the real-time updates setup on document ready
document.addEventListener("DOMContentLoaded", function () {
  // Enhance accessibility
  enhanceAccessibility();

  // Set up real-time updates
  setupRealTimeUpdates();
});

// Enhance accessibility
function enhanceAccessibility() {
  // Add proper ARIA labels to interactive elements
  document.querySelectorAll("a, button").forEach((element) => {
    if (!element.getAttribute("aria-label") && !element.innerText.trim()) {
      // If element has icon but no text, add aria-label based on icon
      const icon = element.querySelector("i.fas, i.far, i.fab");
      if (icon) {
        const iconClass = Array.from(icon.classList).find((cls) =>
          cls.startsWith("fa-")
        );
        if (iconClass) {
          const label = iconClass.replace("fa-", "").replace(/-/g, " ");
          element.setAttribute("aria-label", label);
        }
      }
    }
  });

  // Add keyboard navigation for sidebar
  const sidebarItems = document.querySelectorAll(".admin-menu li a");
  sidebarItems.forEach((item, index) => {
    item.setAttribute("tabindex", "0");

    // Handle keyboard navigation
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }

      // Arrow navigation
      if (e.key === "ArrowDown" && index < sidebarItems.length - 1) {
        e.preventDefault();
        sidebarItems[index + 1].focus();
      }

      if (e.key === "ArrowUp" && index > 0) {
        e.preventDefault();
        sidebarItems[index - 1].focus();
      }
    });
  });

  // Add skip to content link for keyboard users
  if (!document.getElementById("skip-to-content")) {
    const skipLink = document.createElement("a");
    skipLink.id = "skip-to-content";
    skipLink.href = "#main-content";
    skipLink.textContent = "Skip to content";
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add id to main content
    const mainContent = document.querySelector(".admin-main");
    if (mainContent && !mainContent.id) {
      mainContent.id = "main-content";
    }
  }

  // Add focus styles that work with keyboard but not mouse
  document.body.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      document.body.classList.add("keyboard-user");
    }
  });

  document.body.addEventListener("mousedown", function () {
    document.body.classList.remove("keyboard-user");
  });
}

// Set up keyboard shortcuts
function setupKeyboardShortcuts() {
  // Create keyboard shortcuts help panel
  if (!document.getElementById("keyboard-shortcuts-panel")) {
    const shortcutsPanel = document.createElement("div");
    shortcutsPanel.id = "keyboard-shortcuts-panel";
    shortcutsPanel.className = "shortcuts-panel";
    shortcutsPanel.innerHTML = `
      <div class="shortcuts-header">
        <h3>Keyboard Shortcuts</h3>
        <button class="close-shortcuts"><i class="fas fa-times"></i></button>
      </div>
      <div class="shortcuts-body">
        <div class="shortcut-group">
          <h4>Navigation</h4>
          <div class="shortcut-item">
            <div class="shortcut-keys"><kbd>Alt</kbd> + <kbd>H</kbd></div>
            <div class="shortcut-desc">Go to Dashboard</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-keys"><kbd>Alt</kbd> + <kbd>S</kbd></div>
            <div class="shortcut-desc">Go to Settings</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-keys"><kbd>Alt</kbd> + <kbd>P</kbd></div>
            <div class="shortcut-desc">Go to Positions</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-keys"><kbd>Alt</kbd> + <kbd>C</kbd></div>
            <div class="shortcut-desc">Go to Contestants</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-keys"><kbd>Alt</kbd> + <kbd>V</kbd></div>
            <div class="shortcut-desc">Go to Voters</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-keys"><kbd>Alt</kbd> + <kbd>R</kbd></div>
            <div class="shortcut-desc">Go to Results</div>
          </div>
        </div>
        
        <div class="shortcut-group">
          <h4>Actions</h4>
          <div class="shortcut-item">
            <div class="shortcut-keys"><kbd>Alt</kbd> + <kbd>T</kbd></div>
            <div class="shortcut-desc">Toggle Theme</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-keys"><kbd>Alt</kbd> + <kbd>B</kbd></div>
            <div class="shortcut-desc">Toggle Sidebar</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-keys"><kbd>Alt</kbd> + <kbd>F</kbd></div>
            <div class="shortcut-desc">Refresh Data</div>
          </div>
          <div class="shortcut-item">
            <div class="shortcut-keys"><kbd>?</kbd></div>
            <div class="shortcut-desc">Show Keyboard Shortcuts</div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(shortcutsPanel);

    // Add event listener to close button
    shortcutsPanel
      .querySelector(".close-shortcuts")
      .addEventListener("click", () => {
        shortcutsPanel.classList.remove("active");
      });
  }

  // Set up shortcuts
  document.addEventListener("keydown", function (e) {
    // Shift + ? to show shortcuts panel
    if (e.key === "?" && e.shiftKey) {
      e.preventDefault();
      document
        .getElementById("keyboard-shortcuts-panel")
        .classList.toggle("active");
      return;
    }

    // Don't trigger shortcuts when typing in input fields
    if (
      document.activeElement.tagName === "INPUT" ||
      document.activeElement.tagName === "TEXTAREA" ||
      document.activeElement.isContentEditable
    ) {
      return;
    }

    // Alt + key shortcuts
    if (e.altKey) {
      switch (e.key.toLowerCase()) {
        case "h": // Dashboard
          e.preventDefault();
          window.location.href = "/admin/dashboard";
          break;
        case "s": // Settings
          e.preventDefault();
          window.location.href = "/admin/settings";
          break;
        case "p": // Positions
          e.preventDefault();
          window.location.href = "/admin/positions";
          break;
        case "c": // Contestants
          e.preventDefault();
          window.location.href = "/admin/contestants";
          break;
        case "v": // Voters
          e.preventDefault();
          window.location.href = "/admin/voters";
          break;
        case "r": // Results
          e.preventDefault();
          window.location.href = "/admin/results";
          break;
        case "t": // Toggle theme
          e.preventDefault();
          document.querySelector(".theme-toggle")?.click();
          break;
        case "b": // Toggle sidebar
          e.preventDefault();
          document.querySelector(".toggle-admin-sidebar")?.click();
          break;
        case "f": // Refresh data
          e.preventDefault();
          document.dispatchEvent(new CustomEvent("dataRefreshed"));
          window.showToast("Refreshing all data...", "info");

          // Refresh all refreshable elements
          document
            .querySelectorAll("[data-refresh-interval]")
            .forEach((element) => {
              refreshElement(element);
            });
          break;
      }
    }
  });

  // Add keyboard shortcuts help button to header
  const adminHeader = document.querySelector(
    ".admin-header .d-flex:last-child"
  );
  if (adminHeader && !document.querySelector(".shortcuts-help-btn")) {
    const shortcutsBtn = document.createElement("button");
    shortcutsBtn.className = "shortcuts-help-btn me-3";
    shortcutsBtn.setAttribute("aria-label", "Keyboard shortcuts");
    shortcutsBtn.innerHTML = '<i class="fas fa-keyboard"></i>';

    shortcutsBtn.addEventListener("click", () => {
      document
        .getElementById("keyboard-shortcuts-panel")
        .classList.toggle("active");
    });

    adminHeader.prepend(shortcutsBtn);
  }
}

// Call the keyboard shortcuts setup on document ready
document.addEventListener("DOMContentLoaded", function () {
  // Enhance accessibility
  enhanceAccessibility();

  // Set up real-time updates
  setupRealTimeUpdates();

  // Set up keyboard shortcuts
  setupKeyboardShortcuts();
});

// Add welcome toast when dashboard loads
function showWelcomeMessage() {
  setTimeout(() => {
    if (window.showToast) {
      window.showToast(
        "Welcome to the modernized LINCSSA VOTES dashboard!",
        "success",
        5000
      );
    }
  }, 2000);
}

// Call the welcome message on initialization
document.addEventListener("DOMContentLoaded", function () {
  // After loading completes
  setTimeout(() => {
    showWelcomeMessage();
  }, 1500);
});
