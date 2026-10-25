---
name: check
description: Check that AI Plus works on this machine: run the engine's tools end to end on a one-minute mic capture (or a replay scenario you name) and report what worked. Use when the user asks to test, check or troubleshoot AI Plus.
allowed-tools: mcp__aiplus__meeting_policy, mcp__aiplus__meeting_start, mcp__aiplus__meeting_poll, mcp__aiplus__meeting_emit, mcp__aiplus__meeting_stop, mcp__aiplus__meeting_licence, mcp__aiplus__meeting_voice, mcp__aiplus__meeting_echo, mcp__aiplus__meeting_gateway, mcp__aiplus__meeting_speech, mcp__aiplus__meeting_name, mcp__aiplus__meeting_status, mcp__aiplus__meeting_doctor, mcp__aiplus__meeting_document, mcp__aiplus__meeting_help
---

<!-- aiplus:block:start -->
> **AI+ Meeting Assistant plugin 0.4.18** · tool contract 10. If the user asks which version you are on, answer with this line.
>
> **Before anything else, call `meeting_status`.**
> - **The tool does not exist** → the AI+ Meeting Assistant engine is not registered in Claude Desktop. Tell the user to run the AI+ Meeting Assistant installer, then restart Claude Desktop completely. Do not try to work without the tools. If you are a Cowork task running in the cloud rather than on the user's computer, reinstalling will not help: a cloud task cannot reach the engine on the user's computer, so say that the meeting assistant needs a task on their own computer.
> - **`contractVersion` is not 10** → the engine and this plugin do not match. If it is higher, the plugin needs an update (the marketplace's Update, or a new plugin zip); if lower, the engine needs one (the AI+ Meeting Assistant installer). Say which, and stop.
> - **Otherwise** continue below.
<!-- aiplus:block:end -->

# AI Plus check

You are measuring, not running a meeting. Use the engine's tools in this order and note every
result.

1. `meeting_status`: note `engineVersion`, `contractVersion`, `runtimeDir`, `owner` and
   `pollOffset`.
2. `meeting_policy`: confirm it returned text. Do not summarise it.
3. `meeting_start` with `source: "mic"`, `max_minutes: 1`, `wall: true`, and ask the user to say
   a sentence or two and play a few seconds of any audio. If the user gave a scenario directory (a directory on the user's computer, where the engine
   runs; your own sandbox's files are not visible to it), use `source: "replay"`, `scenario: <that directory>`, `speed: 1` instead. If the start is
   refused because the dir is owned, a meeting is already running: perhaps the user's own, in
   another window. Do not stop it. Call `meeting_status`, tell the user a meeting is in progress
   (its `owner` and `runtimeDir`), and ask whether to stop it for the check. Only after a clear
   yes call `meeting_stop` and start again; otherwise end with the verdict **not run: a meeting
   is in progress**.
4. `meeting_poll` with `max_wait_s: 45` and `ack` = the previous result's `cursor`, one after the other, until one returns `capture-dead`
   (about a minute). Never two at once. After the first batch, call `meeting_emit` with
   `{"category":"súgás","zone":"private","text":"AI Plus check"}`. No batch at all means no audio
   reached the engine: say so, then call `meeting_doctor` (after step 5, so the probe has the
   microphone to itself) and report each probe's `verdict` and, for a failed one, its `fix` in the
   user's language. Do not send the user to a terminal: `meeting_doctor` is the same check.
5. `meeting_stop` (without `wall`: the wall stays up for the user, as after any meeting).
6. `meeting_status` again.

Report a table with one row per poll (`outcome`, `waited_s`, number of lines), then the emit
result, the stop output, and every error with its full text. End with one verdict line: **works**,
or **does not work** and the first step that failed.

**When a step fails**, call `meeting_help` with that step's error text (or its code: `error.<code>`,
`capture-permission`, a licence reason such as `missing`). It answers from this engine's
troubleshooting guide. Under the verdict, give the first match's **Fix** and **Who** in the user's
language, and its id (for example `L-1`) so the user can find the entry in `TROUBLESHOOTING.md`.
Offer its **Check** only when it reads nothing secret, which the guide guarantees, and never run a
command that would print a key. If `meeting_help` finds nothing, say so, and suggest
`aiplus support-bundle`.
