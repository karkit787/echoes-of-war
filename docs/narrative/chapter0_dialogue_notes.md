# Chapter 0 Dialogue Notes

## Purpose

These files provide the complete authored dialogue graph for the Chapter 0
prologue. They are engine-independent JSON so a future Cocos Creator loader can
deserialize them without requiring live AI or gameplay code.

Chapter 0 teaches four introductory historical-inquiry habits:

- Observe before interpreting.
- Treat memory as an account, not automatic proof.
- Corroborate claims with more than one clue.
- Separate a supported conclusion from an attractive assumption.

Chapter 0 is framing and onboarding rather than a full syllabus lesson. Its
only direct bridge to Chapter 1 is the physical clue that peace negotiations
were taking place in Paris in January 1919.

## Files And Entry Points

| File | Entry point | Purpose |
|---|---|---|
| `ch0_intro.json` | `ch0_intro_wake_001` | Awakening, corridor reveal, and ending |
| `ch0_ai_fragments.json` | `ch0_ai_identity_001` | Five voice introductions and post-flashback chorus |
| `ch0_room_inspections.json` | `ch0_inspection_hub` | Seven free-order object inspections |
| `ch0_flashbacks.json` | `ch0_flash_countdown_001` | Three short accident memories |
| `ch0_choices.json` | `ch0_choice_wake_response` | Guided decisions, feedback, hints, and retries |

The chapter's main entry point is `ch0_intro_wake_001`. Node references may
cross files; IDs are therefore unique across the whole Chapter 0 folder.

## JSON Contract

Each file uses this root shape:

```json
{
  "schemaVersion": 1,
  "fileId": "string",
  "chapter": "chapter0",
  "entryId": "string",
  "nodes": []
}
```

A dialogue node uses:

```json
{
  "id": "globally unique string",
  "speaker": "Narration | Player | Logic | Empathy | Scepticism | Memory | Conscience | System",
  "portrait": "optional portrait asset id",
  "text": "rendered dialogue or prompt",
  "next": "optional target node id",
  "choices": [
    {
      "label": "rendered choice",
      "next": "target node id",
      "conditions": {},
      "effects": {}
    }
  ],
  "conditions": {},
  "effects": {}
}
```

Optional metadata fields are intentionally serializable:

- `background`: background asset ID to request during the beat.
- `decisionId`: stable decision identifier for analytics and saves.
- `objectId`: groups all beats belonging to one inspection.
- `flashbackId`: groups beats into one memory sequence.
- `hints`: deterministic hint ladder entries with `level`, `trait`, and `text`.

## Conditions

Conditions use an `all` array. The initial loader only needs these operators:

```json
{
  "all": [
    {
      "key": "ch0_inspection_count",
      "operator": "gte",
      "value": 3
    }
  ]
}
```

Supported operators for Chapter 0 are `equals`, `not_equals`, and `gte`.
Missing boolean flags should be treated as `false`; missing numeric counters
should be treated as `0`.

## Effects

Effects are grouped by deterministic operation:

```json
{
  "set": {
    "flag_name": true
  },
  "setIfAbsent": {
    "ch0_first_clue": "broken_time_device"
  },
  "increment": {
    "ch0_inspection_count": 1
  },
  "appendUnique": {
    "ch0_evidence": [
      "evidence_device_core_rupture"
    ]
  }
}
```

Apply choice effects before entering the target node. Apply node effects after
the node is displayed and before following `next`. Save checkpoints can later
be attached to the state-changing choice and completion nodes without changing
the authored dialogue.

## Scene Flow

```text
Awakening
  -> opening response
  -> five consciousness introductions
  -> free-order room inspections
  -> treatment of uncertain memory
  -> countdown flashback
  -> containment-failure flashback
  -> final-instruction flashback
  -> evidence conclusion with retry
  -> fractured chorus
  -> trusted-voice choice
  -> corridor evidence comparison
  -> timeline conclusion with retry
  -> Chapter 0 objective
```

The inspection hub unlocks the corridor after the damaged time device and at
least two other objects have been inspected. All seven objects remain authored
for optional thorough investigation.

## Voice Guide

- **Logic:** Short, precise statements about sequence, cause, limits, and
  supported conclusions.
- **Empathy:** Grounds pain and fear without generic praise or sentimentality.
- **Scepticism:** Challenges unsupported claims and asks what evidence is
  missing; it does not insult the player.
- **Memory:** Speaks in incomplete sensory fragments and labels uncertainty.
- **Conscience:** Frames responsibility and possible harm without punishment or
  religious language.

The fragments are functions of one injured consciousness, not independent
external AI characters. Their disagreement models different forms of
historical reasoning.

## Decisions And Fallbacks

The chapter contains five choice moments:

1. Immediate response after waking.
2. Whether to trust, test, or reject a memory.
3. Which accident conclusion the evidence supports.
4. Which consciousness voice to trust first.
5. Which explanation best fits the timeline evidence.

The accident and timeline conclusions include five-level deterministic hint
ladders. Unsupported conclusions return to the same decision with a concise
voice response; they never produce a game over.

## Historical And Narrative Guardrails

- The January 1919 newspaper is a period clue, not absolute proof of the
  player's exact date or location.
- The dialogue does not yet name a specific treaty term, leader, or national
  aim as fact. Those belong in Chapter 1 and should be checked against the MOE
  syllabus and reliable historical sources.
- The time machine, laboratory, research protocol, and timeline instability are
  fictional framing devices.
- Memory-derived claims remain uncertain until they align with physical
  evidence.
- The player is asked to preserve a historical path through understanding, not
  to improve history through unrestricted intervention.

## Future Loader Notes

- Load all five files before resolving node references.
- Index nodes globally by `id`.
- Keep progress state as plain JSON-compatible values.
- Render scripted fragment lines locally; remote AI is not required.
- Use `portrait` and `background` as asset registry IDs rather than filesystem
  reads from UI code.
- Prevent repeated first-inspection effects by honoring the choice conditions.
- Preserve hint level and attempt counters when saving mid-decision.

## Validation

Run:

```powershell
powershell -ExecutionPolicy Bypass -File tools/content-validation/validate-chapter0-dialogue.ps1
```

The validator checks JSON parsing, expected files, unique IDs, allowed
speakers, text and choice labels, entry points, all `next` references, graph
reachability, portrait/background assets, decision count, flashback count, and
at least two distinct consciousness responders for every required inspection.
