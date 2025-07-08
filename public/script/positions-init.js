// Initialize positions data for chart creation
function initializePositionsData(positionsData) {
  console.log("Initializing positions data:", positionsData);

  // Create charts for each position
  positionsData.forEach((position) => {
    createPositionChart(position.id, position.contestants);
  });
}

// Create position chart
function createPositionChart(positionId, contestants) {
  const chartElement = document.getElementById(`position-${positionId}-chart`);
  if (!chartElement) {
    console.warn(`Chart element for position ${positionId} not found`);
    return;
  }

  // Extract data for chart
  const labels = contestants.map((c) => c.nickname || c.name);
  const data = contestants.map((c) => c.votes || 0);
  const totalVotes = data.reduce((sum, val) => sum + val, 0);

  // Generate colors
  const colors = contestants.map((_, i) => {
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
}
