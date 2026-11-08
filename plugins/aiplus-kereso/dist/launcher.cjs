#!/usr/bin/env node
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

var frame_exports = {};
__export(frame_exports, {
  CONTRACT_VERSION: () => CONTRACT_VERSION,
  MAX_LINE_BYTES: () => MAX_LINE_BYTES,
  RPC: () => RPC,
  SUPPORTED_PROTOCOLS: () => SUPPORTED_PROTOCOLS,
  initializeResult: () => initializeResult,
  negotiate: () => negotiate,
  parseFrame: () => parseFrame,
  validateArgs: () => validateArgs
});
function parseFrame(line) {
  if (!line.trim()) return null;
  if (Buffer.byteLength(line, "utf8") > MAX_LINE_BYTES) return { kind: "invalid", id: null, error: RPC.invalid };
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    return { kind: "invalid", id: null, error: RPC.parse };
  }
  if (!isObject(msg)) return { kind: "invalid", id: null, error: RPC.invalid };
  const hasId = has(msg, "id");
  const id = hasId && isId(msg.id) ? msg.id : null;
  if (hasId && id === null) return { kind: "invalid", id: null, error: RPC.invalid };
  if (msg.jsonrpc !== "2.0" || typeof msg.method !== "string") return { kind: "invalid", id, error: RPC.invalid };
  if (msg.params !== void 0 && !isObject(msg.params)) return { kind: "invalid", id, error: RPC.invalid };
  const params = msg.params ?? {};
  return id === null ? { kind: "notification", method: msg.method, params } : { kind: "request", id, method: msg.method, params };
}
function negotiate(asked) {
  return typeof asked === "string" && SUPPORTED_PROTOCOLS.includes(asked) ? asked : SUPPORTED_PROTOCOLS[0];
}
function initializeResult(info, asked) {
  return {
    protocolVersion: negotiate(asked),
    capabilities: { tools: { listChanged: false } },
    serverInfo: { name: info.name, version: info.version, contractVersion: CONTRACT_VERSION },
    ...info.instructions ? { instructions: info.instructions } : {}
  };
}
function validateArgs(schema, args2) {
  var _a;
  const props = schema.properties ?? {};
  const known = Object.keys(props);
  if (Object.keys(args2).some((k) => !has(props, k))) return { key: known.length ? "ismeretlen_mezo" : "nincs_mezo", fields: known };
  for (const r of schema.required ?? []) if (args2[r] === void 0) return { key: "hianyzo_mezo", fields: [r] };
  for (const [k, v] of Object.entries(args2)) {
    const want = (_a = props[k]) == null ? void 0 : _a.type;
    const ok = want === "string" ? typeof v === "string" : want === "integer" ? typeof v === "number" && Number.isInteger(v) : want === "number" ? typeof v === "number" : want === "boolean" ? typeof v === "boolean" : true;
    if (!ok) return { key: "rossz_tipus", fields: [k], want };
  }
  return null;
}
var CONTRACT_VERSION, MAX_LINE_BYTES, SUPPORTED_PROTOCOLS, RPC, isObject, has, isId;
var init_frame = __esm({
  "src/frame.ts"() {
    "use strict";
    CONTRACT_VERSION = 1;
    MAX_LINE_BYTES = 4 * 1024 * 1024;
    SUPPORTED_PROTOCOLS = ["2025-06-18", "2025-03-26", "2024-11-05"];
    RPC = {
      parse: { code: -32700, message: "Parse error" },
      invalid: { code: -32600, message: "Invalid Request" },
      method: { code: -32601, message: "Method not found" },
      params: { code: -32602, message: "Invalid params" },
      internal: { code: -32603, message: "Internal error" }
    };
    isObject = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
    has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
    isId = (v) => typeof v === "string" || typeof v === "number" && Number.isSafeInteger(v);
  }
});

var { spawn, spawnSync } = require("node:child_process");
var crypto = require("node:crypto");
var fs = require("node:fs");
var https = require("node:https");
var os = require("node:os");
var path = require("node:path");
var readline = require("node:readline");
var { initializeResult: initializeResult2, parseFrame: parseFrame2, RPC: RPC2 } = (init_frame(), __toCommonJS(frame_exports));
var NODE_VERSION = "24.21.0";
var NODE_SHA256 = {
  "win-x64.zip": "158f7685b44de51f6c0df1d153526cbcd3e1bc739a8dfc607721cef75de9e541",
  "win-arm64.zip": "8779b1bde1d39f8d420e3b57aa657b39891af434d3de44a919044cec06785921",
  "darwin-arm64.tar.gz": "bed7eea5325e1108f32ce5228ddd6a5f0f08a499ee42aa7442aea583702f6057",
  "darwin-x64.tar.gz": "1462cb3b3046b815cf8ea436d3da450ec1a9f11dac7e5a46b0ada5305d7e8097",
  "linux-x64.tar.gz": "6e1db87ef58b8819e5d5402eff1536491b18edd8eb7bee5ef7897876e88dc5ff",
  "linux-arm64.tar.gz": "724282c3b43aec998aa9527380465b45d229e021b58035f5f4f63095eabfe5d5"
};
var SERVER = path.join(__dirname, "aiplus-kereso.mjs");
var HOLD_MS = 5e4;
var TOOLS_JSON = path.join(__dirname, "tools.json");
var SERVER_INFO_JSON = path.join(__dirname, "server-info.json");
var args = process.argv.slice(2);
function log(level, msg) {
  process.stderr.write(`${(/* @__PURE__ */ new Date()).toISOString()} ${level} [launcher] ${msg}
`);
}
function dataDir() {
  if (process.env.AIPLUS_KERESO_HOME) return path.resolve(process.env.AIPLUS_KERESO_HOME);
  if (process.platform === "win32") return path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local"), "aiplus-kereso");
  if (process.platform === "darwin") return path.join(os.homedir(), "Library", "Application Support", "aiplus-kereso");
  return path.join(process.env.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share"), "aiplus-kereso");
}
function nodeHasFts5(exe) {
  const probe = `const {DatabaseSync}=require('node:sqlite');const d=new DatabaseSync(':memory:');d.exec("create virtual table t using fts5(a, tokenize='porter unicode61')");process.stdout.write('ok')`;
  const r = spawnSync(exe, ["--no-warnings", "-e", probe], { encoding: "utf8", timeout: 15e3, windowsHide: true });
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
    req.setTimeout(12e4, () => req.destroy(new Error("download timed out")));
  });
}
function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}
async function installPortable() {
  const p = portableExe();
  const root = path.join(dataDir(), "runtime");
  fs.mkdirSync(root, { recursive: true });
  const file = `node-v${NODE_VERSION}-${p.key}`;
  const tmp = path.join(root, `${file}.${process.pid}.part`);
  const url = `https://nodejs.org/dist/v${NODE_VERSION}/${file}`;
  log("INFO", `downloading ${url}`);
  await download(url, tmp);
  const got = sha256(tmp);
  if (got !== NODE_SHA256[p.key]) {
    fs.rmSync(tmp, { force: true });
    throw new Error(`checksum mismatch for ${file}: got ${got}, expected ${NODE_SHA256[p.key]}`);
  }
  const unpack = path.join(root, `unpack-${process.pid}`);
  fs.rmSync(unpack, { recursive: true, force: true });
  fs.mkdirSync(unpack, { recursive: true });
  let r = spawnSync("tar", ["-xf", tmp, "-C", unpack], { encoding: "utf8", windowsHide: true });
  if (r.status !== 0 && process.platform === "win32") {
    log("WARN", `tar failed (exit ${r.status}), trying PowerShell Expand-Archive`);
    r = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", `Expand-Archive -LiteralPath '${tmp.replace(/'/g, "''")}' -DestinationPath '${unpack.replace(/'/g, "''")}' -Force`], { encoding: "utf8", windowsHide: true });
  }
  if (r.status !== 0) throw new Error(`unpack failed: ${(r.stderr || "").trim()}`);
  fs.rmSync(p.dir, { recursive: true, force: true });
  fs.renameSync(path.join(unpack, p.dirName), p.dir);
  fs.rmSync(unpack, { recursive: true, force: true });
  fs.rmSync(tmp, { force: true });
  if (!nodeHasFts5(p.exe)) throw new Error(`the portable Node.js at ${p.exe} has no node:sqlite with FTS5`);
  log("INFO", `portable Node.js ${NODE_VERSION} ready`);
  return p.exe;
}
function serverArgs() {
  return ["--no-warnings", SERVER, ...args.length ? args : ["mcp"]];
}
function runDirect(exe) {
  log("INFO", `starting server (${exe === process.execPath ? "this Node" : "portable Node"})`);
  const child = spawn(exe, serverArgs(), { stdio: "inherit", windowsHide: true });
  child.on("exit", (code, signal) => {
    log("INFO", `server exited code=${code} signal=${signal}`);
    process.exit(code === null ? 1 : code);
  });
  for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => child.kill(sig));
}
function runWithStub(installing) {
  const tools = JSON.parse(fs.readFileSync(TOOLS_JSON, "utf8"));
  const toolNames = new Set(tools.map((t) => t.name));
  const info = JSON.parse(fs.readFileSync(SERVER_INFO_JSON, "utf8"));
  let initReq = null;
  let child = null;
  let failed = false;
  let closing = false;
  const send = (m) => process.stdout.write(`${JSON.stringify(m)}
`);
  const drainExit = (code) => process.stdout.write("", () => process.exit(code));
  const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
  const held = /* @__PURE__ */ new Map();
  const toolError = (id, text) => send({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text }], isError: true } });
  const failureText = () => `Az AI+ Keres\u0151 nem tudta let\xF6lteni a futtat\xF3k\xF6rnyezet\xE9t (Node.js ${NODE_VERSION}). Megold\xE1s: telep\xEDtsd a Node.js LTS-t a nodejs.org-r\xF3l (22.19 vagy \xFAjabb), majd ind\xEDtsd \xFAjra a Claude-ot.`;
  const waitText = () => `Az AI+ Keres\u0151 els\u0151 ind\xEDt\xE1skor let\xF6lti a futtat\xF3k\xF6rnyezet\xE9t (hivatalos Node.js ${NODE_VERSION}, kb. 30 MB, a nodejs.org-r\xF3l, ellen\u0151rz\xF6tt). M\xE9g tart; pr\xF3b\xE1ld \xFAjra egy perc m\xFAlva.`;
  const maybeEnd = () => {
    if (closing && !child && !held.size) drainExit(0);
  };
  const stub = (line) => {
    const f = parseFrame2(line);
    if (!f) return;
    if (f.kind === "invalid") return send({ jsonrpc: "2.0", id: f.id, error: f.error });
    if (f.kind === "notification") return;
    if (f.method === "initialize") {
      initReq = { jsonrpc: "2.0", id: f.id, method: f.method, params: f.params };
      send({ jsonrpc: "2.0", id: f.id, result: initializeResult2(info, f.params.protocolVersion) });
    } else if (f.method === "tools/list") send({ jsonrpc: "2.0", id: f.id, result: { tools } });
    else if (f.method === "ping") send({ jsonrpc: "2.0", id: f.id, result: {} });
    else if (f.method === "tools/call") {
      const a = f.params.arguments;
      if (typeof f.params.name !== "string" || !toolNames.has(f.params.name) || a !== void 0 && (typeof a !== "object" || a === null || Array.isArray(a))) {
        return send({ jsonrpc: "2.0", id: f.id, error: RPC2.params });
      }
      if (failed) return toolError(f.id, failureText());
      const timer = setTimeout(() => {
        held.delete(f.id);
        toolError(f.id, waitText());
        maybeEnd();
      }, HOLD_MS);
      const prev = held.get(f.id);
      if (prev) clearTimeout(prev.timer);
      held.set(f.id, { line, timer });
    } else send({ jsonrpc: "2.0", id: f.id, error: RPC2.method });
  };
  rl.on("line", (line) => {
    if (child) child.stdin.write(`${line}
`);
    else stub(line);
  });
  rl.on("close", () => {
    closing = true;
    if (child) child.stdin.end();
    else maybeEnd();
  });
  installing.then((exe) => {
    log("INFO", "switching to the server on the portable Node");
    child = spawn(exe, serverArgs(), { stdio: ["pipe", "pipe", "inherit"], windowsHide: true });
    child.on("error", (e) => {
      log("ERROR", `server could not start: ${e && e.code ? e.code : "error"}`);
      drainExit(1);
    });
    const out = readline.createInterface({ input: child.stdout, crlfDelay: Infinity });
    let swallowId = null;
    if (initReq) {
      swallowId = `launcher-init-${process.pid}`;
      child.stdin.write(`${JSON.stringify({ ...initReq, id: swallowId })}
`);
      child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" })}
`);
    }
    for (const [hid, h] of held) {
      clearTimeout(h.timer);
      child.stdin.write(`${h.line}
`);
      held.delete(hid);
    }
    if (closing) child.stdin.end();
    out.on("line", (l) => {
      if (swallowId && l.includes(`"${swallowId}"`)) {
        swallowId = null;
        return;
      }
      process.stdout.write(`${l}
`);
    });
    let exitCode = null;
    child.on("exit", (code) => {
      log("INFO", `server exited code=${code}`);
      exitCode = code === null ? 1 : code;
    });
    out.on("close", () => {
      if (exitCode !== null) drainExit(exitCode);
      else child.once("exit", (code) => drainExit(code === null ? 1 : code));
    });
  }).catch((e) => {
    failed = true;
    log("ERROR", `runtime install failed: ${e && e.name ? e.name : typeof e}${e && e.code ? `/${e.code}` : ""}`);
    for (const [hid, h] of held) {
      clearTimeout(h.timer);
      toolError(hid, failureText());
      held.delete(hid);
    }
    maybeEnd();
  });
}
function main() {
  if (args[0] === "--version") {
    process.stdout.write(`aiplus-kereso launcher (portable Node.js ${NODE_VERSION})
`);
    return;
  }
  log("INFO", `node=${process.version} platform=${process.platform}-${process.arch}`);
  if (process.env.AIPLUS_KERESO_FORCE_PORTABLE !== "1" && nodeHasFts5(process.execPath)) return runDirect(process.execPath);
  const p = portableExe();
  if (fs.existsSync(p.exe) && nodeHasFts5(p.exe)) return runDirect(p.exe);
  log("WARN", `this Node (${process.version}) has no node:sqlite with FTS5; installing portable Node.js ${NODE_VERSION}`);
  runWithStub(installPortable());
}
main();
