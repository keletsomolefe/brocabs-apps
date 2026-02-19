#!/usr/bin/env node

import { spawn } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { createInterface } from "readline";

const APPS = ["rider", "driver"];
const ROOT_DIR = new URL("..", import.meta.url).pathname;

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function confirm(message) {
  const answer = await question(`${message} (y/n): `);
  return answer.toLowerCase() === "y" || answer.toLowerCase() === "yes";
}

async function waitForEnter(message = "Press Enter to continue...") {
  await question(`\n${message}`);
}

function runCommand(command, cwd = ROOT_DIR) {
  return new Promise((resolve, reject) => {
    console.log(`\n📦 Running: ${command}`);
    console.log(`   in: ${cwd}\n`);

    // Pause readline to allow child process to take over stdin
    rl.pause();
    process.stdin.setRawMode && process.stdin.setRawMode(false);

    const child = spawn(command, {
      cwd,
      shell: true,
      stdio: "inherit",
    });

    child.on("close", (code) => {
      // Resume readline after command completes
      rl.resume();
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on("error", (err) => {
      rl.resume();
      reject(err);
    });
  });
}

function getPackageJson(app) {
  const packagePath = join(ROOT_DIR, "apps", app, "package.json");
  return JSON.parse(readFileSync(packagePath, "utf-8"));
}

function savePackageJson(app, data) {
  const packagePath = join(ROOT_DIR, "apps", app, "package.json");
  writeFileSync(packagePath, JSON.stringify(data, null, 2) + "\n");
}

function parseVersion(version) {
  const [major, minor, patch] = version.split(".").map(Number);
  return { major, minor, patch };
}

function incrementVersion(version, type) {
  const { major, minor, patch } = parseVersion(version);

  switch (type) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Invalid version type: ${type}`);
  }
}

async function bumpVersions() {
  console.log("\n🔖 Version Bump\n");
  console.log("Current versions:");

  for (const app of APPS) {
    const pkg = getPackageJson(app);
    console.log(`  ${app}: ${pkg.version}`);
  }

  console.log("\nSelect version bump type:");
  console.log("  1. patch (0.0.x) - Bug fixes");
  console.log("  2. minor (0.x.0) - New features");
  console.log("  3. major (x.0.0) - Breaking changes");
  console.log("  4. custom - Enter custom version");

  const choice = await question("\nEnter choice (1-4): ");

  let newVersions = {};

  if (choice === "4") {
    for (const app of APPS) {
      const pkg = getPackageJson(app);
      const customVersion = await question(
        `Enter new version for ${app} (current: ${pkg.version}): `,
      );
      newVersions[app] = customVersion || pkg.version;
    }
  } else {
    const typeMap = { 1: "patch", 2: "minor", 3: "major" };
    const bumpType = typeMap[choice];

    if (!bumpType) {
      console.log("Invalid choice. Aborting.");
      return false;
    }

    for (const app of APPS) {
      const pkg = getPackageJson(app);
      newVersions[app] = incrementVersion(pkg.version, bumpType);
    }
  }

  console.log("\nNew versions will be:");
  for (const app of APPS) {
    console.log(
      `  ${app}: ${getPackageJson(app).version} → ${newVersions[app]}`,
    );
  }

  const shouldProceed = await confirm("\nProceed with version bump?");
  if (!shouldProceed) {
    console.log("Version bump cancelled.");
    return false;
  }

  for (const app of APPS) {
    const pkg = getPackageJson(app);
    pkg.version = newVersions[app];
    savePackageJson(app, pkg);
    console.log(`✅ Updated ${app} to version ${newVersions[app]}`);
  }

  console.log("\n✅ Version bump complete!");
  return true;
}

async function releaseApp(app, stage = "staging") {
  const appDir = join(ROOT_DIR, "apps", app);
  const pkg = getPackageJson(app);

  console.log(`\n🚀 Releasing ${app} v${pkg.version} (${stage})\n`);

  // iOS Build
  console.log(`\n🍎 Step 1: Building ${app} for iOS...`);
  await waitForEnter(`Press Enter to start building ${app}...`);

  try {
    await runCommand(
      `STAGE=${stage} eas build --platform ios --profile ${stage} --no-wait`,
      appDir,
    );
    console.log(`✅ iOS Build started for ${app}`);
  } catch (error) {
    console.error(`❌ iOS Build failed for ${app}:`, error.message);
    const shouldContinue = await confirm("Continue with next step anyway?");
    if (!shouldContinue) {
      return false;
    }
  }

  // iOS Submit
  console.log(`\n📤 Step 2: Submitting ${app} to App Store Connect...`);
  await waitForEnter(`Press Enter to start submitting ${app}...`);

  try {
    await runCommand(
      `STAGE=${stage} eas submit --platform ios --profile ${stage} --no-wait`,
      appDir,
    );
    console.log(`✅ iOS Submit started for ${app}`);
  } catch (error) {
    console.error(`❌ iOS Submit failed for ${app}:`, error.message);
    const shouldContinue = await confirm("Continue with next step anyway?");
    if (!shouldContinue) {
      return false;
    }
  }

  // Android Build
  console.log(`\n🤖 Step 3: Building ${app} for Android...`);
  await waitForEnter(`Press Enter to start building ${app}...`);

  try {
    await runCommand(
      `STAGE=${stage} eas build --platform android --profile ${stage} --no-wait`,
      appDir,
    );
    console.log(`✅ Android Build started for ${app}`);
  } catch (error) {
    console.error(`❌ Android Build failed for ${app}:`, error.message);
    const shouldContinue = await confirm("Continue with next step anyway?");
    if (!shouldContinue) {
      return false;
    }
  }

  // Android Submit
  console.log(`\n📤 Step 4: Submitting ${app} to Google Play Store...`);
  await waitForEnter(`Press Enter to start submitting ${app}...`);

  try {
    await runCommand(
      `STAGE=${stage} eas submit --platform android --profile ${stage} --no-wait`,
      appDir,
    );
    console.log(`✅ Android Submit started for ${app}`);
  } catch (error) {
    console.error(`❌ Android Submit failed for ${app}:`, error.message);
    return false;
  }

  console.log(`\n✅ Release process completed for ${app}!`);
  return true;
}

async function releaseApps() {
  console.log("\n🚀 App Release Process\n");

  let stage =
    (await question("Enter stage (staging/prod) [staging]: ")) ||
    "staging";

  if (stage === "production") {
    stage = "prod";
  }

  console.log(`\nWill release the following apps to ${stage}:`);
  for (const app of APPS) {
    const pkg = getPackageJson(app);
    console.log(`  ${app}: v${pkg.version}`);
  }

  const shouldProceed = await confirm("\nProceed with release?");
  if (!shouldProceed) {
    console.log("Release cancelled.");
    return false;
  }

  for (const app of APPS) {
    const success = await releaseApp(app, stage);
    if (!success) {
      const shouldContinue = await confirm(
        `\n${app} release had issues. Continue with other apps?`,
      );
      if (!shouldContinue) {
        console.log("Release process stopped.");
        return false;
      }
    }
    await waitForEnter(
      `\n${app} release initiated. Press Enter to continue to next app...`,
    );
  }

  console.log("\n🎉 All releases initiated!");
  return true;
}

async function fullRelease() {
  console.log("\n🎯 Full Release Process\n");
  console.log("This will:");
  console.log("  1. Bump versions for rider and driver");
  console.log("  2. Build and submit both apps to EAS (iOS & Android)\n");

  const shouldProceed = await confirm("Start full release process?");
  if (!shouldProceed) {
    console.log("Release cancelled.");
    rl.close();
    return;
  }

  // Step 1: Bump versions
  const bumpSuccess = await bumpVersions();
  if (!bumpSuccess) {
    console.log("\nVersion bump was cancelled or failed.");
    const shouldContinue = await confirm("Continue with release anyway?");
    if (!shouldContinue) {
      rl.close();
      return;
    }
  }

  await waitForEnter(
    "\nVersion bump complete. Press Enter to start releases...",
  );

  // Step 2: Release apps
  await releaseApps();

  rl.close();
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log("\n╔═══════════════════════════════════════╗");
  console.log("║     🚖 Brocabs App Release Tool       ║");
  console.log("╚═══════════════════════════════════════╝");

  try {
    switch (command) {
      case "bump":
        await bumpVersions();
        rl.close();
        break;
      case "release":
        await releaseApps();
        rl.close();
        break;
      case "full":
      default:
        await fullRelease();
        break;
    }
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    rl.close();
    process.exit(1);
  }
}

main();
