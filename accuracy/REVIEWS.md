# Internal review passes — v0.1

Date: 2026-11-25

**Stage 2 pass — frontend rebuild.** Added the five-portal gate (`/sections`), interactive anatomy maps for nose/pharynx/larynx, the airway narrowing simulator, credits for Kaushik Jogal and the AI build partner, a golden disclaimer, a direct WhatsApp suggestion bar, and a neon/cyberpunk theme using emerald, violet and gold. All new routes were added to the smoke test and render without errors.
Reviewer: AI build agent (DeepSeek V4.1 Flash Free)
Scope: the whole v0.1 application, not individual claims (see `claims.csv` for those).

These are **internal** passes. They are not clinical validation and do not replace a named human reviewer. Each pass records what was checked, what was found and what changed.

---

## Pass 1 — Build and typecheck

**Commands**

```bash
npm run typecheck
npm run build
```

**Result:** pass.

- TypeScript strict mode: 0 errors.
- Vite production build: 2,204 modules transformed, bundle written to `dist/`.
- Fixed: `tsc -b` emitted `vite.config.js` and `vite.config.d.ts` into the project root, where they could shadow the real config. Build now runs `tsc --noEmit` and the generated files were removed.
- Fixed: Termux `.bin` shebangs (`/usr/bin/env`) fail on Android. npm scripts now invoke Node directly; the commands remain portable.
- Noted: the Three.js chunk is ~844 kB before gzip (~227 kB gzip). Acceptable for a 3D app; route-level lazy loading already keeps the first paint smaller.

**Dependency audit:** `npm audit --omit=dev` reports **0 vulnerabilities** after upgrading React Router to 7.18.7 and drei to 9.122.0. The remaining advisory is dev-only (Vite's esbuild development server) and is not present in the static production output. It is recorded here rather than hidden.

**Evidence:** build log, `npm run typecheck` exit 0, `npm audit --omit=dev`.

---

## Pass 2 — Data and link integrity

**Command:** `npm run audit`

**Result:** pass.

- 35 structures (18 ear, 17 eye)
- 26 diseases (13 ENT, 13 ophthalmology)
- 4 pathways
- 12 clinical cases
- 82 search entries

Checks performed by `scripts/audit-data.mjs`:

- No duplicate IDs in structures, diseases, pathways, cases or simulations.
- Every disease `structures[]` ID resolves.
- ENT diseases reference only ear structures; ophthalmology diseases reference only eye structures.
- Every pathway step has a unique ID, label and detail; every referenced structure resolves.
- Every case has exactly one correct option, a valid `diagnosisId`, and text on every option.
- Every search entry resolves and its `href` matches the canonical route pattern.
- `earStructures` and `eyeStructures` contain only their own system.

**Additional route smoke test:** `npm run smoke` server-renders 18 representative routes plus all 26 disease pages, all 4 pathway pages and all 12 case pages. All rendered without throwing.

---

## Pass 3 — 3D geometry and layers

**Result:** pass after two fixes.

Checked:

- Every mesh `id` in `EarScene` and `EyeScene` exists in the data layer.
- Every ear structure has a mesh and a label.
- Eye structures without meshes are exactly the seven documented exceptions (orbit, eyelids, lacrimal system, conjunctiva, choroid, visual pathway, pupillary pathway). They remain selectable from the rail and search and show a “not modelled” note.
- Layer gating: outer/middle/inner/nerves for the ear; globe/anterior/retina/muscles for the eye.
- Disease overlays: AOM, otitis externa, cholesteatoma, otosclerosis and schwannoma render only in their intended region.

**Fixes**

1. Extraocular muscles were nested inside the retina layer, so turning retina off also hid the muscles even when “Muscles” was on. Muscles now have an independent `ExtraocularMuscles` layer.
2. The sclera was opaque enough to obscure the intraocular structures at default opacity. Reduced to 0.24 (0.07 in cutaway) so the lens, iris and retina remain visible while the globe still reads as a shell.

**Not verified visually:** no browser/WebGL device was available in the build environment. Occlusion, label overlap and mobile touch behaviour still need a real-device pass. This is recorded as an open limitation.

---

## Pass 4 — Content and terminology

**Result:** pass for internal consistency; clinical claims remain open.

Checked:

- UK spelling is consistent. No whole-word US variants (`edema`, `hemorrhage`, `pediatric`, `tumor`, `anesthesia`, `fiber`, `center`, `color`) were found in the data layer; matches were inside correctly spelled terms such as `papilloedema`.
- No “99% accurate”, “100% accurate” or equivalent marketing claims. A grep finds only legitimate uses such as “99% water” for vitreous.
- Cochlear nerve axon count corrected from the erroneous 1.2 million (an optic-nerve figure) to roughly 30,000–50,000.
- 29 high-risk claims are registered in `accuracy/claims.csv` with a review question and confidence rating. All remain unverified pending external review.
- Every disease entry carries definition, pathophysiology, risk factors, symptoms, signs, investigations, treatment, pearls and tags; the data audit enforces these fields.

**Not done:** no claim has been checked against a named primary source by a human. The app states this openly on the Accuracy & limits page and at the point of use.

---

## Pass 5 — UX, accessibility and responsive behaviour

**Result:** pass with open items.

Checked and fixed:

- Search dialog now traps Tab/Shift-Tab inside the panel and restores focus to the trigger on close.
- Search input has an accessible label; result buttons are keyboard reachable; arrow keys and Enter work globally while the dialog is open.
- All icon-only controls have `aria-label`; toggles expose `aria-pressed`.
- `prefers-reduced-motion` disables animation and smooth scrolling.
- Focus-visible styling, skip-to-content link, semantic landmarks and a 404 route are present.
- Mobile breakpoints at 1240, 1040, 720 and 460 px; bottom navigation replaces the sidebar on small screens.
- A WebGL error boundary now keeps the rail and detail panel usable if the 3D context fails on a low-end device.

**Open items for a real-device pass:**

- Measure colour contrast rather than relying on token design.
- Run axe or a screen reader through the explorers and simulators.
- Test label crowding at 360 px width and at high zoom.
- Test touch orbit/pinch on iOS Safari and low-end Android.
- The search results use buttons inside a listbox-style dialog; a stricter combobox pattern would improve screen-reader announcements.

---

## Gate to the next version

Before selling as a clinical reference:

1. External review of every claim in `claims.csv` by named ENT and ophthalmology reviewers.
2. Real-device 3D and accessibility pass.
3. Replace schematic meshes with licensed, provenance-recorded scan data (v0.2).
4. Legal review of disclaimers, ownership and any anatomical-data licences.
