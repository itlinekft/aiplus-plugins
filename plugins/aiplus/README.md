# AI+ Meeting Asszisztens plugin

## Magyarul

Ez a plugin az AI+ Meeting Asszisztens Claude-oldali része. A meetinget a gépedre telepített AI+ motor hallgatja és
írja le, a plugin skilljei pedig megmondják a Claude-nak, hogyan indítsa el, kövesse és zárja le a meetinget, és
hogyan ellenőrizze, hogy minden működik-e. A plugin önmagában nem működik: a motort a saját telepítője
teszi fel.

### Mi kell hozzá

- Claude Desktop.
- Az AI+ motor a gépeden, a saját telepítőjével. Linuxra, macOS-re és Windowsra van csomag; Windowson a felvétel még
  fejlesztés alatt áll.
- Érvényes AI+ licenckulcs, és a beszédfelismeréshez a telepítési útmutatóban leírt beállítás.

### Telepítés

- **Claude Desktop:** Customize › Plugins › Add marketplace, ide írd be: `itlinekft/aiplus-plugins`, majd add hozzá
  az `aiplus` plugint.
- **Claude Code:** `claude plugin marketplace add itlinekft/aiplus-plugins`, utána
  `claude plugin install aiplus@aiplus-plugins`.

Első lépés: kérdezd meg a Claude-ot, „hogyan kezdjem?”. Megnézi, hogy a motor elérhető-e és illik-e a pluginhoz, és
megmondja, mi a következő lépés.

### Licenc

Zárt termék, nem nyílt forráskódú: csak érvényes AI+ licenccel használható. Részletek: [LICENSE](LICENSE).

## In English

This plugin is the Claude side of the AI+ Meeting Asszisztens. The AI+ engine installed on your computer listens to
the meeting and writes it down; the plugin's skills tell Claude how to start, follow and close a meeting, and how
to check that everything works. The plugin does not work on its own: the engine is put on the computer by its own
installer.

### What you need

- Claude Desktop.
- The AI+ engine on your computer, from its own installer. There are bundles for Linux, macOS and Windows; on
  Windows, recording is still in development.
- A valid AI+ licence key, and the speech-recognition setting described in the install guide.

### Install

- **Claude Desktop:** Customize › Plugins › Add marketplace, enter `itlinekft/aiplus-plugins`, then add the `aiplus`
  plugin.
- **Claude Code:** `claude plugin marketplace add itlinekft/aiplus-plugins`, then
  `claude plugin install aiplus@aiplus-plugins`.

First step: ask Claude „how do I start?”. It checks that the engine is reachable and matches the plugin, and tells
you the next step.

### Licence

A closed product, not open source: it may be used only with a valid AI+ licence. Details: [LICENSE](LICENSE).
