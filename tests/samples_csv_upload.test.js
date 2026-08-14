const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const scriptPath = path.join(__dirname, "..", "js", "script.js");
const source = fs.readFileSync(scriptPath, "utf8").replace(/\ninit\(\);\s*$/, "\n");
const context = vm.createContext({ console });
vm.runInContext(source, context, { filename: scriptPath });

const parseTSV = vm.runInContext("parseTSV", context);
const classifySampleCsvHeaders = vm.runInContext("classifySampleCsvHeaders", context);

test("accepts a downloaded sample TSV with an added temperature column", () => {
  const tsv = [
    "sample\tBP_ng\tDR_ng\tTT_ng\ttemperature",
    "TEST_SAMPLE\t52\t52\t52\t18.5"
  ].join("\n");
  const [headers] = parseTSV(tsv);

  assert.deepEqual(
    Array.from(classifySampleCsvHeaders(headers, ["BP_ng", "DR_ng", "TT_ng"])),
    ["temperature"]
  );
});

test("still requires sample and configured internal-standard columns", () => {
  assert.throws(
    () => classifySampleCsvHeaders(["temperature", "BP_ng"], ["BP_ng", "DR_ng"]),
    /exact lowercase "sample"/
  );
  assert.throws(
    () => classifySampleCsvHeaders(["sample", "BP_ng"], ["BP_ng", "DR_ng"]),
    /DR_ng/
  );
});
