const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const script = fs.readFileSync(path.join(__dirname, "..", "js", "script.js"), "utf8");

test("database families are independently selectable and default to setup", () => {
  for (const id of ["haveBbsplitDatabase", "haveSilvaDatabase", "havePr2Database"]) {
    assert.match(html, new RegExp(`id="${id}" type="checkbox"\\s*\\/>`));
    assert.doesNotMatch(html, new RegExp(`id="${id}"[^>]*checked`));
  }
  assert.match(html, /Leave an item unchecked when it needs to be downloaded or built/);
  assert.match(script, /Shared database location and download\/build destination/);
  assert.match(html, /Database storage directory/);
  assert.match(script, /use_preexisting_bbsplit_database: \$\{useBbsplitDb\}/);
  assert.match(script, /use_preexisting_silva_database: \$\{useSilvaDb\}/);
  assert.match(script, /use_preexisting_pr2_database: \$\{usePr2Db\}/);
  assert.match(html, /use_preexisting_silva_database:/);
});
