/**
 * LINCSSA VOTES - Ultra-Modern Admin Dashboard v4.0
 * Professional, animated JavaScript functionality
 * July 2025
 */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // Initialize the dashboard
  initDashboard();

  /**
   * Initialize the dashboard with all components
   */
  function initDashboard() {
    // Show loading animation
    handleLoadingScreen();

    // Initialize UI components
    initSidebar();
    initToasts();
    initThemeSwitcher();
    initRefreshButtons();

    // Initialize data visualization
    initCharts();
    initDataRefresh();

    // Initialize interactive elements
    initTooltips();
    addEventListeners();

    // Initialize animations
    initAnimations();
  }

  /**
   * Handle the loading screen animation with progress
   */
  function handleLoadingScreen() {
    const loadingScreen = document.querySelector(".dashboard-loading");
    const progressBar = document.querySelector(".loading-progress-bar");

    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) {
        clearInterval(interval);
        progress = 100;

        // Hide loading screen with smooth fade out
        setTimeout(() => {
          loadingScreen.classList.add("loaded");

          // Remove from DOM after animation completes
          setTimeout(() => {
            loadingScreen.style.display = "none";
          }, 500);
        }, 500);
      }
      progressBar.style.width = `${progress}%`;
    }, 200);
  }

  /**
   * Initialize sidebar toggle functionality with animations
   */
  function initSidebar() {
    const toggleBtn = document.querySelector(".toggle-admin-sidebar");
    const collapseBtn = document.querySelector(".btn-collapse-sidebar");
    const sidebar = document.querySelector(".admin-sidebar");
    const adminMain = document.querySelector(".admin-main");
    const menuTexts = document.querySelectorAll(".menu-text");

    // Toggle sidebar on mobile
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => {
        if (window.innerWidth < 992) {
          sidebar.classList.toggle("mobile-open");
          document.body.classList.toggle("sidebar-open");
        } else {
          sidebar.classList.toggle("collapsed");
          adminMain.classList.toggle("expanded");
        }
      });
    }

    // Collapse sidebar with button
    if (collapseBtn && sidebar) {
      collapseBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        adminMain.classList.toggle("expanded");

        // Update icon direction
        const icon = collapseBtn.querySelector("i");
        if (sidebar.classList.contains("collapsed")) {
          icon.classList.remove("fa-angle-left");
          icon.classList.add("fa-angle-right");
        } else {
          icon.classList.remove("fa-angle-right");
          icon.classList.add("fa-angle-left");
        }
      });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (e) => {
      if (
        window.innerWidth < 992 &&
        !sidebar.contains(e.target) &&
        !toggleBtn.contains(e.target) &&
        sidebar.classList.contains("mobile-open")
      ) {
        sidebar.classList.remove("mobile-open");
        document.body.classList.remove("sidebar-open");
      }
    });
  }

  /**
   * Initialize theme switcher (light/dark mode)
   */
  function initThemeSwitcher() {
    const themeBtns = document.querySelectorAll(".btn-theme");
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Check for saved theme preference or use OS preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
      setActiveThemeButton(savedTheme);
    } else if (prefersDarkScheme.matches) {
      document.documentElement.setAttribute("data-theme", "dark");
      setActiveThemeButton("dark");
    }

    // Add click handlers to theme buttons
    themeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const theme = btn.dataset.theme;
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        setActiveThemeButton(theme);
      });
    });

    function setActiveThemeButton(theme) {
      themeBtns.forEach((btn) => {
        if (btn.dataset.theme === theme) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }
  }

  /**
   * Initialize toast notification system
   */
  function initToasts() {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.className = "toast-container";
      document.body.appendChild(toastContainer);
    }

    // Convert any alert messages to toasts
    const alertsToConvert = document.querySelectorAll(
      "[data-convert-to-toast='true']"
    );
    alertsToConvert.forEach((alert) => {
      const type = alert.classList.contains("alert-futuristic-success")
        ? "success"
        : alert.classList.contains("alert-futuristic-danger")
        ? "error"
        : "info";
      const message = alert.querySelector(".alert-content p").textContent;

      // Create toast
      createToast(message, type);

      // Remove original alert
      alert.remove();
    });
  }

  /**
   * Create and display a toast notification
   */
  function createToast(message, type = "info", duration = 5000) {
    const toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast-notification toast-${type} animate__animated animate__fadeInUp`;

    // Set icon based on type
    let icon = "fa-info-circle";
    if (type === "success") icon = "fa-check-circle";
    if (type === "error") icon = "fa-exclamation-circle";
    if (type === "warning") icon = "fa-exclamation-triangle";

    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fas ${icon}"></i>
      </div>
      <div class="toast-content">
        <p>${message}</p>
      </div>
      <button class="toast-close">
        <i class="fas fa-times"></i>
      </button>
      <div class="toast-progress">
        <div class="toast-progress-bar"></div>
      </div>
    `;

    // Append toast to container
    toastContainer.appendChild(toast);

    // Start progress bar animation
    const progressBar = toast.querySelector(".toast-progress-bar");
    progressBar.style.transition = `width ${duration}ms linear`;

    // Trigger reflow to ensure animation starts
    progressBar.getBoundingClientRect();
    progressBar.style.width = "0%";

    // Set up close button
    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => {
      removeToast(toast);
    });

    // Auto-dismiss after duration
    setTimeout(() => {
      removeToast(toast);
    }, duration);

    // Helper function to remove toast with animation
    function removeToast(toast) {
      toast.classList.remove("animate__fadeInUp");
      toast.classList.add("animate__fadeOutRight");

      toast.addEventListener("animationend", () => {
        toast.remove();
      });
    }
  }

  /**
   * Initialize refresh buttons for stats and cards
   */
  function initRefreshButtons() {
    // Global stats refresh
    const refreshStatsBtn = document.getElementById("refresh-stats");
    if (refreshStatsBtn) {
      refreshStatsBtn.addEventListener("click", () => {
        refreshStatsBtn.classList.add("rotating");

        // Simulate loading time
        setTimeout(() => {
          refreshAllStats();
          refreshStatsBtn.classList.remove("rotating");
          createToast("Statistics updated successfully", "success");
        }, 800);
      });
    }

    // Individual card refresh buttons
    const cardRefreshBtns = document.querySelectorAll(
      ".btn-card-action[title='Refresh']"
    );
    cardRefreshBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".system-card");

        // Add loading state
        btn.classList.add("rotating");
        if (card) card.classList.add("is-loading");

        // Simulate API request
        setTimeout(() => {
          btn.classList.remove("rotating");
          if (card) card.classList.remove("is-loading");
          createToast("Card data refreshed", "success");
        }, 800);
      });
    });
  }

  /**
   * Initialize charts for dashboard
   */
  function initCharts() {
    // Voting trends chart
    initVotingTrendsChart();

    // Voter distribution chart
    initVoterDistributionChart();
  }

  /**
   * Initialize the voting trends chart
   */
  function initVotingTrendsChart() {
    const ctx = document.getElementById("votingTrendsChart");
    if (!ctx) return;

    // Sample data - would be replaced with real data from API
    const data = {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Votes",
          data: [65, 59, 80, 81, 56, 55, 72],
          borderColor: getComputedStyle(document.documentElement)
            .getPropertyValue("--accent-primary")
            .trim(),
          backgroundColor: hexToRgba(
            getComputedStyle(document.documentElement)
              .getPropertyValue("--accent-primary")
              .trim(),
            0.1
          ),
          tension: 0.4,
          fill: true,
          pointBackgroundColor: getComputedStyle(document.documentElement)
            .getPropertyValue("--accent-primary")
            .trim(),
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Visitors",
          data: [28, 48, 40, 19, 86, 27, 90],
          borderColor: getComputedStyle(document.documentElement)
            .getPropertyValue("--accent-secondary")
            .trim(),
          backgroundColor: hexToRgba(
            getComputedStyle(document.documentElement)
              .getPropertyValue("--accent-secondary")
              .trim(),
            0.1
          ),
          tension: 0.4,
          fill: true,
          pointBackgroundColor: getComputedStyle(document.documentElement)
            .getPropertyValue("--accent-secondary")
            .trim(),
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };

    const config = {
      type: "line",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
              padding: 20,
              boxWidth: 8,
            },
          },
          tooltip: {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            titleColor: "#1a2036",
            bodyColor: "#4a5568",
            borderColor: "#edf2f7",
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              labelPointStyle: function () {
                return {
                  pointStyle: "circle",
                  rotation: 0,
                };
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              padding: 10,
            },
          },
          y: {
            grid: {
              drawBorder: false,
              borderDash: [5, 5],
              color: "#edf2f7",
            },
            ticks: {
              padding: 10,
            },
            beginAtZero: true,
          },
        },
      },
    };

    new Chart(ctx, config);

    // Handle period buttons
    const periodBtns = document.querySelectorAll(
      ".btn-card-action[data-period]"
    );
    periodBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        periodBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // In a real app, would fetch new data for the selected period
        createToast(`Viewing ${btn.dataset.period} data`, "info", 2000);
      });
    });
  }

  /**
   * Initialize the voter distribution chart
   */
  function initVoterDistributionChart() {
    const ctx = document.getElementById("voterDistributionChart");
    if (!ctx) return;

    // Sample data - would be replaced with real data from API
    const data = {
      labels: ["Voted", "Not Voted", "Pending"],
      datasets: [
        {
          data: [60, 30, 10],
          backgroundColor: [
            getComputedStyle(document.documentElement)
              .getPropertyValue("--accent-success")
              .trim(),
            getComputedStyle(document.documentElement)
              .getPropertyValue("--accent-danger")
              .trim(),
            getComputedStyle(document.documentElement)
              .getPropertyValue("--accent-warning")
              .trim(),
          ],
          borderWidth: 0,
          borderRadius: 5,
          hoverOffset: 15,
        },
      ],
    };

    const config = {
      type: "doughnut",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 20,
              boxWidth: 8,
            },
          },
          tooltip: {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            titleColor: "#1a2036",
            bodyColor: "#4a5568",
            borderColor: "#edf2f7",
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: function (context) {
                const value = context.raw;
                const total = context.dataset.data.reduce(
                  (acc, data) => acc + data,
                  0
                );
                const percentage = Math.round((value / total) * 100) + "%";
                return `${context.label}: ${percentage} (${value})`;
              },
            },
          },
        },
      },
    };

    new Chart(ctx, config);
  }

  /**
   * Initialize auto-refresh for data elements
   */
  function initDataRefresh() {
    // Get all elements that need periodic refresh
    const refreshElements = document.querySelectorAll(
      "[data-refresh-interval]"
    );

    refreshElements.forEach((el) => {
      const interval = parseInt(el.dataset.refreshInterval) || 60;

      // Set up interval (in seconds)
      setInterval(() => {
        // In a real app, would fetch fresh data from the API
        // For now, just simulate a refresh

        if (el.id.includes("card")) {
          // For stat cards, animate value changes
          const valueEl = el.querySelector(".stat-value");
          if (valueEl) {
            const currentValue = parseFloat(valueEl.dataset.value);
            // Small random change to simulate updates
            const newValue = currentValue + (Math.random() > 0.5 ? 1 : 0);

            animateNumber(valueEl, currentValue, newValue);
            valueEl.dataset.value = newValue;
          }
        }
      }, interval * 1000);
    });
  }

  /**
   * Initialize Bootstrap tooltips
   */
  function initTooltips() {
    // Check if Bootstrap is available
    if (typeof bootstrap !== "undefined" && bootstrap.Tooltip) {
      const tooltipTriggerList = document.querySelectorAll(
        '[data-bs-toggle="tooltip"]'
      );
      [...tooltipTriggerList].map(
        (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
      );
    }
  }

  /**
   * Initialize animations for UI elements
   */
  function initAnimations() {
    // Animate elements with animated-entry class
    const animatedElements = document.querySelectorAll(".animated-entry");

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            // Unobserve after animating
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe each element
    animatedElements.forEach((el) => {
      observer.observe(el);
    });
  }

  /**
   * Add event listeners to interactive elements
   */
  function addEventListeners() {
    // Add hover effects to stat cards
    const statCards = document.querySelectorAll(".stat-card");
    statCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.classList.add("card-hover");
      });

      card.addEventListener("mouseleave", () => {
        card.classList.remove("card-hover");
      });
    });
  }

  /**
   * Animate number counting up/down
   */
  function animateNumber(
    element,
    startValue,
    endValue,
    duration = 800,
    suffix = ""
  ) {
    if (!element) return;

    // Get suffix from data attribute if not provided
    suffix = suffix || element.dataset.suffix || "";

    // Calculate step for smooth animation
    const start = startValue;
    const end = endValue;
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));

    // Check if we need decimals
    const isDecimal = String(start).includes(".") || String(end).includes(".");
    const decimals = isDecimal ? 1 : 0;

    // Animate
    let current = start;
    const timer = setInterval(() => {
      current += increment;

      // Stop at end value
      if (
        (increment > 0 && current >= end) ||
        (increment < 0 && current <= end)
      ) {
        clearInterval(timer);
        current = end;
      }

      // Update display
      element.textContent = current.toFixed(decimals) + suffix;
    }, stepTime);
  }

  /**
   * Refresh all stats with animation
   */
  function refreshAllStats() {
    const statCards = document.querySelectorAll(".stat-card");

    statCards.forEach((card) => {
      const valueEl = card.querySelector(".stat-value");
      if (!valueEl) return;

      const currentValue = parseFloat(valueEl.dataset.value);
      // Simulate a small change in value
      const change = Math.random() * 5;
      const newValue = Math.max(
        0,
        currentValue + (Math.random() > 0.7 ? change : -change)
      );

      // Animate to new value
      animateNumber(valueEl, currentValue, newValue);
      valueEl.dataset.value = newValue;

      // Add a pulse animation to the card
      card.classList.add("pulse-animation");
      setTimeout(() => {
        card.classList.remove("pulse-animation");
      }, 1000);
    });
  }

  /**
   * Helper to convert hex color to rgba
   */
  function hexToRgba(hex, alpha = 1) {
    if (!hex) return `rgba(0, 0, 0, ${alpha})`;

    // Remove # if present
    hex = hex.replace("#", "");

    // Convert 3-digit hex to 6-digits
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    // Extract rgb values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
});
