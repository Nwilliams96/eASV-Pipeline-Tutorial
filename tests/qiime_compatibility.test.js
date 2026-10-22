const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const script = fs.readFileSync(path.join(__dirname, "..", "js", "script.js"), "utf8");

test("QIIME compatibility warning remains visible independently of the environment toggle", () => {
  const notice = html.match(/<aside class="note" id="qiimeCompatibilityNotice">([\s\S]*?)<\/aside>/)?.[1];
  assert.ok(notice, "compatibility warning should exist");
  assert.match(notice, /SILVA and PR2 classifiers/);
  assert.match(notice, /compatible QIIME 2 release/);
  assert.match(notice, /same scikit-learn version used to train each classifier/);
  assert.match(notice, /support both classifiers/);
  assert.match(notice, /matching Conda environment name alone does not guarantee compatibility/);
  assert.match(notice, /https:\/\/library\.qiime2\.org\/data-resources/);
  assert.ok(html.indexOf('id="qiimeCompatibilityNotice"') < html.indexOf('id="qiimeToggle"'));
  assert.ok(html.indexOf('id="qiimeCompatibilityNotice"') < html.indexOf('id="qiimeBlock"'));
});

test("QIIME setting is clearly a YAML definition path, not a named installed environment", () => {
  assert.match(html, /QIIME 2 environment definition path \(\.yml\)/);
  assert.match(html, /id="qiime2version"[^>]*aria-describedby="qiimeCompatibilityNotice"/);
  assert.match(html, /not a version number or an installed Conda environment name/);
  assert.match(html, /Snakemake creates or reuses its managed environment/);
  assert.match(html, /training and classification use this same definition/);
  assert.match(script, /`qiime2version: "\$\{\$\("#qiime2version"\)\.value\.trim\(\)\}"`/);
});
