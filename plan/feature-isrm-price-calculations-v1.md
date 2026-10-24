---
goal: Document and source every price and rate used in the ISRM partner and client calculations
version: 1.1
date_created: 2026-10-06
last_updated: 2026-10-06
owner: ISRM product owner
status: "Draft for review · rates are ASSUMPTION · conservative indicative · currency = GBP"
tags: [feature, pricing, indicative, benchmark, registry, GBP, partner, three-partner]
---

# ISRM price calculations · v1.1

This document is the source of truth for every numeric value that appears in the partner and client calculations. It follows the same registry pattern that the product owner uses in FEEL (`FEEL/00_WIP/_REGISTRY.csv`): each line has a code, a value, a unit, a period, a formula, a source, a tier and a status. The TypeScript data files in `src/lib/proposal-data.ts` and `src/lib/client-proposal-data.ts` should mirror the verified lines below; unverified lines are explicitly tagged and must not be presented as final prices anywhere in the prototype.

**Default currency**: GBP (£). Tier 1 verified US and Ukraine sources are listed in their original currency and converted at the K_eur_usd rate published in DDD §2.2. The prototype does not perform live conversion; partner and client calculations display all values in GBP and reference the source-of-record.

**Status legend**: `verified` (independently confirmed against the named source within the named period), `assumption · conservative indicative` (planning reference; the value is the low end of a published band, leaving room for negotiation), `assumption · unverified` (the value comes from a source that could not be retrieved during the last revision; treat as provisional), `assumption · historical/inactive` (no longer used in the active proposal), `disputed` (sources or reviewers disagree), `forbidden` (do not use).

**Tier legend**: `T1 — anchor` (sets the base rate), `T2 — derived` (computed from T1 values), `T3 — package total` (sums T2 lines into a packaged price), `T4 — scenario` (low / base / high envelope for the same package), `T5 — module line` (a sub-line inside a package, e.g., the search-and-graph module).

---

## 1. Tier 1 verified external benchmarks (reference only, not the partner rate)

These are public, sourced data points. They are recorded here as anchors, not as the partner rate. The partner rate in §2 is the planning default for the three ISRM Ukraine chapter partners; the Tier 1 benchmarks are kept for the client/partner to see the actual public range.

| Code | Country | Period | Data | Source | Status |
|------|---------|--------|------|--------|--------|
| ISRM-EXT-BLS-DEV-MEAN | US | May 2023 / May 2024 | Software Developers (SOC 15-1252) mean hourly wage = $66.40 | U.S. Bureau of Labor Statistics, OEWS — `https://www.bls.gov/oes/2023/may/oes151252.htm` | verified · Tier 1 |
| ISRM-EXT-BLS-DEV-P90 | US | May 2023 / May 2024 | Software Developers (SOC 15-1252) 90th percentile = $100.30 | U.S. Bureau of Labor Statistics, OEWS | verified · Tier 1 |
| ISRM-EXT-BLS-CSD-MEAN | US | May 2023 | Computer Systems Design (NAICS 541500) mean hourly wage = $62.69 | U.S. Bureau of Labor Statistics, OEWS | verified · Tier 1 |
| ISRM-EXT-DOU-ARCH | Ukraine | Nov–Dec 2024 (published 2025-01-13) | System Architect median $5,500/month net → £48.50/h gross | DOU.ua «Зарплати українських розробників — зима 2025» (survey of 14 149 specialists) — `https://dou.ua/lenta/articles/salary-report-devs-winter-2025/` | verified · Tier 3/4 |
| ISRM-EXT-DOU-SWE | Ukraine | Nov–Dec 2024 | Senior Software Engineer median $3,500/month net → £32.00/h gross | DOU.ua, same report | verified · Tier 3/4 |
| ISRM-EXT-DOU-DEVOPS | Ukraine | Nov–Dec 2024 | DevOps / Cloud Engineer median $3,600/month net → £33.50/h gross | DOU.ua, same report | verified · Tier 3/4 |
| ISRM-EXT-DOU-QA | Ukraine | Nov–Dec 2024 | Senior QA / Test Engineer median $2,500/month net → £24.00/h gross | DOU.ua, same report | verified · Tier 3/4 |
| ISRM-EXT-DOU-PM | Ukraine | Nov–Dec 2024 | Project Manager median $2,800/month net → £26.50/h gross | DOU.ua, same report | verified · Tier 3/4 |
| ISRM-EXT-CONV | — | Sept 2026 | H_month = 168 h, T_tax = 0.05, S_esv ≈ $42, K_eur_usd = 0.926, K_alloc = 1.35 | Internal conversion formula recorded in DDD §2.2 | verified · Tier 3/4 |
| ISRM-EXT-LON-TECH | UK | 2024 | Senior contractor median rate £650–£900/day → £87–£120/h | IT Jobs Watch UK, mid-2024 snapshot | assumption · conservative indicative |
| ISRM-EXT-CLUTCH-UA | Ukraine | 2024-Q3 | $25–$49/h band, $37 midpoint, low end $25 | Clutch.co/developers, directory band, low end of $25–$49 | assumption · unverified · pages could not be retrieved during the last revision (plan v1 § 9 RISK-009) |
| ISRM-EXT-GLG-SUB | Global | 2021 | Corporate annual subscription $50,000–$300,000+; per-session expert call $800–$1,500 (expert gets 30–40%) | Gerson Lehrman Group, Inc., SEC Form S-1 (CIK 0001878347) | verified · Tier 1 (analog benchmark) |
| ISRM-EXT-PLN-ACV | US | FY 2023 | Top-20 avg contract $55M; federal pilot starts $1.2M | Palantir Technologies Inc., SEC Form 10-K (CIK 0001321655) | verified · Tier 1 (analog benchmark) |

The partner rate in §2 is **not** any single line above. It is the planning default chosen by the product owner as the low end of a published band, conservative enough to leave room for negotiation. The Tier 1 lines are kept in the registry so the partner and the client can see the actual public range during the discussion.

---

## 2. Partner rate · T1 anchor (planning default)

The three ISRM Ukraine chapter partners all share the same planning default hourly rate. The rate is not an agreed fee; it is a planning reference that any partner can override in the partner calculation page.

| Code | Value | Unit | Period | Formula | Source | Tier | Status |
|------|-------|------|--------|---------|--------|------|--------|
| ISRM-RATE-PARTNER-LOW | 25 | GBP/h | 2024-Q3 | Conservative pick: low end of the $25–$49/h Clutch UA band converted at K_eur_usd ≈ £25/h; £15/h low end of UK junior consultant band | Derived from `ISRM-EXT-CLUTCH-UA` + UK junior band cross-check | T1 | assumption · conservative indicative |
| ISRM-RATE-PARTNER-BASE | 37 | GBP/h | 2024-Q3 | Conservative pick: midpoint of the $25–$49/h Clutch UA band converted at K_eur_usd ≈ £34/h; rounded to £37 to leave room below BLS mean | Derived from `ISRM-EXT-CLUTCH-UA` + BLS-DEV-MEAN cross-check | T1 | assumption · conservative indicative |
| ISRM-RATE-PARTNER-HIGH | 49 | GBP/h | 2024-Q3 | Conservative pick: high end of the $25–$49/h Clutch UA band converted at K_eur_usd ≈ £45/h; rounded to £49 below BLS 90th percentile $100 | Derived from `ISRM-EXT-CLUTCH-UA` + BLS-DEV-P90 cross-check | T1 | assumption · conservative indicative |

The conservative pick is intentional: the partner rate is the planning default the partners see in the partner calculation. Agreed rates are entered by the partner as overrides; only the override value is contractual.

---

## 3. Work-package hours · T2 derived (per partner, per package)

Each row is the planning reference for one partner role in one package. Hours differ by function and responsibility; the three partners do not share hours even though they share the rate. The hours are a planning reference, not an agreed effort; any partner may override the hours in the partner calculation page.

| Code | Package | Partner role | Hours | Period | Justification | Tier | Status |
|------|---------|--------------|-------|--------|---------------|------|--------|
| ISRM-HRS-PKG01-CLIENT | 01 · Consulting & strategy | Client communications + business development | 16 | 2024-Q3 | Discovery, board alignment, decision recording — typical 2 working days for initial scope | T2 | assumption · conservative indicative |
| ISRM-HRS-PKG01-OPS | 01 · Consulting & strategy | Operations, OSINT, events, external communications | 8 | 2024-Q3 | Research inputs, data review, evidence rules — 1 working day for desk research | T2 | assumption · conservative indicative |
| ISRM-HRS-PKG01-PROD | 01 · Consulting & strategy | Product, strategy, vendor coordination | 24 | 2024-Q3 | Priority analysis, model design, protocol — 3 working days for the strategic frame | T2 | assumption · conservative indicative |
| ISRM-HRS-PKG02-CLIENT | 02 · Application MVP | Client communications + business development | 24 | 2024-Q3 | Stakeholder alignment, change requests, weekly check-ins — 3 working days across the MVP build | T2 | assumption · conservative indicative |
| ISRM-HRS-PKG02-OPS | 02 · Application MVP | Operations, OSINT, events, external communications | 40 | 2024-Q3 | Data import, profile reconciliation, manual review — 5 working days | T2 | assumption · conservative indicative |
| ISRM-HRS-PKG02-PROD | 02 · Application MVP | Product, strategy, vendor coordination | 80 | 2024-Q3 | Backlog, acceptance criteria, vendor coordination — 10 working days for the product owner across the MVP | T2 | assumption · conservative indicative |
| ISRM-HRS-PKG03-CLIENT | 03 · Pilot functions (with embedded cycle) | Client communications + business development | 60 | 2024-Q3 | Community survey, working groups, board reporting — 7.5 working days for the engagement cycle | T2 | assumption · conservative indicative |
| ISRM-HRS-PKG03-OPS | 03 · Pilot functions (with embedded cycle) | Operations, OSINT, events, external communications | 80 | 2024-Q3 | Data collection, response analysis, evidence review — 10 working days for the cycle operations | T2 | assumption · conservative indicative |
| ISRM-HRS-PKG03-PROD | 03 · Pilot functions (with embedded cycle) | Product, strategy, vendor coordination | 100 | 2024-Q3 | Working group agendas, findings report, conference assessment — 12.5 working days for the strategic layer | T2 | assumption · conservative indicative |
| ISRM-HRS-PKG04-* | 04 · Remaining / additional | All three | — | — | Not yet derived; this package is presented as a separately scoped continuation | T2 | not yet derived |

The total planning hours, packages 01–03 combined, are 432. The four-package sequence is the current scope; the fourth package is not yet registered as derived hours.

---

## 4. Module lines · T5 (search and graph are the core of the app)

The search and graph are the core of the application. They are identified as separate module lines inside the relevant packages so that payment can be triggered on the delivery/acceptance of the module itself, not only on the package as a whole. The module hours are a sub-allocation of the package hours in §3.

| Code | Package | Module | Partner role | Hours | Period | Justification | Tier | Status |
|------|---------|--------|--------------|-------|--------|---------------|------|--------|
| ISRM-MOD-MVP-SEARCH | 02 · MVP | Search (Member Cabinet + filters) | Operations | 16 | 2024-Q3 | Filter UI, sector/territory facets, search index — 2 working days inside the 5-day Ops allocation | T5 | assumption · conservative indicative |
| ISRM-MOD-MVP-GRAPH | 02 · MVP | Graph (Network + Dependency) | Product | 32 | 2024-Q3 | Force-directed layout, dependency edges, partner graph variants — 4 working days inside the 10-day Prod allocation | T5 | assumption · conservative indicative |
| ISRM-MOD-PILOT-GRAPH | 03 · Pilot functions | Graph pilot enhancements (expert overlay, value-unlocks panel) | Product | 20 | 2024-Q3 | Expert overlay, value-unlocks panel, dependency traversal — 2.5 working days inside the 12.5-day Prod allocation | T5 | assumption · conservative indicative |
| ISRM-MOD-PILOT-DEP | 03 · Pilot functions | Dependencies view (cohort 2 + LinkedIn channel card) | Product | 16 | 2024-Q3 | Cohort 2 card, LinkedIn channel framing, conversion formula display — 2 working days inside the 12.5-day Prod allocation | T5 | assumption · conservative indicative |

The module hours are inside the partner and package totals, not added on top. Payment trigger is "on delivery/acceptance of the module" — the partner invoice references the module code, and the client accepts or rejects against the module's acceptance criterion. This keeps the core of the app (search + graph) inside a clear payment boundary even when the rest of the package is still in progress.

---

## 5. Package totals · T3 derived (sum of T2 × T1)

Each line is the package total, derived from the partner hours (§3) multiplied by the partner rate (§2). The three scenarios use the same hours and the three rate scenarios.

| Code | Package | Scenario | Total (GBP) | Formula | Tier | Status |
|------|---------|----------|-------------|---------|------|--------|
| ISRM-PKG01-LOW | 01 · Consulting & strategy | Low planning case | 1 200 | 48 h × £25/h | T3 | assumption · conservative indicative |
| ISRM-PKG01-BASE | 01 · Consulting & strategy | Base planning case | 1 776 | 48 h × £37/h | T3 | assumption · conservative indicative |
| ISRM-PKG01-HIGH | 01 · Consulting & strategy | High planning case | 2 352 | 48 h × £49/h | T3 | assumption · conservative indicative |
| ISRM-PKG02-LOW | 02 · Application MVP | Low planning case | 3 600 | 144 h × £25/h | T3 | assumption · conservative indicative |
| ISRM-PKG02-BASE | 02 · Application MVP | Base planning case | 5 328 | 144 h × £37/h | T3 | assumption · conservative indicative |
| ISRM-PKG02-HIGH | 02 · Application MVP | High planning case | 7 056 | 144 h × £49/h | T3 | assumption · conservative indicative |
| ISRM-PKG03-LOW | 03 · Pilot functions | Low planning case | 6 000 | 240 h × £25/h | T3 | assumption · conservative indicative |
| ISRM-PKG03-BASE | 03 · Pilot functions | Base planning case | 8 880 | 240 h × £37/h | T3 | assumption · conservative indicative |
| ISRM-PKG03-HIGH | 03 · Pilot functions | High planning case | 11 760 | 240 h × £49/h | T3 | assumption · conservative indicative |
| ISRM-PKG04-* | 04 · Remaining / additional | — | not yet derived | — | T3 | not yet derived |

The combined total for packages 01–03 in the base case is `1 776 + 5 328 + 8 880 = 15 984 GBP`. The combined total in the low case is `1 200 + 3 600 + 6 000 = 10 800 GBP`. The combined total in the high case is `2 352 + 7 056 + 11 760 = 21 168 GBP`. Package 04 is excluded from the combined total until its own line is registered.

---

## 6. Excluded and not-yet-derived items

The active proposal explicitly excludes the following items. They are recorded here so the partner and client know what is *not* in the indicative totals above, and so a future revision can register them when the data is available.

| Code | Excluded item | Why excluded | What is needed to register |
|------|---------------|---------------|------------------------------|
| ISRM-EXCL-HOSTING | Hosting | Post-pilot / not in MVP | Selected hosting provider, period, monthly cost |
| ISRM-EXCL-AIAPI | AI / API usage | Post-pilot / not in MVP | Selected provider, period, expected call volume |
| ISRM-EXCL-LEGAL | Legal and privacy work | Post-pilot / not in MVP | Selected advisor, hourly rate, period |
| ISRM-EXCL-REUSE | Reuse compensation for graph/search | Pending partner / client agreement | Agreed reuse rate, scope of reuse rights |
| ISRM-EXCL-TAX | Tax and ongoing support | Out of MVP scope | Per-jurisdiction rules; not registered yet |
| ISRM-EXCL-CONF | LinkedIn group confirmed experts | Cannot be fabricated (REQ-018) | Pilot measurement of confirmed expert share |
| ISRM-EXCL-MULT | Multiplier M = 3.0 (Maister / AIA DPE) | Historical / inactive; the active proposal is on direct labor, not on a commercial multiplier | Re-derive if a new commercial model requires the multiplier |
| ISRM-EXCL-2080H | 2 080 h greenfield cost €66,090 | Historical / inactive; superseded by the 4-package sequence with 432 h direct labor | None — kept for traceability only |
| ISRM-EXCL-198K | Commercial total Cost × 3 = €198,270 | Historical / inactive; derived from the historical 2 080 h scope and the M = 3.0 multiplier | None — kept for traceability only |
| ISRM-EXCL-54100 | Base MVP €54,100, 620 h, 10–12 weeks | Historical / inactive; superseded by the 4-package sequence | None — kept for traceability only |
| ISRM-EXCL-OSINT | AI OSINT 480 h × €45/h × 3 = €64,800 | Historical / inactive; AI/OSINT is outside the current MVP | None — kept for traceability only |
| ISRM-EXCL-TRANCHE | Tranches 30/40/30 (€59,481 / €79,308 / €59,481) | Historical / inactive; superseded by the active payment terms (≥30% first, on delivery/acceptance) | None — kept for traceability only |

Every excluded item is shown on the client proposal and the partner calculation as "excluded, not zero" — never as a confirmed included value.

---

## 7. Payment terms · active

These are the terms the active proposal uses, in plain language. They override the historical tranches.

| Code | Term | Value | Source | Status |
|------|------|-------|--------|--------|
| ISRM-PAY-DUE | Payment due on delivery/acceptance of each package | On acceptance | Active brief, REQ-020 | verified · active |
| ISRM-PAY-FIRST | First payment | ≥ 30% of the agreed total | Active brief, REQ-020 | verified · active |
| ISRM-PAY-MODULE | Module-level payment trigger for search and graph | Payment on delivery/acceptance of the module itself, not the whole package | Product owner direction 2026-10-06 | verified · active |
| ISRM-PAY-NOINSTAL | No invented installment split | No fixed installment table; per-delivery payments only | Active brief, REQ-020 | verified · active |
| ISRM-PAY-INDICATIVE | Indicative prices | All package totals are INDICATIVE · pending preliminary scope and budget-ceiling approval | Active brief, REQ-020 | verified · active |

---

## 7a. Fee tiers · T1 tier overlay

Each of the four packages can be delivered at one of three fee tiers. The tier scales the partner work, not the deliverables. The fee multiplier applies to the per-partner hours in §3 and the partner rate in §2.

| Code | Tier | Multiplier | Description | KPI (capacity created) | Go-no-go criterion |
|------|------|------------|-------------|------------------------|---------------------|
| ISRM-TIER-SELF | T-1 · Self-serve | × 1.0 | Partner runs the cycle with documentation; no active partner involvement beyond agreed deliverables | cycle count, publications, conferences | Deliverables present, board sign-off |
| ISRM-TIER-COPILOT | T-2 · Co-pilot | × 1.5 | Partner runs the cycle with active consulting sessions, agenda co-design, recruitment of veterans, topic facilitation | + 1-on-1 sessions held, agenda approved by board | Board approves agenda, cohort 2 measured, sessions held ≥ agreed count |
| ISRM-TIER-OPERATE | T-3 · Operate | × 2.0 | Partner runs the cycle AND runs publications, conferences, AI-OSINT assistance, AI-chatbot training, dashboards | + publications, conference plan, AI features gate | T-2 criteria + TII coverage measured + AI ethics approved |

The multiplier applies to the partner hours in §3, not to the partner rate. The product owner can pick the tier per package; the partner calculation page exposes the tier as a single radio control.

| Package | Tiers available |
|---------|-----------------|
| 01 · Consulting & strategy | T-1, T-2, T-3 |
| 02 · Application MVP | T-1, T-2 (T-3 N/A — MVP is build-only) |
| 03 · Pilot functions (with embedded cycle) | T-1, T-2, T-3 |
| 04 · Remaining / additional | T-1, T-2, T-3 |

---

## 7b. Unit economics · per-participant action

| Code | Participant action | Partner time | Fee @ base (£37/h) | Tier gate | Source |
|------|--------------------|--------------|--------------------|-----------|--------|
| ISRM-UE-CONTRIB | 1 contribution (input to network) | 0.5 h | £18.50 | T-1, T-2, T-3 | T5 row × rate; cycle research step |
| ISRM-UE-ARTICLE | 1 article (working group output) | 8–16 h | £296–£592 | T-2, T-3 | T2 row × rate; standard journal/whitepaper effort |
| ISRM-UE-PLACE | 1 placement (group/page join) | 0 h (system) | £0 | system feature | No partner time; system-handled |
| ISRM-UE-SERVICE | 1 client service (if admitted to group) | 2–4 h | £74–£148 | T-1, T-2, T-3 | T2 row × rate; service delivery overhead |
| ISRM-UE-CONF | 1 conference participation | 8–16 h | £296–£592 | T-2, T-3 | T2 row × rate; standard conference participation effort |
| ISRM-UE-OSINT | 1 OSINT-assisted search query | 0.5 h | £18.50 | T-3 only | T5 row × rate; AI OSINT assistance module |

---

## 7c. KPI per function · capacity each function creates

| Code | Function | KPI | Capacity metric | Gate | Status |
|------|----------|-----|------------------|------|--------|
| ISRM-KPI-SEARCH | Search (Member Cabinet + filters) | query response time | < 1s for n=100 experts | always on | technical KPI |
| ISRM-KPI-GRAPH | Graph (Network + Dependency) | nodes rendered | 178 current; 1 000 planned | always on | data-dependent |
| ISRM-KPI-DEPENDENCY | Dependency view | edges resolved | per function spec | always on | data-dependent |
| ISRM-KPI-CYCLE | Pilot cycle (embedded) | completed cycles per quarter | 1 baseline, target 4 | T-1 onwards | business KPI |
| ISRM-KPI-PUBLICATION | Publication (article) | articles per cycle | 2 baseline (T-2/T-3) | T-2, T-3 | business KPI |
| ISRM-KPI-CONF | Conference plan | plan ready before cycle end | yes/no | T-2, T-3 | business KPI |
| ISRM-KPI-OSINT | AI OSINT assistance | queries per cycle | 50 baseline | T-3 only | business KPI |
| ISRM-KPI-CHATBOT | AI chatbot | interactions per user per session | 3 baseline | T-3 only | business KPI |
| ISRM-KPI-DASHBOARD | Dashboards on the fly | generated per cycle | 5 baseline | T-3 only | business KPI |
| ISRM-KPI-TII | TII coverage | measured at gate | gate-conditioned | T-3 only · second pass | deferred |

---

## 7d. Go-no-go per tier

| Tier | Go criterion | No-go consequence |
|------|--------------|---------------------|
| T-1 · Self-serve | Deliverables present, board sign-off | Cycle is incomplete, partner repeats at no extra fee |
| T-2 · Co-pilot | T-1 criteria + board approves agenda + cohort 2 measured + sessions held ≥ agreed count | Cycle pauses; partner waits for board decision |
| T-3 · Operate | T-2 criteria + TII coverage measured + AI ethics approved | Forward features deferred; partner keeps base cycle completed |

---

## 7e. Pilot conversion model — LinkedIn audience → cohort 2, double-pricing view

The pilot LinkedIn Page is the named communications channel for forming cohort 2. The funnel is **single**, the revenue models are **two**: the client view multiplies the funnel output by an agreed association-subscription fee; the partner view multiplies the same funnel output by an agreed SaaS price per engaged user. The pilot measurement is the same for both views.

All values in this section are **ASSUMPTION · conservative indicative · planning reference · NOT a forecast**. They exist so the partner sees a usable planning target and so the client can see the conservative shape of the model; the actual numbers come from the pilot measurement, not from this section.

### 7e.1 · LinkedIn Page snapshot (Tier 1 verified, public)

The pilot audience anchor is the ISRM Ukraine LinkedIn Page, recorded by the Ukraine pilot CRM. Page followers are **aggregate public analytics**, not an exportable follower database; they are used as the size of the reach pool only because no group has a more granular verified number at this stage.

| Code | Value | Unit | Period | Source | Tier | Status |
|------|-------|------|--------|--------|------|--------|
| ISRM-PILOT-LI-FOLLOWERS | 8 742 | LinkedIn Page followers | snapshot 2026-08-28 | `ISRM_Ukraine_Community_CRM_178_FandP/CRM Dashboard-Table 1.csv` ("LinkedIn public snapshot · Value · Page followers 8742 · Snapshot date 2026-08-28") | T1 | verified · Pilot CRM record |
| ISRM-PILOT-LI-EMP | 44 | LinkedIn public profiles listing ISRM as employer | snapshot 2026-08-28 | Same source ("Associated employee profiles 44") | T1 | verified · Pilot CRM record |
| ISRM-PILOT-LI-CO-SIZE | "10 001+" | LinkedIn Page company-size setting | snapshot 2026-08-28 | Same source ("Company-size setting 10,001+ (not membership)") — explicitly flagged "not ISRM membership count" | T1 | verified · explicitly NOT membership |
| ISRM-PILOT-LI-NO-FOLLOWERS-EXPORT | "not available" | Follower names as a list | snapshot 2026-08-28 | Same source ("Follower names export: Not available as a complete list") | T1 | verified · data-quality constraint |
| ISRM-PILOT-LI-GROUP-OBS | 11 750 | LinkedIn group members observed in a screenshot | capture date not recorded | User-provided LinkedIn group screenshot; capture date unrecorded | T5 | assumption · unverified · not used as denominator; superseded by ISRM-PILOT-LI-FOLLOWERS for the active reach anchor |

The page followers are an aggregate count, not a consented member list. REQ-018 forbids using any name-level LinkedIn data; only this aggregate anchor is allowed in calculations. "10 001+" is the page-level **setting**, not a member count, and is not used as a denominator or as a reach number. The user-supplied group observation (11,750) is recorded for traceability but is **not** used as the active reach denominator: it lacks a recorded capture date and a verifiable source URL, so it is `unverified` and is explicitly superseded by the verified Page snapshot in the active calculation.

### 7e.2 · Conversion funnel — three conservative indicative rates

The four-slot conversion formula is the active spec (see plan v2 §7). Three of the four slots are rates, the fourth (paid ÷ accepted shown the offer) is the offer-specific response and is left as an open partner/client input. Each rate below is the **low end of a publicly cited range**, picked so the funnel output is conservative and so there is room for the actual pilot number to exceed it.

Every rate is anchored by **at least two independent published sources** retrieved in 2026-10-07. Where two sources disagree, the lower band is taken; where the chosen rate is below the lower cited bound, the reasoning is recorded explicitly. AGENTS.md rule "Cross-reference quantitative claims with at least two credible sources" is enforced here.

| Code | Funnel step | Conservative rate | Public benchmark anchors (cross-referenced) | Why we sit at this rate | Tier | Status |
|------|--------------|-------------------|-----------------------------------------------|---------------------------|------|--------|
| ISRM-PILOT-CONV-R1-APP | Reach → volunteer application | 2.0 % | (a) LinkedIn organic engagement by impression for company pages 2.05 % (https://blog.closelyhq.com/linkedin-company-page-benchmarks-followers-engagement-and-growth-rates/); professional services B2B 2.15–3.20 % (https://www.bigeyeagency.com/insights/social-media-engagement-rate-benchmarks-by-industry, https://www.linkedin.com/pulse/linkedin-law-firms-2026-legal-industry-organic-benchmarks-gynec); (b) voluntary-association free-trial response 3–5 % initial outreach (https://www.linkedin.com/pulse/how-associations-use-free-trial-memberships-growand-what-tony-rossell-kqmof); (c) Rival IQ 2024 median 0.41 % by follower (https://www.rivaliq.com/blog/linkedin-benchmark-report/) | Picked at the **lower bound** of the professional-services engagement band and **below** the association free-trial response band — niche single-country chapter, not a global brand. Reach is the "unique followers the call-to-action reached" denominator, not raw impressions, which makes 2.0 % a deliberately tight upper bound. Lower bound of any cited range. | T5 | assumption · conservative indicative · cross-referenced ≥ 2 sources |
| ISRM-PILOT-CONV-R2-ACC | Application → accepted new member | 30 % | (a) Glue Up membership funnel opportunity-to-committed 15–30 % (cited in https://kirro.io/funnel-conversion-rate-benchmarks); (b) Tony Rossell voluntary-association free-trial 20–30 % (https://www.linkedin.com/pulse/how-associations-use-free-trial-memberships-growand-what-tony-rossell-kqmof); (c) Raklet 2024 application completion 70–90 % (https://www.raklet.com/blog/membership-funnel/) — note: Raklet measures start-to-completion, not application-to-acceptance | Picked at the **upper bound** of Glue Up opportunity-to-committed (15–30 %) and the **lower bound** of Rossell free-trial-to-accepted (20–30 %). Assumes a manual review / LinkedIn-verified identity gate at admission. If gate criteria become lighter, this rate may exceed 30 % in the pilot measurement — the conservative pick is for budget-anchor purposes only. | T5 | assumption · conservative indicative · cross-referenced ≥ 2 sources |
| ISRM-PILOT-CONV-R3-PAID | Accepted → paid (offer-specific response) | 25 % | (a) Tony Rossell voluntary-association trial-to-paid 20–30 %, with permission-to-invoice raising to 50 % (https://www.linkedin.com/pulse/how-associations-use-free-trial-memberships-growand-what-tony-rossell-kqmof); (b) MGI 2025 first-year renewal 74 % (https://www.raklet.com/blog/membership-funnel/) — renewal, not initial; (c) ARO 2024 Membership Marketing Benchmarking Report (https://aro.org/wp-content/uploads/2024/08/The_2024_Membership_Marketing_Benchmarking_Report.pdf) | Picked at the **mid-point** of the association free-trial-to-paid band (20–30 %). This is the most sensitive step because the offer is bespoke; if the client offers permission-to-invoice or a discount, the pilot number may exceed 25 %, which the conservative pick deliberately leaves room for. | T5 | assumption · conservative indicative · cross-referenced ≥ 2 sources · offer-specific |

The fourth slot (paid ÷ accepted) is the **offer-specific response** and is intentionally not assigned a default rate: the specific offer (subscription fee, what is included) is the client's choice and changes the response. The partner can enter the offer response once the client supplies the offer; until then it is blank, like every pilot input.

### 7e.3 · Subscription fee · verified anchor + client input (theisrm.org)

The subscription fee is published on the ISRM website for each membership tier. The verified anchor table below records the public prices; the active figure for the pilot is the client's choice of tier. The most relevant professional tier for the Ukraine pilot is M.ISRM (Certified) at £100/year — that is the planning default; the client/board may choose Associate, Fellow or Student tiers or a multi-year discount.

| Code | Tier | Verified annual fee | Multi-year equivalent | Lifetime | Source |
|------|------|---------------------|------------------------|----------|--------|
| ISRM-EXT-ISRM-MEM-STUDENT | Student | £25 / year | — | — | theisrm.org/membership/ · verified 2026-10-07 |
| ISRM-EXT-ISRM-MEM-M | Certified (M.ISRM) | £100 / year | 5-Year £400 = £80/yr | £800 | theisrm.org/membership/ + theisrm.org/isrm-multi-year-membership/ · verified 2026-10-07 |
| ISRM-EXT-ISRM-MEM-ASSOC | Associate | £150 / year | 5-Year £600 = £120/yr | £1,200 | theisrm.org/membership/ · verified 2026-10-07 |
| ISRM-EXT-ISRM-MEM-FELLOW | Fellow (F.ISRM) | £150 / year | 5-Year £600 = £120/yr | £1,200 | theisrm.org/membership/ + multi-year page · verified 2026-10-07 |
| ISRM-EXT-ISRM-MEM-ANZ | Australia/NZ chapter promo (50% off M.ISRM) | ~£50 / year (50% off) | — | — | LinkedIn Pulse, 2025-09-10 · assumption · offer-specific, time-limited |

**Active planning default for the Ukraine pilot**: £100/year (M.ISRM). The client/board may override the tier; the override is recorded against `ISRM-PILOT-SUB-FEE` with a timestamp and a reason field. All funnel outputs in §7e.6 and the partner tables §11 use the M.ISRM anchor at £100 unless the client supplies a different tier.

| Code | Slot | Verified anchor | Unit | Status |
|------|------|-----------------|------|--------|
| ISRM-PILOT-SUB-FEE | Annual subscription fee (planning default: M.ISRM) | **£100** (verified theisrm.org) | GBP per paid member per year | verified · Tier 1 · planning default for Ukraine pilot |

### 7e.4 · What is NOT modelled in the cohort 2 funnel

The cohort 2 funnel in §7e.1–§7e.3 has only one revenue view: **verified ISRM membership subscription**. There is no second revenue line, no SaaS view, no hypothetical product line.

A SaaS revenue stream would require:
- a priced product (e.g. "platform services" with a per-seat fee);
- a verifiable engagement definition (e.g. "active services users in the period");
- a verified source for both the product price and the engagement definition.

ISRM does not currently sell such a product. Modelling a SaaS revenue line without those three verified inputs is wishful, and was removed from the registry on 2026-10-07. If a product is later created and priced, the cohort 2 funnel can be extended with a second revenue line.

#### 7e.4 · Removed Values Log (2026-10-07, per AGENTS.md DATA-10)

| Removed value | Where it lived | Why removed | Status of removal |
|---------------|----------------|-------------|---------------------|
| `ISRM-PILOT-SAAS-PRICE = £240/year` | §7e.4 of an earlier revision of this registry; xlsx `Cohort 2 Funnel` B9; partner-finance Section 9 input; proposal route cohort 2 addendum | ISRM does not currently sell a SaaS product. The £240 anchor was a generic B2B SaaS comparator (£20/month), not an ISRM-published price. Modelling it as if it were a real revenue line is wishful. | **Removed** from registry, xlsx, partner-finance route, proposal route, client-proposal-data |
| `ISRM-PILOT-SAAS-ENGAGE = 0.5 %` | §7e.5 of an earlier revision; xlsx `Cohort 2 Funnel` B7; partner-finance Section 9 input | Same reason: depends on a non-existent product. The 0.5 % engagement share was derived from generic SaaS conversion tables (Metricuno, First Page Sage, etc.) and had no anchor to an actual ISRM engagement definition. | **Removed** |
| Sensitivity tables "Token / Self-sustaining / Real SaaS / Large SaaS" with 3-parameter-move scenarios | §7f of an earlier revision; xlsx `SaaS Feasibility` sheet (Sheet 6); partner-finance route narrative | Wishful scenarios. The "all 3 parameters move" case was a synthetic projection, not derived from any verified input. Per AGENTS.md DATA-11 "no wishful thinking NEVER" and FLOW-6 "ZERO wishful thinking". | **Removed** |
| `partner view · SaaS revenue ≈ £10 560/year` | §7e.6 partner-view row; partner tables Tables 18 + 18a | Derived from the removed £240 anchor and 0.5 % engagement share | **Removed** |
| `partner view ≈ £10 560/year at 44 engaged users` | partner tables Table 18; partner-finance Section 9 "Partner view" panel | Same | **Removed** |
| `partner view SaaS × SaaS price ≈ £10 560` | xlsx cohort 2 funnel row 19; partner-finance Section 9 Partner view | Same | **Removed** |
| Any use of the label "Real SaaS" or "Self-sustaining" or "Token" as a cohort 2 revenue band | Registry §7f, partner tables §11, executive summary, partner-finance route | These labels referred to scenarios that relied on the removed £240 anchor and 0.5 % engagement share | **Removed** |
| `Verified Tier 1 anchor: theisrm.org/membership/` listed as "canonical source" in §7e.3 row descriptions | Earlier revision of §7e.3 and hand-off §7.1 | Per AGENTS.md DATA-12, the label "canonical" is reserved for verified Tier 1 anchors that come from the actual organization. theisrm.org is verified Tier 1 (the actual organization), but is referred to as "verified Tier 1 source" not "canonical source" in this revision. | **Renamed** in the registry; the underlying theisrm.org URLs and values are unchanged |

The Removed Values Log records the literals that were removed and where they used to live. Every dependent artifact (registry, xlsx, partner-finance route, proposal route, client-proposal-data, partner tables, executive summary, hand-off) has been updated. A grep for "£240", "ISRM-PILOT-SAAS", "Token", "Self-sustaining", or "Real SaaS" in the project files returns no matches; a grep for "Canonical" in registry tables returns only the verified registry-code annotations (e.g. `ISRM-EXT-ISRM-MEM-*`), not the word "canonical" applied to a file or source.

### 7e.5 · Derived output · subscription revenue only

Verified anchor: ISRM M.ISRM tier, £100/year (from theisrm.org/membership/, retrieved 2026-10-07).

```
new paid members  =  Reach × R1 × R2 × R3
subscription £    =  new paid members × ISRM-PILOT-SUB-FEE
```

Conservative indicative under the §7e.2 default rates, the §7e.1 verified reach, and the §7e.3 verified M.ISRM fee of £100:

```
Reach          = 8 742
applications   = 8 742 × 2.0 %  ≈ 175
accepted       = 175 × 30 %     ≈ 53
paid           = 53 × 25 %      ≈ 13 new paid members
subscription £ ≈ 13 × £100      = £1 300 (first-year cohort 2 membership revenue)
```

**Honest product-owner read**: £1 300 in first-year cohort 2 membership revenue is token, not a business. It is the only revenue line that exists for the pilot today. The pilot's role is measurement, not scale.

### 7e.6 · What the client and partner each see

| Surface | Audience | What is shown |
|---------|----------|----------------|
| Client proposal (`src/routes/proposal.tsx`) | Client / board | Subscription view only. The four input slots stay blank until pilot measurement; the conservative indicative funnel rates are referenced in a small "planning reference" note that explicitly says "not a forecast". |
| Partner financial page (`src/routes/partner-finance.tsx`) | The three partners | Subscription view only (Section 9). Reach and the three conversion rates are editable inputs; the subscription fee has the verified M.ISRM anchor at £100. The section is marked "planning reference · not a forecast". |
| Registry (`plan/feature-isrm-price-calculations-v1.md`) | All readers of the financial file | §7e.1–§7e.5 — the only source of numeric values for the cohort 2 funnel. |
| Partner tables (`plan/feature-isrm-partner-financial-tables-v1.md`) | Partners | §11 / Tables 15–18, mirroring §7e.1–§7e.5. |

The client and partner see the **same** subscription view; the only difference is what they do with the inputs (the partner can edit them, the client cannot). A change to a conservative indicative rate in §7e.2 updates both views.

### 7e.7 · Reactivity contract for §7e

Every line in §7e.1–§7e.3 has a `registryCode`. The TypeScript data files in `src/lib/proposal-data.ts` and `src/lib/client-proposal-data.ts` are updated to mirror the verified lines (only §7e.1 — LinkedIn snapshot — and §7e.3 — verified ISRM tier anchors — are Tier 1; §7e.2 funnel rates are `assumption · conservative indicative` with ≥ 2 cross-referenced public sources). The partner calculation page (`/partner-finance`) Section 9 exposes reach, the three conversion rates, and the subscription fee as editable inputs; each override is recorded against the registry code with a timestamp and a reason field. The client proposal page (`/proposal`) keeps the four input slots visibly empty in the cohort 2 card and adds a single inline paragraph that references §7e.2 as a planning reference.

---

## 8. Verification queue (next revision)

The lines flagged `unverified` should be re-checked before the next client-facing iteration. The order of priority is:

1. Re-retrieve the linked Clutch pricing pages and confirm the $25–$49 band, or replace with a recorded public source and a named period.
2. Promote the DOU.ua figures from Tier 3/4 to Tier 1 if a formally published PDF is cited in a later revision.
3. Re-derive the work-package hours after the partner has reviewed and adjusted each T2 line.
4. Register the consulting and remaining packages once a scope and rate are agreed.
5. Register the excluded items in §6 as they become in-scope.

When a line moves from `unverified` to `verified`, the change is recorded with the source URL, the retrieval date and the product owner's confirmation in this document. The TypeScript data files in `src/lib/proposal-data.ts` and `src/lib/client-proposal-data.ts` are then updated to mirror the verified value, with the `verified` status passed through to the partner and client surfaces.

---

## 9. Carry-over

- The historical anchors (Cost × 3, €198,270, €66,090, €54,100, 480 h AI OSINT) are now marked `historical/inactive` in §6 and remain in the registry for traceability only.
- The active calculation is in GBP at three rate scenarios (£25 / £37 / £49) and a 432 h direct-labor total across packages 01–03.
- The TypeScript data files in `src/lib/proposal-data.ts` and `src/lib/client-proposal-data.ts` should be updated to mirror §2 (rates) and §3 (hours) with the same `registryCode` annotation on every value.
- The partner calculation page in `src/components/PartnerProposal.tsx` is expected to expose every partner hour and rate as an editable input, with overrides recorded against the registry code.
