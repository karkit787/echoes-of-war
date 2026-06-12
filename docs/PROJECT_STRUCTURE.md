# Project Structure

Echoes of War separates engine assets, authored learning content, research, and
project guidance so the narrative RPG prototype can grow without coupling
curriculum material to Cocos Creator code.

## Repository guidance

- `AGENTS.md` contains repository-level instructions for Codex and contributors.
- `.agents/skills/` contains reusable Codex workflows for history writing,
  companion dialogue, syllabus review, and the WeChat/Cocos MVP.
- `README.md` provides the project overview and entry points.

## Documentation

- `docs/codex/` is the maintained context pack for product, narrative,
  curriculum, AI-companion, and technical decisions.
- `docs/design/` holds gameplay, narrative, UI/UX, and AI-companion design notes.
- `docs/research/` holds working notes on historical sources, educational
  practice, and technical feasibility.
- `docs/references/moe-history-syllabus/` stores source notes and any locally
  retained MOE syllabus PDF. Reference PDFs must not be shipped with the game or
  copied verbatim into game content.

## Cocos Creator project content

- `assets/scenes/` contains Cocos Creator scenes.
- `assets/scripts/` contains TypeScript grouped by system responsibility.
- `assets/prefabs/` contains reusable Cocos nodes and UI prefabs.
- `assets/resources/` contains runtime-loadable structured data and lightweight
  game resources.
- `assets/textures/`, `assets/audio/`, and `assets/fonts/` contain presentation
  assets intended for the shipped build.

## Authored learning content

- `content/chapters/` contains chapter-specific narrative source material.
- `content/dialogue/` separates companion personalities, NPC dialogue, and
  player decision content.
- `content/historical-events/` records event-level historical anchors.
- `content/source-exercises/` contains source-based inquiry activities.
- `content/assessments/` contains learning checks and assessment drafts.

Authored content should remain data-driven and historically grounded. Disco
Elysium is a high-level structural reference only; do not copy its text,
characters, names, UI, setting, or exact mechanics.

## Quality and tooling

- `tests/` groups checks for dialogue, historical content, and gameplay logic.
- `tools/content-validation/` contains validation utilities for authored data.
- `tools/build-scripts/` contains project and platform build helpers.

Empty scaffold folders contain `.gitkeep` files so Git retains the intended
layout until real assets or implementation files are added.
