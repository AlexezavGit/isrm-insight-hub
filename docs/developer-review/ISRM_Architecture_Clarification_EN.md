# ISRM Insight Hub — Architecture clarification and quotation addendum

29 October 2026 · For architectural review · Not a commission or an accepted implementation estimate

This revised brief replaces the Developer Specification and Quotation Request dated 28 October 2026. It clarifies the intended product, integration boundaries and reuse decision. It does not change approved commercial terms or declare any delivery stage accepted.

## 1. The product in one paragraph

ISRM would use a controlled workspace to turn a professional enquiry into a useful, reviewable response: find relevant expertise and its holders; inspect the source, date and recorded assessments; retain a working group; commission research from an existing OSINT researcher service; and have a responsible professional review its findings. The graph is an optional way of inspecting connections within that workflow. Neither a graph database nor training a new AI model is a predetermined requirement. LinkedIn is one possible authorised input source, not the definition of the product.

## 2. Two user interfaces with different jobs

| Surface | User and purpose | Output | Present implementation |
| --- | --- | --- | --- |
| Expertise-search application | Members, chapter teams and authorised reviewers carry out an enquiry | Source-backed profiles, selected working list, next action and review record | Interactive demonstration: graph, filters, dossiers, local lists/notes and export. Shared authenticated operations remain to be implemented |
| Capability configurator | Dr David Rubens, the ISRM Board and nominated colleagues shape a proposed solution | Chosen capabilities, tailored package contents, descriptions and budget position in one proposal request | A real browser-local configuration tool; selecting proposed services does not activate them |
| Scope & budget | Decision-makers agree what should be quoted | One consolidated scope and indicative priced/unpriced lines | Working proposal preparation, not checkout or a production project-management system |

Adjacent panels share one screen edge. The operational prototype uses Search, Dossier and Shortlist. Configuration uses the Capability Tree, Workflow Description and Service Description. Each panel closes independently. Wider panels expose more detail; narrow screens switch tabs while preserving the graph and selection.

The website's four stages are briefing, application prototype, configurator and scope. A first-time user must be able to explain which task they are doing. The configurator is not the future member's operational workflow.

## 3. First operational release: bounded scope to quote

Use one agreed representative enquiry and an authorised sample, with nominated users and a recorded baseline for the current manual approach. Propose and price the following usable result:

1. Import and map an approved file; show invalid and duplicate records for review rather than silently discarding or merging them.
2. Find a relevant person using ordinary search and filters. Graph exploration supplements this route; it must not be compulsory.
3. Inspect a summary and full dossier with accessible source evidence, dates and distinct statuses. Keep recorded membership, source confirmation, recommendation, AI findings and professional decisions separate.
4. Save a named shortlist, preserve it while continuing the enquiry, and export only authorised selected fields. Test independent accounts and shared record ownership.
5. Submit a scoped request through a server-side adapter to the existing OSINT researcher. Receive request ID, state, timestamp, citations, limitations and errors; record a separate human review outcome.
6. Apply agreed access controls, correction/retention rules and audit requirements to reads, changes and exports. Demonstrate backup/restore and a reproducible release.

Acceptance should demonstrate a complete enquiry with nominated users and agreed test data. Compare time to a useful shortlist, reviewer-confirmed relevance and willingness to respond. Baselines, targets and a decision date must be agreed; no two-minute SLA, conversion yield or financial return is assumed.

Specify the supported concurrency, import volume, graph subset and search response target before committing to performance. The existing small sample is not evidence of an 11,000-record production benchmark.

## 4. Integration register — do not quote “all integrations”

| Boundary | Direction and contract to establish | Quotation treatment |
| --- | --- | --- |
| Approved CSV/XLSX/JSON input | Named source owner, fields, permissions, duplicate handling, provenance and refresh | Core C03; no assumption of unrestricted LinkedIn extraction |
| Identity and shared storage | Identity provider, roles, field access, environments, retention and export permissions | Core C06; provider and hosting selected in architecture |
| Existing AI OSINT researcher | Authorised request → request ID/status → cited findings → human review; rate limits, cost, processing location and error handling | Core C07 adapter and review flow; provider development, research fees and paid data excluded unless quoted |
| Membership/CRM | Identify actual ISRM system, available API, owner, fields, read/write direction and test environment | Assess in C01; include only explicitly named connectors in the signed scope |
| Publishing/LMS/communications | WordPress, Moodle or other products are illustrative candidates, not confirmed installed systems or partnerships | Separately identify and quote useful connectors and delivery operations; no blanket promise to connect every platform |
| Situational monitoring | Named source, permitted feed, incident relevance, expert review and intended briefing | Optional future monitoring workflow, not core individual vetting or automated adverse action |

For every connector return: authentication, data contract, permissions, error/retry behaviour, monitoring, acceptance tests, setup cost, usage/licence cost and ongoing owner. A provider logo is not an integration contract.

LinkedIn's account export and API access do not imply complete access to other members' dossiers. Agree permitted inputs and rights with the source owner and legal/data function before implementation.

## 5. Build / adapt / buy: return three comparable options

| Option | What to test | What must still be priced |
| --- | --- | --- |
| Existing platform | Configure an established graph/search platform against the same enquiry and access tests | Data preparation, licence, deployment, integration, operating model, training, export/exit and missing user functions |
| Adapt the present interface and standard components | Reuse accepted React components and interaction design; evaluate standard identity, storage, search and workflow facilities | Production data contracts, authorisation, shared state, research adapter, tests, deployment and support |
| Bespoke component only where justified | Identify a required acceptance check that the first two options cannot meet adequately | The specific gap and its lifecycle cost, not an automatic rebuild of the entire application |

Neo4j Bloom already offers search, graph exploration, inspection and editing; some collaboration and authorisation features depend on its licensed/server configuration. Linkurious supports multiple graph database vendors. Those are credible alternatives to examine, not proof that the complete ISRM operating process is already supplied by a graph viewer.

Compare the same usable release and a three-year ownership view: implementation, licence, hosting, data/research usage, operations, professional review, support, changes and exit. Return actual supplier terms where available and label unknowns. Do not equate an open-source licence with zero delivery cost.

Select relational versus graph storage from demonstrated query, permission and operational needs. A node-link interface alone does not settle that choice. Evaluate search/retrieval and the existing researcher contract before proposing model training; any training, labelled evaluation set or consultant agent is a separate scope decision.

## 6. Tailored scope is explicit, not a priced free-form promise

The client may add or remove capabilities within the core or optional workflow presets. Store that exact composition in the proposal request. Changed packages retain the published indicative reference price with an explicit reassessment notice. Exact calculations and revised acceptance conditions follow in the detailed proposal; do not reduce price in proportion to checkbox count. Shared dependencies must be charged once, with an explanation of what remains necessary for permissions, provenance and review.

The service wheel's audience bands illustrate possible coverage and overlapping use. They are not actual assignments, entitlements or inferred preferences. Removing one service must retain people who still have another selected service; the demonstration should show the residual coverage and what capability has been removed.

## 7. Estimate reconciliation and architect response

The existing future-core schedule is a planning assumption of **640 hours before accepted reuse**:

| ID | Package | Planning hours |
| --- | --- | ---: |
| C01 | Architecture | 64 |
| C02 | UX and responsive interface | 48 |
| C03 | Import, profiles and dossiers | 96 |
| C04 | Fields, relationships, groups and lists | 80 |
| C05 | Graph and search | 40 |
| C06 | Authorisation, storage and audit | 96 |
| C07 | Existing OSINT researcher adapter | 96 |
| C08 | QA and security verification | 80 |
| C09 | Deployment and handover | 40 |
| | Total | **640** |

C07 already contains the adapter work and C08 already contains QA. Do not append another blanket engineering-overhead percentage that duplicates those lines. Financial overhead and non-developer functions are separate from the engineering-hour schedule. Additional named connectors require incremental estimates after their contracts are known; do not assume a fixed number of interchangeable gateways.

The existing demonstration's 172 replacement-hour midpoint is not a timesheet, accepted reuse discount or automatic completion of the 30% feasibility stage. Its author's remuneration remains within the development allocation and is deducted once. Architect review must identify reusable components by package and return the remaining work with evidence.

The internal funding scenario and public planning prices are not an accepted supplier quotation. Reconcile them only after the same scope, reuse, roles, operating assumptions and licences are compared. This addendum deliberately does not replace the partner workbook or set a new client price.

If the proposed budget is adequate only for research or a proof of concept, return the specific deliverables, exclusions, hours, team, dependencies and total needed for the bounded operational release above. A demonstration, technical proof of concept, pilot and production MVP must have distinct acceptance conditions.

### Please return

- A short architecture decision record comparing the three options against the same enquiry, permission model and handover requirements.
- Reusable outputs and remaining hours for C01–C09, plus separately named optional integrations; avoid duplicated responsibilities.
- An API/dependency register and questions that actually prevent a quotation.
- A calendar plan tied to staffing and access dependencies, not person-days presented as elapsed time.
- A quotation with tax treatment, licence/usage/operating costs, support, exclusions, acceptance evidence and change procedure.

## Primary references checked on 29 October 2026

- Neo4j Bloom overview: https://neo4j.com/docs/bloom-user-guide/current/bloom-visual-tour/bloom-overview/
- Neo4j Bloom access and server configuration: https://neo4j.com/docs/bloom-user-guide/current/about-bloom/
- Linkurious supported data sources: https://doc.linkurious.com/admin-manual/4.3/configure-sources/
- LinkedIn account data export: https://www.linkedin.com/help/linkedin/answer/a1339364?lang=en
- Existing application and proposal scope: https://isrm.pages.dev/scope
