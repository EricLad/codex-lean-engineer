'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lean-engineer-test-'));
process.env.PLUGIN_DATA = tmp;

const runtime = require('../hooks/runtime');
const { instructionsFor } = require('../hooks/instructions');
const { parseCommand } = require('../hooks/mode-tracker');

test('mode defaults to normal and persists valid values', () => {
  assert.equal(runtime.readMode(), 'normal');
  assert.equal(runtime.writeMode('strict'), 'strict');
  assert.equal(runtime.readMode(), 'strict');
  assert.equal(runtime.writeMode('off'), 'off');
  assert.equal(runtime.readMode(), 'off');
});

test('invalid mode normalizes to normal', () => {
  assert.equal(runtime.normalizeMode('wat'), 'normal');
});

test('command parser accepts long and short forms', () => {
  assert.equal(parseCommand('/lean-engineer strict'), 'strict');
  assert.equal(parseCommand('/lean normal'), 'normal');
  assert.equal(parseCommand('/lean-engineer off'), 'off');
  assert.equal(parseCommand('/lean-engineer'), 'status');
  assert.equal(parseCommand('please use lean'), null);
});

test('strict instructions extend normal instructions', () => {
  const normal = instructionsFor('normal');
  const strict = instructionsFor('strict');
  assert.match(normal, /UNDERSTAND -> SCOPE -> SIMPLIFY -> IMPLEMENT -> VERIFY/);
  assert.match(normal, /Security, data integrity/);
  assert.ok(strict.length > normal.length);
  assert.match(strict, /STRICT MODE additions/);
  assert.equal(instructionsFor('off'), '');
});
