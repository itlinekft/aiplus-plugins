# Changelog

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
