# Chapter 0 Implementation Plan

**Chapter:** Chapter 0 - Prologue  
**Target:** Cocos Creator 2D project with TypeScript and WeChat Mini Game export  
**Status:** Planning only  
**Prerequisite:** Confirm and initialize the Cocos Creator version before implementation

## Goal

Create a short, polished, playable prologue in which the trainee historian:

1. Wakes in an abandoned research facility.
2. Learns to inspect the environment.
3. Encounters the five fragmented consciousness voices.
4. Reconstructs part of the time-travel accident from memory shards.
5. Examines the damaged time device.
6. Detects the first timeline instability.
7. Leaves Chapter 0 with a clear objective leading into Chapter 1.

The prologue should teach the interaction model and historical-inquiry habits
without becoming a full syllabus lesson. Its educational emphasis is:

- Observe before concluding.
- Distinguish memory from verified evidence.
- Sequence incomplete information.
- Consider cause, consequence, perspective, and responsibility.

## Scope

### In Scope

- One playable Chapter 0 Cocos scene.
- Five logical narrative sections within that scene.
- Dialogue-heavy presentation with original internal-voice interruptions.
- Existing trainee and consciousness portraits.
- Four required environmental interactables and one optional interactable.
- Two guided choices and one evidence-based choice.
- Deterministic companion behavior and hint fallbacks.
- Minimal serializable progress state and local save support.
- A clean transition target for Chapter 1.

### Out of Scope

- Live AI integration.
- Open-ended typed responses.
- Chapter selection.
- Chapter 1 implementation.
- Free-roaming character movement.
- Inventory systems beyond temporary evidence and memory records.
- Combat, complex animation, 3D environments, or large branching paths.
- Regeneration of existing portraits unless a required file is missing.

## Technical Assumptions

- The project will be initialized in a confirmed Cocos Creator version before
  scene or prefab files are authored.
- Chapter 0 will use one engine scene, `Chapter0.scene`.
- Narrative sections will be data-driven and advanced by a `ChapterRunner`.
- Authored content under `content/` will be the source of truth.
- Validated runtime copies will be placed under `assets/resources/`.
- All critical progression will work through scripted local data.
- Scene navigation will use taps on hotspots rather than free movement.
- Portraits will be imported as SpriteFrames and may need compressed runtime
  variants after target-device testing.

## Chapter Structure

Use one Cocos scene containing persistent UI and a replaceable background layer.
This avoids repeated scene loading and preserves dialogue state between beats.

### Scene 0.1 - Awakening

**Section ID:** `ch0_awakening`  
**Location:** Dark floor of an abandoned research facility  
**Purpose:** Establish injury, disorientation, tone, and basic dialogue controls  
**Learning concept:** Observation before interpretation

Opening:

- Fade in from black with low electrical ambience and strained breathing.
- The player sees a blurred, damaged room from floor level.
- The trainee portrait appears only when an internal self-assessment occurs.
- Empathy provides the first stabilizing interruption.
- Logic guides the player to establish immediate facts.

Required interaction:

- Tap to advance dialogue.
- Inspect the bloodied sleeve or physical condition.

Choice:

- `Stay still and assess the room.`
- `Force yourself upright immediately.`
- `Call out for help.`

Consequences should be small:

- Careful assessment records `ch0_response_style = "cautious"`.
- Immediate movement records `"urgent"` and triggers an extra Empathy warning.
- Calling out records `"seeking_help"` and triggers Scepticism to question who
  might hear.

No choice blocks progression or causes a game over.

Save checkpoint:

- Set `ch0_started = true`.
- Save after the first choice.

### Scene 0.2 - The Room That Should Not Exist

**Section ID:** `ch0_facility_investigation`  
**Location:** Main abandoned chamber  
**Purpose:** Teach hotspot inspection and evidence recording  
**Learning concept:** Evidence, accounts, and cautious inference

Required interactables:

1. Damaged time device.
2. Burned research console.
3. Broken observation window or wall marking.

Optional interactable:

4. Discarded identification badge.

Flow:

- The player can inspect required objects in any order.
- Each inspection adds an evidence record and triggers a different voice.
- Scepticism challenges unsupported conclusions.
- Memory produces partial, visibly uncertain recollections.
- Logic distinguishes observations from interpretations.

Completion condition:

- Inspect at least two required objects.
- The time device must be inspected before leaving the section.

Micro-reactivity:

- The first inspected object sets `ch0_first_clue`.
- Later dialogue references that first clue.
- Inspecting all objects sets `ch0_thorough_investigator = true`.

Save checkpoint:

- Save after each first-time object inspection.

### Scene 0.3 - Memory Shards

**Section ID:** `ch0_memory_reconstruction`  
**Location:** Abstract flashback overlay over the chamber  
**Purpose:** Reveal the experiment and introduce Memory as unreliable but useful  
**Learning concept:** Chronology and corroboration

Presentation:

- The facility background darkens and blurs.
- Three memory-shard panels appear as selectable fragments.
- Memory speaks first, followed by Scepticism or Logic when a shard is treated
  as fact.
- Use subtle screen displacement and desaturation rather than bright magical
  effects.

Memory shards:

1. `experiment_countdown` - researchers preparing the time device.
2. `containment_failure` - alarms and unstable energy readings.
3. `final_instruction` - an incomplete instruction from an unidentified
   researcher.

Evidence-based choice:

- Player selects the two shards that best support the conclusion that the
  experiment failed before transport completed safely.

Evaluation:

- Correct selection: Logic links preparation to failure; stability increases
  slightly.
- Partial selection: Memory supplies a contextual clue and allows retry.
- Unsupported selection: Scepticism asks what was actually observed and
  escalates the hint ladder.

Critical progression must not depend on a hidden trait check. After two failed
attempts, the player receives bounded guidance and retries.

Save checkpoint:

- Set `ch0_memory_sequence_attempts`.
- Store selected shard IDs.
- Set `ch0_accident_partially_recalled = true` on completion.

### Scene 0.4 - The Fractured Chorus

**Section ID:** `ch0_consciousness_awakening`  
**Location:** Chamber with internal-voice overlay  
**Purpose:** Introduce all five consciousness roles and their disagreement  
**Learning concept:** Multiple perspectives support stronger judgement

Voice sequence:

1. Logic identifies physical and temporal inconsistencies.
2. Empathy helps the player manage pain and fear.
3. Scepticism questions whether the memories are trustworthy.
4. Memory recalls a warning about timeline integrity.
5. Conscience asks what responsibility remains if the accident affected others.

Presentation:

- Companion portraits appear in a dedicated consciousness panel rather than the
  normal speaker portrait slot.
- Each voice uses its own accent treatment, motion pattern, and text cue.
- Two voices may disagree in sequence, but never speak over each other in the
  MVP.

Guided choice:

Prompt: `Which voice do you follow first?`

- Logic: inspect the device's state.
- Memory: reconstruct the missing instruction.
- Scepticism: verify the facility's date and surroundings.

The choice changes the order of the next three short beats, not the final
outcome. Empathy and Conscience remain available as reactive interjections.

State:

- Set `ch0_first_trusted_trait`.
- Mark each introduced trait in `ch0_traits_introduced`.

### Scene 0.5 - Timeline Fracture

**Section ID:** `ch0_timeline_instability`  
**Location:** Facility exit and damaged time device  
**Purpose:** Confirm temporal displacement and establish the first objective  
**Learning concept:** Verify chronology and recognize consequences

Required interactables:

1. Time device core, now emitting an inconsistent date or state.
2. External view through the damaged exit or observation window.

Flow:

- The player compares the device record with an external environmental clue.
- The clues cannot both belong to the expected future laboratory.
- Scepticism asks the player to verify rather than accept Memory alone.
- Logic identifies temporal displacement.
- Conscience frames the responsibility to avoid worsening the timeline.
- Empathy keeps the ending grounded in survival rather than spectacle.

Final conclusion choice:

- `The device malfunctioned, but I am still in my own time.`
- `The facility is a reconstruction or simulation.`
- `I have been displaced into the past, and the timeline is unstable.`

Incorrect conclusions trigger one short evidence reminder and retry. The final
correct conclusion sets the Chapter 0 completion state.

Ending:

- Objective appears: `Survive. Establish the date. Repair the historical path.`
- Set `ch0_completed = true`.
- Set `next_chapter_id = "chapter1_after_world_war_i"`.
- Save and expose a transition event; do not implement Chapter 1 in this task.

## Scene Flow

```text
Chapter0.scene
  -> ch0_awakening
  -> ch0_facility_investigation
  -> ch0_memory_reconstruction
  -> ch0_consciousness_awakening
  -> ch0_timeline_instability
  -> chapter complete / Chapter 1 transition target
```

Limited reordering:

- Interactables in `ch0_facility_investigation` may be inspected in any order.
- The first trusted consciousness changes three short beat sequences.
- All routes converge before the final timeline conclusion.

## Asset List

### Existing Assets - Reuse Unchanged

```text
assets/images/chapter0/characters/
  char_ch0_main_trainee_historian_portrait.png
  char_ch0_ai_logic_portrait.png
  char_ch0_ai_empathy_portrait.png
  char_ch0_ai_scepticism_portrait.png
  char_ch0_ai_memory_portrait.png
  char_ch0_ai_conscience_portrait.png
```

Do not regenerate these portraits unless a file is missing or corrupt.

### Background Assets to Create

| Asset ID | Suggested path | Purpose |
|---|---|---|
| `bg_ch0_facility_floor` | `assets/images/chapter0/backgrounds/bg_ch0_facility_floor.png` | Blurred floor-level awakening view |
| `bg_ch0_facility_main` | `assets/images/chapter0/backgrounds/bg_ch0_facility_main.png` | Main investigation chamber |
| `bg_ch0_facility_flashback` | `assets/images/chapter0/backgrounds/bg_ch0_facility_flashback.png` | Abstract accident flashback layer |
| `bg_ch0_facility_exit` | `assets/images/chapter0/backgrounds/bg_ch0_facility_exit.png` | Exit/window view revealing temporal mismatch |

Background requirements:

- Landscape composition suitable for portrait-mobile cropping.
- Dark painterly facility with clear foreground, midground, and hotspot zones.
- No embedded text, labels, UI, or required information inside fine detail.
- Reuse one chamber layout across awakening and investigation where possible.
- Prefer layered lighting and overlays over many unique large backgrounds.

### Interactable Object Assets

| Asset ID | Suggested path | Notes |
|---|---|---|
| `obj_ch0_time_device_damaged` | `assets/images/chapter0/objects/obj_ch0_time_device_damaged.png` | Required; readable silhouette |
| `obj_ch0_console_burned` | `assets/images/chapter0/objects/obj_ch0_console_burned.png` | Required |
| `obj_ch0_window_broken` | `assets/images/chapter0/objects/obj_ch0_window_broken.png` | Required or integrated into background |
| `obj_ch0_id_badge` | `assets/images/chapter0/objects/obj_ch0_id_badge.png` | Optional clue |
| `obj_ch0_memory_shard_01` | `assets/images/chapter0/objects/obj_ch0_memory_shard_01.png` | Abstract fragment, no crystal cliché |
| `obj_ch0_memory_shard_02` | `assets/images/chapter0/objects/obj_ch0_memory_shard_02.png` | Abstract fragment |
| `obj_ch0_memory_shard_03` | `assets/images/chapter0/objects/obj_ch0_memory_shard_03.png` | Abstract fragment |

Memory shards should appear as broken painted recollections or image fragments,
not literal glowing crystals.

### UI Assets

Prefer Cocos-generated shapes and nine-sliced textures over large raster UI.

| Asset | Suggested path |
|---|---|
| Dialogue panel nine-slice | `assets/ui/dialogue/dialogue_panel_9slice.png` |
| Companion panel nine-slice | `assets/ui/dialogue/companion_panel_9slice.png` |
| Choice button states | `assets/ui/dialogue/choice_button_9slice.png` |
| Hotspot marker | `assets/ui/chapter0/hotspot_marker.png` |
| Evidence selected marker | `assets/ui/chapter0/evidence_selected.png` |
| Timeline instability indicator | `assets/ui/chapter0/timeline_indicator.png` |
| Memory-shard frame | `assets/ui/chapter0/memory_shard_frame_9slice.png` |

### Audio Assets

| Asset | Suggested path | Use |
|---|---|---|
| Facility ambience loop | `assets/audio/music/ch0_facility_ambience.*` | Low-volume continuous ambience |
| Electrical failure loop | `assets/audio/sfx/ch0_electrical_failure.*` | Device area |
| Memory transition | `assets/audio/sfx/ch0_memory_transition.*` | Flashback entry |
| Companion interruption | `assets/audio/sfx/ch0_companion_interrupt.*` | Short, subtle cue |
| Timeline distortion | `assets/audio/sfx/ch0_timeline_distortion.*` | Final reveal |
| UI advance/select | `assets/audio/sfx/ui_select.*` | Reusable UI feedback |

Use compressed formats supported by the confirmed Cocos/WeChat target. Keep
loops short and avoid voice acting in the first implementation.

## Dialogue UI

The presentation may borrow the high-level idea of portrait-led, text-heavy
dialogue from dialogue RPGs, but its layout, typography, animation, labels, and
visual language must be original.

### Recommended Mobile Layout

- Background fills the screen.
- Bottom 35-42 percent contains the main dialogue panel.
- Speaker portrait occupies a compact left column for the trainee or external
  speakers.
- Speaker name, dialogue text, and continue affordance occupy the main column.
- Consciousness interruptions use a separate vertical or inset panel on the
  upper-right, with the trait portrait and accent color.
- Choices replace the lower dialogue text area temporarily.
- Hotspots remain available only when the dialogue runner enters investigation
  mode.

### Original Visual Direction

- Charcoal translucent panels with rough painted edge textures.
- Dirty-ivory body text and restrained trait accent colors.
- No copied card shapes, typography, icons, or exact placement from another
  game.
- Companion lines may enter with a short scrape, fade, or offset motion unique
  to each trait.
- Maintain high text contrast and minimum mobile touch targets.
- Allow instant text reveal and reduced-motion settings.

## UI Components to Create

| Component | Suggested prefab | Responsibility |
|---|---|---|
| Dialogue panel | `assets/prefabs/ui/DialoguePanel.prefab` | Speaker portrait, name, text, continue input |
| Companion panel | `assets/prefabs/ui/CompanionPanel.prefab` | Trait portrait, mood, interruption text |
| Choice panel | `assets/prefabs/ui/DecisionPanel.prefab` | Guided choices and retry states |
| Evidence panel | `assets/prefabs/ui/EvidenceSelectionPanel.prefab` | Memory-shard selection |
| Investigation overlay | `assets/prefabs/ui/InvestigationOverlay.prefab` | Hotspots and inspection completion |
| Objective banner | `assets/prefabs/ui/ObjectiveBanner.prefab` | New objective display |
| Timeline indicator | `assets/prefabs/ui/TimelineIndicator.prefab` | Subtle stability feedback |
| Pause/settings panel | `assets/prefabs/ui/PausePanel.prefab` | Resume, text speed, audio, restart section |

Controllers should receive state and events from the runner. They should not
contain Chapter 0 dialogue or decision rules.

## Dialogue Files to Create

### Authored Source Files

```text
content/chapters/chapter-0-prologue/
  chapter0_manifest.json
  scene_01_awakening.json
  scene_02_facility_investigation.json
  scene_03_memory_reconstruction.json
  scene_04_consciousness_awakening.json
  scene_05_timeline_instability.json
  chapter0_interactables.json
  chapter0_memory_shards.json

content/chapters/chapter-0-prologue/
  chapter0_companion_fallbacks.json
```

### Runtime Files

Runtime dialogue should have a single maintained copy:

```text
assets/dialogue/chapter0/
  ch0_intro.json
  ch0_room_inspections.json
  ch0_flashbacks.json
  ch0_ai_fragments.json
  ch0_choices.json
```

Only files loaded through Cocos `resources.load()` belong under
`assets/resources/`. Do not manually maintain divergent dialogue copies.

## Dialogue Data Schema

Recommended TypeScript contract:

```ts
type DialogueSpeaker =
  | 'narrator'
  | 'trainee'
  | 'logic'
  | 'empathy'
  | 'scepticism'
  | 'memory'
  | 'conscience';

type DialogueBeatType =
  | 'narration'
  | 'dialogue'
  | 'companion'
  | 'investigation'
  | 'decision'
  | 'state_change'
  | 'checkpoint'
  | 'transition';

interface Chapter0SceneData {
  id: string;
  title: string;
  backgroundAssetId: string;
  learningConcepts: Array<
    'observation' | 'evidence' | 'chronology' | 'causation' |
    'perspective' | 'historical_empathy' | 'responsible_judgement'
  >;
  entryConditions?: Condition[];
  beats: DialogueBeat[];
  completionConditions: Condition[];
  nextSceneId?: string;
}

interface DialogueBeat {
  id: string;
  type: DialogueBeatType;
  speaker?: DialogueSpeaker;
  portraitAssetId?: string;
  text?: string;
  mood?: 'calm' | 'urgent' | 'supportive' | 'uneasy' | 'critical';
  companionFunction?: 'guide' | 'question' | 'warn' | 'remember' | 'reflect';
  interactableIds?: string[];
  decision?: DecisionData;
  effects?: StateEffect[];
  nextBeatId?: string;
  branches?: DialogueBranch[];
}

interface DecisionData {
  id: string;
  type: 'guided_choice' | 'evidence_choice';
  prompt: string;
  options?: DecisionOption[];
  requiredEvidenceCount?: number;
  validEvidenceSets?: string[][];
  hintLadder: HintData[];
  fallbackResponses: {
    correct: CompanionResponseData;
    partial: CompanionResponseData;
    incorrect: CompanionResponseData;
  };
}

interface DecisionOption {
  id: string;
  text: string;
  effects: StateEffect[];
  nextBeatId: string;
}

interface HintData {
  level: 1 | 2 | 3 | 4 | 5;
  trait: 'logic' | 'empathy' | 'scepticism' | 'memory' | 'conscience';
  text: string;
}

interface CompanionResponseData {
  activeTraits: Array<
    'logic' | 'empathy' | 'scepticism' | 'memory' | 'conscience'
  >;
  mood: 'calm' | 'urgent' | 'supportive' | 'uneasy' | 'critical';
  message: string;
  hintLevel?: 1 | 2 | 3 | 4 | 5;
  suggestedPlayerAction?: string;
  timelineStabilityDelta?: number;
  memoryToStore?: string;
}

interface DialogueBranch {
  conditions: Condition[];
  nextBeatId: string;
}

interface Condition {
  key: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'gte' | 'lte' | 'exists';
  value?: boolean | number | string;
}

interface StateEffect {
  operation: 'set' | 'increment' | 'append_unique';
  key: string;
  value: boolean | number | string;
}
```

Schema rules:

- Every beat ID must be unique within the chapter.
- Every branch and `nextBeatId` must resolve.
- Critical decisions must contain all five hint levels or explicitly state the
  maximum level used.
- Every decision must include deterministic fallback responses.
- Active gameplay lines should normally remain under 35 words.
- No UI component may contain authored dialogue strings.

## Interactable Data Schema

```ts
type InteractableType =
  | 'environment_clue'
  | 'device'
  | 'document'
  | 'memory_shard'
  | 'exit';

interface ChapterInteractableData {
  id: string;
  sceneId: string;
  type: InteractableType;
  displayName: string;
  assetId?: string;
  hotspot: {
    xNormalized: number;
    yNormalized: number;
    widthNormalized: number;
    heightNormalized: number;
  };
  enabledConditions?: Condition[];
  firstInspectionBeatId: string;
  repeatInspectionBeatId?: string;
  evidenceGranted?: EvidenceRecord;
  effects?: StateEffect[];
  requiredForSceneCompletion: boolean;
  accessibilityLabel: string;
}

interface EvidenceRecord {
  id: string;
  title: string;
  observedFact: string;
  interpretation?: string;
  confidence: 'uncertain' | 'supported' | 'verified';
  sourceType: 'physical' | 'device_record' | 'memory' | 'environment';
  relatedMemoryIds?: string[];
}
```

Implementation rules:

- Hotspot positions use normalized coordinates so the layout can adapt to
  different screen sizes.
- Observed facts and interpretations must be stored separately.
- Memory-derived evidence begins as `uncertain`.
- Required interactables must remain reachable after orientation and safe-area
  adjustments.
- Repeated inspection should give a short reminder, not replay the full scene.

## AI Consciousness Behavior

Chapter 0 must not require a remote model. Use scripted triggers and
`MockCompanionService`.

### Trigger Model

| Trait | Trigger | Chapter 0 behavior |
|---|---|---|
| Logic | Causal inconsistency or device state | Separates facts from conclusions |
| Empathy | Injury, panic, or frustration | Grounds and supports the player |
| Scepticism | Unsupported memory or assumption | Requests verification |
| Memory | Clue or accident reference | Supplies incomplete recollection |
| Conscience | Risk to others or timeline | Frames responsibility without punishment |

### Behavioral Rules

- One primary voice responds to most triggers.
- A second voice may challenge or qualify the first in authored sequences.
- Voices do not reveal the final conclusion before the player has inspected
  enough evidence.
- Memory must explicitly signal uncertainty.
- Scepticism challenges claims, not the player's intelligence.
- Empathy never becomes a generic praise system.
- Conscience reflects on responsibility without religious or punitive framing.
- Logic explains consequences without turning into a tutorial narrator.
- Failure escalates through hints and retry; it does not stop the story.

### Service Boundary

```ts
interface CompanionService {
  getTriggeredResponse(input: CompanionTriggerInput): Promise<CompanionResponseData>;
  evaluateEvidenceChoice(input: EvidenceChoiceInput): Promise<DecisionEvaluation>;
  getHint(input: HintRequest): Promise<CompanionResponseData>;
}
```

Only `MockCompanionService` is required for Chapter 0. A future remote service
must implement the same interface and return validated data.

## Save and Progress State

If save support is available after engine initialization, use compact local
serialization. If platform storage is not ready, implement an in-memory adapter
with the same interface and clearly mark persistence as pending.

```ts
interface Chapter0Progress {
  chapterId: 'chapter0_prologue';
  currentSceneId: string;
  currentBeatId: string;
  timelineStability: number;
  inspectedInteractableIds: string[];
  collectedEvidenceIds: string[];
  selectedMemoryShardIds: string[];
  memories: string[];
  flags: Record<string, boolean | number | string>;
  schemaVersion: 1;
  updatedAt: number;
}
```

Required flags:

```text
ch0_started
ch0_response_style
ch0_first_clue
ch0_thorough_investigator
ch0_memory_sequence_attempts
ch0_accident_partially_recalled
ch0_first_trusted_trait
ch0_logic_introduced
ch0_empathy_introduced
ch0_scepticism_introduced
ch0_memory_introduced
ch0_conscience_introduced
ch0_timeline_displacement_confirmed
ch0_completed
next_chapter_id
```

Checkpoint policy:

- Save after the awakening choice.
- Save after each first-time required interaction.
- Save after memory reconstruction.
- Save after first trusted trait selection.
- Save on Chapter 0 completion.
- Resume at the start of the last incomplete beat, not mid-animation.

## Code Files to Add

Exact Cocos-generated scene and prefab serialization must be created only after
the engine version is confirmed.

### Core

```text
assets/scripts/core/GameState.ts
assets/scripts/core/SaveService.ts
assets/scripts/core/StorageAdapter.ts
assets/scripts/core/LocalStorageAdapter.ts
assets/scripts/core/AssetRegistry.ts
assets/scripts/core/EventBus.ts
```

### Dialogue and Narrative

```text
assets/scripts/dialogue/ChapterTypes.ts
assets/scripts/dialogue/ChapterDataLoader.ts
assets/scripts/dialogue/ChapterRunner.ts
assets/scripts/dialogue/DecisionEvaluator.ts
assets/scripts/dialogue/HintService.ts
assets/scripts/dialogue/ContentValidator.ts
```

### Companion

```text
assets/scripts/ai-companion/CompanionTypes.ts
assets/scripts/ai-companion/CompanionService.ts
assets/scripts/ai-companion/MockCompanionService.ts
assets/scripts/ai-companion/CompanionTriggerService.ts
```

### Interactions and UI

```text
assets/scripts/player/InteractableController.ts
assets/scripts/player/InvestigationController.ts
assets/scripts/ui/Chapter0Controller.ts
assets/scripts/ui/DialoguePanelController.ts
assets/scripts/ui/CompanionPanelController.ts
assets/scripts/ui/DecisionPanelController.ts
assets/scripts/ui/EvidenceSelectionController.ts
assets/scripts/ui/InvestigationOverlayController.ts
assets/scripts/ui/ObjectiveBannerController.ts
assets/scripts/ui/TimelineIndicatorController.ts
```

### Validation and Tests

```text
tools/content-validation/validate-chapter-data.ts
tools/build-scripts/sync-runtime-content.ts

tests/dialogue/chapter0_content.test.ts
tests/dialogue/chapter0_branches.test.ts
tests/gameplay/chapter0_state.test.ts
tests/gameplay/chapter0_interactables.test.ts
tests/gameplay/chapter0_save_load.test.ts
```

## Scene and Prefab Files to Create

After Cocos initialization:

```text
assets/scenes/Chapter0.scene

assets/prefabs/ui/DialoguePanel.prefab
assets/prefabs/ui/CompanionPanel.prefab
assets/prefabs/ui/DecisionPanel.prefab
assets/prefabs/ui/EvidenceSelectionPanel.prefab
assets/prefabs/ui/InvestigationOverlay.prefab
assets/prefabs/ui/ObjectiveBanner.prefab
assets/prefabs/ui/TimelineIndicator.prefab
assets/prefabs/ui/PausePanel.prefab

assets/prefabs/chapter0/TimeDevice.prefab
assets/prefabs/chapter0/MemoryShard.prefab
assets/prefabs/chapter0/InvestigationHotspot.prefab
```

## Implementation Order

### Phase 0 - Engine Confirmation

1. Confirm the exact Cocos Creator version and WeChat export target.
2. Initialize the repository as a Cocos project.
3. Commit generated project settings and imported asset metadata.
4. Verify that one existing portrait renders in a blank test scene.

Exit condition:

- Project opens and runs locally.
- Existing portraits have stable Cocos import metadata.

### Phase 1 - Data Contracts and Validation

1. Add `ChapterTypes`, companion types, interactable types, and state types.
2. Implement pure validation for IDs, branches, conditions, evidence sets, and
   asset references.
3. Add the authored-to-runtime content sync script.
4. Create empty but schema-valid Chapter 0 data files.

Exit condition:

- Invalid references fail validation.
- Runtime JSON is generated from authored content.

### Phase 2 - Core Runner and State

1. Implement serializable `GameState`.
2. Implement storage abstraction and in-memory fallback.
3. Implement `ChapterDataLoader`.
4. Implement linear beat advancement, branching, effects, and checkpoints.
5. Add deterministic decision evaluation and hint escalation.

Exit condition:

- A headless test can complete Chapter 0 data from start to finish.

### Phase 3 - Dialogue UI Foundation

1. Build dialogue, companion, decision, evidence, objective, and timeline
   prefabs.
2. Add responsive layout and safe-area handling.
3. Add text speed, instant reveal, and reduced-motion options.
4. Connect controllers to runner events using mock content.

Exit condition:

- Dialogue and choices are readable and usable at target mobile dimensions.

### Phase 4 - Investigation and Interactables

1. Build normalized hotspot support.
2. Implement first and repeat inspection behavior.
3. Add evidence records and scene completion conditions.
4. Add time device, console, window, badge, and memory-shard prefabs.

Exit condition:

- Required interactables can be completed in any allowed order.
- No hotspot is obscured by UI or safe areas.

### Phase 5 - Chapter 0 Content

1. Author the five scene data files.
2. Author all deterministic companion interruptions and hint ladders.
3. Add micro-reactive callbacks for first clue and trusted trait.
4. Add reflection and final objective text.
5. Run content validation.

Exit condition:

- Every beat, branch, and effect resolves.
- The chapter can complete without remote AI.

### Phase 6 - Art and Audio Integration

1. Import existing portraits without regenerating them.
2. Create or source the required background, object, UI, and audio assets.
3. Create optimized runtime portrait variants if package or memory tests require
   them.
4. Add restrained transitions and trait-specific companion motion.

Exit condition:

- Visual and audio presentation is consistent and performant.

### Phase 7 - Save, Resume, and Target Validation

1. Implement platform-local storage adapter.
2. Test every checkpoint and resume position.
3. Test offline and failed-storage fallback behavior.
4. Build for the current WeChat target.
5. Measure package size, texture memory, loading time, and text readability.

Exit condition:

- Chapter 0 completes and resumes correctly on the target build.

## Acceptance Criteria

### Functional

- `Chapter0.scene` runs from beginning to completion.
- The player can advance dialogue using touch input.
- The player can inspect all required interactables.
- Investigation order may vary without breaking progression.
- Two guided choices and one evidence-based choice function correctly.
- Incorrect evidence choices trigger hints and recoverable retry.
- All five consciousness voices are introduced with distinct behavior.
- The final conclusion identifies displacement into the past and timeline
  instability.
- Completion sets `ch0_completed` and the Chapter 1 transition target.

### Content

- Chapter 0 remains short and focused on framing and onboarding.
- Dialogue is stored outside UI components.
- Active dialogue lines are concise and school-appropriate.
- Memory is presented as uncertain until corroborated.
- Choices reward observation and evidence rather than trivia.
- The existing portraits are reused and not regenerated.
- The presentation is original and does not copy another game's UI, prose, or
  iconography.

### Companion

- Core gameplay works with `MockCompanionService` and no network.
- Every decision has correct, partial, and incorrect fallback responses.
- Critical misunderstanding uses a hint ladder and retry.
- Companion voices guide without simply solving the task immediately.
- No AI or scripted response invents unsupported historical information.

### Technical

- State is serializable and versioned.
- Save data contains no scene-node references or engine objects.
- Chapter data passes schema and reference validation.
- All branch targets and asset IDs resolve.
- UI adapts to target portrait-mobile safe areas.
- Existing portraits load through a runtime registry or stable Cocos references.
- Package and texture-memory impact is measured on the WeChat target.
- The chapter remains playable if storage or remote AI is unavailable.

### Validation

- TypeScript/build checks pass once the engine project is initialized.
- Unit tests cover content references, decision evaluation, interactables, state
  effects, and save/load.
- Manual playthroughs cover cautious, urgent, and seeking-help opening choices.
- Manual playthroughs cover different first clues and trusted traits.
- Manual playthrough confirms every checkpoint resumes at a valid beat.

## Implementation Risks

- **Engine version unknown:** scene and prefab files must not be handcrafted
  before Cocos Creator is initialized.
- **Portrait package weight:** the six current PNGs total about 15.45 MB and may
  require compressed runtime variants.
- **Source/runtime content drift:** use a one-way validation and sync process.
- **Overbuilt dialogue framework:** implement only the beat types needed by
  Chapter 0, while keeping interfaces reusable.
- **UI similarity risk:** use an original layout and visual assets; borrow only
  the high-level idea of portrait-led dialogue and internal interruptions.
- **Hotspot scaling:** normalized coordinates and target-device testing are
  mandatory.
- **Narrative overlength:** target approximately 15-20 minutes for a first
  playthrough.

## Definition of Ready

Implementation may begin when:

1. The Cocos Creator version is confirmed.
2. The repository opens as a runnable Cocos project.
3. Existing portraits import successfully.
4. The data schemas in this plan are accepted or revised.
5. Required background and object asset production is approved.
