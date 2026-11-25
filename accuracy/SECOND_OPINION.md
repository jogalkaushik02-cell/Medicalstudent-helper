# What needs a second opinion

This is the short, actionable list for the Claude / Gemini / ChatGPT review panel. The long adversarial brief is `REVIEW_REQUEST.md`; the machine-readable register is `claims.csv`. Use this file to decide **what to send, to whom, and what counts as an answer**.

> **Rule:** three AIs agreeing is not verification. Models share training data and can share the same error. AI output is triage. A claim becomes verified only when a named human specialist signs it off against a named source.

---

## Send in this order

Do not send the whole project at once. Each reviewer gets one section independently, without seeing the others' answers.

### Round 1 — anatomy numbers (highest commercial risk)

Send to **all three** reviewers, separately:

- E-01 tympanic membrane diameter, thickness and effective vibrating area
- E-03 malleus, incus, stapes and footplate dimensions
- E-04 middle-ear cleft volume: tympanic cavity or whole mastoid system?
- E-05 Eustachian tube length, adult angle and infant comparison
- E-06 cochlea uncoiled length, turns, height and basal diameter
- E-08 semicircular canal lumen and the lateral canal's 30° orientation
- E-09 internal auditory canal dimensions and Bill's bar
- E-10 cochlear nerve axon count (currently 30,000–50,000; an earlier draft wrongly said 1.2 million)
- O-01 corneal diameter, central thickness and refractive power
- O-02 aqueous volume and normal IOP range
- O-04 rod/cone counts, optic disc size, fovea and foveola terminology
- O-07 palpebral fissure and tarsal plate heights
- O-08 canaliculus, lacrimal sac and nasolacrimal duct lengths
- O-09 orbital and globe volumes
- O-10 ciliary body width, ciliary process count and safe pars plana distance

**Ask for:** the correct value or range, the convention used, one primary source, and a one-line wording a student could safely learn.

### Round 2 — clinical management (highest safety risk)

Send to **all three** reviewers, separately, with the country/guideline context stated:

- E-19 / M-01 acute otitis media: high-dose amoxicillin 80–90 mg/kg/day, and the 48–72 h observation criteria
- M-06 Ménière: low-salt diet and betahistine — what does the evidence actually support?
- M-07 Bell's palsy: steroid timing, dose and when an antiviral is indicated
- M-08 primary open-angle glaucoma: is a prostaglandin analogue first line in all settings?
- M-09 acute angle-closure: IV acetazolamide + pilocarpine + osmotic agent — sequence and cautions
- M-11 optic neuritis: IV steroids do not change final acuity — confirm and state the caveat
- O-13 diabetic retinopathy screening: correct the blanket “annual” interval by type, duration and pregnancy
- O-15 apraclonidine reversal of anisocoria in Horner syndrome — caveats in children

**Ask for:** the current guideline (name and year), the exact wording that would be defensible in a student atlas, and any population where the statement is unsafe.

### Round 3 — geometry and simulator assumptions

Send to **one** reviewer first, then a different reviewer to challenge the answer:

- Pinna orientation and external canal course
- Ossicular chain continuity and stapes footplate position
- Cochlear turns and vestibular labyrinth relationship
- Globe, optic nerve, macula and extraocular muscle relationships
- Audiogram: air–bone gap conventions and the meaning of the symbols
- Epley sequence: canalith movement and the expected nystagmus at each step
- Cup-to-disc ratio thresholds and the arcuate field defect in the glaucoma simulator
- Visual-field patterns: chiasm, optic tract, Meyer loop, parietal radiation and macular sparing

**Ask for:** “what is misleading here?” rather than “is this okay?”. Geometry errors are often relational, not numerical.

### Round 4 — language and uncertainty

Send the disease and pathway text to **one** reviewer with this instruction:

> Find every sentence that sounds more certain than the evidence allows. Flag absolute words, single-case claims presented as general rules, doses without a guideline, and any statement that could delay urgent care.

### Round 5 — human sign-off

The output of Rounds 1–4 goes to a named ENT consultant and a named ophthalmologist. They check the corrected wording against primary sources and sign the entry in `DECISIONS.md`. Until then every affected entry stays marked **Review pending**.

---

## Copy-paste prompt

```text
You are reviewing a student atlas for factual errors, not for style.

Context: the atlas is for year-3 medical students. It is not for patient care.
The claim below is currently shipped. Treat it as wrong until proven otherwise.

Claim ID: <ID>
Claim as written: <paste claim_in_app>
Location: <paste location>
Question: <paste review_question>

Answer in this exact structure:
1. Verdict: correct / partly correct / wrong / cannot verify.
2. Correct value or wording (one or two sentences a student can safely learn).
3. What is wrong or misleading in the current wording, if anything.
4. Primary source: author/organisation, title, edition or year, page or section.
5. Confidence and what you could not check.
6. A safer wording if the evidence is uncertain.

Do not praise the project. Do not invent a citation. If you do not know, say so.
```

---

## What to do with the answers

1. Save each raw answer as `accuracy/reviews/<reviewer>-<YYYY-MM-DD>.md`.
2. Do not merge answers. Keep them independent.
3. Reconcile using Section 8 of `REVIEW_REQUEST.md`.
4. Log every change in `DECISIONS.md` before editing data.
5. Update `claims.csv` with verdict, corrected claim, source, reviewer and date.
6. Re-run `npm run review` after any data change.
7. If the reviewers disagree, keep the range in the app and say the evidence is contested. Do not pick the most confident-sounding answer.

## Status board

| Round | Claims | Reviewers | Status |
| --- | --- | --- | --- |
| 1 Anatomy numbers | 15 | Claude, Gemini, ChatGPT | Not sent |
| 2 Clinical management | 8 | Claude, Gemini, ChatGPT | Not sent |
| 3 Geometry & simulators | 10 checks | Two reviewers, independently | Not sent |
| 4 Language & uncertainty | All prose | One reviewer | Not sent |
| 5 Human sign-off | All corrected claims | ENT consultant + ophthalmologist | Not started |

Last updated: 2026-11-25.
