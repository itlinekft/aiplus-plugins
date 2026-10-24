---
name: office-gridcraft
description: Headless spreadsheets with GridCraft (XLSX/CSV workbooks, 500+ formula functions, evaluation, recalculation, charts, PDF export), provisioned on demand by aiplus-office — reads and writes Excel (XLSX) files. Use for "build a price list with formulas", "add a VAT column", "convert this xlsx to csv", "what does this formula give", "change a cell and recalculate", "export the sheet to pdf", and Hungarian jobs - árlista, táblázat, ÁFA számítás, jelenléti ív, költségvetés, kimutatás.
---

# office-gridcraft — headless spreadsheets

GridCraft is ArtCraft's spreadsheet app (346 commands in 0.11.1). `aiplus-office` provisions the headless
`gridcraft-cli` on first use (no desktop app). App choice, the loop, the alpha caveat and the MCP policy live in
`office-router`; a workbook that ends as a chart on a slide is the `office-data-visual` workflow.

Every shell call starts with the command line from `office-router`:

```bash
command -v aiplus-office >/dev/null || aiplus-office() { node "${CLAUDE_PLUGIN_ROOT}/dist/aiplus-office.mjs" "$@"; }
```

## What it is for / formats

Create and edit workbooks (cells, formulas, formats, tables, charts, sheets), evaluate formulas, recalculate, convert,
export. Open: `xlsx xlsm xls xlsb ods csv tsv txt json`. Write (`convert`, `run --out`): `xlsx csv tsv json html`, and
**`pdf` only from `run`** (`--out x.pdf`; `convert` rejects `.pdf`). The native file is the `.xlsx`. No VBA macros.

## CLI dialect

`aiplus-office gridcraft exec <args…>` passes the arguments to `gridcraft-cli`.

```bash
gridcraft-cli commands [--json] [--search X]          # table by default; --search filters id/label; NO --filter
gridcraft-cli run [--in FILE | --sample NAME] [--cmd 'id={json}']... [--script FILE.jsonl] [--out FILE] [--print RANGE] [--quiet]
gridcraft-cli eval <formula> [--in FILE] [--sheet S] [--cell A1] [--json]
gridcraft-cli cat <file> [--range A1:D20] [--sheet S] [--formulas] [--csv]
gridcraft-cli convert <in> <out> [--sheet NAME]       # xlsx/csv/tsv/json/html by extension
gridcraft-cli info <file> [--json]                    # sheets, used ranges, tables, charts, names
gridcraft-cli check <file-or-dir>... [--json]         # recalculation oracle + xlsx round trip; exit 1 on any difference
gridcraft-cli functions [--search X] [--category C]   # formula function catalogue with signatures
```

- There is **no `describe`**; parameters are the second line of each `commands` row.
- `run` takes repeated `--cmd 'id={json}'` (single-quoted). All commands run in order on one in-memory workbook.
  `--in FILE` opens a file, `--sample budget|sales|grades` a demo workbook, neither = blank.
- Typing model: `cell.set {cell,input}` (an input starting `=` is a formula), `range.setValues {range,values:[[…]]}`
  (strings starting `=` are formulas, `null` = empty), `cell.get` one cell.
- Formats: `home.numberFormat {range, code}` (e.g. `"# ##0 \"Ft\""`), `home.bold {range, on}`,
  `home.autofitColumnWidth {cols}`; paper size `pageLayout.size {paper: "A4"}` before a PDF export.

## State between invocations

None. A `run` edits an in-memory workbook that is lost at exit unless `--out FILE` writes it. `--in F` never writes
back; use `--out F` to overwrite. Chain steps through files.

## Discovery first

```bash
aiplus-office gridcraft exec commands --search numberFormat      # ids + one-line param schema
aiplus-office gridcraft exec functions --search round            # exact function signature before writing a formula
aiplus-office gridcraft exec info arlista.xlsx                   # sheets, used range, tables, charts
```

Id families: `file.*`, `cell.*`/`range.*` (data), `sheet.*`, `home.*` (formats, rows/columns), `formulas.*`, `data.*`
(sort/filter/validation), `insert.*` (tables, charts), `table.*`, `chart.*`, `pageLayout.*`, `review.*`.

## Traps

- **Formulas use the English convention, whatever the user's Excel shows**: English function names (`SUM`, not
  `SZUM` → `#NAME?`), a **dot** as decimal separator (`=B2*0.27`; `0,27` is a syntax error) and a **comma** between
  arguments (`=ROUND(B2*0.27,0)`; `;` is an error). Hungarian CSV files with `;` separators open fine.
- **Formula errors print as values with exit 0** (`#NAME?`, `#DIV/0!`): read the result back (`cat`, `eval --json`
  gives `{"error":"…"}`) before trusting a total.
- **One failing `--cmd` aborts the run, exit 1, nothing written.**
- `commands --filter` is "unknown option"; the filter is `--search`.
- `convert x.xlsx x.pdf` → "unknown output format"; PDF comes from `run --in x.xlsx --out x.pdf`.
- **Columns keep their default width**: in the PDF a long name is cut and a date that does not fit prints as `#####`.
  Run `home.autofitColumnWidth {"cols":"A:F"}` before every PDF export.
- The default paper is US Letter: set `pageLayout.size {"paper":"A4"}` for a Hungarian printout.
- `convert` to csv writes the active sheet only; pass `--sheet NAME` for another.
- 27% VAT on each line and on the total can differ by rounding: decide with the user whether lines are rounded
  (`=ROUND(B2*0.27,0)`) and keep one rule in the whole sheet.

## MCP route (not registered)

GridCraft's MCP server advertises **no path confinement** (it can read and write any file the user can), so the plugin
does not register it and `aiplus-office gridcraft mcp` refuses without `--allow-unconfined`. Use the bash route in the
project folder. GUI bridging (`--connect`) is out of scope.

## Recipes

```bash recipe: afa-tabla-pdf
# Net prices, a 27% VAT column and gross totals with formulas; recalculation checked; A4 PDF.
aiplus-office gridcraft exec run --quiet \
  --cmd 'range.setValues={"range":"A1","values":[["Termék","Nettó (Ft)","ÁFA 27% (Ft)","Bruttó (Ft)"],["Toner",12000,"=B2*0.27","=B2+C2"],["Papír",3500,"=B3*0.27","=B3+C3"],["Összesen","=SUM(B2:B3)","=SUM(C2:C3)","=SUM(D2:D3)"]]}' \
  --cmd 'pageLayout.size={"paper":"A4"}' --out afa.xlsx
aiplus-office gridcraft exec cat afa.xlsx --formulas
aiplus-office gridcraft exec check afa.xlsx
aiplus-office gridcraft exec run --in afa.xlsx --out afa.pdf
aiplus-office verify afa.pdf --pages 1 --text-contains "Összesen" --text-contains "19685"
```

```bash recipe: eval-and-csv
# Evaluate a formula against a workbook, then convert xlsx <-> csv and re-export.
aiplus-office gridcraft exec run --quiet --cmd 'range.setValues={"range":"A1","values":[["n","negyzet"],[2,"=A2^2"],[3,"=A3^2"]]}' --out sq.xlsx
aiplus-office gridcraft exec eval '=SUM(B2:B3)' --in sq.xlsx --json
aiplus-office gridcraft exec convert sq.xlsx sq.csv
aiplus-office gridcraft exec convert sq.csv again.xlsx
aiplus-office gridcraft exec run --in again.xlsx --out again.pdf
aiplus-office verify again.pdf --pages 1 --text-contains "negyzet"
```

```bash recipe: recalc-after-edit
# Open a workbook, change an input with cell.set, the formulas recalculate; print and export the new totals.
aiplus-office gridcraft exec run --quiet --cmd 'range.setValues={"range":"A1","values":[["Mennyiség","Egységár","Összesen"],[3,2500,"=A2*B2"]]}' --out alap.xlsx
aiplus-office gridcraft exec run --in alap.xlsx --quiet --cmd 'cell.set={"cell":"A2","input":"10"}' --print A1:C2 --out modositott.xlsx
aiplus-office gridcraft exec eval '=C2' --in modositott.xlsx
aiplus-office gridcraft exec run --in modositott.xlsx --out modositott.pdf
aiplus-office verify modositott.pdf --pages 1 --text-contains "25000"
```

```bash recipe: jelenleti-csv
# A semicolon CSV (as Hungarian Excel writes it) -> xlsx with a worked-hours formula -> pdf.
printf 'Név;Dátum;Érkezés;Távozás\nMinta Péter;2026-10-26;08:00;16:30\n' > jelenleti.csv
aiplus-office gridcraft exec convert jelenleti.csv jelenleti.xlsx
aiplus-office gridcraft exec run --in jelenleti.xlsx --quiet \
  --cmd 'cell.set={"cell":"E1","input":"Óra"}' --cmd 'cell.set={"cell":"E2","input":"=(D2-C2)*24"}' \
  --cmd 'home.autofitColumnWidth={"cols":"A:E"}' --print A1:E2 --out jelenleti.xlsx
aiplus-office gridcraft exec run --in jelenleti.xlsx --out jelenleti.pdf
aiplus-office verify jelenleti.pdf --pages 1 --text-contains "Minta Péter" --text-contains "8.5"
```
