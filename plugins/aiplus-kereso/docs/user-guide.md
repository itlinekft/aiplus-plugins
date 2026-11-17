# AI+ Kereső · AI+ Search: user guide

From a fresh install to the first real result. The short version lives in the plugin's README and in the first-run
skill; this guide walks one Hungarian office example all the way.

## In English

### 1. Install

- **Claude Desktop** (Claude mode): Customize › Plugins › Add plugin › Add marketplace › Add from a repository ›
  `itlinekft/aiplus-plugins` › Sync, then Add › Continue on the **AI+ Kereső** card.
- **Claude Code:** `claude plugin marketplace add itlinekft/aiplus-plugins`, then
  `claude plugin install aiplus-kereso@aiplus-plugins`.
- Then quit Claude completely (the tray icon too) and start it again, and open a new chat. Without the restart the
  search tools do not appear; if they are still missing, restart once more.

### 2. First run

Ask: **"How do I start the search?"** (Hungarian: „Hogyan kezdjem a keresőt?"). Claude asks for the folder that holds
the company's files and sets it with the `kereso_mappa` tool. The first index build takes minutes (measured: 14 000
files in about 90 s on a Linux PC, 6 000 files in 99 s on a Windows 11 test PC; a slower PC takes longer). Searches
made during the first build wait, then report progress. Needs Node.js; if the installed one is older than 22.19, the
module downloads the official Node.js 24 once, pinned and checksum-checked, into your user data folder.

### 3. One office example, end to end

A Hungarian office asks: **„Melyik levél válaszolja meg az RV-2026-0989 rendelést, és mikor szállítjuk?"** ("Which
mail answers order RV-2026-0989, and when do we deliver?"). Claude searches `kereso_kereses` with the order number
and newest first, gets the order confirmation, the delivery note and the mail thread; follows the shared document
number with `kereso_kapcsolodo`; reads only the latest mail with `kereso_dokumentum` (a section, not the whole
file); and answers with the date and the file it came from, for example: the confirmation promised the 3rd, but the
latest mail moved it to the 5th of November, and here is that mail's path. This is the measured T06 round on the
demo archive (10 tool calls, 45 s; see `docs/MEASURED.md`).

### 4. Everyday

- Ask in your own words, inflected or without accents: the search widens to base forms.
- Ask for totals ("all invoices of May 2026") and Claude narrows the set first, then reads; it says how many documents
  the total covers.
- New files are picked up at the ten-minute refresh, or ask Claude to refresh the index now.
- The index lives in your user data folder (Windows: `%LOCALAPPDATA%\aiplus-kereso`) and stays there.

### 5. If something does not work

- Tools missing: quit Claude completely, start again, new chat; restart once more if needed.
- "Downloading its runtime" on first start: wait a minute and try again.
- Mostly scanned PDFs: this version reads text-layer PDFs, DOCX, XLSX, EML, TXT, MD; it has no OCR yet.
- Refusals are normal answers (no folder set, index still building): follow what the answer says, or just try again.

## Magyarul

### 1. Telepítés

- **Claude Desktop** (Claude mód): Customize › Plugins › Add plugin › Add marketplace › Add from a repository ›
  `itlinekft/aiplus-plugins` › Sync, majd az **AI+ Kereső** kártyán Add › Continue.
- **Claude Code:** `claude plugin marketplace add itlinekft/aiplus-plugins`, majd
  `claude plugin install aiplus-kereso@aiplus-plugins`.
- Utána lépj ki teljesen a Claude-ból (a tálca ikonjáról is), indítsd újra, és nyiss új beszélgetést. Újraindítás
  nélkül a kereső eszközei nem jelennek meg; ha az újraindítás után sincsenek ott, indítsd újra még egyszer.

### 2. Első futtatás

Kérdezd meg: **„Hogyan kezdjem a keresőt?"**. A Claude megkérdezi, melyik mappában vannak a cég iratai, és a
`kereso_mappa` eszközzel beállítja. Az első indexelés perceket vesz igénybe (mért: 14 ezer fájl kb. 90 másodperc
Linuxon, 6 ezer fájl 99 másodperc egy Windows 11-es próbagépen; lassabb gépen tovább). Az első build alatt a keresés
vár, majd haladást jelent. Node.js kell; ha a telepített 22.19-nél régebbi, a modul egyszer letölti a hivatalos
Node.js 24-et, rögzített verzióval és ellenőrzőösszeggel, a felhasználói adatmappádba.

### 3. Egy irodai példa végig

Az iroda ezt kérdezi: **„Melyik levél válaszolja meg az RV-2026-0989 rendelést, és mikor szállítjuk?"**. A Claude
megkeresi a rendelésszámot a `kereso_kereses`-szel, a legfrissebbeket elöl; kapja a visszaigazolást, a szállítólevelet
és a levelezést; a közös bizonylatszámot a `kereso_kapcsolodo`-val követi; csak a legutóbbi levelet olvassa el a
`kereso_dokumentum`-mal (szakaszt, nem az egész fájlt); és a válaszban megmondja a dátumot és a fájl útvonalát:
a visszaigazolás 3-át ígért, de a legutóbbi levél november 5-re tette, és itt a levél útvonala. Ez a mért T06 kör a
próbaarchívumon (10 eszközhívás, 45 másodperc; lásd `docs/MEASURED.md`).

### 4. Mindennap

- Kérdezz a saját szavaiddal, toldalékkal, ékezet nélkül is: a kereső a szótövekre is keres.
- Összegeket kérdezhetsz („minden 2026. májusi számla"): a Claude előbb leszűkít, aztán olvas; és megmondja, hány
  dokumentumon átment az összeg.
- Az új fájlokat a tízperces frissítés veszi fel, vagy kérdd meg a Claude-ot, hogy frissítse most.
- Az index a felhasználói adatmappádban van (Windowson `%LOCALAPPDATA%\aiplus-kereso`) és ott is marad.

### 5. Ha valami nem megy

- Nincsenek meg az eszközök: lépj ki teljesen, indítsd újra, új beszélgetés; ha kell, még egyszer.
- „Letölti a futtatókörnyezetét" az első indításkor: várj egy percet, és próbáld újra.
- Főleg szkennelt PDF-ek vannak: ez a verzió szövegréteges PDF-et, DOCX-et, XLSX-et, EML-t, TXT-t, MD-t olvas; OCR
  még nincs.
- A visszautasítások normális válaszok (nincs mappa beállítva, az index még épül): kövesd, amit a válasz mond, vagy
  próbáld újra.
