/**
 * Vercel specific middleware to fix path resolution issues
 */

const fixVercelPathMiddleware = (req, res, next) => {
  // Only intercept render calls in the Vercel environment
  if (process.env.VERCEL) {
    // Store original render method
    const originalRender = res.render;

    // Override the render method
    res.render = function (view, options, callback) {
      // Fix path duplication in Vercel environment
      if (view.startsWith("voter/") && view.includes("vote")) {
        console.log(`[VercelFix] Original view path: ${view}`);

        // Check if it's being requested from a path that already includes 'voter'
        if (req.path.includes("/voter/")) {
          // Extract just the template name without the directory prefix
          const templateName = view.split("/").pop();
          console.log(`[VercelFix] Adjusted to template: ${templateName}`);

          // Call the original render with the fixed path
          return originalRender.call(this, templateName, options, callback);
        }
      }

      // Call the original render method for all other cases
      return originalRender.call(this, view, options, callback);
    };
  }

  next();
};

module.exports = fixVercelPathMiddleware;
