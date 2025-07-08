/**
 * Voting Status Handler
 * Manages the display of voting status information and eliminates recurring alerts
 */

document.addEventListener("DOMContentLoaded", function () {
  // Find voting status elements
  const votingStartsElement = document.querySelector(".voting-status");

  if (votingStartsElement) {
    // Check if text shows "Voting has started!"
    if (votingStartsElement.textContent.includes("started")) {
      // Show a single toast notification instead of an alert
      const statusKey = `voting-started-${new Date().toDateString()}`;
      if (!localStorage.getItem(statusKey)) {
        // Mark that we've shown this notification
        localStorage.setItem(statusKey, "true");

        // Show a toast notification if the function exists
        if (typeof showToast === "function") {
          showToast(
            "Voting has started! You can now cast your vote.",
            "success"
          );
        }
      }
    }
  }

  // Check for notification container and create if needed
  if (document.querySelector(".notification-center") === null) {
    const notificationCenter = document.createElement("div");
    notificationCenter.className = "notification-center";
    document.body.appendChild(notificationCenter);
  }

  // Override the browser's native confirm to use our custom notification
  window.originalConfirm = window.confirm;
  window.confirm = function (message) {
    // For voting period messages, never show confirm dialog
    if (message && message.includes("voting period has changed")) {
      // Return false to prevent page reload
      return false;
    }

    // For other confirms, use the original
    return window.originalConfirm(message);
  };
});
