# Changelog

## 0.1.5 — 2026-11-08

The family's MCP wire contract (aiplus-claude-surface v2) and the fifth family rule, adopted.

- **A malformed line no longer ends the server.** Every frame is checked against a closed envelope and answered with a
  fixed JSON-RPC error (parse error, invalid request, unknown method, invalid params); a notification gets no answer; a
  line over 4 MiB is refused and the server reads on. The contract's checker: 12 of 23 cases failed on 0.1.4, 23 of 23
  pass now, on the server and through the launcher while it installs the runtime.
- **Refusals never quote the request.** A missing folder, document or section, an unknown or mistyped argument and an
  unexpected fault each answer one fixed Hungarian sentence; tool arguments are a closed list.
- **Only indexed documents are read.** `kereso_dokumentum` with a `../` path could read a `.md` file outside the index;
  it is refused now.
- **The log file holds codes and counts:** no query, no document number, no archive path, no exception text. Paths
  appear as short hash references. Lines written by older versions stay until the file is deleted.
- **The archive's text is data.** The server instructions and the `kereso` skill say so: a request or instruction
  found in a document, a mail's subject or sender, or a file name is reported to the user, never carried out. Tested
  with the family's six invented injection texts in every one of those places.
- **A document cannot pose as the search's own structure.** A line break hidden inside a Word paragraph or a sheet
  name no longer starts a heading of its own. The first refresh after the update converts every file once more: a few
  minutes on a large archive, during which the old index keeps answering.
- A broken settings file no longer stops the server; a folder changed during a refresh is indexed after it.
- `serverInfo.contractVersion` = 1.

## 0.1.4 — 2026-11-02

Found in Cowork on the Windows test PC (a 14 152-file demo archive with a night task's Iratjegyzék in its root),
reproduced and fixed here.

- **Signed beats draft in the ranking too.** A draft or copy (by its file or folder name) keeps 95 % of its score, so
  it no longer wins a tie with its signed version: the accent-free „koriskorso keretszerzodes felmondasi ideje” put the
  draft first (−29.808 against −29.804); now the signed contract leads and the draft is second. A draft that matches
  clearly better still leads. Nothing else in the engine's order moves.
- **File lists.** A spreadsheet whose rows are mostly file names (an Iratjegyzék, a folder export) is marked
  „ⓘ fájljegyzék”, gets no date (its rows' dates are not its own) and keeps half its score. It came first for
  „Mikor szállítjuk az RV-2026-0989 rendelést?” with newest first, above the mail that answers it; now the mail leads.
- The `kereso` skill: a file list is not a source.
- The first refresh after the update converts every file once more (the cache format changed): a few minutes on a
  large archive, during which the old index keeps answering.

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
