'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const VALID_MODES = new Set(['normal', 'strict', 'off']);
const DEFAULT_MODE = 'normal';

function dataDir() {
  return process.env.PLUGIN_DATA ||
    process.env.CLAUDE_PLUGIN_DATA ||
    path.join(os.homedir(), '.codex', 'lean-engineer');
}

function statePath() {
  return path.join(dataDir(), 'mode');
}

function normalizeMode(value) {
  const mode = String(value || '').trim().toLowerCase();
  return VALID_MODES.has(mode) ? mode : DEFAULT_MODE;
}

function readMode() {
  try {
    return normalizeMode(fs.readFileSync(statePath(), 'utf8'));
  } catch (_) {
    return DEFAULT_MODE;
  }
}

function writeMode(mode) {
  const normalized = normalizeMode(mode);
  fs.mkdirSync(dataDir(), { recursive: true });
  fs.writeFileSync(statePath(), normalized, 'utf8');
  return normalized;
}

function emitContext(event, mode, context, systemMessage) {
  const output = {};
  if (systemMessage) output.systemMessage = systemMessage;
  if (context) {
    output.hookSpecificOutput = {
      hookEventName: event,
      additionalContext: context
    };
  }
  process.stdout.write(JSON.stringify(output));
}

function readStdin(timeoutMs = 800) {
  return new Promise((resolve) => {
    let input = '';
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve(input);
    };
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { input += chunk; });
    process.stdin.on('end', finish);
    process.stdin.on('error', finish);
    const timer = setTimeout(finish, timeoutMs);
    if (typeof timer.unref === 'function') timer.unref();
  });
}

module.exports = {
  DEFAULT_MODE,
  emitContext,
  normalizeMode,
  readMode,
  readStdin,
  writeMode
};
