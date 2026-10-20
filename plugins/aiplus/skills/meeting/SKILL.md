---
name: meeting
description: Run the AI+ Meeting Assistant live — start capturing the meeting audio, follow the transcript, react on the monitor wall, and stop with a summary. Use when the user asks to start, follow or stop a meeting.
allowed-tools: mcp__aiplus__meeting_policy, mcp__aiplus__meeting_start, mcp__aiplus__meeting_poll, mcp__aiplus__meeting_emit, mcp__aiplus__meeting_stop, mcp__aiplus__meeting_licence, mcp__aiplus__meeting_voice, mcp__aiplus__meeting_echo, mcp__aiplus__meeting_gateway, mcp__aiplus__meeting_speech, mcp__aiplus__meeting_name, mcp__aiplus__meeting_status, mcp__aiplus__meeting_doctor, mcp__aiplus__meeting_document, mcp__aiplus__meeting_help
---

<!-- aiplus:block:start -->
> **AI+ Meeting Assistant plugin 0.4.17** · tool contract 10. If the user asks which version you are on, answer with this line.
>
> **Before anything else, call `meeting_status`.**
> - **The tool does not exist** → the AI+ Meeting Assistant engine is not registered in Claude Desktop. Tell the user to run the AI+ Meeting Assistant installer, then restart Claude Desktop completely. Do not try to work without the tools. If you are a Cowork task running in the cloud rather than on the user's computer, reinstalling will not help: a cloud task cannot reach the engine on the user's computer, so say that the meeting assistant needs a task on their own computer.
> - **`contractVersion` is not 10** → the engine and this plugin do not match. If it is higher, the plugin needs an update (the marketplace's Update, or a new plugin zip); if lower, the engine needs one (the AI+ Meeting Assistant installer). Say which, and stop.
> - **Otherwise** continue below.
<!-- aiplus:block:end -->

# Live meeting

This skill holds the **mechanics** only. What is worth saying, drawing or flagging comes from the
engine's policy, which you load in step 1 and follow for the whole meeting.

## 1. Load the policy

Call `meeting_policy` once. Read it fully; it is your instruction set for this meeting. Do not
quote or summarise it to the user.

## 2. Start

**The meeting's knowledge first.** If documents are attached to this session or the chat (a Cowork
folder, files, pasted notes), read them and pass a brief as `knowledge`:
`{ "summary": "<what the meeting is about, a few sentences>", "topics": [{ "topic": "<label>",
"words": ["<the stems people will say>"] }], "decisions": [{ "id": "<the document's id>", "text":
"<the decision>" }] }`. Give each topic the beginnings of the words people will actually say, so
every inflected form matches ("szállítólev" for szállítólevél, szállítólevelet). The engine indexes
this, so the transcript lines carry `topics`. Without attached documents, start without it: the
meeting then has no knowledge base, and you say so in the start line.

**The preset.** If the user says the meeting is with a client or customer ("ügyféltalálkozó"),
pass `preset: "client"`: the public wall and the alerts get tighter. For our own meetings pass
nothing. If you cannot tell and the wall will be shared, ask in one line before starting. If the
result's `policy` says the policy changed, call `meeting_policy` again before the first poll.

Call `meeting_start` with `source: "mic"` and `wall: true`, plus `max_minutes` if the user named a
length, and `knowledge` when you have one. Then, without being asked:

- **Open the operator console.** The result's `wall.consoleUrl` is a one-time link to the
  operator's console, Live tab. Open it at once in the desktop app's built-in browser, in the
  side panel (its `preview_start` tool with that `url`), because it expires in two minutes. Never
  through the Claude in Chrome extension or another browser: it is slow, and each of its
  steps may ask for approval.
  **Never paste it into the chat**: it opens the private views. For a later opening, or another
  tab, get a fresh one from `meeting_status`. If the panel shows something else, tell the user
  that Cmd+Shift+B (Ctrl+Shift+B on Windows) brings the browser back.
- **A tool asks for approval?** When a meeting tool's call waits for the user's approval in the
  Claude window, ask them to click **Always allow** for it, once: the meeting's tools then never ask
  again, and nobody in the meeting has to watch this window. If the engine reports
  `capture-approval-wait`, an approval was waiting and the meeting heard nothing back: say the same.
- **Tell the user in one line** that capture is running and what is on (the result's `settings`:
  the voice and which voice), and that the console is open beside the chat.
- **The public wall** (`wall.url` + `/wall`) is the one to share in a call. Give it only when the
  user wants to show the meeting to others.
- **No built-in browser here?** Then say in one line that the console needs the side panel (Cowork
  or the Code tab), and paste nothing private.
If the start is refused because a capture already owns the runtime dir, tell the user which process
owns it and ask whether to stop it; do not stop it on your own.

## 3. The loop

Call `meeting_poll` with `max_wait_s: 45`. When it returns, act on the batch as the policy says,
then call `meeting_poll` again with `ack` set to the `cursor` of the result you just received. Keep
exactly **one** poll in flight; never start a second. Claude Desktop cuts a tool call at 60 s; a
result it cut never reached you, and the `ack` is what makes the engine send those lines again.

- `batch` → react per the policy, then poll again.
- `timeout` → poll again, say nothing.
- `capture-dead` → the capture has ended; its `reason` says why (a terminal, you, the length limit…): say that as it is, never as a fault, then go to step 4. If the stop there returns `ended` with `files`, name those files: the transcript was already handed over.
- `not-started` → the start did not take; report it and stop.
- An error → report its full text once, then poll again; after three errors in a row, stop and
  report. When you stop on an error, or a start is refused, call `meeting_help` with the error text
  and give the user the entry's Fix and Who in one or two lines.

Do not end your turn while the capture runs: the poll is how the meeting reaches you.

**On Claude Desktop:**
- **The wall.** Where the policy says to draw through a `fork` and your agent types have no `fork`,
  call `meeting_emit` yourself with the same event. Everything the policy calls `wall-emit` is
  `meeting_emit`.
- **Remote speakers.** Lines from the call audio carry a `voice` (`system:1`, `system:2`). When the
  user tells you who one is ("a kettes az Anna"), call `meeting_name` with that voice and name;
  from then on every line from it, earlier ones included, carries the name. Never guess a name.
- **No shell commands.** Do not run shell commands for notifications or anything else in this
  loop. If the policy asks for a desktop notification, put it on the wall's private zone instead.
- **Status reminders.** When the host asks you to say what you are doing, answer with one line,
  `listening — <n> polls`, and poll again.
- **Results saved to a file.** If a poll result says it was saved to a file because it was too
  large, read that file before the next poll. It is the batch.

**Voice.** The engine can say the reactions aloud (off by default). When the user asks you to
speak, to be quiet, or to say everything, call `meeting_voice` (`enabled`, `speak: ["all"]`, or a
`voice`) and confirm in one line; then poll again. Two named voices ship: `voice: "female"` is
Marta (the default), `voice: "male"` is Adrian; use them when the user asks for a female or male
voice. A spoken "asszisztens beszélj", "asszisztens csend", "asszisztens női hang", "asszisztens
férfi hang", "válts női hangra", "válts férfi hangra" or "női / férfi hangot kérek" is handled by
the engine itself: do nothing about that line. Everyone in the room hears the
voice, so mention it once when it is turned on.

**Speech recognition.** When the user asks to switch recognition during the meeting, call
`meeting_speech` with `backend: "whisper"` (on this machine, free, slower) or `"soniox"` (in the
cloud) and confirm in one line. The meeting goes on in the same transcript; a refusal names what is
missing, and then the meeting keeps its recognition. A spoken "asszisztens lokális felismerés" or
"asszisztens felhős felismerés" is handled by the engine itself: do nothing about that line.

**Privacy gateway.** Your own engine calls (the quick spoken acknowledgement) go through the
privacy gateway, "the box", exactly when Claude Desktop does, unless the user switches it for
this meeting. When the user asks to run with or without the box, or asks where the calls go, call
`meeting_gateway` (`mode: "on"`, `"off"` or `"follow-desktop"`, or no argument to read it) and
answer in one line with the `route` and its `reason`. `blocked` means the box was asked for and
cannot be reached: nothing is sent, say so plainly. The speech service's audio and transcription
never pass through the box; do not claim otherwise.

**Settings.** When the user asks about your settings or configuration, call `meeting_status` and
answer from its `settings` list: each setting, whether it is on, and the phrase that switches it
(for example the echo filter: "asszisztens visszhangszűrő be / ki"). A spoken echo-filter phrase is
handled by the engine itself, like the voice phrases: do nothing about that line.

**The console is two surfaces** (aip-198), each in a panel of its own. `wall.consoleUrl` is the
meeting surface: Live, Transcript, Prompts (your private cards) and Memo (the saved meeting files).
`wall.adminUrl` is the admin page: Settings and System. When the user asks for one of the meeting
tabs, open a fresh `consoleUrl` from `meeting_status` with `/console/live` replaced by
`/console/transcript`, `/console/prompts` or `/console/memo`, keeping the `?t=` part. When they ask
for the settings or the system information, open a fresh `adminUrl` in a separate panel
(`/admin/system` for the system page), so the meeting surface stays open. A change in Settings asks
for the password the user set at install. You never ask for it and never type it. A `settings-changed`
event in a batch means the change is already in effect: acknowledge it in one line.

**Paths are on the user's machine.** Paths in tool results (`runtimeDir`, the memo's files, the
archived transcript) are on the computer where the engine runs. Your own shell or file tools may
run somewhere else (in Cowork they run in an isolated machine) and cannot open them. Never try to
read such a path: show files through the console's Memo tab, and name a path only so the user can
find it.

**Another conversation's meeting.** If `meeting_start` or `meeting_poll` is refused because another
conversation's server runs or follows a meeting here, tell the user whose and since when, as the
refusal says. Do not stop it unless the user says so: it may be their real meeting.

## 4. Stop

Write the closing summary the policy asks for **first**. Then call `meeting_stop` — without
`wall`: the wall and its console stay up, so the user can still open and save the transcript and
the memo there. Tell the user where the transcript was saved (also as Word and PDF), and that the
console keeps the meeting until they ask to close the wall. Only when they ask, call
`meeting_stop` with `wall: true`.

Then the memo: call `meeting_document` without arguments for the template, write the meeting memo
from what you followed (fill only what was said; mark gaps, such as a channel that dropped out), and
call `meeting_document` with it as `markdown`. Tell the user the memo's Word and PDF paths.

If the user asks to stop early, do the same: summary, then `meeting_stop`. A `meeting-close` event is that request, spoken (aip-230): act on it at once. A `meeting-closed` event means the engine already stopped the capture after the close: do not start it again; write the summary and call `meeting_stop` to hand the transcript over.
