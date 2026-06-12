import assert from 'node:assert/strict';
import {
  existsSync,
  readFileSync,
} from 'node:fs';
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
  return source.replace(
    /import\s*(?:type\s*)?\{[\s\S]*?\}\s*from\s*['"][^'"]+['"];\s*/g,
    '',
  );
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
    filename: 'Chapter0QA.runtime-test.js',
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

function createRuntime(initialState = {}) {
  const manager = new DialogueManager(documents, {
    ch0_started: false,
    ch0_completed: false,
    ch0_inspection_count: 0,
    timeline_stability: 50,
    ...initialState,
  });
  const flow = new Chapter0FlowController(manager);
  return { manager, flow };
}

function advanceUntil(manager, predicate, description) {
  for (let step = 0; step < 100; step += 1) {
    if (predicate(manager.getViewState())) {
      return;
    }
    manager.advance();
  }
  throw new Error(`Could not reach ${description}.`);
}

function assertPng(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  assert.ok(existsSync(absolutePath), `${relativePath} should exist`);
  const buffer = readFileSync(absolutePath);
  assert.equal(
    buffer.subarray(0, 8).toString('hex'),
    '89504e470d0a1a0a',
    `${relativePath} should have a PNG signature`,
  );
  assert.ok(buffer.readUInt32BE(16) > 0, `${relativePath} width should be valid`);
  assert.ok(buffer.readUInt32BE(20) > 0, `${relativePath} height should be valid`);
}

const {
  DialogueManager,
  Chapter0FlowController,
  CHAPTER0_INTERACTABLES,
} = loadRuntime();
const documents = loadDocuments();
const nodes = documents.flatMap((document) => document.nodes);
const nodesById = new Map(nodes.map((node) => [node.id, node]));

const expectedInteractables = {
  broken_time_device: 'ch0_inspect_device_001',
  damaged_id_card: 'ch0_inspect_id_card_001',
  research_notes: 'ch0_inspect_notes_001',
  old_newspaper: 'ch0_inspect_newspaper_001',
  cracked_watch: 'ch0_inspect_watch_001',
  lab_terminal: 'ch0_inspect_terminal_001',
  memory_shard: 'ch0_inspect_shard_001',
  exit_corridor: 'ch0_choice_trust_memory',
};

assert.deepEqual(
  Object.fromEntries(
    Array.from(CHAPTER0_INTERACTABLES, (definition) => [
      definition.id,
      definition.targetNodeId,
    ]),
  ),
  expectedInteractables,
);

const objectFlagById = {
  broken_time_device: 'inspected_broken_time_device',
  damaged_id_card: 'inspected_damaged_id_card',
  research_notes: 'inspected_research_notes',
  old_newspaper: 'inspected_old_newspaper',
  cracked_watch: 'inspected_cracked_watch',
  lab_terminal: 'inspected_lab_terminal',
  memory_shard: 'inspected_memory_shard',
};

for (const [interactableId, inspectedFlag] of Object.entries(objectFlagById)) {
  const { manager, flow } = createRuntime();
  manager.start('ch0_inspection_hub');
  assert.ok(flow.getViewState().availableInteractableIds.includes(interactableId));

  const expectedTarget = expectedInteractables[interactableId];
  flow.activateInteractable(interactableId);
  assert.equal(manager.getViewState().node.id, expectedTarget);
  assert.equal(
    nodesById.get(expectedTarget).objectId,
    interactableId,
    `${interactableId} should enter its own dialogue sequence`,
  );

  advanceUntil(
    manager,
    (view) => view.node?.id === 'ch0_inspection_hub',
    `${interactableId} return to inspection hub`,
  );
  assert.equal(manager.getViewState().state[inspectedFlag], true);
  assert.equal(manager.getViewState().state.ch0_inspection_count, 1);
  assert.ok(
    !flow.getViewState().availableInteractableIds.includes(interactableId),
    `${interactableId} should not repeat its first-inspection sequence`,
  );
  flow.dispose();
}

{
  const { manager, flow } = createRuntime({
    inspected_broken_time_device: true,
    inspected_damaged_id_card: true,
    inspected_research_notes: true,
    ch0_inspection_count: 3,
  });
  manager.start('ch0_inspection_hub');
  assert.ok(flow.getViewState().availableInteractableIds.includes('exit_corridor'));
  flow.activateInteractable('exit_corridor');
  assert.equal(manager.getViewState().node.id, 'ch0_choice_trust_memory');
  flow.dispose();
}

const branchExpectations = [
  ['ch0_choice_wake_response', 0, 'ch0_choice_wake_cautious_001', 'ch0_ai_identity_001'],
  ['ch0_choice_wake_response', 1, 'ch0_choice_wake_urgent_001', 'ch0_ai_identity_001'],
  ['ch0_choice_wake_response', 2, 'ch0_choice_wake_help_001', 'ch0_ai_identity_001'],
  ['ch0_choice_trust_memory', 0, 'ch0_choice_memory_accept_001', 'ch0_flash_countdown_001'],
  ['ch0_choice_trust_memory', 1, 'ch0_choice_memory_verify_001', 'ch0_flash_countdown_001'],
  ['ch0_choice_trust_memory', 2, 'ch0_choice_memory_reject_001', 'ch0_flash_countdown_001'],
  ['ch0_choice_accident_evidence', 0, 'ch0_choice_accident_correct_001', 'ch0_ai_chorus_001'],
  ['ch0_choice_accident_evidence', 1, 'ch0_choice_accident_sabotage_001', 'ch0_choice_accident_evidence'],
  ['ch0_choice_accident_evidence', 2, 'ch0_choice_accident_hallucination_001', 'ch0_choice_accident_evidence'],
  ['ch0_choice_trusted_voice', 0, 'ch0_choice_trust_logic_001', 'ch0_intro_corridor_001'],
  ['ch0_choice_trusted_voice', 1, 'ch0_choice_trust_empathy_001', 'ch0_intro_corridor_001'],
  ['ch0_choice_trusted_voice', 2, 'ch0_choice_trust_scepticism_001', 'ch0_intro_corridor_001'],
  ['ch0_choice_trusted_voice', 3, 'ch0_choice_trust_memory_001', 'ch0_intro_corridor_001'],
  ['ch0_choice_trusted_voice', 4, 'ch0_choice_trust_conscience_001', 'ch0_intro_corridor_001'],
  ['ch0_choice_timeline_conclusion', 0, 'ch0_choice_timeline_same_time_001', 'ch0_choice_timeline_conclusion'],
  ['ch0_choice_timeline_conclusion', 1, 'ch0_choice_timeline_simulation_001', 'ch0_choice_timeline_conclusion'],
  ['ch0_choice_timeline_conclusion', 2, 'ch0_intro_end_001', 'ch0_intro_end_005'],
];

for (const [decisionId, choiceIndex, targetId, convergenceId] of branchExpectations) {
  const { manager, flow } = createRuntime();
  manager.start(decisionId);
  manager.selectChoice(choiceIndex);
  assert.equal(
    manager.getViewState().node.id,
    targetId,
    `${decisionId} choice ${choiceIndex} should resolve correctly`,
  );
  advanceUntil(
    manager,
    (view) => view.node?.id === convergenceId,
    `${decisionId} choice ${choiceIndex} convergence`,
  );
  flow.dispose();
}

const expectedPortraits = {
  Player: 'char_ch0_main_trainee_historian_portrait',
  Logic: 'char_ch0_ai_logic_portrait',
  Empathy: 'char_ch0_ai_empathy_portrait',
  Scepticism: 'char_ch0_ai_scepticism_portrait',
  Memory: 'char_ch0_ai_memory_portrait',
  Conscience: 'char_ch0_ai_conscience_portrait',
};

for (const [speaker, portraitId] of Object.entries(expectedPortraits)) {
  const speakerNodes = nodes.filter((node) => node.speaker === speaker);
  assert.ok(speakerNodes.length > 0, `${speaker} should have dialogue`);
  for (const node of speakerNodes) {
    assert.equal(node.portrait, portraitId, `${node.id} should use ${portraitId}`);
  }
  assertPng(
    `assets/resources/images/chapter0/characters/${portraitId}.png`,
  );
}

const backgroundIds = new Set(
  nodes.filter((node) => node.background).map((node) => node.background),
);
assert.deepEqual(
  [...backgroundIds].sort(),
  [
    'bg_ch0_abandoned_corridor',
    'bg_ch0_abandoned_room',
    'bg_ch0_destroyed_lab_flashback',
    'bg_ch0_memory_void',
    'bg_ch0_time_machine_chamber',
  ],
);
for (const backgroundId of backgroundIds) {
  assertPng(
    `assets/resources/images/chapter0/backgrounds/${backgroundId}.png`,
  );
}

const aiSpeakers = ['Logic', 'Empathy', 'Scepticism', 'Memory', 'Conscience'];
for (const speaker of aiSpeakers) {
  assert.ok(
    nodes.some((node) => node.speaker === speaker),
    `${speaker} should appear in Chapter 0`,
  );
}

{
  const { manager, flow } = createRuntime();
  manager.start('ch0_flash_failure_001');
  manager.advance();
  assert.equal(manager.getViewState().node.id, 'ch0_flash_failure_002');
  assert.equal(
    flow.getViewState().backgroundAssetId,
    'bg_ch0_destroyed_lab_flashback',
  );
  const snapshot = manager.createSnapshot();

  const restored = createRuntime();
  restored.manager.restore(snapshot);
  restored.flow.restoreBackground(flow.getViewState().backgroundAssetId);
  assert.equal(
    restored.flow.getViewState().backgroundAssetId,
    'bg_ch0_destroyed_lab_flashback',
  );
  flow.dispose();
  restored.flow.dispose();
}

console.log(
  'Chapter 0 exhaustive QA passed: 8 interactables, 17 choice branches, 6 portraits, 5 backgrounds, flashback restore.',
);
