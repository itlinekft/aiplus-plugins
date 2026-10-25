---
name: start
description: First run of the AI+ Meeting Asszisztens plugin: checks that the engine is reachable and matches the plugin, then says the next step in the user's language. Use when the user asks „hogyan kezdjem?”, „how do I start?”, or is new to the meeting assistant.
allowed-tools: mcp__aiplus__meeting_status, mcp__aiplus__meeting_licence, mcp__aiplus__meeting_doctor, mcp__aiplus__meeting_help
---

<!-- aiplus:block:start -->
> **AI+ Meeting Assistant plugin 0.4.18** · tool contract 10. If the user asks which version you are on, answer with this line.
>
> **Before anything else, call `meeting_status`.**
> - **The tool does not exist** → the AI+ Meeting Assistant engine is not registered in Claude Desktop. Tell the user to run the AI+ Meeting Assistant installer, then restart Claude Desktop completely. Do not try to work without the tools. If you are a Cowork task running in the cloud rather than on the user's computer, reinstalling will not help: a cloud task cannot reach the engine on the user's computer, so say that the meeting assistant needs a task on their own computer.
> - **`contractVersion` is not 10** → the engine and this plugin do not match. If it is higher, the plugin needs an update (the marketplace's Update, or a new plugin zip); if lower, the engine needs one (the AI+ Meeting Assistant installer). Say which, and stop.
> - **Otherwise** continue below.
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
