import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(testDirectory, '..', '..');

function read(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function removeImports(source) {
  return source.replace(/import\s*(?:type\s*)?\{[\s\S]*?\}\s*from\s*['"][^'"]+['"];\s*/g, '');
}

function loadRuntime() {
  const source = [
    read('assets/scripts/dialogue/DialogueTypes.ts'),
    read('assets/scripts/dialogue/DialogueManager.ts'),
    read('assets/scripts/chapter0/Chapter0FlowController.ts'),
  ]
    .map(removeImports)
    .map((moduleSource) => moduleSource.replaceAll('export ', ''))
    .join('\n');

  const javascript = stripTypeScriptTypes(
    `${source}
globalThis.DialogueManager = DialogueManager;
globalThis.Chapter0FlowController = Chapter0FlowController;
globalThis.CHAPTER0_INTERACTABLES = CHAPTER0_INTERACTABLES;`,
    { mode: 'transform' },
  );
  const sandbox = { console };
  vm.runInNewContext(javascript, sandbox, {
    filename: 'Chapter0VerticalSlice.runtime-test.js',
  });
  return sandbox;
}

function loadDocuments() {
  const directory = path.join(
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
    JSON.parse(readFileSync(path.join(directory, filename), 'utf8')),
  );
}

function advanceUntil(manager, predicate, description) {
  for (let step = 0; step < 300; step += 1) {
    if (predicate(manager.getViewState())) {
      return;
    }
    manager.advance();
  }
  throw new Error(`Could not reach ${description}.`);
}

const {
  DialogueManager,
  Chapter0FlowController,
  CHAPTER0_INTERACTABLES,
} = loadRuntime();
const manager = new DialogueManager(loadDocuments(), {
  ch0_started: false,
  ch0_completed: false,
  ch0_inspection_count: 0,
  timeline_stability: 50,
  timeline_instability_warning: false,
});
const flow = new Chapter0FlowController(manager);

manager.start('ch0_intro_wake_001');
assert.equal(flow.getViewState().backgroundAssetId, 'bg_ch0_abandoned_room');

advanceUntil(
  manager,
  (view) => view.node?.id === 'ch0_choice_wake_response',
  'the opening choice',
);
manager.selectChoice(0);
assert.equal(manager.getViewState().state.ch0_response_style, 'cautious');

advanceUntil(
  manager,
  (view) => view.node?.id === 'ch0_inspection_hub',
  'investigation mode',
);
assert.equal(flow.getViewState().mode, 'investigation');
assert.equal(CHAPTER0_INTERACTABLES.length, 8);

const inspected = [
  'broken_time_device',
  'damaged_id_card',
  'research_notes',
  'old_newspaper',
  'memory_shard',
];

for (const interactableId of inspected) {
  assert.ok(
    flow.getViewState().availableInteractableIds.includes(interactableId),
    `${interactableId} should be available`,
  );
  flow.activateInteractable(interactableId);

  if (interactableId === 'memory_shard') {
    assert.equal(flow.getViewState().mode, 'flashback');
    assert.equal(
      flow.getViewState().backgroundAssetId,
      'bg_ch0_memory_void',
    );
  }

  advanceUntil(
    manager,
    (view) => view.node?.id === 'ch0_inspection_hub',
    `return from ${interactableId}`,
  );
}

assert.equal(manager.getViewState().state.ch0_inspection_count, 5);
assert.equal(
  manager.getViewState().state.inspected_broken_time_device,
  true,
);
assert.equal(manager.getViewState().state.inspected_memory_shard, true);
assert.ok(flow.getViewState().availableInteractableIds.includes('exit_corridor'));

flow.activateInteractable('exit_corridor');
assert.equal(manager.getViewState().node.id, 'ch0_choice_trust_memory');
manager.selectChoice(1);

advanceUntil(
  manager,
  (view) => view.node?.id === 'ch0_choice_accident_evidence',
  'the accident evidence choice',
);
assert.equal(flow.getViewState().backgroundAssetId, 'bg_ch0_memory_void');
manager.selectChoice(0);

advanceUntil(
  manager,
  (view) => view.node?.id === 'ch0_choice_trusted_voice',
  'the trusted voice choice',
);
manager.selectChoice(0);

advanceUntil(
  manager,
  (view) => view.node?.id === 'ch0_choice_timeline_conclusion',
  'the timeline conclusion',
);
assert.equal(
  flow.getViewState().backgroundAssetId,
  'bg_ch0_abandoned_corridor',
);
manager.selectChoice(2);

advanceUntil(
  manager,
  (view) => view.state.ch0_completed === true,
  'Chapter 0 completion',
);

assert.equal(manager.getViewState().state.ch0_completed, true);
assert.equal(
  manager.getViewState().state.ch0_timeline_displacement_confirmed,
  true,
);
assert.equal(
  manager.getViewState().state.next_chapter_id,
  'chapter1_after_world_war_i',
);
assert.equal(flow.getViewState().chapterComplete, true);
assert.equal(flow.getViewState().timelineWarning, true);
assert.ok(manager.getViewState().history.length > 50);

manager.advance();
assert.equal(manager.getViewState().isComplete, true);
flow.dispose();

console.log('Chapter 0 vertical slice playthrough passed.');
