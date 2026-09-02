'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lean-engineer-test-'));
process.env.PLUGIN_DATA = tmp;

const runtime = require('../hooks/runtime');
const {
  classifySubagentRole,
  instructionsFor,
  instructionsForRole,
  roleFromAgentType,
  roleFromPrompt
} = require('../hooks/instructions');
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

test('implementation instructions preserve the normal lean workflow', () => {
  const normal = instructionsFor('normal');
  const strict = instructionsFor('strict');
  assert.match(normal, /UNDERSTAND -> SCOPE -> SIMPLIFY -> IMPLEMENT -> VERIFY/);
  assert.match(normal, /External workflow boundary/);
  assert.match(normal, /does not silently replace an approved architecture/);
  assert.ok(strict.length > normal.length);
  assert.match(strict, /STRICT MODE additions for implementation/);
  assert.equal(instructionsFor('off'), '');
});

test('agent_type classifies native and custom subagent roles', () => {
  assert.equal(roleFromAgentType('worker'), 'implementation');
  assert.equal(roleFromAgentType('explorer'), 'exploration');
  assert.equal(roleFromAgentType('integration-reviewer'), 'review');
  assert.equal(roleFromAgentType('bug-investigator'), 'investigation');
  assert.equal(roleFromAgentType('default'), 'neutral');
});

test('delegated prompts refine generic subagent roles', () => {
  assert.equal(roleFromPrompt('You are a Reviewer. Review this exact diff and do not edit.'), 'review');
  assert.equal(roleFromPrompt('Role: Explorer. Map dependencies and hot files.'), 'exploration');
  assert.equal(roleFromPrompt('You are a Bug Investigator. Establish root cause first.'), 'investigation');
  assert.equal(roleFromPrompt('You are a Developer. Implement the approved plan.'), 'implementation');
  assert.equal(roleFromPrompt('Please inspect this file.'), 'neutral');
});

test('explicit prompt role overrides a generic or conflicting agent type', () => {
  assert.equal(
    classifySubagentRole({
      agentType: 'worker',
      prompt: 'You are an Integration Reviewer. Review only; do not modify production code.'
    }),
    'review'
  );
  assert.equal(
    classifySubagentRole({ agentType: 'default', prompt: 'Role: Developer. Implement this bounded task.' }),
    'implementation'
  );
});

test('read-only role guidance never turns the agent into an implementer', () => {
  const review = instructionsForRole('normal', 'review');
  const exploration = instructionsForRole('normal', 'exploration');
  const investigation = instructionsForRole('normal', 'investigation');

  assert.match(review, /ROLE: READ-ONLY REVIEW/);
  assert.match(review, /Do not modify production code/);
  assert.doesNotMatch(review, /Workflow: UNDERSTAND -> SCOPE -> SIMPLIFY -> IMPLEMENT -> VERIFY/);

  assert.match(exploration, /ROLE: READ-ONLY EXPLORATION/);
  assert.match(exploration, /Do not edit production code/);

  assert.match(investigation, /ROLE: READ-ONLY INVESTIGATION/);
  assert.match(investigation, /Do not modify production code unless/);
});

test('strict read-only guidance critiques complexity without authorizing implementation', () => {
  const review = instructionsForRole('strict', 'review');
  assert.match(review, /STRICT MODE additions for read-only roles/);
  assert.match(review, /Do not convert optional simplification ideas into blocking findings/);
  assert.doesNotMatch(review, /STRICT MODE additions for implementation/);
});
