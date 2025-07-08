/**
 * LINCSSA VOTES - Admin Results Page Fix
 * July 2025
 */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // Initialize charts for all positions
  initResultsCharts();

  /**
   * Initialize charts for all position result cards
   */
  function initResultsCharts() {
    // Find all chart containers
    const chartContainers = document.querySelectorAll(
      ".results-chart-container"
    );

    chartContainers.forEach((container) => {
      const canvas = container.querySelector("canvas");
      if (!canvas) return;

      const positionId = canvas.id.replace("resultsChart", "");
      const positionTitle = container
        .closest(".position-results-card")
        .querySelector(".card-header h2").textContent;

      // Collect data from the table
      const table = container.nextElementSibling.querySelector("table");
      if (!table) return;

      const rows = table.querySelectorAll("tbody tr");
      const labels = [];
      const votes = [];
      const colors = [
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
      ];

      rows.forEach((row, index) => {
        const name = row.querySelector("td:nth-child(3)").textContent.trim();
        const voteCount = parseInt(
          row.querySelector("td:nth-child(4)").textContent
        );

        labels.push(name);
        votes.push(voteCount || 0);
      });

      // Initialize chart
      const ctx = canvas.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Votes",
              data: votes,
              backgroundColor: colors.slice(0, labels.length),
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
              ticks: {
                precision: 0,
              },
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
                family: "'Inter', 'Outfit', sans-serif",
                weight: "600",
              },
            },
          },
        },
      });
    });
  }
});
