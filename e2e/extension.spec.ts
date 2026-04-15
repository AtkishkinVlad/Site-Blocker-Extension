import { test, describe } from "node:test";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ok, strictEqual } from "node:assert";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EXTENSION_PATH = path.join(__dirname, "..", ".output", "chrome-mv3");

describe("Site Blocker Extension - Build Tests", () => {
  test("popup.html should exist", () => {
    ok(existsSync(path.join(EXTENSION_PATH, "popup.html")));
  });

  test("confirm.html should exist", () => {
    ok(existsSync(path.join(EXTENSION_PATH, "confirm.html")));
  });

  test("manifest.json should be valid JSON", () => {
    const content = readFileSync(path.join(EXTENSION_PATH, "manifest.json"), "utf-8");
    const manifest = JSON.parse(content);
    ok(manifest);
    strictEqual(manifest.name, "Site Blocker");
    ok(manifest.permissions.includes("storage"));
    ok(manifest.permissions.includes("webNavigation"));
  });

  test("background.js should exist", () => {
    ok(existsSync(path.join(EXTENSION_PATH, "background.js")));
  });

  test("background.js should have webNavigation listener", () => {
    const content = readFileSync(path.join(EXTENSION_PATH, "background.js"), "utf-8");
    ok(content.includes("webNavigation"));
    ok(content.includes("onBeforeNavigate"));
  });

  test("popup.js chunk should be built", () => {
    const content = readFileSync(path.join(EXTENSION_PATH, "popup.html"), "utf-8");
    ok(content.includes(".js"));
  });

  test("confirm.js should have UI elements", () => {
    const content = readFileSync(path.join(EXTENSION_PATH, "confirm.html"), "utf-8");
    ok(content.includes('id="confirm"'));
    ok(content.includes('id="url"'));
  });

  test("manifest should have action popup", () => {
    const content = readFileSync(path.join(EXTENSION_PATH, "manifest.json"), "utf-8");
    const manifest = JSON.parse(content);
    strictEqual(manifest.action.default_popup, "popup.html");
  });
});