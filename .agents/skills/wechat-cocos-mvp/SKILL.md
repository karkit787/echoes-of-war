---
name: wechat-cocos-mvp
description: Use when building, reviewing, or planning Cocos Creator / TypeScript systems for the Echoes of War WeChat Mini App MVP.
---

# WeChat Cocos MVP Skill

## Inputs to read first

- `AGENTS.md`
- `docs/codex/TECHNICAL_DIRECTION.md`
- `docs/codex/PROJECT_BRIEF.md`

## Priorities

1. Keep the MVP lightweight and demonstrable.
2. Separate content data from engine/UI code.
3. Keep game state serializable.
4. Abstract platform services such as storage and networking.
5. Ensure AI-dependent systems have deterministic mock/fallback behavior.

## Review checklist

- Does it run without live AI?
- Are assets and dependencies reasonable for a mini app?
- Is story content outside UI components?
- Are TypeScript types clear and serializable?
- Can Chapter 0 and Chapter 1 content reuse the same systems?
- Are errors and offline cases handled gracefully?

## Avoid

- Large unnecessary dependencies.
- Direct API calls from UI components.
- Overly complex 3D or multiplayer features.
- Huge branching systems before the vertical slice works.
