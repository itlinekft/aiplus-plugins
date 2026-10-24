---
name: office-start
description: First run of the aiplus-office plugin - checks Node.js and the four free ArtCraft office apps (aiplus-office status), says where the apps come from, offers to download them (install --all), says plainly what works where (a plain Chat in Claude Desktop - Word and PDF only; Cowork or Claude Code - also Excel and PowerPoint files) and where the desktop window apps are officially downloaded. Use on first use, after installing the plugin, when a command fails because Node.js or an app is missing, or for "how do I start", "what does it need", "setup", "install the apps", "where do the programs come from", "why can't you make the spreadsheet", and Hungarian - első indítás, telepítés, beállítás, hogyan kezdjem, mi kell hozzá, honnan jönnek a programok, miért nem készül el a táblázat vagy a prezentáció.
---

# office-start: first run, what it needs, where it comes from, what works where

Run this the first time the user works with the plugin, when they ask how to start or what it needs, and when an office
command failed because Node.js or an app is missing. It checks the machine, explains the result in plain words, and
asks before downloading anything. Office jobs themselves belong to `office-router`.

**Answer in the user's language.** Every user-facing block below has a Hungarian (**HU**) and an English (**EN**)
wording with the same facts: use the one that matches the user (Hungarian when unsure), in these words or close to them.
No jargon beyond „Chat", „Cowork" and „Claude Code": do not say MCP, shell, CLI or cache to the user.

## 1. Can you run commands here?

If you have **no tool that runs commands** (a plain Chat in Claude Desktop), skip to **5. What works where** and say:

> **HU:** Itt, a sima Chatben nem tudok programot futtatni a gépeden, ezért a gépet most nem tudom ellenőrizni. Word- és
> PDF-fájlokkal itt is tudok dolgozni; Excel- és PowerPoint-fájlhoz nyisd meg a Cowork-ot vagy a Claude Code-ot, és ott
> kérdezd újra: „hogyan kezdjem?”
>
> **EN:** In a plain Chat I cannot run programs on your computer, so I cannot check it from here. I can work with Word
> and PDF files here too; for Excel and PowerPoint files, open Cowork or Claude Code and ask again: “how do I start?”

## 2. Node.js

```bash
node --version
```

- `v20` or newer: fine; say „a Node.js rendben van” / “Node.js is fine”.
- Command not found, or older than `v20`:

> **HU:** A modulnak kell egy ingyenes segédprogram, a **Node.js** (20-as vagy újabb változat). Töltsd le a hivatalos
> oldalról: https://nodejs.org, az „LTS” jelű változatot. Telepítés után indítsd újra a Claude-ot, és kérdezd újra:
> „hogyan kezdjem?”
>
> **EN:** The module needs a free helper program, **Node.js** (version 20 or newer). Download it from the official site,
> https://nodejs.org, the “LTS” version. After installing it, restart Claude and ask again: “how do I start?”

Stop here until Node.js is there: nothing else of the plugin runs without it.

## 3. What is installed: `status`

Every shell call starts with the command line from `office-router`:

```bash
command -v aiplus-office >/dev/null || aiplus-office() { node "${CLAUDE_PLUGIN_ROOT}/dist/aiplus-office.mjs" "$@"; }
aiplus-office status
```

`status` only reads the local folder; it never downloads. Its lines and what to tell the user:

| `status` says | HU | EN |
|---|---|---|
| `node: v… (ok: …)` / `(too old: …)` | a Node.js rendben van / túl régi (2. lépés) | Node.js is fine / too old (step 2) |
| `host: win32/x64` (`darwin/arm64`, `linux/x64`) | Windows / macOS / Linux gép (only if it matters) | Windows / macOS / Linux computer |
| `cache: <folder>` | ide kerülnek a programok (give this exact folder) | the programs are kept here |
| `<app> 0.11.1 (20.0 MB)` | a program már le van töltve, ez a változata | downloaded, this version |
| `<app> not installed · next: download` | még nincs letöltve; első használatkor magától letölti | not downloaded yet; it is fetched on first use |
| `next: <version> (latest-cached)` | legközelebb ezt a változatot használja | this version is used next |
| `override: <path>` / `(pin)` | kézzel beállított program / rögzített változat (leave it alone) | set by hand (leave it alone) |

Name the apps by what they do: WordCraft = Word format (DOCX), GridCraft = Excel format (XLSX), DeckCraft = PowerPoint
format (PPTX), PdfCraft = PDF.

## 4. Where the apps come from, then offer the download (ask first)

If any app is `not installed`, explain where they come from and **ask**; never run `install` without a yes.

> **HU:** **Honnan jönnek a programok?** A négy program (WordCraft, GridCraft, DeckCraft, PdfCraft) ingyenes, nyílt
> forrású. A modul a programok hivatalos GitHub-oldaláról tölti le őket (`github.com/storytold/<program>`,
> „Releases”), és minden letöltött fájlt összevet a kiadás `SHA256SUMS.txt` ellenőrzőlistájával: ha a fájl eltér, nem
> telepíti. A programok a saját felhasználói mappádba kerülnek (Windowson `%LOCALAPPDATA%\aiplus-office`, macOS-en
> `~/Library/Caches/aiplus-office`, Linuxon `~/.cache/aiplus-office`); telepítő nem fut, rendszergazdai jog nem
> kell, és a gép más részéhez nem nyúl. Programonként 20–100 MB; ha új változat jelenik meg, azt is magától tölti le.
>
> Letöltsem most mind a négyet? (Ha nem, az első feladatnál tölti le azt, amelyik kell.)
>
> **EN:** **Where do the programs come from?** The four programs (WordCraft, GridCraft, DeckCraft, PdfCraft) are free
> and open source. The module downloads them from their official GitHub pages (`github.com/storytold/<program>`,
> “Releases”) and checks every downloaded file against the release's `SHA256SUMS.txt` checklist: if a file differs, it
> is not installed. The programs go into your own user folder (`%LOCALAPPDATA%\aiplus-office` on Windows,
> `~/Library/Caches/aiplus-office` on macOS, `~/.cache/aiplus-office` on Linux); no installer runs, no administrator
> rights are needed, and nothing else on the computer is touched. 20–100 MB per program; a newer version is fetched by
> itself when one comes out.
>
> Shall I download all four now? (If not, each one is downloaded at the first job that needs it.)

On a yes:

```bash
command -v aiplus-office >/dev/null || aiplus-office() { node "${CLAUDE_PLUGIN_ROOT}/dist/aiplus-office.mjs" "$@"; }
aiplus-office install --all
aiplus-office status
```

`install` prints one JSON line per app (`version`, `cacheHit`); exit `0` = all four are there. Exit `69` = a download
failed: say which program, and the likely cause in plain words: no internet, a firewall or proxy blocking GitHub, or
GitHub's download limit for the hour (then try again later). Do not retry more than once without the user.

## 5. What works where

Say it plainly, once:

> **HU:** **Word és PDF** a sima Chatben is megy: ehhez a modul két beépített kapcsolatot ad a Claude-nak, és ezek csak
> a munkamappádhoz férnek hozzá. **Excel- és PowerPoint-fájlt a sima Chat nem tud készíteni.** Ezt a két programot a
> Claude csak úgy tudja használni, hogy programot futtat a gépen, és a sima Chat erre nem képes; kapcsolatként
> biztonsági okból nem kötöttük be őket, mert nem lehet őket a munkamappára korlátozni. **Excel- és PowerPoint-fájlhoz
> a Cowork vagy a Claude Code kell.**
>
> **EN:** **Word and PDF** work in a plain Chat too: for these the module gives Claude two built-in connections, which
> reach only your working folder. **A plain Chat cannot make Excel or PowerPoint files.** Claude can use those two
> programs only by running a program on the computer, which a plain Chat cannot do; for safety they are not connected
> the other way, because they cannot be limited to the working folder. **Excel and PowerPoint files need Cowork or
> Claude Code.**

| HU: Ahol dolgozol · EN: Where you work | Word (DOCX) | PDF | Excel (XLSX) | PowerPoint (PPTX) |
|---|---|---|---|---|
| Claude Desktop, Chat | igen · yes | igen · yes | nem · no | nem · no |
| Cowork | igen · yes | igen · yes | igen · yes | igen · yes |
| Claude Code | igen · yes | igen · yes | igen · yes | igen · yes |

This is what the plugin is built for; what has actually been tried is the next block. Say both.

## 6. Tried so far: the one place to update

<!-- office-start:tested: the ONLY place that says what has been tried. Update this block (both languages) when a
     measurement arrives (details and dates: docs/MEASURED.md of the repository); no other sentence restates it. -->

> **HU: Amit eddig kipróbáltunk (2026. október 24.):**
> - Claude Code, Linux: mind a négy program letöltve; árlista, árajánlat és prezentáció elkészült és ellenőrizve.
> - Claude Desktop, Windows 11: a modul telepíthető; telepítéskor a Word- és a PDF-kapcsolat jelenik meg. Hogy a
>   Chatben ezek el is indulnak-e, még nem mértük.
> - **Cowork: még nem teszteltük.** A próba folyamatban van. Ha ott valami nem indul, írd meg nekünk, mit látsz.
> - Claude Code Windowson és macOS-en: még nem teszteltük.
>
> **EN: What we have tried so far (24 October 2026):**
> - Claude Code, Linux: all four programs downloaded; a price list, an offer and a presentation made and checked.
> - Claude Desktop, Windows 11: the module installs; the install shows the Word and the PDF connection. Whether they
>   also start in Chat has not been measured yet.
> - **Cowork: not tested yet.** The test is under way. If something does not start there, tell us what you see.
> - Claude Code on Windows and macOS: not tested yet.

## 7. The desktop (window) apps (optional)

The plugin installs **only the command-line tools** of the four apps; it does not install their desktop (window) apps.
If the user wants to open a made file in a window, or asks for the GridCraft program itself, point to the official
download page (checked 2026-10-24, see the repository's `docs/MEASURED.md`):

| Program | Official download / Hivatalos letöltés |
|---|---|
| WordCraft | https://github.com/storytold/wordcraft/releases/latest |
| GridCraft | https://github.com/storytold/gridcraft/releases/latest |
| DeckCraft | https://github.com/storytold/deckcraft/releases/latest |
| PdfCraft | https://github.com/storytold/pdfcraft/releases/latest |

> **HU:** A modul a programoknak csak a háttérben futó részét tölti le, az ablakos programot nem. Ha a kész fájlt
> ablakban is meg akarod nyitni vagy kézzel szerkesztenéd, az ablakos programot a fenti hivatalos GitHub-oldalról
> töltheted le. Melyik fájlt válaszd (a `<verzió>` helyén a szám áll):
> - **Windows:** `<program>-<verzió>-windows-x64.msi` (telepítő), vagy `<program>-<verzió>-windows-x64-portable.zip`
>   (telepítés nélkül: kicsomagolod, és a mappában elindítod a `<program>.exe`-t). ARM-os géphez (pl. Snapdragon) az
>   `arm64` jelűt. A PdfCraft telepítője minden felhasználónak telepít, és rendszergazdai jogot kér; ha ez nincs, a
>   portable zip-et válaszd.
> - **macOS:** `<program>-<verzió>-macos-universal.dmg`.
>
> A programok weboldala `https://getartcraft.com/apps/<program>`; a legújabb változat a GitHub-oldalon van. Ezek is
> korai változatok: a fontos fájlról mindig legyen másolatod.
>
> **EN:** The module downloads only the part of the programs that runs in the background, not the window app. To open a
> finished file in a window or edit it by hand, download the window app from the official GitHub page above. Which file
> to pick (`<version>` is the number):
> - **Windows:** `<program>-<version>-windows-x64.msi` (installer), or `<program>-<version>-windows-x64-portable.zip`
>   (no installation: unzip it and start `<program>.exe` in the folder). For an ARM computer (e.g. Snapdragon) the
>   `arm64` one. The PdfCraft installer installs for all users and asks for administrator rights; without them, pick
>   the portable zip.
> - **macOS:** `<program>-<version>-macos-universal.dmg`.
>
> The programs' web page is `https://getartcraft.com/apps/<program>`; the newest version is on the GitHub page. These are
> early versions too: always keep a copy of an important file.

## 8. Close

End with one concrete next step in the user's language, e.g. HU „Próbáld ki: »Készíts árlistát táblázatban három
termékkel, 27% ÁFÁ-val«” (Cowork / Claude Code) or „»Írj árajánlatot Word-formátumban a Minta Kft. részére«” (Chat is
enough); EN “Try: »Make a price list spreadsheet with three products and 27% VAT«” or “»Write an offer in Word format
for Minta Kft.«”. From here on the job belongs to `office-router` and its skills.
