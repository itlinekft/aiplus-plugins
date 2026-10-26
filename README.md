# AI+ plugins

Claude plugins of the ITLine AI+ products, served as a Claude plugin marketplace.

| Plugin | Product | What it holds |
|---|---|---|
| `aiplus` | AI+ Meeting Asszisztens | élő meeting asszisztens a Claude Desktopban; a gépre telepített AI+ motorral és érvényes AI+ licenccel működik · the live meeting assistant in Claude Desktop; works with the AI+ engine installed on the computer and a valid AI+ licence |
| `aiplus-office` | AI+ Iroda · AI+ Office (ingyenes · free) | irodai skillek és az `aiplus-office` parancs, a WordCraft, GridCraft, DeckCraft és PdfCraft programokat maga tölti le; a sima Chatben a Dokumentumok › „AI+ Iroda” mappában dolgozik, a saját mappádban Claude Code-ban vagy „This computer” munkamenetben · office skills and the `aiplus-office` command, downloads the four apps itself; in a plain Chat it works in Documents › „AI+ Iroda”, in a folder of your choice in Claude Code or a “This computer” session |
| `aiplus-desktape` | AI+ desktape (ingyenes · free) | API nélküli asztali programok vezérlése Windowson és macOS-en egy felvett, ellenőrzött lépéssorral (tape); a kódja a saját nyilvános repójában van (`itlinekft/aiplus-desktape`) · controls Windows and macOS desktop programs that have no API with a recorded, checked tape; its code lives in its own public repo |

The `aiplus` plugin is the Claude-side half of its product: it works with the product's engine, which its own installer
puts on the computer. `aiplus-office` needs no installer: it downloads the ArtCraft apps itself on first use.

**Claude Desktop:** Customize → Plugins → Add marketplace → `itlinekft/aiplus-plugins`.

**Claude Code:**

    claude plugin marketplace add itlinekft/aiplus-plugins
    claude plugin install aiplus@aiplus-plugins

This repository is published from each product's release step; do not edit it by hand. `aiplus-desktape` is listed by reference: its code is installed from its own repository.

© ITLine Kft. All rights reserved.
