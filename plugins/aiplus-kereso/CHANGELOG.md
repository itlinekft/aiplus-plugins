# Changelog

## 0.1.3 — 2026-11-02

- README and the start skill: if the search tools are still missing after one restart, restart Claude Desktop once
  more — at launch Desktop starts the plugin's program from the copy it has, and downloads a new or newer copy a
  second later (measured on the Windows test PC with the 0.1.1 → 0.1.2 update, 2026-11-02).

## 0.1.2 — 2026-11-02

Found by the first test through Claude Desktop's plugin UI (Windows 11 test PC, 2026-11-02).

- A search, read or link call made during a folder's **first** index build waits for the build (up to 45 s) and then
  answers with the progress and an estimate, not with an error. Before, three error answers in the first 16 s made
  Claude give up the tool for the whole question and open the files one by one.
- `kereso_kapcsolodo` takes a document number with a slash (a customer's own order number such as „ABC-26/622”) as a
  number; before, the slash made it look like a file path.
- README and the start skill: after installing in Claude Desktop, quit Claude completely and start it again (the
  module's program starts at launch); where the index lives with Claude Desktop from the Microsoft Store; the measured
  Windows indexing time.

## 0.1.1 — 2026-11-02

- Launcher: a tool call made while the first-start runtime download runs (Node.js older than 22.19) is held up to
  50 s and answered by the real server once it is ready, instead of a „try again” — so the first „set the folder”
  call is not lost. Measured on a Windows 11 test PC with Node 22.11, 2026-11-01.
- Windows: hit paths are shown with „/”, and the subfolder filter (`mappa`) works (the engine stores backslash
  paths there; caught by the Windows CI run).

## 0.1.0 — 2026-11-02

First release: the base plugin.

- Local stdio MCP server over the pinned kb search engine 0.11.0 (MIT, unmodified), six tools:
  `kereso_kereses` (ranked, date range, folder, newest first), `kereso_dokumentum` (whole / outline / section),
  `kereso_kapcsolodo` (shared document numbers, two hops), `kereso_mappa`, `kereso_allapot`, `kereso_frissites`.
- Office intake to a Markdown cache outside the archive: PDF text layer (pdf.js), DOCX (headings, tables), XLSX (every
  sheet; big sheets in 20-row blocks with their header: row-level hits), EML (headers, MIME, encodings).
- Hungarian: accent folding (engine), query widening with suffix-stripped stems present in the index, document stems
  as a searchable meta chunk, Hungarian dates to ISO.
- Launcher: runs on any Node ≥ 16 on PATH; supplies the official Node.js 24.21.0 (SHA-256 pinned) when the PC's Node
  lacks `node:sqlite` with FTS5.
- Skills `kereso` (search first, cite the file, signed beats draft, newest mail decides) and `kereso-start`.
