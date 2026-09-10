---
name: ZestPop
description: Nuxt 3 perfume recommendation app using TensorFlow.js KNN over a real perfume-notes dataset
applyTo: "*"
---

# ZestPop — Perfume KNN Matcher

Nuxt 3 + TensorFlow.js app. Users pick fragrance notes; a KNN (cosine-similarity) model over a perfume×note feature matrix recommends the closest matches.

## Stack
- Nuxt 3 (static `nuxt generate` → GitHub Pages via `docs/`).
- Tailwind via `@nuxtjs/tailwindcss`; custom theme tokens in `tailwind.config.ts` (tangerine/lime/watermelon/sunshine).
- TensorFlow.js loaded from CDN in `nuxt.config.ts` head AND imported as npm dep for the matcher.

## Data
- `data/notes.ts` — canonical note catalog (ids, families, colors). Source of truth for feature dimensions.
- `data/perfumes.ts` — real perfume dataset with note ids mapped onto the catalog. Only notes present in `NOTES` are used by the matcher.

## Matcher
- `composables/useKnnMatcher.ts` — builds a binary perfume×note matrix, runs cosine similarity via `tf.matMul`, returns top-k `MatchResult`s.
- Runs client-side only (TFJS is browser-only). `onMounted` warms the backend.

## Conventions
- Dynamic Tailwind classes are forbidden (purger can't see them). Map color tokens → static class strings via lookup tables (see `NOTE_BG` in components).
- Component names must not collide with exported type names (hence `MatchPanel.vue`, not `MatchResult.vue`).
- Deploy: `make deploy` → `nuxt generate` → copy to `docs/` → push to `main`. GitHub Pages serves `docs/`.