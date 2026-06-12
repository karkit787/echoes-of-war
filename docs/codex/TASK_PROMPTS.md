# Useful Codex Task Prompts

Use these as starting prompts when asking Codex to work on the project.

## Generate a vertical slice plan

```text
Using AGENTS.md and docs/codex, create an ExecPlan for a playable vertical slice covering Chapter 0 prologue and one Chapter 1 Paris Peace Conference scene. Include files, systems, content data, tests, and fallback AI behavior.
```

## Implement narrative data types

```text
Create TypeScript data types for chapters, scenes, dialogue beats, decisions, historical anchors, companion traits, hint ladders, and timeline stability. Keep the types engine-agnostic and serializable. Add validation helpers and tests.
```

## Build mock AI companion

```text
Implement a MockCompanionService that evaluates guided, evidence-based, and open-ended decisions using deterministic rules. It should return CompanionResponse objects using Logic, Empathy, Scepticism, Memory, and Conscience traits. Include tests for hint escalation and misconception handling.
```

## Write Chapter 0 content data

```text
Using docs/codex/HISTORY_CONTENT_CONTEXT.md and docs/codex/CONTENT_AUTHORING_GUIDE.md, draft Chapter 0 as structured content data. Include scenes, inspectable clues, flashbacks, companion reactions, decisions, state changes, and fallback hints. Keep it suitable for a school audience.
```

## Write Chapter 1 content data

```text
Using docs/codex/HISTORY_CONTENT_CONTEXT.md and docs/codex/CONTENT_AUTHORING_GUIDE.md, draft a Chapter 1 scene about the Paris Peace Conference. Focus on aims, terms, and immediate impact on Europe in the 1920s. Mark any historical facts that need verification against syllabus/source materials.
```

## Create open-ended decision evaluator

```text
Implement a decision evaluator for open-ended player responses. Use a rubric for historical accuracy, causal reasoning, perspective awareness, timeline risk, ethical awareness, and learning objective alignment. Include keyword/rule fallback and tests.
```

## Review for WeChat feasibility

```text
Review the current implementation for WeChat Mini App feasibility. Identify asset, storage, networking, performance, and package-size risks. Suggest minimal changes that keep the MVP feasible.
```

## Code review prompt

```text
Review the uncommitted changes against AGENTS.md. Focus on MVP scope, data-driven design, AI fallback behavior, historical-content guardrails, TypeScript quality, and WeChat Mini App constraints.
```

## Review chapter against MOE syllabus

```text
Using AGENTS.md, docs/codex/MOE_SYLLABUS_ALIGNMENT.md, and docs/codex/CONTENT_AUTHORING_GUIDE.md, review this chapter for syllabus alignment. Identify the matched unit/topic, historical concepts, learning outcomes, assessment evidence, and changes needed to make it more inquiry-based.
```

## Design Disco Elysium-inspired companion checks

```text
Using docs/codex/DESIGN_REFERENCE_DISCO_ELYSIUM.md and docs/codex/GAMEPLAY_AI_COMPANION.md, design an original trait-check system for Echoes of War. It should use Logic, Empathy, Scepticism, Memory, and Conscience, support optional insights, recoverable failure, and deterministic fallback responses.
```

## Add curriculum metadata to chapter data

```text
Update the chapter data types and Chapter 1 content to include CurriculumAlignment metadata based on docs/codex/MOE_SYLLABUS_ALIGNMENT.md. Add validation tests requiring unit, topic, historical concepts, learning outcomes, and assessment evidence.
```
