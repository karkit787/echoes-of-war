# Technical Direction

## Current implementation assumption

Unless the repository says otherwise, assume the first implementation target is:

- **Cocos Creator** for a 2D narrative game.
- **TypeScript** for game logic.
- **WeChat Mini Game / Mini App deployment** as the current project requirement.

The platform requirement may change, so avoid architecture that locks all content and logic tightly to one engine.

## MVP strategy

Build a vertical slice first:

1. Chapter selection or direct start.
2. Chapter 0 playable prologue.
3. Chapter 1 playable history learning scene.
4. Dialogue UI with companion trait messages.
5. One guided choice, one evidence-based choice, one open-ended decision.
6. Timeline stability and memory state.
7. AI service abstraction with mock/fallback mode.
8. Basic save/load.

## Recommended folder structure

Adapt to the actual engine/repo conventions, but keep this separation:

```text
assets/
  scenes/
  sprites/
  ui/

src/
  core/
    GameState.ts
    SaveService.ts
    EventBus.ts
  narrative/
    ChapterTypes.ts
    SceneRunner.ts
    DialogueRunner.ts
    DecisionEvaluator.ts
    HintService.ts
  companion/
    CompanionTypes.ts
    CompanionService.ts
    PromptBuilder.ts
    MockCompanionService.ts
  history/
    HistoricalAnchor.ts
    TimelineStability.ts
  data/
    chapters/
      chapter0_prologue.ts
      chapter1_after_wwi.ts
  platform/
    WeChatStorage.ts
    NetworkClient.ts
  ui/
    DialoguePanel.ts
    ChoicePanel.ts
    CompanionPanel.ts
    TimelineMeter.ts

tests/
  narrative/
  companion/
  data/

docs/codex/
```

## Core data types

```ts
export type CompanionTrait = 'logic' | 'empathy' | 'scepticism' | 'memory' | 'conscience';

export type DecisionType = 'guided_choice' | 'evidence_choice' | 'open_ended';

export interface Chapter {
  id: string;
  title: string;
  summary: string;
  learningObjectives: string[];
  scenes: Scene[];
}

export interface Scene {
  id: string;
  title: string;
  location: string;
  historicalContext: string;
  learningObjective: string;
  beats: SceneBeat[];
  decisions?: DecisionPrompt[];
  reflection?: string;
}

export interface DecisionPrompt {
  id: string;
  type: DecisionType;
  prompt: string;
  historicalAnchors: string[];
  expectedConcepts: string[];
  misconceptions: string[];
  hintLadder: Hint[];
  fallbackResponses: FallbackResponses;
}

export interface Hint {
  level: 1 | 2 | 3 | 4 | 5;
  trait: CompanionTrait;
  text: string;
}

export interface GameState {
  chapterId: string;
  sceneId: string;
  timelineStability: number;
  memories: string[];
  flags: Record<string, boolean | number | string>;
}
```

## AI integration pattern

Keep AI behind an interface:

```ts
export interface CompanionService {
  evaluateDecision(input: DecisionEvaluationInput): Promise<DecisionEvaluation>;
  generateHint(input: HintRequest): Promise<CompanionResponse>;
  reflectOnScene(input: ReflectionInput): Promise<CompanionResponse>;
}
```

Have at least two implementations:

- `MockCompanionService` for deterministic tests and offline demos.
- `RemoteCompanionService` for actual model/API calls when available.

Never make UI components call the AI API directly.

## Prompt and output safety

AI prompts must include:

- Scene context.
- Learning objective.
- Historical anchors.
- Player input.
- Allowed companion traits.
- Rubric.
- Required JSON schema.
- Instruction not to invent unsupported history.
- Instruction to guide rather than simply give the answer.

AI outputs should be parsed and validated before rendering.

## WeChat Mini App constraints to keep in mind

Treat WeChat as a constrained deployment target:

- Keep assets small and reusable.
- Avoid heavy runtime libraries unless necessary.
- Assume network access may be limited, slow, or restricted.
- Cache only safe non-sensitive state.
- Store progress locally in a compact serializable form.
- Keep UI interactions short and mobile-friendly.
- Plan for fallback if live AI cannot be reached.

## Testing priorities

Write tests for:

- Decision scoring rules.
- Hint ladder escalation.
- Prompt building.
- Parsing AI JSON output.
- Timeline stability changes.
- Save/load serialization.
- Chapter data validation.

## Avoid

- Hardcoding story content inside UI components.
- Creating a huge branching story before one vertical slice works.
- Depending entirely on live AI for core gameplay.
- Using open-ended generation without output constraints.
- Adding large assets or complex 3D unless the project direction changes.

## Additional data types for syllabus alignment and trait checks

Add curriculum metadata to chapters and scenes so the game can demonstrate educational alignment.

```ts
export interface CurriculumAlignment {
  syllabusSource: string;
  unit: string;
  topic: string;
  historicalConcepts: string[];
  learningOutcomes: string[];
  assessmentEvidence: string[];
}

export interface TraitCheck {
  id: string;
  trait: CompanionTrait;
  difficulty: number;
  context: string;
  onPassInsight: string;
  onFailFallback?: string;
  isCriticalPath: boolean;
}
```

Recommended implementation:

- Keep trait checks deterministic in the MVP.
- Use AI only to phrase feedback, not to decide hidden game-critical rules.
- Store curriculum alignment in chapter data files.
- Add validation that each chapter has at least one learning outcome, one historical concept, and one assessment-evidence item.
