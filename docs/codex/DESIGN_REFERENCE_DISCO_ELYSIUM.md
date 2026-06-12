# Design Reference — Disco Elysium-Inspired Narrative RPG

## Purpose

This file explains how Echoes of War can take inspiration from Disco Elysium while remaining original, educational, and feasible for a final year project.

Use this file when designing:

- AI companion voice behaviour.
- Dialogue-heavy gameplay.
- Open-ended decision prompts.
- Skill-check or trait-check systems.
- Failure states and hint ladders.
- Narrative tone.

## Non-copying rule

Disco Elysium is a design reference, not a template to clone.

Do not copy:

- Characters, setting, factions, worldbuilding, plot structure, scenes, jokes, prose, UI text, skill names, or exact mechanics.
- The same adult themes, extreme language, substance-abuse framing, or mature political satire.
- The exact four-attribute / twenty-four-skill structure.

Echoes of War should feel like its own project: a Singapore secondary-school history learning game about a trainee historian, fractured consciousness, time travel, and the causes of World War II.

## Transferable design lessons

### 1. Inner voices as gameplay

Instead of a normal chatbot companion, the player's damaged mind can speak through separate historical reasoning voices.

Echoes of War voices:

| Voice | Function in learning | Typical gameplay use |
|---|---|---|
| Logic | Cause and effect, timeline consequences | Explains why one action may destabilise events |
| Empathy | Human cost, emotional grounding | Helps the player consider civilians and lived experience |
| Scepticism | Evidence, bias, propaganda, weak claims | Challenges unsupported assumptions |
| Memory | Recall, prior choices, historical anchors | Reminds the player what has been seen or learned |
| Conscience | Ethics and responsibility | Warns when a historically accurate action still has moral cost |

The voices should sometimes disagree. This is useful because History often requires weighing evidence, perspectives, causes, and consequences rather than finding one simple answer.

### 2. Checks should reveal interpretation, not only pass/fail

A trait check can be used to decide whether a companion voice notices something.

Examples:

- High Scepticism: detects that a newspaper headline may be propaganda.
- High Empathy: notices fear or resentment in a civilian's testimony.
- High Logic: links a treaty term to a possible long-term consequence.
- High Memory: recalls a previous document or timeline anchor.
- High Conscience: raises discomfort about preserving history while witnessing suffering.

A failed check should not usually block the main story. Instead, it can:

- Hide optional insight.
- Trigger a misconception.
- Increase hint level.
- Lower evidence confidence.
- Create a later callback.

### 3. Micro-reactivity

Avoid promising massive branching history. Instead, create small visible reactions:

- NPC trust changes.
- Companion mood changes.
- A later line references the player's earlier mistake or insight.
- Timeline stability rises or falls.
- A stored memory is created.
- A hint becomes more specific.
- A document annotation changes from uncertain to verified.

This makes open-ended decisions feel dynamic while keeping implementation feasible.

### 4. Failure as learning

Failure should be educational, not punitive.

Possible failure patterns:

- The player accepts a biased source too quickly; Scepticism interrupts and asks who benefits.
- The player gives a one-cause explanation for WWII; Logic asks them to separate immediate and long-term causes.
- The player ignores civilian impact; Empathy points out what is missing.
- The player tries to "fix" history unrealistically; Memory warns that major timeline anchors must remain intact.

Use retry, reflection, or partial credit rather than a hard game over unless the player repeatedly ignores core objectives.

### 5. Voice-first UI

A good scene can be mostly text, portrait/scene art, investigation hotspots, and companion interjections.

For the MVP, prioritise:

- Strong dialogue panel.
- Inspectable evidence cards.
- Companion voice cards or tabs.
- Timeline-stability feedback.
- Short typed responses or evidence assembly.

Do not prioritise combat, complex movement, inventory bloat, or large 3D environments.

## Suggested Echoes of War trait check model

```ts
export type CompanionTrait = 'logic' | 'empathy' | 'scepticism' | 'memory' | 'conscience';

export interface TraitCheck {
  id: string;
  trait: CompanionTrait;
  difficulty: 4 | 6 | 8 | 10 | 12;
  context: string;
  onPassInsight: string;
  onFailFallback?: string;
  isCriticalPath: boolean;
}
```

Recommendation:

- Critical-path checks should always have fallback guidance.
- Optional checks can add flavour, extra evidence, or deeper reflection.
- Trait levels can be increased through learning progress, not combat XP.

## Possible learning-progress upgrades

Instead of combat skills, the player can improve historical reasoning skills:

- Evidence Handling — better source evaluation.
- Causation — better long-term and short-term cause analysis.
- Perspective Taking — better understanding of different historical actors.
- Context Awareness — better interpretation of decisions in their time.
- Ethical Reflection — better recognition of human consequences.

These can map back to the five voices without copying Disco Elysium's skill list.

## Tone target

The tone should be:

- Reflective.
- Investigative.
- Slightly surreal due to time travel and fractured memory.
- Emotionally serious when dealing with war and suffering.
- Occasionally witty in companion banter, but never flippant about tragedy.
- Appropriate for Singapore secondary-school learners.

## Example interaction pattern

Player input:

> "The treaty should punish Germany as much as possible so they cannot fight again."

Possible companion reaction:

- Logic: "Punishment may reduce immediate military capacity, but resentment can become a long-term pressure. What consequence are you trying to prevent?"
- Scepticism: "You are assuming punishment and security are the same thing. Are they?"
- Empathy: "A country is not only its leaders. Civilians will live under these terms too."

Game action:

- Mark response as partially accurate.
- Ask the player to add one consequence and one perspective.
- Do not simply say "wrong".

## Implementation guardrails

- Keep voice responses short during active scenes.
- Store only concise memories, not full chat histories.
- Use deterministic fallback responses for demos.
- Validate AI output against schema before rendering.
- Never allow AI to generate extremist propaganda as persuasive content without educational framing and critique.
