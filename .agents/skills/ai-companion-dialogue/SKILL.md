---
name: ai-companion-dialogue
description: Use when implementing or writing AI learning companion prompts, trait dialogue, hint ladders, decision evaluation, memory, or fallback responses for Echoes of War.
---

# AI Companion Dialogue Skill

## Inputs to read first

- `AGENTS.md`
- `docs/codex/GAMEPLAY_AI_COMPANION.md`
- `docs/codex/TECHNICAL_DIRECTION.md`

## Companion traits

Use the five-trait model:

- Logic: cause, consequence, timeline stability.
- Empathy: emotional support and human cost.
- Scepticism: challenge assumptions and propaganda.
- Memory: recall prior choices and key facts.
- Conscience: moral reflection and harm awareness.

## Workflow

1. Identify the player decision or moment of confusion.
2. Determine which trait or traits should respond.
3. Evaluate the player input using the rubric in `GAMEPLAY_AI_COMPANION.md`.
4. Choose the next action: accept, hint, clarify, redirect, or offer choices.
5. Use the hint ladder before giving direct answers.
6. Return structured output where possible.
7. Provide deterministic fallback responses for no-AI mode.

## Dialogue constraints

- Keep active gameplay lines short.
- Ask guiding questions before giving answers.
- Do not shame wrong answers.
- Do not invent unsupported history.
- Keep the companion’s voice consistent with fragmented consciousness.

## Disco Elysium-inspired behaviour

The companion can behave like internal voices interrupting the player's thought process, but must remain original and school-appropriate.

Use voice disagreement to model historical ambiguity:

- Logic checks causation.
- Empathy checks human impact.
- Scepticism checks evidence and bias.
- Memory checks chronology and prior evidence.
- Conscience checks ethical responsibility.

Do not copy Disco Elysium skill names, prose, jokes, or adult tone.
