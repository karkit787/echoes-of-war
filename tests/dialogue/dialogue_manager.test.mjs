import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(testDirectory, '..', '..');

function loadDialogueManagerClass() {
  const typesPath = path.join(
    repoRoot,
    'assets',
    'scripts',
    'dialogue',
    'DialogueTypes.ts',
  );
  const managerPath = path.join(
    repoRoot,
    'assets',
    'scripts',
    'dialogue',
    'DialogueManager.ts',
  );

  const typesSource = readFileSync(typesPath, 'utf8').replaceAll('export ', '');
  const managerSource = readFileSync(managerPath, 'utf8')
    .replace(
      /import\s*\{[\s\S]*?\}\s*from\s*['"]\.\/DialogueTypes['"];\s*/,
      '',
    )
    .replace('export class DialogueManager', 'class DialogueManager');

  const javascript = stripTypeScriptTypes(
    `${typesSource}\n${managerSource}\nglobalThis.DialogueManager = DialogueManager;`,
    { mode: 'transform' },
  );
  const sandbox = { console };
  vm.runInNewContext(javascript, sandbox, {
    filename: 'DialogueManager.runtime-test.js',
  });
  return sandbox.DialogueManager;
}

function loadChapter0Documents() {
  const dialogueDirectory = path.join(
    repoRoot,
    'assets',
    'resources',
    'dialogue',
    'chapter0',
  );
  return [
    'ch0_intro.json',
    'ch0_room_inspections.json',
    'ch0_flashbacks.json',
    'ch0_ai_fragments.json',
    'ch0_choices.json',
  ].map((filename) =>
    JSON.parse(readFileSync(path.join(dialogueDirectory, filename), 'utf8')),
  );
}

const DialogueManager = loadDialogueManagerClass();
const documents = loadChapter0Documents();
const manager = new DialogueManager(documents);

manager.start('ch0_intro_wake_001');
assert.equal(manager.getViewState().node.id, 'ch0_intro_wake_001');

for (let index = 0; index < 7; index += 1) {
  manager.advance();
}

assert.equal(manager.getViewState().node.id, 'ch0_choice_wake_response');
assert.equal(manager.getViewState().choices.length, 3);

manager.selectChoice(0);
assert.equal(manager.getViewState().node.id, 'ch0_choice_wake_cautious_001');
assert.equal(manager.getViewState().state.ch0_started, true);
assert.equal(manager.getViewState().state.ch0_response_style, 'cautious');

manager.advance();
manager.advance();
assert.equal(manager.getViewState().node.id, 'ch0_ai_identity_001');
assert.ok(manager.getViewState().history.length > 7);

const snapshot = manager.createSnapshot();
const restored = new DialogueManager(documents);
restored.restore(snapshot);

assert.equal(restored.getViewState().node.id, 'ch0_ai_identity_001');
assert.equal(restored.getViewState().state.ch0_response_style, 'cautious');
assert.equal(
  restored.getViewState().history.length,
  manager.getViewState().history.length,
);

console.log('DialogueManager runtime test passed.');
