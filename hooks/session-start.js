#!/usr/bin/env node
'use strict';

const { emitContext, readMode, writeMode } = require('./runtime');
const { instructionsFor } = require('./instructions');

try {
  const mode = writeMode(readMode());
  if (mode === 'off') process.exit(0);
  emitContext(
    'SessionStart',
    mode,
    instructionsFor(mode),
    `LEAN-ENGINEER:${mode.toUpperCase()}`
  );
} catch (_) {
  process.exit(0);
}
