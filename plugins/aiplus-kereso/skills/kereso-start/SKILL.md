---
name: kereso-start
description: First run and status of AI+ Kereső - sets the folder to search (the company's archive), starts and checks the index, says what it needs and where the index lives, and what leaves the computer. Use on first use, after installing the plugin, when a search tool says no folder is set, or for "how do I start the search", "set up the search", "which folder", "is the index ready", "where is the index", and Hungarian - hogyan kezdjem a keresőt, kereső beállítása, melyik mappában keres, kész van az index, hol van az index, mi kerül ki a gépről.
---

# kereso-start: first run, the folder, the index, what leaves the computer

**Answer in the user's language** (Hungarian when unsure), in plain words: no MCP, CLI, cache or FTS to the user.

## 1. Status

Call `kereso_allapot`. It says the folder, how far the index is, and when it was last refreshed.

## 2. No folder yet

Ask which folder holds the company's files (the shared archive), as a full path. **HU:** „Melyik mappában vannak a
cég iratai? Kérem a teljes útvonalat, például C:\Users\…\Documents\Archívum.” **EN:** “Which folder holds the
company's files? Please give the full path, for example C:\Users\…\Documents\Archive.” Then call `kereso_mappa`
with it. Indexing runs in the background: about 1.5 minutes for 14 151 test files on a Linux PC, 99 s for 6 028 on a
Windows 11 test PC; a slower PC takes longer. During the FIRST build there is nothing to search yet: a search call waits
up to 45 s for it, then answers with how far it is and about how long is left. That is not an error: tell the user
the first indexing takes a while, and search again a little later — do not switch to opening files one by one.

## 3. What to tell the user (the facts, in these words or close to them)

- **HU:** „Az AI+ Kereső a gépeden készít keresési indexet a mappádról; a mappába nem ír, és az index nem kerül
  semmilyen szerverre. Tízpercenként magától frissül, ha használod. Amit a Claude a keresés eredményéből elolvas, azt
  — mint minden fájlt, amivel dolgozik — a Claude feldolgozza (a Cowork és a felhős munkamenet az Anthropic szerverein
  fut).”
- **EN:** “AI+ Kereső builds a search index of your folder on your computer; it never writes into the folder, and the
  index goes to no server. It refreshes itself every ten minutes while in use. What Claude reads from the results is
  processed by Claude like any file it works with (Cowork and cloud sessions run on Anthropic's servers).”
- Never say the files stay on the computer: the index does; what Claude reads does not.

## 4. What it reads

PDF with a text layer, Word (DOCX), Excel (XLSX: every sheet, big sheets in row blocks), e-mail (EML), TXT and MD.
**Not yet:** scanned PDFs without a text layer (no OCR in this version), old .doc/.xls, Outlook PST. Say so if the
user's archive is mostly scans.

## 5. If it does not start

- **The `kereso_*` tools are not in this session at all** (only this skill is): Claude Desktop starts the module's
  program when it launches, so right after installing it is not running yet. **HU:** „Lépj ki teljesen a Claude-ból
  (a tálcán, az óra mellett lévő ikonjáról is: Kilépés), indítsd újra, és nyiss új beszélgetést. Ha még mindig nincs
  meg, indítsd újra még egyszer.” **EN:** “Quit Claude completely (from its tray icon too: Quit), start it again, and
  open a new chat. If it is still missing, restart once more.” (Desktop downloads the program during one launch and
  starts it at the next; measured with an update, 2026-11-02.)

- A tool answer says it is **downloading its runtime**: the PC's Node.js is older than 22.19, so the module fetches
  the official Node.js 24 (about 30 MB, from nodejs.org, checksum-verified) into the user's AppData once. Wait a
  minute.
- **No Node.js at all**: the module cannot start. **HU:** „Telepítsd a Node.js LTS-t a https://nodejs.org oldalról,
  majd lépj ki teljesen a Claude-ból és indítsd újra.” **EN:** “Install Node.js LTS from https://nodejs.org, then quit
  Claude completely and start it again.”
- Refresh by hand with `kereso_frissites` after copying many new files.
