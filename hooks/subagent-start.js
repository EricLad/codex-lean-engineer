#!/usr/bin/env node
'use strict';

const { emitContext, readMode } = require('./runtime');
const { instructionsFor } = require('./instructions');

try {
  const mode = readMode();
  if (mode === 'off') process.exit(0);
  emitContext(
    'SubagentStart',
    mode,
    instructionsFor(mode),
    `LEAN-ENGINEER:${mode.toUpperCase()}`
  );
} catch (_) {
  process.exit(0);
}
