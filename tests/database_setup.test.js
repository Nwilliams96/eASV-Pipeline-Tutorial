const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const script = fs.readFileSync(path.join(__dirname, "..", "js", "script.js"), "utf8");

test("first-time database setup is explicit and defaults to building BBsplit", () => {
  assert.match(html, /id="haveDatabases" type="checkbox"\s*\/>/);
  assert.doesNotMatch(html, /id="haveDatabases"[^>]*checked/);
  assert.match(html, /Leave this unchecked for a first-time setup/);
  assert.match(html, /Database download\/build destination/);
  assert.match(html, /Database storage directory/);
  assert.match(script, /download and build the BBsplit database here/);
  assert.match(script, /download or prepare only those that are missing/);
  assert.match(script, /use_preexisting_databases: \$\{useDb\}/);
});
