# Chapter 0 Portrait Negative Prompts

Use these rejection constraints for future variants. They are phrased as
negative guidance rather than a separate model parameter because the built-in
generation workflow accepts a single structured prompt.

## Global Negative Prompt

```text
Avoid photorealistic faces, smooth or airbrushed skin, detailed eyelashes,
symmetrical beauty retouching, glamour poses, glossy fantasy character art,
anime, manga, comic-book inking, strong contour lines, clean vector shapes,
polished digital illustration, polished 3D rendering, cyberpunk neon,
holograms, circuits, glowing eyes, magical glow, crystal shards, excessive
fragment effects, detailed laboratory scenery, weapons, gore, sensationalised
injury, text, labels, numbers, readable symbols, logos, watermarks, UI cards,
frames, borders, or interface elements.
```

## Character-Specific Rejections

For every AI consciousness portrait, also reject:

```text
Recognizable trainee historian face, messy-haired young person in the trainee's
coat or shirt, shoulder strap, ordinary headshot composition, one complete
natural face with only decorative background effects, or literal identity
continuity with the player character.
```

### Main Character

```text
Avoid heroic posing, pristine clothing, action-movie lighting, visible weapons,
severe wounds, helpless expression, or a detailed science-fiction background.
```

### Logic

```text
Avoid robotic anatomy, circuitry, holographic overlays, mathematical symbols,
perfect bilateral symmetry, neon blue light, clean computer-generated
geometry, or a conventional intact face.
```

### Empathy

```text
Avoid halos, circular arcs behind the head, wings, religious imagery, angelic
glow, tears as shorthand, cheerful smiles, sentimental warmth, or idealised
beauty. Avoid reducing empathy to one attractive sad face.
```

### Scepticism

```text
Avoid villain costumes, monstrous anatomy, literal broken glass, horror ghosts,
gore, glowing eyes, snarling expressions, cruelty, or a merely shadowed normal
portrait.
```

### Memory

```text
Avoid skulls, screaming faces, horror ghosts, transparent apparitions, many
equal-weight faces, photomontage, readable documents, dates, letters, or
nostalgic golden glow. Avoid one complete face with decorative echoes behind it.
```

### Conscience

```text
Avoid literal halos, saints, angels, crowns, robes, scales, gavels, religious
symbols, heroic grandeur, punitive judgement, perfect symmetry, or a single
authoritative normal face.
```
