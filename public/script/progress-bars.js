// Initialize progress bars with data-width attribute
document.addEventListener("DOMContentLoaded", function () {
  const progressBars = document.querySelectorAll(".progress-bar[data-width]");
  progressBars.forEach((bar) => {
    const width = bar.getAttribute("data-width");
    if (width) {
      // Set the width after a small delay for animation effect
      setTimeout(() => {
        bar.style.width = width + "%";
      }, 200);
    }
  });
});
