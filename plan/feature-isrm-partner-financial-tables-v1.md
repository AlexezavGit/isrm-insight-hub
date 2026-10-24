---
goal: Tabular source of truth for the partner-facing financial block; every value links to a registry code in feature-isrm-price-calculations-v1.md
version: 1.0
date_created: 2026-10-06
last_updated: 2026-10-06
owner: ISRM product owner
status: "Draft for review · rates are ASSUMPTION · conservative indicative"
depends_on: feature-isrm-price-calculations-v1.md
---

# ISRM partner financial tables · v1

This document is the **partner-facing** financial source. Every number carries a `registryCode` that resolves to the canonical rate or hour in `feature-isrm-price-calculations-v1.md`. Changing any rate in the registry updates the totals here; the change is visible the moment the registry is republished.

**Audience**: the three ISRM Ukraine chapter partners. The client does not see this document; the client sees the executive summary in `feature-isrm-partner-financial-summary-v1.md` and the proposal page in the application.

**Currency**: GBP. Every value is in pounds.

**Three partners** (per the active proposal):
- `client-comms` — Client communications + business development
- `ops` — Operations, OSINT, events, external communications
- `product` — Product, strategy, vendor coordination

All three partners share the same planning-default hourly rate. Hours differ by function and responsibility.

---

## Table 1. Partner rate card

| Code | Value | Unit | Period | Status |
|------|-------|------|--------|--------|
| ISRM-RATE-PARTNER-LOW | 25 | GBP/h | 2024-Q3 | assumption · conservative indicative |
| ISRM-RATE-PARTNER-BASE | 37 | GBP/h | 2024-Q3 | assumption · conservative indicative |
| ISRM-RATE-PARTNER-HIGH | 49 | GBP/h | 2024-Q3 | assumption · conservative indicative |

The three rate scenarios come from the registry §2. Any partner can override the value in the partner calculation page; the override is recorded against the partner's user role and a timestamp. The planning default displayed to all three partners is the `BASE` row.

---

## Table 2. Partner × package × scenario (planning default)

This is the partner-facing total per package, per scenario, derived from the registry hours (§3) × the rate card (Table 1). The total reflects the three partners' combined hours, not any single partner's hours.

| Package | Hours (all 3 partners) | Low @ £25/h | Base @ £37/h | High @ £49/h | Registry totals (T3) |
|---------|------------------------|--------------|---------------|---------------|----------------------|
| 01 · Consulting & strategy | 48 | 1 200 | 1 776 | 2 352 | ISRM-PKG01-LOW / -BASE / -HIGH |
| 02 · Application MVP | 144 | 3 600 | 5 328 | 7 056 | ISRM-PKG02-LOW / -BASE / -HIGH |
| 03 · Pilot functions (with embedded cycle) | 240 | 6 000 | 8 880 | 11 760 | ISRM-PKG03-LOW / -BASE / -HIGH |
| 04 · Remaining / additional | not yet derived | — | — | — | ISRM-PKG04-* (not yet derived) |
| **Combined (01–03)** | **432** | **10 800** | **15 984** | **21 168** | arithmetic sum of the three T3 lines |

---

## Table 3. Partner × package × role × hours (planning default)

This is the per-partner hour allocation. Each cell is a registry T2 line. The three partners see the same table; each partner uses their own row to enter the agreed hours for their role.

| Package | client-comms (T2) | ops (T2) | product (T2) | Σ per package | Registry codes |
|---------|-------------------|----------|--------------|---------------|-----------------|
| 01 · Consulting & strategy | 16 | 8 | 24 | 48 | ISRM-HRS-PKG01-CLIENT / -OPS / -PROD |
| 02 · Application MVP | 24 | 40 | 80 | 144 | ISRM-HRS-PKG02-CLIENT / -OPS / -PROD |
| 03 · Pilot functions | 60 | 80 | 100 | 240 | ISRM-HRS-PKG03-CLIENT / -OPS / -PROD |
| 04 · Remaining / additional | — | — | — | — | ISRM-HRS-PKG04-* (not yet derived) |
| **Σ per partner** | **100** | **128** | **204** | **432** | arithmetic sum of the three T2 lines |

The product role carries the most hours because of the strategic and vendor-coordination load; the operations role is next because of the data import and review work; the client-comms role is the smallest but consistent because stakeholder alignment is required in every package.

---

## Table 4. Per-partner pay (planning default, base rate)

Each partner's pay is `their hours × £37/h` (base scenario). The two other scenarios are shown in Tables 5 and 6.

| Partner role | Hours (Σ across 01–03) | Base pay @ £37/h | Registry codes |
|--------------|------------------------|------------------|-----------------|
| client-comms | 100 | 3 700 | ISRM-HRS-PKG0{1,2,3}-CLIENT × ISRM-RATE-PARTNER-BASE |
| ops | 128 | 4 736 | ISRM-HRS-PKG0{1,2,3}-OPS × ISRM-RATE-PARTNER-BASE |
| product | 204 | 7 548 | ISRM-HRS-PKG0{1,2,3}-PROD × ISRM-RATE-PARTNER-BASE |
| **Σ (combined 3-partner pay)** | **432** | **15 984** | arithmetic sum |

The three partners are paid the same rate per hour; the difference in pay is purely a function of the hours assigned to each role. The hours are justified by the standard time expenditure for the role's function in each package (registry §3).

---

## Table 5. Per-partner pay · low scenario (@ £25/h)

| Partner role | Hours (Σ across 01–03) | Low pay @ £25/h | Registry codes |
|--------------|------------------------|------------------|-----------------|
| client-comms | 100 | 2 500 | × ISRM-RATE-PARTNER-LOW |
| ops | 128 | 3 200 | × ISRM-RATE-PARTNER-LOW |
| product | 204 | 5 100 | × ISRM-RATE-PARTNER-LOW |
| **Σ** | **432** | **10 800** | arithmetic sum |

---

## Table 6. Per-partner pay · high scenario (@ £49/h)

| Partner role | Hours (Σ across 01–03) | High pay @ £49/h | Registry codes |
|--------------|------------------------|------------------|-----------------|
| client-comms | 100 | 4 900 | × ISRM-RATE-PARTNER-HIGH |
| ops | 128 | 6 272 | × ISRM-RATE-PARTNER-HIGH |
| product | 204 | 9 996 | × ISRM-RATE-PARTNER-HIGH |
| **Σ** | **432** | **21 168** | arithmetic sum |

---

## Table 7. Module lines · T5 (search and graph are the core of the app)

The search and graph modules are identified as separate lines inside the relevant packages so that payment can be triggered on the delivery/acceptance of the module itself. The module hours are a sub-allocation of the package hours in Table 3, not an addition.

| Code | Package | Module | Role | Hours | Low @ £25/h | Base @ £37/h | High @ £49/h |
|------|---------|--------|------|-------|--------------|---------------|---------------|
| ISRM-MOD-MVP-SEARCH | 02 · MVP | Search (Member Cabinet + filters) | ops | 16 | 400 | 592 | 784 |
| ISRM-MOD-MVP-GRAPH | 02 · MVP | Graph (Network + Dependency) | product | 32 | 800 | 1 184 | 1 568 |
| ISRM-MOD-PILOT-GRAPH | 03 · Pilot | Graph pilot enhancements (expert overlay, value-unlocks) | product | 20 | 500 | 740 | 980 |
| ISRM-MOD-PILOT-DEP | 03 · Pilot | Dependencies view (cohort 2 + LinkedIn channel) | product | 16 | 400 | 592 | 784 |

The module total in the base scenario is `592 + 1 184 + 740 + 592 = 3 108 GBP`. This is part of the 15 984 GBP combined total in Table 4; it is shown separately so payment can be triggered on the module's delivery, not only on the package as a whole.

---

## Table 8. Excluded and not-yet-derived items (registry §6)

The combined total of 15 984 GBP (base scenario) and the module total of 3 108 GBP (base scenario) **do not include** the items below. Each item is recorded with its own registry code.

| Code | Excluded item | Status |
|------|---------------|--------|
| ISRM-EXCL-HOSTING | Hosting | excluded · not in MVP |
| ISRM-EXCL-AIAPI | AI / API usage | excluded · not in MVP |
| ISRM-EXCL-LEGAL | Legal and privacy work | excluded · not in MVP |
| ISRM-EXCL-REUSE | Reuse compensation | excluded · pending agreement |
| ISRM-EXCL-TAX | Tax and ongoing support | excluded · out of scope |
| ISRM-EXCL-CONF | LinkedIn group confirmed experts | excluded · awaiting pilot measurement |
| ISRM-EXCL-MULT | Multiplier M = 3.0 (Maister / AIA DPE) | historical / inactive |
| ISRM-EXCL-2080H | 2 080 h greenfield cost €66,090 | historical / inactive |
| ISRM-EXCL-198K | Commercial total Cost × 3 = €198,270 | historical / inactive |
| ISRM-EXCL-54100 | Base MVP €54,100, 620 h, 10–12 weeks | historical / inactive |
| ISRM-EXCL-OSINT | AI OSINT 480 h × €45/h × 3 = €64,800 | historical / inactive |
| ISRM-EXCL-TRANCHE | Tranches 30/40/30 (€59,481 / €79,308 / €59,481) | historical / inactive |

These items are not zero. They are excluded; the partner and client must agree to register them separately if and when they become in-scope.

---

## Table 9. Payment terms (active · registry §7)

| Code | Term | Value |
|------|------|-------|
| ISRM-PAY-DUE | Payment due on delivery/acceptance of each package | On acceptance |
| ISRM-PAY-FIRST | First payment | ≥ 30% of the agreed total |
| ISRM-PAY-MODULE | Module-level payment trigger for search and graph | On delivery/acceptance of the module |
| ISRM-PAY-NOINSTAL | No invented installment split | Per-delivery payments only |
| ISRM-PAY-INDICATIVE | Indicative prices | All totals are INDICATIVE pending scope and budget-ceiling approval |

---

## Table 10. Fee tier mapping (registry §7a)

| Package | T-1 · Self-serve × 1.0 | T-2 · Co-pilot × 1.5 | T-3 · Operate × 2.0 |
|---------|------------------------|----------------------|---------------------|
| 01 · Consulting & strategy | ✓ | ✓ | ✓ |
| 02 · Application MVP | ✓ | ✓ | — (T-3 N/A) |
| 03 · Pilot functions | ✓ | ✓ | ✓ |
| 04 · Remaining / additional | ✓ | ✓ | ✓ |

The multiplier applies to the partner hours in Table 3, not to the rate.

---

## Table 11. Per-package total × tier × scenario (registry §5 × §7a)

| Package | Tiers | Low (T-1 × £25/h) | Base (T-1 × £37/h) | High (T-1 × £49/h) | Base × T-1.5 (T-2) | Base × T-2.0 (T-3) |
|---------|-------|--------------------|--------------------|--------------------|--------------------|------------------|
| 01 · Consulting | 48 h | 1 200 | 1 776 | 2 352 | 2 664 | 3 552 |
| 02 · Application MVP | 144 h | 3 600 | 5 328 | 7 056 | 7 992 | — (T-3 N/A) |
| 03 · Pilot functions | 240 h | 6 000 | 8 880 | 11 760 | 13 320 | 17 760 |
| 04 · Remaining | not yet derived | — | — | — | — | — |
| **Σ 01–03 (T-1 base)** | **432 h** | **10 800** | **15 984** | **21 168** | n/a | n/a |
| **Σ 01–03 (T-2 base)** | 432 × 1.5 = 648 h | n/a | n/a | n/a | **23 976** | n/a |
| **Σ 01–03 (T-3 base, where applicable)** | 432 × 2.0 = 864 h | n/a | n/a | n/a | n/a | **31 968** (PKG01 + PKG03 only; PKG02 is T-2 max) |

---

## Table 12. Unit economics per participant action (registry §7b)

| Code | Action | Partner time | Fee @ base | Tier gate |
|------|--------|--------------|------------|-----------|
| ISRM-UE-CONTRIB | 1 contribution | 0.5 h | £18.50 | all |
| ISRM-UE-ARTICLE | 1 article | 8–16 h | £296–£592 | T-2/T-3 |
| ISRM-UE-PLACE | 1 placement | 0 h | £0 | system |
| ISRM-UE-SERVICE | 1 client service | 2–4 h | £74–£148 | all |
| ISRM-UE-CONF | 1 conference participation | 8–16 h | £296–£592 | T-2/T-3 |
| ISRM-UE-OSINT | 1 OSINT-assisted search | 0.5 h | £18.50 | T-3 |

---

## Table 13. KPI per function · capacity (registry §7c)

| Code | Function | KPI | Capacity metric | Gate |
|------|----------|-----|------------------|------|
| ISRM-KPI-SEARCH | Search | query response time | < 1s for n=100 | always on |
| ISRM-KPI-GRAPH | Graph | nodes rendered | 178 → 1 000 | always on |
| ISRM-KPI-DEPENDENCY | Dependency | edges resolved | per function spec | always on |
| ISRM-KPI-CYCLE | Pilot cycle | completed/quarter | 1 → 4 | T-1+ |
| ISRM-KPI-PUBLICATION | Publication | articles/cycle | 2 baseline | T-2/T-3 |
| ISRM-KPI-CONF | Conference plan | plan ready by cycle end | yes/no | T-2/T-3 |
| ISRM-KPI-OSINT | AI OSINT | queries/cycle | 50 baseline | T-3 only |
| ISRM-KPI-CHATBOT | AI chatbot | interactions/user/session | 3 baseline | T-3 only |
| ISRM-KPI-DASHBOARD | Dashboards | generated/cycle | 5 baseline | T-3 only |
| ISRM-KPI-TII | TII coverage | measured at gate | gate-conditioned | T-3 · 2nd pass |

---

## Table 14. Go-no-go per tier (registry §7d)

| Tier | Go criterion | No-go consequence |
|------|--------------|---------------------|
| T-1 · Self-serve | Deliverables present, board sign-off | Cycle is incomplete, partner repeats at no extra fee |
| T-2 · Co-pilot | T-1 + board approves agenda + cohort 2 measured + sessions held ≥ agreed | Cycle pauses; partner waits for board |
| T-3 · Operate | T-2 + TII coverage measured + AI ethics approved | Forward features deferred; partner keeps base cycle |

---

## §11. Pilot cohort 2 · LinkedIn → cohort 2, subscription view

This section mirrors registry §7e. It is the partner-facing view of the pilot conversion model. There is **one** revenue line: verified ISRM membership subscription, multiplied by the verified reach through the conservative funnel rates. There is no second revenue line. The partner calculation page (`/partner-finance`) Section 9 exposes reach, the three conversion rates, and the subscription fee as editable inputs; each override is recorded against the registry code.

### Table 15. LinkedIn Page snapshot · verified (registry §7e.1)

The pilot audience anchor. Page followers are aggregate public analytics from the Ukraine pilot CRM; they are not an exportable follower database. "10 001+" is the page-level **setting**, not a member count, and is **not** used as a denominator or as a reach number.

| Code | Value | Unit | Period | Source |
|------|-------|------|--------|--------|
| ISRM-PILOT-LI-FOLLOWERS | 8 742 | LinkedIn Page followers | snapshot 2026-08-28 | `ISRM_Ukraine_Community_CRM_178_FandP/CRM Dashboard-Table 1.csv` |
| ISRM-PILOT-LI-EMP | 44 | LinkedIn public profiles listing ISRM as employer | snapshot 2026-08-28 | Same file |
| ISRM-PILOT-LI-CO-SIZE | "10 001+" | LinkedIn Page company-size setting | snapshot 2026-08-28 | Same file — explicitly NOT a membership count |
| ISRM-PILOT-LI-NO-FOLLOWERS-EXPORT | "not available" | Follower names as a list | snapshot 2026-08-28 | Same file — data-quality constraint |

### Table 16. Conversion funnel · three conservative indicative rates (registry §7e.2)

The four-slot formula is the active spec (see plan v2 §7). The fourth slot is the offer-specific response; it is left as an open partner/client input, not as a default rate. The three rates below are the **low end** of each cited range — picked so the funnel output is conservative.

| Code | Funnel step | Conservative rate | Reasoning |
|------|--------------|-------------------|------------|
| ISRM-PILOT-CONV-R1-APP | Reach → volunteer application | 2.0 % | LinkedIn organic-engagement B2B benchmark (~2 % Hootsuite 2024 / HubSpot 2024); adjusted to lower band for niche single-country chapter |
| ISRM-PILOT-CONV-R2-ACC | Application → accepted new member | 30 % | Typical professional-association acceptance after a gate step; below the 50 % upper bound of LinkedIn Recruiter apply-to-screen funnel |
| ISRM-PILOT-CONV-R3-PAID | Accepted → paid (offer-specific) | 25 % | Typical voluntary-association free-to-paid conversion for niche professional bodies; offer-specific response — most sensitive step |

### Table 17. Client view · subscription (registry §7e.6, client-only)

This is what the association earns from cohort 2 in the first pilot year. Subscription fee is a client input and is blank until supplied.

```
new paid members  =  Reach × R1 × R2 × R3
subscription £    =  new paid members × ISRM-PILOT-SUB-FEE      (per year)
```

| Code | Slot | Value | Period | Status |
|------|------|-------|--------|--------|
| ISRM-PILOT-REACH | LinkedIn reach (planning reference) | 8 742 | first pilot year | assumption · conservative indicative · verified snapshot |
| — | Applications | 8 742 × 2.0 % ≈ 175 | first pilot year | derived · conservative |
| — | Accepted | 175 × 30 % ≈ 53 | first pilot year | derived · conservative |
| — | Paid new members | 53 × 25 % ≈ 13 | first pilot year | derived · conservative |
| ISRM-PILOT-SUB-FEE | Annual subscription fee | open · awaiting client input | per paid member / year | client-side · blank |
| — | Subscription revenue | ≈ 13 × fee | first pilot year | derived · not shown until fee is supplied |

The `≈ 13 new paid members` is the only numeric output visible until the client supplies the subscription fee. The client does the arithmetic themselves.

### Table 18. Subscription view · verified anchor and derived output (registry §7e.5)

This is what the association earns from cohort 2 membership fees in the first pilot year. It is the **only** revenue line in the cohort 2 model.

```
new paid members =  Reach × R1 × R2 × R3
subscription £   =  new paid members × ISRM-PILOT-SUB-FEE
```

| Code | Slot | Value | Period | Status |
|------|------|-------|--------|--------|
| ISRM-PILOT-LI-FOLLOWERS | LinkedIn reach (verified snapshot 2026-08-28) | 8 742 | first pilot year | verified · Tier 1 · CRM Dashboard |
| ISRM-PILOT-CONV-R1-APP | R1 · Reach → application | 2.0 % | conservative | assumption · cross-referenced ≥ 2 sources |
| ISRM-PILOT-CONV-R2-ACC | R2 · Application → accepted | 30 % | conservative | assumption · cross-referenced ≥ 2 sources |
| ISRM-PILOT-CONV-R3-PAID | R3 · Accepted → paid | 25 % | conservative | assumption · cross-referenced ≥ 2 sources |
| ISRM-PILOT-SUB-FEE | Annual subscription fee (planning default: M.ISRM) | £100 | per paid member / year | verified · Tier 1 · theisrm.org |
| — | Applications | ~175 | first pilot year | derived · conservative |
| — | Accepted | ~53 | first pilot year | derived · conservative |
| — | Paid new members | ~13 | first pilot year | derived · conservative |
| — | Subscription revenue (first-year) | 13 × £100 = **£1 300** | first pilot year | derived · conservative · verified anchor · first-year cohort 2 |

The `≈ £1 300` figure is the **only** numeric output. It is the verified M.ISRM tier multiplied by the conservative funnel output. There is no second revenue line.

---

## Reactivity contract

Changing any value in the registry (`feature-isrm-price-calculations-v1.md`) is reflected here, in the partner calculation page in `src/components/PartnerProposal.tsx`, in the client proposal page in `src/routes/proposal.tsx`, and in the executive summary in `feature-isrm-partner-financial-summary-v1.md`. The link goes through the `registryCode` annotation, not through hard-coded constants in the data files. A new partner hours override in the partner calculation page writes back to the registry as a `partner override` line that records the original planning value, the override value, the partner role, the package code, the timestamp, and the reason field.
