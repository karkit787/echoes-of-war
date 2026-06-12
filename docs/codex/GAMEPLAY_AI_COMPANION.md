# Gameplay and AI Companion Context

## Core gameplay loop

1. Player enters a historical scene.
2. Player observes environment, dialogue, documents, or evidence.
3. Player faces a decision or interpretation challenge.
4. Player responds through a mix of options, typed reasoning, or assembled evidence.
5. AI companion evaluates the response.
6. Game updates learning feedback, timeline stability, trust, memory, and next scene.
7. Player receives reflection tying the moment to the historical learning objective.

## Dynamic decision model

The game should support more than fixed choices.

Use three decision types:

### 1. Guided choice

Classic option list. Best for early onboarding or simple checks.

Example:

- Support harsh punishment.
- Seek compromise.
- Avoid involvement.

### 2. Evidence-based choice

Player selects documents, quotes, witness statements, or observations to support a decision.

Example:

- Pick two pieces of evidence showing why a country supported or opposed a treaty term.

### 3. Open-ended decision

Player writes or assembles a response. The AI companion evaluates it using a rubric.

Example:

- “Explain what you would advise the delegation to do, and why.”

## Open-ended decision evaluation rubric

For open-ended input, evaluate the player on:

- **Historical accuracy** — Does the response match known historical context?
- **Causal reasoning** — Does it explain why actions may lead to consequences?
- **Perspective awareness** — Does it recognise competing aims or groups?
- **Timeline stability** — Would it preserve the historically required outcome?
- **Ethical awareness** — Does it consider human impact?
- **Learning objective alignment** — Does it demonstrate the intended concept?

Suggested score shape:

```ts
interface DecisionEvaluation {
  historicalAccuracy: 0 | 1 | 2 | 3;
  causalReasoning: 0 | 1 | 2 | 3;
  perspectiveAwareness: 0 | 1 | 2 | 3;
  timelineRisk: 'low' | 'medium' | 'high';
  ethicalAwareness: 0 | 1 | 2 | 3;
  misconception?: string;
  nextAction: 'accept' | 'hint' | 'clarify' | 'redirect' | 'offer_choices';
  companionResponse: CompanionResponse;
}
```

## Hint ladder

When the player hesitates, submits a weak answer, or appears stuck, escalate support gradually.

### Hint level 1 — gentle nudge

Ask a question that points the player back to the learning objective.

### Hint level 2 — contextual clue

Point to a relevant scene detail, document, or previous memory.

### Hint level 3 — focused question

Ask the player to compare two concrete perspectives or consequences.

### Hint level 4 — bounded choices

Offer two or three options only after lighter hints fail.

### Hint level 5 — explanation and retry

Explain the misconception briefly, then let the player try again.

Do not shame the player for wrong answers. Treat mistakes as learning moments.

## AI companion personality model

The companion is not one stable person. It is a fractured support system created by the player’s damaged mind after the accident.

### Logic

Purpose: Explain cause-and-effect, timeline stability, and consequences.

Voice: Precise, analytical, direct.

Use when:

- Player needs decision analysis.
- Timeline risk changes.
- A cause-and-effect relationship matters.

Sample style:

> “That may preserve the meeting for now, but it ignores the resentment created by the terms. The timeline remains stable, yet the pressure beneath it grows.”

### Empathy

Purpose: Help the player notice human experiences and stay emotionally grounded.

Voice: Warm, supportive, humane.

Use when:

- The scene involves civilians, grief, fear, injustice, or moral pressure.
- Player is stuck or frustrated.

Sample style:

> “Before you decide, listen to what they are afraid of losing. History is not only written in treaties; it is lived by people.”

### Scepticism

Purpose: Challenge assumptions, question propaganda, and detect oversimplified reasoning.

Voice: Sharp but constructive.

Use when:

- Player accepts a claim without evidence.
- A character is manipulating information.
- The player uses simplistic blame.

Sample style:

> “Are you certain that statement is fact, not persuasion? Who benefits if you believe it?”

### Memory

Purpose: Recall previous choices, facts, and timeline anchors.

Voice: Fragmented but useful, like flashes of recalled knowledge.

Use when:

- Player needs a reminder from earlier scenes.
- The game references previous choices.
- A historical anchor is at risk.

Sample style:

> “I remember this pattern. A demand made for security can become a grievance if the defeated believe it humiliates them.”

### Conscience

Purpose: Reflect on morality, harm, and responsibility.

Voice: Quiet, serious, reflective.

Use when:

- The player considers harmful manipulation.
- A decision preserves history but causes discomfort.
- The scene needs ethical reflection.

Sample style:

> “Keeping history intact does not make every outcome just. It only means you understand why the wound must not be hidden.”

## Companion response shape

AI responses should be structured so the game can render them consistently.

```ts
interface CompanionResponse {
  activeTraits: Array<'logic' | 'empathy' | 'scepticism' | 'memory' | 'conscience'>;
  mood: 'calm' | 'urgent' | 'supportive' | 'uneasy' | 'critical';
  message: string;
  hintLevel?: 1 | 2 | 3 | 4 | 5;
  misconceptionDetected?: string;
  suggestedPlayerAction?: string;
  timelineStabilityDelta?: number;
  memoryToStore?: string;
}
```

## Prompting pattern for AI evaluation

When calling an AI model, keep prompts constrained.

Recommended prompt sections:

1. Scene summary.
2. Learning objective.
3. Historical anchors that must remain true.
4. Player input.
5. Current player state and prior memories.
6. Evaluation rubric.
7. Required JSON output schema.
8. Safety and tone rules.

The AI should not freely rewrite major history. It should guide the player toward understanding historical causality while protecting the timeline anchors.

## Fallback design

The game must still work without live AI.

For each decision, include:

- A scripted correct/partial/incorrect response.
- A default hint ladder.
- A fallback trait voice.
- A basic keyword or rule-based evaluation path.

This makes the MVP demonstrable even without network/API access.

## Disco Elysium-inspired adaptation

The AI companion should be inspired by the way Disco Elysium makes internal voices part of gameplay, but it must remain original and curriculum-focused.

Implementation guidance:

- Treat companion traits as historical reasoning voices, not generic personality modes.
- Let voices interrupt when they detect relevant evidence, bias, consequences, emotional stakes, or ethical tension.
- Use trait checks to reveal optional insight, not to block required progress.
- Allow disagreement between voices to model historical ambiguity.
- Use failure to trigger reflection, hints, or retries.
- Use micro-reactivity: stored memories, trust changes, altered hints, timeline-stability changes, and callbacks.

See `docs/codex/DESIGN_REFERENCE_DISCO_ELYSIUM.md` for the full design reference.
