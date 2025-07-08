/**
 * LINCSSA VOTES - Ultra-Modern Admin Dashboard JavaScript
 * Created: July 3, 2025
 *
 * This file contains all JavaScript functionality for the ultra-modern admin dashboard.
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all tooltips
  const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltips.forEach((tooltip) => {
    new bootstrap.Tooltip(tooltip);
  });

  // Initialize all popovers
  const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
  popovers.forEach((popover) => {
    new bootstrap.Popover(popover);
  });

  // Toggle sidebar on mobile
  const sidebarToggleButtons = document.querySelectorAll(".sidebar-toggle");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const sidebar = document.getElementById("sidebar");

  sidebarToggleButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (window.innerWidth < 992) {
        sidebar.classList.toggle("show");
        mobileOverlay.classList.toggle("show");
      } else {
        sidebar.classList.toggle("collapsed");
      }
    });
  });

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", function () {
      sidebar.classList.remove("show");
      mobileOverlay.classList.remove("show");
    });
  }

  // Animate stat counters
  function animateCounters() {
    const counters = document.querySelectorAll(".stat-value");

    counters.forEach((counter) => {
      const target = parseInt(
        counter.getAttribute("data-value") || counter.innerText
      );
      const suffix = counter.getAttribute("data-suffix") || "";
      let currentCount = 0;
      const increment = target / 30; // Adjust for animation speed

      const updateCount = () => {
        if (currentCount < target) {
          currentCount += increment;
          counter.innerText = Math.ceil(currentCount) + suffix;
          setTimeout(updateCount, 30);
        } else {
          counter.innerText = target + suffix;
        }
      };

      updateCount();
    });
  }

  // Call counter animation after page load and loading screen dismissal
  const loadingContainer = document.getElementById("loadingContainer");

  if (loadingContainer) {
    loadingContainer.classList.add("show");

    // Hide loading screen after content is ready
    setTimeout(() => {
      loadingContainer.classList.remove("show");
      setTimeout(animateCounters, 300);
    }, 800);
  } else {
    setTimeout(animateCounters, 300);
  }

  // Responsive behavior
  function handleResponsiveLayout() {
    if (window.innerWidth < 992) {
      sidebar.classList.remove("collapsed");
    }
  }

  window.addEventListener("resize", handleResponsiveLayout);
  handleResponsiveLayout();

  // Add fade-out effect to alerts after 5 seconds
  const alerts = document.querySelectorAll(".alert-modern");
  if (alerts.length > 0) {
    setTimeout(() => {
      alerts.forEach((alert) => {
        alert.style.transition = "opacity 0.5s ease";
        alert.style.opacity = "0";

        setTimeout(() => {
          alert.style.display = "none";
        }, 500);
      });
    }, 5000);
  }

  // Initialize any charts if they exist
  if (
    typeof Chart !== "undefined" &&
    document.getElementById("votingTrendsChart")
  ) {
    initializeCharts();
  }
});

/**
 * Initializes all charts used in the dashboard
 */
function initializeCharts() {
  // Voting Trends Chart (example)
  const votingTrendsCtx = document.getElementById("votingTrendsChart");

  if (votingTrendsCtx) {
    new Chart(votingTrendsCtx, {
      type: "line",
      data: {
        labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
        datasets: [
          {
            label: "Votes Cast",
            data: [12, 29, 45, 76, 103, 148, 200],
            borderColor: "#4f46e5",
            backgroundColor: "rgba(79, 70, 229, 0.1)",
            fill: true,
            tension: 0.3,
            borderWidth: 2,
            pointBackgroundColor: "#4f46e5",
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "rgba(17, 24, 39, 0.8)",
            padding: 12,
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderWidth: 1,
            titleColor: "#fff",
            bodyColor: "#e5e7eb",
            bodyFont: {
              size: 13,
            },
            titleFont: {
              size: 14,
              weight: "bold",
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(156, 163, 175, 0.1)",
              drawBorder: false,
            },
            ticks: {
              color: "#6b7280",
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#6b7280",
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
        elements: {
          point: {
            hoverRadius: 6,
            hoverBorderWidth: 3,
          },
        },
      },
    });
  }

  // You can add more charts here as needed
}
