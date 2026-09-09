const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const script = fs.readFileSync(path.join(__dirname, "..", "js", "script.js"), "utf8");

test("generated projects use SILVA 144 and its compatible QIIME 2 environment", () => {
  assert.match(script, /const SILVA_VERSION = "144"/);
  assert.match(html, /rachis-qiime2-linux-64-2026\.7\.yml/);
  assert.match(html, /compatible with the official SILVA 144 classifier/);
  assert.match(html, /unambiguous exact SILVA 144 sequence match/);
});
