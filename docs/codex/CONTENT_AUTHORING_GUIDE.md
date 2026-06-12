# Content Authoring Guide

## Purpose

Use this guide when creating new chapters, scenes, dialogue, companion responses, or learning activities for Echoes of War.

## Chapter template

Each chapter should include:

```md
# Chapter N: Title

## Educational focus

What syllabus/history concept does this teach?

## Narrative purpose

What happens in the player’s story?

## Historical anchors

Which facts/events must remain stable?

## Key characters

Who appears and why?

## Scene list

1. Scene title — purpose, interaction, learning objective.
2. Scene title — purpose, interaction, learning objective.

## Required gameplay interactions

- Observation/investigation moment.
- Dialogue or interview moment.
- Decision point.
- Companion reflection.
- Learning check.

## Assessment evidence

What should the player demonstrate by the end?
```

## Scene template

```md
## Scene: Title

Location:
Time context:
Learning objective:
Historical context:
Mood:

### Opening beat

What does the player see or hear?

### Interactions

- Inspectable clue 1.
- Inspectable clue 2.
- Character dialogue.

### Decision point

Prompt:
Expected reasoning:
Common misconception:
Timeline risk:

### Companion reactions

Logic:
Empathy:
Scepticism:
Memory:
Conscience:

### Resolution

What changes in state, memory, timeline stability, or next objective?

### Reflection

One short learning reflection.
```

## Companion dialogue rules

- Each companion line should have a function: guide, question, warn, remember, or reflect.
- Do not make the companion lecture for long paragraphs during gameplay.
- Use short lines during active scenes and longer reflections only at scene endings.
- The companion should not instantly solve open-ended tasks unless the player has exhausted the hint ladder.

## Player choice writing rules

Good decisions should require reasoning, not trivia recall only.

Prefer prompts like:

- “Which evidence supports this claim?”
- “What consequence might follow from this decision?”
- “How would different groups view this term?”
- “What should you verify before acting?”

Avoid prompts like:

- “What year did this happen?” unless used as a quick check.
- “Pick the obviously good answer.”
- “Rewrite history to make everything better.”

## Historical content rules

- Keep scenes historically grounded.
- Use drama to support understanding, not replace accuracy.
- Mark any uncertain details for verification.
- Avoid false inevitability: show that historical events had causes and choices, but do not imply that one simple factor explains everything.

## End-of-scene reflection format

Use this format:

```text
What happened: [one sentence]
Why it mattered: [one sentence]
What to remember: [one sentence]
```

Example:

```text
What happened: You saw how different groups demanded different kinds of peace after the war.
Why it mattered: A settlement designed to create security could also create resentment if people saw it as unfair.
What to remember: Peace terms can have consequences long after leaders leave the conference room.
```

## Curriculum alignment fields

For each chapter or major scene, include a curriculum block:

```md
## Curriculum alignment

Syllabus source:
Unit:
Topic:
Historical concepts:
Learning outcomes:
Source/evidence activity:
Assessment evidence:
```

Use `docs/codex/MOE_SYLLABUS_ALIGNMENT.md` to fill this in.

## Dialogue-heavy RPG writing guidance

The project can be Disco Elysium-inspired in structure: investigation, internal voices, difficult choices, and dialogue-based checks. However, keep the writing original and suitable for school learners.

Prefer:

- Short, sharp companion interjections.
- Conflicting but useful inner-voice perspectives.
- Evidence cards and source interpretation.
- Player reasoning followed by feedback.
- Recoverable failure and retry.

Avoid:

- Copying Disco Elysium's prose style or skill names.
- Adult humour, substance-abuse framing, or excessive profanity.
- Long lectures that interrupt gameplay.
- Combat-driven scenes that do not serve the syllabus.
