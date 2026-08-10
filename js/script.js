const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const PIPELINE_REPOSITORY = "https://github.com/Nwilliams96/515FY-926R-snakemake-NW-edits.git";
const SILVA_VERSION = "138.1";
let lastSuggestedTransferInput = "";
const SAMPLE_PREFIX_HEADERS = [
  "sample", "replicate", "condition", "Depth (m)", "Latitude and Longitude",
  "Longitude [degrees_east]", "Latitude [degrees_north]", "time"
];
const SAMPLE_TAIL_HEADERS = ["internal_std_normalization_factor", "units"];
let extraSampleHeaders = [];
const DEFAULT_INTERNAL_STANDARDS = [
  {
    "id": "BP",
    "copies": "5",
    "genome": "6244976",
    "sequence": "TATCCTGGCTCAGGATGAACGCTGGCGGCGTGCTTAACACATGCAAGTCGAGCGAAGCACTAAGACAGATTTCTTCGGATTGAAGCCTTTGTGACTGAGCGGCGGACGGGTGAGTAACGCGTGGGTAGCCTACCTCATACAGGGGGATAACAGTTAGAAATGACTGCTAATACCGCATAAGCGCACAGGACCGCATGGTCTGGTGTGAAAAACTCCGGTGGTATGAGATGGACCCGCGTCTGATTAGCTAGTTGGAGGGGTAACGGCCCACCAAGGCGACGATCAGTAGCCGGCCTGAGAGGGTGAACGGCCACATTGGGACTGAGACACGGCCCAGACTCCTACGGGAGGCAGCAGTGGGGAATATTGCACAATGGGGGGAACCCTGATGCAGCGACGCCGCGTGAAGGAAGAAGTATCTCGGTATGTAAACTTCTATCAGCAGGGAAGAAAATGACGGTACCTGACTAAGAAGCCCCGGCTAACTACGTGCCAGCAGCCGCGGTAATACGTAGGGGGCAAGCGTTATCCGGATTTACTGGGTGTAAAGGGAGCGTAGACGGAAGAGCAAGTCTGATGTGAAAGGCTGGGGCTTAACCCCAGGACTGCATTGGAAACTGTTGTTCTAGAGTGCCGGAGAGGTAAGCGGAATTCCTAGTGTAGCGGTGAAATGCGTAGATATTAGGAGGAACACCAGTGGCGAAGGCGGCTTACTGGACGGTAACTGACGTTGAGGCTCGAAAGCGTGGGGAGCAAACAGGATTAGATACCCTGGTAGTCCACGCCGTAAACGATGAATACTAGGTGTCGGGTGGCTAAGCCATTCGGTGCCGCAGCAAACGCAATAAGTATTCCACCTGGGGAGTACGTTCGCAAGAATGAAACTCAAAGGAATTGACGGGGACCCGCACAAGCGGTGGAGCATGTGGTTTAATTCGAAGCAACGCGAAGAACCTTACCAAGTCTTGACATCCCTCTGACCGYCCCGTAACGGGGRTTTCCCTTCGGGGCAGAGGAGACAGGTGGTGCATGGTTGTCGTCAGCTCGTGTCGTGAGATGTTGGGTTAAGTCCCGCAACGAGCGCAACCCTTATCCTTAGTAGCCAGCAYATGATGGTGGGCACTCTAGGGAGACTGCCGGGGATAACCCGAGGGAAGGCGGGGACGACGTCAAATCATCATGCCCCTTATGATTTGGGCTACACACGTGCTACAATGGCGTAAACAAAGGGAAGCGAGACAGCGATGTTGAGCGAATCCCAAAAATAACGTCCCAGTTCGGACTGCAGTCTGCAACTCGACTGCACGAAGCTGGAATCGCTAGTAATCGCGGATCAGAATGCCGCGGTGAATACGTTCCCGGGTCTTGTACACACCGCCCGTCACACCATGGGAGTCAGTAACGCCCGAAGTCAGTGACCTAACCGA"
  },
  {
    "id": "DR",
    "copies": "3",
    "genome": "3279485",
    "sequence": "AGGGTGAACGCTGGCGGCGTGCTTAAGACATGCAAGTCGAACGCGGTCTTCGGACCGAGTGGCGCACGGGTGAGTAACACGTAACTGACCTACCCAGAAGTCACGAATAACTGGCCGAAAGGTCCGCTAATACGTGATGTGGTGATGCACCGTGGTGCATCACTAAAGATTTATCGCTTCTGGATGGGGTTGCGTTCCATCAGCTGGTTGGTGGGGTAAAGGCCTACCAAGGCGACGACGGATAGCCGGCCTGAGAGGGTGGCCGGCCACAGGGGCACTGAGACACGGGTCCCACTCCTACGGGAGGCAGCAGTTAGGAATCTTCCACAATGGGCGCAAGCCTGATGGAGCGACGCCGCGTGAGGGATGAAGGTTTTCGGATCGTAAACCTCTGAATCTGGGACGAAAGAGCCTTAGGGCAGATGACGGTACCAGAGTAATAGCACCGGCTAACTCCGTGCCAGCAGCCGCGGTAATACGGAGGGTGCAAGCGTTACCCGGAATCACTGGGCGTAAAGGGCGTGTACGCGGAAATTTAAGTCTGGTTTTAAAGACCGGGGCTCAACCTCGGGGATGGACTGGATACTGGATTTCTTGACCTCTGGAGAGGTAACTGGAATTCCTGGTGTAGCGGTGGAATGCGTAGATACCAGGAGGAACACCAATGGCGAAGGCAAGTTACTGGACAGAAGGTGACGCTGAGGCGCGAAAGTGTGGGGAGCAAACCGGATTAGATACCCGGGTAGTCCACACCCTAAACGATGTACGTTGGCTAAGCGCAGGATGCTGTGCTTGGCGAAGCTAACGCGATAAACGTACCGCCTGGGAAGTACGGCCGCAAGGTTGAAACTCAAAGGAATTGACGGGGGCCCGCACAAGCGGTGGAGCATGTGGTTTAATTCGAAGCAACGCGAAGAACCTTACCAGGTCTTGACATGCTAGGAACTTTGCAGAGATGCAGAGGTGCCCTTCGGGGAACCTAGACACAGGTGCTGCATGGCTGTCGTCAGCTCGTGTCGTGAGATGTTGGGTTAAGTCCCGCAACGAGCGCAACCCTTGCCTTTAGTTGTCAGCATTCAGTTGGACACTCTAGAGGGACTGCCTATGAAAGTAGGAGGAAGGCGGGGATGACGTCTAGTCAGCATGGTCCTTACGTCCTGGGCGACACACGTGCTACAATGGGTAGGACAACGCGCAGCAAACCCGCGAGGGTAAGCGAATCGCTAAAACCTATCCCCAGTTCAGATCGGAGTCTGCAACTCGACTCCGTGAAGTTGGAATCGCTAGTAATCGCGGGTCAGCATACCGCGGTGAATACGTTCCCGGGCCTTGTACACACCGCCCGTCACACCATGGGAGTAGATTGCAGTTGAAACCGCCGGGAGCTTTGCGGCAGGCGTCTAGACTGTGGTTTATGACTGGGGTGAAGTCGTAACAAGGTAACTGTACCGGAAGGTGCGGCTGGA"
  },
  {
    "id": "TT",
    "copies": "2",
    "genome": "2143708",
    "sequence": "TTGTTGGAGAGTTTGATCCTGGCTCAGGGTGAACGCTGGCGGCGTGCCTAAGACATGCAAGTCGTGCGGGCCGCGGGGTTTTACTCCGTGGTCAGCGGCGGACGGGTGAGTAACGCGTGGGTGACCTACCCGGAAGAGGGGGACAACCCGGGGAAACTCGGGCTAATCCCCCATGTGGACCCGCCCCTTGGGGTGTGTCCAAAGGGCTTTGCCCGCTTCCGGATGGGCCCGCGTCCCATCAGCTAGTTGGTGGGGTAATGGCCCACCAAGGCGACGACGGGTAGCCGGTCTGAGAGGATGGCCGGCCACAGGGGCACTGAGACACGGGCCCCACTCCTACGGGAGGCAGCAGTTAGGAATCTTCCGCAATGGGCGCAAGCCTGACGGAGCGACGCCGCTTGGAGGAAGAAGCCCTTCGGGGTGTAAACTCCTGAACCCGGGACGAAACCCCCGACGAGGGGACTGACGGTACCGGGGTAATAGCGCCGGCCAACTCCGTGCCAGCAGCCGCGGTAATACGGAGGGCGCGAGCGTTACCCGGATTCACTGGGCGTAAAGGGCGTGTAGGCGGCCTGGGGCGTCCCATGTGAAAGACCACGGCTCAACCGTGGGGGAGCGTGGGATACGCTCAGGCTAGACGGTGGGAGAGGGTGGTGGAATTCCCGGAGTAGCGGTGAAATGCGCAGATACCGGGAGGAACGCCGATGGCGAAGGCAGCCACCTGGTCCACCCGTGACGCTGAGGCGCGAAAGCGTGGGGAGCAAACCGGATTAGATACCCGGGTAGTCCACGCCCTAAACGATGCGCGCTAGGTCTCTGGGTCTCCTGGGGGCCGAAGCTAACGCGTTAAGCGCGCCGCCTGGGGAGTACGGCCGCAAGGCTGAAACTCAAAGGAATTGACGGGGGCCCGCACAAGCGGTGGAGCATGTGGTTTAATTCGAAGCAACGCGAAGAACCTTACCAGGCCTTGACATGCTAGGGAACCCGGGTGAAAGCCTGGGGTGCCCGCGAGGGAGCCCTAGCACAGGTGCTGCATGGCCGTCGTCAGCTCGTGCCGTGAGGTGTTGGGTTAAGTCCCGCAACGAGCGCAACCCCCGCCGTTAGTTGCCAGCGGTTCGGCCGGGCACTCTAACGGGACTGCCCGCGAAAGCGGGAGGAAGGAGGGGACGACGTCTGGTCAGCATGGCCCTTACGGCCTGGGCGACACACGTGCTACAATGCCCTACAAAGCGATGCCACCCGGCAACGGGGAGCTAATCGCAAAAAGGTGGGCCCAGTTCGGATTGGGGTCTGCAACCCGACCCCATGAAGCCGGAATCGCTAGTAATCGCGGATCAGCCATGCCGCGGTGAATACGTTCCCGGGCCTTGTACACACCGCCCGTCACGCCATGGGAGCGGGCTCTACCCGAAGTCGCCGGGAGCCTACGGGCAGGCGCCGAGGGTAGGGCCCGTGACTGGGGCGAAGTCGTAACAAGGTAGCTGTACCGGAAGGTGCGGCTGGATCACCTCCTTT"
  }
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
    `git clone ${PIPELINE_REPOSITORY} ${projectName}`,
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

function shellArgument(value) {
  if (/^[A-Za-z0-9_~./:@%+=,-]+$/.test(value)) return value;
  return `'${value.replace(/'/g, `'"'"'`)}'`;
}

function projectZipFilename() {
  const projectName = $("#projectName").value.trim() || "my-eASV-project";
  return `${projectName}-config.zip`;
}

function syncProjectPackageNames() {
  const zipFilename = projectZipFilename();
  const suggestedTransferInput = `~/Downloads/${zipFilename}`;
  const transferInput = $("#transferInput");

  if (!lastSuggestedTransferInput || !transferInput.value.trim() || transferInput.value === lastSuggestedTransferInput) {
    transferInput.value = suggestedTransferInput;
  }

  lastSuggestedTransferInput = suggestedTransferInput;
  $("#extractConfigCode").textContent = `unzip ${shellArgument(zipFilename)}\nfind config -type f -exec touch {} +`;
}

function buildConfigUploadPreview() {
  const inputPath = $("#transferInput").value.trim() || `~/Downloads/${projectZipFilename()}`;
  const outputDirectory = $("#transferOutput").value.trim();
  const destination = outputDirectory ? shellArgument(outputDirectory) : "<OUTPUT_DESTINATION>";
  $("#uploadConfigCode").textContent = `scp ${shellArgument(inputPath)} ${destination}`;
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

function sampleCell(value) {
  return `<td><input class="sample-cell" value="${escapeAttribute(value)}"></td>`;
}

function sampleRowHTML(data = {}, useDefaults = true) {
  const defaultPrefix = [
    "AMT29_02", "1", "AMT29-whole-seawater", "2", "6.7321 S 49.0482 E",
    "49.0482", "-6.7321", "2019-10-16T13:20:00"
  ];
  const defaultTail = ["0.66666667", "L"];
  const standardCount = getInternalStandardIds().length;
  const prefix = data.prefix || (useDefaults ? defaultPrefix : Array(8).fill(""));
  const extra = data.extra || Array(extraSampleHeaders.length).fill("");
  const standards = data.standards || (useDefaults ? Array(standardCount).fill("52") : Array(standardCount).fill(""));
  const tail = data.tail || (useDefaults ? defaultTail : Array(2).fill(""));
  return `
    <tr>
      ${prefix.map(sampleCell).join("")}
      ${extra.map(sampleCell).join("")}
      ${Array.from({ length: standardCount }, (_, index) => sampleCell(standards[index] ?? "")).join("")}
      ${tail.map(sampleCell).join("")}
    </tr>`;
}

function standardNameRowHTML(index, name = "") {
  return `
    <div class="standard-name-row">
      <label for="intstd-${index}">Internal standard ${index + 1} name (shown on figures)</label>
      <input id="intstd-${index}" class="internal-standard-name" type="text" value="${escapeAttribute(name)}" data-current-name="${escapeAttribute(name)}" />
    </div>`;
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
        <input type="number" min="1" value="${escapeAttribute(v.copies)}">
      </label>
      <label class="field-label">Genome length in base pairs
        <input type="number" min="1" value="${escapeAttribute(v.genome)}">
      </label>
      <label class="field-label">Full 16S sequence
        <textarea placeholder="Paste the complete nucleotide sequence">${escapeAttribute(v.sequence)}</textarea>
      </label>
    </div>`;
}

function getInternalStandardIds() {
  return $$(".internal-standard-name").map(input => input.value.trim());
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

function captureStandardDefinitions() {
  const ids = getInternalStandardIds();
  return ids.map((id, index) => {
    const row = $$(".standard-row")[index];
    const inputs = row ? $$("input, textarea", row) : [];
    return {
      id,
      copies: inputs[0]?.value.trim() || "",
      genome: inputs[1]?.value.trim() || "",
      sequence: inputs[2]?.value || ""
    };
  });
}

function renderStandardSections(standards) {
  $("#intstdNamesWrap").innerHTML = standards
    .map((standard, index) => standardNameRowHTML(index, standard.id))
    .join("");
  $("#standardsWrap").innerHTML = standards
    .map((standard, index) => standardRowHTML(index, standard))
    .join("");
}

function captureSampleRecords() {
  const standardCount = getInternalStandardIds().length;
  const standardStart = SAMPLE_PREFIX_HEADERS.length + extraSampleHeaders.length;
  return $$("#sampleBody tr").map(row => {
    const values = $$("input", row).map(input => input.value);
    return {
      prefix: values.slice(0, SAMPLE_PREFIX_HEADERS.length),
      extra: values.slice(SAMPLE_PREFIX_HEADERS.length, standardStart),
      standards: values.slice(standardStart, standardStart + standardCount),
      tail: values.slice(standardStart + standardCount)
    };
  });
}

function renderSampleHeader() {
  const standardStart = SAMPLE_PREFIX_HEADERS.length + extraSampleHeaders.length;
  const standardEnd = standardStart + getInternalStandardIds().length;
  $("#sampleHeaderRow").innerHTML = sampleHeaders()
    .map((header, index) => `<th${index >= standardStart && index < standardEnd ? " data-intstd-column" : ""}>${escapeAttribute(header)}</th>`)
    .join("");
}

function applyExtraSampleColumns() {
  const requested = $("#extraSampleColumns").value
    .split(",")
    .map(value => value.trim())
    .filter(Boolean);
  const reserved = new Set([
    ...SAMPLE_PREFIX_HEADERS,
    ...SAMPLE_TAIL_HEADERS,
    ...getInternalStandardIds().map(id => `${id}_ng`)
  ].map(name => name.toLowerCase()));
  const normalizedRequested = requested.map(name => name.toLowerCase());
  const invalid = requested.filter(name =>
    /[\t\r\n,]/.test(name) || reserved.has(name.toLowerCase())
  );
  if (new Set(normalizedRequested).size !== requested.length || invalid.length) {
    $("#extraSampleColumnsStatus").textContent =
      "Column names must be unique and cannot duplicate required columns.";
    return;
  }

  const oldHeaders = [...extraSampleHeaders];
  const records = captureSampleRecords().map(record => ({
    ...record,
    extra: requested.map(header => {
      const oldIndex = oldHeaders.indexOf(header);
      return oldIndex >= 0 ? record.extra[oldIndex] : "";
    })
  }));
  extraSampleHeaders = requested;
  renderSampleHeader();
  renderSampleRecords(records);
  $("#extraSampleColumnsStatus").textContent = requested.length
    ? `Added ${requested.length} metadata column${requested.length === 1 ? "" : "s"}: ${requested.join(", ")}.`
    : "No additional columns configured.";
  updateAll();
}

function renderSampleRecords(records) {
  $("#sampleBody").innerHTML = records.map(record => sampleRowHTML(record, false)).join("");
  $("#sampleCount").value = String(records.length);
}

function changeInternalStandardCount(delta) {
  const records = captureSampleRecords();
  const standards = captureStandardDefinitions();
  if (delta < 0 && standards.length <= 1) return;
  if (delta > 0) {
    standards.push({
      id: `ISD_${standards.length + 1}`,
      copies: "",
      genome: "",
      sequence: ""
    });
    records.forEach(record => record.standards.push(""));
  } else {
    standards.pop();
    records.forEach(record => record.standards.pop());
  }
  renderStandardSections(standards);
  renderSampleHeader();
  renderSampleRecords(records);
  updateAll();
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

function dada2ConfigLines() {
  return [
    `dada2:`,
    `  prokaryotes:`,
    `    max_ee_f: ${$("#prokMaxEeF").value.trim()}`,
    `    max_ee_r: ${$("#prokMaxEeR").value.trim()}`,
    `    trunc_q: ${$("#prokTruncQ").value.trim()}`,
    `    min_overlap: ${$("#prokMinOverlap").value.trim()}`,
    `    pooling_method: "${$("#prokPooling").value}"`,
    `    chimera_method: "${$("#prokChimera").value}"`,
    `    min_fold_parent_over_abundance: ${$("#prokMinFold").value.trim()}`,
    `    n_reads_learn: ${$("#prokNReadsLearn").value.trim()}`,
    `  eukaryotes:`,
    `    max_ee: ${$("#eukMaxEe").value.trim()}`,
    `    trunc_q: ${$("#eukTruncQ").value.trim()}`,
    `    pooling_method: "${$("#eukPooling").value}"`,
    `    chimera_method: "${$("#eukChimera").value}"`,
    `    min_fold_parent_over_abundance: ${$("#eukMinFold").value.trim()}`,
    `    n_reads_learn: ${$("#eukNReadsLearn").value.trim()}`
  ];
}

function validDada2Settings() {
  const numberAtLeast = (id, minimum) => {
    const value = Number($(id).value);
    return Number.isFinite(value) && value >= minimum;
  };
  const integerAtLeast = (id, minimum) =>
    numberAtLeast(id, minimum) && Number.isInteger(Number($(id).value));

  return numberAtLeast("#prokMaxEeF", 0)
    && numberAtLeast("#prokMaxEeR", 0)
    && integerAtLeast("#prokTruncQ", 0)
    && integerAtLeast("#prokMinOverlap", 4)
    && numberAtLeast("#prokMinFold", 1)
    && integerAtLeast("#prokNReadsLearn", 1)
    && numberAtLeast("#eukMaxEe", 0)
    && integerAtLeast("#eukTruncQ", 0)
    && numberAtLeast("#eukMinFold", 1)
    && integerAtLeast("#eukNReadsLearn", 1)
    && integerAtLeast("#truncR1", 0)
    && integerAtLeast("#truncR2", 0);
}

function buildConfigPreview() {
  const studyName = $("#studyName").value.trim();
  const useDb = $("#haveDatabases").checked;
  const useInternalStandards = $("#intstdToggle").checked;
  const dbDir = $("#database_dir").value.trim();
  const rawdatadir = $("#rawdatadir").value.trim();
  const R1file_ending = $("#R1file_ending").value.trim();
  const R2file_ending = $("#R2file_ending").value.trim();
  const internalStandardIds = getInternalStandardIds();
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
    internalStandardIds.forEach(id => parts.push(`  - "${id}"`));
    parts.push(``);
  }
  parts.push(`trunclens:`);
  parts.push(`  truncR1: ${truncR1}`);
  parts.push(`  truncR2: ${truncR2}`);
  parts.push(``);
  parts.push(...dada2ConfigLines());
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
  const standardsReady = standards.length >= 1
    && new Set(ids).size === ids.length
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
    { label: "DADA2 settings are valid", ok: validDada2Settings() },
    { label: "Sample table present", ok: $$("#sampleBody tr").length > 0 },
    { label: "All configured internal standards are complete", ok: !$("#intstdToggle").checked || standardsReady }
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
  $$('[data-remove-standard]').forEach(button => {
    button.disabled = ids.length <= 1;
  });
  buildClonePreview();
  syncProjectPackageNames();
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
    const enabled = $("#intstdToggle").checked;
    setVisible("intstdBlock", enabled);
    setVisible("standards", enabled);
    setVisible("standardsNavLink", enabled);
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
  $("#applyExtraSampleColumnsBtn").addEventListener("click", applyExtraSampleColumns);
  $$('[data-add-standard]').forEach(button => {
    button.addEventListener("click", () => changeInternalStandardCount(1));
  });
  $$('[data-remove-standard]').forEach(button => {
    button.addEventListener("click", () => changeInternalStandardCount(-1));
  });

  document.body.addEventListener("input", (e) => {
    if (e.target.matches("input, textarea")) {
      if (e.target.matches(".internal-standard-name")) {
        const previousName = e.target.dataset.currentName || "";
        if (e.target.value !== previousName) {
          const index = $$(".internal-standard-name").indexOf(e.target);
          const definition = $$(".standard-row")[index];
          const preset = DEFAULT_INTERNAL_STANDARDS.find(item => item.id === previousName);
          if (definition && preset) {
            const presetValues = [preset.copies, preset.genome, preset.sequence];
            $$("input, textarea", definition).forEach((field, fieldIndex) => {
              const fieldValue = field.tagName === "TEXTAREA"
                ? field.value.replace(/\s+/g, "").toUpperCase()
                : field.value.trim();
              if (fieldValue === presetValues[fieldIndex]) {
                field.value = "";
                field.classList.remove("prefilled");
              }
            });
          }
          e.target.dataset.currentName = e.target.value;
        }
      }
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

  document.body.addEventListener("change", (e) => {
    if (e.target.matches("select")) updateAll();
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
  return [...SAMPLE_PREFIX_HEADERS, ...extraSampleHeaders, ...standardHeaders, ...SAMPLE_TAIL_HEADERS];
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
  const requiredStandards = $("#intstdToggle").checked
    ? getInternalStandardIds().map(id => `${id}_ng`)
    : [];
  const requiredText = ["sample", ...requiredStandards].join(", ");
  $("#sampleCsvStatus").textContent = `Downloaded samples-template.csv. Only these columns are required when you upload it again: ${requiredText}.`;
}

async function uploadSampleCsv(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const rows = parseCSV(await file.text());
    if (rows.length < 2) throw new Error("The CSV needs a header and at least one sample row.");
    const headers = rows[0].map((value, index) => index === 0 ? value.replace(/^\uFEFF/, "").trim() : value.trim());
    if (headers.some(header => !header)) {
      throw new Error("Every CSV column needs a non-empty header.");
    }
    if (new Set(headers.map(header => header.toLowerCase())).size !== headers.length) {
      throw new Error("CSV column names must be unique (ignoring capitalization).");
    }
    if (!headers.includes("sample")) {
      throw new Error('The CSV must contain an exact lowercase "sample" column.');
    }

    const standardHeaders = $("#intstdToggle").checked
      ? getInternalStandardIds().map(id => `${id}_ng`)
      : [];
    const missingRequiredHeaders = standardHeaders.filter(header => !headers.includes(header));
    if (missingRequiredHeaders.length) {
      throw new Error(
        `The CSV is missing required internal-standard column${missingRequiredHeaders.length === 1 ? "" : "s"}: ${missingRequiredHeaders.join(", ")}.`
      );
    }
    const recognizedHeaders = new Set([
      ...SAMPLE_PREFIX_HEADERS, ...SAMPLE_TAIL_HEADERS, ...standardHeaders
    ]);
    const uploadedExtraHeaders = headers.filter(header => !recognizedHeaders.has(header));
    const dataRows = rows.slice(1);
    if (dataRows.length > 500) throw new Error("The tutorial supports up to 500 sample rows.");
    if (dataRows.some(values => values.length !== headers.length)) {
      throw new Error("Every sample row must have the same number of columns as the template.");
    }
    if (dataRows.some(values => values.some(value => /[\t\r\n]/.test(value)))) {
      throw new Error("Sample values cannot contain tabs or line breaks.");
    }
    const columnIndexes = new Map(headers.map((header, index) => [header, index]));
    const valueFor = (values, header) => {
      const index = columnIndexes.get(header);
      return index === undefined ? "" : values[index];
    };
    if (dataRows.some(values => !valueFor(values, "sample").trim())) {
      throw new Error("Every CSV row must have a sample value.");
    }

    extraSampleHeaders = uploadedExtraHeaders;
    $("#extraSampleColumns").value = extraSampleHeaders.join(", ");
    renderSampleHeader();
    renderSampleRecords(dataRows.map(values => ({
      prefix: SAMPLE_PREFIX_HEADERS.map(header => valueFor(values, header)),
      extra: extraSampleHeaders.map(header => valueFor(values, header)),
      standards: standardHeaders.map(header => valueFor(values, header)),
      tail: SAMPLE_TAIL_HEADERS.map(header => valueFor(values, header))
    })));
    $("#extraSampleColumnsStatus").textContent = extraSampleHeaders.length
      ? `Loaded ${extraSampleHeaders.length} additional metadata column${extraSampleHeaders.length === 1 ? "" : "s"}.`
      : "No additional columns configured.";
    $("#sampleCsvStatus").textContent = `Loaded ${dataRows.length} sample row${dataRows.length === 1 ? "" : "s"} from ${file.name}. Optional missing columns were left blank.`;
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
  const internalStandardIds = getInternalStandardIds();
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
      ...internalStandardIds.map(id => `  - "${id}"`),
      ''
    ] : []),
    'trunclens:',
    `  truncR1: ${$("#truncR1").value.trim()}`,
    `  truncR2: ${$("#truncR2").value.trim()}`,
    '',
    ...dada2ConfigLines(),
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
  config.file("prok_and_euk_SSU_amplicon_concentrations.tsv", [
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
  const zipFilename = projectZipFilename();
  a.download = zipFilename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  $("#exportStatus").textContent = `Downloaded ${zipFilename} with one complete config folder.`;
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
  renderStandardSections(DEFAULT_INTERNAL_STANDARDS);
  renderSampleHeader();
  $("#sampleBody").innerHTML = sampleRowHTML();
  $("#sampleCount").value = String($$("#sampleBody tr").length);
  setVisible("qiimeBlock", $("#qiimeToggle").checked);
  const internalStandardsEnabled = $("#intstdToggle").checked;
  setVisible("intstdBlock", internalStandardsEnabled);
  setVisible("standards", internalStandardsEnabled);
  setVisible("standardsNavLink", internalStandardsEnabled);
  updateAll();
  bindEvents();
  updateProgress();
  window.addEventListener("scroll", updateProgress);
}

init();
