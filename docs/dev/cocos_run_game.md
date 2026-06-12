# Run Echoes of War in Cocos Creator

> Superseded by `docs/dev/run_game.md` and
> `docs/dev/chapter0_cocos_scene_setup.md`.

## Requirements

- Cocos Creator 3.8.x. The project currently records version 3.8.8.
- The repository opened at `D:\FYP\echoes-of-war-cocos`.

## Open the Project

1. Start Cocos Dashboard.
2. Import or open `D:\FYP\echoes-of-war-cocos`.
3. Wait for asset import and script compilation to finish.
4. Check the Console for import or TypeScript errors.

Do not delete or regenerate existing `.meta` files. They preserve the UUIDs
assigned to the imported scripts, JSON, images, folders, and UI assets.

## Current Playable-Scene Status

The project includes `assets/scenes/Chapter0.scene` as a serialized shell with
the default Canvas and Camera. Before the first preview:

1. Open `assets/scenes/Chapter0.scene`.
2. Build and bind the node hierarchy described in
   `docs/dev/chapter0_playable_scene.md`.
3. Assign all five JSON files from `assets/dialogue/chapter0/` to
   `Chapter0SceneController.dialogueFiles`.
4. Assign the five background SpriteFrames and six portrait SpriteFrames to
   their inspector registries.
5. Save the scene and wait for Cocos to finish importing its `.meta` file.

The scene should be created and saved in the editor. Do not hand-author a
`.scene` file or its UUID metadata.

## Preview

1. Open `Chapter0.scene`.
2. Set it as the current launch scene if Cocos prompts for one.
3. Click the Preview button and choose Browser.
4. Follow `docs/dev/chapter0_playtest_checklist.md`.

The first playable flow should start at `ch0_intro_wake_001`, enter room
investigation, trigger memory flashbacks, unlock the corridor, display the
timeline warning, and emit `chapter0-complete`.

## Validate Before Preview

From PowerShell at the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File tools/content-validation/validate-cocos-migration.ps1
powershell -ExecutionPolicy Bypass -File tools/content-validation/validate-chapter0-scene.ps1
node "C:\ProgramData\cocos\editors\Creator\3.8.8\resources\app.asar.unpacked\node_modules\typescript\lib\tsc.js" -p tsconfig.json --noEmit
```

The first command checks JSON, `.meta` pairing, resource placement, and Git
ignore rules. The second runs the complete Chapter 0 content and gameplay QA
suite. The final command uses the TypeScript compiler bundled with Cocos.

## Build Hygiene

Do not commit:

- `build/`
- `library/`
- `temp/`
- `local/`

Do commit imported asset `.meta` files and future `.scene.meta` or
`.prefab.meta` files. Cocos references those UUIDs from serialized assets.

## WeChat Build

After browser preview passes, open **Project > Build**, select the WeChat Mini
Game target, configure the project/app identifiers required by the deployment
environment, and build to `build/`. Keep networking optional so the scripted
companion fallback remains usable when live AI is unavailable.
