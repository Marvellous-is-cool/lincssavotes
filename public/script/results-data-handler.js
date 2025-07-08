/**
 * LINCSSA VOTES - Results Data Handler
 * This script handles the initialization and processing of position data
 * for the results page to avoid script tag nesting issues
 * Updated: July 4, 2025
 */

// Global variables to store positions data
let positionsData = [];
let chartsInitialized = false;

document.addEventListener("DOMContentLoaded", function () {
  console.log("Results data handler initialized");

  try {
    // Check if positions data is already available in the page
    const positionsDataElement = document.getElementById("positions-data-json");
    if (positionsDataElement) {
      try {
        const data = JSON.parse(positionsDataElement.textContent);
        window.positionsData = data;
        console.log("Parsed positions data from element:", data.length);
      } catch (error) {
        console.error("Error parsing positions data from element:", error);
      }
    }

    // Try to get positions data from the global variable or from the positions-data-json element
    if (
      !window.positionsData ||
      !Array.isArray(window.positionsData) ||
      window.positionsData.length === 0
    ) {
      try {
        const positionsDataElement = document.getElementById(
          "positions-data-json"
        );
        if (positionsDataElement) {
          window.positionsData = JSON.parse(positionsDataElement.textContent);
          console.log(
            "Parsed positions data from JSON element:",
            window.positionsData.length
          );
        }
      } catch (error) {
        console.error("Error parsing positions data from JSON element:", error);
        window.positionsData = [];
      }
    }

    // Find all position chart containers and initialize them
    const positionChartContainers = document.querySelectorAll(
      '[id^="position-"][id$="-chart"]'
    );

    console.log("Found chart containers:", positionChartContainers.length);

    positionChartContainers.forEach(function (chartContainer) {
      try {
        // Extract position ID from the container ID
        const positionId = chartContainer.id
          .replace("position-", "")
          .replace("-chart", "");

        console.log("Processing position ID:", positionId);

        // Look for position data in our global positions data
        if (window.positionsData && Array.isArray(window.positionsData)) {
          const positionData = window.positionsData.find(
            (p) => p._id === positionId
          );

          if (positionData && positionData.contestants) {
            console.log(
              "Creating chart for position",
              positionId,
              "with",
              positionData.contestants.length,
              "contestants"
            );
            createPositionChart(chartContainer, positionData.contestants);
          } else {
            console.warn("Position data not found for ID:", positionId);
          }
        } else {
          console.warn("No positions data available");
        }
      } catch (error) {
        console.error("Error processing chart container:", error);
      }
    });

    // If window.positionsData is available, use it to initialize charts
    if (window.positionsData && Array.isArray(window.positionsData)) {
      console.log("Positions data found:", window.positionsData.length);

      window.positionsData.forEach(function (position) {
        if (position && position._id && position.contestants) {
          const chartElement = document.getElementById(
            `position-${position._id}-chart`
          );
          if (chartElement) {
            createPositionChart(chartElement, position.contestants);
          }
        }
      });
    }
  } catch (error) {
    console.error("Error in results data handler:", error);
  }
});

/**
 * Create a chart for a position
 * @param {HTMLElement} chartElement - The chart canvas element
 * @param {Array} contestants - Array of contestants with votes
 */
function createPositionChart(chartElement, contestants) {
  if (!chartElement) {
    console.warn("Chart element is missing");
    return;
  }

  // Hide the loading spinner if it exists
  const positionId = chartElement.getAttribute("data-position-id");
  if (positionId) {
    const loadingElement = document.getElementById(`loading-${positionId}`);
    if (loadingElement) {
      loadingElement.classList.add("hidden");

      // Remove it from DOM after animation completes
      setTimeout(() => {
        if (loadingElement.parentNode) {
          loadingElement.parentNode.removeChild(loadingElement);
        }
      }, 500);
    }
  }

  if (!contestants || !Array.isArray(contestants) || contestants.length === 0) {
    console.warn("Invalid contestants data", contestants);

    // Create a "no data" message in the chart container
    const container = chartElement.parentElement;
    if (container) {
      const noDataMsg = document.createElement("div");
      noDataMsg.className = "text-center p-5";
      noDataMsg.innerHTML =
        '<p class="text-muted"><i class="fas fa-info-circle me-2"></i>No contestants available</p>';
      container.innerHTML = "";
      container.appendChild(noDataMsg);
    }
    return;
  }

  try {
    // Make a copy of the contestants to avoid mutation issues
    const contestantsCopy = [...contestants];

    // Extract data for chart
    const labels = contestantsCopy.map((c) => {
      return (c.nickname || c.name || "Unknown").substring(0, 20);
    });

    const data = contestantsCopy.map((c) => {
      return typeof c.votes === "number" ? c.votes : 0;
    });

    const totalVotes = data.reduce((sum, val) => sum + val, 0);

    // If no votes, create a message instead of an empty chart
    if (totalVotes === 0) {
      const container = chartElement.parentElement;
      if (container) {
        const noVotesMsg = document.createElement("div");
        noVotesMsg.className = "text-center p-5";
        noVotesMsg.innerHTML =
          '<p class="text-muted"><i class="fas fa-info-circle me-2"></i>No votes have been cast yet</p>';
        container.innerHTML = "";
        container.appendChild(noVotesMsg);
      }
      return;
    }

    // Generate colors with better distribution
    const colors = contestantsCopy.map((_, i) => {
      // Use golden ratio for better color distribution
      const hue = (i * 137.5) % 360;
      return `hsla(${hue}, 70%, 60%, 0.8)`;
    });

    // Create chart
    new Chart(chartElement, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors,
            borderColor: "white",
            borderWidth: 2,
            hoverOffset: 15,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                family: "'Inter', sans-serif",
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.raw;
                const percentage =
                  totalVotes > 0 ? Math.round((value / totalVotes) * 100) : 0;
                return `${context.label}: ${value} votes (${percentage}%)`;
              },
            },
          },
        },
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 2000,
          easing: "easeOutQuart",
        },
      },
    });

    console.log(
      `Chart created for position with ${contestants.length} contestants`
    );
  } catch (error) {
    console.error("Error creating position chart:", error);
  }
}
