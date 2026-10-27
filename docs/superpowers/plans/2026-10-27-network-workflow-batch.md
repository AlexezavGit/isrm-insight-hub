# Network exploration and scope batch

User specification: conversation of 27 October 2026, last complete /graf and /scope requirements. Continue inline; accumulate changes locally and in Git, no individual Cloudflare uploads.

## Tasks
- [ ] One persistent graph: ISRM anchor, people, organisations only from accessible supplied fields, services and workflow concentrators. Separate graph emphasis from panel visibility. Do not infer acquaintance, endorsement, compliance or AI verification from categorical links.
- [ ] Two bottom tabs Search / Workflows. Briefing / scope contextual arrows in dashboard. Full-width legend, demonstration and bounded data notice. Common header utilities, no login on briefing.
- [ ] Translucent light panels leave a mobile graph gutter. First node selection highlights, repeated selection opens detail. Four workflow folders: core, engagement, expertise, own development. Services connect graph and dossier. Explicit exclusion confirmation only changes demo configuration, never claims live operations.
- [ ] Existing survey draft view, mailing-list request saved in scope, custom service/workflow text uses shared draft and exports.
- [ ] Scope fallback inside receipt; default budget preference Approve only on new drafts; retain invalidation after scope changes. Three compact actions Send / PDF / Rewind. Clarify workflow, integration two-line label, common eyebrow. Briefing rewind and context in body, notices on graph.
- [ ] Internal pricing reconciliation and SaaS scenario saved separately; no invented conversion evidence or claimed break-even. Public source branch must exclude internal partner estimates.
- [ ] Build, graph model and draft tests, browser review desktop/mobile, local commits and safe public Git sync. One final deployment only after accumulated verification.

## Verification focus
No synthetic personal edges; no orphan links after filtering; retained people positions; empty/service selection; unknown data fields visibly unavailable; native keyboard controls; outside-tap mobile area; same custom request in scope, Markdown/PDF/email; existing budget preferences preserved.

## Decisions
- The last two-tab instruction supersedes the earlier three-tab instruction.
- Existing personal data access restrictions remain. Organisation/city/verification fields are never invented.
- Removal warnings describe proposed capabilities, not revoked live invitations or messages.
- 35,714 is a funnel arithmetic scenario, not established economic break-even. Costs, churn and retention remain unknown.

## Implementation status
- Code implemented and stored locally, commits 789c231, 4fa838c and subsequent motion fix.
- Graph model/draft suite: 27 passing; build passes; changed-module TypeScript and focused lint pass. Global tsc still has pre-existing PartnerGraph/PartnerProposal/partner-finance errors.
- Fresh static reviewer found two issues: service first-click/detail/exclusion sequencing and excluded coverage restored by alternate workflow entry. Both corrected; exclusion regression test passed after failing first.
- Desktop/mobile browser and end-to-end UI checks pending: local Mac locked; browser extension cannot access the originating session.
- Public source candidate prepared at /tmp/isrm-public-network-sync, branch codex/network-workflow-batch, commit 1049d63; no internal partner documents included. Push automatically rejected: public source snapshot may include client-derived material without sufficiently specific public-destination authorization. Do not retry through a workaround.
- No new Cloudflare upload made.
- UI decisions: last two-tab instruction wins; unsupported city/recommendation/AI/compliance data not inferred; disabling demo capabilities never claims live invitations/messages cancelled; existing draft budget decisions retained, Approve default only for new draft.

## Refinement and verification · 27 October
This status supersedes the earlier browser/public-sync limitations above.

- Static service wheel with deterministic, separate people cohorts; no camera movement on inspection. Explicit concentrator choices move the camera. Shapes and colours distinguish node types; labels appear on hover/inspection.
- Full-height translucent panels sit beneath blurred header/footer surfaces. Desktop search switches remain visible. Workflow tree opens a services-only wheel; selecting a workflow/service surfaces potential coverage and opens its description.
- Descriptions include intended users/results, dependencies and proposed technology. Member survey has five opening questions and the unchanged source draft. Preview does not collect responses or send invitations.
- Survey inclusion is idempotent and restores an unchecked request. Fallback retains custom requests explicitly for separate discussion, outside its selected scope/price, across email/Markdown/print sources.
- Compact plain Fallback options with two checkboxes and individual-search footnote. Each selected workflow, integration interest and custom description has its own proposal-receipt line. Workflow definition precedes core. Existing draft preferences retained; new drafts default to Approve.
- All graph panels have an explicit close-all/graph action; custom-description entry is visible above the workflow tree. Final briefing has three equal-width 52px actions, including Back to start; scope actions share this height.
- Browser verified: desktop tree/core/service details; survey → scope → fallback retains survey outside £10,080 price; 390px portrait has no horizontal overflow and leaves a 72px outside-tap gutter; close-all leaves zero panels; final briefing actions measured equal width/height and Back to start returns to slide one. Enlarged-text slide-three cards do not overlap or cross the footer after layout correction.
- Browser has prefers-reduced-motion enabled, so animation was checked in source/computed styles, not visually observed playing. It respects that preference. Desktop/mobile proof images are in docs/review and are not copied into the public branch.
- 31 focused/model/draft tests pass. Focused lint and production build pass. Global TypeScript still reports pre-existing PartnerGraph, PartnerProposal, network-access.test and partner-finance errors; no changed-module errors in the recorded check.
- Fresh read-only review found no remaining blockers after three request/visibility-state fixes. Browser review subsequently caught and fixed sticky panel headers intercepting folder clicks and the older compact-cycle CSS overriding row sizes.
- Public branch codex/network-workflow-batch was subsequently explicitly authorised by the user and pushed at 38d6536. Current refinement will be synced as source only; private partner calculations/history and these review images are excluded. No new Cloudflare upload in this batch.

## Shortlist, dossier navigation and live graph · next refinement
User authorised continuation inline, including the subsequent request to preserve an initially live, draggable graph and return to the last structured view after a search choice.

- [x] Open shortlist from the dashboard counter and a dossier context link; use the same browser-local draft for group name, membership and exports. A shortlist panel stays left, with person/service details on the right. Unavailable record codes remain visible without inventing profiles.
- [x] Dossiers use ClientHeader and the lock/unlock icon. Contact fields have explicit light surfaces and dark ink. Directory, shortlist and Explore connections are contextual routes, including a mobile two-row arrangement.
- [x] Workflow tree uses light text actions and plus/minus disclosure. Workflow overview stays inside the tree. Concrete person/service details alone open the right panel. Remove Centre this service; node inspection actions are compact and underline on hover.
- [x] networkNeighborhood follows two recorded steps. Person/category paths use category edges, not universal sample or proposed-service edges. Capability paths use proposed coverage/architecture and honour service exclusions. layoutNetwork centres the chosen node at zero and arranges distance-one and distance-two rings. Three behavioural tests failed first, then passed, including separation of review status from network role.
- [x] Initial live view enables dragging and force layout; search/layer choices enter structured mode. The Live graph control preserves/restores anchor, mode and active service selections together. Reduced motion suppresses automatic simulation and entrance motion while preserving user-driven drag.
- [x] Browser checks: empty shortlist, add profile, rename group, reopen profile, full dossier, context route back to shortlist, and person-centred graph. Source role/review/engagement fields remain separate. Service description opens on the right; workflow does not; Centre this service is absent. Service → Live → structured regression was reproduced before fix and passed afterwards.
- [x] Mobile 390×844: document width390, panel width318, 72px exposed graph gutter; dossier context links stay inside the viewport. Contact input/textarea measured rgb(24,51,66) text on rgb(250,246,237) backgrounds.
- [ ] Manual native drag gesture verification is blocked by the Mac being locked. Browser-extension DOM/screenshot checks remain available. Drag uses the installed force-graph API; no claim of a completed physical gesture test.
- [x] Consulted the supplied member survey, website audit DOCX and pricing/model documents in the copilot repo. The audit supports clearer membership routes and knowledge/resource organisation. Historical architecture/pricing documents explicitly disclaim current approval; no client prices changed and no partner documents enter the public source branch.
- [x] Final verification: 34 tests and production build pass; focused ESLint is clean. Changed modules have no TypeScript errors. Global tsc retains the recorded pre-existing PartnerGraph/PartnerProposal/network-access.test/partner-finance failures.
- [x] Fresh read-only review found two live-mode regressions (restoring only anchor, and automatic simulation under reduced motion). Both fixed and targeted re-review reports no remaining blockers. Browser confirmed service → Live → service restores both mode and anchor.
- [x] Public source-only commit d1b86cc pushed to codex/network-workflow-batch. Internal documents and review images excluded. Local preview restarted independently on port5174; no Cloudflare upload.

### Panel headings share the dashboard row

- [x] Move Briefing / metrics / Scope into the central dashboard group. Place left/right panel names and close-all graph actions in the side slots; remove all five separate white panel header blocks.
- [x] Keep full-height translucent panels underneath the header surfaces. Content padding follows measured dashboard height; mobile uses a compact title row and retains the exposed graph gutter.
- [x] Browser verified shortlist, workflow tree and service description; 390×844 has document width390, and Ukrainian labels fit the central dashboard at1100px. Desktop two-panel proof saved privately in docs/review/panel-dashboard-headings-2026-10-27.jpg.
- [x] Production build and focused ESLint pass. No new dependencies or price changes; no Cloudflare upload.
