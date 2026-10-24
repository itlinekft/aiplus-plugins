# aiplus-office — ingyenes irodai AI+ modul

A free AI+ module for Claude. Claude creates and edits files in **Word, Excel, PowerPoint and PDF** formats (DOCX, XLSX,
PPTX, PDF) with the free, open-source ArtCraft programs — **WordCraft, GridCraft, DeckCraft, PdfCraft** — through their
command-line tools, checks every finished file mechanically, and follows worked Hungarian office examples (árajánlat,
árlista, prezentáció).

## The ArtCraft programs are early versions (alpha)

The ArtCraft programs are new and released almost daily. They open and save real Word, Excel, PowerPoint and PDF files,
but not everything in such a file survives: no VBA macros, and formatting the programs do not support may change on
save. Work on a copy, and look at every file meant for a customer before it is sent — the skills make Claude check it
first.

## Install

**Claude Desktop:** Customize → Plugins → Add marketplace → `itlinekft/aiplus-plugins`, then install `aiplus-office`.

**Claude Code:**

    /plugin install aiplus-office --marketplace itlinekft/aiplus-plugins

or, on older versions:

    claude plugin marketplace add itlinekft/aiplus-plugins
    claude plugin install aiplus-office@aiplus-plugins

## What it needs

- **Node.js 20 or newer.**
- Internet access on first use of each program: the module downloads the program's official release from
  `github.com/storytold/<program>` (20–100 MB), checks it against the release's `SHA256SUMS.txt`, and keeps it in a
  per-user cache (`%LOCALAPPDATA%\aiplus-office` on Windows, `~/Library/Caches/aiplus-office` on macOS,
  `~/.cache/aiplus-office` on Linux). No installer, no administrator rights; nothing is installed system-wide.
- For the workflow skills' checks: a Bash shell and `jq` (Claude Code on Windows uses Git Bash; `jq` is not part of it
  by default).

## What is inside

| Skill | Use |
|---|---|
| `office-router` | picks the program; plan → discover → run → save → verify |
| `office-wordcraft`, `office-gridcraft`, `office-deckcraft`, `office-pdfcraft` | one per program: commands, traps, tested recipes |
| `office-doc-publish` | Markdown + the company's Word template → DOCX + PDF (árajánlat) |
| `office-deck` | outline → slides → PDF handout (prezentáció) |
| `office-data-visual` | numbers → spreadsheet with formulas → chart → slide (árlista with 27% ÁFA) |

The `aiplus-office` command is `dist/aiplus-office.mjs`. MCP servers are registered only for the programs that confine
file access to the project folder (WordCraft and PdfCraft); GridCraft and DeckCraft are used through the shell.

## Licence

MIT — see `LICENSE` and `NOTICE`. The ArtCraft programs are separate projects (MIT OR Apache-2.0) and are not part of
this module.

---

A Word, az Excel és a PowerPoint a Microsoft védjegyei; az ArtCraft programjai nem a Microsoft termékei, és ez a modul nem kapcsolódik hozzájuk.
