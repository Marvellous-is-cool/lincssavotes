/**
 * LINCSSA VOTES - Results Charts JavaScript
 * Created: July 4, 2025
 */

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize charts for standard results page
  initStandardCharts();

  // Initialize charts for ultramodern results page
  initUltramodernCharts();
});

/**
 * Initialize charts for the standard results page
 */
function initStandardCharts() {
  // Get all chart canvases in standard results page
  const chartCanvases = document.querySelectorAll('[id^="resultsChart"]');

  chartCanvases.forEach(function (canvas) {
    try {
      // Get the position ID from the canvas ID
      const positionId = canvas.id.replace("resultsChart", "");

      // Get contestants data from the data attribute
      const contestantsData = canvas.getAttribute("data-contestants");

      if (contestantsData) {
        const contestants = JSON.parse(contestantsData);
        if (contestants && contestants.length > 0) {
          createBarChart(canvas, contestants);
        }
      }
    } catch (error) {
      console.error("Error initializing chart:", error);
    }
  });
}

/**
 * Initialize charts for the ultramodern results page
 */
function initUltramodernCharts() {
  // Get all chart canvases in ultramodern results page
  const chartCanvases = document.querySelectorAll('[id^="pieChart"]');

  chartCanvases.forEach(function (canvas) {
    try {
      // Get contestants data from the data attribute
      const contestantsData = canvas.getAttribute("data-contestants");

      if (contestantsData) {
        const contestants = JSON.parse(contestantsData);
        if (contestants && contestants.length > 0) {
          createPieChart(canvas, contestants);
        }
      }
    } catch (error) {
      console.error("Error initializing ultramodern chart:", error);
    }
  });
}

/**
 * Create a bar chart for position results
 * @param {HTMLElement} canvas - The canvas element
 * @param {Array} contestants - Array of contestants with votes
 */
function createBarChart(canvas, contestants) {
  try {
    if (!canvas || !contestants || contestants.length === 0) {
      return;
    }

    // Get the drawing context
    const ctx = canvas.getContext("2d");

    // Prepare data
    const labels = contestants.map((c) => c.name || c.nickname || "Unnamed");
    const votes = contestants.map((c) => c.votes || 0);

    // Generate colors
    const colors = [
      "#4361ee",
      "#3a0ca3",
      "#7209b7",
      "#f72585",
      "#4cc9f0",
      "#4895ef",
      "#560bad",
      "#480ca8",
      "#b5179e",
      "#ff9e00",
    ];

    // Repeat colors if needed
    const chartColors = contestants.map(
      (_, index) => colors[index % colors.length]
    );

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Votes",
            data: votes,
            backgroundColor: chartColors,
            borderColor: chartColors.map((color) => color + "88"),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
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
            text: "Vote Results",
          },
        },
      },
    });
  } catch (error) {
    console.error("Error creating bar chart:", error);
  }
}

/**
 * Create a pie chart for position results
 * @param {HTMLElement} canvas - The canvas element
 * @param {Array} contestants - Array of contestants with votes
 */
function createPieChart(canvas, contestants) {
  try {
    if (!canvas || !contestants || contestants.length === 0) {
      return;
    }

    // Get the drawing context
    const ctx = canvas.getContext("2d");

    // Prepare data
    const labels = contestants.map((c) => c.name || c.nickname || "Unnamed");
    const votes = contestants.map((c) => c.votes || 0);

    // Generate colors
    const backgroundColors = [
      "rgba(79, 70, 229, 0.8)", // primary
      "rgba(14, 165, 233, 0.8)", // secondary
      "rgba(16, 185, 129, 0.8)", // success
      "rgba(245, 158, 11, 0.8)", // warning
      "rgba(239, 68, 68, 0.8)", // danger
      "rgba(124, 58, 237, 0.8)", // purple
      "rgba(236, 72, 153, 0.8)", // pink
      "rgba(6, 182, 212, 0.8)", // cyan
      "rgba(45, 212, 191, 0.8)", // teal
    ];

    // Repeat colors if needed
    const colors = contestants.map(
      (_, index) => backgroundColors[index % backgroundColors.length]
    );

    // Create the chart
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: votes,
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
                const dataset = context.dataset;
                const total = dataset.data.reduce((sum, val) => sum + val, 0);
                const percentage =
                  total > 0 ? Math.round((value / total) * 100) : 0;
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
  } catch (error) {
    console.error("Error creating pie chart:", error);
  }
}
