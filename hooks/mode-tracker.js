#!/usr/bin/env node
'use strict';

const { emitContext, readMode, readStdin, writeMode } = require('./runtime');
const {
  classifySubagentRole,
  instructionsFor,
  instructionsForRole,
  roleFromAgentType,
  roleFromPrompt
} = require('./instructions');

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

    if (command) {
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
      return;
    }

    // Codex exposes agent_id/agent_type on subagent-origin prompt submissions.
    // Use the delegated prompt to refine a generic or mismatched SubagentStart role
    // without re-injecting the same guidance on every prompt.
    if (!data.agent_id) return;

    const mode = readMode();
    if (mode === 'off') return;

    const typeRole = roleFromAgentType(data.agent_type);
    const promptRole = roleFromPrompt(data.prompt);
    if (promptRole === 'neutral' || promptRole === typeRole) return;

    const role = classifySubagentRole({
      agentType: data.agent_type,
      prompt: data.prompt
    });

    emitContext(
      'UserPromptSubmit',
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

module.exports = { main, parseCommand };
