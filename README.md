# AI+ plugins

Claude plugins of the ITLine AI+ products, served as a Claude plugin marketplace.

| Plugin | Product | What it holds |
|---|---|---|
| `aiplus` | AI+ Meeting Asszisztens | the skills that drive the meeting engine's tools |
| `aiplus-office` | Ingyenes irodai AI+ modul · free office AI+ module | irodai skillek és az `aiplus-office` parancs, a WordCraft, GridCraft, DeckCraft és PdfCraft programokat első használatkor maga tölti le; Excel- és PowerPoint-fájlhoz Cowork vagy Claude Code kell · office skills and the `aiplus-office` command, downloads the four apps itself on first use; Excel and PowerPoint files need Cowork or Claude Code |

The `aiplus` plugin is the Claude-side half of its product: it works with the product's engine, which its own installer
puts on the computer. `aiplus-office` needs no installer: it downloads the ArtCraft apps itself on first use.

**Claude Desktop:** Customize → Plugins → Add marketplace → `itlinekft/aiplus-plugins`.

**Claude Code:**

    claude plugin marketplace add itlinekft/aiplus-plugins
    claude plugin install aiplus@aiplus-plugins

This repository is published from each product's release step; do not edit it by hand.

© ITLine Kft. All rights reserved.
