# Chapter 0 Project Audit

**Audit date:** 12 June 2026  
**Repository state inspected:** `feature/chapter-0` at commit `1e19461`

> Historical snapshot: this audit predates the Cocos Creator 3.8.8
> initialization and is superseded by `docs/dev/cocos_migration_plan.md`.

## Executive Summary

Echoes of War currently contains a documented Cocos Creator and TypeScript
direction, an organized project scaffold, and a completed set of six Chapter 0
character portraits. It is not yet an initialized or runnable Cocos Creator
project.

There are no engine configuration files, TypeScript sources, Cocos scenes,
prefabs, imported-asset metadata, UI components, runtime narrative data,
dependency manifests, tests, build scripts, or asset-loading code. Most folders
outside the Chapter 0 portrait work contain only `.gitkeep`.

The recommended next step is to confirm and pin the Cocos Creator version, open
or initialize the repository as a Cocos project, and implement one minimal
Chapter 0 scene backed by deterministic JSON dialogue data and a scripted
companion fallback.

## Detected Tech Stack

| Area | Finding | Confidence |
|---|---|---|
| Game engine | Cocos Creator is the documented target, but no Cocos project has been initialized | Intended, not runtime-confirmed |
| Language | TypeScript is the documented language for game logic | Intended; no `.ts` files exist |
| Rendering | Lightweight 2D narrative game | Documented design direction |
| Deployment | WeChat Mini Game / Mini App export | Documented current target; no platform configuration exists |
| Content format | Structured, data-driven chapter and dialogue data | Documented preference; not implemented |
| AI integration | `CompanionService` abstraction with mock and remote implementations | Documented design only |
| Package/dependency system | None detected | Confirmed from current tree |
| Test framework | None detected | Confirmed from current tree |

The repository does not contain `project.json`, `package.json`,
`tsconfig.json`, Cocos settings, `.scene`, `.prefab`, `.meta`, `.ts`, or `.js`
files. A specific Cocos Creator version cannot be inferred.

## Important Folders

| Path | Intended responsibility | Current state |
|---|---|---|
| `assets/scenes/` | Cocos scenes | Empty scaffold |
| `assets/scripts/` | TypeScript game systems | Empty responsibility folders |
| `assets/prefabs/` | Reusable Cocos nodes and UI | Empty scaffold |
| `assets/resources/` | Runtime-loadable content and lightweight assets | Empty category folders |
| `assets/images/` | Image assets | Contains six Chapter 0 portraits |
| `assets/audio/` | Music and sound effects | Empty scaffold |
| `assets/fonts/` | Runtime fonts | Empty scaffold |
| `content/chapters/` | Authored narrative and asset-generation source material | Chapter-specific source files belong here |
| `tests/` | Dialogue, gameplay, and history checks | Empty scaffold; no runner configured |
| `tools/` | Content validation and build helpers | Empty scaffold |
| `docs/codex/` | Product, curriculum, narrative, AI, and technical direction | Populated |
| `docs/visual-style/` | Visual rules | Contains the Chapter 0 portrait guide |

## Current Asset Structure

The only game-ready visual assets are under:

```text
assets/images/chapter0/characters/
  char_ch0_main_trainee_historian_portrait.png
  char_ch0_ai_logic_portrait.png
  char_ch0_ai_empathy_portrait.png
  char_ch0_ai_scepticism_portrait.png
  char_ch0_ai_memory_portrait.png
  char_ch0_ai_conscience_portrait.png
```

All six files are `1086 x 1448` PNG portraits with a 3:4 aspect ratio. Their
combined size is approximately 15.45 MB, averaging 2.58 MB each.

Supporting asset documentation exists at:

- `content/chapters/chapter-0-prologue/art-prompts/asset_manifest.json`
- `content/chapters/chapter-0-prologue/art-prompts/character_portraits.md`
- `content/chapters/chapter-0-prologue/art-prompts/negative_prompts.md`
- `docs/visual-style/chapter0_character_style_guide.md`

The manifest records prompt provenance, but it is not currently a runtime
character or asset registry. No backgrounds, investigation props, UI textures,
fonts, music, or sound effects have been added.

## Current Code Structure

The intended script responsibilities are represented by empty folders:

```text
assets/scripts/
  ai-companion/
  core/
  dialogue/
  history/
  player/
  ui/
  utils/
```

There is no executable game code. The interfaces and data types shown in
`docs/codex/TECHNICAL_DIRECTION.md` are examples, not implemented modules.

### Scene, Page, and Screen Structure

No `.scene` files or screen controllers exist. There is therefore no detected
boot scene, chapter selection screen, Chapter 0 scene, transition system, or
page hierarchy.

The documented MVP flow suggests either a direct Chapter 0 start or a chapter
selection screen, followed by dialogue, investigation, decisions, companion
interjections, timeline feedback, and save/load.

### Asset Loading

No loading mechanism exists. Searches found no use of Cocos `resources.load`,
`assetManager`, bundles, `SpriteFrame`, scene loading, or equivalent APIs.

The portraits also have no Cocos-generated `.meta` files, indicating that the
repository has not yet been imported and serialized by Cocos Creator. The files
cannot currently be referenced by stable Cocos UUIDs.

### UI Implementation

No UI code, prefab, or scene node structure exists. Dialogue panels, portrait
slots, choices, open-ended input, companion interruptions, timeline stability,
and accessibility behavior are design requirements only.

The UI should be implemented with Cocos UI nodes and reusable prefabs rather
than hardcoded separately in each chapter.

### Dialogue and Narrative Data

Runtime Chapter 0 dialogue now lives in `assets/dialogue/chapter0/`. Chapter
source notes and art-generation provenance belong under
`content/chapters/chapter-0-prologue/`. Do not recreate the retired parallel
dialogue source or runtime-resource folders.

Narrative structure, decision types, hint ladders, companion response shapes,
and fallback behavior are documented in `docs/codex/`, especially
`HISTORY_CONTENT_CONTEXT.md`, `GAMEPLAY_AI_COMPANION.md`, and
`CONTENT_AUTHORING_GUIDE.md`.

## Existing Chapter 0 Work

Implemented:

- Six reusable portrait PNGs: the trainee historian and five consciousness
  fragments.
- Exact prompt and negative-prompt records.
- A machine-readable portrait manifest.
- A visual style guide defining role-first consciousness portraits.

Documented but not implemented:

- Waking in an abandoned building at the future laboratory location.
- Environmental investigation and basic-control onboarding.
- Accident flashbacks and the time-travel failure.
- Introduction of Logic, Empathy, Scepticism, Memory, and Conscience.
- Timeline instability and the first objective.
- Decisions involving clue order, trust in memory, and interpretation of a
  timeline distortion.

Missing:

- Chapter 0 scene data and dialogue script.
- A playable Cocos scene.
- Environment and clue assets.
- Dialogue and companion UI.
- Scene runner and game state.
- Asset registry and loading code.
- Scripted AI fallback.
- Save/load.
- Tests and build configuration.

## Image Generation and Placeholder Tooling

No image-generation script, API helper, placeholder generator, or asset
processing pipeline exists in the repository. `tools/build-scripts/` and
`tools/content-validation/` contain only `.gitkeep`.

The portrait prompts document use of a built-in external generation workflow.
They make the assets reproducible at the prompt level, but there is no local
command for regeneration, resizing, compression, thumbnail creation, or import
validation.

## Recommended Chapter 0 Approach

1. **Initialize the engine project.** Confirm the required Cocos Creator
   version, initialize the repository, and commit the generated project
   settings and asset metadata.
2. **Define serializable data contracts.** Add small TypeScript interfaces for
   chapter scenes, beats, dialogue, decisions, hints, companion reactions, and
   game state.
3. **Author one linear vertical slice.** Use three to five short scenes:
   awakening, first clue, accident flashback, first consciousness interruption,
   and realization of temporal displacement.
4. **Build reusable UI prefabs.** Implement one dialogue panel, portrait panel,
   investigation prompt, choice panel, and timeline feedback element.
5. **Use deterministic content first.** Store Chapter 0 content as JSON and use
   scripted companion responses. Do not make live AI a requirement for the
   prologue.
6. **Add a narrow scene runner.** It only needs to advance beats, display
   portraits and dialogue, apply simple state changes, and present one guided
   decision.
7. **Optimize portrait delivery.** Generate mobile-sized runtime variants or
   configure suitable Cocos compression. Keep the original PNGs as source
   assets only if the package budget permits.
8. **Validate on the intended target early.** Test portrait memory use, text
   readability, touch targets, local storage, and WeChat package constraints
   before expanding Chapter 1.

## Suggested File Paths

These paths fit the existing scaffold:

```text
assets/scenes/Chapter0.scene

assets/prefabs/ui/DialoguePanel.prefab
assets/prefabs/ui/CompanionPanel.prefab
assets/prefabs/ui/DecisionPanel.prefab
assets/prefabs/ui/TimelineIndicator.prefab

assets/scripts/core/GameState.ts
assets/scripts/core/SaveService.ts
assets/scripts/core/AssetRegistry.ts
assets/scripts/dialogue/ChapterTypes.ts
assets/scripts/dialogue/ChapterRunner.ts
assets/scripts/dialogue/DialoguePanelController.ts
assets/scripts/ai-companion/CompanionTypes.ts
assets/scripts/ai-companion/CompanionService.ts
assets/scripts/ai-companion/MockCompanionService.ts
assets/scripts/ui/Chapter0Controller.ts
assets/scripts/ui/CompanionPanelController.ts
assets/scripts/ui/DecisionPanelController.ts

content/chapters/chapter-0-prologue/chapter0_prologue.json
content/chapters/chapter-0-prologue/chapter0_companion_fallbacks.json

assets/dialogue/chapter0/ch0_ai_fragments.json
assets/dialogue/chapter0/ch0_choices.json

tests/gameplay/chapter0_state.test.ts
tests/dialogue/chapter0_content.test.ts
tools/content-validation/validate-chapter-data.ts
```

The `content/` version should be the authored source of truth. A validation or
copy step should produce the runtime JSON under `assets/resources/` so the two
copies do not drift.

## Risks and Missing Dependencies

- **No runnable engine project:** implementation and validation cannot begin
  until Cocos Creator is initialized and its version is known.
- **No dependency or test configuration:** TypeScript checks and tests cannot
  currently run.
- **No Cocos metadata:** existing portraits have no stable imported UUIDs.
- **Asset weight:** 15.45 MB of portraits alone is high for a lightweight mini
  game and should be measured against the final package and memory budgets.
- **No runtime content contract:** writing Chapter 0 JSON before defining and
  validating its schema could create rework.
- **No UI baseline:** mobile layout, safe areas, text scaling, input method,
  and touch behavior remain untested.
- **No platform services:** WeChat storage, networking, permissions, and offline
  behavior are not implemented.
- **No AI fallback implementation:** the design requires deterministic offline
  behavior, but only documentation exists.
- **Potential source duplication:** authored content outside `assets/` will
  need a controlled validation/copy process before Cocos can load it.
- **Naming inconsistency:** current paths use both `chapter0` and
  `chapter-0-prologue`; establish a code ID such as `chapter0_prologue` while
  retaining readable folder names.
- **Documentation mismatch:** `docs/PROJECT_STRUCTURE.md` refers to a root
  `README.md`, but no `README.md` is present in the current commit.

## Recommended Next Step

Create an execution plan in `docs/codex/PLANS.md` for a Chapter 0 vertical
slice, beginning with Cocos Creator initialization and version confirmation.
Then implement a minimal `Chapter0.scene` that loads validated local
JSON, displays the existing portraits through reusable UI prefabs, and runs
entirely with scripted companion responses.
