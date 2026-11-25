# Accuracy workflow

This folder is the audit trail for SENSE Atlas. It exists so we never have to say “trust us”.

## Files

- `claims.csv` — tracked high-risk claims and their review status.
- `DECISIONS.md` — every change, with reason, source, reviewer, and date.
- `REVIEWS.md` — the five internal review passes, findings, fixes and open items.
- `SECOND_OPINION.md` — what to send to Claude, Gemini, ChatGPT and human reviewers, in order.
- `reviews/` — raw reviewer outputs, saved as `<reviewer>-<YYYY-MM-DD>.md`.

## Workflow

1. **Pick one section** of `REVIEW_REQUEST.md` (do not send the whole document at once).
2. **Send it independently** to each reviewer (Claude, Gemini, ChatGPT, or a human specialist).
3. **Do not show reviewers each other's answers** until all have responded.
4. **Save each response** in `reviews/` with the reviewer name and date.
5. **Reconcile** using the rules in Section 8 of `REVIEW_REQUEST.md`.
6. **Log the decision** in `DECISIONS.md`.
7. **Update the data** only after the decision is logged.
8. **Re-run the app checks** (build, typecheck, internal-link check) after data changes.

## Independence rules

- An AI reviewer is **not** a source. Never cite “Claude says” or “Gemini says” in the app.
- If three models agree but none cites a source, the claim is still **UNVERIFIED**.
- If a model cites a source, check that the source exists and actually says it. Models can invent page numbers.
- A named human specialist signs off clinical management. No exceptions for a paid product.

## Naming convention

```
reviews/
  claude-2026-11-25-ear-anatomy.md
  gemini-2026-11-25-ear-anatomy.md
  chatgpt-2026-11-25-ear-anatomy.md
  dr-sharma-2026-12-02-ear-anatomy.md
```

## Definition of done for a claim

- [ ] Named source with edition/chapter/page or guideline year.
- [ ] Second independent source for numeric claims.
- [ ] Named human reviewer sign-off.
- [ ] Decision logged.
- [ ] App data updated.
- [ ] Regression check passed.
