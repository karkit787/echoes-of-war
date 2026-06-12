# AGENTS.md — Echoes of War FYP

## Project identity

This repository is for **Echoes of War**, a university final year project about a game-based education experience with an AI learning companion.

The current concept is a **role-playing / story-based educational history game** for a **Singapore secondary school History** context, focused on events around **World War II** and the causes leading up to it.

Current intended deployment is a **WeChat Mini App game**, though the platform requirement may change. Treat the current default technical direction as **Cocos Creator + TypeScript for WeChat Mini Game export**, unless the repository clearly indicates another stack.

## Source of truth

Use the repository files and these Codex context files as the project source of truth. The project context was distilled only from the chats in the project folder.

When historical or technical details are not present in the repo/context, do **not** invent them. Use clearly marked assumptions, or add TODOs that say what needs confirmation. Historical writing must be accurate and suitable for a school learning context.

## Product goals

Build toward a small but polished MVP:

- A playable narrative flow, beginning with Chapter 0 and Chapter 1.
- Player decisions that feel dynamic rather than fixed multiple-choice only.
- An AI learning companion that guides, hints, questions, remembers, and reflects without simply giving answers.
- Historically grounded content aligned to the project’s educational goal.
- A design that can run within WeChat Mini App constraints, with graceful fallback if live AI is unavailable.

## Existing narrative premise

After World War II, a secret group of scientists experiments with time travel technology. Their goal is to study the causes of global conflict and prevent future wars. During one experiment, something goes wrong.

The player is a young trainee historian working with the research team. They are accidentally sent back to the years before World War II. The time machine is damaged, so they cannot return immediately. The accident also affects their mind, leaving them reliant on fragmented parts of their consciousness.

The timeline becomes unstable. Certain historical events begin to change. If the changes become too large, the player’s original timeline may disappear. To return home, the player must travel through key events leading up to World War II and ensure that history unfolds as originally recorded. Along the way, the player meets important figures, ordinary civilians, soldiers, and political leaders, investigates situations, and makes careful choices.

## Core chapters already discussed

- **Chapter 0: Prologue** — The player wakes up in an abandoned building, which would have been the lab in the future. Headaches trigger flashbacks about the time travel experiment and accident.
- **Chapter 1: After World War I** — Focuses on the Paris Peace Conference, including the aims and terms of the conference and its immediate impact on Europe in the 1920s.

See `docs/codex/PROJECT_BRIEF.md` and `docs/codex/HISTORY_CONTENT_CONTEXT.md` before writing story or chapter content.

## AI learning companion design

The AI companion should feel like fragmented consciousness, not a generic chatbot. Model its responses through five internal voices / functions:

1. **Logic** — cause and effect, timeline stability, decision analysis.
2. **Empathy** — emotional support, human cost, encouragement.
3. **Scepticism** — challenges assumptions, detects weak reasoning and propaganda.
4. **Memory** — recalls past player choices and relevant known facts.
5. **Conscience** — moral reflection and warnings about harm.

The companion should support open-ended player decisions. Do not make every decision a deterministic option list. Use a hint ladder for hesitation or incorrect reasoning: gentle nudge, contextual clue, focused question, then bounded choices only when needed.

See `docs/codex/GAMEPLAY_AI_COMPANION.md` before implementing decision or AI systems.

## Technical architecture preferences

Prefer a data-driven architecture:

- Separate narrative content from engine code.
- Represent chapters, scenes, dialogue, choices, hints, historical anchors, companion trait reactions, and learning checks as structured data.
- Keep AI calls behind a service interface so the game can run with mocked or scripted responses during development and when network/API access is unavailable.
- Avoid hardcoding curriculum content in UI components.
- Keep scope realistic for a mini app: small scenes, lightweight assets, simple UI, incremental saves, and short interactions.

See `docs/codex/TECHNICAL_DIRECTION.md` before implementing architecture or platform work.

## Coding conventions

When creating or editing code:

- Prefer TypeScript for game logic if using Cocos Creator.
- Keep game state serializable.
- Name files and systems clearly: `Chapter`, `Scene`, `DecisionPrompt`, `CompanionTrait`, `HintLevel`, `TimelineStability`, `HistoricalAnchor`.
- Write small, testable pure functions for scoring decisions, selecting hints, validating content, and formatting prompts.
- Use deterministic mocks for AI-dependent code in tests.
- Avoid adding new production dependencies unless they are necessary for the MVP.

## Safety, tone, and education rules

- Do not glorify war, fascism, violence, or extremist ideology.
- Show the human consequences of conflict respectfully.
- Keep language appropriate for secondary school learners.
- Historical figures and events should be handled accurately and neutrally.
- Use ordinary civilians and moral dilemmas to support empathy, but do not sensationalize suffering.
- The goal is learning through inquiry, not alternate-history fantasy for its own sake.

## Definition of done

A change is not done until:

- The relevant flow runs locally, or the limitation is clearly documented.
- TypeScript/build/lint checks pass when available.
- New story content has clear learning objectives and at least one historically grounded decision point.
- AI-companion prompts include guardrails, output shape, and fallback behavior.
- WeChat Mini App constraints are considered for UI, storage, networking, and asset size.
- Any assumptions are documented in the relevant file or TODO.

## Execution plans

For complex features, refactors, or new chapters, create or update an execution plan using `docs/codex/PLANS.md`. Keep the plan current as implementation progresses.

## Design reference: Disco Elysium-inspired, not cloned

Use **Disco Elysium** as a design reference for structure and feel, not as content to copy. Do not copy its characters, setting, prose style, jokes, skill names, political factions, UI text, or copyrighted expression.

The useful transferable design ideas are:

- Dialogue and investigation are the main gameplay, not combat.
- The player character's inner mind can be represented as distinct voices that interrupt, argue, warn, and advise.
- Skill checks can reveal extra interpretations, risks, and options rather than simply decide success/failure.
- Failure should often create a recoverable learning moment instead of an immediate dead end.
- Small decisions should produce visible micro-reactivity: remembered lines, altered trust, changed hints, timeline-stability shifts, or later callbacks.
- The tone can be literary, reflective, strange, and occasionally darkly funny, but it must remain suitable for a Singapore secondary-school educational context.

For Echoes of War, adapt this into **historical reasoning voices**: Logic, Empathy, Scepticism, Memory, and Conscience. These are not exact equivalents of Disco Elysium skills. They should serve curriculum goals: inquiry, evidence, causation, perspective-taking, empathy, and responsible judgement.

See `docs/codex/DESIGN_REFERENCE_DISCO_ELYSIUM.md` before designing companion voice systems, skill checks, or dialogue-heavy gameplay.

## Curriculum source of truth

The project should align with the **Singapore MOE Upper Secondary History / Humanities (History) Teaching and Learning Syllabuses, implementation from the 2023 Secondary Three cohort**. The current user-provided syllabus URL is:

`https://www.moe.gov.sg/api/media/bbe4459c-1da5-4720-b7bd-415310b08588/2023-History-Upper-Secondary-Syllabus.pdf`

Use the syllabus as the curriculum anchor for learning objectives, historical concepts, content scope, assessment style, and source-based inquiry. Do not treat the game as a general WWII trivia game.

Most relevant current content scope:

- Unit 1: **Challenges to European Dominance after World War I, 1910s–1942**.
- After World War I: overview of WWI as context and the **aims and terms of the Paris Peace Conference and its immediate impact on Europe in the 1920s**.
- Rise of Authoritarian Regimes: Nazi Germany, and for O-Level also Militarist Japan, 1920s–1930s.
- War in Europe and Asia: key developments leading to the outbreak of World War II in Europe and the Asia-Pacific.
- Detailed study of WWII military campaigns is not required by the syllabus and should not dominate the MVP.

See `docs/codex/MOE_SYLLABUS_ALIGNMENT.md` before writing history content or learning checks.
