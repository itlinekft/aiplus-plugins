# Changelog

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
