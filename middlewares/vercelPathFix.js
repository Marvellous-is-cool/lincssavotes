/**
 * Vercel specific middleware to fix path resolution issues
 */

const fixVercelPathMiddleware = (req, res, next) => {
  // Store original render method
  const originalRender = res.render;

  // Override the render method
  res.render = function (view, options, callback) {
    let fixedView = view;

    console.log(
      `[VercelFix] Original view: ${view}, Request path: ${req.path}, Request URL: ${req.url}`
    );

    // Fix any vote template issues
    if (view.includes("vote-ultramodern")) {
      fixedView = view.replace("vote-ultramodern", "vote-bootstrap");
      console.log(`[VercelFix] Changed ultramodern to bootstrap: ${fixedView}`);
    }

    // Fix path duplication issues
    if (fixedView.includes("/voter/voter/")) {
      fixedView = fixedView.replace("/voter/voter/", "/voter/");
      console.log(`[VercelFix] Fixed duplicated voter path: ${fixedView}`);
    }

    // Special handling for vote routes
    if (req.path.includes("/vote") && fixedView.startsWith("voter/")) {
      // Check if we're on a vote-specific route
      if (req.path.match(/^\/vote\/[a-fA-F0-9]{24}$/)) {
        // This is a specific position vote route, strip voter prefix
        const templateName = fixedView.split("/").pop();
        fixedView = `voter/${templateName}`;
        console.log(
          `[VercelFix] Vote route detected, normalized to: ${fixedView}`
        );
      }
    }

    console.log(`[VercelFix] Final view path: ${fixedView}`);

    // Call the original render method with the fixed path
    return originalRender.call(this, fixedView, options, callback);
  };

  next();
};

module.exports = fixVercelPathMiddleware;
