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
- Internal standards can be added or removed; the generated config, sample
  columns, and internal-standard table stay synchronized.
- Renaming a preset internal standard clears its preset definition to prevent a
  BP, DR, or TT sequence from being assigned to a different name accidentally.
- Users can add arbitrary sample metadata columns. They are exported to
  `samples.tsv` and become filters in the pipeline's HTML taxonomy report.
- The generated concentration file is named
  `prok_and_euk_SSU_amplicon_concentrations.tsv`.
