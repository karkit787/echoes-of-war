# Codex Execution Plans for Echoes of War

Use this file when a task is complex, multi-step, or changes architecture, narrative systems, AI integration, or chapter content.

## When to create a plan

Create an execution plan before:

- Implementing a new gameplay system.
- Adding a full chapter or major scene.
- Refactoring narrative, AI companion, save/load, or platform code.
- Integrating remote AI services.
- Changing engine/platform assumptions.

## Plan template

```md
# ExecPlan: [Task name]

## Goal

What user-visible outcome will this deliver?

## Current context

What files, systems, and constraints matter?

## Assumptions

List assumptions. Mark anything that needs user or syllabus confirmation.

## Non-goals

What is intentionally out of scope?

## Design

Describe the proposed implementation or content structure.

## Files to create or change

- `path/to/file.ts` — why it changes.
- `path/to/content.ts` — why it changes.

## Historical / educational checks

For content tasks, list the learning objectives and historical anchors.

## AI companion checks

For AI tasks, list prompt inputs, output schema, fallback behavior, and safety constraints.

## Implementation steps

1. Step.
2. Step.
3. Step.

## Validation

Commands, manual checks, playthrough steps, or data validation to run.

## Risks and mitigations

- Risk — mitigation.

## Progress log

Update this section as work proceeds.
```

## Planning rules

- Keep plans specific enough that another developer can continue from them.
- Do not use plans as a reason to avoid implementation.
- Update the progress log after meaningful changes.
- Resolve small ambiguities with documented assumptions.
- For historical content, mark verification needs clearly.
