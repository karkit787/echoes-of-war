# Project Brief — Echoes of War

## One-line concept

**Echoes of War** is a story-driven educational history game where a trainee historian trapped in the past must protect the timeline while learning how the causes of World War II developed.

## Audience and educational setting

- University final year project.
- Educational subject: History.
- Intended learning context: Singapore secondary school level.
- Learning theme: World War II and the key events leading up to it.
- Format: game-based learning with an AI learning companion.

## Current platform direction

The project requirement currently points toward a **WeChat Mini App game**, though this may change. The design should remain lightweight, modular, and portable enough that a later move to another engine/platform is possible.

Default assumption for implementation tasks: **Cocos Creator + TypeScript**, because it is a practical fit for 2D/lightweight mini-game development and WeChat Mini Game export. If the repo uses another stack, follow the repo.

## Refined synopsis

After World War II, a secret group of scientists began experimenting with time travel technology. Their goal was to study the causes of global conflict and prevent future wars. However, during one experiment, something goes wrong.

You are a young trainee historian working with the research team. You are accidentally sent back in time to the years before World War II. The time machine is damaged, and you cannot return immediately. Your mind is also affected by the accident. To survive in the past and repair the timeline, you rely on fragmented parts of your consciousness.

Soon, you discover that the timeline has become unstable. Certain historical events are starting to change. If the changes become too large, your original timeline may disappear completely.

To return home, you must travel through key events leading up to World War II and ensure that history unfolds as it originally did. Along the way, you meet important figures, ordinary civilians, soldiers, and political leaders. You must investigate situations, make careful choices, and understand why historical decisions led to conflict.

## Core design pillars

### 1. History through participation

The player learns by investigating, interpreting evidence, and making decisions inside historically grounded scenes.

### 2. Dynamic guided decisions

The player should not only pick fixed deterministic options. Some decisions should be open-ended, allowing the player to type or assemble a response. The AI companion evaluates reasoning and guides the player when needed.

### 3. Companion as fragmented mind

The companion represents fragments of the player’s affected consciousness after the time-travel accident. Its traits are Logic, Empathy, Scepticism, Memory, and Conscience.

### 4. Timeline stability as game feedback

Choices can affect timeline stability, trust, evidence quality, and moral consequences. The goal is not to rewrite history, but to understand and preserve historically accurate outcomes.

### 5. Small, feasible MVP

Prioritise a polished vertical slice over a large unfinished game. Chapter 0 and Chapter 1 are the first content targets.

## First playable scope

### Chapter 0: Prologue

- Player wakes in an abandoned building that corresponds to the future lab location.
- Headaches trigger flashbacks of the time-travel experiment.
- Introduces damaged memory, timeline instability, and the companion fragments.
- Ends with the player realizing they are trapped in the past.

### Chapter 1: After World War I

- Focus: Paris Peace Conference.
- Learning content: aims, terms, and immediate impact on Europe in the 1920s.
- Player investigates negotiation tensions and treaty consequences.
- The companion helps the player reason about competing national aims and consequences.

## What Codex should optimise for

When implementing or drafting:

- Keep the project suitable for final year project delivery.
- Avoid overbuilding multiplayer, complex 3D, or massive branching narrative systems unless explicitly requested.
- Build reusable systems that support one chapter well, then extend.
- Prefer clarity, maintainability, and demonstrability over technical novelty.

## Updated design inspiration and curriculum anchor

The game should be designed as a **dialogue-heavy, investigation-first RPG** inspired by Disco Elysium's use of inner voices, skill checks, and reactive dialogue. This is inspiration only; the project must not copy Disco Elysium's setting, characters, prose, UI text, skill names, or mature tone.

The curriculum anchor is the Singapore MOE Upper Secondary History / Humanities (History) syllabus, implementation from the 2023 Secondary Three cohort. The game should prioritise historical inquiry, source evaluation, causation, perspective-taking, empathy, and substantiated judgement.

Chapter 1 has the strongest direct syllabus fit: **Aims and terms of the Paris Peace Conference and its immediate impact on Europe in the 1920s**.
