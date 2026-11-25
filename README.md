# SENSE Atlas

An interactive five-portal atlas for medical students: ear, nose, pharynx, larynx and eye — with schematic 3D explorers, an interactive anatomy map, disease entries, clinical cases and a global search index.

**Status:** v0.1 reviewed preview. Educational use only. Not a medical device, not for diagnosis, and not clinically validated.

## Stack

- Vite 5 + React 18 + TypeScript
- Three.js via `@react-three/fiber` and `@react-three/drei`
- React Router 7 (declarative mode), upgraded after external audit discovered advisory fixed only in v7
- React 18, TypeScript, lucide-react, clsx
- Hand-authored content in `src/data/` (no external content API, no patient data)
- **Realistic meshes:** CC0 human ear and eye (27 MB GLB, 800k triangles, 4K textures) from [Grab3D](https://grab3d.com/models/anatomy/human-ear-anatomy) — archived as `public/models/ear/human-ear-anatomy.glb` and `public/models/eye/human-eye.glb`. CC0: no attribution required.

Production dependencies audit clean on 2026-11-25 (`npm audit --omit=dev`: 0 vulnerabilities). The only remaining advisory is in Vite's development-time esbuild server and does not affect the static production bundle.

## Run locally

```bash
npm install
npm run dev
```

On Termux the npm scripts call Node directly (`node ./node_modules/...`) because `.bin` shims can fail on Android. On a normal machine the same scripts work unchanged.

```bash
npm run typecheck   # TypeScript, no emit
npm run audit       # every cross-reference in the data layer
npm run smoke       # server-render every route, disease, pathway and case
npm run build       # production bundle in dist/
npm run preview     # serve the production build
```

`npm run review` runs typecheck + audit + smoke in sequence.

## Deploy to Vercel

The repository includes `vercel.json` with an SPA rewrite to `index.html`, so deep links such as `/diseases/meniere` work on refresh.

```bash
npx vercel          # preview deployment
npx vercel --prod   # production deployment
```

Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.

## Content map

| Path | Contents |
| --- | --- |
| `src/data/ear.ts` | 18 ear structures |
| `src/data/eye.ts` | 17 eye structures |
| `src/data/diseases.ts` | 26 ENT/ophthalmology conditions |
| `src/data/pathways.ts` | Visual, auditory, facial and pupillary pathways |
| `src/data/cases.ts` | 12 clinical vignettes with explained options |
| `src/data/search.ts` | 82-entry global search index |
| `src/scenes/` | Schematic ear and eye meshes, layers and overlays |
| `src/components/sims/` | Audiogram, BPPV, cataract, glaucoma and fundus simulators |

## Accuracy and review

The product deliberately avoids “99% accurate” or “100% accurate” claims. Accuracy is handled as an auditable process:

- `accuracy/claims.csv` — high-risk claims, review questions and verdicts.
- `accuracy/DECISIONS.md` — dated corrections with reason and source status.
- `accuracy/REVIEWS.md` — the five internal review passes and their evidence.
- `accuracy/SECOND_OPINION.md` — exactly what to send to Claude, Gemini, ChatGPT or a human specialist.
- `REVIEW_REQUEST.md` — the full adversarial review packet.

An AI review is triage, not verification. A claim becomes **verified** only with a named source and a named human reviewer.

## Known limitations

- The 3D ear and eye are hand-built teaching schematics, not scan-derived anatomy and not to scale.
- Seven eye structures are described but not separately modelled: orbit, eyelids, lacrimal system, conjunctiva, choroid, visual pathway and pupillary pathway.
- Disease overlays are concepts, not radiological or histological appearances.
- Simulators simplify real devices and physiology.
- Doses, thresholds and management pathways vary by guideline and country.
- The whole-head model is roadmap, not part of v0.1.
- No independent clinical sign-off yet.

## Ownership

All rights reserved. Add your licence terms before selling or distributing the source.
