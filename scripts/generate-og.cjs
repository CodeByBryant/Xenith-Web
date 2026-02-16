/**
 * Screenshot /og route → public/og-image.png
 *
 * Usage:  node scripts/generate-og.cjs
 *
 * Spins up the Vite dev server, waits for fonts to load on /og,
 * takes a 1200×630 screenshot, then cleans up.
 */
const { execSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT = path.join(ROOT, "public", "og-image.png");

async function main() {
  // 1. Ensure puppeteer is available
  try {
    require.resolve("puppeteer");
  } catch {
    console.log("📦 Installing puppeteer (one-time)…");
    execSync("npm install --no-save puppeteer", {
      cwd: ROOT,
      stdio: "inherit",
    });
  }

  const puppeteer = require("puppeteer");

  // 2. Start Vite dev server on a free port
  const PORT = 4199;
  console.log(`🚀 Starting Vite dev server on :${PORT}…`);
  const server = spawn(
    "npx",
    ["vite", "--port", String(PORT), "--strictPort"],
    {
      cwd: ROOT,
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, BROWSER: "none" },
    },
  );

  // Wait until "Local:" appears in stdout
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Vite startup timed out")),
      20000,
    );
    server.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      if (text.includes("Local:")) {
        clearTimeout(timeout);
        resolve();
      }
    });
    server.stderr.on("data", (chunk) => {
      // Vite sometimes logs to stderr, that's fine
    });
    server.on("error", reject);
  });

  console.log("✅ Vite is running");

  // 3. Launch headless browser
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();

  // Set exact OG dimensions — no device scale factor so it's exactly 1200×630
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

  console.log("📸 Navigating to /og…");
  await page.goto(`http://localhost:${PORT}/og`, {
    waitUntil: "networkidle0",
    timeout: 15000,
  });

  // Wait for fonts (Chomsky, Playfair Display, Inter)
  await page.evaluateHandle("document.fonts.ready");
  // Extra buffer for font rendering
  await new Promise((r) => setTimeout(r, 1500));

  // Take screenshot
  await page.screenshot({
    path: OUTPUT,
    type: "png",
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });

  console.log(`✅ Screenshot saved → ${OUTPUT}`);

  // 4. Cleanup
  await browser.close();
  server.kill("SIGTERM");

  // 5. Optimize if possible
  try {
    execSync(
      `convert "${OUTPUT}" -depth 8 -strip -type TrueColor PNG24:"${OUTPUT}"`,
      { stdio: "pipe" },
    );
    console.log("✅ Optimized with ImageMagick");
  } catch {
    // ImageMagick not available, skip
  }

  const size = (fs.statSync(OUTPUT).size / 1024).toFixed(0);
  console.log(`📐 1200×630 · ${size}KB · ${OUTPUT}`);
}

main().catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
