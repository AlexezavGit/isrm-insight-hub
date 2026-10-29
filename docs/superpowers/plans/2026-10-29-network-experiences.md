# Separate application use from capability configuration

**Goal:** Make the two intentions explicit while retaining the graph, folder materials and existing proposal draft.

**User brief:** Search is an interactive prototype for discovering, reviewing, collecting and retaining expertise. The configurator selects proposed services/workflows for the application and the proposal. Show a full worked example for people unable to operate the interface on their first visit. Avoid mixing those intentions.

**Design:** Two named modes in the same workspace, with distinct purpose sentences, contextual legends and independent guided playback. Search, selected-only listing and full dossier remain on the graph. The group listing is an independent tray so inspecting a profile does not destroy search context. Compact coaching with Play/Pause/Back/Next/Take over; replay uses an ephemeral example and does not silently change saved selections or proposed scope. Supplied-record statuses and user follow-up marks remain distinct from verification conclusions. OSINT playback demonstrates processing of supplied data, explicitly not a connected investigation.

**Alternatives considered:** Colour-only differentiation retains the conceptual ambiguity. Entirely separate applications add navigation and state loss. Named modes with separate goals/guides retain continuity while explaining the different intentions. The mockup is a design study, not verified production behaviour.

## Tasks

- [x] Restore prior front-face folder material, restricting the darker accent to the upper lip. Logo returns to the interactive graph. Apply the requested scope hint consistently.
- [x] Connect Contrast to Canvas drawing and graph surfaces. Add explicit 2D rotation mode for two-finger scrolling, keeping pinch zoom and ordinary zoom available; support native rotation where exposed by Safari. ISRM stays fixed.
- [x] Add sourced mini-dossier statuses, full dossier overlay, explicitly labelled local OSINT process preview, and selected-only persistent group tray with follow-up flags and category-derived constellation. Preserve current filters/graph while inspecting profiles.
- [x] Separate prototype/configurator intent and navigation; prototype does not expose service layers as operational member features. Configurator retains service descriptions, preset selections, custom requirement frame and proposal output.
- [x] Add distinct end-to-end guided examples using only accessible supplied profiles. Keep demonstration selections ephemeral; take-over is an explicit user action. Empty samples must not invent people. Respect pause/exit and remove timers on unmount.
- [x] Run meaningful unit/regression tests, focused lint, production build, independent static review, and safe single-batch publication. Record actual visual testing limits.

## Constraints

British English and Ukrainian. No external AI query, email, new credentials or inferred human recommendation/compliance/AI verification. No pricing model changes. No private material in public clone. Existing supplied-data access rules remain intact. User authorises the stated corrections and a complete explanation of both workflows; routine implementation choices follow the established application.

## Review and evidence

The user selected four shared folder tabs: Briefing → Find expertise (Prototype) → Configurator (Choose capabilities) → Scope & budget. This implements the chosen separation in one workspace; the two generated images are design studies, not production screenshots.

Independent static review found six issues. Fixed: switching mode during a replay now captures the original view using resolveReplayExit (regression tests RED→GREEN); configuration choices are read-only during replay and adoption is explicit; mobile graph remains a full canvas beneath translucent overlays, with side-by-side coach/tray on short displays; original workflow expansion, exclusions, motion and connection-return state are restored; saved snapshots restore follow-up marks; mobile expansion has an accessible label.

Additional checks: replay filters do not persist, configurator filters do not overwrite the prototype's saved search, real requirement editing exits replay first, and coach surfaces are portalled to the workspace to avoid the footer blur changing their fixed-position reference. Header, controls and footer heights are measured instead of assumed. Canvas text is truncated rather than squeezed horizontally.

Verification: 58 unit/regression tests pass. Focused ESLint has no errors (three existing Fast Refresh warnings in filters.tsx). Production build passes. Changed modules have no TypeScript errors; pre-existing errors remain in legacy PartnerGraph/PartnerProposal/finance/test code. Four local routes return HTTP 200 and exactly four journey tabs: graph, configurator, briefing and scope. Browser runtime is unavailable, so no live visual/gesture sign-off is claimed. Native Safari trackpad rotation requires manual browser verification; the explicit wheel-rotation mode preserves ctrl/pinch zoom.

No financial model, supplied person data, server access rules, actual AI integration or message dispatch was changed.
