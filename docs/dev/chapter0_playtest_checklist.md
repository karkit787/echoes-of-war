# Chapter 0 Playtest Checklist

## Automated QA

Run from the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File tools/content-validation/validate-chapter0-scene.ps1
```

Current automated result: **PASS**

- [x] All five dialogue files parse as valid JSON.
- [x] All 110 dialogue node IDs are unique.
- [x] All `next` and choice references resolve.
- [x] All nodes are reachable from the Chapter 0 entry.
- [x] All five backgrounds exist and have valid PNG data and dimensions.
- [x] All six portraits exist and have valid PNG data and dimensions.
- [x] Every portrait ID resolves to the expected speaker asset.
- [x] All eight interactables map to the correct dialogue entry.
- [x] All seven object inspections set their expected first-inspection flag.
- [x] Inspected objects do not replay their first-inspection sequence.
- [x] The corridor remains locked until the device and two other clues are inspected.
- [x] All 17 authored choice branches reach their intended convergence point.
- [x] Logic, Empathy, Scepticism, Memory, and Conscience all appear.
- [x] The memory shard and three flashback sequences select the expected backgrounds.
- [x] A mid-flashback progress restore preserves its visual background.
- [x] A complete deterministic playthrough can start and end Chapter 0.
- [x] Completion sets `ch0_completed`, displacement confirmation, and the Chapter 1 target.

## Editor Prerequisites

These items cannot be checked until Cocos Creator initializes the repository:

- [ ] Confirm the exact Cocos Creator 3.x version.
- [ ] Open or initialize the repository as a Cocos Creator project.
- [ ] Allow Cocos to generate `.meta` files and stable asset UUIDs.
- [ ] Create and save `assets/scenes/Chapter0Prologue.scene`.
- [ ] Bind the scene according to `docs/dev/chapter0_playable_scene.md`.
- [ ] Add `Chapter0Prologue.scene` to the build/start scene list.

## Start Scene

- [ ] Launch `Chapter0Prologue.scene` without console errors.
- [ ] Confirm the abandoned-room background appears.
- [ ] Confirm the screen begins black and fades in.
- [ ] Confirm the opening entry is `ch0_intro_wake_001`.
- [ ] Confirm the dialogue panel is above the background and inside the safe area.
- [ ] Restart the scene and confirm no state leaks from the previous run.

## Dialogue Display

- [ ] Speaker name, dialogue text, and portrait are visible.
- [ ] Narration and System lines hide the portrait.
- [ ] Player lines use the trainee historian portrait.
- [ ] Typewriter text reveals at a readable speed.
- [ ] First tap during reveal completes the line.
- [ ] Next tap advances exactly once.
- [ ] Continue is hidden while choices are active.
- [ ] Long lines wrap without clipping.
- [ ] Dialogue history opens, scrolls, and closes.
- [ ] Missing optional history UI does not stop dialogue.

## Interactables

Enter investigation mode and verify each hotspot:

- [ ] **Broken time device** opens `ch0_inspect_device_001`.
- [ ] **Damaged ID card** opens `ch0_inspect_id_card_001`.
- [ ] **Research notes** opens `ch0_inspect_notes_001`.
- [ ] **Old newspaper** opens `ch0_inspect_newspaper_001`.
- [ ] **Cracked watch** opens `ch0_inspect_watch_001`.
- [ ] **Lab terminal** opens `ch0_inspect_terminal_001`.
- [ ] **Memory shard** opens `ch0_inspect_shard_001`.
- [ ] **Exit corridor** opens `ch0_choice_trust_memory` only after unlocking.
- [ ] Every hotspot can be selected comfortably on the target mobile viewport.
- [ ] Each inspected object disappears from the first-inspection hotspot list.
- [ ] Returning from an inspection restores the abandoned-room background.
- [ ] At least five objects can be inspected in one playthrough without a softlock.

## AI Fragments

- [ ] **Logic** uses cold blue-grey styling and the Logic portrait.
- [ ] **Empathy** uses muted violet styling and the Empathy portrait.
- [ ] **Scepticism** uses dark indigo styling and the Scepticism portrait.
- [ ] **Memory** uses faded blue-grey styling and the Memory portrait.
- [ ] **Conscience** uses pale ivory / muted ochre styling and its portrait.
- [ ] Fragment portraits remain visually distinct from the player portrait.
- [ ] Portrait changes do not briefly show the previous speaker.

## Memory Flashback

- [ ] Selecting the memory shard switches to `bg_ch0_memory_void`.
- [ ] The flashback overlay appears without obscuring dialogue readability.
- [ ] Countdown uses `bg_ch0_time_machine_chamber`.
- [ ] Containment failure uses `bg_ch0_destroyed_lab_flashback`.
- [ ] Final instruction uses `bg_ch0_memory_void`.
- [ ] Background cross-fades do not flash an empty or white frame.
- [ ] Restoring a progress snapshot mid-flashback restores the same background.

## Choices

- [ ] Test all three wake-up responses.
- [ ] Test all three approaches to the uncertain memory.
- [ ] Test both unsupported accident conclusions and confirm they retry.
- [ ] Test the supported containment-failure conclusion.
- [ ] Test all five trusted-consciousness choices.
- [ ] Test both unsupported timeline conclusions and confirm they retry.
- [ ] Select temporal displacement and confirm the ending continues.
- [ ] Choice effects appear in the progress snapshot.
- [ ] Rapid repeated taps do not select two choices.

## Chapter Ending

- [ ] The corridor background appears before the final conclusion.
- [ ] The timeline-instability warning becomes visible.
- [ ] The final objective appears.
- [ ] `ch0_timeline_displacement_confirmed` is `true`.
- [ ] `ch0_completed` is `true`.
- [ ] `next_chapter_id` is `chapter1_after_world_war_i`.
- [ ] `chapter0-complete` fires once with a serializable progress object.
- [ ] The final dialogue line displays without a dead continue button.

## Responsive And Target Checks

- [ ] Test the intended portrait-mobile design resolution.
- [ ] Test one narrow and one tall viewport.
- [ ] Confirm all hotspots align with visible objects after scaling.
- [ ] Confirm dialogue text and choices remain within safe areas.
- [ ] Confirm buttons meet a minimum 44 logical-pixel touch target.
- [ ] Confirm texture memory and package size on the WeChat target.
- [ ] Confirm the chapter works without network access.

## Known Issues

- The repository is not yet an initialized Cocos Creator project. There is no
  build command, project manifest, serialized scene, prefab, or imported asset
  metadata, so an editor/device launch has not been run.
- Cocos TypeScript compilation cannot run until the editor supplies the `cc`
  module and project configuration.
- Runtime hotspot positions are provisional normalized coordinates and need
  visual adjustment after the background is imported into a real Canvas.
- The portrait and background source PNGs total roughly 29 MB. Runtime texture
  compression and mobile-sized variants should be evaluated before WeChat
  packaging.
- Local save storage, audio, and automatic Chapter 1 scene routing are outside
  this Chapter 0 vertical slice.
- Node's test-only TypeScript stripping prints an experimental warning. This
  does not affect game runtime code.

