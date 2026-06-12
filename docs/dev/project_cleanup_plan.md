# Project Cleanup Plan

**Plan date:** 12 June 2026  
**Strategy:** Minimal cleanup before Cocos Creator metadata exists

## Rules

- Preserve every substantive source, data, image, and documentation file.
- Keep Chapter 0 runtime dialogue in one location.
- Keep files under `assets/resources` only when dynamic `resources.load` usage
  requires it.
- Move non-runtime source material out of `assets/`.
- Preserve intentionally reserved empty folders.
- Remove only redundant `.gitkeep` files and verified empty duplicate folders.
- Stop rather than move anything with uncertain ownership.

## Planned Actions

| Current path | Proposed new path | Action | Reason | Risk | References to update |
|---|---|---|---|---|---|
| `assets/dialogue/chapter0/` | Same | keep | Runtime dialogue source of truth | Low | None |
| `assets/resources/ui/dialogue/` | Same | keep | Required by `resources.load` demo/theme path | Low | None |
| `assets/images/chapter0/backgrounds/` | Same | keep | Runtime backgrounds and tested paths | Low | None |
| `assets/images/chapter0/characters/` | Same | keep | Runtime portraits and tested paths | Low | None |
| `assets/images/ui/dialogue/` | `assets/ui/dialogue/` | move | Reusable runtime UI belongs in agreed top-level UI category | Low before `.meta` | UI guide, implementation summary, UI validator |
| `assets/prompts/chapter0/` | `content/chapters/chapter-0-prologue/art-prompts/` | move | Non-runtime generation provenance should not ship in `assets/` | Low before `.meta` | Visual style guide, project audit references |
| `assets/scripts/player/Chapter0FlowController.ts` | `assets/scripts/chapter0/Chapter0FlowController.ts` | move | Chapter-specific controller | Medium | Tests, validators, developer guides |
| `assets/scripts/player/Chapter0SceneController.ts` | `assets/scripts/chapter0/Chapter0SceneController.ts` | move | Chapter-specific controller | Medium | Relative `InteractableObject` import, tests, validators, guides |
| `assets/scripts/player/InteractableObject.ts` | Same | keep | Reusable player interaction component | Low | None |
| `assets/resources/chapters/.gitkeep` | None | delete | Empty duplicate with no loader/reference | Low | Structure docs |
| `assets/resources/characters/.gitkeep` | None | delete | Empty duplicate of runtime image registry | Low | Structure docs |
| `assets/resources/dialogue/.gitkeep` | None | delete | Empty duplicate of active dialogue folder | Low | Structure docs and stale plans |
| `assets/resources/historical-sources/.gitkeep` | None | delete | Historical source files should not be shipped by default | Low | Structure docs |
| `assets/textures/.gitkeep` | None | delete | Empty duplicate of selected image/UI structure | Low | Structure docs |
| `content/dialogue/*/.gitkeep` | None | delete | Empty duplicate hierarchy; future dialogue source belongs with chapters | Low | `docs/PROJECT_STRUCTURE.md`, stale plans |
| `assets/scripts/core/.gitkeep` | None | delete | Folder now contains code | None | None |
| `assets/scripts/dialogue/.gitkeep` | None | delete | Folder now contains code | None | None |
| `assets/scripts/player/.gitkeep` | None | delete | Folder contains `InteractableObject.ts` | None | None |
| `assets/scripts/ui/.gitkeep` | None | delete | Folder now contains code | None | None |
| `tests/dialogue/.gitkeep` | None | delete | Folder now contains tests | None | None |
| `tests/gameplay/.gitkeep` | None | delete | Folder now contains tests | None | None |
| `tools/content-validation/.gitkeep` | None | delete | Folder now contains scripts | None | None |
| `docs/references/moe-history-syllabus/.gitkeep` | None | delete | Folder contains substantive files | None | None |
| `docs/codex/references/moe-history-syllabus/` | None | delete empty | Verified empty legacy duplicate | Low | Search for old legacy path |
| `assets/audio/music/` | Same empty folder | leave-empty | Reserved runtime audio category | Low | None |
| `assets/audio/sfx/` | Same empty folder | leave-empty | Reserved runtime audio category | Low | None |
| `assets/fonts/` | Same empty folder | leave-empty | Reserved runtime font category | Low | None |
| `assets/prefabs/` | Same empty folder | leave-empty | Required future Cocos prefab root | Low | None |
| `assets/scenes/` | Same empty folder | leave-empty | Required future Cocos scene root | Low | None |
| `assets/scripts/ai-companion/` | Same empty folder | leave-empty | Planned service layer | Low | None |
| `assets/scripts/history/` | Same empty folder | leave-empty | Planned history systems | Low | None |
| `assets/scripts/utils/` | Same empty folder | leave-empty | Planned shared utilities | Low | None |
| `content/assessments/` | Same empty folder | leave-empty | Planned non-runtime assessment source | Low | None |
| `content/chapters/chapter-1-after-world-war-i/` | Same empty folder | leave-empty | Planned Chapter 1 source | Low | None |
| `content/chapters/future-chapters/` | Same empty folder | leave-empty | Planned future source | Low | None |
| `content/historical-events/` | Same empty folder | leave-empty | Planned historical anchors | Low | None |
| `content/source-exercises/` | Same empty folder | leave-empty | Planned inquiry source | Low | None |
| `docs/design/*` | Same empty folders | leave-empty | Intentional documentation categories | Low | None |
| `docs/research/*` | Same empty folders | leave-empty | Intentional research categories | Low | None |
| `tests/history-content/` | Same empty folder | leave-empty | Planned curriculum tests | Low | None |
| `tools/build-scripts/` | Same empty folder | leave-empty | Planned build/sync scripts | Low | None |

## Explicitly Skipped

| Path | Decision | Reason |
|---|---|---|
| Chapter 0 PNG files | needs no change | Runtime paths are consistent and already validated |
| Chapter 0 dialogue JSON | needs no change | Moving would create editor/test churn without benefit |
| `assets/resources/ui/dialogue/` | needs no change | Dynamic resource loading depends on this path |
| Scene/prefab creation | needs human/editor step | Cocos project and metadata do not exist |
| Runtime image compression | needs human/editor review | Requires target build and texture import settings |
| Historical/reference PDFs | needs no change | Correctly isolated under `docs/references/` |

## Execution Order

1. Create the new destination folders.
2. Move art prompt source files and UI SVG files.
3. Move the two Chapter 0 controller scripts.
4. Update TypeScript imports, tests, validators, manifests, and maintained docs.
5. Delete redundant `.gitkeep` files.
6. Verify duplicate folders are empty, then remove only those empty folders.
7. Validate all JSON, local imports, runtime paths, interactables, choices, and
   the full Chapter 0 playthrough.
8. Search for stale old paths.
9. Write `project_cleanup_summary.md`.

## Rollback Boundary

No Cocos metadata exists, so rollback consists of reversing filesystem moves
and reference edits. Once Cocos generates `.meta` files or scenes/prefabs,
future moves must preserve the matching metadata or be performed through the
Cocos editor.

