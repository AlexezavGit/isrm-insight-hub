# Vertical inspection dock and Board decision context

**Goal:** Keep the graph usable while reviewing selected experts, repair the requirement submission experience and make the existing six-slide briefing useful to Dr David Rubens and the Strategic Board.

**Design:** Replace the horizontal shortlist with a vertical right-hand dock. The profile sits at the outside edge; the list opens beside it. Each panel has a keyboard/pointer width separator on wide screens. Widths are bounded so a graph working area remains. On smaller screens one dock tab is visible at a time, with a strip of graph exposed. Widening a dossier shows its full fields; widening the list shows editable, browser-local notes. No unimplemented operational action is presented as working.

**Alternatives:** Keeping a bottom tray retains the reported obstruction. Floating windows add overlap and window management. Adjacent bounded panels follow the user's editor analogy while keeping navigation and stored selections intact. A full IDE layout is unnecessary. Routine implementation choices follow the user's existing instruction to continue without repeated approval.

**Architecture:** Keep the graph and canonical draft in NetworkWorkbench. A small NetworkInspectionDock owns widths and mobile tab selection; NetworkShortlist owns notes/snapshots/export. Pure layout helpers enforce bounds and are independently tested. The six-slide narrative and a compact scope note share a short Board decision brief; prices and payment fractions remain unchanged.

**Constraints:** British English/Ukrainian; accessible supplied data only; no invented recommendations, external OSINT, automatic sanctions decisions or legal guarantees; no financial workbook/site-price changes. Private plans are not published. Browser automation is currently unavailable; document this testing limit.

## Tasks

- [x] Add regression tests for minimum graph space, paired panels, narrow windows and bounded dragging. Implement layout helper and resizable dock.
- [x] Move dossier/shortlist into the dock; independent close actions, mobile tabs, full dossier on widening, selected-only group, local notes preserved in snapshots/Markdown. Keep replay selections ephemeral.
- [x] Diagnose Describe what you need: existing onClick opens a real composer, but Save is silently disabled until three fields are entered. Replace silent disabled validation with visible required-field feedback, explicit Save button, persistent footer, success and draft-storage errors.
- [x] Address Board context within six slides; name recipient, pilot decision/measures, named data/review responsibilities and functional acceptance in scope and exports. Preserve delivery stages and prices.
- [x] Run regression suite, focused lint and production build; inspect changes, publish only approved source in one batch and verify exact release.

## Verification

63 unit/regression tests pass; focused ESLint reports no errors or warnings; production build passes. Layout tests exercise paired panels, resizing/window shrink, graph working-space bounds, compact graph-strip policy and selected-only note export. Required-field validation was exercised RED→GREEN. Static review corrected close/resizer stacking, same-profile reinspection, configurator control bounds and compact search/list overlap. The browser runtime remains unavailable, so actual drag/touch and live visual verification are not claimed. Existing TypeScript errors remain in legacy PartnerGraph/PartnerProposal/finance code; changed modules have no reported errors.

Published source ca4732d2bfc0291f2a97932845b3dc98b06ec687 via GitHub Actions 40867175141 (success). Independent release checker confirms the exact production commit. All four production routes return HTTP 200 and four shared tabs; recipient appears in briefing/scope and the Board decision note appears in scope. No private plan/audit or pricing workbook was published.
