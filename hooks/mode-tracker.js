#!/usr/bin/env node
'use strict';

const { emitContext, readMode, readStdin, writeMode } = require('./runtime');
const { instructionsFor } = require('./instructions');

function parseCommand(prompt) {
  const text = String(prompt || '').trim().toLowerCase();
  const match = text.match(/^\/(?:lean-engineer|lean)(?:\s+(normal|strict|off))?\b/);
  if (!match) return null;
  return match[1] || 'status';
}

async function main() {
  try {
    const raw = await readStdin();
    const data = raw ? JSON.parse(raw.replace(/^\uFEFF/, '')) : {};
    const command = parseCommand(data.prompt);
    if (!command) return;

    if (command === 'status') {
      const mode = readMode();
      emitContext(
        'UserPromptSubmit',
        mode,
        mode === 'off' ? '' : instructionsFor(mode),
        `Lean Engineer mode: ${mode}`
      );
      return;
    }

    const mode = writeMode(command);
    emitContext(
      'UserPromptSubmit',
      mode,
      mode === 'off' ? '' : instructionsFor(mode),
      `Lean Engineer mode changed to ${mode}`
    );
  } catch (_) {
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, parseCommand };
