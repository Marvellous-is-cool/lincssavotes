// Chart data preparation for results-bootstrap.ejs
document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS animations
  AOS.init({
    duration: 800,
    easing: "ease-out",
    once: true,
  });

  // Initialize progress bars
  const progressBars = document.querySelectorAll(".progress-bar[data-width]");
  progressBars.forEach((bar) => {
    const width = bar.getAttribute("data-width");
    if (width) {
      bar.style.width = width + "%";
    }
  });

  // Prepare chart data from the server
  const chartData = [];

  // Get position data from the page
  const positions = document.querySelectorAll("[data-position-info]");
  positions.forEach((position, index) => {
    try {
      const positionInfo = JSON.parse(
        position.getAttribute("data-position-info")
      );
      chartData.push({
        positionId: positionInfo.id,
        positionName: positionInfo.name,
        posIndex: index,
        contestantNames: positionInfo.contestantNames,
        votes: positionInfo.votes,
      });
    } catch (e) {
      console.error("Error parsing position data:", e);
    }
  });

  // Initialize charts with the data
  if (typeof initializeCharts === "function") {
    initializeCharts(chartData);
  } else {
    console.error("Chart initialization function not found!");
  }
});
