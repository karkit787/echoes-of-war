# Codex Execution Plans for Echoes of War

Use this file when a task is complex, multi-step, or changes architecture, narrative systems, AI integration, or chapter content.

## When to create a plan

Create an execution plan before:

- Implementing a new gameplay system.
- Adding a full chapter or major scene.
- Refactoring narrative, AI companion, save/load, or platform code.
- Integrating remote AI services.
- Changing engine/platform assumptions.

## Plan template

```md
# ExecPlan: [Task name]

## Goal

What user-visible outcome will this deliver?

## Current context

What files, systems, and constraints matter?

## Assumptions

List assumptions. Mark anything that needs user or syllabus confirmation.

## Non-goals

What is intentionally out of scope?

## Design

Describe the proposed implementation or content structure.

## Files to create or change

- `path/to/file.ts` — why it changes.
- `path/to/content.ts` — why it changes.

## Historical / educational checks

For content tasks, list the learning objectives and historical anchors.

## AI companion checks

For AI tasks, list prompt inputs, output schema, fallback behavior, and safety constraints.

## Implementation steps

1. Step.
2. Step.
3. Step.

## Validation

Commands, manual checks, playthrough steps, or data validation to run.

## Risks and mitigations

- Risk — mitigation.

## Progress log

Update this section as work proceeds.
```

## Planning rules

- Keep plans specific enough that another developer can continue from them.
- Do not use plans as a reason to avoid implementation.
- Update the progress log after meaningful changes.
- Resolve small ambiguities with documented assumptions.
- For historical content, mark verification needs clearly.

## ExecPlan: Chapter 0 Reusable Dialogue UI

### Goal

Provide a reusable, data-driven dialogue panel for Chapter 0 with portraits,
typewriter text, choices, consciousness styling, narration, history, and
mobile-responsive Cocos bindings.

### Current context

The repository has Chapter 0 JSON and art assets but is not yet an initialized
Cocos Creator project. Scene, prefab, metadata, and engine compilation must
therefore wait for an exact editor version.

### Design

- Keep dialogue traversal and state independent from Cocos.
- Render through small editor-bindable Cocos Creator 3.x components.
- Store palette and demo content as editable JSON resources.
- Use original rough-edge SVG textures or procedural Graphics fallback.
- Demonstrate presentation without integrating Chapter 0 gameplay.

### Validation

- Validate JSON resources and cross-file Chapter 0 dialogue.
- Check required source files and local TypeScript imports.
- Run a Cocos TypeScript compile and visual demo after engine initialization.

### Progress log

- Complete: dialogue types, manager, conditions, effects, history, snapshots.
- Complete: dialogue box, portrait registry, choice list, history panel, theme.
- Complete: editable theme, original panel textures, minimal JSON demo.
- Complete: binding and responsive-layout documentation.
- Pending external prerequisite: initialize Cocos Creator and serialize the
  demo scene/prefab through the editor.

## ExecPlan: Chapter 0 Playable Vertical Slice

### Goal

Connect the existing backgrounds, portraits, dialogue JSON, and dialogue UI
into one stable Chapter 0 flow with room inspections, memory flashbacks,
choices, corridor transition, timeline warning, and completion state.

### Design

- Keep progression in an engine-independent `Chapter0FlowController`.
- Derive hotspot availability from authored dialogue conditions.
- Use normalized Cocos hotspots for responsive mobile interaction.
- Switch backgrounds by asset ID and apply a restrained flashback overlay.
- Keep all progress JSON-serializable and emit completion for a future chapter
  router.

### Progress log

- Complete: serializable Chapter 0 progress defaults and snapshots.
- Complete: eight interactable definitions and condition-driven unlocks.
- Complete: Cocos hotspot, background, flashback, fade, and timeline components.
- Complete: `Chapter0SceneController` integration and completion event.
- Complete: deterministic full playthrough through five objects and corridor.
- Pending external prerequisite: initialize Cocos Creator, bind imported
  SpriteFrames/JsonAssets, and serialize `Chapter0Prologue.scene` in the editor.

## ExecPlan: Chapter 0 Integration, Polish, And QA

### Goal

Verify the complete Chapter 0 content and runtime surface, fix integration
faults, and leave a repeatable automated and manual playtest process.

### Progress log

- Complete: validated all 110 dialogue nodes and cross-file references.
- Complete: verified all eight interactables and all 17 choice branches.
- Complete: verified six portrait and five background PNG references.
- Complete: tested start-to-end completion and timeline flags.
- Complete: fixed mid-flashback save restoration to preserve background state.
- Complete: added clean startup errors for missing dialogue documents.
- Complete: added developer summary and manual playtest checklist.
- Pending external prerequisite: initialize and run the scene in Cocos Creator.
