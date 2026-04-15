import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EXTENSION_PATH = path.join(__dirname, "..", ".output", "chrome-mv3");

// Test that popup.html exists and is loadable
test("should load popup.html", async ({ browser }) => {
  const ctx = await browser.newContext();
  const pg = await ctx.newPage();
  await pg.goto(`file://${EXTENSION_PATH}/popup.html`);
  expect(pg.url()).toContain("popup.html");
});

// Test that confirm.html exists
test("should load confirm.html", async ({ browser }) => {
  const ctx = await browser.newContext();
  const pg = await ctx.newPage();
  await pg.goto(`file://${EXTENSION_PATH}/confirm.html`);
  expect(pg.url()).toContain("confirm.html");
});

// Test HTML content - confirm page static elements
test("should display confirm heading", async ({ browser }) => {
  const ctx = await browser.newContext();
  const pg = await ctx.newPage();
  await pg.goto(`file://${EXTENSION_PATH}/confirm.html`);
  await pg.waitForSelector("h1", { timeout: 5000 });
  expect(await pg.locator("h1").textContent()).toContain("Navigation Blocked");
});

// Test confirm button exists
test("should have confirm button", async ({ browser }) => {
  const ctx = await browser.newContext();
  const pg = await ctx.newPage();
  await pg.goto(`file://${EXTENSION_PATH}/confirm.html?tabId=1`);
  await pg.waitForSelector("#confirm", { timeout: 5000 });
  expect(await pg.locator("#confirm").textContent()).toContain("Перейти");
});

// Test that URL element exists
test("should have URL display element", async ({ browser }) => {
  const ctx = await browser.newContext();
  const pg = await ctx.newPage();
  await pg.goto(`file://${EXTENSION_PATH}/confirm.html`);
  await pg.waitForSelector("#url", { timeout: 5000 });
  const hasElement = await pg.locator("#url").count();
  expect(hasElement).toBe(1);
});

/*
 * Note: Full E2E tests with chrome-extension:// URLs and extension context
 * require a different setup. To test the extension with Chrome APIs,
 * you would need to use Chrome's debugging protocol or install
 * the extension manually and interact with it.
 * 
 * Alternative approaches:
 * 1. Use chrome.launcher to launch Chrome with extension
 * 2. Install extension via chrome://extensions internally
 * 3. Use @wxt-dev/e2e if available
 */