---
name: start
description: First run of the AI+ Meeting Asszisztens plugin: checks that the engine is reachable and matches the plugin, then says the next step in the user's language. Use when the user asks „hogyan kezdjem?”, „how do I start?”, or is new to the meeting assistant.
allowed-tools: mcp__aiplus__meeting_status, mcp__aiplus__meeting_licence, mcp__aiplus__meeting_doctor, mcp__aiplus__meeting_help
---

<!-- aiplus:block:start -->
> **AI+ Meeting Assistant plugin 0.4.25** · tool contract 12. If the user asks which version you are on, answer with this line.
>
> **Before anything else, call `meeting_status`.**
> - **The tool does not exist** → the AI+ Meeting Assistant engine (the box) is not installed on this computer, or Claude Desktop has not started it yet. Say exactly this one sentence, in the user's language, and stop: „Az AI+ Meeting Asszisztens motorja nincs telepítve ezen a gépen: töltsd le a licencportálról (portal.itline.hu, Letöltés), telepítsd, aztán indítsd újra teljesen a Claude Desktopot.” / “The AI+ Meeting Assistant engine is not installed on this computer: download it from the licence portal (portal.itline.hu, Letöltés), install it, then restart Claude Desktop completely.” Do not try to work without the tools. If you are a Cowork task running in the cloud rather than on the user's computer, installing will not help: a cloud task cannot reach the engine on the user's computer, so say that the meeting assistant needs a task on their own computer.
> - **`contractVersion` is not 12** → the engine and this plugin do not match. If it is higher, the plugin needs an update (Customize › Plugins, the AI+ marketplace, Update on `aiplus`); if lower, the engine needs one (its installer from the licence portal, portal.itline.hu, Letöltés). Say which, and stop.
> - **Otherwise** continue below.
>
> **The person's documents (aip-279).** When the conversation or the user reaches a topic the project's documents may cover, call `meeting_search` with the topic's words and cite each fact with its `file` and `section`. With no hits say the documents do not cover it; never invent a source. Its `note` says where folders are chosen when none are.
<!-- aiplus:block:end -->

Answer in the user's language (Hungarian if they wrote Hungarian). No jargon: say „a motor” / „the engine”, never
MCP, CLI or tool names.

## Steps

1. The block above has already called `meeting_status` and stopped if the engine is missing or does not match.
2. Call `meeting_licence`. No valid licence: say that the meeting assistant needs a valid AI+ licence key, entered
   in the AI+ console, and stop.
3. If the user reports a problem, call `meeting_doctor` and explain its result in plain words.
4. Then give the next step in two lines:
   - „Indítsd a meetinget: írd be, hogy »indítsd a meetinget«.” / „Start a meeting: type »start the meeting«.”
   - „Ha előbb próbát szeretnél, írd be: »ellenőrizd, hogy működik-e«.” / „For a test first, type »check that it
     works«.”
5. If they ask what has been tried so far, quote the block below as it is.

## What has been tried so far

<!-- aiplus:tested 2026-10-25 -->
> **Magyarul:**
> - Linux: a telepítő a teljes úton végigment egy friss Ubuntu 24.04 virtuális gépen, rendszergazdai jog nélkül
>   (2026-10-09).
> - macOS: a teljes telepítési és meetingút a bemutató MacBookon fut (2026-10-19).
> - Windows: a motor települ; a felvétel fejlesztés alatt áll, az első rögzítés a gép asztali munkamenetén
>   keresztül sikerült (2026-10-21).
>
> **English:**
> - Linux: the installer ran end to end on a fresh Ubuntu 24.04 virtual machine, without administrator rights
>   (2026-10-09).
> - macOS: the full install and meeting path runs on the demo MacBook (2026-10-19).
> - Windows: the engine installs; recording is in development, the first capture over the computer's desktop
>   session succeeded (2026-10-21).
<!-- /aiplus:tested -->
