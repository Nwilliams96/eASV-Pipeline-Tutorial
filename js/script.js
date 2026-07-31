const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

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
    BP_ng: "52",
    DR_ng: "52",
    TT_ng: "52",
    norm: "0.66666667",
    units: "L"
  };
  const empty = Object.fromEntries(Object.keys(defaults).map(key => [key, ""]));
  const v = { ...(useDefaults ? defaults : empty), ...data };
  return `
    <tr>
      <td><input class="sample-cell" value="${v.sample}"></td>
      <td><input class="sample-cell" value="${v.replicate}"></td>
      <td><input class="sample-cell" value="${v.condition}"></td>
      <td><input class="sample-cell" value="${v.depth}"></td>
      <td><input class="sample-cell" value="${v.latlon}"></td>
      <td><input class="sample-cell" value="${v.lon}"></td>
      <td><input class="sample-cell" value="${v.lat}"></td>
      <td><input class="sample-cell" value="${v.time}"></td>
      <td><input class="sample-cell" value="${v.BP_ng}"></td>
      <td><input class="sample-cell" value="${v.DR_ng}"></td>
      <td><input class="sample-cell" value="${v.TT_ng}"></td>
      <td><input class="sample-cell" value="${v.norm}"></td>
      <td><input class="sample-cell" value="${v.units}"></td>
    </tr>`;
}

function standardRowHTML(data = {}) {
  const defaults = {
    id: "BP",
    copies: "5",
    genome: "6244976",
    sequence: "TATCCTGGCTCAGGATGAACGCTGGCGGCGTGCTTAACACATGCAAGTCGAGCGAAGCACTAAG..."
  };
  const v = { ...defaults, ...data };
  return `
    <div class="standard-row">
      <label class="field-label">Internal Standard ID
        <input value="${v.id}">
      </label>
      <label class="field-label">rRNA copy number
        <input value="${v.copies}">
      </label>
      <label class="field-label">Genome length in base pairs
        <input value="${v.genome}">
      </label>
      <label class="field-label">Full 16S sequence
        <textarea>${v.sequence}</textarea>
      </label>
      <div>
        <button class="secondary remove-standard" type="button">Remove</button>
      </div>
    </div>`;
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
  const SILVAversion = $("#SILVAversion").value.trim();

  const parts = [];
  parts.push(`# make sure variables below point to the right place / are named appropriately`);
  parts.push(``);
  parts.push(`samplesheet: "config/samples.tsv"`);
  parts.push(`studyName: "${studyName}"`);
  if (useDb) parts.push(`database_dir: "${dbDir}"`);
  parts.push(`rawdatadir: "${rawdatadir}"`);
  parts.push(`R1file_ending: "${R1file_ending}"`);
  parts.push(`R2file_ending: "${R2file_ending}"`);
  parts.push(``);
  parts.push(`intstds:`);
  parts.push(`  intstd1: "${intstd1}"`);
  parts.push(`  intstd2: "${intstd2}"`);
  parts.push(`  intstd3: "${intstd3}"`);
  parts.push(``);
  parts.push(`trunclens:`);
  parts.push(`  truncR1: ${truncR1}`);
  parts.push(`  truncR2: ${truncR2}`);
  parts.push(``);
  parts.push(`fwdPrimer: "${fwdPrimer}"`);
  parts.push(`revPrimer: "${revPrimer}"`);
  if ($("#qiimeToggle").checked) {
    parts.push(`qiime2version: "${qiime2version}"`);
  }
  parts.push(`SILVAversion: "${SILVAversion}"`);
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
  const standards = $$(".standard-row").map(row => {
    const inputs = $$("input, textarea", row);
    return {
      id: inputs[0].value,
      copies: inputs[1].value,
      genome: inputs[2].value,
      seq: inputs[3].value
    };
  });

  const lines = ["standard_id\trRNA_copy_number\tgenome_length_bp\tfull_16S_sequence"];
  standards.forEach(s => lines.push(`${s.id}\t${s.copies}\t${s.genome}\t${s.seq}`));
  $("#standardsPreview").textContent = lines.join("\n");
}

function buildValidation() {
  const checks = [
    { label: "Study name entered", ok: $("#studyName").value.trim().length > 0 },
    { label: "Raw data location entered", ok: $("#rawdatadir").value.trim().length > 0 },
    { label: "Forward primer entered", ok: $("#fwdPrimer").value.trim().length > 0 },
    { label: "Reverse primer entered", ok: $("#revPrimer").value.trim().length > 0 },
    { label: "Sample table present", ok: $$("#sampleBody tr").length > 0 },
    { label: "Internal standards section ready", ok: !$("#intstdToggle").checked || $("#intstd1").value.trim().length > 0 },
    { label: "Ready to download", ok: true }
  ];
  $("#validationList").innerHTML = checks.map(check => `<li class="${check.ok ? "ok" : "bad"}">${check.ok ? "✓" : "•"} ${check.label}</li>`).join("");
}

function attachStandardRemoveHandlers() {
  $$(".remove-standard").forEach(btn => {
    btn.onclick = () => {
      const rows = $$(".standard-row");
      if (rows.length > 1) {
        btn.closest(".standard-row").remove();
        buildStandardsPreview();
        buildValidation();
      }
    };
  });
}

function updateAll() {
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
    setVisible("dbBlock", $("#haveDatabases").checked);
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

  $("#addStandardBtn").addEventListener("click", () => {
    $("#standardsWrap").insertAdjacentHTML("beforeend", standardRowHTML());
    attachStandardRemoveHandlers();
    markPrefilled();
    buildStandardsPreview();
    buildValidation();
  });

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

function sampleTableToTSV() {
  const headers = [
    "sample","replicate","condition","Depth (m)","Latitude and Longitude","Longitude [degrees_east]",
    "Latitude [degrees_north]","time","BP_ng","DR_ng","TT_ng","internal_std_normalization_factor","units"
  ];
  const rows = $$("#sampleBody tr").map(tr => $$("#sampleBody input", tr).map(i => i.value));
  return [headers.join("\t"), ...rows.map(r => r.join("\t"))].join("\n");
}

function standardsToTSV() {
  const headers = ["standard_id","rRNA_copy_number","genome_length_bp","full_16S_sequence"];
  const rows = $$(".standard-row").map(row => {
    const inputs = $$("input, textarea", row);
    return [inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].value];
  });
  return [headers.join("\t"), ...rows.map(r => r.join("\t"))].join("\n");
}

function configToYAML() {
  const useDb = $("#haveDatabases").checked;
  return [
    '# make sure variables below point to the right place / are named appropriately',
    '',
    'samplesheet: "config/samples.tsv"',
    `studyName: "${$("#studyName").value.trim()}"`,
    ...(useDb ? [`database_dir: "${$("#database_dir").value.trim()}"`] : []),
    `rawdatadir: "${$("#rawdatadir").value.trim()}"`,
    `R1file_ending: "${$("#R1file_ending").value.trim()}"`,
    `R2file_ending: "${$("#R2file_ending").value.trim()}"`,
    '',
    'intstds:',
    `  intstd1: "${$("#intstd1").value.trim()}"`,
    `  intstd2: "${$("#intstd2").value.trim()}"`,
    `  intstd3: "${$("#intstd3").value.trim()}"`,
    '',
    'trunclens:',
    `  truncR1: ${$("#truncR1").value.trim()}`,
    `  truncR2: ${$("#truncR2").value.trim()}`,
    '',
    `fwdPrimer: "${$("#fwdPrimer").value.trim()}"`,
    `revPrimer: "${$("#revPrimer").value.trim()}"`,
    ...( $("#qiimeToggle").checked ? [`qiime2version: "${$("#qiime2version").value.trim()}"`] : [] ),
    `SILVAversion: "${$("#SILVAversion").value.trim()}"`
  ].join("\n");
}

async function downloadPackage() {
  const zip = new JSZip();
  const config = zip.folder("config");
  config.file("config.yaml", configToYAML());
  config.file("samples.tsv", sampleTableToTSV());
  config.file("prok_and_euk_SSU_amplicon_concentrations.tsv", [
    "sample_type\tamount_pM",
    `16S\t${$("#amt16s").value}`,
    `18S\t${$("#amt18s").value}`
  ].join("\n"));
  config.file("internal_standards.tsv", standardsToTSV());

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "universal-amplicon-config.zip";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  $("#exportStatus").textContent = "Downloaded universal-amplicon-config.zip.";
}

function copyCommands() {
  const text = `git clone https://github.com/jcmcnch/eASV-pipeline-for-515Y-926R.git
cd eASV-pipeline-for-515Y-926R/snakemake
snakemake --cores 32`;
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
  $("#standardsWrap").innerHTML = standardRowHTML();
  attachStandardRemoveHandlers();
  setVisible("dbBlock", $("#haveDatabases").checked);
  setVisible("qiimeBlock", $("#qiimeToggle").checked);
  setVisible("intstdBlock", $("#intstdToggle").checked);
  updateAll();
  bindEvents();
  updateProgress();
  window.addEventListener("scroll", updateProgress);
}

init();
