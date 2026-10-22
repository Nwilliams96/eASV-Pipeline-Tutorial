# Universal Amplicon Website v3

This repository contains the configuration builder for the
[515Y–926R eASV Snakemake pipeline](https://github.com/Nwilliams96/515FY-926R-snakemake-NW-edits).

The published configuration page is available at
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
- The QIIME 2 section warns that existing/downloaded SILVA and PR2 classifiers
  must both be compatible with the selected QIIME 2 and scikit-learn environment.
  `qiime2version` accepts an environment-definition YAML path, not an installed
  Conda environment name; Snakemake creates/reuses its managed rule environment
  from that definition. An environment's name alone does not verify compatibility.
- SILVA and PR2 independently offer three methods: use an existing classifier,
  download a pre-trained classifier, or train from a selected reference release
  with RESCRIPt. Only the chosen method's fields are shown and serialized;
  switching methods preserves the entered values for later use.
- Defaults reuse Nathan's existing SILVA 144 and PR2 5.1.1 classifiers on CARC,
  with their paths pre-filled under the shared database root. Other users must
  replace these paths or select download/training for their system. The bundled
  environment is QIIME 2 2026.7. Reference releases remain editable and
  visible for all methods so reports can record the declared version. Native
  SILVA 144 acquisition is not yet supported by the supplied RESCRIPt environment;
  its training option displays a warning but still permits configuration export.
- Download and training destinations can be selected separately for SILVA and
  PR2. The shared `database_dir` stores BBsplit and supporting files such as the
  SILVA 144 exact-species reference. Existing classifiers are read from the exact
  supplied path without requiring write access beside that file.
- The official SILVA 144 preset follows the primers: 515Y/926R uses its
  region-specific classifier; other primers select its full-length classifier.
  The preset URL and checksum stay synchronized. Custom URLs are never rewritten
  and do not inherit an unrelated preset checksum. Supplied classifiers must be
  compatible with the selected environment and intended analysis.
- Local training extracts the configured primer region by default. Advanced
  users can add `silva_reference_mode: "full_length"` or
  `pr2_reference_mode: "full_length"` to config.yml to skip extraction for that
  database. These settings do not change a downloaded classifier.
- For SILVA 144 the pipeline adds provisional Species labels only for
  unambiguous exact matches to the matching species reference when the matched
  genus agrees with the classifier result. Other SILVA releases skip this step.
- BBsplit retains its separate availability checkbox. It can be built or reused
  independently of either taxonomy classifier.
