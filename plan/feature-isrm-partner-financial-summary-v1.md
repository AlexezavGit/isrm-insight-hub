---
goal: Executive financial summary for the three ISRM Ukraine chapter partners; concise narrative + reference to the tables and the registry
version: 1.0
date_created: 2026-10-06
last_updated: 2026-10-06
owner: ISRM product owner
audience: the three ISRM Ukraine chapter partners (not the client)
status: "Draft for review · rates are ASSUMPTION · conservative indicative"
depends_on: feature-isrm-price-calculations-v1.md, feature-isrm-partner-financial-tables-v1.md
---

# ISRM partner financial summary · v1

## Bottom line

The three ISRM Ukraine chapter partners are paid the same planning-default hourly rate (£25 low / £37 base / £49 high per hour, 2024-Q3) and the hours differ by function and responsibility. Across the four sequential packages, the combined planning default is **432 hours** for packages 01–03, with package 04 not yet derived. The combined base-scenario pay is **£15,984**. The first payment is at least 30% of the agreed total and is due on delivery/acceptance of each package; the search and graph modules — the core of the application — trigger their own payment on delivery/acceptance of the module, not only on the package as a whole.

Each package can be delivered at one of three fee tiers — T-1 Self-serve (× 1.0), T-2 Co-pilot (× 1.5), T-3 Operate (× 2.0) — that scale the partner work, not the deliverables.

| Scenario | Combined 01–03 pay (T-1 · GBP) | Combined 01–03 pay (T-2 · GBP) | Combined 01–03 pay (T-3 · GBP) |
|----------|------------------------------|------------------------------|------------------------------|
| Low · @ £25/h | 10 800 | 16 200 | 21 600 |
| Base · @ £37/h | 15 984 | 23 976 | 31 968 |
| High · @ £49/h | 21 168 | 31 752 | 42 336 |

Package 04 (remaining / additional functionality) is excluded from the combined total until its own scope and rate are agreed.

## Per-partner share at the base rate

| Partner role | Hours | Base pay @ £37/h | Share of combined |
|--------------|-------|------------------|---------------------|
| Client communications + business development | 100 | 3 700 | 23% |
| Operations, OSINT, events, external communications | 128 | 4 736 | 30% |
| Product, strategy, vendor coordination | 204 | 7 548 | 47% |

The product role carries the most hours because of the strategic and vendor-coordination load. The operations role is next because of the data import and review work. The client-comms role is the smallest but consistent because stakeholder alignment is required in every package. The three partners share the same planning-default rate; the difference in pay is purely a function of hours assigned to the role, justified by the standard time expenditure for the function in each package.

## How the numbers were built

The three rates and the per-partner hours are taken from the registry in `plan/feature-isrm-price-calculations-v1.md`. The registry records every value as a code, a unit, a period, a formula, a source, a tier and a status. The planning-default rate of £37/h is the conservative midpoint of the publicly cited $25–$49/h Ukraine software-development band, converted at the EUR/USD cross-rate of 0.926, cross-checked against the UK junior-consultant band and rounded below the U.S. BLS software-developer mean of $66.40/h. The hours are planning references, not agreed effort. Each partner can override both the rate and the hours in the partner calculation page; the override is recorded against the registry code with a timestamp and a reason field.

The Tier 1 verified public anchors (U.S. Bureau of Labor Statistics OEWS, DOU.ua Winter 2025 salary survey, IT Jobs Watch UK, GLG SEC filings, Palantir 10-K) are recorded in the registry §1 for traceability. They are **not** the partner rate; they show the actual public range to the partners during the discussion. The historical anchors (Cost × 3 multiplier, 2 080 h greenfield cost €66,090, commercial total €198,270, base MVP €54,100, AI OSINT 480 h × €45/h × 3 = €64,800, tranches 30/40/30) are marked `historical/inactive` in the registry and are kept for traceability only. They are not used in the active calculation.

## What the search and graph modules cost

The search and graph are the core of the application. The active proposal identifies them as separate module lines so that payment can be triggered on the delivery/acceptance of the module itself, not only on the package as a whole. In the base scenario, the four module lines add up to **£3,108**:

| Module | Package | Role | Hours | Base pay @ £37/h |
|--------|---------|------|-------|------------------|
| Search (Member Cabinet + filters) | 02 · MVP | ops | 16 | 592 |
| Graph (Network + Dependency) | 02 · MVP | product | 32 | 1 184 |
| Graph pilot enhancements (expert overlay, value-unlocks) | 03 · Pilot | product | 20 | 740 |
| Dependencies view (cohort 2 + LinkedIn channel) | 03 · Pilot | product | 16 | 592 |

These hours are a sub-allocation of the package totals; they are not added on top. The module lines are listed in the partner tables in §7 of `feature-isrm-partner-financial-tables-v1.md`.

## What is not in the totals

The combined base scenario of £15,984 (and the high £21,168 / low £10,800) **excludes** the following items. Each is registered with its own code in the registry §6 and is shown as "excluded, not zero":

- Hosting
- AI / API usage
- Legal and privacy work
- Reuse compensation for graph and search
- Tax and ongoing support
- LinkedIn group confirmed experts (cannot be fabricated; the confirmed share is recorded by the pilot, not estimated)
- The historical multiplier M = 3.0 and all historical greenfield anchors

A future revision registers these as separate lines when the data is available. Until then, they are explicitly out.

## Payment mechanics

The active payment terms override the historical tranches. They are:

- Each package is paid on its own delivery and acceptance.
- The first payment is at least 30% of the agreed total.
- No invented installment table. Payments are per delivery, not per calendar period.
- The search and graph modules trigger their own payment on delivery/acceptance.
- All package totals are **INDICATIVE** — they are planning references pending the preliminary approval of scope and an acceptable overall budget ceiling.

## What changes when a value changes

The reactivity contract is documented in §"Reactivity contract" of the partner tables file. In short: every number in this document carries a `registryCode`. A change in the registry updates this document, the partner tables, the partner calculation page in `src/components/PartnerProposal.tsx`, and the client proposal page in `src/routes/proposal.tsx`. A partner override of their own rate or hours is written back to the registry as a new line; the original planning value, the override value, the partner role, the package code, the timestamp, and the reason are all recorded.

## Cohort 2 — pilot LinkedIn audience, subscription view only

The pilot LinkedIn Page is the named communications channel for forming cohort 2 (registry §7e, partner tables §11 / Tables 15–18). There is **one** revenue line: verified ISRM membership subscription, multiplied by the conservative funnel rates. No second revenue line; no SaaS view.

The verified reach anchor is the ISRM Ukraine LinkedIn Page, 8,742 followers in the public snapshot of 2026-08-28 (registry §7e.1, file `ISRM_Ukraine_Community_CRM_178_FandP/CRM Dashboard-Table 1.csv`). Page followers are aggregate public analytics; they are not an exportable follower database. "10,001+" is the page-level setting, not a membership count, and is **not** used as a denominator or as a reach number.

Under the conservative indicative rates in registry §7e.2 (2 % application, 30 % acceptance, 25 % paid), the conservative funnel output is:

- applications ≈ 175
- accepted ≈ 53
- paid new members ≈ 13
- subscription revenue (first-year cohort 2, M.ISRM tier at £100 verified) = **£1 300**

£1 300 in first-year cohort 2 membership revenue is **token**, not a business. It is the only revenue line that exists for the pilot today. The pilot's role is **measurement**, not scale. The funnel and the rates are conservative picks — low end of cited public benchmarks — to leave room for the actual pilot number to exceed them.

There is no SaaS revenue line in this financial block. ISRM does not currently sell a SaaS product; the £240/year SaaS anchor and 0.5 % services-engagement share that appeared in earlier revisions of this document were removed on 2026-10-07 because they relied on a fabricated product price and a generic public benchmark (Metricuno, First Page Sage) that had no anchor to an actual ISRM engagement definition. See registry §7e.4 Removed Values Log.

## Where to look next

- The full registry: `plan/feature-isrm-price-calculations-v1.md` — every code, every source, every status, including §7e for the pilot cohort 2 subscription view and §7e.4 Removed Values Log.
- The partner tables: `plan/feature-isrm-partner-financial-tables-v1.md` — Table 1 (rate card), Table 2 (partner × package × scenario), Table 3 (partner × package × role × hours), Tables 4–6 (per-partner pay scenarios), Table 7 (search and graph modules), Table 8 (excluded items), Table 9 (payment terms), Tables 15–18 (pilot cohort 2 subscription view).
- The application partner page: `src/components/PartnerProposal.tsx` and `/partner-finance` route — editable input form where each partner records their agreed rate, hours, conversion rate and subscription fee; every cell references its `registryCode`.
- The application client page: `src/routes/proposal.tsx` — the four sequential packages with the cycle shown only inside the third package, the cohort 2 card with the four empty input slots and a planning-reference note for the conservative indicative funnel rates.
