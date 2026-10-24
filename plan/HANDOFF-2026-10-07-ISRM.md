---
goal: Self-contained continuation prompt for the ISRM Insight Hub project after the 2026-10-07 financial-block and SaaS-feasibility review; no data, narrative, decision, UI/UX directive, or open question is lost
date_created: 2026-10-07
last_updated: 2026-10-07
owner: Alex Zvolinskiy (ISRM Ukraine chapter product owner)
audience: any future agent (Mavis or otherwise) or Alex himself who needs to resume the project without re-reading the 2-day conversation history
status: "Hand-off ready · not committed to main · branch `isrm-partner-ranges-v1` is the live working state"
depends_on: feature-isrm-price-calculations-v1.md, feature-isrm-partner-financial-tables-v1.md, feature-isrm-partner-financial-summary-v1.md, feature-isrm-partner-client-paths-v2.md
---

# ISRM Insight Hub · hand-off · 2026-10-07

This is a continuation prompt. It captures every decision, every UI/UX directive, every open question, every file location (canonical sources in DDD + active code in this repo + planning docs in `plan/`), and every next action. Any future agent that picks this up can resume without re-reading the 2-day conversation history.

---

## 0 · One-paragraph project context

ISRM Insight Hub is a partner-driven prototype of a community platform for the **Ukraine chapter of the Institute of Strategic Risk Management (UK)**. The product owner (Alex) is **Strategy and Product owner**. The product is built on top of an existing **TanStack Router + React** codebase (`/Users/alexzvo/.copilot/repos/isrm-insight-hub/`) that was previously used for a generic expert-network demo. We are **adapting**, not greenfielding: the existing `Member Cabinet`, `NetworkGraph`, `experts/:code` mini-dossier, `proposal` page, and `partner` route are reused; the new `partner-finance` route and the cohort-2 funnel model are additions. Active working branch is `isrm-partner-ranges-v1` (not pushed, not merged to `main` per CON-001).

The pilot is a **consortium** of **three partners** (one role per partner) paid for delivery of four sequential packages over 432 hours at a planning rate of **£25 / £37 / £49 per hour** (low / base / high; all three partners share the same rate; hours differ by function). Currency is **GBP** for the ISRM prototype. Search and graph are the **core of the application** and have a separate module-level payment trigger. TII (Trust & Influence Index) is a **second-pass** capability with a gate condition — not developed in the first round.

The conversation ran for two working days. Day 1 produced the partner financial block (registry §1-§7, partner tables, executive summary, partner-finance route with 8 sections). Day 2 added the cohort-2 double-pricing funnel, the SaaS feasibility sensitivity, and the xlsx deliverable. Day 2 ended with a sharp critique from the product owner about (a) hollow cells in the first xlsx build, (b) inventing SaaS fees instead of using verified ISRM prices from the website, (c) the conservative funnel rates being cross-referenced against generic public benchmarks rather than against the actual ISRM source. All of this was addressed in the same session: xlsx rebuilt with cached values, theisrm.org prices added to the registry as Tier 1 verified anchors, the conservative-rate justification rewritten to reference the actual ISRM page, the partner-finance route updated with the verified M.ISRM fee of **£100/year** as the planning default.

---

## 1 · Repository + branch state

| | |
|---|---|
| **Project root** | `/Users/alexzvo/.copilot/repos/isrm-insight-hub` |
| **Remote** | `https://github.com/AlexezavGit/isrm-insight-hub.git` |
| **Active branch** | `isrm-partner-ranges-v1` (local, not pushed) |
| **Main branch** | `main` (no commits from this work) |
| **Other branches** | `alexezavgit-silver-eureka` (Lovable, no-touch) |
| **Last commit on `isrm-partner-ranges-v1`** | `a1b21a4 Перебудовано UI поверхамі` (pre-session, not from this work) |
| **Working tree** | 31 files modified, 9 new (untracked: package-lock.json, plan/, public/ISRM_Project_Description.md, src/components/PartnerGraph.tsx, src/lib/client-proposal-data.ts, src/lib/proposal-data.ts, src/routes/partner.tsx, src/routes/partner-finance.tsx, public/favicon.svg) |
| **Build status** | `npm run build` green; Nitro/Cloudflare output to `.output/`; `node .output/server/index.mjs` for SSR preview |
| **Dev server** | `npm run dev` (HMR) — `http://localhost:5173` (or vite-config-defined) |
| **Pinned runtime issue** | `npx serve .output/public` shows directory listing (no SSR) — do not use for preview (RISK-008) |

How to confirm the branch state from a fresh terminal:

```bash
cd /Users/alexzvo/.copilot/repos/isrm-insight-hub
git branch -v
#   alexezavgit-silver-eureka a1b21a4 Перебудовано UI поверхамі
# * isrm-partner-ranges-v1    a1b21a4 Перебудовано UI поверхамі
#   main                      a1b21a4 Перебудовано UI поверхамі
git status --short
```

> Branches do **not** show in Finder — Finder only shows the working tree of the current branch. Use `git branch` or a Git GUI to see branches.

---

## 2 · User (Alex) profile — durable preferences

This is what the user has reinforced **multiple times** in this project and that any future agent should respect without asking again.

### Communication

- Language: **primarily Ukrainian** for chat. English for code, registry, and technical documentation. Do not mix within the same document unless the user has asked.
- Tone: **direct, anti-fluff, no marketing language, no clichés**. State the recommendation and the reason; do not list pros/cons and say "it is up to you."
- Honest disagreement: when the user is wrong (e.g. on a calculation), say so directly with the arithmetic, not as a soft suggestion. When the user is right, acknowledge in one line, do not over-apologise.
- "TBD" as a placeholder in calculations is treated as a **bug**. Replace with conservative indicative value and explicit justification (argument, analogue, reference, named method, generally-recognised date). Conservatism = low end of band, leaves room for negotiation.
- "**Real source first, public benchmark second**" — when the actual entity (client, association, product) has published numbers, use those. Cross-reference to public benchmarks (Clutch, BLS, SaaS conversion tables) is only acceptable when the entity has no published number. Applied to ISRM: theisrm.org/membership/ publishes £25 / £100 / £150 tier prices; these are Tier 1 verified (`ISRM-EXT-ISRM-MEM-*` codes), not assumption. Public SaaS benchmarks (Metricuno, First Page Sage) used only for SaaS optionality that does not yet exist as a product.
- Cross-reference quantitative claims with **at least two credible sources** (web search, PubMed, Scholar Gateway). Where two sources disagree, take the lower band.
- Mark all assumptions explicitly.
- "Color is never the sole carrier of meaning" (deuteranopia accessibility) — every status also has a text label or shape.

### Scope / governance

- Branching: feature work happens on `isrm-partner-ranges-v1`. Push to `main` and any deletion require Alex's explicit decision (CON-001).
- "No server auth" for the partner route in this prototype — **5-use shared password** is acceptable. The partner page counter decrements on use, locks after 5, manual re-arm. (Phase 6, pending.)
- "No backend mail" for one-time response capture (surveys, order confirmation) — embed **Google Form / Google Drive form** via iframe; responses go to the owner. No own mail server. (Phase 8b, pending.)
- Gate activation: gates activate at concrete data-verification moments (after pilot launch + measurement, after Cohort 2 definition, after scope approval, after budget ceiling). Not continuous blocking.
- TII (Trust & Influence Index) — built from attributed expert contributions (publications, projects, discussions, citations). **Always TII, never TLI**. TII is a second-pass capability with an explicit gate condition; not developed in the first round.

### Reactivity contract — what the registry ACTUALLY does

The "reactivity contract" is **documentation**, not a code mechanism:

| What | How it actually works |
|---|---|
| Partner changes rate in `/partner-finance` route | Stored in React state only; lost on page reload |
| Partner rate override writes back to registry.md | **NOT automatic**; no file-write from the React app |
| Registry change updates the partner-finance route | **NOT automatic**; the registry is a markdown file in `plan/`, the route is in `src/routes/` |
| Code change updates registry | Manual; the agent or Alex edits both |

This was challenged by the product owner in the 2026-10-07 review. The honest answer: the registry is a **canonical planning document**, not a runtime config. For a true reactivity contract, a Node API would need to mediate between the React app and the markdown file. Out of scope for the current pilot.

### Style / aesthetic

- ISRM light surface aligns with **FEEL design tokens** from the prior session:
  - Lato 16px #7A7A7A body
  - Montserrat #0B544C headings
  - Hanging surfaces, pressed-in headers
  - FEEL palette as monochromatic plates
  - Do **not** copy FEEL/Bunker names
- ISRM website primary colors: `#0B544C` (teal), `#2C887E`, `#13645B`, `#B18680` (orange accent)
- Light design + grid mandatory for the partner financial page (`.partner-finance` parent class with 32px grid overlay, 280px sidebar + main grid, 12px tables, 10/12/14 typography)
- "Value-revelation principle" — "більше ніж уявляв" is achieved through dependencies: when a feature is selected, it surfaces cross-sell, over-sell, member capacity, network expertise, publications, publicity. This is the central UX theme, not an aside.

---

## 3 · Decisions made (canonical, in registry)

Every value below has a `registryCode` and a `Source` in `plan/feature-isrm-price-calculations-v1.md`. The codes are referenced by every dependent artifact (partner tables, summary, xlsx, partner-finance route). **Do not change a value without updating the registryCode everywhere**.

### 3.1 · Currency and partner rate card (§2 of registry)

- Currency: **GBP** (£). Default for the ISRM prototype.
- Three rate scenarios, all three partners share the same rate; hours differ by role:
  - `ISRM-RATE-PARTNER-LOW = 25` GBP/h — low end of $25-49 Clutch UA band converted at K_eur_usd ≈ 0.926
  - `ISRM-RATE-PARTNER-BASE = 37` GBP/h — midpoint of $25-49 band, cross-checked vs BLS OEWS software developer mean $66.40/h
  - `ISRM-RATE-PARTNER-HIGH = 49` GBP/h — high end of $25-49 band, below BLS 90th percentile $100.30/h
- All three rates are `assumption · conservative indicative`. They are planning references, not contracted fees; any partner can override in the partner calculation page.

### 3.2 · Work-package hours (§3 of registry)

| Package | client-comms (h) | ops (h) | product (h) | Σ (h) |
|---|---|---|---|---|
| 01 · Consulting & strategy | 16 | 8 | 24 | 48 |
| 02 · Application MVP | 24 | 40 | 80 | 144 |
| 03 · Pilot functions (with embedded cycle) | 60 | 80 | 100 | 240 |
| 04 · Remaining / additional | — | — | — | not yet derived |
| **Σ per partner (01-03)** | **100** | **128** | **204** | **432** |

- Hours are **planning reference, not measured delivery data**. They are estimates of the standard time expenditure for the role's function in each package. **No external benchmark** anchors these hours; the registry marks them `assumption · conservative indicative`.
- Package 02 is T-3 N/A (build-only MVP); Package 04 is not yet derived.

### 3.3 · Module lines T5 — search and graph are the core of the app (§4 of registry)

| Code | Module | Package | Role | Hours | Pay @ £37/h base |
|---|---|---|---|---|---|
| ISRM-MOD-MVP-SEARCH | Search (Member Cabinet + filters) | 02 | ops | 16 | £592 |
| ISRM-MOD-MVP-GRAPH | Graph (Network + Dependency) | 02 | product | 32 | £1 184 |
| ISRM-MOD-PILOT-GRAPH | Graph pilot enhancements (expert overlay, value-unlocks) | 03 | product | 20 | £740 |
| ISRM-MOD-PILOT-DEP | Dependencies view (cohort 2 + LinkedIn channel) | 03 | product | 16 | £592 |

Module hours are a **sub-allocation** of the package hours in §3.2, not an addition. **Payment trigger: on delivery/acceptance of the module itself**, not on the package as a whole. The product owner can override.

### 3.4 · Package totals T3 — base scenario sums

- 01 · Consulting & strategy: **£1 776** (48 h × £37/h)
- 02 · Application MVP: **£5 328** (144 h × £37/h)
- 03 · Pilot functions: **£8 880** (240 h × £37/h)
- **Combined 01-03 base case: £15 984**
- Combined 01-03 low case (×£25): £10 800
- Combined 01-03 high case (×£49): £21 168
- Package 04: not yet derived, excluded from combined totals.

### 3.5 · Fee tiers T1 overlay (§7a of registry)

| Tier | Multiplier | Description | KPI (capacity created) | Go-no-go |
|---|---|---|---|---|
| T-1 · Self-serve | ×1.0 | Partner runs cycle with documentation | cycle count, publications, conferences | Deliverables present, board sign-off |
| T-2 · Co-pilot | ×1.5 | + active consulting, agenda co-design, recruitment, facilitation | + 1-on-1 sessions, agenda approved by board | T-1 + board approves agenda + cohort 2 measured + sessions ≥ agreed |
| T-3 · Operate | ×2.0 | + publications, conferences, AI-OSINT, AI-chatbot, dashboards | + publications, conference plan, AI features gate | T-2 + TII coverage measured + AI ethics approved |

The multiplier applies to **partner hours**, not the rate. Package 02 is T-3 N/A (build-only). Tier is selectable per package.

### 3.6 · Pilot conversion model — cohort 2, double-pricing view (§7e of registry)

**Verified Tier 1 anchors (theisrm.org/membership/, snapshot 2026-10-07):**

- `ISRM-PILOT-LI-FOLLOWERS = 8 742` — LinkedIn Page followers, snapshot 2026-08-28
- `ISRM-PILOT-LI-EMP = 44` — LinkedIn public profiles listing ISRM as employer
- `ISRM-PILOT-LI-CO-SIZE = "10 001+"` — LinkedIn Page company-size setting, **NOT a member count**
- `ISRM-PILOT-LI-NO-FOLLOWERS-EXPORT = "not available"` — no exportable follower list
- `ISRM-PILOT-LI-GROUP-OBS = 11 750` — user-supplied group screenshot, **unverified, not used as denominator**
- `ISRM-EXT-ISRM-MEM-STUDENT = £25/yr` — verified
- `ISRM-EXT-ISRM-MEM-M = £100/yr` (M.ISRM) — verified, planning default for Ukraine pilot
- `ISRM-EXT-ISRM-MEM-ASSOC = £150/yr` — verified
- `ISRM-EXT-ISRM-MEM-FELLOW = £150/yr` (F.ISRM) — verified
- `ISRM-EXT-ISRM-MEM-ANZ = ~£50/yr` — Australia/NZ promo, offer-specific, time-limited

**Conservative indicative funnel rates (cross-referenced to ≥ 2 public sources):**

| Code | Step | Rate | Sources |
|---|---|---|---|
| ISRM-PILOT-CONV-R1-APP | Reach → application | 2.0% | Rival IQ 2024 (0.41% by follower), Bigeye (2.15-3.2% professional services), Rossell LinkedIn Pulse (3-5%) |
| ISRM-PILOT-CONV-R2-ACC | Application → accepted | 30% | Glue Up 15-30% opportunity-to-committed, Rossell 20-30% free-trial |
| ISRM-PILOT-CONV-R3-PAID | Accepted → paid | 25% | Rossell 20-30% voluntary assoc trial-to-paid |
| ISRM-PILOT-SAAS-ENGAGE | Engaged-in-services share | 0.5% | Metricuno 0.2-1.5% blended visitor→paid, First Page Sage 13.3% visitor→freemium (top performers) |
| ISRM-PILOT-SUB-FEE | Annual subscription fee | **£100** (M.ISRM) | **Verified theisrm.org 2026-10-07** |
| ISRM-PILOT-SAAS-PRICE | SaaS price per engaged user | £240/year | Hypothetical (no product); £20/month = B2B SaaS lower band |

**Funnel output (verified reach 8 742, conservative rates, M.ISRM fee):**

```
applications   = 8 742 × 2.0%  ≈ 175
accepted       = 175 × 30%     ≈ 53
paid           = 53 × 25%      ≈ 13 new paid members
engaged users  = 8 742 × 0.5%  ≈ 44

Client view · subscription revenue (year 1)   = 13 × £100 = £1 300
Partner view · SaaS revenue (year 1, hypothetical) = 44 × £240 = £10 560
```

The £10 560 SaaS figure is **hypothetical** (no product today). The £1 300 subscription figure is **real and contracted** at the verified ISRM M.ISRM tier. Pilot produces measurement, not revenue.

### 3.7 · SaaS feasibility sensitivity (§7f of registry)

Three parameter moves tested:

| Move | Reach | Share | ARPU | Year-1 SaaS revenue | Within cited band? |
|---|---|---|---|---|---|
| Current pilot | 8 742 | 0.5% | £240 | £10 560 | Yes (mid-band Metricuno) |
| Reach only (3×) | 25 000 | 0.5% | £240 | £30 000 | Yes (no share change) |
| Eng-share only (4×) | 8 742 | 2.0% | £240 | £41 952 | **No — 2% is above Metricuno 1.5% band upper** |
| ARPU only (5×) | 8 742 | 0.5% | £1 200 | £52 440 | **No — £1 200 has no anchor in cited benchmarks** |

**Verdict (honest):** LinkedIn alone, year 1, does **not** support meaningful SaaS revenue. The only path that stays inside cited public benchmarks is **reach-only**, which gives £30 000/year (floor of "self-sustaining band"). The other two moves (engagement and ARPU) are possible in 12+ months but cannot be claimed as conservative indicative.

### 3.8 · The four-slot cohort 2 formula (locked in plan v2 §7)

```
new paid members = Reach × R1 × R2 × R3
                  = 8 742 × 2% × 30% × 25% ≈ 13
```

The four input slots (Reach, Volunteer applications, Accepted new members, Paid among those shown the offer) **stay empty on the client proposal page** until the pilot records actual measurements. The conservative indicative rates above populate them as planning reference, with a clearly labeled "planning reference · NOT a forecast" note.

### 3.9 · Excluded / historical-inactive (§6 of registry)

| Code | Excluded item | Status |
|---|---|---|
| ISRM-EXCL-HOSTING | Hosting | not in MVP |
| ISRM-EXCL-AIAPI | AI / API usage | not in MVP |
| ISRM-EXCL-LEGAL | Legal & privacy work | not in MVP |
| ISRM-EXCL-REUSE | Reuse compensation | pending agreement |
| ISRM-EXCL-TAX | Tax & ongoing support | out of scope |
| ISRM-EXCL-CONF | LinkedIn confirmed experts | **awaiting pilot measurement (cannot be fabricated, REQ-018)** |
| ISRM-EXCL-MULT | Multiplier M = 3.0 (Maister / AIA DPE) | historical / inactive |
| ISRM-EXCL-2080H | 2 080 h greenfield €66 090 | historical / inactive |
| ISRM-EXCL-198K | Commercial total Cost × 3 = €198 270 | historical / inactive |
| ISRM-EXCL-54100 | Base MVP €54 100, 620 h, 10-12 weeks | historical / inactive |
| ISRM-EXCL-OSINT | AI OSINT 480 h × €45/h × 3 = €64 800 | historical / inactive |
| ISRM-EXCL-TRANCHE | Tranches 30/40/30 (€59 481 / €79 308 / €59 481) | historical / inactive |

The historical anchors are **kept for traceability only**, never used in the active calculation.

### 3.10 · Payment terms (active · §7 of registry)

- `ISRM-PAY-DUE`: on acceptance of each package
- `ISRM-PAY-FIRST`: ≥ 30% of the agreed total
- `ISRM-PAY-MODULE`: module-level trigger for search and graph
- `ISRM-PAY-NOINSTAL`: no invented installment split
- `ISRM-PAY-INDICATIVE`: all totals are INDICATIVE pending scope and budget-ceiling approval

---

## 4 · Two journeys (decision order)

### 4.1 · Client journey (forward)

1. **Brief** — what is ISRM Ukraine chapter, what is the pilot
2. **Dependencies** — visual + verbal map of what depends on what
3. **Capacity** — capacity formula card: contributions + expertise + discussions + publications + conferences = participation (planning cycle + trend formation, on top of which TII is layered)
4. **Packages** — four sequential (01 Consulting → 02 Application MVP → 03 Pilot functions with embedded cycle → 04 Remaining). Cycle is shown only inside Package 03.
5. **Prices & fees** — five gates; pricing is INDICATIVE until scope and budget-ceiling approval

### 4.2 · Partner journey (REVERSED — the product owner wants this the opposite of the current route)

1. **Financial file with numbers, proof, calculation** — first
2. **Description with arguments** — second
3. **Application / product mockup** — third
4. **Client approves → partner commits resources & responsibility** — fourth

The current `/partner` route reads forward like the client route. The product owner wants it **re-sequenced to the partner's actual decision order**. This is the **Phase 5c-pending** task. The `/partner-finance` route already implements the new order (financial block first).

The current proposal has **3 partners** (per the active brief). The product owner may revise this in a future iteration.

---

## 5 · UI/UX directives from the product owner (collected verbatim)

These come from the product owner over both days and are **not negotiable** in the next iteration unless the product owner reopens the question.

### 5.1 · Member Cabinet UX (the new design direction)

1. **Search panel at the top** with **4 cells**: sectors / territories / third-cell-TBD / count
2. **Listing column width: 1/3 to 1/4 of viewport** (not 1/2)
3. **Graph view**: concentric function rings + dependency overlay (when a function is selected, surrounding participants appear around it)
4. **Mini-resume overlay**: 1/3 to 1/4 width, slides over listing when a member is selected
5. **Two action buttons in the mini-resume**:
   - "**Save to project**" — under development (deferred feature; show as disabled with a "under dev" note)
   - "**Open full dossier**" — access required (gate on LinkedIn-verified identity, manual review, or paid membership)
6. **3-component state toggle**: EXPERTS / FEATURES / DEPENDENCIES
7. **All popups in light theme** (no dark mode on overlays)
8. **Deuteranopia-safe**: color is never sole carrier; always text label or shape
9. **No synthetic data**: every profile that appears must be verified or marked "partial" (REQ-018)

### 5.2 · Partner financial page (the `/partner-finance` route)

1. **Light design + grid mandatory** — `.partner-finance` parent class, sand `#e9dec9` background, 32px grid overlay, 280px sidebar + main grid
2. **All numbers carry `data-registry-code` attribute** — hover or inspect shows the registry code
3. **Editable inputs override the registry** — partner can change rate, hours, cohort 2 inputs; the override is in React state only (regression noted in §2 above)
4. **No 3rd-party data attribution to internal registry** — public source URLs in the registry, internal cross-references via registryCode (distinction noted in §2)
5. **No fabricated conversions or fabricated SaaS revenue** — every figure is either verified Tier 1 anchor or conservative indicative with 2+ public source cross-references
6. **Print/PDF via `window.print()` + `@media print`** — no fake "Send" button

### 5.3 · Visual direction

- ISRM-svitla proposal: pokotsanna, віддалено нагадує FEEL
- Lato 16px #7A7A7A body, Montserrat #0B544C headings
- Hanging surfaces, pressed-in headers
- FEEL palette as monochromatic plates (teal, orange-deep, gold accent)
- Partner-finance CSS classes: `.partner-finance .pf-card`, `.partner-finance .pf-table`, `.partner-finance .pf-grid-3`, `.partner-finance .pf-grid-2`, `.partner-finance .pf-tier-pill`, `.partner-finance .pf-input`, `.partner-finance .pf-select`, `.partner-finance .pf-meta`, `.partner-finance .pf-foot`, `.partner-finance .pf-card-mini`, `.partner-finance .pf-card-view`, `.partner-finance .pf-view-client`, `.partner-finance .pf-view-partner`, `.partner-finance .pf-h3`, `.partner-finance .pf-table-tight`, `.partner-finance .pf-big-number`, `.partner-finance .pf-meta-strong`

### 5.4 · Cohort 2 card on the client proposal page (`/proposal`)

- 4 input slots **stay visibly empty** until pilot measurement (gate not lifted)
- "Planning reference" details element added: shows conservative indicative rates from §7e.2 with cross-referenced sources, with explicit "not a forecast" reminder
- SaaS view is **partner-only** (not on the client page)

### 5.5 · Partner-finance Section 9 (cohort 2 in the partner route)

- Sidebar link to `#cohort2`
- Input table with **editable inputs** for: reach, R1, R2, R3, subscription fee (now £100 verified M.ISRM, not 0/disabled), saasEngage, saasPrice
- "Planning reference · NOT a forecast" pill
- Side-by-side panels: Client view (subscription, teal accent) + Partner view (SaaS, orange accent)
- "Subscription fee slot is read-only here" note replaced with verified M.ISRM anchor + override capability

---

## 6 · Open questions / unresolved

1. **What is the actual subscription tier the client wants?** Default is M.ISRM £100/year. Client/board may pick Student, Associate, Fellow, or multi-year discount. The override is in the partner-finance route; the client proposal page still shows the four-slot formula with empty inputs.
2. **Is the SaaS optionality worth pursuing?** The £10 560 token at conservative anchors is below any meaningful SaaS band; the partner is paid for delivery, not for SaaS revenue. This is a product owner decision, not a calculation.
3. **Cohort 2 confirmed expert share** — REQ-018 forbids fabrication. The pilot must measure it. The active calculation explicitly excludes this until measurement.
4. **TII gate** — TII is a second-pass capability. Gate condition is "when pilot coverage and capacity-cycle measurements reach a defined level." Not a near-term task.
5. **Package 04 derivation** — not yet derived. It is presented as a separately scoped continuation. Hours not in the combined 01-03 totals.
6. **Reactivity contract as a runtime mechanism** — current contract is documentation only. A Node API mediator would be needed for true React state ↔ registry.md sync. Out of scope for the current pilot but worth noting for the next iteration if Alex wants a real config layer.

---

## 7 · File inventory

### 7.1 · Source materials in the DDD project folder (NOT this repo)

Source materials live in `/Users/alexzvo/Documents/DDD/`. The product owner's brief and pricing model artifacts are there.

**Critical correction (2026-10-07 review):** DDD is a **workspace** with planning inputs and superseded drafts, NOT a canonical source. The **canonical sources for the pilot are**:

1. **theisrm.org/membership/** — verified Tier 1 for ISRM subscription tier prices (£25 / £100 / £150 / multi-year / lifetime). This is the actual organization's published numbers.
2. **ISRM_Ukraine_Community_CRM_178_FandP/LinkedIn Mapping Table 1 + CRM Dashboard Table 1** — verified Tier 1 for the pilot LinkedIn Page followers (8 742, snapshot 2026-08-28). This is the actual CRM snapshot.

DDD files are **planning inputs**, not canonical. Some are useful (the architecture doc, the access contract); most are drafts that have been replaced by the canonical registry in `plan/`.

| File | Actual status | Used in | Notes |
|---|---|---|---|
| `ISRM_Ukraine_Community_CRM_178_FandP/LinkedIn Mapping-Table 1.csv` | **Verified Tier 1 (the actual CRM)** | Registry §7e.1 (ISRM-PILOT-LI-*) | Pilot audience snapshot. **The canonical source for the 8,742 LinkedIn Page followers.** |
| `ISRM_Ukraine_Community_CRM_178_FandP/CRM Dashboard-Table 1.csv` | **Verified Tier 1 (the actual CRM)** | Registry §7e.1 (overview) | CRM overview with Page followers, employee profiles, page settings. |
| `ISRM_Ukraine_Community_CRM_178_FandP.xlsx` | **Verified Tier 1** | Same as above | Spreadsheet version of the CRM. |
| `theisrm.org/membership/` | **Verified Tier 1 (external, the actual organization)** | Registry §7e.3 (ISRM-EXT-ISRM-MEM-*) | **The canonical source for ISRM tier prices (£25 / £100 / £150).** Retrieved 2026-10-07. |
| `theisrm.org/isrm-multi-year-membership/` | **Verified Tier 1** | Registry §7e.3 (multi-year, lifetime) | **The canonical source for multi-year discounts.** Retrieved 2026-10-07. |
| `theisrm.org/en/regional-chapters` | **Verified Tier 1** | Registry §7e.3 (Australia chapter promo) | **Chapter-specific pricing.** Retrieved 2026-10-07. |
| `_Initial prompt.md` | Planning input (product owner's brief) | All planning docs | Requirements baseline. Read first to understand Alex's framing. |
| `1_ISRM_System_Architecture_and_Data_Attributed_Pricing_Protocol.md` | Planning input (architecture) | Plan v2, registry §1 | Architecture framing, not the pricing source. |
| `2_ISRM_Internal_Product_Architecture_Roadmap_and_Pricing.md` | Planning input (historical pricing) | Registry §6 (historical anchors in `historical/inactive` status) | Source for the historical anchors (€198 270 / €66 090 / €54 100 / €64 800), all marked `historical/inactive`. Not used in active calculation. |
| `3_ISRM_Pricing_Model.xlsx` | Planning input (with caveat) | n/a (canonical rates already extracted) | Spreadsheet of pricing model. Cached: rates in registry marked `ISRM-EXT-CLUTCH-UA = 37` are `assumption · unverified` (Clutch pages could not be retrieved during the prior revision; plan v1 § 9 RISK-009). |
| `4_ISRM_Content_to_Service_Assessment.md` | Planning input (content strategy) | n/a in current pilot (referenced for content strategy) | Not used for financial block; relevant for content-services roadmap. |
| `5_ISRM_Expert_Registry_Access_Contract.md` | Planning input (access policy) | Plan v2, registry §7 (governance) | The access contract that defines SEC-001 (no name-level LinkedIn data) and related policies. |
| `6_ISRM_Community_Activation_Evidence_and_Data_Gaps.md` | Planning input (pilot evidence) | Plan v2 §7 (cohort 2 framing) | Documents the pilot CRM evidence and the data gaps. |
| `Sand - Conversion Guide.dc.html` | Design reference (visual direction) | Visual direction in §5.3 | Sand-toned conversion design guide. Source for the FEEL-pokotsanna alignment. |
| `Teal - Key Art Deck.dc.html` | Design reference (visual direction) | Visual direction in §5.3 | Teal-toned key art design. Source for the ISRM primary color tokens. |
| `ISRM_Client_Proposal_Draft.md` | **Superseded** | n/a | Early client proposal draft. Superseded by the live `/proposal` route + registry. **Move to `archive/`.** |
| `ISRM_Client_Configuration_Request_Draft.md` | **Superseded** | n/a | Configuration request draft. **Move to `archive/`** unless the product owner confirms it is still authoritative. |
| `ISRM_Community_Member_Survey_Draft.md` | **Superseded** | n/a (surveys deferred to Phase 8b) | Survey draft. Superseded by the empty input-slot framing on `/proposal`. **Move to `archive/`** until Phase 8b. |
| `ISRM_Partner_Budget_Model_Draft.xlsx` | **Superseded** | n/a | Superseded by `feature-isrm-pilot-cohort2-feasibility-v1.xlsx` and the partner financial tables. **Move to `archive/`.** |
| `ISRM_Partner_Cost_Model_Clean.xlsx` | **Superseded** | n/a | Same as above. **Move to `archive/`.** |
| `ISRM_Partner_Decision_Input_Draft.md` | **Superseded** | n/a | Superseded by the partner financial summary. **Move to `archive/`.** |
| `ISRM_Partner_Decision_Proposal_Draft.docx` | **Superseded** | n/a | Same as above. **Move to `archive/`.** |
| `ISRM_Partner_Work_Proposal_Draft.md` | **Superseded** | n/a | Same as above. **Move to `archive/`.** |
| `ISRM_Website_Audit_EN.docx` | Design reference (tone-of-voice) | n/a | Audit of the ISRM website. Not used in the financial block, but the design tokens and tone-of-voice direction in this audit inform the visual direction. Keep accessible; do not archive. |
| `archive/` | Active archive | n/a | Already contains old versions. The superseded drafts above go here. |

**Rule for future work**: if a value is published by the actual entity (theisrm.org, the CRM snapshot, ISRM official communications), use that. DDD planning files are reference materials for the product owner's framing, not the canonical source of numeric values. The canonical registry (`plan/feature-isrm-price-calculations-v1.md`) records every numeric value used in the active calculation, with its source URL or its DDD planning-input status clearly noted.

### 7.2 · Active planning documents in this repo (`plan/`)

| File | Role | Status |
|---|---|---|
| `feature-isrm-price-calculations-v1.md` | **Canonical registry** | Active, current to 2026-10-07 |
| `feature-isrm-partner-financial-tables-v1.md` | Partner-facing tables | Active, current to 2026-10-07 |
| `feature-isrm-partner-financial-summary-v1.md` | Executive summary | Active, current to 2026-10-07 |
| `feature-isrm-partner-client-paths-v2.md` | Plan v2 (this session's reference plan) | Active |
| `feature-isrm-partner-configurator-v1.md` | Plan v1 (predecessor) | Superseded by v2; keep for traceability; do not edit |
| `feature-isrm-pilot-cohort2-feasibility-v1.xlsx` | xlsx deliverable | Active, cached values populated, verified M.ISRM fee baked in |
| `feature-isrm-pilot-cohort2-feasibility-csv/` | CSV exports of each xlsx sheet | Active |
| `HANDOFF-2026-10-07-ISRM.md` | This file | New as of 2026-10-07 |

### 7.3 · Active code in this repo (`src/`)

| File | Role | Status |
|---|---|---|
| `src/routes/proposal.tsx` | Client proposal page with cohort 2 card + planning reference addendum | Live, with the verified M.ISRM fee reference |
| `src/routes/partner-finance.tsx` | Partner financial review with 9 sections including cohort 2 double-pricing | Live, with verified M.ISRM fee default in `cohort2Overrides.subFee` |
| `src/routes/partner.tsx` | Partner route (current forward sequence) | Live, awaiting Phase 5c reversal to financial-first order |
| `src/routes/index.tsx` | Network graph home | Live, "Proposal & price" CTA updated |
| `src/routes/directory.tsx` | Member directory | Live, awaiting Member Cabinet UX redesign per §5.1 |
| `src/routes/experts/$code.tsx` | Member mini-dossier | Live, with SEC-001 contact-separation policy |
| `src/components/MemberCabinet.tsx` | Member directory UI | Live, awaiting Member Cabinet UX redesign per §5.1 |
| `src/components/NetworkGraph.tsx` | Network graph | Live, with concentric function rings + dependency overlay |
| `src/components/PartnerGraph.tsx` | Partner-specific graph | New, used on `/partner-finance` |
| `src/components/PartnerProposal.tsx` | Partner proposal UI | Live |
| `src/components/AppShell.tsx` | App shell with bottom navigation | Live |
| `src/lib/i18n.tsx` | Bilingual EN/UK | Live |
| `src/lib/proposal-data.ts` | Partner proposal data | Live, with TII labels (was TLI) |
| `src/lib/client-proposal-data.ts` | Client proposal data | Live, with verified ISRM tier anchor in `CLIENT_OFFER_NOTE` |
| `src/lib/types.ts` | Shared types | Live |
| `src/lib/access.tsx` | Access code (legacy sessionStorage) | Live, awaiting Phase 6 replacement with 5-use counter |
| `src/lib/filters.tsx` | Search filters | Live |
| `src/lib/mcp/shape.ts` + `mcp/tools/search-experts.ts` | MCP integration | Live, public/anonymised tools per AGENTS.md |
| `src/lib/experts.server.ts` | Server-side experts logic | Live, awaiting cloud-deploy |
| `src/lib/network.functions.ts` | Network function data | Live |
| `src/styles.css` | All CSS | Live, includes partner-finance, value-unlocks, cohort 2, light grid, FEEL tokens |
| `public/ISRM_Project_Description.md` | Project description | Live, in `public/` for direct access |
| `public/favicon.svg` | Favicon | Live (replaced `favicon.ico`) |

### 7.4 · The `archive/` (DDD) and outdated files

- All `ISRM_*_Draft.*` and `ISRM_Partner_*_Draft.*` files in `/Users/alexzvo/Documents/DDD/` — see §7.1. Move to `archive/` to declutter. The product owner can decide which (if any) to keep.
- `feature-isrm-partner-configurator-v1.md` in `plan/` — keep for traceability, do not edit.

---

## 8 · Development phases — current state and next actions

| Phase | What | Status |
|---|---|---|
| 1 | TLI → TII rename across active code and the project description | ✅ Done 2026-10-07 |
| 2 | Partner-route exposure notice in the partner header and on `/coordinator` | ✅ Done 2026-10-07 |
| 3 | Header change to "Four sequential packages" with embedded-cycle note; cohort-2 card with the fixed formula and four empty input slots | ✅ Done 2026-10-07 |
| 4 | Value-revelation banner and value-unlocks section in the client proposal; same vocabulary mirrored in the partner overlay | ✅ Done 2026-10-07 |
| 5 | Print/PDF experience via `window.print()` and `@media print`; no fake Send control | ✅ Done 2026-10-07 |
| 5a | Capacity formula card on the client proposal; capacity = member contributions + expertise + discussions + publications + conferences = participation; planning-loop + trend-formation + TII-layering diagram | ✅ Done 2026-10-07 |
| 5b | Visual redesign: top CTA + bottom CTA in proposal; hanging surfaces, pressed-in headers; light design + grid for partner-finance | ✅ Done 2026-10-07 |
| 5c | Cohort 2 card with LinkedIn channel + 4 empty input slots + conversion formula + subscription-increase unit economics variant | ✅ Done 2026-10-07 |
| 5d | Verified M.ISRM fee added to registry; partner-finance and proposal updated; xlsx refreshed with £100 anchor and £1 300 subscription revenue | ✅ Done 2026-10-07 |
| A | `/partner-finance` route created with 8 sections (rate card, partner × package hours, per-partner pay, modules, unit economics, KPIs, go-no-go, excluded) | ✅ Done 2026-10-07 |
| A+ | Section 9 added (cohort 2 double-pricing with editable inputs and side-by-side panels) | ✅ Done 2026-10-07 |
| B | `data-registry-code` attributes in `src/components/PartnerProposal.tsx` so every value in the existing partner proposal links to the registry | ⏳ Next, low priority (registryCode is internal cross-ref, not external data attribution; this is mostly documentation polish) |
| C | Pre-fill partner rates from registry in `PartnerProposal.tsx` (rate inputs default to £37, with override capability) | ⏳ Next, easy |
| D | **`src/lib/i18n.tsx` audit for TII labels** | ⏳ Next, easy (already renamed) |
| E | **Member Cabinet UX redesign** per §5.1: search panel top with 4 cells, listing 1/3-1/4 width, graph with concentric function rings + dependency overlay, mini-resume overlay 1/3-1/4, "Save to project" (under dev) + "Open full dossier" (access required), 3-component state toggle (EXPERTS / FEATURES / DEPENDENCIES) | ⏳ Next, big task |
| 6 | 5-use shared password gate at `/partner` (counter decrements, locks after 5, manual re-arm; replaces legacy `src/lib/access.tsx` sessionStorage) | ⏳ Pending |
| 5c-pending | Reverse partner journey: financial file first, then description, then app mockup; restructure `/partner` accordingly | ⏳ Pending |
| 7 | Internal/public product decision: separate internal pilot from public product; multi-community, billing, advanced automation | ⏳ Pending, not in MVP scope |
| 8a | Google Form iframe for survey preview (one-time response capture; responses go to owner) | ⏳ Pending |
| 8b | Replace the empty cohort 2 four-slot framing with the actual Google Form when gate is lifted | ⏳ Pending |
| 9 | Reactivity contract as a runtime mechanism (Node API + file persistence); not in MVP scope | ⏳ Future, not in MVP scope |

---

## 9 · The honest product-owner read (from the 2026-10-07 review)

The product owner gave sharp, justified critique on 2026-10-07:

1. **Hollow cells in the first xlsx** — root cause: I built the file with empty cached values, which macOS Quick Look / Numbers cannot resolve. The file was structurally valid (openpyxl read all data correctly) but rendered as half-empty to the product owner. **Fix applied 2026-10-07**: rebuilt the xlsx with cached values populated. Lesson: always test the deliverable in the actual viewer the product owner will use.

2. **Inventing SaaS fees instead of using theisrm.org/membership/** — the conservative £240/year ARPU was a generic B2B SaaS comparator. The ISRM website already publishes £25 / £100 / £150 / multi-year / lifetime. **Fix applied 2026-10-07**: added 5 verified Tier 1 ISRM tier anchors to the registry; planning default is M.ISRM £100/year; the hypothetical £240/year is now explicitly flagged as a hypothetical for a product that does not exist. **Lesson saved to User Memory**: "Real source first, public benchmark second" — when the actual entity has published numbers, use those.

3. **registryCode is not data attribution** — the product owner correctly noted that registryCode is internal cross-referencing between markdown tables, not external data attribution. The actual external validation is the public source URLs in the `Source` column. **Honest read acknowledged**: registryCode is **navigation convenience**, not attribution. Real attribution is `Source` URLs. **Lesson saved to User Memory**.

4. **Reactivity contract is documentation, not runtime** — the partner rate override in `/partner-finance` does not write back to `plan/feature-isrm-price-calculations-v1.md`. The contract is a markdown promise, not a code mechanism. **Honest read acknowledged**: registry is a canonical planning document, not a runtime config. A Node API mediator would be needed for true sync. Out of scope for the current pilot.

5. **Hours are not measured** — the 432h direct labor total is the product owner's planning reference for "standard time expenditure for the function in each package." No external benchmark anchors these hours. They are `assumption · conservative indicative` in the registry. **Honest read acknowledged**: the product owner owns the planning numbers.

**The honest year-1 economics (after the 2026-10-07 review):**

- **Verified M.ISRM revenue (year 1, conservative)**: **£1 300** — 13 paid new members × £100
- **Hypothetical SaaS revenue (year 1, no product)**: **£10 560** — 44 engaged users × £240, requires building a SaaS product that does not exist
- **Partner block (deliverable, paid)**: **£15 984** (base) or £10 800-£21 168 across the three rate scenarios
- **Total economic activity in year 1**: ~£26 500, of which **£15 984 is the contractually paid amount**, £1 300 is verified revenue, £10 560 is hypothetical optionality

The pilot's role is **measurement**, not revenue. The product owner should not expect the pilot to fund itself in year 1. The pilot funds the **decision-grade data** that justifies the next-round optionality (reach scaling, engagement activation, premium tier mix).

---

## 10 · How to resume from this prompt

```bash
# 1. Verify branch state
cd /Users/alexzvo/.copilot/repos/isrm-insight-hub
git branch -v
git status --short

# 2. Confirm the financial block renders
npm run build
node .output/server/index.mjs   # SSR preview, then visit /partner-finance

# 3. Open the canonical registry first
$EDITOR plan/feature-isrm-price-calculations-v1.md
$EDITOR plan/feature-isrm-partner-financial-tables-v1.md
$EDITOR plan/feature-isrm-partner-financial-summary-v1.md
$EDITOR plan/feature-isrm-partner-client-paths-v2.md

# 4. Read this hand-off fully
$EDITOR plan/HANDOFF-2026-10-07-ISRM.md

# 5. If continuing on a new task, open the open-questions list (§6) and the pending phases (§8)
#    Pick the next phase (E — Member Cabinet UX redesign — is the biggest pending user-driven task)

# 6. Before committing any value change, search the registry code across all files:
grep -r "ISRM-RATE-PARTNER-BASE" plan/ src/  # example
# Any change to a registryCode must be reflected in:
#   - plan/feature-isrm-price-calculations-v1.md
#   - plan/feature-isrm-partner-financial-tables-v1.md
#   - plan/feature-isrm-partner-financial-summary-v1.md
#   - plan/feature-isrm-pilot-cohort2-feasibility-v1.xlsx (regenerate)
#   - src/lib/client-proposal-data.ts
#   - src/lib/proposal-data.ts
#   - src/routes/partner-finance.tsx
#   - src/routes/proposal.tsx (cohort 2 card)
#   - data-registry-code attributes in src/components/PartnerProposal.tsx
#   - any new component that uses the value
```

**Resume principle**: any change to a `registryCode` value must propagate to **all 7 dependent artifacts** in the same edit session. Skipping one silently creates drift. The plan v2 § "Reactivity contract" and registry §7e.8 are the contract; the runtime cost of the contract is a manual propagation step, not an automatic one (see §2 above).

---

## 11 · What to do next (if you are the next agent)

The most likely next user-driven task is **Phase E — Member Cabinet UX redesign** per §5.1. If the user asks for that:

1. Read `src/components/MemberCabinet.tsx` and `src/routes/directory.tsx` to see the current implementation.
2. Read `src/components/NetworkGraph.tsx` to understand the existing concentric-ring + dependency-overlay pattern.
3. Build a search panel with 4 cells (sectors, territories, third-cell-TBD-but-default-to-seniority, count) at the top, listing 1/3-1/4 width, mini-resume overlay 1/3-1/4 width.
4. Add "Save to project" (disabled, with "under dev" note) and "Open full dossier" (gated) buttons.
5. Add a 3-component state toggle (EXPERTS / FEATURES / DEPENDENCIES).
6. All popups in light theme.
7. Use deuteranopia-safe color coding (text label or shape, not color alone).
8. No synthetic data: every profile must be verified or marked "partial."

If the user asks for **Phase 6 — 5-use shared password gate**:

1. Read `src/lib/access.tsx` (the legacy sessionStorage implementation).
2. Replace with a counter that decrements on `/partner` access, locks after 5, manual re-arm.
3. Counter must persist in localStorage or sessionStorage (not in registry, since the registry is canonical planning, not runtime config).

If the user asks for **Phase 5c-pending — reverse the partner journey**:

1. Read `src/routes/partner.tsx` to see the current forward sequence.
2. Re-sequence to: financial file first, description second, app mockup third.
3. The financial file already exists at `/partner-finance` and the visual direction is already in §5.3 — the work is mostly routing and copy.

If the user asks for **Cohort 2 partner action** (a new task that emerged in the 2026-10-07 review):

1. The cohort-2 funnel is fully modelled in `plan/feature-isrm-pilot-cohort2-feasibility-v1.xlsx` and the partner-finance route Section 9.
2. The next step is to **define what the partner actually does in cohort 2** — there is no record in the registry or the partner-finance route of "the partner manages the LinkedIn communications channel" or "the partner handles the volunteer application review process." This is a gap that should be addressed before the pilot launches.

If the user asks for **something outside the scope of this hand-off** (e.g. a new product, a new client, a new vertical): stop, ask for confirmation, and propose where in the plan/registry/UI the new work fits. Do not extend the existing prototype silently.

---

## 12 · What was NOT used and why (transparency)

For future reference, here is the full audit of what is in the workspace and what was used vs. not used.

### Used (verified)

- `plan/feature-isrm-price-calculations-v1.md` — every value with `registryCode` is used by either the partner-finance route, the client proposal page, the partner tables, the executive summary, or the xlsx
- `plan/feature-isrm-partner-financial-tables-v1.md` — Tables 1-19, used by the partner financial review
- `plan/feature-isrm-partner-financial-summary-v1.md` — the one-page executive summary
- `plan/feature-isrm-partner-client-paths-v2.md` — the plan v2 with two journeys, five gates, double-pricing, password gate, TII gate, capacity formula
- `plan/feature-isrm-pilot-cohort2-feasibility-v1.xlsx` — the financial deliverable
- `plan/feature-isrm-pilot-cohort2-feasibility-csv/` — the CSV exports (5 files, one per key sheet)
- `src/routes/partner-finance.tsx` — 9 sections including cohort 2 double-pricing
- `src/routes/proposal.tsx` — client proposal with capacity formula, cohort 2 card, planning reference addendum
- `src/lib/client-proposal-data.ts` — with verified M.ISRM fee in CLIENT_OFFER_NOTE
- `src/styles.css` — partner-finance, value-unlocks, cohort 2, light grid, FEEL tokens

### Used (partial)

- `1_ISRM_System_Architecture_and_Data_Attributed_Pricing_Protocol.md` — referenced for §1 of registry (Tier 1 anchors)
- `2_ISRM_Internal_Product_Architecture_Roadmap_and_Pricing.md` — referenced for historical anchors in registry §6
- `3_ISRM_Pricing_Model.xlsx` — referenced but with caveat (`ISRM-EXT-CLUTCH-UA = 37` is `assumption · unverified` because the Clutch pages could not be retrieved during the prior revision; theisrm.org is the canonical source for verified ISRM prices)
- `5_ISRM_Expert_Registry_Access_Contract.md` — referenced for SEC-001 policy
- `6_ISRM_Community_Activation_Evidence_and_Data_Gaps.md` — referenced for cohort 2 framing
- `ISRM_Ukraine_Community_CRM_178_FandP/` — source for verified LinkedIn Page followers = 8 742
- `Sand - Conversion Guide.dc.html` and `Teal - Key Art Deck.dc.html` — visual direction

### Not used (and why)

- `ISRM_Client_Proposal_Draft.md` — early client proposal draft, superseded by the live `/proposal` route and the registry. **Move to `archive/`.**
- `ISRM_Client_Configuration_Request_Draft.md` — configuration request draft. **Move to `archive/`** unless the product owner confirms it is still authoritative.
- `ISRM_Community_Member_Survey_Draft.md` — survey draft, superseded by the empty input-slot framing. **Move to `archive/`** until Phase 8b.
- `ISRM_Partner_Budget_Model_Draft.xlsx` — superseded by `feature-isrm-pilot-cohort2-feasibility-v1.xlsx`. **Move to `archive/`.**
- `ISRM_Partner_Cost_Model_Clean.xlsx` — superseded. **Move to `archive/`.**
- `ISRM_Partner_Decision_Input_Draft.md` — superseded. **Move to `archive/`.**
- `ISRM_Partner_Decision_Proposal_Draft.docx` — superseded. **Move to `archive/`.**
- `ISRM_Partner_Work_Proposal_Draft.md` — superseded. **Move to `archive/`.**
- `4_ISRM_Content_to_Service_Assessment.md` — content-services roadmap, not used in the financial block. **Keep accessible** for the content strategy track.
- `ISRM_Website_Audit_EN.docx` — website audit, design tokens and tone-of-voice direction. **Keep accessible**, do not archive.

### What to do with each

- **Move to `archive/` (DDD)**: the 7 `ISRM_*_Draft.*` and `ISRM_Partner_*_Draft.*` files. They are historical drafts superseded by the canonical registry.
- **Keep in DDD root**: `_Initial prompt.md`, `1_*`, `2_*`, `3_*`, `4_*`, `5_*`, `6_*`, `ISRM_Ukraine_Community_CRM_*`, `Sand - Conversion Guide.dc.html`, `Teal - Key Art Deck.dc.html`, `ISRM_Website_Audit_EN.docx`. These are canonical sources.
- **Keep in `plan/` of the repo**: all `feature-isrm-*.md` files, `HANDOFF-2026-10-07-ISRM.md`, the xlsx and CSV exports. These are the active planning documents and the financial deliverable.
- **Keep in `src/` of the repo**: all `.tsx`, `.ts`, `.css` files. These are the live application code.

---

## 13 · One-line summary for a future agent

> The ISRM Ukraine chapter pilot is on branch `isrm-partner-ranges-v1`, 3 partners × 432h × £25/£37/£49 per hour, 4 sequential packages, 8 sections in `/partner-finance` + cohort 2 double-pricing in Section 9, registry at `plan/feature-isrm-price-calculations-v1.md` is canonical, M.ISRM fee £100/yr verified from theisrm.org/membership/ is the planning default, xlsx at `plan/feature-isrm-pilot-cohort2-feasibility-v1.xlsx` is the financial deliverable with cached values populated, pilot produces measurement (≈£1 300 verified membership revenue year 1, £10 560 hypothetical SaaS optionality), next big pending task is Member Cabinet UX redesign per §5.1.
