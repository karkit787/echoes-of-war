# Chapter 0 Dialogue UI

> Runtime resource paths and current scene binding instructions are maintained
> in `docs/dev/chapter0_cocos_scene_setup.md`.

## Status

The reusable dialogue runtime and Cocos Creator components are implemented.
The repository is now an initialized Cocos Creator 3.8.8 project with imported
asset metadata and a `Chapter0.scene` shell. No dialogue prefab or scene
bindings have been serialized yet.

Current implementation target: **Cocos Creator 3.8.8 TypeScript**.
Create and commit the prefab through the Cocos editor so UUID references remain
valid.

## Implemented Files

### Runtime

- `assets/scripts/dialogue/DialogueTypes.ts`
- `assets/scripts/dialogue/DialogueManager.ts`

`DialogueManager` is independent of Cocos. It:

- indexes multiple cross-referenced dialogue JSON files;
- validates duplicate IDs and missing targets;
- advances linear nodes;
- filters and selects choices;
- applies `set`, `setIfAbsent`, `increment`, and `appendUnique` effects;
- evaluates dialogue conditions;
- records dialogue history;
- creates and restores serializable snapshots.

### Cocos UI

- `assets/scripts/ui/DialogueBox.ts`
- `assets/scripts/ui/DialogueChoiceList.ts`
- `assets/scripts/ui/DialoguePortrait.ts`
- `assets/scripts/ui/DialogueHistoryPanel.ts`
- `assets/scripts/ui/DialogueTheme.ts`
- `assets/scripts/ui/DialogueDemo.ts`

### Editable Resources

- `assets/resources/ui/dialogue/dialogue_theme.json`
- `assets/resources/ui/dialogue/dialogue_ui_demo.json`
- `assets/ui/dialogue/dialogue_panel_rough.svg`
- `assets/ui/dialogue/dialogue_choice_rough.svg`

The SVG files are original rough-edged textures for optional nine-sliced panel
and choice sprites. The UI also supports procedural `Graphics` backgrounds, so
it remains functional if SVG import behavior changes between Cocos versions.

## Supported Presentation

- Speaker display name.
- Speaker portrait through an editor-bound asset registry.
- Typewriter reveal with tap-to-complete.
- Continue button or optional whole-panel advance button.
- Conditional player choices.
- Distinct Logic, Empathy, Scepticism, Memory, and Conscience accents.
- Portrait-free narration and system/objective presentation.
- Optional scrollable dialogue history panel.
- Serializable state suitable for later save/load.
- Layout nodes that can be anchored with Cocos `Widget` for mobile screens.

## Original Visual System

The panel uses charcoal translucency, irregular edges, off-white text, and one
restrained vertical accent. It does not reproduce another game's card layout,
typography, iconography, or composition.

| Speaker | Accent |
|---|---|
| Logic | Cold blue-grey |
| Empathy | Muted violet |
| Scepticism | Dark indigo |
| Memory | Faded blue-grey |
| Conscience | Pale ivory / muted ochre |
| Player | Neutral grey |
| Narration | Desaturated charcoal-grey |

Edit `dialogue_theme.json` to tune the palette without changing component
code.

## Recommended Prefab Hierarchy

Create this hierarchy after opening the repository in the confirmed Cocos
Creator version:

```text
DialoguePanel                     Widget: left/right 24, bottom safe area + 20
  PanelBackground                 Sprite or Graphics, stretch to parent
  Accent                          Sprite or Graphics, narrow left strip
  PortraitRoot                    DialoguePortrait
    Portrait                      Sprite
  SpeakerName                     Label
  DialogueText                    Label
  ChoiceRoot                      DialogueChoiceList + vertical Layout
  ContinueButton                  Button
    Label                         Label
  HistoryButton                   Button
  HistoryRoot                     DialogueHistoryPanel, initially hidden
    ScrollView
      View
        Content                   vertical Layout
    CloseButton                   Button
```

Attach `DialogueBox` to `DialoguePanel` and bind its properties to the
corresponding nodes. Add `DialogueDemo` to the same node or a scene controller.

## Portrait Binding

On `DialoguePortrait`, add six `DialoguePortraitEntry` records:

| Asset ID | SpriteFrame |
|---|---|
| `char_ch0_main_trainee_historian_portrait` | Main character portrait |
| `char_ch0_ai_logic_portrait` | Logic portrait |
| `char_ch0_ai_empathy_portrait` | Empathy portrait |
| `char_ch0_ai_scepticism_portrait` | Scepticism portrait |
| `char_ch0_ai_memory_portrait` | Memory portrait |
| `char_ch0_ai_conscience_portrait` | Conscience portrait |

This registry avoids runtime filesystem assumptions and lets Cocos serialize
stable SpriteFrame UUIDs after asset import.

## Demo Setup

For the minimal UI demo:

1. Attach `DialogueDemo` to a scene node.
2. Assign the configured `DialogueBox`.
3. Leave `dialogueFiles` empty.
4. Run the scene.

The controller loads
`resources/ui/dialogue/dialogue_ui_demo.json`, starting at its entry node. The
demo shows narration, Logic styling, two choices, and a Conscience or narration
ending.

To run the real Chapter 0 data instead:

1. Drag all five files from `assets/dialogue/chapter0/` into
   `DialogueDemo.dialogueFiles`.
2. Keep `entryNodeId` as `ch0_intro_wake_001`.
3. Ensure all six portrait bindings are assigned.

All five files must be loaded because Chapter 0 references nodes across files.
`DialogueDemo` remains a presentation-only demo. The playable integration now
uses `Chapter0SceneController`; see `docs/dev/chapter0_playable_scene.md`.

## Responsive Layout

- Anchor the dialogue panel to the lower safe area with 24 logical pixels of
  horizontal margin.
- Use approximately 35-42 percent of portrait-mobile height.
- Give the portrait 20-24 percent of available panel width.
- Allow the text column and choice buttons to stretch horizontally.
- Keep choice and continue targets at least 44 logical pixels high.
- Use a `ScrollView` for history and for unusually long choice lists.
- On narrow screens, move choices below the dialogue text rather than over the
  portrait.
- Keep text at 18-22 logical pixels during target-device testing.

The future WeChat platform adapter should provide the safe-area inset. The
dialogue components do not call WeChat APIs directly.

## Component Behavior

`DialogueBox.bind(manager)` subscribes the panel to a `DialogueManager`.

- First click during typewriter animation reveals the full line.
- Next click advances when the node has no choices.
- Choice nodes hide the continue button and render only choices whose
  conditions pass.
- History is sourced from the manager, not copied into UI state.
- Narration and System nodes suppress portraits through theme settings.
- Missing portrait bindings hide the portrait safely rather than breaking the
  dialogue.

## Validation

Run:

```powershell
powershell -ExecutionPolicy Bypass -File tools/content-validation/validate-dialogue-ui.ps1
node tests/dialogue/dialogue_manager.test.mjs
```

The current repository can validate source structure, JSON resources, local
imports, palette coverage, demo references, Chapter 0 dialogue data, and the
engine-independent manager's advance/choice/effect/history/snapshot behavior.
A real Cocos TypeScript compile and visual scene test remain blocked until the
project is initialized and the editor supplies the `cc` module and asset
metadata.
