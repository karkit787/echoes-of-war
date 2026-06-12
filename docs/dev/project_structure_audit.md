# Project Structure Audit

**Audit date:** 12 June 2026  
**Scope:** Full repository structure, Chapter 0 runtime content, source content,
documentation, empty scaffolding, and move risk  
**Phase:** Pre-cleanup audit

## Executive Summary

The repository follows a Cocos Creator 3.x-oriented layout, but it is **not yet
an initialized Cocos Creator project**. No `project.json`, engine settings,
`.scene`, `.prefab`, or `.meta` files exist. TypeScript components and runtime
assets are present, but the editor has not imported them or assigned UUIDs.

The current structure is mostly sound. The main cleanup opportunities are:

1. Remove `.gitkeep` files from folders that now contain real files.
2. Remove empty `assets/resources/*` categories that duplicate active runtime
   locations.
3. Keep Chapter 0 dialogue in `assets/dialogue/chapter0` as the only runtime
   dialogue source of truth.
4. Move non-runtime art-generation prompts out of `assets/`.
5. Move Chapter 0-specific controllers out of generic `assets/scripts/player/`.
6. Move reusable dialogue artwork from `assets/images/ui/` to `assets/ui/`.
7. Remove an empty legacy `docs/codex/references/` directory.

Because Cocos metadata does not yet exist, these moves do not risk breaking
UUID-based scene or prefab references. They still require TypeScript imports,
tests, validators, documentation paths, and manifest references to be checked.

## Current Folder Tree Summary

```text
.
├─ .agents/skills/                       Codex workflow instructions
├─ assets/                               Cocos runtime/import root
│  ├─ audio/
│  │  ├─ music/                          empty reserved scaffold
│  │  └─ sfx/                            empty reserved scaffold
│  ├─ dialogue/chapter0/                 five active runtime JSON files
│  ├─ fonts/                             empty reserved scaffold
│  ├─ images/
│  │  ├─ chapter0/backgrounds/           five runtime PNG backgrounds
│  │  ├─ chapter0/characters/            six runtime PNG portraits
│  │  └─ ui/dialogue/                    two reusable UI SVG textures
│  ├─ prefabs/                           empty reserved Cocos scaffold
│  ├─ prompts/chapter0/                  non-runtime generation source files
│  ├─ resources/
│  │  ├─ chapters/                       empty duplicate scaffold
│  │  ├─ characters/                     empty duplicate scaffold
│  │  ├─ dialogue/                       empty duplicate scaffold
│  │  ├─ historical-sources/             empty duplicate scaffold
│  │  └─ ui/dialogue/                    active runtime-loaded theme/demo JSON
│  ├─ scenes/                            empty reserved Cocos scaffold
│  ├─ scripts/
│  │  ├─ ai-companion/                   empty reserved scaffold
│  │  ├─ core/                           progress state
│  │  ├─ dialogue/                       dialogue types and manager
│  │  ├─ history/                        empty reserved scaffold
│  │  ├─ player/                         interactable plus Chapter 0 controllers
│  │  ├─ ui/                             reusable Cocos UI components
│  │  └─ utils/                          empty reserved scaffold
│  └─ textures/                          empty duplicate scaffold
├─ content/                              non-runtime source/planning content
│  ├─ assessments/                       empty reserved scaffold
│  ├─ chapters/
│  │  ├─ chapter-0-prologue/             empty reserved scaffold
│  │  ├─ chapter-1-after-world-war-i/    empty reserved scaffold
│  │  └─ future-chapters/                empty reserved scaffold
│  ├─ dialogue/                          three empty duplicate scaffolds
│  ├─ historical-events/                 empty reserved scaffold
│  └─ source-exercises/                  empty reserved scaffold
├─ docs/
│  ├─ codex/                             maintained project context
│  ├─ design/                            empty reserved design categories
│  ├─ dev/                               active audits, plans, and guides
│  ├─ narrative/                         Chapter 0 dialogue notes
│  ├─ references/                        syllabus and style references
│  ├─ research/                          empty reserved research categories
│  └─ visual-style/                      Chapter 0 visual guide
├─ tests/                                active dialogue/gameplay Node tests
└─ tools/                                active validation scripts
```

## Major Folder Purposes

| Folder | Classification | Current purpose | Runtime status |
|---|---|---|---|
| `assets/` | Runtime/import root | Cocos scripts, images, JSON, UI, scenes, prefabs, audio | Shipped/imported |
| `assets/dialogue/` | Runtime data | Authored Chapter 0 dialogue graph assigned as `JsonAsset` | Active |
| `assets/resources/` | Runtime dynamic-load root | Assets loaded through Cocos `resources.load` | Partially active |
| `assets/scripts/` | Runtime code | Cocos components and pure TypeScript systems | Active |
| `assets/images/` | Runtime art | Chapter backgrounds and portraits | Active |
| `assets/prompts/` | Source/provenance | Art-generation prompts and manifests | Misclassified; non-runtime |
| `content/` | Source content | Writing, planning, historical anchors, assessments | Reserved/non-runtime |
| `docs/` | Documentation | Developer, narrative, research, reference, visual guidance | Non-runtime |
| `tests/` | QA | Engine-independent dialogue and gameplay tests | Development only |
| `tools/` | QA/build tooling | PowerShell validators and future build scripts | Development only |

## Chapter 0 Files

### Runtime Data

```text
assets/dialogue/chapter0/
  ch0_intro.json
  ch0_room_inspections.json
  ch0_flashbacks.json
  ch0_ai_fragments.json
  ch0_choices.json
```

These files are the current runtime source of truth. `Chapter0SceneController`
receives them as editor-bound `JsonAsset` values. Tests and validators load
them directly from this exact folder.

### Runtime Art

```text
assets/images/chapter0/backgrounds/    five PNG backgrounds
assets/images/chapter0/characters/     six PNG portraits
```

Dialogue uses asset IDs rather than filesystem paths. `BackgroundSwitcher` and
`DialoguePortrait` require editor-bound `SpriteFrame` registries after Cocos
initialization. Tests and validators currently resolve the IDs to these paths.

### Runtime Scripts

```text
assets/scripts/core/ChapterProgressState.ts
assets/scripts/dialogue/DialogueManager.ts
assets/scripts/dialogue/DialogueTypes.ts
assets/scripts/player/Chapter0FlowController.ts
assets/scripts/player/Chapter0SceneController.ts
assets/scripts/player/InteractableObject.ts
assets/scripts/ui/*.ts
```

The two `Chapter0*Controller` files are chapter-specific and are the only
clearly misplaced source files. `InteractableObject.ts` is reusable and belongs
in `player/`.

### Runtime UI

```text
assets/images/ui/dialogue/             two optional rough-edge SVG textures
assets/resources/ui/dialogue/          theme and fallback demo JSON
assets/scripts/ui/                     reusable dialogue and scene UI
```

The JSON resources must remain under `assets/resources/ui/dialogue` because
`DialogueDemo` calls:

```text
resources.load("ui/dialogue/dialogue_ui_demo", JsonAsset, ...)
```

The SVG files do not use `resources.load`; they can move to the clearer
`assets/ui/dialogue/` location before Cocos metadata exists.

### Non-Runtime Chapter 0 Source

```text
assets/prompts/chapter0/
  asset_manifest.json
  background_manifest.json
  background_prompts.md
  character_portraits.md
  negative_prompts.md
```

These are generation provenance and design source, not game runtime content.
They should live under the reserved Chapter 0 source folder:

```text
content/chapters/chapter-0-prologue/art-prompts/
```

### Documentation

```text
docs/dev/chapter0_*.md
docs/narrative/chapter0_dialogue_notes.md
docs/visual-style/chapter0_character_style_guide.md
```

These locations are consistent with the requested `docs/` responsibility.

## Empty Folder Assessment

### Keep As Intentional Future Structure

| Path | Decision | Reason |
|---|---|---|
| `assets/audio/music/` | Keep empty | Expected runtime audio category |
| `assets/audio/sfx/` | Keep empty | Expected runtime audio category |
| `assets/fonts/` | Keep empty | Expected runtime font category |
| `assets/prefabs/` | Keep empty | Required future Cocos prefab location |
| `assets/scenes/` | Keep empty | Required future Cocos scene location |
| `assets/scripts/ai-companion/` | Keep empty | Planned reusable companion service |
| `assets/scripts/history/` | Keep empty | Planned history/timeline systems |
| `assets/scripts/utils/` | Keep empty | Reserved common utilities |
| `content/assessments/` | Keep empty | Planned non-runtime learning checks |
| `content/chapters/chapter-0-prologue/` | Keep | Becomes Chapter 0 source/provenance root |
| `content/chapters/chapter-1-after-world-war-i/` | Keep empty | Planned Chapter 1 source |
| `content/chapters/future-chapters/` | Keep empty | Planned chapter source |
| `content/historical-events/` | Keep empty | Planned historical anchors |
| `content/source-exercises/` | Keep empty | Planned inquiry source exercises |
| `docs/design/*` | Keep empty | Intentional design documentation categories |
| `docs/research/*` | Keep empty | Intentional research categories |
| `tests/history-content/` | Keep empty | Planned historical-content checks |
| `tools/build-scripts/` | Keep empty | Planned build/sync automation |

### Remove As Empty Duplicates

| Path | Reason |
|---|---|
| `assets/resources/chapters/` | Duplicates `assets/dialogue/` and future scene data without any loader |
| `assets/resources/characters/` | Duplicates `assets/images/chapter0/characters/` |
| `assets/resources/dialogue/` | Duplicates active `assets/dialogue/`; no `resources.load` call uses it |
| `assets/resources/historical-sources/` | Historical sources belong in `content/` or `docs/`, not shipped resources |
| `assets/textures/` | Empty duplicate of the chosen `assets/images/` / `assets/ui/` structure |
| `content/dialogue/ai-personalities/` | Empty duplicate; runtime dialogue is already consolidated |
| `content/dialogue/npc-dialogue/` | Empty duplicate; future authored dialogue can live within chapter source |
| `content/dialogue/player-decisions/` | Empty duplicate; decisions are chapter data |
| `docs/codex/references/moe-history-syllabus/` | Empty legacy path; active references are under `docs/references/` |

Removing these means deleting only `.gitkeep` files or empty directories. No
substantive content is involved.

### Remove Redundant `.gitkeep` Files From Populated Folders

```text
assets/scripts/core/.gitkeep
assets/scripts/dialogue/.gitkeep
assets/scripts/player/.gitkeep
assets/scripts/ui/.gitkeep
docs/references/moe-history-syllabus/.gitkeep
tests/dialogue/.gitkeep
tests/gameplay/.gitkeep
tools/content-validation/.gitkeep
```

## Duplicate Folders And Source Of Truth

### Dialogue JSON

**Recommended source of truth:** `assets/dialogue/chapter0/`

Reason:

- The JSON is complete runtime content, not merely prose notes.
- `Chapter0SceneController` expects editor-assigned `JsonAsset` files.
- Validators and Node tests use this folder.
- Cocos imports files anywhere under `assets/`; they do not need to be under
  `resources/` unless dynamically loaded by string path.
- Maintaining copies in `content/dialogue` and `assets/resources/dialogue`
  would create drift.

Future prose drafts, historical planning, or source notes should live under
`content/chapters/<chapter>/`. If a source-to-runtime generation pipeline is
introduced later, it should generate `assets/dialogue/<chapter>/` rather than
create manually maintained duplicates.

### UI Assets

- `assets/resources/ui/dialogue/` remains the source for theme/demo JSON loaded
  through `resources.load`.
- Reusable visual UI files should use `assets/ui/dialogue/`.
- `assets/images/ui/dialogue/` is not wrong for Cocos, but it conflicts with
  the agreed top-level UI category and can be moved safely before `.meta` files
  exist.

### Chapter Scripts

- `assets/scripts/dialogue/` remains reusable dialogue infrastructure.
- `assets/scripts/player/` retains reusable interaction code.
- `assets/scripts/chapter0/` should own `Chapter0FlowController.ts` and
  `Chapter0SceneController.ts`.

## Code And Path References

### Dialogue JSON References

| Reference | Current behavior | Move sensitivity |
|---|---|---|
| `Chapter0SceneController.dialogueFiles` | Editor-assigned `JsonAsset[]` | Scene binding must be redone if moved after metadata generation |
| `DialogueDemo.dialogueFiles` | Optional editor-assigned `JsonAsset[]` | Same |
| `validate-chapter0-dialogue.ps1` | Hardcoded `assets/dialogue/chapter0` | Must update if dialogue moves |
| `chapter0_vertical_slice.test.mjs` | Reads five exact paths | Must update if dialogue moves |
| `chapter0_qa.test.mjs` | Reads five exact paths | Must update if dialogue moves |

No evidence supports moving the dialogue JSON, so these references should
remain unchanged.

### Resources References

| Reference | Path |
|---|---|
| `DialogueDemo.fallbackDemoResource` | `ui/dialogue/dialogue_ui_demo` |
| Cocos dynamic root | `assets/resources/` |
| Resolved file | `assets/resources/ui/dialogue/dialogue_ui_demo.json` |

Moving the fallback demo outside `assets/resources` would break
`resources.load`.

### Script Imports

`Chapter0SceneController.ts` imports core, dialogue, UI, flow, and interactable
modules through relative paths. Moving both Chapter 0 controllers together to
`assets/scripts/chapter0/` preserves most `../` imports; the
`InteractableObject` import must change from local `./InteractableObject` to
`../player/InteractableObject`.

Tests and validators contain literal source paths and must also be updated.

### Portrait And Background References

Dialogue JSON uses these IDs:

```text
char_ch0_main_trainee_historian_portrait
char_ch0_ai_logic_portrait
char_ch0_ai_empathy_portrait
char_ch0_ai_scepticism_portrait
char_ch0_ai_memory_portrait
char_ch0_ai_conscience_portrait

bg_ch0_abandoned_room
bg_ch0_abandoned_corridor
bg_ch0_time_machine_chamber
bg_ch0_destroyed_lab_flashback
bg_ch0_memory_void
```

Runtime code does not contain PNG filesystem paths. The registries bind IDs to
`SpriteFrame` assets in the Cocos editor. Validators and tests do contain the
current filesystem paths. No image move is recommended.

### Scene And Prefab References

No scene, prefab, `.meta`, or UUID reference exists. `assets/scenes/` and
`assets/prefabs/` are empty reserved folders. There is currently no serialized
reference to update, but future moves after Cocos import should be performed in
the editor or with `.meta` files preserved.

## Risks If Files Move

| Risk | Level | Mitigation |
|---|---|---|
| Cocos UUID reference breakage | Currently low | No `.meta`, scene, or prefab files exist; stop structural moves after editor import unless metadata is preserved |
| Relative TypeScript import breakage | Medium | Update imports and run local-import validator |
| Test/validator stale paths | Medium | Search literal old paths and run complete QA suite |
| Documentation becoming misleading | Low | Update maintained guides and mark old audit assumptions |
| Runtime `resources.load` failure | High for resource files | Do not move `assets/resources/ui/dialogue` |
| Dialogue source duplication/drift | Medium | Keep only `assets/dialogue/chapter0` as runtime source |
| Prompt files shipped unnecessarily | Low now, package risk later | Move prompts to `content/` before Cocos packaging |

## Recommended Final Structure

```text
assets/
  audio/
    music/
    sfx/
  dialogue/
    chapter0/
  fonts/
  images/
    chapter0/
      backgrounds/
      characters/
  prefabs/
  resources/
    ui/
      dialogue/
  scenes/
  scripts/
    ai-companion/
    chapter0/
      Chapter0FlowController.ts
      Chapter0SceneController.ts
    core/
    dialogue/
    history/
    player/
      InteractableObject.ts
    ui/
    utils/
  ui/
    dialogue/

content/
  assessments/
  chapters/
    chapter-0-prologue/
      art-prompts/
    chapter-1-after-world-war-i/
    future-chapters/
  historical-events/
  source-exercises/

docs/
  codex/
  design/
  dev/
  narrative/
  references/
  research/
  visual-style/

tests/
tools/
```

## Audit Conclusion

Chapter 0 runtime files are generally placed consistently. The dialogue JSON
should remain in `assets/dialogue/chapter0`, images should remain in
`assets/images/chapter0`, and dynamic demo/theme JSON should remain under
`assets/resources/ui/dialogue`.

Low-risk cleanup is possible now because Cocos metadata does not exist. The
cleanup should stop short of moving any image, dialogue JSON, substantive
source code other than the two clearly chapter-specific controllers, or any
non-empty folder whose destination is uncertain.

