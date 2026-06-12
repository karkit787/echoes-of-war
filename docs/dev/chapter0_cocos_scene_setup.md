# Chapter 0 Automated Cocos Scene Setup

This guide completes `assets/scenes/Chapter0.scene` in Cocos Creator 3.8.8
without manually constructing its hierarchy or assigning Inspector references.
The project extension at `extensions/chapter0-scene-setup/` performs the
editor-owned scene mutation and save.

The extension does not hand-edit serialized scene JSON. It runs in Cocos'
scene process, creates real `Node` and `Component` instances, assigns object
references, validates the live graph, and asks Cocos Creator to save the scene.

## Run The Automation

1. Close and reopen the project in Cocos Creator 3.8.8 after pulling these
   files, or reload `chapter0-scene-setup` in **Extension > Extension Manager**.
2. Wait until the Console has no TypeScript compilation or asset import errors.
3. Open `assets/scenes/Chapter0.scene`.
4. Select **Echoes of War > Chapter 0 > Build and Bind Chapter0.scene**.
5. Wait for these three `PASS` messages in the Console:
   - project resources and metadata
   - Chapter0.scene build
   - live Chapter0.scene graph
6. Select **Echoes of War > Chapter 0 > Validate Chapter0.scene** for a
   read-only follow-up check.

The build command targets the scene by the UUID already stored in
`Chapter0.scene.meta`. It refuses to run against another open scene.

## Idempotency And Preservation

The command can be run again. It replaces only these managed Canvas children:

```text
BackgroundLayer
InvestigationRoot
FlashbackOverlay
TimelineHud
DialogueRoot
FadeOverlay
Chapter0Controller
```

It preserves the existing Canvas, Camera, scene `.meta`, and any unrelated
Canvas children. Do not place hand-authored content inside a managed root
unless it is acceptable for the next automation pass to replace it.

No portrait, background, dialogue, or UI artwork bytes are modified.

## Generated Hierarchy

The command creates and saves this hierarchy under the existing Canvas:

```text
Canvas
  Camera
  BackgroundLayer
    BackgroundPrimary
    BackgroundTransition
  InvestigationRoot
    BrokenTimeDevice
      Label
    DamagedIdCard
      Label
    ResearchNotes
      Label
    OldNewspaper
      Label
    CrackedWatch
      Label
    LabTerminal
      Label
    MemoryShard
      Label
    ExitDoor
      Label
  FlashbackOverlay
  TimelineHud
    StabilityBar
    ValueLabel
    Warning
      WarningLabel
  DialogueRoot
    Panel
    PanelAdvanceButton
    Accent
    Portrait
    SpeakerName
    DialogueText
    Choices
    ContinueButton
      Label
  FadeOverlay
  Chapter0Controller
```

All generated nodes use the UI 2D layer. Full-screen layers receive
`UITransform` and edge-aligned `Widget` components.

## Automated Components And Bindings

The extension assigns:

- `BackgroundSwitcher.primarySprite` and `transitionSprite`.
- Eight `Chapter0Interactable` IDs, names, Buttons, Labels, Graphics markers,
  lock state, positions, and sizes.
- `MemoryFlashbackController.vignetteGraphics`.
- All `TimelineInstabilityIndicator` references.
- `DialoguePortrait.portraitSprite`.
- `DialogueChoiceList.container`.
- All required `DialogueBox` Labels, Buttons, Graphics, portrait, choice list,
  and `dialogue_theme.json` references.
- `ScreenFader.overlayGraphics`.
- All `Chapter0SceneController` subsystem, root, and interactable references.
- `manifestResource` as `dialogue/chapter0/ch0_manifest`.

Dialogue JSON, backgrounds, and portraits remain runtime-loaded through
`ch0_manifest.json`; they are not duplicated as scene references.

## Hotspot Contract

| Node | ID | Position | Size |
|---|---|---:|---:|
| `BrokenTimeDevice` | `broken_time_device` | `(0, -160)` | `211 x 90` |
| `DamagedIdCard` | `damaged_id_card` | `(-221, -192)` | `154 x 64` |
| `ResearchNotes` | `research_notes` | `(-288, -13)` | `173 x 77` |
| `OldNewspaper` | `old_newspaper` | `(211, -192)` | `173 x 70` |
| `CrackedWatch` | `cracked_watch` | `(-106, -237)` | `125 x 58` |
| `LabTerminal` | `lab_terminal` | `(269, 19)` | `192 x 102` |
| `MemoryShard` | `memory_shard` | `(77, 51)` | `154 x 102` |
| `ExitDoor` | `exit_corridor` | `(394, 0)` | `134 x 179` |

`ExitDoor.showWhenLocked` is enabled. The other hotspots start hidden until
the Chapter 0 flow enters investigation mode.

## Validation Coverage

The build and validation commands check:

- the open scene UUID and Canvas;
- every required hierarchy path;
- every required built-in and Chapter 0 component;
- all serialized component and node references;
- all eight interactable IDs and controller array entries;
- the manifest and dialogue JSON;
- manifest background and portrait resource targets;
- required TypeScript, scene, theme, and UI files;
- required asset and folder `.meta` pairs and valid meta UUIDs.

The same resource/meta validation can run outside Cocos:

```powershell
node extensions/chapter0-scene-setup/dist/project-validation.js
```

## Manual TODOs

No hierarchy construction or required Inspector assignment remains manual.

The only optional visual task is replacing the generated Timeline
`StabilityBar` SpriteFrame with a custom HUD skin. The generated bar is already
bound to `ProgressBar` and does not block Chapter 0.

After the first preview, hotspot positions may be adjusted for art direction.
Rerunning the builder restores the documented positions.

## Preview

1. Save is automatic after a successful build and validation.
2. Make `Chapter0.scene` the preview or build start scene.
3. Click **Preview** and select **Browser**.
4. Confirm the abandoned room and opening narration appear.
5. Continue to investigation mode and inspect the broken time device plus two
   other objects.
6. Confirm the exit unlocks, flashbacks change the presentation, and the
   timeline instability warning appears at completion.

## If The Command Is Missing

1. Confirm `extensions/chapter0-scene-setup/package.json` exists.
2. Open **Extension > Extension Manager** and reload or enable the project
   extension.
3. Reopen the project if the extension was added while Creator was running.
4. Check the Console for extension package errors.

## If The Build Fails

1. Open `Chapter0.scene`; the command refuses to target another scene.
2. Wait for all project scripts to compile so custom component classes are
   registered.
3. Run **Validate Chapter0.scene** and read the first Console error.
4. Run the standalone project validator to isolate JSON or `.meta` issues.
5. Refresh the Asset panel if a manifest resource has not imported.

The builder does not save when live scene validation fails.
