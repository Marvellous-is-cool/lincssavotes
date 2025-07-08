#!/usr/bin/env node

/**
 * This script helps configure your application to work with PlanetScale.
 * It updates your database connection and makes necessary adjustments for deployment.
 *
 * Usage:
 * node configure-planetscale.js
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

// File paths
const envPath = path.join(__dirname, "..", ".env");
const connectionPath = path.join(__dirname, "..", "models", "connection.js");
const appPath = path.join(__dirname, "..", "app.js");
const packagePath = path.join(__dirname, "..", "package.json");

// PlanetScale connection template
const planetscaleConnectionTemplate = `// filepath: /Users/mac/Documents/My Projects/lincssavotes/models/connection.js
const mysql = require("mysql2/promise");

// Create the connection pool to the database
const pool = mysql.createPool({
  host: process.env.PLANETSCALE_HOST,
  user: process.env.PLANETSCALE_USERNAME,
  password: process.env.PLANETSCALE_PASSWORD,
  database: process.env.PLANETSCALE_DATABASE,
  ssl: {
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000, // 30 seconds timeout
});

pool.on("error", (err) => {
  console.error("MySQL Pool Error:", err.message);
});

// Export the promise-based interface of the pool
module.exports = pool;
`;

// Updated app.js session store for PlanetScale
const sessionStoreUpdate = `// Configure session middleware
const sessionSecret = process.env.SESSION_SECRET || "keyboard cat";
const sessionExpiration = 1000 * 60 * 60 * 20; // 20 hours

// PlanetScale compatible session store configuration
const sessionStore = new MySQLStore(
  {
    createDatabaseTable: true,
    schema: {
      tableName: "sessions",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
    expiration: sessionExpiration,
    // Disabling clear interval to prevent problems with PlanetScale connections
    clearExpired: false,
  },
  connection
);`;

// Updated .env template for PlanetScale
const envTemplate = `# Application configuration
PORT = 3000
NODE_ENV = production
SESSION_SECRET = your_session_secret_here

# PlanetScale Database configuration
PLANETSCALE_HOST = your_planetscale_host.us-east.psdb.cloud
PLANETSCALE_USERNAME = your_planetscale_username
PLANETSCALE_PASSWORD = your_planetscale_password
PLANETSCALE_DATABASE = your_planetscale_database_name

# Keep old MySQL config for reference (can be removed later)
# MYSQL_HOST = localhost
# MYSQL_USER = root
# MYSQL_PASS = 
# MYSQL_DATABASE = bashvote
# MYSQL_PORT = 3306
`;

// Updates for package.json
const vercelBuildScript = `"vercel-build": "echo 'Building for Vercel...'",`;

async function updateConnectionFile() {
  console.log("\nUpdating database connection for PlanetScale...");

  try {
    fs.writeFileSync(connectionPath, planetscaleConnectionTemplate);
    console.log("✅ Connection file updated successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error updating connection file:", error);
    return false;
  }
}

async function updateAppSessionStore() {
  console.log("\nUpdating session store configuration...");

  try {
    let appContent = fs.readFileSync(appPath, "utf8");

    // Find and replace the session store configuration
    const sessionStoreRegex =
      /\/\/ Configure session middleware[\s\S]*?connection\s*\)/;
    if (sessionStoreRegex.test(appContent)) {
      appContent = appContent.replace(sessionStoreRegex, sessionStoreUpdate);
      fs.writeFileSync(appPath, appContent);
      console.log("✅ Session store configuration updated successfully!");
      return true;
    } else {
      console.error("❌ Could not find session store configuration in app.js");
      return false;
    }
  } catch (error) {
    console.error("❌ Error updating session store:", error);
    return false;
  }
}

async function updateEnvTemplate() {
  console.log("\nCreating PlanetScale .env template...");

  try {
    // Create a backup of the current .env file
    if (fs.existsSync(envPath)) {
      fs.copyFileSync(envPath, envPath + ".backup");
      console.log("📄 Created backup of existing .env file at .env.backup");
    }

    // Write the new .env template
    fs.writeFileSync(envPath + ".planetscale", envTemplate);
    console.log("✅ Created PlanetScale .env template at .env.planetscale");
    return true;
  } catch (error) {
    console.error("❌ Error creating .env template:", error);
    return false;
  }
}

async function updatePackageJson() {
  console.log("\nUpdating package.json for Vercel deployment...");

  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

    // Add Vercel build script if it doesn't exist
    if (!packageJson.scripts["vercel-build"]) {
      const scripts = packageJson.scripts;
      const newScripts = {};

      // Add vercel-build after start
      for (const [key, value] of Object.entries(scripts)) {
        newScripts[key] = value;
        if (key === "start") {
          newScripts["vercel-build"] = "echo 'Building for Vercel...'";
        }
      }

      packageJson.scripts = newScripts;

      // Write the updated package.json
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      console.log("✅ Added Vercel build script to package.json");
    } else {
      console.log("✅ Vercel build script already exists in package.json");
    }

    return true;
  } catch (error) {
    console.error("❌ Error updating package.json:", error);
    return false;
  }
}

async function run() {
  console.log("=== PlanetScale Configuration Helper ===");

  const confirm = await question(
    "\nThis script will update your application to work with PlanetScale.\nAre you sure you want to continue? (y/n): "
  );

  if (confirm.toLowerCase() !== "y") {
    console.log("Operation cancelled. No changes were made.");
    rl.close();
    return;
  }

  console.log("\nConfiguring application for PlanetScale...");

  const updatedConnection = await updateConnectionFile();
  const updatedSessionStore = await updateAppSessionStore();
  const updatedEnvTemplate = await updateEnvTemplate();
  const updatedPackageJson = await updatePackageJson();

  if (
    updatedConnection &&
    updatedSessionStore &&
    updatedEnvTemplate &&
    updatedPackageJson
  ) {
    console.log("\n✅ Configuration complete!");
    console.log("\nNext steps:");
    console.log("1. Review the changes in:");
    console.log("   - models/connection.js");
    console.log("   - app.js");
    console.log(
      "   - .env.planetscale (update with your actual PlanetScale credentials)"
    );
    console.log(
      "2. After migrating your data to PlanetScale, replace .env with .env.planetscale"
    );
    console.log("3. Test your application locally with PlanetScale connection");
    console.log("4. Deploy your application to Vercel");
  } else {
    console.log(
      "\n⚠️ Some configuration steps failed. Please review the errors and try again."
    );
  }

  rl.close();
}

run();
