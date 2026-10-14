---
goal: Reproduce the partner and client journey in the ISRM prototype with a 5-use shared password, a Google-Drive response form, and conservative indicative estimates
version: 2.0
date_created: 2026-10-06
last_updated: 2026-10-06
owner: ISRM product owner
status: "Draft for review"
tags: [feature, partner, client, auth, indicative, gates, plan]
---

# ISRM — Partner & Client paths v2

Reproduces the intended partner and client journey end-to-end. Replaces the previous strict-no-auth-and-no-mail posture with a demo-friendly shared password and a one-time response form. Replaces the no-TBD / no-fabricate discipline with a conservative-indicative discipline: every number has a source, a method, a generally-recognised date, and a deliberately conservative deviation, so decision-makers can act on it.

## 0. The decision formula and the main arrow

The product owner's decision formula: one **key idea** → a small set of **confirming arguments** that the user can verify by themselves on the application. Every page, every section, every CTA follows this shape. The discipline is: don't overdo it; the key idea earns attention, the confirming arguments earn trust.

**Key idea.** The application operates in a moment when people trust AI more than they trust humans. If experts are equipped with the application, the application can make expert attribution visible again and pull trust back from the AI-alone default.

**Confirming arguments.** Inside the application, the user can see for themselves how services and experts depend on each other; how value is produced by that dependency; how the capacity cycle (member contributions + expertise + discussions + publications + conferences = participation) sustains a planning loop that builds expertise and capacity over time; and how a trust-and-influence signal can be layered on top of that loop once the loop has stabilised.

**Main arrow.** The most convincing single argument for the client is therefore not TII; it is the visible dependency between application services and the client's target audience of experts, with a traceable self-amplifying capacity that grows as experts concentrate around events, discussions and publications inside the application cycle. TII is a later layer; it is a "favor for industry partners", developed in a second pass and activated at a defined coverage/measurement gate, not in the first round.

This shapes the priorities of every section that follows. The client proposal leads with the brief; the dependencies, the capacity formula and the value-revelation panel come next; the four packages come after; the cycle and the conservative indicative prices come after that; TII is mentioned only as a future capability, with a single sentence that names the gate condition. Nothing is oversold.

**Two journeys, opposite orders.** The client journey reads forward (brief → dependencies → capacity → packages → prices → gates). The partner journey reads **backward**: 1) financial file with numbers, proof and calculation, to grab interest; 2) description with the arguments that make the work possible and value-creating; 3) the application / product mockup as the concrete proposition; 4) the client approves, and only then does the partner commit the agreed resources and responsibility. The current partner route reads forward like the client route; it must be re-sequenced to the partner's actual decision order. The current count of partners in the active proposal is three (the three role definitions in `src/lib/proposal-data.ts`).

**Client journey step 3 — descriptions and facts.** The third step in the client journey is the section where the pilot project is described: the engagement of veterans, regional representatives, sectoral experts and other cohorts; the introduction of new communication channels with the help of technology and AI; and the working-group outputs, publications and capacity-cycle evidence. This is the section that turns the abstract brief into a concrete plan.

## 1. Two journeys, one surface

The application exposes two separate paths with no navigation link between them. The partner path may read the client-safe description and the client-safe calculation as embedded panels, so partners review what clients see without leaving their own journey. The client path contains no partner-only fields, no partner names, no partner rate inputs, and no link to the partner route.

| Path | Entry | Description | Calculation | Workspace |
|------|-------|-------------|-------------|-----------|
| Partner | `/partner` (5-use password gate) | Partner description, role boundaries, governance, partner inputs, fee defaults | Partner calculation with editable conservative indicative defaults | Service graph + dependency view + value-unlocks + draft save |
| Client | `/proposal` (public) | Client-safe description of the four packages and the embedded expert cycle | Client-safe calculation (aggregated only) | Configurator with the dependency view as the same graph state |

## 2. Trust & Influence Index (TII) — second pass, not first

TII is the proposed expert index/profile. It is built from attributed expert contributions: publications, projects, discussions, citations, working-group outputs, evidence records, and other traceable signals. It is not a validated score, not an automated ranking, and not a novelty claim. The TII label is the only label used in active UI, proposal data, the project description and the plan. Historical references to the prior acronym are documented in `plan/feature-isrm-partner-configurator-v1.md` § 9.7 and remain unchanged.

TII is positioned as a "favor for industry partners" — a long-term, sector-wide capability that benefits from a stabilised planning cycle. The product owner has confirmed TII is developed in a second pass, not in the first. The first round ships: the brief, the dependency view, the capacity formula, the four packages, the cohort-2 gate, the partner password gate, the conservative indicative defaults and the gates timeline. TII is mentioned in the client proposal as a single sentence that names the gate condition: TII is developed when pilot coverage and the capacity-cycle measurements reach a defined level; until then it is a future capability, not a current one. The decision formula (key idea → confirming arguments) demands that TII not be over-sold in the first round.

## 3. Five-use shared password for the partner route

The partner route at `/partner` is gated by a shared password plus a five-use counter. Each successful access decrements the counter. After five uses the route locks and shows a re-arm request, not a generic error. The gate is browser-local state, not server authentication. It is good enough to prevent accidental external sharing and to make the partner route clearly different from the public client route.

- Password value: a single shared string supplied by the product owner; the demo ships with `isrm-partner-2026` as the placeholder; the value is overridable in the partner-route password prompt.
- Counter: starts at five, decrements on each successful access, persists in `localStorage` under `isrm-partner-counter-v1`.
- Re-arm: the product owner can re-arm by clicking a small `Re-arm gate` control visible only after the lock; the counter resets to five and logs the re-arm with a timestamp in the partner draft.
- Disclosure: the lock screen and the partner header both state that the gate is not server authentication and that the route is local-only.
- Accessibility: the password prompt is keyboard-accessible; the remaining-uses count is announced to screen readers; the lock state is text-equivalent and shape-coded, not colour-only.

## 4. Four sequential priced packages, with one embedded expert cycle

The client proposal and the partner calculation present the same four packages in the same order. Only the third package contains the expert-engagement cycle. The cycle is not a fifth package and is not a separate ring; it sits inside the pilot-function ring and is the only ring that is a cycle.

| # | Package | Purpose | Cycle? |
|---|---------|---------|--------|
| 01 | Consulting | Define priorities, expertise gaps, board decisions | No |
| 02 | Application MVP | Standalone useful MVP; expert search, project groups, evidence review | No |
| 03 | Pilot functions | Selected functions for the pilot, with the embedded expert cycle | **Yes** |
| 04 | Remaining / additional | Public-product continuation and other selected scope | No |

All client-facing prices are `INDICATIVE · pending preliminary scope and budget-ceiling approval`. The first payment is at least 30% of the agreed total and is due on delivery/acceptance of each package. No invented installment splits; no fixed-quote framing.

## 5. Conservative indicative estimates — discipline, not invention

Every number in the proposal, the partner calculation, the plan and the project description carries five pieces of metadata: a quantity, a value, a unit/currency, a period, and a status. The status is one of: `verified`, `assumption · conservative indicative`, `assumption · historical/inactive`, `disputed`, `forbidden`. A blank input is treated as `awaiting measurement`, never as zero, and the calculation explicitly marks which totals are blocked.

Conservative indicative means the estimate is on the worse side of the band for the side that is offering the service, so the proposer leaves room for negotiation. Conservative indicative is justified by:

- An argument or general method (e.g., "WBS hours × partner rate"),
- An analogue or comparable (e.g., "Clutch UA directory band 2024"),
- A reference or named method (e.g., "NASA SWE-015 cost estimation, WBS § 7.05"),
- A generally-recognised date (e.g., "2024-Q3 published bands"),
- A deliberate deviation (e.g., "low end of the band, leaving room for risk and negotiations").

Defaults are pre-filled for each partner role and each costing line. The defaults are conservative indicative: the low end of the publicly cited band, the bottom of the recorded scenario, the nearer side of the optimistic interval. Partners and the product owner can override any value; the override is recorded with a timestamp and a reason field; the source of the default remains visible next to the input.

## 6. Partner inputs as conservative indicative defaults

Three partner roles are pre-filled with conservative indicative rates. The defaults are stored in `src/lib/proposal-data.ts` as a single object and exposed through the existing partner-rate grid. The product owner and each partner can override the default; the override is recorded, the default remains visible.

| Role | Default rate (USD/hour, conservative) | Source | Date | Justification |
|------|----------------------------------------|--------|------|---------------|
| Software delivery | 25 | Clutch UA software-development directory, low end | 2024-Q3 | Low end of $25–$49/provider-hour band; conservative for a UA-based team |
| Product ownership | 25 | Clutch UA product-consulting directory, low end | 2024-Q3 | Low end of consulting band; conservative; ref NASA SWE-015 cost estimation |
| Operations / OSINT | 25 | Clutch UA research-operations directory, low end | 2024-Q3 | Low end of operations band; conservative; leaves room for human-review overhead |
| Client communications | 25 | Clutch UA client-success directory, low end | 2024-Q3 | Low end; conservative; separate from the three product roles |

All four defaults are explicit, sourced, dated, and conservative. All four are editable. None of them is an agreed partner rate. The partner calculation page shows the source and the date next to every input.

## 7. Cohort 2 of the pilot — board gate with a fixed measurement formula

Cohort 1 is the existing engaged members from the CRM (current 178-record snapshot). Cohort 2 is formed during the pilot through the LinkedIn group as the communications channel. Cohort 2 cannot be invented, named, or estimated by implementation. The board/client must explicitly approve scope, controller, purpose, channel, cohort, notice, processing and retention before any expert is contacted or any survey is launched.

The conversion formula is fixed and visible in the cohort-2 card, with all four input slots explicitly empty until the pilot records the actual measurements:

`measured unique reach × (volunteer applications ÷ measured unique reach) × (accepted new members ÷ volunteer applications) × (paid ÷ accepted members shown the specific offer)`.

No number is a forecast. The empty slots are an explicit no-data state, not a placeholder for a guessed value.

## 8. Google-Drive response form, no backend mail

The survey preview and the partner order confirmation are not sent through a custom backend mail service. Each is an embedded Google Form in an iframe. The form is owned by the product owner; responses land in the product owner's Google Drive; the partner never sees a "sent" indicator (per the existing no-submission-claim discipline). The iframe is keyboard-accessible, has a text-equivalent label, and falls back to a static link to the form when the iframe is blocked.

## 9. Gates at specific data-verification moments

Gates are not continuous blockades. Each gate activates at a specific moment and unlocks when the relevant data is recorded or the relevant decision is made. The implementation exposes a small "Gates" panel in the partner header that lists each gate, its current state, and the action required to open it.

| Gate | Activates when | Opens when |
|------|----------------|------------|
| G-A Partner fee source | Partner calculation page is opened for the first time | A partner supplies an agreed rate value with a reason; the default remains visible |
| G-B Cohort 2 | Cohort 2 card is rendered | Board/client records an explicit approval (scope, controller, purpose, channel, cohort, notice, retention) |
| G-C Partner route exposure | Partner route is requested without the password | The product owner supplies a password and confirms the demo scope |
| G-D Survey launch | Survey preview is opened | Board/client approval is recorded and the launch channel is selected |
| G-E Indicative framing | Client proposal is opened | The product owner records the preliminary budget ceiling and scope boundary |

## 10. Value-revelation through dependencies

The dependency view in the client proposal and in the partner workspace is the central place where the application reveals capabilities that were never accessible without it. Each visible dependency edge exposes a panel of value-unlocks: cross-sell, over-sell, member capacity expansion, network expertise accumulation, free current publications, publicity development, and the like. The panel is prominent, not a sidebar; the heading states explicitly that the value is revealed through the dependency; each unlock is a downstream opportunity, not a guaranteed commercial outcome.

The implementation lives in `src/routes/proposal.tsx` and in the partner workspace overlay in `src/components/PartnerProposal.tsx`. Both surfaces use the same value-unlock vocabulary. The dependency view is a single graph state, not a separate page, per REQ-007 in the new brief.

## 10a. Two surfaces, one state: the visual graph and the financial-file table

The product owner's two UX variants are not either-or. Both are first-class surfaces that share the same configuration state. The visual graph (Variant 1) is the primary discovery interface; the financial-file table (Variant 2) is the text-equivalent, the mobile fallback, the accessibility surface, and the partner journey's first step (financial file with numbers, proof and calculation → grab interest). The two surfaces toggle via a small "View as graph / View as table" control that does not lose state.

**Variant 1 — Visual graph (primary).** Concentric rings on a dark canvas: optional consulting at the centre; the application MVP ring; the pilot-function ring (the only ring that is a cycle); the outer ring with all remaining/additional services. The current `PartnerGraph` already carries these node kinds (`consultation`, `mvp`, `pilot`, `later`, `hub`, `candidate`); the rings are realised via `radialLayout` (already implemented in `src/components/PartnerGraph.tsx`). The visual graph is what the client sees when they open the dependency view from the client proposal.

**Variant 2 — Financial-file table (text-equivalent).** A column-based table that mirrors the graph state: rows are services; columns are status (ring), pilot membership, expert reach (when permitted data exists), conservative indicative price (when source available), formula, source, period. Each row links to the service description and to the application page where the user can search; the chain ends at the price proposal; the user returns to confirm an hourly rate. This table is what the partner sees first when they open `/partner` (reversed journey), and what the client sees on the mobile-fallback view of the dependency page.

The "View as graph / View as table" toggle is implemented once and reused across `/proposal`, `/partner` and the partner workspace overlay. State sync is automatic. No number is invented; the table shows "awaiting source" / "awaiting measurement" wherever the corresponding graph node has no permitted data.

## 11. Visual direction across all surfaces

## 11. Visual direction across all surfaces

The redesign is not limited to the client proposal. The current implementation only remotely resembles what the prototype should be, and the graph screen in particular will need a thorough refactor when we get to it. The product owner's reference points are: the dark-theme first page with shadow-and-surface-lighting, hanging/floating surfaces, "pressed-in" header frames with high contrast, clearly clickable buttons placed where the eye expects them (top, bottom, beside mini-thumbnails), and a tight layout that does not waste vertical space. The redesigned language is also deliberately brief: no marketing phrasing, no urbanistic adjectives, only substance.

- **Hanging surfaces.** Surfaces look like they float slightly above the page, with a soft shadow underneath and a subtle highlight on the top edge. Implemented via `box-shadow: 0 8px 24px rgba(40, 30, 15, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.4);` on cards, with a slightly darker surface tint so the contrast against the page background is unmistakable.
- **Pressed-in header frames.** Section headers sit in a 1–2 px inset border with a subtle inner shadow, like the title is pressed into the surface. Headers carry increased contrast against the surface; the surrounding border is high-contrast against the page background.
- **Clickable buttons.** Buttons have an explicit clickable surface (raised state with shadow, pressed state with inset shadow, focus state with a visible focus ring). No flat text-only links. CTAs are placed at top, bottom, and beside the relevant content; never floating in the middle of a section without context.
- **Mini-thumbnails instead of long text.** Where a feature is currently described in three or more sentences, the redesign replaces that text with a small interface thumbnail (1 + 3 = four small renderings: one primary at the top, three smaller in a row, each linking to the full project description). This closes the long text narrative and keeps the client reading downward.
- **Tight layout.** Vertical rhythm is 4 px or 8 px multiples; no large empty bands; no oversized section titles. Headers are uppercase, monospaced labels; body text is sentence case.
- **Capacity formula card.** A dedicated compact card on the client proposal shows the capacity cycle: `capacity = member contributions + expertise + discussions + publications + conferences = participation`, and underneath it the planning loop visual: `planning expertise & capacity development → trend formation → TII layering (gate-conditioned)`.

## 11a. Vocabulary and structural alignment with the ISRM website

The ISRM (Institute of Strategic Risk Management, UK, https://www.theisrm.org/) is a real international professional body with chapters across continents. The current prototype is the Ukraine Chapter within this global network, not a standalone product. The vocabulary and structure of the global site can be picked up, applied selectively, and integrated without copying FEEL/Bunker semantics or WordPress stack.

**Vocabulary to integrate**:
- "Chapters" for regional/national cells (Ukraine Chapter, North America HUB, ASEAN HUB, etc.) — replaces the loose "members" terminology where it makes sense.
- "Hubs" for regional clusters that group several chapters.
- "Member directory" (not "expert directory") as the primary directory.
- "Members" as the primary unit; "experts" is reserved for the focused expert layer.
- "Strategic Risk Management" as the field — used in the global narrative; the Ukraine chapter can keep its own focus (recovery, civic resilience, security reform, anti-corruption) while the global framing still anchors it.
- "International Chapters" as the global network name.

**Structural alignment**:
- `PartnerGraph` node kinds: add "chapter" and "hub" alongside the existing "candidate", "consultation", "mvp", "pilot", "later". A "hub" is a regional cluster (Ukraine HUB, EU HUB, North America HUB); a "chapter" is a country-level cell.
- `MemberCabinet`: rename "Expert directory" → "Member directory" with chapter affiliation, role, sector and geography fields.
- `NetworkSnapshot` panel (left column): rename "Visible experts" → "Chapters & members"; replace "Sectors" filter with a chapter/hub/sector stack; add a territories filter.
- Bottom navigation already reads "1·Search · 2·Configure · 3·Proposal & price" — keep, optionally add "4·Chapters".
- Ukraine Chapter (50.46°N, 30.53°E, Kyiv) is already represented in the ISRM global chapter map; the prototype can mirror that geographic anchor.

**What not to copy**: the WordPress/Elementor stack, the MemberPress membership platform, the "Strategic Risk Management" brand as a hard constraint. Those are global-site specifics; the prototype picks up the vocabulary and the chapter structure, not the platform.

## 12. Phased implementation

| Phase | Goal | Files | Status |
|-------|------|-------|--------|
| 0 | Confirm terminology and surface the plan v2 to the product owner | `plan/feature-isrm-partner-client-paths-v2.md` | ✅ created 2026-10-06 |
| 1 | TLI → TII rename across active code and the project description | `src/lib/i18n.tsx`, `src/lib/proposal-data.ts`, `src/lib/client-proposal-data.ts`, `src/components/PartnerProposal.tsx`, `src/routes/proposal.tsx`, `src/routes/index.tsx`, `src/routes/experts.$code.tsx`, `public/ISRM_Project_Description.md`, `plan/feature-isrm-partner-configurator-v1.md` | ✅ done 2026-10-06 |
| 2 | Partner-route exposure notice in the partner header and on `/coordinator` | `src/components/PartnerProposal.tsx`, `src/styles.css` (`.partner-route-notice`) | ✅ done 2026-10-06 |
| 3 | Header change to "Four sequential packages" with embedded-cycle note; cohort-2 card with the fixed formula and four empty input slots | `src/routes/proposal.tsx`, `src/styles.css` (`.client-cohort2-card`), `public/ISRM_Project_Description.md` § 6.1 | ✅ done 2026-10-06 |
| 4 | Value-revelation banner and value-unlocks section in the client proposal; the same vocabulary mirrored in the partner overlay | `src/routes/proposal.tsx`, `src/styles.css` (`.partner-value-unlocks`, `.partner-value-revelation-banner`) | ✅ done 2026-10-06 |
| 5 | Print/PDF experience via `window.print()` and `@media print`; no fake Send control | `src/routes/proposal.tsx`, `src/styles.css` (`@media print`) | ✅ done 2026-10-06 |
| 5a | Capacity formula card on the client proposal; capacity = member contributions + expertise + discussions + publications + conferences = participation; planning-loop + trend-formation + TII-layering diagram | `src/routes/proposal.tsx`, `src/styles.css` (`.partner-capacity-card`) | ⏳ next |
| 5b | Visual redesign pass: hanging surfaces, pressed-in header frames, clickable buttons, tight layout, mini-thumbnails replacing long text | `src/components/AppShell.tsx`, `src/routes/proposal.tsx`, `src/components/PartnerProposal.tsx`, `src/components/MemberCabinet.tsx`, `src/styles.css` (`.card-hanging`, `.header-pressed`, `.button-raised`, `.mini-thumbnail`) | ⏳ next |
| 5b-1 | Visual redesign pass — CSS layer: hanging surfaces, pressed headers, button states, CTA placement, KPI cells, mobile fallback | `src/styles.css` (new `.card-hanging`, `.header-pressed`, `.button-raised`, `.button-outline`, `.cta-top`, `.cta-bottom`, `.kpi-row`, `.kpi-cell`) | ✅ done 2026-10-06 |
| 5b-2 | Visual redesign pass — JSX layer: apply `.card-hanging` and `.header-pressed` classes across `partner-card` instances in `proposal.tsx` and `PartnerProposal.tsx`; place a top CTA (button-raised) at the start of the client proposal and a bottom CTA at the end | `src/routes/proposal.tsx`, `src/components/PartnerProposal.tsx` | ⏳ next |
| 5b-3 | Dual-track surface: toggle "View as graph / View as table"; render the financial-file table as text-equivalent of the dependency view | `src/components/PartnerProposal.tsx`, `src/routes/proposal.tsx`, `src/components/DependencyTable.tsx` (new), `src/styles.css` (`.dependency-table`) | ⏳ next |
| 5b-4 | Concentric rings layout on the visual graph: consulting centre, MVP ring, pilot-function ring (cycle), all-others outer ring | `src/components/PartnerGraph.tsx` (verify `radialLayout` and ring colours align with the four sequential packages), `src/components/PartnerProposal.tsx` (pass `radialLayout` prop on the client view) | ⏳ next |
| 5c | Restructure the partner route (`/partner`) to read in reverse: financial file first (numbers/proof/calculation), then description, then app mockup, then approval/commit-to-resources | `src/components/PartnerProposal.tsx`, `src/routes/partner.tsx` | ⏳ next |
| 6 | Five-use shared password gate at `/partner` with the remaining-uses counter and the lock screen | `src/routes/partner.tsx`, `src/styles.css` (`.partner-password-gate`, `.partner-lock-screen`), `src/lib/access.tsx` (replacement of the existing sessionStorage code with a counter object) | ⏳ next |
| 7 | Pre-fill partner-rate inputs with conservative indicative defaults (USD 25/hour for all four roles), source/date visible next to every input | `src/lib/proposal-data.ts` (a new `CONSERVATIVE_INDICATIVE_RATE_DEFAULTS` object), `src/components/PartnerProposal.tsx` (use the defaults in the rate grid) | ⏳ next |
| 8 | Embed a Google Form iframe in the survey preview and in the partner order confirmation; the form owner is the product owner; no submission claim | `src/components/MemberCabinet.tsx`, `src/components/PartnerProposal.tsx`, `src/styles.css` (`.partner-form-iframe`) | ⏳ next |
| 9 | Gates panel in the partner header with the five gates, their states, and the action to open each | `src/components/PartnerProposal.tsx`, `src/lib/gates.tsx` (new) | ⏳ next |
| 10 | Wide translucent overlay (`> 1.4 × viewport`) on desktop, viewport-fit on mobile, for the dependency frame | `src/components/MemberCabinet.tsx`, `src/components/PartnerProposal.tsx`, `src/styles.css` (`.partner-frame-wide`) | ⏳ next |
| 11 | Build and lint, manual flow test at desktop and mobile widths, accessibility check, PDF export test | `package.json`, manual test plan in `plan/feature-isrm-partner-client-paths-v2.md` § 12 | ⏳ next |

## 12. Manual test plan (post-build)

- Switch to the partner route without a password: the password prompt appears, the counter shows 5.
- Enter the placeholder password: the counter decrements to 4 and the partner page opens.
- Repeat four more times: the route locks on the sixth attempt; the lock screen shows the re-arm control.
- Open the client proposal: the four packages appear in order; only the third package contains the cycle description.
- Open the cohort-2 card: the four input slots are visibly empty; the formula is visible; the gate text is visible.
- Open the dependency view in the client proposal: the value-revelation banner is present; the value-unlocks panel lists the six lines; each line is text-equivalent and shape-coded, not colour-only.
- Open the partner calculation: every partner-rate input shows a default of `USD 25/hour`, the source is `Clutch UA 2024-Q3 low end`, the deviation is `conservative (low end of band)`, and the field is editable. Override the value: the total updates immediately; the override is recorded with a timestamp.
- Click "Print / PDF": the browser print dialog opens; the A4 stylesheet hides the print button, removes shadows and colours, and lays out the four packages in a clean column.
- Open the survey preview: the Google Form iframe is present; if the iframe is blocked, a static link to the form is shown; no "sent" indicator is shown.
- Resize the window to 390px: the partner-rate grid stacks; the value-unlocks panel stacks; the cohort-2 card fits the viewport; the dependency graph keeps the selected node visible.
- Resize to 1440px: the dependency frame renders wider than 1.4 × viewport; the underlying graph is still visible behind it; the value-unlocks panel sits inside the frame.

## 13. Carry-over from v1 and v1.1

- The legacy sessionStorage access code in `src/lib/access.tsx` is replaced by the five-use counter in Phase 6.
- The plan file `plan/feature-isrm-partner-configurator-v1.md` § 9 (v1.1 additions) remains the source of truth for the TII rename, the indicative-language updates, the partner-route exposure notice and the cohort-2 framing. This v2 plan adds the partner password gate, the conservative indicative defaults, the Google Form response capture, the gates timeline and the value-revelation emphasis.
- The historical notes about the TII acronym change (v1.1 § 9.7) are preserved and referenced by this v2 plan.
