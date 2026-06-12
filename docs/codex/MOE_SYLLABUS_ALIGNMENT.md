# MOE Syllabus Alignment — Upper Secondary History / Humanities (History)

## Source
Local reference copy, if available:

`docs/references/moe-history-syllabus/2023-History-Upper-Secondary-Syllabus.pdf`

User-provided syllabus file:

`https://www.moe.gov.sg/api/media/bbe4459c-1da5-4720-b7bd-415310b08588/2023-History-Upper-Secondary-Syllabus.pdf`

Document title: **History / Humanities (History) Teaching and Learning Syllabuses, Upper Secondary, Express Course, Normal (Academic) Course**.

Implementation: **starting with the 2023 Secondary Three cohort**.

## Project target audience

Primary target:
Singapore Upper Secondary students studying History / Humanities (History).

Current assumed level:
Secondary 3 or Secondary 4 Express / O-Level History.

Note:
If the project later targets Normal (Academic) students, simplify source difficulty, reduce reading load, and add more guided hints.

## How to use this file

Use this file to keep Echoes of War aligned with Singapore secondary-school History rather than becoming a general WWII game.

Before writing or implementing a chapter, identify:

1. Syllabus topic.
2. Historical concept.
3. Learning outcome.
4. Inquiry / source-based activity.
5. Assessment evidence.

## Broad syllabus aims relevant to the project

The game should help students:

- Engage actively in historical inquiry.
- Think critically and reflectively.
- Understand that history is constructed from evidence and interpreted in different ways.
- Ask relevant questions about the past.
- Examine sources critically in historical context.
- Reach substantiated judgements.
- Communicate historical understanding clearly.
- Understand connections between past and present.
- Appreciate multiple perspectives and the experiences of people in the past.

## Historical concepts to build into gameplay

| Historical concept | Game translation |
|---|---|
| Chronology | Timeline repair, sequencing events, identifying what changed |
| Evidence | Inspecting documents, checking source origin/nature/purpose/content |
| Accounts | Comparing different reconstructions or viewpoints |
| Causation | Connecting actions, pressures, short-term causes, long-term causes, consequences |
| Change and continuity | Tracking what changed after WWI and what tensions remained |
| Significance | Explaining why an event, person, idea, or decision mattered |
| Historical empathy | Understanding people in the past within their context and constraints |
| Diversity | Recognising different groups, perspectives, and experiences |

## Relevant content scope for Echoes of War

### Primary current MVP scope

**Unit 1: Challenges to European Dominance after World War I, 1910s–1942**

Recommended chapter mapping:

| Game chapter | Syllabus topic | Notes |
|---|---|---|
| Chapter 0: Prologue | Not a direct syllabus topic | Use only as framing and onboarding. Keep short. |
| Chapter 1: After World War I | Aims and terms of the Paris Peace Conference and immediate impact on Europe in the 1920s | Already defined in project chats. This is the strongest first learning chapter. |
| Future Chapter 2 | Rise of Authoritarian Regimes: Nazi Germany | Strong source-based and causation potential. |
| Future Chapter 3 | Militarist Japan, 1920s–1930s | Relevant for O-Level scope and Asia-Pacific pathway. Confirm exact course target before building. |
| Future Chapter 4 | Key developments leading to outbreak of WWII in Europe | Use causation and evidence analysis. |
| Future Chapter 5 | Key developments leading to outbreak of WWII in Asia-Pacific | Useful Singapore/regional connection. |

### Unit 2 extension scope

Only after the MVP is stable, consider:

- Reasons for the end of World War II.
- Origins and development of the Cold War in Europe.
- Case studies such as the Korean War or Vietnam War depending on target syllabus level.
- Decline of the USSR and end of the Cold War.

## Important scope guardrail

The syllabus notes that detailed study of World War II military campaigns is not required. Therefore:

- Do not make the MVP a battle simulator.
- Do not spend most gameplay on weapon systems, tactical combat, or battlefield manoeuvres.
- Focus on inquiry, decision-making, causes, consequences, perspectives, and source interpretation.

## Chapter 1 syllabus alignment

### Topic

After World War I: Aims and terms of the Paris Peace Conference and its immediate impact on Europe in the 1920s.

### Main inquiry question

How did attempts to build peace after World War I create new tensions in Europe during the 1920s?

### Learning objectives

By the end of Chapter 1, the player should be able to:

- Identify different aims at the Paris Peace Conference.
- Explain how treaty terms reflected competing goals such as punishment, security, compensation, and self-determination.
- Link terms to immediate political, economic, and social impacts in Europe during the 1920s.
- Recognise that peace settlements can have intended and unintended consequences.
- Use evidence and perspective-taking to support a historical judgement.

### Historical concepts

- Causation.
- Evidence.
- Accounts.
- Significance.
- Historical empathy.
- Diversity.

### Suggested source/evidence activities

- Compare two fictionalised but historically grounded newspaper extracts from different countries.
- Inspect a simplified treaty summary and identify what each term was meant to achieve.
- Interview civilians, veterans, officials, or students to understand different reactions.
- Detect a false rumour or distorted timeline record using source evaluation.
- Construct a short judgement: "Was the peace settlement more focused on security, punishment, or stability? Explain with evidence."

### Assessment evidence

A successful player response should show:

- Accurate use of at least one treaty aim or term.
- Cause-and-effect reasoning.
- Awareness of at least two perspectives.
- Recognition that consequences can be unintended.
- Avoidance of simplistic blame.

## Suggested curriculum traceability block for chapter files

Every chapter data file should include something like:

```ts
export const chapter1Curriculum = {
  syllabusSource: 'MOE Upper Secondary History / Humanities (History), implementation from 2023 Sec 3 cohort',
  unit: 'Challenges to European Dominance after World War I, 1910s–1942',
  topic: 'After World War I: Paris Peace Conference aims, terms, and immediate impact on Europe in the 1920s',
  historicalConcepts: ['causation', 'evidence', 'accounts', 'significance', 'historical_empathy', 'diversity'],
  learningOutcomes: [
    'Explain competing aims at the Paris Peace Conference',
    'Connect treaty terms to immediate impacts in Europe during the 1920s',
    'Use evidence and perspectives to form a substantiated judgement'
  ],
  assessmentEvidence: [
    'Names a relevant aim or term',
    'Explains a consequence',
    'Considers more than one perspective',
    'Avoids single-cause explanations'
  ]
};
```

## AI companion alignment

The companion voices should map to syllabus skills:

| Companion voice | Syllabus skill/concept |
|---|---|
| Logic | Causation, change and continuity, significance |
| Empathy | Historical empathy, diversity, social-emotional learning |
| Scepticism | Evidence, accounts, bias, fact/opinion, source evaluation |
| Memory | Chronology, recall of earlier evidence, interconnections |
| Conscience | Values, responsible judgement, human consequences |

## Content approval checklist

Before accepting a new history scene, check:

- Does it name a syllabus topic or concept?
- Does it require evidence or reasoning, not just trivia recall?
- Does it include multiple perspectives?
- Does it avoid over-detailing military campaigns?
- Does it avoid glorifying war or authoritarian ideology?
- Does it provide fallback guidance for weaker answers?
- Does it end with a clear reflection on what was learned?
