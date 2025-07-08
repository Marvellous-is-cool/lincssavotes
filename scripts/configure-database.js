#!/usr/bin/env node

/**
 * This script helps configure your application to connect to any MySQL database service
 * (PlanetScale, Railway, etc.)
 *
 * Usage:
 * node scripts/configure-database.js
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to ask a question and get user input
function askQuestion(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

async function configureDatabase() {
  console.log("\n==== Database Configuration Helper ====\n");

  // Ask for database details
  const service = await askQuestion(
    "Which database service are you using? (planetscale, railway, other): "
  );
  const host = await askQuestion("Database host: ");
  const user = await askQuestion("Database username: ");
  const password = await askQuestion("Database password: ");
  const database = await askQuestion("Database name: ");
  const port = (await askQuestion("Database port (default: 3306): ")) || "3306";
  const useSSL =
    (await askQuestion("Use SSL? (yes/no, default: yes): ").toLowerCase()) !==
    "no";

  // Create a new .env file with the provided details
  const envPath = path.join(__dirname, "..", ".env");
  const envTemplatePath = path.join(__dirname, "..", ".env");

  // Backup the current .env file
  if (fs.existsSync(envPath)) {
    const backupPath = `${envPath}.backup-${Date.now()}`;
    fs.copyFileSync(envPath, backupPath);
    console.log(`Backed up current .env file to ${backupPath}`);
  }

  // Read the current .env file
  let envContent;
  try {
    envContent = fs.readFileSync(envPath, "utf8");
  } catch (error) {
    console.error("Could not read .env file:", error);
    envContent = "";
  }

  // Update database configuration in .env file
  const dbConfigRegex = /(# Database configuration[\s\S]*?)(?=\n\n|$)/;
  const newDbConfig = `# Database configuration (${service})
MYSQL_HOST = ${host}
MYSQL_USER = ${user}
MYSQL_PASS = ${password}
MYSQL_DATABASE = ${database}
MYSQL_PORT = ${port}${useSSL ? "\nMYSQL_SSL = true" : ""}`;

  if (dbConfigRegex.test(envContent)) {
    // Replace existing database configuration
    const updatedContent = envContent.replace(dbConfigRegex, newDbConfig);
    fs.writeFileSync(envPath, updatedContent);
  } else {
    // Append database configuration to the end of the file
    fs.writeFileSync(envPath, `${envContent.trim()}\n\n${newDbConfig}\n`);
  }

  console.log("\nDatabase configuration updated successfully!");
  console.log(`\n.env file updated at: ${envPath}`);

  // Update connection.js file to support SSL if needed
  if (useSSL) {
    const connectionPath = path.join(
      __dirname,
      "..",
      "models",
      "connection.js"
    );
    let connectionContent;

    try {
      connectionContent = fs.readFileSync(connectionPath, "utf8");

      // Check if SSL configuration already exists
      if (!connectionContent.includes("ssl")) {
        const poolConfigRegex =
          /(const pool = mysql\.createPool\({[\s\S]*?)(\n\})/;

        const updatedConnectionContent = connectionContent.replace(
          poolConfigRegex,
          `$1  // SSL configuration for cloud database services
  ssl: process.env.MYSQL_SSL ? {
    rejectUnauthorized: true
  } : undefined$2`
        );

        fs.writeFileSync(connectionPath, updatedConnectionContent);
        console.log("Updated connection.js with SSL configuration.");
      }
    } catch (error) {
      console.error("Could not update connection.js file:", error);
    }
  }

  console.log("\nNext steps:");
  console.log("1. Ensure your database is created and accessible");
  console.log("2. Run `npm install` if you haven't already");
  console.log("3. Start your application: `npm start`");

  rl.close();
}

configureDatabase().catch((err) => {
  console.error("An error occurred:", err);
  rl.close();
});
