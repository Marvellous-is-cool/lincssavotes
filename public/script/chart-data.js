// Chart configuration for LINCSSA Votes results page
function initializeCharts(chartData) {
  const chartColors = [
    "rgba(94, 96, 206, 0.8)",
    "rgba(76, 201, 240, 0.8)",
    "rgba(67, 160, 71, 0.8)",
    "rgba(245, 158, 11, 0.8)",
    "rgba(239, 68, 68, 0.8)",
    "rgba(156, 39, 176, 0.8)",
    "rgba(33, 150, 243, 0.8)",
    "rgba(0, 150, 136, 0.8)",
    "rgba(255, 152, 0, 0.8)",
    "rgba(121, 85, 72, 0.8)",
  ];

  // Initialize charts for each position
  chartData.forEach((data) => {
    const posIndex = data.posIndex;
    const contestantNames = data.contestantNames;
    const votes = data.votes;

    // Bar chart
    const barCtx = document.getElementById(`barChart${posIndex}`);
    if (barCtx) {
      new Chart(barCtx.getContext("2d"), {
        type: "bar",
        data: {
          labels: contestantNames,
          datasets: [
            {
              label: "Votes",
              data: votes,
              backgroundColor: chartColors,
              borderColor: chartColors.map((color) =>
                color.replace("0.8", "1")
              ),
              borderWidth: 1,
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
                color: "rgba(255, 255, 255, 0.7)",
              },
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
            },
            x: {
              ticks: {
                color: "rgba(255, 255, 255, 0.7)",
              },
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: "Votes by Contestant",
              color: "rgba(255, 255, 255, 0.9)",
              font: {
                size: 16,
              },
            },
          },
        },
      });
    }

    // Pie chart
    const pieCtx = document.getElementById(`pieChart${posIndex}`);
    if (pieCtx) {
      new Chart(pieCtx.getContext("2d"), {
        type: "pie",
        data: {
          labels: contestantNames,
          datasets: [
            {
              data: votes,
              backgroundColor: chartColors,
              borderColor: "#0f172a",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "rgba(255, 255, 255, 0.8)",
                padding: 15,
                font: {
                  size: 12,
                },
              },
            },
            title: {
              display: true,
              text: "Vote Distribution",
              color: "rgba(255, 255, 255, 0.9)",
              font: {
                size: 16,
              },
            },
          },
        },
      });
    }
  });
}
