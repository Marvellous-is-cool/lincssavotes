/**
 * Template debugging middleware to catch and log template resolution issues
 */

const path = require("path");
const fs = require("fs");

const templateDebugMiddleware = (req, res, next) => {
  // Store original render method
  const originalRender = res.render;

  // Override render with comprehensive debugging
  res.render = function (view, options, callback) {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      requestPath: req.path,
      requestUrl: req.url,
      originalView: view,
      viewsDirectory: path.join(process.cwd(), "views"),
      processEnv: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
      },
    };

    console.log(`[TemplateDebug] Request for view: ${view}`);
    console.log(
      `[TemplateDebug] Full debug info:`,
      JSON.stringify(debugInfo, null, 2)
    );

    // Check if the requested view exists
    const possiblePaths = [
      path.join(process.cwd(), "views", view),
      path.join(process.cwd(), "views", view + ".ejs"),
      path.join(process.cwd(), "views", "voter", view),
      path.join(process.cwd(), "views", "voter", view + ".ejs"),
    ];

    console.log(`[TemplateDebug] Checking possible paths:`);
    possiblePaths.forEach((p) => {
      const exists = fs.existsSync(p);
      console.log(`[TemplateDebug] ${exists ? "✓" : "✗"} ${p}`);
    });

    // Call original render
    return originalRender.call(this, view, options, (err, html) => {
      if (err) {
        console.error(`[TemplateDebug] Render error for view "${view}":`, err);

        // Log the stack trace
        console.error(`[TemplateDebug] Stack trace:`, err.stack);

        // If it's a template not found error, provide alternatives
        if (err.code === "ENOENT" && err.path) {
          console.error(`[TemplateDebug] Template not found at: ${err.path}`);

          // Try to suggest alternatives
          const viewName = path.basename(view, ".ejs");
          const alternatives = possiblePaths.filter((p) => fs.existsSync(p));
          console.log(`[TemplateDebug] Available alternatives:`, alternatives);
        }
      }

      if (callback) {
        callback(err, html);
      }
    });
  };

  next();
};

module.exports = templateDebugMiddleware;
