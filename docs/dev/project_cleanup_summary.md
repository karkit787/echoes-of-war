# Project Cleanup Summary

**Cleanup date:** 12 June 2026  
**Result:** Low-risk cleanup completed

## Source-of-Truth Decisions

- Runtime Cocos assets remain under `assets/`.
- Runtime Chapter 0 dialogue remains in `assets/dialogue/chapter0/`.
- Only files loaded through `resources.load()` remain under
  `assets/resources/`.
- Chapter writing, planning, and art-generation provenance belong under
  `content/chapters/`.
- Developer and design documentation remains under `docs/`.

## Folders Kept

- `assets/dialogue/chapter0/`: active runtime dialogue JSON.
- `assets/images/chapter0/`: active backgrounds and character portraits.
- `assets/resources/ui/dialogue/`: JSON loaded by the dialogue UI demo.
- `assets/scripts/core/`, `dialogue/`, `player/`, and `ui/`: reusable systems.
- `assets/audio/`, `fonts/`, `prefabs/`, and `scenes/`: intentional Cocos
  runtime scaffolds.
- `assets/scripts/ai-companion/`, `history/`, and `utils/`: planned code
  categories.
- Empty Chapter 1, future-content, assessment, research, design, history-test,
  and build-script folders remain reserved with `.gitkeep`.

## Folders and Files Moved

| Previous path | Current path |
|---|---|
| `assets/prompts/chapter0/*` | `content/chapters/chapter-0-prologue/art-prompts/*` |
| `assets/images/ui/dialogue/*.svg` | `assets/ui/dialogue/*.svg` |
| `assets/scripts/player/Chapter0FlowController.ts` | `assets/scripts/chapter0/Chapter0FlowController.ts` |
| `assets/scripts/player/Chapter0SceneController.ts` | `assets/scripts/chapter0/Chapter0SceneController.ts` |

The Chapter 0 scene controller now imports the reusable
`assets/scripts/player/InteractableObject.ts` component from its new relative
location.

## Empty Folders Deleted

Only verified empty directories were deleted:

- `assets/prompts/`
- `assets/images/ui/`
- `assets/resources/chapters/`
- `assets/resources/characters/`
- `assets/resources/dialogue/`
- `assets/resources/historical-sources/`
- `assets/textures/`
- `content/dialogue/`
- `docs/codex/references/`

Redundant `.gitkeep` files were also removed from folders that now contain
real code, tests, tools, Chapter 0 content, or syllabus files. No substantive
file and no non-empty folder was deleted.

## References Updated

- Chapter 0 gameplay tests and scene validator now use
  `assets/scripts/chapter0/`.
- The scene validator now checks imports inside the new Chapter 0 script
  folder.
- Dialogue UI validation and documentation now use `assets/ui/dialogue/`.
- Visual-style and project documentation now point to the Chapter 0
  `art-prompts/` source folder.
- `docs/PROJECT_STRUCTURE.md` now documents the runtime/source distinction and
  the limited purpose of `assets/resources/`.
- Older Chapter 0 planning documents were aligned with the selected dialogue
  and UI paths.

## Validation Results

- All repository JSON files parse successfully.
- Chapter 0 dialogue validation passes: 5 files, 110 nodes, 5 decisions,
  3 flashbacks, and 7 inspections with at least two fragment responders.
- Dialogue UI validation passes: 12 UI/dialogue TypeScript files and 8 speaker
  styles.
- Dialogue manager runtime test passes.
- Vertical-slice playthrough test passes.
- Exhaustive Chapter 0 QA passes: 8 interactables, 17 choice branches,
  6 portraits, 5 backgrounds, and flashback restoration.
- Scene validation passes and resolves local imports across 16 TypeScript
  files.
- No stale cleanup paths remain outside the historical audit and cleanup-plan
  tables.
- `git diff --check` reports no whitespace errors.

## Skipped for Safety

- No Chapter 0 dialogue JSON, portrait, background, or substantive source file
  was deleted.
- Runtime images and dialogue were not moved because their locations are
  already consistent.
- No scene, prefab, or Cocos UUID references were changed because none exist
  yet.
- At cleanup time, a Cocos build could not be run because the repository had
  not yet been initialized. It is now a Cocos Creator 3.8.8 project with
  generated `.meta` files and an initial `Chapter0.scene` shell; no gameplay
  bindings or `.prefab` have been serialized yet.

## Remaining Risks

The TypeScript and data layer is internally consistent and the repository is
now editor-launchable. Actual gameplay scene binding, visual preview, and
WeChat build output remain unverified.

## Manual Follow-Up

1. Open the repository root with Cocos Creator 3.8.x.
2. Preserve the imported `.meta` files during any future structural moves.
3. Create the Chapter 0 scene/prefab bindings described in
   `docs/dev/chapter0_playable_scene.md`.
4. Run a Cocos web preview, then configure and run the WeChat Mini Game build.
5. Re-run `tools/content-validation/validate-chapter0-scene.ps1` after editor
   integration.
