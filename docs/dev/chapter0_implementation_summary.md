# Chapter 0 Implementation Summary

## Current Result

Chapter 0 now has a complete data-driven vertical-slice implementation:

- five validated dialogue documents with 110 nodes;
- six character and consciousness portraits;
- five environment backgrounds;
- reusable dialogue UI and theme;
- seven object inspections and one corridor transition;
- three memory flashback sequences;
- five decision moments and 17 choice branches;
- serializable progress, timeline state, and completion flags;
- deterministic runtime tests that complete the chapter without live AI.

Repository-side QA passes. A visual Cocos launch remains pending because Cocos
Creator has not initialized this repository or generated a scene and asset
metadata.

## Main Files Added

### Dialogue Content

```text
assets/dialogue/chapter0/
  ch0_intro.json
  ch0_room_inspections.json
  ch0_flashbacks.json
  ch0_ai_fragments.json
  ch0_choices.json
```

### Dialogue Runtime

```text
assets/scripts/dialogue/
  DialogueTypes.ts
  DialogueManager.ts
```

### Chapter And Interaction Systems

```text
assets/scripts/core/
  ChapterProgressState.ts

assets/scripts/chapter0/
  Chapter0FlowController.ts
  Chapter0SceneController.ts

assets/scripts/player/
  InteractableObject.ts
```

### UI Systems

```text
assets/scripts/ui/
  BackgroundSwitcher.ts
  DialogueBox.ts
  DialogueChoiceList.ts
  DialogueDemo.ts
  DialogueHistoryPanel.ts
  DialoguePortrait.ts
  DialogueTheme.ts
  MemoryFlashbackController.ts
  ScreenFader.ts
  TimelineInstabilityIndicator.ts
```

### UI Resources

```text
assets/resources/ui/dialogue/
  dialogue_theme.json
  dialogue_ui_demo.json

assets/ui/dialogue/
  dialogue_panel_rough.svg
  dialogue_choice_rough.svg
```

### Tests And Validation

```text
tests/dialogue/
  dialogue_manager.test.mjs

tests/gameplay/
  chapter0_vertical_slice.test.mjs
  chapter0_qa.test.mjs

tools/content-validation/
  validate-chapter0-dialogue.ps1
  validate-dialogue-ui.ps1
  validate-chapter0-scene.ps1
```

### Developer Documentation

```text
docs/dev/
  chapter0_project_audit.md
  chapter0_implementation_plan.md
  chapter0_dialogue_ui.md
  chapter0_playable_scene.md
  chapter0_playtest_checklist.md
  chapter0_implementation_summary.md

docs/narrative/
  chapter0_dialogue_notes.md
```

## Files Modified During Integration

- `assets/scripts/dialogue/DialogueManager.ts`
  - Added direct node entry for interactables and runtime node lookup support.
- `assets/scripts/core/ChapterProgressState.ts`
  - Added serializable scene background context for correct flashback restore.
- `assets/scripts/chapter0/Chapter0FlowController.ts`
  - Added hotspot availability, scene modes, timeline status, and background restore.
- `assets/scripts/chapter0/Chapter0SceneController.ts`
  - Added clean startup validation, runtime hotspot creation, asset/UI bindings,
    progress restore, and completion emission.
- `docs/codex/PLANS.md`
  - Recorded the dialogue UI and playable vertical-slice execution plans.

## Systems Created

### DialogueManager

Indexes all loaded dialogue nodes and handles:

- linear advancement;
- conditional choices;
- state effects;
- dialogue history;
- cross-file references;
- progress snapshots and restoration.

### Chapter0FlowController

Converts dialogue state into scene-facing state:

- dialogue, investigation, flashback, and completion modes;
- available hotspot IDs;
- current background;
- flashback identity;
- timeline stability and warning status.

It is independent of Cocos and is exercised directly by Node tests.

### Chapter0SceneController

Connects the pure flow to Cocos:

- starts Chapter 0;
- binds the dialogue box;
- creates or binds interactables;
- changes backgrounds and overlays;
- updates timeline UI;
- emits a completion event.

### Reusable UI

The dialogue panel supports speaker names, portraits, typewriter text, choices,
history, narration styling, consciousness accents, and responsive editor
bindings. Background, flashback, fade, and timeline components are reusable
outside Chapter 0.

## How To Add More Dialogue

1. Add nodes to the appropriate Chapter JSON file.
2. Give every node a globally unique ID.
3. Use only the supported speakers from `DialogueTypes.ts`.
4. Reference portraits and backgrounds by their asset IDs.
5. Link nodes through `next` or choice targets.
6. Store consequences in `effects`; keep UI code free of authored dialogue.
7. Run:

```powershell
powershell -ExecutionPolicy Bypass -File tools/content-validation/validate-chapter0-dialogue.ps1
```

For a new chapter, create a separate folder and load all documents needed by
that chapter into its scene controller.

## How To Add More Interactables

1. Author an inspection sequence that returns to the investigation hub.
2. Add a hub choice with its unlock condition and target node.
3. Add a `Chapter0InteractableDefinition` entry in
   `Chapter0FlowController.ts`.
4. Add a normalized fallback rectangle in `Chapter0SceneController.ts`, or
   create an editor-positioned node with `InteractableObject`.
5. Set the first-inspection flag and increment the inspection count in the
   final inspection node.
6. Add the mapping and expected flag to `chapter0_qa.test.mjs`.

The flow controller derives availability from the authored hub choices, so
code should not duplicate unlock rules.

## How Chapter 1 Can Reuse This Structure

Chapter 1 can directly reuse:

- `DialogueManager` and dialogue schemas;
- `DialogueBox`, choices, portraits, history, and theme;
- `BackgroundSwitcher`;
- `InteractableObject`;
- `ScreenFader`;
- progress snapshot conventions;
- PowerShell and Node validation patterns.

Chapter 1 should add:

- Chapter 1 dialogue documents and historical evidence data;
- a `Chapter1FlowController` for its investigation and decision modes;
- a thin `Chapter1SceneController`;
- Chapter 1 background and portrait registry entries;
- chapter-specific interactable definitions and tests.

Keep historical content and decision logic in structured data. Do not place
Paris Peace Conference facts or authored dialogue inside Cocos UI components.

## Build And Test

There is currently no Cocos build command, `package.json`, `tsconfig.json`,
project manifest, or editor CLI in the repository.

The available integration command is:

```powershell
powershell -ExecutionPolicy Bypass -File tools/content-validation/validate-chapter0-scene.ps1
```

It validates JSON, references, local imports, assets, all interactables, all
choice branches, background restoration, and a complete start-to-end route.

After Cocos initialization, add the editor's TypeScript/build command and run a
manual scene playtest using `chapter0_playtest_checklist.md`.
