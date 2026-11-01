# AI+ Kereső · AI+ Search

**AI+ Kereső** (English: **AI+ Search**) · ITLine AI+ · ingyenes · MIT

## Magyarul

Az AI+ Kereső ingyenes AI+ modul a Claude-hoz: **rangsorolt keresés a cég saját irataiban** — szerződések, ajánlatok,
számlák, szállítólevelek, levelek, jegyzőkönyvek, árlisták (PDF, Word, Excel, e-mail). Magyarul kérdezel, toldalékkal
vagy ékezet nélkül is („keretszerződésben”, „felmondasrol”), a Claude a több ezer fájl közül megtalálja a jót, csak a
szükséges részét olvassa el, és megmondja, melyik fájlból válaszolt.

- **Telepítés a Claude Desktopban** (Claude módban): Customize › Plugins › Add plugin › Add marketplace › Add from a
  repository › `itlinekft/aiplus-plugins` › Sync, majd az **AI+ Kereső** kártyán Add › Continue. Utána **lépj ki
  teljesen a Claude-ból** (a tálca ikonjáról is) **és indítsd újra**, majd nyiss új beszélgetést: a Claude Desktop a
  modul programját induláskor indítja el, újraindítás nélkül a kereső eszközei nem jelennek meg. Ha az újraindítás
  után sincsenek ott, indítsd újra még egyszer: a Claude Desktop az egyik induláskor tölti le a programot, és a
  következőkor indítja el (frissítésnél is így van). **Claude Code:**
  `claude plugin marketplace add itlinekft/aiplus-plugins`, majd `claude plugin install aiplus-kereso@aiplus-plugins`.
- **Első lépés:** kérdezd meg a Claude-tól: „Hogyan kezdjem a keresőt?” Megkérdezi, melyik mappában vannak a cég
  iratai, és elindítja az indexelést (egy 14 ezer fájlos próbaarchívumon kb. másfél perc volt, egy 6 ezer fájlos
  Windows 11-es próbagépen 99 másodperc). Az első indexelés közben a keresés megvárja az indexet, vagy megmondja,
  mennyi van még hátra.
- **Mi kell hozzá?** Node.js (https://nodejs.org, „LTS”). Ha a gépen lévő 22.19-nél régebbi, a modul első indításkor
  egyszer letölti a hivatalos Node.js 24-et (kb. 30 MB, ellenőrzőösszeggel) a saját felhasználói mappádba; telepítő és
  rendszergazdai jog nem kell.
- **Hol van az index?** A gépeden, a felhasználói adatmappában: Windowson `%LOCALAPPDATA%\aiplus-kereso`, a Microsoft
  Store-ból telepített Claude Desktopnál `%LOCALAPPDATA%\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Local\aiplus-kereso`
  (a Windows ide irányítja át az alkalmazás fájljait). A mappádba
  nem ír, szerverre nem tölt fel semmit. Amit a Claude a találatokból elolvas, azt — mint minden fájlt, amivel
  dolgozik — a Claude feldolgozza.
- **Mit olvas?** Szöveges PDF, DOCX, XLSX (minden munkalap), EML, TXT, MD. **Még nem:** szkennelt PDF szövegréteg
  nélkül (OCR), régi .doc/.xls, Outlook PST.

## In English

AI+ Search (Hungarian name: AI+ Kereső) is a free AI+ module for Claude: **ranked search over the company's own
files** — contracts, offers, invoices, delivery notes, mails, minutes, price lists (PDF, Word, Excel, e-mail). Ask in
Hungarian, inflected or without accents; Claude finds the right document among thousands, reads only the part it
needs, and names the file it answered from.

- **Install in Claude Desktop** (Claude mode): Customize › Plugins › Add plugin › Add marketplace › Add from a
  repository › `itlinekft/aiplus-plugins` › Sync, then Add › Continue on the **AI+ Kereső** card. Then **quit Claude
  completely** (from the tray icon too) **and start it again**, then open a new chat: Claude Desktop starts the
  module's program when it launches, and without a restart the search tools do not appear. If they are still missing
  after the restart, restart once more: Claude Desktop downloads the program during one launch and starts it at the
  next (an update works the same way). **Claude Code:**
  `claude plugin marketplace add itlinekft/aiplus-plugins`, then `claude plugin install aiplus-kereso@aiplus-plugins`.
- **First step:** ask Claude “How do I start the search?”. It asks for the folder that holds the company's files and
  starts indexing (about 1.5 minutes for a 14 000-file test archive; 99 s for 6 000 files on a Windows 11 test PC).
  During the first build a search waits for the index, or says how long is left.
- **Needs** Node.js. If the installed one is older than 22.19, the module downloads the official Node.js 24 once
  (about 30 MB, checksum-verified) into your user data folder; no installer, no administrator rights.
- **The index** stays on your computer (on Windows `%LOCALAPPDATA%\aiplus-kereso`; with Claude Desktop from the
  Microsoft Store, Windows redirects it to `%LOCALAPPDATA%\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Local\aiplus-kereso`);
  it never writes into your folder
  and uploads nothing. What Claude reads from the results is processed by Claude like any file it works with.
- **Reads** PDF with a text layer, DOCX, XLSX, EML, TXT, MD. **Not yet:** scanned PDFs without text (OCR), old
  .doc/.xls, Outlook PST.

Built on an MIT-licensed kb search engine (SQLite FTS5, BM25F ranking), used unmodified; see `THIRD-PARTY-NOTICES.md`.
