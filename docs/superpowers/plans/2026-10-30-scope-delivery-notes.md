# Scope delivery notes implementation plan

**Goal:** Apply the useful content of the five reviewed blocks without adding unsupported figures or contractual commitments.

**Approved basis:** User's instruction to take what is useful, following review of current workload, scope boundaries, changes, budget control and acceptance/warranty.

**Architecture:** One bilingual content source feeds a collapsed note below the receipt action and the existing email, Markdown and print summaries. Prices, payment fractions, selections and draft schema remain unchanged. Detailed architect questions are an internal addendum.

**Files:** `src/lib/scope-delivery-notes.ts`, `src/components/ScopeDeliveryNotes.tsx`, `src/routes/scope.tsx`, `src/lib/client-draft.ts`, `src/lib/scope-document.ts`, `src/lib/client-draft.test.ts`, `src/styles.css`, `docs/developer-review/ISRM_Delivery_Boundaries_Addendum_EN.md`.

## Constraints and review focus

- British English and Ukrainian, with the same content in every export.
- No assumed savings, conversion, new hours caps, prices, warranty period or response-time promises.
- Proposed conditions are discussion material, not accepted terms or an order.
- No blanket exclusion of capabilities actually selected; only the later agreed specification defines inclusion.
- Keep acceptance distinct from warranty and retain the three existing core delivery/payment stages.
- Extra scope needs agreement; a defect against agreed requirements is a distinct issue.
- Full, fallback and research-only routes retain their current totals and selections.
- Collapsed notes must not introduce another large section or reduce receipt readability.

## Tasks

- [ ] Add five bilingual notes and render them in one collapsed receipt disclosure.
- [ ] Include the same notes in the common summary and recognise their section in Markdown/print.
- [ ] Verify section identity and email/Markdown/print retention in both languages and all three routes; retain existing pricing checks.
- [ ] Add architect-facing questions on baselines, scope, changes, budget control, acceptance and warranty.
- [ ] Run tests, focused lint, build and diff checks, commit private work and publish only public source changes via the established deployment branch.

No additional approval round is needed: the reviewed direction and implementation are already authorised by the user.
