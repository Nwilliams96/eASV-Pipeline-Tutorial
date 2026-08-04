const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const PIPELINE_REPOSITORY = "git@github.com:Nwilliams96/515FY-926R-snakemake-NW-edits.git";
const PIPELINE_BRANCH = "codex/config-tutorial-integration";
const SILVA_VERSION = "138.1";
const SAMPLE_FIELD_KEYS = [
  "sample", "replicate", "condition", "depth", "latlon", "lon", "lat", "time",
  "intstd1_ng", "intstd2_ng", "intstd3_ng", "norm", "units"
];

function escapeAttribute(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function projectCommands(includeRun = false) {
  const projectName = $("#projectName").value.trim() || "my-eASV-project";
  const commands = [
    `git clone --branch ${PIPELINE_BRANCH} ${PIPELINE_REPOSITORY} ${projectName}`,
    `cd ${projectName}`
  ];
  if (includeRun) {
    commands.push("conda activate snakemake");
    commands.push("bash run_snakemake.sh");
  }
  return commands.join("\n");
}

function buildClonePreview() {
  $("#clone-code").textContent = projectCommands();
}

function buildConfigUploadPreview() {
  const projectName = $("#projectName").value.trim() || "my-eASV-project";
  $("#uploadConfigCode").textContent = `scp ~/Downloads/universal-amplicon-config.zip <USC_USERNAME>@hpc-transfer1.usc.edu:<FULL_PATH_TO_PROJECT_PARENT>/${projectName}/`;
}

function buildReportPath() {
  const studyName = $("#studyName").value.trim() || "study-name";
  $("#reportPath").textContent = `Results-Export/${studyName}.pipeline-report.html`;
}

function updateProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
  $("#progress").style.width = `${pct}%`;
}

function setVisible(id, visible) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle("hidden", !visible);
}

function sampleRowHTML(data = {}, useDefaults = true) {
  const defaults = {
    sample: "AMT29_02",
    replicate: "1",
    condition: "AMT29-whole-seawater",
    depth: "2",
    latlon: "6.7321 S 49.0482 E",
    lon: "49.0482",
    lat: "-6.7321",
    time: "2019-10-16T13:20:00",
    intstd1_ng: "52",
    intstd2_ng: "52",
    intstd3_ng: "52",
    norm: "0.66666667",
    units: "L"
  };
  const empty = Object.fromEntries(Object.keys(defaults).map(key => [key, ""]));
  const v = { ...(useDefaults ? defaults : empty), ...data };
  return `
    <tr>
      <td><input class="sample-cell" value="${escapeAttribute(v.sample)}"></td>
      <td><input class="sample-cell" value="${escapeAttribute(v.replicate)}"></td>
      <td><input class="sample-cell" value="${escapeAttribute(v.condition)}"></td>
      <td><input class="sample-cell" value="${escapeAttribute(v.depth)}"></td>
      <td><input class="sample-cell" value="${escapeAttribute(v.latlon)}"></td>
      <td><input class="sample-cell" value="${escapeAttribute(v.lon)}"></td>
      <td><input class="sample-cell" value="${escapeAttribute(v.lat)}"></td>
      <td><input class="sample-cell" value="${escapeAttribute(v.time)}"></td>
      <td><input class="sample-cell" value="${escapeAttribute(v.intstd1_ng)}"></td>
      <td><input class="sample-cell" value="${escapeAttribute(v.intstd2_ng)}"></td>
      <td><input class="sample-cell" value="${escapeAttribute(v.intstd3_ng)}"></td>
      <td><input class="sample-cell" value="${escapeAttribute(v.norm)}"></td>
      <td><input class="sample-cell" value="${escapeAttribute(v.units)}"></td>
    </tr>`;
}

function standardRowHTML(slot, data = {}) {
  const defaults = {
    copies: "",
    genome: "",
    sequence: ""
  };
  const v = { ...defaults, ...data };
  return `
    <div class="standard-row" data-standard-slot="${slot}">
      <div class="field-label">Internal Standard ID: <strong class="standard-id-label"></strong></div>
      <label class="field-label">rRNA copy number
        <input type="number" min="1" value="${v.copies}">
      </label>
      <label class="field-label">Genome length in base pairs
        <input type="number" min="1" value="${v.genome}">
      </label>
      <label class="field-label">Full 16S sequence
        <textarea placeholder="Paste the complete nucleotide sequence">${v.sequence}</textarea>
      </label>
    </div>`;
}

function getInternalStandardIds() {
  return ["intstd1", "intstd2", "intstd3"].map(id => $(`#${id}`).value.trim());
}

function getStandardsData() {
  const ids = getInternalStandardIds();
  return $$(".standard-row").map((row, index) => {
    const inputs = $$("input, textarea", row);
    return {
      id: ids[index],
      copies: inputs[0].value.trim(),
      genome: inputs[1].value.trim(),
      seq: inputs[2].value.replace(/\s+/g, "").toUpperCase()
    };
  });
}

function markPrefilled() {
  $$("input, textarea").forEach(el => {
    if (typeof el.defaultValue === "string" && el.defaultValue !== "" && el.value === el.defaultValue) {
      el.classList.add("prefilled");
    } else if (el.value && !el.placeholder) {
      // for copied rows, preserve the light-grey "prefilled" look on initial values
      if (el.value === el.defaultValue) el.classList.add("prefilled");
    }
  });
}

function buildConfigPreview() {
  const studyName = $("#studyName").value.trim();
  const useDb = $("#haveDatabases").checked;
  const useInternalStandards = $("#intstdToggle").checked;
  const dbDir = $("#database_dir").value.trim();
  const rawdatadir = $("#rawdatadir").value.trim();
  const R1file_ending = $("#R1file_ending").value.trim();
  const R2file_ending = $("#R2file_ending").value.trim();
  const intstd1 = $("#intstd1").value.trim();
  const intstd2 = $("#intstd2").value.trim();
  const intstd3 = $("#intstd3").value.trim();
  const truncR1 = $("#truncR1").value.trim();
  const truncR2 = $("#truncR2").value.trim();
  const fwdPrimer = $("#fwdPrimer").value.trim();
  const revPrimer = $("#revPrimer").value.trim();
  const qiime2version = $("#qiime2version").value.trim();

  const parts = [];
  parts.push(`# make sure variables below point to the right place / are named appropriately`);
  parts.push(``);
  parts.push(`samplesheet: "config/samples.tsv"`);
  parts.push(`studyName: "${studyName}"`);
  parts.push(`use_preexisting_databases: ${useDb}`);
  parts.push(`database_dir: "${dbDir}"`);
  parts.push(`rawdatadir: "${rawdatadir}"`);
  parts.push(`R1file_ending: "${R1file_ending}"`);
  parts.push(`R2file_ending: "${R2file_ending}"`);
  parts.push(``);
  parts.push(`use_internal_standards: ${useInternalStandards}`);
  if (useInternalStandards) {
    parts.push(`intstds:`);
    parts.push(`  intstd1: "${intstd1}"`);
    parts.push(`  intstd2: "${intstd2}"`);
    parts.push(`  intstd3: "${intstd3}"`);
    parts.push(``);
  }
  parts.push(`trunclens:`);
  parts.push(`  truncR1: ${truncR1}`);
  parts.push(`  truncR2: ${truncR2}`);
  parts.push(``);
  parts.push(`fwdPrimer: "${fwdPrimer}"`);
  parts.push(`revPrimer: "${revPrimer}"`);
  parts.push(`qiime2version: "${qiime2version}"`);
  parts.push(`SILVAversion: "${SILVA_VERSION}"`);
  $("#configPreview").textContent = parts.join("\n");
}

function buildSamplesPreview() {
  $("#samplesPreview").textContent = sampleTableToTSV();
}

function buildAmpliconPreview() {
  $("#ampliconPreview").textContent =
`sample_type\tamount_pM
16S\t${$("#amt16s").value}
18S\t${$("#amt18s").value}`;
}

function buildStandardsPreview() {
  const standards = getStandardsData();
  const lines = ["internal_std_ID\trRNA_copy_number\tgenome_len_bp\tfull_16S_sequence"];
  standards.forEach(s => lines.push(`${s.id}\t${s.copies}\t${s.genome}\t${s.seq}`));
  $("#standardsPreview").textContent = lines.join("\n");
}

function buildValidation() {
  const standards = getStandardsData();
  const ids = getInternalStandardIds();
  const standardsReady = standards.length === 3
    && new Set(ids).size === 3
    && ids.every(id => /^[A-Za-z0-9._-]+$/.test(id))
    && standards.every(s => s.id && s.copies && s.genome && /^[ACGTRYSWKMBDHVN]+$/.test(s.seq));
  const checks = [
    { label: "Valid project folder name", ok: /^[A-Za-z0-9._-]+$/.test($("#projectName").value.trim()) },
    { label: "Study name entered", ok: $("#studyName").value.trim().length > 0 },
    { label: "Shared database directory entered", ok: $("#database_dir").value.trim().length > 0 },
    { label: "Raw data location entered", ok: $("#rawdatadir").value.trim().length > 0 },
    { label: "Forward primer entered", ok: $("#fwdPrimer").value.trim().length > 0 },
    { label: "Reverse primer entered", ok: $("#revPrimer").value.trim().length > 0 },
    { label: "QIIME 2 environment entered", ok: $("#qiime2version").value.trim().length > 0 },
    { label: "Sample table present", ok: $$("#sampleBody tr").length > 0 },
    { label: "Three internal standards are complete", ok: !$("#intstdToggle").checked || standardsReady }
  ];
  checks.push({ label: "Ready to download", ok: checks.every(check => check.ok) });
  $("#validationList").innerHTML = checks.map(check => `<li class="${check.ok ? "ok" : "bad"}">${check.ok ? "✓" : "•"} ${check.label}</li>`).join("");
  return checks.every(check => check.ok);
}

function updateAll() {
  const ids = getInternalStandardIds();
  $$(".standard-id-label").forEach((label, index) => {
    label.textContent = ids[index] || `Standard ${index + 1}`;
  });
  $$('[data-intstd-column]').forEach((heading, index) => {
    heading.textContent = `${ids[index] || `internal_standard_${index + 1}`}_ng`;
  });
  buildClonePreview();
  buildConfigUploadPreview();
  buildReportPath();
  buildConfigPreview();
  buildSamplesPreview();
  buildAmpliconPreview();
  buildStandardsPreview();
  buildValidation();
  markPrefilled();
}

function setSampleRowCount(value) {
  const count = Math.min(500, Math.max(1, Number.parseInt(value, 10) || 1));
  const body = $("#sampleBody");
  let rows = Array.from(body.querySelectorAll("tr"));

  while (rows.length < count) {
    body.insertAdjacentHTML("beforeend", sampleRowHTML({}, false));
    rows = Array.from(body.querySelectorAll("tr"));
  }
  while (rows.length > count) {
    rows[rows.length - 1].remove();
    rows.pop();
  }

  $("#sampleCount").value = String(count);
  markPrefilled();
  buildSamplesPreview();
  buildValidation();
}

function pasteSpreadsheetCells(event) {
  const target = event.target;
  if (!target.matches("#sampleBody .sample-cell")) return;

  const text = event.clipboardData?.getData("text/plain");
  if (!text || (!text.includes("\t") && !text.includes("\n"))) return;

  event.preventDefault();
  const pastedRows = text.replace(/\r/g, "").replace(/\n$/, "").split("\n").map(row => row.split("\t"));
  const currentRow = target.closest("tr");
  const rows = Array.from($("#sampleBody tr"));
  const startRow = rows.indexOf(currentRow);
  const cells = Array.from(currentRow.querySelectorAll(".sample-cell"));
  const startColumn = cells.indexOf(target);
  const requiredRows = startRow + pastedRows.length;

  if (requiredRows > rows.length) setSampleRowCount(requiredRows);

  const updatedRows = Array.from($("#sampleBody tr"));
  pastedRows.forEach((values, rowOffset) => {
    const inputs = Array.from(updatedRows[startRow + rowOffset].querySelectorAll(".sample-cell"));
    values.forEach((value, columnOffset) => {
      const input = inputs[startColumn + columnOffset];
      if (input) {
        input.value = value;
        input.classList.remove("prefilled");
      }
    });
  });

  $("#sampleCount").value = String(updatedRows.length);
  updateAll();
}

function bindEvents() {
  $$(".preview-toggle").forEach(button => {
    button.addEventListener("click", () => {
      const panel = document.getElementById(button.dataset.previewTarget);
      if (!panel) return;

      const willOpen = panel.classList.contains("hidden");
      panel.classList.toggle("hidden", !willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
      button.textContent = willOpen
        ? button.textContent.replace(/^Preview /, "Hide ")
        : button.textContent.replace(/^Hide /, "Preview ");
    });
  });

  $("#haveDatabases").addEventListener("change", () => {
    updateAll();
  });

  $("#qiimeToggle").addEventListener("change", () => {
    setVisible("qiimeBlock", $("#qiimeToggle").checked);
    updateAll();
  });

  $("#intstdToggle").addEventListener("change", () => {
    setVisible("intstdBlock", $("#intstdToggle").checked);
    updateAll();
  });

  $("#addSampleBtn").addEventListener("click", () => {
    setSampleRowCount($$("#sampleBody tr").length + 1);
  });

  $("#removeSampleBtn").addEventListener("click", () => {
    setSampleRowCount($$("#sampleBody tr").length - 1);
  });

  $("#sampleCount").addEventListener("input", (event) => {
    if (event.target.value !== "") setSampleRowCount(event.target.value);
  });
  $("#sampleCount").addEventListener("change", (event) => setSampleRowCount(event.target.value));
  $("#sampleBody").addEventListener("paste", pasteSpreadsheetCells);
  $("#downloadSampleCsvBtn").addEventListener("click", downloadSampleCsv);
  $("#uploadSampleCsvBtn").addEventListener("click", () => $("#sampleCsvUpload").click());
  $("#sampleCsvUpload").addEventListener("change", uploadSampleCsv);

  document.body.addEventListener("input", (e) => {
    if (e.target.matches("input, textarea")) {
      if (typeof e.target.defaultValue === "string") {
        if (e.target.value === e.target.defaultValue && e.target.value !== "") {
          e.target.classList.add("prefilled");
        } else {
          e.target.classList.remove("prefilled");
        }
      }
      updateAll();
    }
  });

  document.body.addEventListener("click", async (e) => {
    if (!e.target.matches(".copy-btn")) return;
    const target = document.querySelector(e.target.dataset.copy);
    if (!target) return;
    const text = target.textContent.trim();
    const original = e.target.textContent;

    const fallbackCopy = () => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    };

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy();
      }
      e.target.textContent = "Copied";
      setTimeout(() => (e.target.textContent = original), 1200);
    } catch {
      const ok = fallbackCopy();
      e.target.textContent = ok ? "Copied" : "Copy failed";
      setTimeout(() => (e.target.textContent = original), 1200);
    }
  });

  $("#downloadPackageBtn").addEventListener("click", downloadPackage);
  $("#copyCommandsBtn").addEventListener("click", copyCommands);
}

function sampleHeaders() {
  const standardHeaders = getInternalStandardIds().map(id => `${id}_ng`);
  return [
    "sample","replicate","condition","Depth (m)","Latitude and Longitude","Longitude [degrees_east]",
    "Latitude [degrees_north]","time",...standardHeaders,"internal_std_normalization_factor","units"
  ];
}

function sampleTableRows() {
  return $$("#sampleBody tr").map(tr => $$("#sampleBody input", tr).map(i => i.value));
}

function sampleTableToTSV() {
  const headers = sampleHeaders();
  const rows = sampleTableRows();
  return [headers.join("\t"), ...rows.map(r => r.join("\t"))].join("\n");
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function sampleTableToCSV() {
  return [sampleHeaders(), ...sampleTableRows()]
    .map(row => row.map(csvCell).join(","))
    .join("\r\n");
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }
  if (quoted) throw new Error("The CSV contains an unclosed quoted value.");
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter(values => values.some(value => value.trim() !== ""));
}

function downloadSampleCsv() {
  const blob = new Blob([sampleTableToCSV()], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "samples-template.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  $("#sampleCsvStatus").textContent = "Downloaded samples-template.csv. Complete it in a spreadsheet and upload it here.";
}

async function uploadSampleCsv(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const rows = parseCSV(await file.text());
    if (rows.length < 2) throw new Error("The CSV needs a header and at least one sample row.");
    const headers = rows[0].map((value, index) => index === 0 ? value.replace(/^\uFEFF/, "").trim() : value.trim());
    const expected = sampleHeaders();
    const fixedIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 11, 12];
    if (headers.length !== expected.length || fixedIndexes.some(index => headers[index] !== expected[index])) {
      throw new Error("The CSV columns do not match the downloaded template.");
    }
    const standardIds = headers.slice(8, 11).map(header => header.endsWith("_ng") ? header.slice(0, -3) : "");
    if (new Set(standardIds).size !== 3 || standardIds.some(id => !/^[A-Za-z0-9._-]+$/.test(id))) {
      throw new Error("The three internal-standard columns must use unique <name>_ng headers.");
    }
    const dataRows = rows.slice(1);
    if (dataRows.length > 500) throw new Error("The tutorial supports up to 500 sample rows.");
    if (dataRows.some(values => values.length !== expected.length)) {
      throw new Error("Every sample row must have the same number of columns as the template.");
    }
    if (dataRows.some(values => values.some(value => /[\t\r\n]/.test(value)))) {
      throw new Error("Sample values cannot contain tabs or line breaks.");
    }

    ["intstd1", "intstd2", "intstd3"].forEach((id, index) => {
      $(`#${id}`).value = standardIds[index];
    });
    $("#sampleBody").innerHTML = dataRows.map(values => {
      const data = Object.fromEntries(SAMPLE_FIELD_KEYS.map((key, index) => [key, values[index]]));
      return sampleRowHTML(data, false);
    }).join("");
    $("#sampleCount").value = String(dataRows.length);
    $("#sampleCsvStatus").textContent = `Loaded ${dataRows.length} sample row${dataRows.length === 1 ? "" : "s"} from ${file.name}.`;
    updateAll();
  } catch (error) {
    $("#sampleCsvStatus").textContent = `Could not load ${file.name}: ${error.message}`;
  } finally {
    event.target.value = "";
  }
}

function standardsToTSV() {
  const headers = ["internal_std_ID","rRNA_copy_number","genome_len_bp","full_16S_sequence"];
  const rows = getStandardsData().map(s => [s.id, s.copies, s.genome, s.seq]);
  return [headers.join("\t"), ...rows.map(r => r.join("\t"))].join("\n");
}

function configToYAML() {
  const useDb = $("#haveDatabases").checked;
  const useInternalStandards = $("#intstdToggle").checked;
  return [
    '# make sure variables below point to the right place / are named appropriately',
    '',
    'samplesheet: "config/samples.tsv"',
    `studyName: "${$("#studyName").value.trim()}"`,
    `use_preexisting_databases: ${useDb}`,
    `database_dir: "${$("#database_dir").value.trim()}"`,
    `rawdatadir: "${$("#rawdatadir").value.trim()}"`,
    `R1file_ending: "${$("#R1file_ending").value.trim()}"`,
    `R2file_ending: "${$("#R2file_ending").value.trim()}"`,
    '',
    `use_internal_standards: ${useInternalStandards}`,
    ...(useInternalStandards ? [
      'intstds:',
      `  intstd1: "${$("#intstd1").value.trim()}"`,
      `  intstd2: "${$("#intstd2").value.trim()}"`,
      `  intstd3: "${$("#intstd3").value.trim()}"`,
      ''
    ] : []),
    'trunclens:',
    `  truncR1: ${$("#truncR1").value.trim()}`,
    `  truncR2: ${$("#truncR2").value.trim()}`,
    '',
    `fwdPrimer: "${$("#fwdPrimer").value.trim()}"`,
    `revPrimer: "${$("#revPrimer").value.trim()}"`,
    `qiime2version: "${$("#qiime2version").value.trim()}"`,
    `SILVAversion: "${SILVA_VERSION}"`
  ].join("\n");
}

function bundledPackageFile(id) {
  return $(`#${id}`).textContent.replace(/^\n/, "").replace(/\n  $/, "\n");
}

async function downloadPackage() {
  if (!buildValidation()) {
    $("#exportStatus").textContent = "Complete the validation items before downloading.";
    return;
  }

  const zip = new JSZip();
  const config = zip.folder("config");
  config.file("config.yml", configToYAML());
  config.file("samples.tsv", sampleTableToTSV());
  config.file("bioanalyzer.tsv", [
    "sample_type\tamount_pM",
    `16S\t${$("#amt16s").value}`,
    `18S\t${$("#amt18s").value}`
  ].join("\n"));
  if ($("#intstdToggle").checked) {
    config.file("internal_stds.tsv", standardsToTSV());
  }
  config.file("README.md", bundledPackageFile("package-readme"));
  config.folder("schemas").file("config.schema.yml", bundledPackageFile("package-config-schema"));
  config.folder("schemas").file("samples.schema.yml", bundledPackageFile("package-samples-schema"));
  config.folder("setup-scripts").file("setup-analysis-dir.sh", bundledPackageFile("package-setup-script"));

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "universal-amplicon-config.zip";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  $("#exportStatus").textContent = "Downloaded universal-amplicon-config.zip with one complete config folder.";
}

function copyCommands() {
  const text = projectCommands(true);
  const fallbackCopy = () => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      $("#exportStatus").textContent = "Terminal commands copied to clipboard.";
    }).catch(() => {
      $("#exportStatus").textContent = fallbackCopy()
        ? "Terminal commands copied to clipboard."
        : "Could not copy terminal commands.";
    });
  } else {
    $("#exportStatus").textContent = fallbackCopy()
      ? "Terminal commands copied to clipboard."
      : "Could not copy terminal commands.";
  }
}

function init() {
  $("#sampleBody").innerHTML = sampleRowHTML();
  $("#sampleCount").value = String($$("#sampleBody tr").length);
  $("#standardsWrap").innerHTML = [0, 1, 2].map(slot => standardRowHTML(slot)).join("");
  setVisible("qiimeBlock", $("#qiimeToggle").checked);
  setVisible("intstdBlock", $("#intstdToggle").checked);
  updateAll();
  bindEvents();
  updateProgress();
  window.addEventListener("scroll", updateProgress);
}

init();
