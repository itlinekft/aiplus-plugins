#!/usr/bin/env node
/**
 * AI+ Kereső launcher — what Claude Desktop starts with the `node` it finds on PATH.
 *
 * The engine needs node:sqlite with FTS5 (Node.js >= 22.19). Many office PCs have an older Node (measured on a
 * Windows test PC 2026-11-01: Node 22.11 has no plain node:sqlite, and with --experimental-sqlite no FTS5). So:
 *   1. If this Node has node:sqlite with FTS5, run the server with it.
 *   2. Else use a portable official Node.js (pinned version, SHA-256 checked) from the data folder; if it is not there
 *      yet, download it once from nodejs.org. While it downloads, answer MCP ourselves (the tool list is static) and
 *      tell Claude to retry in a minute; then hand the session over to the real server.
 * Plain CommonJS, no dependencies, runs on Node >= 16. Logs only to stderr (stdout is the MCP channel).
 */
"use strict";
const { spawn, spawnSync } = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const https = require("node:https");
const os = require("node:os");
const path = require("node:path");
const readline = require("node:readline");

const NODE_VERSION = "24.21.0";
// From https://nodejs.org/dist/v24.21.0/SHASUMS256.txt (read 2026-11-01).
const NODE_SHA256 = {
  "win-x64.zip": "158f7685b44de51f6c0df1d153526cbcd3e1bc739a8dfc607721cef75de9e541",
  "win-arm64.zip": "8779b1bde1d39f8d420e3b57aa657b39891af434d3de44a919044cec06785921",
  "darwin-arm64.tar.gz": "bed7eea5325e1108f32ce5228ddd6a5f0f08a499ee42aa7442aea583702f6057",
  "darwin-x64.tar.gz": "1462cb3b3046b815cf8ea436d3da450ec1a9f11dac7e5a46b0ada5305d7e8097",
  "linux-x64.tar.gz": "6e1db87ef58b8819e5d5402eff1536491b18edd8eb7bee5ef7897876e88dc5ff",
  "linux-arm64.tar.gz": "724282c3b43aec998aa9527380465b45d229e021b58035f5f4f63095eabfe5d5",
};

const SERVER = path.join(__dirname, "aiplus-kereso.mjs");
// How long a tool call waits for the first runtime download before the stand-in answers „try again”.
const HOLD_MS = 50000;
const TOOLS_JSON = path.join(__dirname, "tools.json");
const args = process.argv.slice(2);

function log(level, msg) {
  process.stderr.write(`${new Date().toISOString()} ${level} [launcher] ${msg}\n`);
}

function dataDir() {
  if (process.env.AIPLUS_KERESO_HOME) return path.resolve(process.env.AIPLUS_KERESO_HOME);
  if (process.platform === "win32") return path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local"), "aiplus-kereso");
  if (process.platform === "darwin") return path.join(os.homedir(), "Library", "Application Support", "aiplus-kereso");
  return path.join(process.env.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share"), "aiplus-kereso");
}

/** Does THIS Node have node:sqlite with FTS5? Checked in a child so a missing module or a warning cannot hurt us. */
function nodeHasFts5(exe) {
  const probe = "const {DatabaseSync}=require('node:sqlite');const d=new DatabaseSync(':memory:');d.exec(\"create virtual table t using fts5(a, tokenize='porter unicode61')\");process.stdout.write('ok')";
  const r = spawnSync(exe, ["--no-warnings", "-e", probe], { encoding: "utf8", timeout: 15000, windowsHide: true });
  return r.status === 0 && r.stdout === "ok";
}

function platformKey() {
  const arch = process.arch === "arm64" ? "arm64" : "x64";
  if (process.platform === "win32") return `win-${arch}.zip`;
  if (process.platform === "darwin") return `darwin-${arch}.tar.gz`;
  return `linux-${arch}.tar.gz`;
}

function portableExe() {
  const key = platformKey();
  const dirName = `node-v${NODE_VERSION}-${key.replace(/\.(zip|tar\.gz)$/, "")}`;
  const dir = path.join(dataDir(), "runtime", dirName);
  return { key, dir, dirName, exe: process.platform === "win32" ? path.join(dir, "node.exe") : path.join(dir, "bin", "node") };
}

function download(url, dest, redirects) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { "user-agent": "aiplus-kereso-launcher" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && (redirects || 0) < 5) {
        res.resume();
        resolve(download(new URL(res.headers.location, url).toString(), dest, (redirects || 0) + 1));
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const out = fs.createWriteStream(dest);
      res.pipe(out);
      out.on("finish", () => out.close(() => resolve()));
      out.on("error", reject);
    });
    req.on("error", reject);
    req.setTimeout(120000, () => req.destroy(new Error("download timed out")));
  });
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

/** Download, verify and unpack the portable Node.js into <data>/runtime/. */
async function installPortable() {
  const p = portableExe();
  const root = path.join(dataDir(), "runtime");
  fs.mkdirSync(root, { recursive: true });
  const file = `node-v${NODE_VERSION}-${p.key}`;
  const tmp = path.join(root, `${file}.${process.pid}.part`);
  const url = `https://nodejs.org/dist/v${NODE_VERSION}/${file}`;
  log("INFO", `downloading ${url} -> ${tmp}`);
  await download(url, tmp);
  const got = sha256(tmp);
  if (got !== NODE_SHA256[p.key]) {
    fs.rmSync(tmp, { force: true });
    throw new Error(`checksum mismatch for ${file}: got ${got}, expected ${NODE_SHA256[p.key]}`);
  }
  const unpack = path.join(root, `unpack-${process.pid}`);
  fs.rmSync(unpack, { recursive: true, force: true });
  fs.mkdirSync(unpack, { recursive: true });
  // tar.exe ships with Windows 10 1803+ and reads zip; PowerShell's Expand-Archive is the fallback.
  let r = spawnSync("tar", ["-xf", tmp, "-C", unpack], { encoding: "utf8", windowsHide: true });
  if (r.status !== 0 && process.platform === "win32") {
    log("WARN", `tar failed (${(r.stderr || "").trim()}), trying PowerShell Expand-Archive`);
    r = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", `Expand-Archive -LiteralPath '${tmp.replace(/'/g, "''")}' -DestinationPath '${unpack.replace(/'/g, "''")}' -Force`], { encoding: "utf8", windowsHide: true });
  }
  if (r.status !== 0) throw new Error(`unpack failed: ${(r.stderr || "").trim()}`);
  fs.rmSync(p.dir, { recursive: true, force: true });
  fs.renameSync(path.join(unpack, p.dirName), p.dir);
  fs.rmSync(unpack, { recursive: true, force: true });
  fs.rmSync(tmp, { force: true });
  if (!nodeHasFts5(p.exe)) throw new Error(`the portable Node.js at ${p.exe} has no node:sqlite with FTS5`);
  log("INFO", `portable Node.js ${NODE_VERSION} ready at ${p.exe}`);
  return p.exe;
}

function serverArgs() {
  return ["--no-warnings", SERVER, ...(args.length ? args : ["mcp"])];
}

/** Hand the process over: the server inherits stdio, we mirror its exit. */
function runDirect(exe) {
  log("INFO", `starting server with ${exe}`);
  const child = spawn(exe, serverArgs(), { stdio: "inherit", windowsHide: true });
  child.on("exit", (code, signal) => {
    log("INFO", `server exited code=${code} signal=${signal}`);
    process.exit(code === null ? 1 : code);
  });
  for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => child.kill(sig));
}

/** Answer MCP ourselves until the runtime is ready, then forward everything to the real server. */
function runWithStub(installing) {
  const tools = JSON.parse(fs.readFileSync(TOOLS_JSON, "utf8"));
  let initReq = null;
  let child = null;
  let failure = null;
  const send = (m) => process.stdout.write(`${JSON.stringify(m)}\n`);
  const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });

  const held = new Map();
  const failureText = () =>
    `Az AI+ Kereső nem tudta letölteni a futtatókörnyezetét (Node.js ${NODE_VERSION}): ${failure}. Megoldás: telepítsd a Node.js LTS-t a nodejs.org-ról (22.19 vagy újabb), majd indítsd újra a Claude-ot.`;
  const stub = (line) => {
    let req;
    try {
      req = JSON.parse(line);
    } catch (e) {
      return;
    }
    const hasId = req.id !== undefined && req.id !== null;
    if (req.method === "initialize") {
      initReq = req;
      const v = req.params && req.params.protocolVersion;
      send({ jsonrpc: "2.0", id: req.id, result: { protocolVersion: v || "2025-06-18", capabilities: { tools: { listChanged: false } }, serverInfo: { name: "aiplus-kereso", version: "launcher" } } });
    } else if (req.method === "tools/list") send({ jsonrpc: "2.0", id: req.id, result: { tools } });
    else if (req.method === "ping") send({ jsonrpc: "2.0", id: req.id, result: {} });
    else if (req.method === "tools/call") {
      if (failure) {
        send({ jsonrpc: "2.0", id: req.id, result: { content: [{ type: "text", text: failureText() }], isError: true } });
        return;
      }
      // Hold the call: a first download usually finishes within the wait, and then the real server answers it
      // (a „set the folder” call must not be lost — measured on a Windows test PC, 2026-11-01). Past the wait, say so.
      const timer = setTimeout(() => {
        held.delete(req.id);
        send({ jsonrpc: "2.0", id: req.id, result: { content: [{ type: "text", text: `Az AI+ Kereső első indításkor letölti a futtatókörnyezetét (hivatalos Node.js ${NODE_VERSION}, kb. 30 MB, a nodejs.org-ról, ellenőrzött). Még tart; próbáld újra egy perc múlva.` }], isError: true } });
      }, HOLD_MS);
      held.set(req.id, { line, timer });
    } else if (hasId && !String(req.method).startsWith("notifications/")) send({ jsonrpc: "2.0", id: req.id, error: { code: -32601, message: `method not found: ${req.method}` } });
  };

  rl.on("line", (line) => {
    if (!line.trim()) return;
    if (child) child.stdin.write(`${line}\n`);
    else stub(line);
  });
  rl.on("close", () => {
    if (child) child.stdin.end();
    else process.exit(0);
  });

  installing
    .then((exe) => {
      log("INFO", `switching to the server on ${exe}`);
      child = spawn(exe, serverArgs(), { stdio: ["pipe", "pipe", "inherit"], windowsHide: true });
      const out = readline.createInterface({ input: child.stdout, crlfDelay: Infinity });
      let swallowId = null;
      if (initReq) {
        // Replay the client's handshake to the real server and drop its answer: the client already has ours.
        swallowId = `launcher-init-${process.pid}`;
        child.stdin.write(`${JSON.stringify({ ...initReq, id: swallowId })}\n`);
        child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" })}\n`);
      }
      for (const [hid, h] of held) {
        clearTimeout(h.timer);
        child.stdin.write(`${h.line}\n`);
        held.delete(hid);
      }
      out.on("line", (l) => {
        if (swallowId && l.includes(`"${swallowId}"`)) {
          swallowId = null;
          return;
        }
        process.stdout.write(`${l}\n`);
      });
      child.on("exit", (code) => {
        log("INFO", `server exited code=${code}`);
        process.exit(code === null ? 1 : code);
      });
    })
    .catch((e) => {
      failure = e.message;
      log("ERROR", `runtime install failed: ${e.stack || e}`);
      for (const [hid, h] of held) {
        clearTimeout(h.timer);
        send({ jsonrpc: "2.0", id: hid, result: { content: [{ type: "text", text: failureText() }], isError: true } });
        held.delete(hid);
      }
    });
}

function main() {
  if (args[0] === "--version") {
    process.stdout.write(`aiplus-kereso launcher (portable Node.js ${NODE_VERSION})\n`);
    return;
  }
  log("INFO", `node=${process.version} exec=${process.execPath} platform=${process.platform}-${process.arch} cwd=${process.cwd()}`);
  if (process.env.AIPLUS_KERESO_FORCE_PORTABLE !== "1" && nodeHasFts5(process.execPath)) return runDirect(process.execPath);
  const p = portableExe();
  if (fs.existsSync(p.exe) && nodeHasFts5(p.exe)) return runDirect(p.exe);
  log("WARN", `this Node (${process.version}) has no node:sqlite with FTS5; installing portable Node.js ${NODE_VERSION}`);
  runWithStub(installPortable());
}

main();
