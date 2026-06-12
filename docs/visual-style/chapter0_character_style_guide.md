# Chapter 0 Character Portrait Style Guide

## Purpose

This guide defines the visual language for the six Chapter 0 portraits in
Echoes of War:

1. Main Character / Trainee Historian
2. Logic
3. Empathy
4. Scepticism
5. Memory
6. Conscience

The portraits are used in dialogue, internal-voice interruptions, character
introductions, and compact mobile UI. They should feel related without becoming
six copies of the same image.

## Core art direction

Create hand-painted psychological RPG portraits with rough oil-paint and
gouache-like brushwork. Build the face through value contrast, broken shapes,
scraped paint, and expressive facial planes rather than clean outlines. The
result should feel intimate, imperfect, melancholic, and visibly painted.

The visual direction may draw on the mood and abstraction of psychological
portrait systems in dialogue-heavy RPGs, but it must remain an original Echoes
of War identity. Do not reproduce any existing character, composition, icon,
UI element, or distinctive portrait from another game.

## Shared portrait language

- **Format:** Vertical 3:4 portrait.
- **Crop:** Head and upper torso, with breathing room around the hair and
  shoulders.
- **View:** Mostly three-quarter or near-frontal, never a polished studio pose.
- **Background:** Shadowy, abstract, and low-detail, with broken paint fields.
- **Edges:** Some facial edges may dissolve into the background.
- **Linework:** Minimal to absent. Define forms through light, shadow, and brush
  texture.
- **Texture:** Rough canvas grain, dry brush, scraped paint, uneven opacity,
  layered gouache, and occasional unfinished passages.
- **Lighting:** One dominant directional light with deep, imperfect shadows.
- **Palette:** Black, charcoal, grey-blue, dirty ivory, muted violet, faded
  ochre, and restrained skin tones.
- **Mood:** Psychological, fragmented, melancholic, intelligent, and tense.
- **Finish:** Painterly and handmade rather than photorealistic or digitally
  polished.

## Shared character continuity

Generate the main character first and use the selected result as a material and
emotional anchor for all five fragments. The fragments are not alternate
portraits of the protagonist. They are autonomous personifications of mental
functions, so their visual role should be readable before any human identity.

Keep these elements consistent:

- Rough oil-and-gouache medium and comparable paint density.
- Dark, desaturated palette with dirty-ivory highlights.
- At least one readable human feature or gaze point.
- Head-and-shoulders consciousness silhouette in a 3:4 composition.
- Dark, empty background with restrained abstract marks.
- No readable text, symbols, UI frames, or decorative borders.

The fragments should change these elements by trait:

- Number, placement, and completeness of facial features.
- Human anatomy, silhouette, and degree of abstraction.
- Symmetry, negative space, and fragmentation pattern.
- Dominant accent colour.
- Direction and hardness of light.
- Shape language: angular, soft, fractured, layered, or balanced.
- Amount of background dissolution.

Do not preserve the trainee's exact face, hair, coat, shirt, or shoulder strap
in a fragment. Shared identity comes from medium, mood, palette, and recurring
tired human features, not literal resemblance.

## Character visual system

| Asset | Shape language | Light | Accent | Emotional read |
|---|---|---|---|---|
| Trainee Historian | Uneven, grounded, weathered | Cold side light | Faded ochre | Disoriented, intelligent, determined |
| Logic | Angular, measured, segmented | Hard controlled light | Muted blue-grey | Precise, cold, analytical |
| Empathy | Soft, curved, sheltering | Diffused warm-pale light | Muted violet | Compassionate, tired, protective |
| Scepticism | Asymmetric, sharp, interrupted | Obscured eye light | Blue-black | Guarded, distrustful, observant |
| Memory | Layered, repeated, dissolving | Faded intermittent light | Archival grey-blue | Haunted, unstable, recollective |
| Conscience | Balanced, vertical, restrained | Split vertical light | Restrained ochre | Solemn, quiet, authoritative |

## Main Character / Trainee Historian

**Intended use:** Player portrait in dialogue, Chapter 0 introduction, save
profile, and visual reference for all companion fragments.

**Visual concept:** A young androgynous trainee historian who has just survived
a time-travel accident. Dirt, fatigue, and a damaged coat ground the character
in the abandoned research facility. The expression combines disorientation
with active intelligence and a refusal to give up.

**Consistency notes:** This portrait establishes the canonical face structure,
hair mass, clothing values, brushwork, and crop. Prefer a readable silhouette
at small mobile size. Keep research equipment subtle.

## Logic

**Intended use:** Internal-voice portrait for cause-and-effect analysis,
timeline reasoning, and structured hints.

**Visual concept:** A humanlike consciousness assembled from separated angular
planes. One eye remains exact while other features become measured fragments,
dark gaps, and stacked cause-and-effect layers.

**Consistency notes:** Avoid the protagonist's hair and clothing. Logic should
have the cleanest value organisation in the set while preserving rough paint
edges and handmade imperfection.

## Empathy

**Intended use:** Internal-voice portrait for emotional support, historical
empathy, and attention to human consequences.

**Visual concept:** Several incomplete human presences overlap inside broad
sheltering curves. A calm central gaze and a small protected negative-space
figure express listening, perspective-taking, and care.

**Consistency notes:** Avoid angelic light, idealised beauty, tears as a
shortcut, or a cheerful expression. Compassion should come from the gaze and
protective posture.

## Scepticism

**Intended use:** Internal-voice portrait for source evaluation, doubt,
propaganda detection, and challenges to weak reasoning.

**Visual concept:** A guarded observer built from misaligned eyes, obstructing
paint bands, and cross-checking fragments. The lower face is mostly erased,
leaving doubt and scrutiny as the dominant read.

**Consistency notes:** Keep suspicion intelligent rather than villainous.
Fracture the paint surface, not the anatomy.

## Memory

**Intended use:** Internal-voice portrait for chronology, recalled evidence,
flashbacks, and unstable fragments of the player's past.

**Visual concept:** Several incomplete recollection layers compete to form one
presence. Repeated profiles, displaced features, rubbed archival textures, and
missing dark gaps make lost information visible.

**Consistency notes:** One primary face must remain readable at mobile size.
Limit secondary echoes to two or three faint impressions and keep them
subordinate.

## Conscience

**Intended use:** Internal-voice portrait for moral reflection, responsibility,
and warnings about human harm.

**Visual concept:** Two opposing incomplete profiles face inward toward a
narrow vertical light seam and a third balancing eye. Unequal dark masses and
restrained ochre strokes suggest responsibility held between competing duties.

**Consistency notes:** Authority should feel quiet, not punitive. Avoid crowns,
robes, religious symbols, perfect halos, or heroic grandeur.

## Readability for mobile use

- Keep the eyes, nose bridge, and mouth readable when reduced to approximately
  180 by 240 pixels.
- Avoid important detail near the outer 8 percent of the canvas.
- Keep the darkest background value distinct from the shoulder silhouette.
- Do not rely on tiny geometric marks or fine textures to identify a trait.
- Export the final selected portraits consistently as PNG files.
- Test each portrait in greyscale to confirm that its value structure remains
  distinct.

## Generation workflow

1. Generate the main character first.
2. Pick the best main character image as the visual anchor.
3. Use the main character only as a reference for medium, palette, brush scale,
   and emotional world when generating the five AI fragments.
4. Build each fragment from its mental function first. Do not preserve the
   protagonist's face, hair, clothing, or anatomy.
5. Reject outputs that look too realistic, too clean, too anime, too fantasy,
   or too neon.

For each asset, generate a small batch, select by face readability and
brushwork, then make only one controlled prompt adjustment at a time. Save the
chosen source and exact prompt when the generation tool exposes them.

The current Chapter 0 baseline was generated with the built-in image-generation
tool. Exact prompts and refinements are stored in
`content/chapters/chapter-0-prologue/art-prompts/character_portraits.md`;
shared rejection guidance is stored in
`content/chapters/chapter-0-prologue/art-prompts/negative_prompts.md`;
machine-readable asset records are stored in
`content/chapters/chapter-0-prologue/art-prompts/asset_manifest.json`.

The generated files are 1086 by 1448 pixel PNGs, a strict 3:4 ratio. Keep this
ratio for future portraits even if final runtime imports are downscaled.

## Future chapter consistency

- Use the selected Chapter 0 trainee portrait only as a medium, palette, and
  emotional-world reference for future fragments.
- Do not preserve the protagonist's anatomy or costume in consciousness
  portraits. Preserve only the shared rough brushwork, darkness, and occasional
  tired human gaze.
- Keep the six shape languages stable: grounded, angular, sheltering,
  asymmetric, layered, and balanced.
- Make the role legible through silhouette and fragmentation before relying on
  accent colour or expression.
- Reuse the same global negative prompt and add trait-specific exclusions.
- Review portraits together as a set at full size and at approximately 180 by
  240 pixels.
- Record every selected prompt and refinement in the chapter prompt folder and
  update the asset manifest when a portrait is replaced.

## Global rejection checklist

Reject an output if it contains:

- Glossy fantasy character art or cinematic concept-art polish.
- Anime, manga, comic-book inking, or visible contour outlines.
- Hyper-real skin, photographic detail, or a studio headshot appearance.
- Symmetrical beauty retouching or a generic perfect AI face.
- Bright cyberpunk neon, holographic interfaces, or glowing crystal shards.
- Literal religious imagery, supernatural ghost effects, or fantasy costumes.
- Text, labels, numbers, icons, borders, frames, cards, or other UI.
- Weapons, military glamour, gore, or sensationalised injury.
- A background detailed enough to compete with the face.
