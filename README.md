# Universal Amplicon Website v3

This repository contains the tutorial and configuration builder for the
[515Y–926R eASV Snakemake pipeline](https://github.com/Nwilliams96/515FY-926R-snakemake-NW-edits).

The published tutorial is available at
[www.nathanlrwilliams.com/eASV-Pipeline-Tutorial](https://www.nathanlrwilliams.com/eASV-Pipeline-Tutorial/).

## Files
- `index.html`
- `css/style.css`
- `js/script.js`
- `js/jszip.min.js`

## Notes
- Prefilled fields are styled in light grey.
- Copy buttons should work in modern browsers and also have a fallback.
- The download button creates a ZIP file in the browser.
- The project name is entered once and is reused for the cloned directory,
  `projectName`, `studyName`, configuration ZIP, Results-Export folder, and
  report filename.
- Internal standards can be added or removed; the generated config, sample
  columns, and internal-standard table stay synchronized.
- Renaming a preset internal standard clears its preset definition to prevent a
  BP, DR, or TT sequence from being assigned to a different name accidentally.
- Internal-standard correction is off by default, with a prominent warning that
  it must only be enabled when genomic standards were physically added to samples.
- Users can add arbitrary sample metadata columns. They are exported to
  `samples.tsv` and become filters in the pipeline's HTML taxonomy report.
- TSV uploads require only the exact `sample` header and the configured
  `<standard-name>_ng` headers when internal standards are enabled. Other
  columns may be omitted, reordered, renamed, or replaced; omitted optional
  fields are imported as blank cells.
- The generated molarity file is named
  `prok_and_euk_SSU_amplicon_molarities.tsv`.
- Generated configs include a shared `conda_envs_dir` outside the analysis
  clone, allowing Snakemake to reuse unchanged rule environments across projects.
- Primer sequences and the QIIME 2 environment are presented as their own
  labelled configuration sections so these required settings are easy to find.
