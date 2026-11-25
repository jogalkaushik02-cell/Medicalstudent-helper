# SENSE Atlas — Independent Accuracy Review Packet

**Version:** 0.1 (pre-release)
**Date:** 25 November 2026
**Project:** `~/senses-atlas` (React + Three.js educational atlas for ENT and ophthalmology)
**Status:** **Not clinically validated. Not for patient care. Not ready to sell as a medical reference.**
**Prepared by:** AI build agent (DeepSeek V4.1 Flash Free), with content written from standard medical knowledge.

---

## 0. Why this file exists

The product goal is a paid educational tool for medical students. The commercial risk is not "not enough content" — it is **a confident wrong fact, a misleading 3D relationship, or a copied asset**. This packet is designed to find those before a customer does.

It is deliberately adversarial. Reviewers are asked to **find errors**, not to validate effort. Praise is useless here.

> **Important:** Several AIs agreeing is not verification. Models share training data and can share the same error. AI review is a triage layer. Every disputed claim must be resolved against a named primary source, and clinical content needs a named human specialist before sale.

---

## 1. Reviewer prompt (paste this with one section at a time)

```text
You are an independent medical content reviewer for an educational ENT/ophthalmology atlas.

Your job is to find factual errors, misleading simplifications, and dangerous omissions. Do not praise the work. Do not rewrite the whole product. Do not invent citations.

For every item:
1. Verdict: CONFIRMED / CORRECTED / UNVERIFIED / DISPUTED / DANGEROUS.
2. If CORRECTED or DISPUTED: give the corrected wording and a named source (author, title, edition, chapter/page or guideline year). If browsing is available, include a link.
3. State confidence: HIGH / MEDIUM / LOW.
4. If you cannot verify it, say UNVERIFIED. Do not guess.
5. Flag anything that could cause harm if a student acted on it.
6. Add any high-yield omission you notice, but keep it relevant to the section.

Return a markdown table with columns:
ID | Verdict | Corrected wording | Source | Confidence | Notes

Rules:
- "Looks correct" is not a review. Cite something.
- Do not use another AI's answer as your source.
- If two reputable sources disagree, say so and give the range.
- Do not approve doses, red flags, or emergency management without a guideline citation.
```

**For independence:** give the same section to each model separately. Do not show them each other's answers until all have replied. Then reconcile in Section 8.

---

## 2. Non-negotiable rules for this product

1. We will **not** claim "100% accurate". We will claim "sourced, reviewed, versioned, with known limitations".
2. Every numeric claim needs **two independent reputable sources** or one authoritative guideline.
3. Every disease entry needs a **red-flag / emergency** section and a **"when to refer"** statement.
4. Every 3D structure must be labelled **schematic** unless it is derived from measured scan data.
5. No textbook figures, atlas plates, or commercial 3D assets may be copied without a licence.
6. A claim is "verified" only when it has a citation **and** a named human reviewer's initials/date.
7. If sources conflict, show the range and the uncertainty — do not silently pick one.

---

## 3. High-risk factual claims to check

These are the claims most likely to be wrong, outdated, or dangerously oversimplified. Locations refer to files under `src/data/`.

### 3.1 Ear anatomy and physiology

| ID | Claim in the app | Location | My confidence | What to check |
|---|---|---|---|---|
| E-01 | Tympanic membrane ~9–10 mm diameter, ~0.1 mm thick, effective vibrating area ~45 mm² | `ear.ts` → tympanic-membrane | Medium | Total area vs effective area; sources quote ~45–55 mm². Give the correct convention. |
| E-02 | External canal ~2.5 cm; resonance ~2–4 kHz | `ear.ts` → external-canal | Medium | Length range, resonance peak, and whether 2–4 kHz is the correct teaching figure. |
| E-03 | Malleus 8–9 mm; incus ~7 mm; stapes ~3 mm; footplate 3.2 × 1.4 mm | `ear.ts` → ossicles | Medium | Standard dimensions and whether ranges should be wider. |
| E-04 | Middle-ear cleft volume ~2 mL (about 1–2 mL) | `ear.ts` → middle-ear-cleft | Low–Medium | Tympanic cavity vs mastoid system; is 2 mL defensible? |
| E-05 | Eustachian tube 35–45 mm; ~45° in adults, more horizontal in infants | `ear.ts` → eustachian-tube | Medium | Length, angle, and the infant comparison. |
| E-06 | Cochlea ~35 mm uncoiled, 2.5–2.75 turns, ~5 mm high, ~9 mm base | `ear.ts` → cochlea | High | Confirm the turn count and dimensions. |
| E-07 | Endocochlear potential ~+80–85 mV | `ear.ts` → cochlea | High | Confirm range and ionic basis. |
| E-08 | Semicircular canal lumen ~0.8 mm; lateral canal ~30° above horizontal | `ear.ts` → semicircular-canals | Medium | Lumen and the 30° figure. |
| E-09 | Internal auditory canal ~8–10 mm long, 4–5 mm wide at the porus | `ear.ts` → internal-auditory-canal | Medium | Dimensions and Bill's bar description. |
| E-10 | Cochlear nerve carries ~30,000–50,000 axons (corrected from an earlier wrong "1.2 million") | `ear.ts` → auditory-nerve | Medium | Confirm count. This was an AI self-catch; verify independently. |
| E-11 | Facial canal ~3 cm; nerve ~1–1.5 mm thick | `ear.ts` → facial-nerve | Medium | Length/thickness and segment names. |
| E-12 | Incus is the most commonly eroded ossicle in cholesteatoma | `ear.ts` / `diseases.ts` | Medium–High | Confirm and state the reason (long process, poor support). |
| E-13 | BPPV: posterior canal 85–90% | `diseases.ts` → bppv | High | Confirm current figure; horizontal canal percentage. |
| E-14 | Ménière becomes bilateral in 30–50% eventually | `diseases.ts` → meniere | Low–Medium | Sources vary widely. Give a defensible range or remove the number. |
| E-15 | Vestibular schwannoma prevalence "about 1 in 1,000 adults" | `diseases.ts` → acoustic-neuroma | Low | Prevalence vs incidence; autopsy vs symptomatic. Clarify. |
| E-16 | Bell's palsy: ~70% recover | `diseases.ts` → bells-palsy | Low–Medium | Define "recover" (complete vs acceptable) and cite a cohort/guideline. |
| E-17 | Otosclerosis worsens during pregnancy | `diseases.ts` → otosclerosis | Low–Medium | Association vs causation; cite evidence. |
| E-18 | Corticosteroids may modestly improve vestibular neuritis | `diseases.ts` → vestibular-neuritis | Low | Evidence is debated; state uncertainty. |
| E-19 | AOM: high-dose amoxicillin 80–90 mg/kg/day | `diseases.ts` → acute-otitis-media | High | Confirm against current AAP/NICE guidance and local resistance patterns. |
| E-20 | "Bulging TM is the most specific sign" of AOM | `diseases.ts` / `cases.ts` | High | Confirm wording and the role of pneumatic otoscopy. |

### 3.2 Eye anatomy and physiology

| ID | Claim in the app | Location | My confidence | What to check |
|---|---|---|---|---|
| O-01 | Cornea ~11.5 mm diameter, 0.55 mm central thickness, ~43 D | `eye.ts` → cornea | High | Confirm dimensions and dioptric power. |
| O-02 | Aqueous volume ~0.25 mL; IOP 10–21 mmHg | `eye.ts` → anterior-chamber | High | Confirm volume and normal range. |
| O-03 | Lens ~9–10 mm diameter, 3.6–4 mm thick, ~20 D | `eye.ts` → lens | High | Confirm adult dimensions and power. |
| O-04 | Retina ~120 million rods, ~6 million cones; disc ~1.5 mm; fovea ~1.5 mm | `eye.ts` → retina | High | Confirm counts and fovea definition (fovea vs foveola). |
| O-05 | Vitreous ~4 mL, ~80% of globe volume | `eye.ts` → vitreous | High | Confirm. |
| O-06 | Optic nerve ~50 mm long, ~1.2 million axons | `eye.ts` → optic-nerve | High | Confirm length and axon count. |
| O-07 | Palpebral fissure ~10 mm; upper tarsus ~10 mm | `eye.ts` → eyelids | Medium | Confirm vertical fissure and tarsal height. |
| O-08 | Canaliculi ~2 mm; lacrimal sac 10–12 mm; nasolacrimal duct 12–18 mm | `eye.ts` → lacrimal-system | Medium | Confirm dimensions and drainage. |
| O-09 | Orbit ~40 mm deep, ~30 mL; globe ~7 mL | `eye.ts` → orbit | Medium | Confirm volumes; some sources differ. |
| O-10 | Ciliary body ~6 mm wide; ~70 ciliary processes | `eye.ts` → ciliary-body | Medium | Confirm counts and pars plana safety distance. |
| O-11 | Glaucoma: CDR >0.5 or asymmetry >0.2 is suspicious | `diseases.ts` → POAG | High | Confirm that these are screening clues, not diagnostic thresholds. |
| O-12 | Acute angle closure: IOP often >40 mmHg | `diseases.ts` → acute-angle-closure | High | Confirm. |
| O-13 | Annual diabetic retinopathy screening | `diseases.ts` → diabetic-retinopathy | Medium | Screening interval depends on type/duration/pregnancy; correct the blanket statement. |
| O-14 | Macular sparing from dual MCA/PCA supply to the occipital pole | `pathways.ts` → visual | High | Confirm mechanism and alternatives. |
| O-15 | Apraclonidine reverses anisocoria in Horner syndrome | `diseases.ts` → horner-syndrome | High | Confirm and note caveats (e.g. not in children). |
| O-16 | Pupil-involving CN III palsy suggests compression (aneurysm) | `diseases.ts` → third-nerve-palsy | High | Confirm and refine the emergency pathway. |
| O-17 | Argyll Robertson pupil: small, irregular, light-near dissociation | `eye.ts` → iris-pupil | High | Confirm. |
| O-18 | Adie pupil: large, tonic, vermiform, benign | `eye.ts` → iris-pupil | High | Confirm. |
| O-19 | Papilloedema: acuity often preserved early | `diseases.ts` → papilloedema | High | Confirm and add the caveat about late loss. |
| O-20 | JIA-associated uveitis can be silent; screening matters | `diseases.ts` → anterior-uveitis | High | Confirm screening schedule by JIA subtype. |

### 3.3 Disease management claims that need guideline review

| ID | Claim | Location | Why it matters |
|---|---|---|---|
| M-01 | AOM observation 48–72 h in selected children | `diseases.ts` | Age/severity criteria differ between AAP and NICE. |
| M-02 | Topical ciprofloxacin + dexamethasone for otitis externa | `diseases.ts` | Local availability/resistance; avoid aminoglycosides with perforation. |
| M-03 | Cholesteatoma is treated surgically; no medical cure | `diseases.ts` | Confirm and add the role of pre-op infection control. |
| M-04 | Stapedotomy/stapedectomy for otosclerosis | `diseases.ts` | Confirm indications and consent risks. |
| M-05 | Epley for posterior canal BPPV | `diseases.ts` | Confirm technique and contraindications. |
| M-06 | Low-salt diet/betahistine for Ménière | `diseases.ts` | Evidence quality is debated; state it. |
| M-07 | Steroids within 72 h for Bell's palsy | `diseases.ts` | Confirm dose/regimen and antiviral indication. |
| M-08 | Prostaglandin analogue first line for POAG | `diseases.ts` | Confirm against current guidelines and cost/availability. |
| M-09 | IV acetazolamide + pilocarpine + osmotic agents for AACG | `diseases.ts` | Confirm sequence and cautions. |
| M-10 | Anti-VEGF for wet AMD | `diseases.ts` | Confirm urgency and monitoring. |
| M-11 | IV steroids for optic neuritis | `diseases.ts` | Confirm that they do not change final acuity. |
| M-12 | Acetazolamide for IIH | `diseases.ts` | Confirm and note monitoring. |

---

## 4. 3D geometry review — relationships, not aesthetics

The current 3D scenes are **schematic reconstructions from primitives**, not scan-derived meshes. They are intended to teach relationships. Please review each item and mark: **ACCEPTABLE SIMPLIFICATION / MISLEADING / UNACCEPTABLE**.

### Ear scene (`src/scenes/EarScene.tsx`)

| ID | Question |
|---|---|
| G-01 | Is the pinna orientation and the helix/antihelix/concha/tragus arrangement acceptable as a schematic? What is actively misleading? |
| G-02 | Does the external canal follow a plausible course, and is the tympanic membrane angle (~55°) represented correctly? |
| G-03 | Are the malleus, incus and stapes relationships correct? Is the stapes footplate in the oval window? Is the incudostapedial joint in the right place? |
| G-04 | Does the facial nerve run above the oval window and descend behind the external canal? Is the chorda tympani crossing the tympanic membrane correctly? |
| G-05 | Is the cochlea's axis and coiling (2.5 turns) correct relative to the vestibule and internal auditory canal? Is it too far lateral/medial? |
| G-06 | Are the three semicircular canals in the correct orthogonal planes? Is the lateral canal horizontal? |
| G-07 | Does the Eustachian tube course anteromedial and inferior correctly? |
| G-08 | Is the internal auditory canal/CPA relationship correct? Are CN VII and VIII in the right relative positions? |
| G-09 | Which missing structures are essential for a first teaching model (e.g. tensor tympani, stapedius, round window membrane, mastoid antrum)? |

### Eye scene (`src/scenes/EyeScene.tsx`)

| ID | Question |
|---|---|
| G-10 | Are the cornea, anterior chamber, iris, lens and ciliary body proportions plausible? |
| G-11 | Is the optic nerve insertion correct, and are the macula and optic disc in the right relative positions? |
| G-12 | Are the extraocular muscle origins and insertions correct enough for teaching actions? |
| G-13 | Is the retina/choroid/sclera layering clear, or does the transparency make it misleading? |
| G-14 | What is the minimum set of structures needed before this can be called an eye anatomy model rather than a diagram? |

**Rule:** if a relationship is wrong, it must be fixed or the structure must be labelled "schematic — relationship approximate" in the UI. We will not hide it.

---

## 5. Content completeness — what is missing?

The current v1 covers ear + eye anatomy, four pathways, 26 diseases, and 12 cases. That is **not** "whole ENT + ophthalmology". Please list the highest-yield omissions, in priority order, for a 3rd-year medical student.

### ENT
- Sinonasal: allergic rhinitis, acute/chronic sinusitis, nasal polyps, epistaxis (partly covered), septal haematoma, foreign body.
- Pharynx/larynx: tonsillitis, quinsy, obstructive sleep apnoea, hoarseness, vocal cord palsy, stridor, airway emergency.
- Neck: lumps, thyroid, salivary glands, deep neck space infections.
- Otology: hearing tests (Rinne/Weber, audiometry), tympanometry, vestibular testing, facial nerve, ototoxicity, trauma, sudden SNHL.
- Paediatric ENT: glue ear, adenoids, croup, epiglottitis, foreign bodies.
- Imaging and histology correlations.

### Ophthalmology
- Strabismus, amblyopia, refractive errors, binocular vision.
- Ocular trauma, chemical injury, foreign body, hyphema, orbital fracture.
- Orbital disease: cellulitis, thyroid eye disease, tumours.
- Ocular surface: dry eye, pterygium, stye/chalazion, blepharitis.
- Retina: CRAO/CRVO, retinal tears, vitreous haemorrhage, retinopathy of prematurity.
- Uveitis: posterior, toxoplasmosis, sarcoid, TB, syphilis.
- Neuro-ophthalmology: pupil abnormalities, visual fields, diplopia, nystagmus.
- Paediatric ophthalmology and leukocoria.
- Oculoplastics and lacrimal disease.

### Cross-cutting
- History and examination skills (OSCE).
- Red flags and "when to refer".
- Normal variants and common artefacts.
- Drug doses and local guidelines.
- Imaging interpretation.
- Patient safety and infection control.

---

## 6. Commercial and legal review

These are not medical facts, but they can sink a paid product.

| ID | Question | Why it matters |
|---|---|---|
| L-01 | If we use BodyParts3D, Z-Anatomy, or other CC BY-SA assets, what are the share-alike obligations for a paid web app? Can we keep our own content proprietary? | Licence contamination risk. |
| L-02 | Is "reviewed by specialists" a defensible claim if the review is by AI plus a paid consultant? What wording is safe? | Advertising/consumer law. |
| L-03 | Does an educational anatomy app count as a medical device in India/EU/US? What claims would cross the line? | Regulatory classification. |
| L-04 | Can we cite textbook facts without reproducing figures? What is the safe citation practice? | Copyright. |
| L-05 | If we add user accounts, progress tracking, or uploaded images, what privacy/consent is needed? | Data protection. |
| L-06 | Do we need disclaimers on every page, or is a global terms page enough? | Liability. |
| L-07 | What accessibility standard should we target for a paid education product? | Market access. |

---

## 7. Acceptance criteria before calling it "sellable"

- [ ] Every anatomy and disease entry has a named source and a reviewer sign-off.
- [ ] Every numeric claim has two independent sources or one guideline.
- [ ] A named ENT consultant and ophthalmologist have reviewed their sections.
- [ ] 3D relationships have been reviewed; misleading ones are fixed or labelled.
- [ ] Every disease has red flags, emergency management, and referral criteria.
- [ ] No "100% accurate" or "diagnose/treat" marketing claim.
- [ ] A visible "Known limitations" page.
- [ ] Versioned content with an errata/changelog process.
- [ ] Automated checks: no empty required fields, no broken internal links, no orphaned structures.
- [ ] Golden screenshots for the 3D scenes to catch regressions.
- [ ] Usability testing with at least 5 medical students.
- [ ] Legal review of asset licences, citations, claims, and privacy.
- [ ] A support/contact route for reporting errors.

---

## 8. How disagreements will be resolved

1. **Primary source beats secondary source.** A named guideline, peer-reviewed paper, or standard textbook chapter wins over a website or an AI.
2. **Two independent sources for numbers.** If they disagree, show the range and a note.
3. **No averaging.** Do not split the difference between conflicting values.
4. **Human specialist tie-breaker.** For clinical management, a named consultant decides.
5. **Log every decision.** Add it to `accuracy/DECISIONS.md` with date, reviewer, source, and what changed.
6. **AI reviewers are never cited as sources.** They are reviewers, not evidence.
7. **If a claim cannot be verified, remove it or mark it "uncertain".** Do not ship it as fact.

---

## 9. Response template

Copy this into each reviewer's output:

```markdown
## Review of: [section]
Reviewer/model: [name]
Date:
Scope:

| ID | Verdict | Corrected wording | Source (author, title, edition, chapter/page or URL) | Confidence | Notes |
|---|---|---|---|---|---|
| E-01 | CORRECTED | ... | ... | HIGH | ... |

### High-yield omissions
- ...

### Statements that could cause harm if wrong
- ...

### Overall recommendation
- [ ] Safe for educational use with disclaimers
- [ ] Needs correction before use
- [ ] Do not publish
```

Verdict definitions:
- **CONFIRMED** — verified against a named source.
- **CORRECTED** — wrong or imprecise; corrected wording supplied.
- **UNVERIFIED** — could not verify; do not ship as fact.
- **DISPUTED** — reputable sources disagree; show the range.
- **DANGEROUS** — could cause harm; remove or rewrite before any release.

---

## 10. Sources we intend to check against

Use the current edition available to you; state the edition and chapter/page. Do not cite an edition you have not checked.

**Anatomy**
- Gray's Anatomy: The Anatomical Basis of Clinical Practice
- Netter's Atlas of Human Anatomy
- Terminologia Anatomica (2nd ed.)
- Thieme Atlas of Anatomy: Head, Neck, and Neuroanatomy

**ENT**
- Scott-Brown's Otorhinolaryngology, Head and Neck Surgery
- Cummings Otolaryngology
- Current AAO-HNS clinical practice guidelines (AOM, sudden hearing loss, BPPV, etc.)
- Local/national ENT guidelines where relevant

**Ophthalmology**
- Kanski's Clinical Ophthalmology
- American Academy of Ophthalmology (AAO) BCSC series
- NICE/AAO glaucoma and diabetic retinopathy guidance
- Local/national guidelines where relevant

**3D/anatomy assets**
- BodyParts3D / Anatomography (licence: CC BY-SA 2.1 Japan)
- Z-Anatomy (licence: CC BY-SA 4.0)
- Visible Human Project (public domain, reconstruction required)
- Any commercial licence must be reviewed before use

---

## 11. Current known limitations (be honest in the UI)

- The 3D models are **schematic**, built from primitives, not measured cadaver or scan data.
- Dimensions in the text are **teaching ranges**, not patient-specific measurements.
- Disease content is **undergraduate-level** and omits specialist nuance.
- Drug doses are examples; local guidelines and formulary must be checked.
- No content has yet been reviewed by a named human specialist.
- The app is **not** a diagnostic tool and must not be used for patient care.
- Some topics (sinonasal, larynx, neck, strabismus, trauma, paediatric ophthalmology) are not yet covered.

---

## 12. Where to send corrections

Save reviewed files as `accuracy/reviews/<reviewer>-<date>.md` and log decisions in `accuracy/DECISIONS.md`.

**Do not edit the app data directly from a review.** Corrections go through the decision log so we can audit what changed and why.
