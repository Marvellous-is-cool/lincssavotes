/**
 * LINCSSA VOTES - Modern Admin Dashboard v3.0
 * Professional, elegant JavaScript functionality
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
    initRefreshButtons();

    // Initialize data visualization
    initCharts();
    initDataRefresh();

    // Initialize interactive elements
    initTooltips();
    addEventListeners();
  }

  /**
   * Handle the loading screen animation and progress
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

        // Hide loading screen when done
        setTimeout(() => {
          loadingScreen.classList.add("loaded");
        }, 500);
      }
      progressBar.style.width = `${progress}%`;
    }, 200);
  }

  /**
   * Initialize sidebar toggle functionality
   */
  function initSidebar() {
    const toggleBtn = document.querySelector(".toggle-admin-sidebar");
    const sidebar = document.querySelector(".admin-sidebar");
    const adminMain = document.querySelector(".admin-main");

    if (toggleBtn && sidebar && adminMain) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        adminMain.classList.toggle("expanded");

        // On mobile, add mobile-open class instead
        if (window.innerWidth < 992) {
          sidebar.classList.toggle("mobile-open");
        }
      });

      // Close sidebar when clicking outside on mobile
      document.addEventListener("click", (e) => {
        if (
          window.innerWidth < 992 &&
          !sidebar.contains(e.target) &&
          !toggleBtn.contains(e.target) &&
          sidebar.classList.contains("mobile-open")
        ) {
          sidebar.classList.remove("mobile-open");
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

    // Replace alerts with toasts
    const alerts = document.querySelectorAll(".alert-futuristic");
    alerts.forEach((alert) => {
      const type = alert.classList.contains("alert-futuristic-success")
        ? "success"
        : alert.classList.contains("alert-futuristic-danger")
        ? "error"
        : alert.classList.contains("alert-futuristic-warning")
        ? "warning"
        : "info";

      const message = alert.querySelector(".alert-content p").textContent;
      showToast(message, type);

      // Remove the original alert
      alert.remove();
    });
  }

  /**
   * Show a toast notification
   * @param {string} message - The message to display
   * @param {string} type - The type of toast (success, error, warning, info)
   * @param {number} duration - Time in ms to show the toast (default: 5000)
   */
  function showToast(message, type = "info", duration = 5000) {
    const toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) return;

    // Create toast element
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    // Set icon based on type
    let icon;
    switch (type) {
      case "success":
        icon = "fa-circle-check";
        break;
      case "error":
        icon = "fa-circle-exclamation";
        break;
      case "warning":
        icon = "fa-triangle-exclamation";
        break;
      default:
        icon = "fa-circle-info";
    }

    // Build toast HTML
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fas ${icon}"></i>
      </div>
      <div class="toast-content">${message}</div>
      <button class="toast-close" aria-label="Close">
        <i class="fas fa-times"></i>
      </button>
    `;

    // Add to container
    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.add("toast-visible");
    }, 10);

    // Close button functionality
    toast.querySelector(".toast-close").addEventListener("click", () => {
      closeToast(toast);
    });

    // Auto close after duration
    setTimeout(() => {
      closeToast(toast);
    }, duration);
  }

  /**
   * Close a toast notification
   * @param {Element} toast - The toast element to close
   */
  function closeToast(toast) {
    toast.classList.remove("toast-visible");
    toast.classList.add("toast-hiding");

    setTimeout(() => {
      toast.remove();
    }, 300);
  }

  /**
   * Initialize refresh buttons on data cards
   */
  function initRefreshButtons() {
    const refreshButtons = document.querySelectorAll(".refresh-btn");

    refreshButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const target = this.getAttribute("data-refresh");
        const container = document.getElementById(target);

        if (container) {
          // Add refreshing state
          this.classList.add("refreshing");
          container.classList.add("refreshing-subtle");

          // Simulate data refresh
          setTimeout(() => {
            // Refresh data based on container type
            if (target.includes("voting-trend")) {
              updateVotingTrendChart();
            } else if (target.includes("voter-distribution")) {
              updateVoterDistributionChart();
            } else {
              refreshCardData(target);
            }

            // Remove refreshing state
            this.classList.remove("refreshing");
            container.classList.remove("refreshing-subtle");

            // Show success toast
            showToast("Data refreshed successfully", "success", 3000);
          }, 1200);
        }
      });
    });
  }

  /**
   * Refresh data for a specific card
   * @param {string} cardId - The ID of the card to refresh
   */
  function refreshCardData(cardId) {
    // In a real application, this would fetch data from the server
    // This is a simulation for demo purposes

    const card = document.getElementById(cardId);
    if (!card) return;

    const statValue = card.querySelector(".stat-value");
    if (statValue) {
      // Get current value and increment slightly for demo
      let currentValue = parseInt(statValue.getAttribute("data-value"));
      let suffix = statValue.getAttribute("data-suffix") || "";

      // Generate a slight variation for demo purposes
      const variation = Math.floor(Math.random() * 5) - 2; // -2 to +2
      currentValue = Math.max(0, currentValue + variation);

      // Update the displayed value with animation
      animateValue(
        statValue,
        parseInt(statValue.textContent),
        currentValue,
        suffix,
        1000
      );

      // Update the data attribute
      statValue.setAttribute("data-value", currentValue);
    }
  }

  /**
   * Animate changing a numeric value
   * @param {Element} element - The element containing the value
   * @param {number} start - The starting value
   * @param {number} end - The ending value
   * @param {string} suffix - Optional suffix to append (like %)
   * @param {number} duration - Animation duration in ms
   */
  function animateValue(element, start, end, suffix = "", duration = 800) {
    let startTimestamp = null;

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }

  /**
   * Initialize all charts on the dashboard
   */
  function initCharts() {
    initVotingTrendChart();
    initVoterDistributionChart();
  }

  /**
   * Initialize the voting trend chart
   */
  function initVotingTrendChart() {
    const ctx = document.getElementById("voting-trend-chart");
    if (!ctx) return;

    // Sample data for the voting trend
    const dates = generateDateLabels(7); // Last 7 days

    // Sample voting data
    const votingData = [18, 25, 32, 48, 73, 102, 145];

    // Create chart
    window.votingTrendChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Votes Cast",
            data: votingData,
            fill: {
              target: "origin",
              above: "rgba(59, 130, 246, 0.1)",
            },
            borderColor: "#3b82f6",
            borderWidth: 2,
            pointBackgroundColor: "#3b82f6",
            pointBorderColor: "#fff",
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(30, 41, 59, 0.8)",
            titleFont: {
              size: 14,
              family: "'Outfit', sans-serif",
              weight: "600",
            },
            bodyFont: {
              size: 13,
              family: "'Outfit', sans-serif",
            },
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 11,
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.04)",
            },
            ticks: {
              precision: 0,
              font: {
                size: 11,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Update the voting trend chart with new data
   */
  function updateVotingTrendChart() {
    if (!window.votingTrendChart) return;

    // Generate new data with slight variations
    const currentData = window.votingTrendChart.data.datasets[0].data;
    const newData = currentData.map((value) => {
      const variation = Math.floor(Math.random() * 15) - 5; // -5 to +10
      return Math.max(0, value + variation);
    });

    // Update chart with new data
    window.votingTrendChart.data.datasets[0].data = newData;
    window.votingTrendChart.update();
  }

  /**
   * Initialize the voter distribution chart
   */
  function initVoterDistributionChart() {
    const ctx = document.getElementById("voter-distribution-chart");
    if (!ctx) return;

    // Sample data for voter distribution
    const data = {
      labels: ["Registered", "Voted", "Not Voted"],
      datasets: [
        {
          data: [75, 42, 33],
          backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
          borderColor: ["#fff", "#fff", "#fff"],
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
    };

    // Create chart
    window.voterDistributionChart = new Chart(ctx, {
      type: "doughnut",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              font: {
                size: 12,
                family: "'Outfit', sans-serif",
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(30, 41, 59, 0.8)",
            titleFont: {
              size: 14,
              family: "'Outfit', sans-serif",
              weight: "600",
            },
            bodyFont: {
              size: 13,
              family: "'Outfit', sans-serif",
            },
            padding: 12,
            cornerRadius: 8,
          },
        },
      },
    });
  }

  /**
   * Update the voter distribution chart with new data
   */
  function updateVoterDistributionChart() {
    if (!window.voterDistributionChart) return;

    // Generate new data with slight variations
    const registered = Math.floor(Math.random() * 20) + 70; // 70-90
    const voted = Math.floor(registered * (Math.random() * 0.3 + 0.5)); // 50-80% of registered
    const notVoted = registered - voted;

    // Update chart with new data
    window.voterDistributionChart.data.datasets[0].data = [
      registered,
      voted,
      notVoted,
    ];
    window.voterDistributionChart.update();
  }

  /**
   * Generate date labels for charts
   * @param {number} days - Number of days to generate
   * @returns {Array} Array of formatted date strings
   */
  function generateDateLabels(days) {
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(formatDate(date));
    }
    return dates;
  }

  /**
   * Format a date object to a readable string
   * @param {Date} date - The date to format
   * @returns {string} Formatted date string (e.g., "Jul 15")
   */
  function formatDate(date) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  }

  /**
   * Set up automatic data refresh intervals
   */
  function initDataRefresh() {
    // Find all elements with refresh intervals
    const refreshElements = document.querySelectorAll(
      "[data-refresh-interval]"
    );

    refreshElements.forEach((element) => {
      const interval = parseInt(element.getAttribute("data-refresh-interval"));
      if (!interval) return;

      // Set up interval for automatic refresh (in seconds)
      setInterval(() => {
        if (element.id.includes("voting-trend")) {
          updateVotingTrendChart();
        } else if (element.id.includes("voter-distribution")) {
          updateVoterDistributionChart();
        } else {
          refreshCardData(element.id);
        }
      }, interval * 1000);
    });
  }

  /**
   * Initialize tooltips for buttons and icons
   */
  function initTooltips() {
    // Add event listeners for elements with data-tooltip attribute
    const tooltipElements = document.querySelectorAll("[data-tooltip]");
    tooltipElements.forEach((element) => {
      // No additional code needed since we're using CSS tooltips
      // This function is just a placeholder for potential future enhancement
    });
  }

  /**
   * Add additional event listeners for interactive elements
   */
  function addEventListeners() {
    // Add any specific event listeners that haven't been covered elsewhere
  }

  /**
   * Initialize charts for the results page
   * @param {string} positionId - ID of the position
   * @param {string} positionTitle - Title of the position
   */
  window.initResultsChart = function (positionId, positionTitle) {
    const ctx = document.getElementById(`resultsChart${positionId}`);
    if (!ctx) return;

    // This would normally fetch data from the server
    // Here we're just simulating the data initialization
    fetch(`/admin/api/results/${positionId}`)
      .then((response) => response.json())
      .then((data) => {
        // Create chart with the data
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: data.labels,
            datasets: [
              {
                label: "Votes",
                data: data.votes,
                backgroundColor: data.colors || [
                  "#3b82f6",
                  "#0ea5e9",
                  "#6366f1",
                  "#8b5cf6",
                  "#a855f7",
                  "#d946ef",
                  "#ec4899",
                  "#f43f5e",
                  "#f59e0b",
                  "#10b981",
                ],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                precision: 0,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: `Vote Results for ${positionTitle}`,
                font: {
                  size: 16,
                  family: "'Outfit', sans-serif",
                  weight: "600",
                },
              },
            },
          },
        });
      })
      .catch((error) => {
        console.error("Error loading chart data:", error);
        // Show error message in the chart container
        ctx.parentElement.innerHTML = `
          <div class="chart-error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Could not load chart data. Please try refreshing.</p>
          </div>
        `;
      });
  };
});

// Mock API endpoint for development
if (typeof fetch !== "undefined") {
  const originalFetch = fetch;
  window.fetch = function (url, options) {
    if (url.startsWith("/admin/api/results/")) {
      // Mock response for chart data
      return new Promise((resolve) => {
        setTimeout(() => {
          const positionId = url.split("/").pop();

          // Generate random data for demo
          const contestantCount = Math.floor(Math.random() * 4) + 2; // 2-5 contestants
          const labels = [];
          const votes = [];
          const colors = [
            "#3b82f6",
            "#0ea5e9",
            "#6366f1",
            "#8b5cf6",
            "#a855f7",
          ];

          for (let i = 1; i <= contestantCount; i++) {
            labels.push(`Contestant ${i}`);
            votes.push(Math.floor(Math.random() * 100) + 10);
          }

          resolve({
            json: () => Promise.resolve({ labels, votes, colors }),
          });
        }, 500); // Simulate network delay
      });
    }

    // Pass through to the original fetch for other URLs
    return originalFetch(url, options);
  };
}
