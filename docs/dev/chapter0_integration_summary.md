# Chapter 0 Cocos Integration Summary

## Result

Chapter 0 is now structured as a Cocos Creator 3.8.8 runtime feature. The
existing scene was inspected and preserved as an editor-authored Canvas/Camera
shell. A project extension now builds, binds, validates, and saves the complete
Chapter 0 hierarchy through Cocos Creator's scene process.

## Runtime Source Of Truth

```text
assets/scenes/Chapter0.scene
assets/scripts/chapter0/
assets/scripts/core/
assets/scripts/dialogue/
assets/scripts/ui/
assets/resources/dialogue/chapter0/
assets/resources/images/chapter0/
extensions/chapter0-scene-setup/
```

The controller loads `ch0_manifest.json`, then loads dialogue JsonAssets and
SpriteFrames through `resources.load()`. Core Chapter 0 play does not depend on
live AI or network access.

## Files Created

- `assets/scripts/core/SpeakerRegistry.ts`
- `assets/scripts/ui/DialogueChoiceButton.ts`
- `assets/resources/dialogue/chapter0/ch0_manifest.json`
- `assets/resources/images/chapter0/props/.gitkeep`
- `docs/dev/chapter0_cocos_scene_setup.md`
- `docs/dev/chapter0_integration_summary.md`
- `docs/dev/run_game.md`
- `extensions/chapter0-scene-setup/package.json`
- `extensions/chapter0-scene-setup/dist/main.js`
- `extensions/chapter0-scene-setup/dist/scene.js`
- `extensions/chapter0-scene-setup/dist/project-validation.js`

Cocos `.meta` files were added for the new runtime assets and the empty props
directory.

## Files Moved With Metadata

| Previous path | New path |
|---|---|
| `assets/dialogue/` | `assets/resources/dialogue/` |
| `assets/images/` | `assets/resources/images/` |
| `assets/ui/dialogue/` | `assets/resources/images/chapter0/ui/` |
| `assets/scripts/player/InteractableObject.ts` | `assets/scripts/chapter0/Chapter0Interactable.ts` |
| `assets/scripts/ui/MemoryFlashbackController.ts` | `assets/scripts/chapter0/MemoryFlashbackController.ts` |

Every imported move included its adjacent `.meta` file. Existing portrait PNG
files were not overwritten or regenerated.

## Runtime Changes

- `Chapter0SceneController` now loads the Chapter 0 manifest, dialogue,
  backgrounds, and portraits from `assets/resources/`.
- `SpeakerRegistry` provides stable speaker names, accent colours, portrait
  IDs, and portrait resource paths.
- `DialogueChoiceButton` supports reusable choice prefabs and the generated
  fallback buttons.
- `DialogueBox` retains speaker name, portrait, dialogue text, choices,
  continue interaction, speaker accents, and typewriter reveal.
- `Chapter0Interactable` handles the seven evidence objects and exit door.
- `MemoryFlashbackController` is now chapter-owned and works with the
  manifest-loaded memory backgrounds.
- Tests and validators now use the resources paths and validate the manifest.
- The Chapter 0 project extension creates the scene hierarchy, attaches
  built-in and project components, assigns Inspector-equivalent references,
  validates the live graph, and saves only after validation succeeds.
- `ScreenFader` now draws its assigned full-screen Graphics overlay at runtime,
  so the automated fade binding produces a real black fade.

## Existing Content Preserved

- Five Chapter 0 dialogue documents, including the required four and the
  existing `ch0_ai_fragments.json`.
- Five Chapter 0 backgrounds.
- Six existing character and consciousness portraits.
- Existing narrative, planning, curriculum, and visual design documentation.
- Existing deterministic dialogue and gameplay tests.

## Editor Automation

Open `Chapter0.scene`, then run:

**Echoes of War > Chapter 0 > Build and Bind Chapter0.scene**

The command rebuilds only the named Chapter 0 roots, preserves Camera and
unrelated nodes, validates resources and `.meta` pairs, validates all live
component references, and saves through Cocos Creator.

No required hierarchy or Inspector field remains manual. A custom visual
SpriteFrame for the timeline bar and art-direction adjustments to hotspot
positions remain optional.

## Scope Boundary

This integration stops at the Chapter 0 completion event and timeline
instability warning. No Chapter 1 scene or content was implemented.
