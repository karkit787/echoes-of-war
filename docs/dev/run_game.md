# Run Echoes of War

## Automated Checks

From the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File tools/content-validation/validate-cocos-migration.ps1
powershell -ExecutionPolicy Bypass -File tools/content-validation/validate-chapter0-scene.ps1
node extensions/chapter0-scene-setup/dist/project-validation.js
node "C:\ProgramData\cocos\editors\Creator\3.8.8\resources\app.asar.unpacked\node_modules\typescript\lib\tsc.js" -p tsconfig.json --noEmit
```

These checks validate JSON and the manifest, verify asset/meta pairing, test
all dialogue branches and interactables, and compile against Cocos 3.8.8
declarations.

## Automated Editor Setup

1. Open `D:\FYP\echoes-of-war-cocos` in Cocos Creator 3.8.x.
2. Wait for resource import and TypeScript compilation.
3. Open `assets/scenes/Chapter0.scene`.
4. Select **Echoes of War > Chapter 0 > Build and Bind Chapter0.scene**.
5. Confirm the project, build, and live scene validation messages all report
   `PASS` in the Console.
6. Select **Echoes of War > Chapter 0 > Validate Chapter0.scene** for a
   read-only recheck.

The build command saves the scene automatically. No manual hierarchy or
required Inspector binding is needed.

## Preview

1. Make `Chapter0.scene` the start scene.
2. Click Preview and select Browser.
3. Continue through the opening dialogue.
4. Inspect the damaged time device and at least two other room objects.
5. Use the unlocked exit door.
6. Complete the flashback reasoning choices.
7. Confirm the timeline instability warning appears.

## Expected Flow

- Abandoned-room background loads from resources.
- Opening wake-up dialogue begins automatically.
- Logic, Empathy, Scepticism, Memory, and Conscience use distinct accents and
  portraits.
- Investigation mode exposes eight clickable hotspots.
- Memory sequences switch backgrounds and enable the flashback overlay.
- Inspections set serializable progress flags.
- The exit door unlocks after the broken device and two other inspections.
- Chapter completion emits `chapter0-complete` with a progress snapshot.

## Common Problems

**Black screen remains:** Check `FadeOverlay` has `ScreenFader`, a valid
`UITransform`, an assigned `overlayGraphics`, and an assigned scene controller
reference. Rerun the builder to restore all four bindings.

**No dialogue:** Check the Console for the first missing resource. Confirm
`manifestResource` is `dialogue/chapter0/ch0_manifest`.

**No background or portrait:** Refresh the Asset panel and confirm the PNG
files expose SpriteFrame sub-assets under `assets/resources/images/chapter0/`.

**No choices:** Assign `DialogueChoiceList.container`. A choice prefab is
optional because a `DialogueChoiceButton` fallback is generated. The builder
assigns the container automatically.

**Hotspots do not respond:** Confirm each node has `Button`,
`Chapter0Interactable`, the exact ID from the setup table, and is included in
the controller's `interactables` array. The validation menu checks all eight.

**Automation menu is missing:** Reload `chapter0-scene-setup` from
**Extension > Extension Manager**, or reopen the project.

**Automation refuses to run:** Open `assets/scenes/Chapter0.scene`. The
extension targets the scene by its existing `.scene.meta` UUID and will not
modify another scene.

**Exit remains locked:** The broken time device must be inspected and
`ch0_inspection_count` must reach at least three.

## WeChat Build

After browser preview passes, use **Project > Build**, select WeChat Mini Game,
and build into the ignored `build/` folder. Chapter 0 remains fully playable
with scripted companion responses when networking or live AI is unavailable.
