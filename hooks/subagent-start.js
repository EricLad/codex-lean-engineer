#!/usr/bin/env node
'use strict';

const { emitContext, readMode, readStdin } = require('./runtime');
const { classifySubagentRole, instructionsForRole } = require('./instructions');

async function main() {
  try {
    const mode = readMode();
    if (mode === 'off') return;

    const raw = await readStdin();
    const data = raw ? JSON.parse(raw.replace(/^\uFEFF/, '')) : {};
    const role = classifySubagentRole({ agentType: data.agent_type });

    emitContext(
      'SubagentStart',
      mode,
      instructionsForRole(mode, role),
      `LEAN-ENGINEER:${mode.toUpperCase()}:${role.toUpperCase()}`
    );
  } catch (_) {
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
