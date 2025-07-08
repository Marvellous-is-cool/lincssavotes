/**
 * Test script for the settings page
 * This helps validate that our fixes are working correctly
 */

// This script is executed on page load
document.addEventListener("DOMContentLoaded", function () {
  console.log("==== LINCSSA VOTES Settings Page Test ====");

  // Log the Bootstrap and jQuery versions
  console.log(
    "Bootstrap version:",
    typeof bootstrap !== "undefined" ? "Loaded" : "Not loaded"
  );
  console.log(
    "jQuery version:",
    typeof jQuery !== "undefined" ? jQuery.fn.jquery : "Not loaded"
  );

  // Dark mode functionality has been removed - light theme only
  console.log("✅ Using light theme only");

  // Check tab functionality
  const tabLinks = document.querySelectorAll('button[data-bs-toggle="pill"]');
  console.log(`Found ${tabLinks.length} tab buttons`);

  // Check if any tab is active
  const activeTabLink = document.querySelector(
    'button[data-bs-toggle="pill"].active'
  );
  const activeTabPane = document.querySelector(".tab-pane.show.active");

  if (activeTabLink && activeTabPane) {
    console.log("✅ Active tab found:", activeTabLink.textContent.trim());
    console.log("✅ Active tab pane found:", activeTabPane.id);
  } else {
    console.error("❌ No active tab or tab pane found");
  }

  // Check color swatches
  const colorSwatches = document.querySelectorAll(".color-swatch");
  const colorThemeInput = document.getElementById("colorTheme");

  if (colorSwatches.length > 0 && colorThemeInput) {
    console.log(`✅ Found ${colorSwatches.length} color swatches`);
    console.log(`Current color theme: ${colorThemeInput.value}`);

    // Check if a swatch is active
    const activeSwatches = document.querySelectorAll(".color-swatch.active");
    if (activeSwatches.length === 1) {
      console.log("✅ One color swatch is active");
    } else if (activeSwatches.length === 0) {
      console.error("❌ No active color swatch found");
    } else {
      console.error("❌ Multiple active color swatches found");
    }
  } else {
    console.error("❌ Color swatch elements not found properly");
  }

  // Check theme preview elements
  const themePreview = document.querySelector(".theme-preview");
  const themePreviewHeader = document.querySelector(".theme-preview-header");
  const themePreviewButton = document.querySelector(".theme-preview-button");

  if (themePreview && themePreviewHeader && themePreviewButton) {
    console.log("✅ Theme preview elements found");
  } else {
    console.error("❌ Theme preview elements not found properly");
  }

  // Check logo preview functionality
  const logoInput = document.getElementById("customLogo");
  const logoPreviewImage = document.getElementById("logoPreviewImage");
  const logoPreviewPlaceholder = document.getElementById(
    "logoPreviewPlaceholder"
  );

  if (logoInput && (logoPreviewImage || logoPreviewPlaceholder)) {
    console.log("✅ Logo preview elements found");
  } else {
    console.error("❌ Logo preview elements not found properly");
  }

  console.log("==== End of Settings Page Test ====");
});
