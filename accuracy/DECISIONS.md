# Accuracy Decision Log

Every factual or geometric correction that changes shipped content goes here. The goal is auditability: a customer, reviewer, or lawyer should be able to see **what changed, why, on whose authority, and when**.

## Rules

- One entry per decision, newest first.
- A claim is **VERIFIED** only when it has a named source **and** a named human reviewer (initials + date).
- AI review is recorded as **triage**, never as verification.
- If sources conflict, record the range and the chosen wording.
- If a claim is removed, record why.
- Do not silently edit content after a review. Log it here first, then update the data.

## Template

```md
## YYYY-MM-DD — [claim ID] [short title]

- **Previous wording:**
- **New wording:**
- **Reason:**
- **Source(s):**
- **Reviewed by:** [name / role / initials, date]
- **Status:** corrected / verified / disputed / removed
- **Files changed:**
- **Verification:** [ ] second source checked [ ] human reviewer signed off
```

---

## 2026-11-25 — 3D-01 Extraocular muscles gated by the retina layer

- **Previous behaviour:** the extraocular muscle meshes were rendered inside `PosteriorSegment`, which is only mounted when the retina layer is on. Turning retina off hid the muscles even when “Muscles” was on.
- **New behaviour:** muscles are an independent `ExtraocularMuscles` layer; retina and muscles can be toggled separately.
- **Reason:** layer controls must be independent, and the UI presents them as independent.
- **Source(s):** internal geometry review, `accuracy/REVIEWS.md` Pass 3.
- **Reviewed by:** AI self-catch only — not yet verified by a human.
- **Status:** corrected, awaiting review
- **Files changed:** `src/scenes/EyeScene.tsx`
- **Verification:** [ ] second source checked [ ] human reviewer signed off

---

## 2026-11-25 — 3D-02 Sclera opacity obscured intraocular structures

- **Previous behaviour:** sclera opacity 0.42 (0.12 in cutaway) made the lens, iris and retina hard to see at the default camera.
- **New behaviour:** sclera opacity 0.24 (0.07 in cutaway), preserving the globe shell while keeping internal structures legible.
- **Reason:** the explorer's teaching purpose is the relationship between surface and internal structures.
- **Source(s):** internal geometry review, `accuracy/REVIEWS.md` Pass 3.
- **Reviewed by:** AI self-catch only — not yet verified by a human.
- **Status:** corrected, awaiting review
- **Files changed:** `src/scenes/EyeScene.tsx`
- **Verification:** [ ] second source checked [ ] human reviewer signed off

---

## 2026-11-25 — E-10 Cochlear nerve axon count

- **Previous wording:** “About 1–2 mm thick; ~1.2 million cochlear axons.”
- **New wording:** “About 1–2 mm thick; the cochlear division carries roughly 30,000–50,000 axons.”
- **Reason:** 1.2 million is the approximate axon count of the **optic nerve**, not the cochlear nerve. The auditory nerve is far smaller. This was an AI self-catch during review preparation.
- **Source(s):** Pending independent verification against a neuroanatomy source (e.g. Gray's Anatomy / Thieme Head, Neck and Neuroanatomy).
- **Reviewed by:** AI self-catch only — **not yet verified by a human**.
- **Status:** corrected, awaiting review
- **Files changed:** `src/data/ear.ts`
- **Verification:** [ ] second source checked [ ] human reviewer signed off

---

## 2026-11-25 — Product accuracy claim

- **Decision:** The product will **not** use “100% accurate” or equivalent claims.
- **Approved wording:** “Sourced, specialist-reviewed, versioned, with known limitations.”
- **Reason:** No atlas or model is 100% accurate; the claim is unverifiable and creates consumer-protection and liability risk. Accuracy must be demonstrated through citations, review records, and an errata process.
- **Reviewed by:** Product decision (pending legal review).
- **Status:** policy
- **Files changed:** `REVIEW_REQUEST.md`, UI copy

---

## 2026-11-25 — 3D model status

- **Decision:** The current 3D ear and eye are labelled **schematic** in the UI until replaced by measured, scan-derived meshes.
- **Reason:** They are built from primitives and are intended to teach relationships, not millimetre anatomy.
- **Reviewed by:** Pending ENT/ophthalmology 3D review.
- **Status:** policy
- **Files changed:** 3D explorer pages, About page
