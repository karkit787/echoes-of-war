# Chapter 0 Playable Scene

## Implementation Status

The complete Chapter 0 vertical-slice logic and Cocos components are
implemented. An automated playthrough completes the authored chapter from
wake-up to the timeline-instability warning.

The repository is still not initialized by Cocos Creator. It has no
`project.json`, editor settings, `.meta` files, asset UUIDs, or serialized
`.scene`/`.prefab` format. For that reason, this implementation does not
fabricate editor-owned scene JSON. The components below become playable after
creating one blank Cocos scene and assigning the existing assets in the editor.

Target API: Cocos Creator 3.8-compatible TypeScript.

## Implemented Systems

### Engine-Independent Flow

- `assets/scripts/core/ChapterProgressState.ts`
- `assets/scripts/chapter0/Chapter0FlowController.ts`
- `assets/scripts/dialogue/DialogueManager.ts`

The flow controller translates the Chapter 0 JSON graph into four scene modes:

- `dialogue`
- `investigation`
- `flashback`
- `complete`

It exposes available interactables from the filtered choices in
`ch0_inspection_hub`, tracks the current background, identifies flashback
beats, exposes timeline stability, and detects chapter completion.

### Cocos Components

- `assets/scripts/chapter0/Chapter0SceneController.ts`
- `assets/scripts/player/InteractableObject.ts`
- `assets/scripts/ui/BackgroundSwitcher.ts`
- `assets/scripts/ui/MemoryFlashbackController.ts`
- `assets/scripts/ui/ScreenFader.ts`
- `assets/scripts/ui/TimelineInstabilityIndicator.ts`

`Chapter0SceneController`:

- starts the five Chapter 0 dialogue documents;
- fades in from black;
- binds the reusable dialogue UI;
- switches between dialogue and room investigation;
- creates missing hotspot nodes from normalized coordinates;
- activates inspection dialogue when a hotspot is selected;
- cross-fades authored backgrounds;
- enables the memory overlay during flashbacks;
- unlocks the corridor from the JSON conditions;
- updates timeline status;
- emits `chapter0-complete` with a serializable progress snapshot.

## Scene Flow

```text
Fade from black
  -> opening dialogue and wake-up choice
  -> five consciousness introductions
  -> room investigation hotspot mode
  -> inspect device plus at least two other objects
  -> memory treatment choice
  -> three accident flashbacks
  -> evidence conclusion
  -> trusted consciousness choice
  -> abandoned corridor
  -> timeline conclusion
  -> instability warning and chapter completion
```

The seven objects and corridor are driven by these targets:

| Interactable | Dialogue target |
|---|---|
| Broken time device | `ch0_inspect_device_001` |
| Damaged ID card | `ch0_inspect_id_card_001` |
| Research notes | `ch0_inspect_notes_001` |
| Old newspaper | `ch0_inspect_newspaper_001` |
| Cracked watch | `ch0_inspect_watch_001` |
| Lab terminal | `ch0_inspect_terminal_001` |
| Memory shard | `ch0_inspect_shard_001` |
| Exit corridor | `ch0_choice_trust_memory` |

The corridor is unavailable until the damaged time device and at least two
other objects are inspected. Inspected objects disappear from hotspot mode.

## Required Cocos Scene

After the Cocos version is confirmed and the repository is opened as a Cocos
project, create:

`assets/scenes/Chapter0Prologue.scene`

Recommended hierarchy:

```text
Canvas
  BackgroundRoot
    BackgroundPrimary             Sprite + UIOpacity
    BackgroundTransition          Sprite + UIOpacity
    BackgroundSwitcher
  InvestigationRoot               full-screen UITransform
    Hotspots are generated here at runtime
  MemoryOverlay                   UIOpacity + Graphics
    MemoryFlashbackController
  TimelineIndicator
    StabilityLabel                Label
    StabilityBar                  ProgressBar
    Warning                       optional warning node
    TimelineInstabilityIndicator
  DialoguePanel                   hierarchy from chapter0_dialogue_ui.md
    DialogueBox
  FadeOverlay                     black full-screen Sprite/Graphics + UIOpacity
    ScreenFader
  Chapter0Controller
    Chapter0SceneController
```

Use a portrait-mobile Canvas and stretch the background, investigation root,
memory overlay, and fade overlay to all four Canvas edges with `Widget`.

## Inspector Bindings

### Chapter0SceneController

Assign:

- `dialogueBox`: configured `DialogueBox`.
- `dialogueFiles`: all five files from `assets/dialogue/chapter0/`.
- `backgroundSwitcher`: the scene's `BackgroundSwitcher`.
- `flashbackController`: `MemoryFlashbackController`.
- `timelineIndicator`: `TimelineInstabilityIndicator`.
- `screenFader`: `ScreenFader`.
- `investigationRoot`: full-screen room hotspot root.
- `interactables`: may remain empty.
- `autoCreateMissingHotspots`: enabled.
- `entryNodeId`: `ch0_intro_wake_001`.

When `interactables` is empty, eight usable hotspots are created automatically.
Their normalized positions are intended for the current abandoned-room
background and can later be replaced with editor-positioned
`InteractableObject` nodes.

### BackgroundSwitcher

Assign the two background Sprite nodes and these asset entries:

| Asset ID | SpriteFrame |
|---|---|
| `bg_ch0_abandoned_room` | `bg_ch0_abandoned_room.png` |
| `bg_ch0_abandoned_corridor` | `bg_ch0_abandoned_corridor.png` |
| `bg_ch0_time_machine_chamber` | `bg_ch0_time_machine_chamber.png` |
| `bg_ch0_destroyed_lab_flashback` | `bg_ch0_destroyed_lab_flashback.png` |
| `bg_ch0_memory_void` | `bg_ch0_memory_void.png` |

Set each Sprite to custom size and stretch its node to the Canvas. The
switcher uses `UIOpacity` to cross-fade without loading duplicate files.

### Dialogue Portraits

Use the six portrait registry entries documented in
`docs/dev/chapter0_dialogue_ui.md`. AI lines already contain the correct asset
IDs, and the theme applies the correct fragment accent.

## Progress State

Initial serializable values:

```json
{
  "ch0_started": false,
  "ch0_completed": false,
  "ch0_inspection_count": 0,
  "timeline_stability": 50,
  "timeline_instability_warning": false
}
```

Object flags and choices are applied directly from the dialogue JSON. Important
completion values include:

- `inspected_broken_time_device`
- `inspected_memory_shard`
- `ch0_inspection_count`
- `ch0_response_style`
- `ch0_first_trusted_trait`
- `ch0_accident_partially_recalled`
- `ch0_timeline_displacement_confirmed`
- `ch0_completed`
- `next_chapter_id`

Call `Chapter0SceneController.createProgressSnapshot()` for a JSON-compatible
save object. Call `restoreProgress(progress)` after startup to restore it. No
platform storage adapter is added in this step. The snapshot also stores the
active background so a save restored inside a flashback preserves its visual
context.

## Completion Event

Listen on the controller node:

```ts
chapter0ControllerNode.on('chapter0-complete', (progress) => {
  // Save progress or enable the Chapter 1 transition.
});
```

Chapter 1 is not loaded automatically. The event contains
`next_chapter_id = "chapter1_after_world_war_i"`.

## Validation

Run:

```powershell
powershell -ExecutionPolicy Bypass -File tools/content-validation/validate-chapter0-scene.ps1
```

The validator:

- validates all Chapter 0 dialogue and UI resources;
- checks local TypeScript imports;
- verifies all five backgrounds and six portraits;
- runs a complete deterministic Chapter 0 playthrough;
- inspects five room objects and the corridor;
- verifies memory visuals, choices, progress flags, corridor transition,
  timeline warning, and chapter completion.

A visual Cocos editor run remains necessary after project initialization to
confirm imported SpriteFrames, touch safe areas, text sizing, and serialized
scene bindings.
