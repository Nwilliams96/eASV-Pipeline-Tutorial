const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("internal-standard correction is opt-in and carries a clear stopping warning", () => {
  const toggle = html.match(/<input id="intstdToggle"[^>]*>/)?.[0] || "";
  assert.ok(toggle, "internal-standard checkbox should exist");
  assert.doesNotMatch(toggle, /\schecked(?:\s|\/?>)/);
  assert.match(html, /Only check this box if genomic internal standards were physically added/);
  assert.match(html, /the pipeline will not finish/);
});

test("primer and QIIME 2 controls have clearly labelled sections", () => {
  assert.match(html, /<h3>Primer sequences<\/h3>/);
  assert.match(html, /<h3>QIIME 2 environment<\/h3>/);
  assert.ok(html.indexOf("Primer sequences") < html.indexOf('id="fwdPrimer"'));
  assert.ok(html.indexOf("QIIME 2 environment") < html.indexOf('id="qiimeToggle"'));
});
