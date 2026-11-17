# ISRM Insight Hub — concept, product and proposal synthesis

**Status:** Internal working draft for Alex's review. Not approved for external distribution, implementation, pricing or contracting.  
**Date:** 8 November 2026  
**Purpose:** Reconcile the supplied correspondence, product notes, audits, partner brief, architecture clarification, delivery addendum, member survey and pricing drafts into one coherent position. Preserve source material; this note does not replace or approve it.

## Executive position

The strongest proposal is not “research versus software”. It is a staged answer to the original research enquiry: first deliver useful, source-backed research; then test whether the same evidence can be searched, reviewed, selected, kept current and used in appropriate professional follow-up. If an accountable owner, permitted data, willing members and repeated enquiries exist, the application could support a broader organisational-development programme. It cannot create those conditions by itself.

The product proposition should be:

> **The graph helps people see what is in the selected network. Research prepares evidence. Professional review makes the judgement accountable. Appropriate follow-up turns that work into collaboration.**

AI and OSINT may assist with research and candidate discovery. They must not be presented as independently verifying expertise, establishing trust, proving a relationship, or guaranteeing a suitable recommendation. The graph should show the basis and status of a connection: a shared recorded category is not a referral, introduction, acquaintance, endorsement or evidence of competence.

The application is the main interactive demonstration and part of the answer to the Board. Its briefing, working demonstration, internal service configurator and eventual commercial proposal should be connected in one client journey, but remain clearly distinct artefacts and decision states. A demonstration or scope selection is not an operational service, a purchase order or acceptance of a final price.

The current material is **not ready for an external hand-off or fixed quotation**. The concept can be presented for discussion once its claims are corrected and the supplied data and demo are checked for authorised use. The full search-to-save flow, saved graph state in the configurator, role-specific onboarding, baseline/KPI design and budget reconciliation remain open.

## 1. What the evidence supports

| Topic | What can be said now | What it does not establish | Source / registry boundary |
|---|---|---|---|
| Original enquiry | The correspondence describes a request to consider research across **11,000+ LinkedIn contacts**. | That the count is current, unique, exportable, reachable, consented, within scope, or a usable market denominator. | `ISRM-CTX-ENQUIRY` is an assumption and says “if confirmed”; it is not a confirmed audience or membership count. |
| Ukrainian sample | The supplied correspondence says **178 community records** were reviewed and describes further public-source research on **45 profiles**. | That the data file has been reconciled record-by-record to the application, that all profiles are members, or that all claims were independently checked to a defined standard. | `ISRM-CTX-SAMPLE` is an assumption pending reconciliation. The original email is a source narrative, not a verification ledger. |
| Current source flag | A recorded UI observation shows **45 source-flagged records among 178 displayed records** in that captured state. | That the source is current, the person is an expert, the claim is true, the person is an ISRM member, or disclosure/contact is authorised. | `ISRM-OBS-DEFAULT` and `ISRM-OBS-QUEUE`; the source flag is not an independent verification. Do not silently equate these UI records with the 45 profiles described in the email. |
| International network | The brief refers to **35 chapters**. ISRM's public pages describe international and university chapter activity. | The current number of active chapters, participation in this project, or a common data/governance model across them. | `ISRM-CTX-CHAPTERS` is “if confirmed”. The public International Chapters page reviewed here did not establish the asserted count. |
| LinkedIn audience | A prior planning file records a dated aggregate page-follower snapshot. | Access to follower identities, member status, consent, or permission to process a follower list. | Do not use page followers as contacts or as an addressable membership market. The partner brief itself notes that names are not available as a complete follower list. |
| Current demonstration | Project records describe a browser-local application with graph exploration, search/filtering, dossiers and a shortlist workflow. The graph is intended as the primary drill-down surface; panels should follow and explain the graph selection. | Shared authenticated storage, a live OSINT service, production access control, confirmed consent, a complete end-to-end search journey, or production readiness. | See [ENTRY](../ENTRY.md), [the 8 November graph checkpoint](2026-11-08-graph-as-search.md), and [the 6 November product-readiness audit](2026-11-06-full-product-readiness-audit.md). Previous browser/build checks are not a fresh acceptance test for every current branch or deployment. |
| ISRM context | ISRM describes a global forum for practitioners, academics and policymakers, and emphasises collaboration, shared learning, professional networks and resilience. Its published competition describes team-based practical risk work with expert feedback. | ISRM endorsement, a partnership with this project, demand for this application, or agreement to use member data. | Official pages below support contextual links only. |
| AI and data governance | NIST describes the AI RMF as voluntary risk-management guidance. Information rights, lawful processing, transparency, security, access and retention need to be assessed for the actual processing design. | A legal conclusion, an approved privacy design, a certification, or proof that this prototype meets an AI or privacy standard. | NIST AI RMF; ICO material should be checked directly with the responsible privacy/legal adviser. The ICO page attempted in this review returned HTTP 403, so no legal conclusion is drawn from it. |

Use the phrase **“the correspondence reports”** for historical claims until an evidence ledger links each claimed profile to its source, date, reviewer, review method, status and permitted use. “Verified profile” should only be used where that defined process and its evidence exist.

## 2. Fact-check of the earlier audit

The earlier audit contains useful questions, but it is not sufficiently grounded to serve as a Board case, technical specification or quotation. Its recommendations must be separated from its unsupported claims.

| Earlier assertion or recommendation | Assessment | Correct treatment |
|---|---|---|
| ISRM is a natural aggregator and the network has an automatic network effect. | Plausible hypothesis, not a demonstrated fact. A directory can remain unused; a network effect requires repeated value, participation and a process owner. | Present as a hypothesis to test with a bounded pilot. |
| AI alone can discover hidden horizontal relationships between people. | Unsupported and too absolute. Explicit data, search, taxonomy, graph algorithms, human knowledge and AI-assisted extraction can all contribute. Inferred relations require evidence, provenance and a visible uncertainty/status label. | Say AI may help identify candidate connections; a responsible person reviews them before they are used. |
| A fixed seed of a particular size is necessary before AI can work. | No validated source or task-specific evaluation supports a universal minimum. The need depends on whether the service is search, extraction, ranking, model training or something else. | Do not set a profile-count gate. Define the task, evaluation method, permitted data and acceptable error before deciding whether any labelled sample is required. |
| Current trust in AI is higher or lower in a named high-stakes segment. | The submitted Edelman interpretation does not establish the claimed comparison for risk/crisis decisions. General population attitudes cannot be substituted for evidence about ISRM members or clients. | Remove trust comparisons. Test member and client confidence directly; keep human accountability explicit. |
| The current situation has “zero yield”, and a future conversion, revenue or time saving can be forecast. | Not measured. There is no agreed denominator, time period, baseline, definition of yield or confirmed data access. | Remove yield, ROI and savings claims. Measure a defined current workflow first. |
| A particular number of hours yields a fixed proportion of reusable production code. | Not established by code inspection or an architect's component-by-component assessment. Reuse depends on implementation, licensing, data model, threat model, quality and production requirements. | Provide a reuse inventory and estimate remaining effort only after architecture review. Do not promise a reuse percentage. |
| Consent, a local audit record or a graph interface would by itself create a legal moat, privacy assurance or an immutable audit trail. | Incorrectly categorical. Browser-local storage is not a tamper-resistant server-side audit service; a consent dialogue does not decide the lawful basis or make all processing lawful. | Treat data rights, roles, purpose, retention, access and audit as design and legal work. Make no “no leakage”, “fully private” or “immutable” claim without verification. |
| A fixed integration count determines when the core becomes an integration platform. | Arbitrary. The boundary depends on named systems, API contracts, permissions, data rights, failure behaviour, operational ownership and the agreed use case. | Design a clear domain core with replaceable adapters where justified; select each integration from an approved register, not a numerical threshold. |
| Specific sectors, a TAM, average contract value or likely paid uptake are already known. | Not supported by the supplied evidence. Comparable association-management, relationship-intelligence and graph products exist, but that does not prove demand for this particular workflow. | Treat sectors as discovery candidates, not a market ranking. Validate repeated jobs, buyer, budget, operating owner and willingness to pay through interviews and a bounded paid pilot. |
| A proposal should be “impossible to refuse”. | This is not a sound professional objective and risks pressure. | Make the proposal easy to understand, tailored, evidence-led and safe to decline; show options, exclusions, risks and next steps plainly. |
| Fixed prices, staffing caps, milestone percentages, warranty periods and delivery dates in previous drafts are ready to use. | Conflicting historical planning models exist; the current scope and benchmark method have changed. A new payment split in the pasted prompt does not reconcile with earlier project terms. | Do not use the figures as a quote or contract. Resolve scope, reuse, rates, roles, recurring costs, tax, acceptance and payment terms first. |

The strongest parts to retain are: start from one real enquiry; separate discovery from implementation; distinguish source status from professional verification and willingness; define acceptance and out-of-scope work; preserve a human decision-maker; and treat the product as an organisational process as well as software.

## 3. The bridge from research to organisational development

The bridge is a sequence of evidence, not a claim that research automatically creates a platform or revenue:

**A defined professional enquiry → source-backed research → review of evidence and limitations → a relevant shortlist → an authorised, appropriate invitation or referral → a completed professional interaction → a recorded outcome and correction/update → the next enquiry.**

The first application of the graph is to make the current selection understandable: what expertise is represented, which records support that view, what is missing, and how the selection changes when a user drills down. The graph is not a decorative promise of “AI insight”. It becomes valuable when the user can explain why a person or group appears and can save the view that informed a decision.

The broader organisational hypothesis is that, if members see individual value and the association supports a fair process, repeated enquiries could support knowledge sharing, learning, research, working groups, consulting and project collaboration. Those are possible future outcomes, not current services or guaranteed benefits.

### Suggested narrative for the Board

1. **The starting point:** ISRM received a substantial research enquiry. The count and access assumptions are not yet confirmed, and research alone can become dated.
2. **The practical question:** can evidence gathered for an enquiry be made easier to find, review, correct and reuse responsibly?
3. **The demonstration:** show how a user moves from a recorded expertise category to a dossier and a saved shortlist, with the graph and panels keeping the same selection in view.
4. **The human process:** sources and AI-assisted research prepare material; a named reviewer decides what is relevant and what action is appropriate.
5. **The pilot decision:** agree one recurring use case, its data owner, permitted sample, participants, baseline, safeguards and acceptance evidence.
6. **The horizon:** only if the pilot demonstrates value and operating capacity should ISRM consider wider research, learning, collaboration or integrations.

Do not lead with a numerical funnel, a claim of “dead” or “unused” contacts, an AI trust claim, a monetisation forecast or a promise to cover all chapters.

## 4. The four connected parts

### A. Presentation and entry points

The application is the central demonstration surface. A concise briefing should orient the Board, then make the user journey tangible. It should not imply that the current application is an approved production service.

| Audience | What the entry should help them decide | Evidence and next step |
|---|---|---|
| ISRM Board / association leaders | Is there one operational problem worth testing, and who would own the process? | Show one enquiry, a clear evidence path, governance questions and a bounded pilot decision. |
| Member / researcher | Can I find relevant expertise, understand why a result appears, build a shortlist and correct or contribute information safely? | Demonstrate search, dossier, source status and shortlist; explain local-demo limitations and the separate voluntary survey. |
| Potential investor | Is there a validated repeated need and a replicable delivery model? | At present, only a one-page **hypothesis and validation plan** is defensible. Do not present TAM, unit economics or revenue forecasts without research and pilot evidence. |
| Internal configurator user | What has the organisation asked for, what is in or out, what dependencies and questions remain, and what must be costed? | Use a guided internal discovery and scope workflow; record assumptions, not an implied order. |

Do not force all audiences through one sales narrative. Keep the language professional and plain. Include a clear “what this demonstration does not do” statement. Each surface should be understandable without knowledge of graph technology or AI terminology.

### B. Demonstration and reusable product work

**Current demonstration boundary from project records:** graph and search/filter, profile/dossier presentation, shortlist-related interaction and a browser-local configuration experience. Shortlist and graph state in the local browser are not shared service persistence. The source flag means only that the supplied source carries a flag. The latest recorded project acceptance still leaves an end-to-end clean-browser search/restore path and saved configurator-graph evidence open.

**What to finish before spending more product-development time:**

- Complete one clean-browser route from a user need through graph/category selection, filters, person/dossier, group selection, save and restore. Preserve the active selection and filters across panel changes.
- Keep the graph continuously visible as the primary search surface. Initial entrance animation may remain. Subsequent choices should transform the current graph rather than replay the entrance from a point. Focus a selected person and evidence-backed neighbours; dim unrelated context without implying recommendations or relationships that are not in the data.
- Distinguish direct attributes, shared recorded categories, sourced relationships, human-confirmed recommendations and AI-suggested candidates. Save a legible graph snapshot with the selected group and with a configurator composition where the interface claims it can do so.
- Make the same choice visible in the graph, panel, selected-group record and export. Use shape and text as well as colour; do not make colour carry meaning alone.
- Mark the “invite to a project” step as a non-sending demonstration. Entering a project name must not create, send or notify anyone. State that the capability is not available in the demonstration.
- Record which interactions are local-only, which are simulated and which are implemented. Do not show mock integration cards as connected services.

**Architectural value for a future shared core:** retain evidence of the current data model, field semantics, provenance/status definitions, graph-edge meanings, search and selection behaviour, local-storage boundaries, integration assumptions, component ownership, test scenarios and unresolved decisions. The architect should decide which components can be reused. Do not claim that all current UI code will transfer unchanged.

**Do not add to the demonstration without approval:** live LinkedIn extraction, automated external OSINT, model training on member profiles, real invitations or referrals, shared user data, a production consent workflow, a tamper-resistant audit log, or a full CRM/LMS/communications integration. Each requires a data owner, rights and an acceptance case.

### C. Internal service configurator

The current configurator should be treated as an internal discovery and decision-support instrument, not as the member-facing product and not as checkout.

Its useful question sequence is:

1. What enquiry or organisational task is being addressed?
2. Who is the user, decision-maker, data owner and operational owner?
3. What is the present process and what evidence exists about its cost or difficulty?
4. Which data and systems may be used, by whom, and under what permissions?
5. Which workflow outcome is wanted: research, reviewed selection, member contribution, learning/resource use, or a defined collaboration?
6. Which capability is necessary, optional or explicitly out of scope?
7. What dependencies, risks, recurring costs, acceptance evidence and unresolved assumptions follow?
8. What budget boundary, if any, should the detailed proposal respect?

The configurator should show the consequences of adding or removing a capability: dependencies added or removed, which workflow steps become possible, which are blocked, what evidence is still required, and which KPI candidates would be meaningful. It must not invent a benefit score, a price change, a service capacity or a KPI target. A graph may visualise these relationships only where the underlying dependency is explicit and reviewable.

Selections should create a versioned **scope request** that can be reviewed and exported. They should not create a purchase, legal acceptance or a promise that a provider is available. The final proposal is a separately reviewed artefact generated from the agreed scope and priced work.

For the fallback route, preserve a clear choice between: continuing defined research requests; commissioning a discovery/feasibility phase; or considering the existing graph/search demonstration as a limited prototype. Choosing a smaller route must preview what is removed and what remains; it must not silently clear the user's prior selections. The demonstration is not a production-ready standalone core.

### D. Proposal, scope and budget limits

The proposal should be a transparent decision document, not a pressure mechanism. It should identify:

- the user problem, intended result and named client/process owner;
- the agreed pilot workflow, users, permitted data, sources and environments;
- deliverables, exclusions, dependencies, acceptance evidence and who signs off;
- the current process baseline and KPI definitions, with no target until a baseline and measurement method are agreed;
- each one-off work package, recurring licence/hosting/API/research cost, professional-review or legal cost, support and exit cost;
- pricing model, currency, tax treatment, budget boundary, reporting and change control;
- assumptions, third-party risks and a decision path if the proposed scope exceeds the budget ceiling.

The user-requested benchmarking method—upper-end Ukrainian development pricing and lower-end UK management overhead—has **not** been validated in the current pricing pack. Salary surveys, contractor day rates and supplier billable rates are different measures. Obtain dated sources for comparable roles and jurisdictions, state gross/net/tax basis and currency-conversion date, and do not mix these measures.

The existing pricing files contain different scope and effort models and are not reconciled into one current estimate. The previously documented packages, rates, reused-work assumptions and public planning price are not an accepted quote. The latest draft's fixed three-part payment split also conflicts with earlier recorded payment language. None should be copied into an external proposal as binding.

**No new price or schedule is calculated here.** Required inputs are: approved acceptance scope; role-by-role work breakdown; architect-assessed reuse; developer and management rates from comparable sources; legal/privacy and research effort; named provider/API and usage assumptions; infrastructure and recurring services; QA/security and handover; tax; contingency; support and maintenance; and the chosen payment/change model. Once these are agreed, calculate each line from its inputs and show the formula and source.

## 5. Data, privacy and trust boundaries

The proposal must not promise “no leakage”, “fully anonymised”, “verified” or “complete audit” until the actual data path and controls are inspected. The project record notes that source responsibility, last-verified and consent/use-status fields exist in the source workbook but are not separately carried into the application’s `Expert` model. A source flag or a public web page does not answer whether a profile may be reused, displayed, exported or contacted.

Before any external demonstration using identifiable records:

- identify the responsible organisation and the purpose for each processing activity;
- inspect the exact records, fields, source files, client bundle and hosting route used in the demonstration;
- decide who may see, change, correct, export and retain each field;
- record provenance, source date, reviewer, review scope, confidence/limitations and use restrictions separately;
- determine the appropriate legal basis and required privacy information with the responsible adviser; consent may be relevant but must not be assumed to be the only lawful basis;
- define retention, correction, objection, deletion, incident response, access logging, backup and supplier terms;
- avoid inference of health, security risk, suitability or protected characteristics from graph proximity or source availability;
- do not use member information to train or fine-tune models without a separately approved purpose, rights analysis, controls and evaluation.

The existing short member survey is a useful neutral starting draft: it asks about needs, barriers, capability preferences and contribution conditions; it says participation is voluntary and does not imply a published profile or commitment. Before launch, confirm the owner, purpose, recipients, privacy information, access/retention, authorised sender and platform. Keep a contact request separate and optional. Do not call responses anonymous until the platform and metadata have been reviewed.

## 6. Measurement and demand validation

Define measures before the pilot. Candidate measures are:

| Question | Candidate measure | Required definition before use |
|---|---|---|
| Does the tool help find a useful shortlist? | Elapsed time to reviewer-accepted shortlist | Start/stop events, enquiry type, users, baseline method and reviewer criteria |
| Are results relevant? | Reviewer-assessed relevance | Rubric, reviewer, denominator, handling of missing evidence and disagreements |
| Is information maintained? | Records with a current review date or an outstanding correction | Definition of current, owner, review interval, source and eligible-record denominator |
| Will members participate? | Voluntary response or contribution | Invitation population, channel, consent/contact basis, response definition and period |
| Does the process complete? | Appropriate next actions completed | What counts as an action, responsible owner and evidence source |
| Is there repeat value? | Repeat use for a separate enquiry | User/org, time period, duplicate handling and the reason for reuse |

These are measurement candidates, not promised KPIs. Do not turn expressions of interest, a survey response or a source flag into projected revenue, paid membership or participation.

Potential discovery settings include professional associations and chapters, specialist advisory networks, research consortia, and humanitarian/resilience networks. No sector ranking or market size is supported by the material reviewed. Humanitarian and other sensitive settings can increase duty-of-care and access requirements; they are not automatically better opportunities. Prioritise a setting only when a buyer can name a repeated task, owner, permitted data, participating users and budget route.

## 7. Separate FeelAgain discussion

Do not make the mental-health initiative a condition, proof point or implied part of ISRM approval for Insight Hub. The published ISRM Ukraine item describes an educational session on practical mental-health incident management for non-specialists, dated 14 October 2026. It is evidence of a past, public topic—not evidence of a current partnership, endorsement, clinical programme or procurement interest.

If Alex wishes to explore a connection to `dashboard.feelagain.me`, do it as a separate, optional conversation with an appropriate ISRM contact, after the main product request has been made clear. Ask whether the topic is relevant to their current priorities; do not ask them to endorse the product or bundle the conversation with data access or a paid commission.

Possible separate wording:

> Separately, I noticed ISRM Ukraine's published educational session on practical mental-health incident management for non-specialists. I am also working on a distinct digital initiative in this area. If it is relevant to your current work, I would welcome a separate conversation about whether there may be a useful opportunity to learn from your experience. There is no expectation of endorsement or involvement.

## 8. Suggested British English covering message

> Dear David,  
>   
> Thank you for the challenge and for considering how the Ukraine work might inform a broader exercise. I have prepared a short briefing and an interactive demonstration. The demonstration shows how the supplied sample can be searched and reviewed; the briefing sets out a possible, staged route towards making expertise easier to find, assess and use across the network.  
>   
> The wider capabilities, integrations, costs and timescales are proposals for discussion, not confirmed commitments. If helpful, I would welcome your and the Board's view on the first practical use case, who should own it and what safeguards it would require. We can also discuss further research for specific, well-defined requests.  
>   
> Best regards,  
> Dmitriy

This is a draft, not an approved email. Retain the distinction between the requested research, the local demonstration and possible future scope.

## 9. Official contextual links to use carefully

| ISRM page | Relevant context it supports | Boundary |
|---|---|---|
| [About Us](https://www.theisrm.org/about-us/) | ISRM describes a global forum, collaboration, shared learning, professional networks and resilience. | Does not establish support for this product. |
| [Membership](https://www.theisrm.org/membership/) | Professional membership is described for practitioners, academics and policymakers in associated fields. | Does not establish profile accuracy, access rights or member willingness to participate. |
| [International Chapters](https://www.theisrm.org/international-chapters/) | ISRM has public chapter information. | The page retrieved in this review did not verify the claimed count of active chapters. |
| [University Chapters](https://www.theisrm.org/university-chapters/) | ISRM presents chapters as a way for students to connect across institutions, countries and practitioner networks. | Supports a possible learning/networking analogy, not demand or product partnership. |
| [Strategic Risk Case Competition 2026](https://www.theisrm.org/strategic-risk-case-competition-2026/) | Describes team-based practical risk analysis and feedback from expert judges. | A programme example, not evidence that Insight Hub is endorsed or required. |
| [Training Programmes](https://www.theisrm.org/training-programmes/) | Lists professional risk, crisis and resilience training programmes. | Does not confirm an LMS integration or a request for one. |
| [AI in Risk Management](https://www.theisrm.org/ai-in-risk-management/) | Shows public discussion of AI in risk management. | Does not endorse this implementation, architecture or AI claims. |
| [Global Risk Review](https://www.theisrm.org/global-risk-review/) | Public page shows an issue and a registration form for access. | The full report was not reviewed; do not attribute claims to it. |
| [Corporate Partners](https://www.isrmcorp.com/corporate-partners/) | Describes tailored partnership packages and partner benefits. | Not a product price list, project agreement or evidence of interest in this proposal. |
| [Practical Mental Health Incident Management for Non-Specialists](https://www.theisrm.org/practical-mental-health-incident-management-for-non-specialists/) | Records an ISRM Ukraine educational session held on 14 October 2026. | A past event, not a current commitment, clinical endorsement or link to FeelAgain. |

The [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) is voluntary guidance and is being revised; it is a useful risk-management reference, not a certification claim. Any specific UK privacy or data-protection statement needs review by the responsible legal/privacy adviser against the actual processing.

## 10. Decision gates and current status

| Gate | Decision or evidence required | Current status from project records |
|---|---|---|
| Concept approval | Approve the research-to-organisational-development bridge and the limits on AI, trust, demand and market claims. | Draft in this document; owner review required. |
| Demonstration acceptance | Verify one complete search/filter/person/group/save/restore journey, graph focus and saved graph state; confirm local-only and non-sending boundaries. | Partially evidenced. A local shortlist snapshot has been tested; the full clean-browser route and restored search conditions remain open. |
| Configurator acceptance | Verify dependency effects, legible workflow/service graph snapshots, budget-boundary handling and export into a proposal request. | Not demonstrated to a full acceptance standard; KPI targets and pricing logic remain unresolved. |
| Role/tutorial acceptance | Guide Board, member/researcher and internal configurator users through distinct tasks without implying unavailable features. | Partial; full role-based understanding and usability have not been demonstrated with target users. |
| Data and privacy gate | Confirm data rights, responsible party, permitted fields, source/provenance handling, correction, retention and access for the exact demo and pilot. | Open; do not make blanket safety or privacy claims. |
| Commercial gate | Reconcile deliverables, scope, accepted reuse, rates, recurring costs, taxes, support, acceptance, payment and change model. | Not ready for a fixed quotation. |
| External hand-off | Provide the architect and delivery partner with current code baseline, reusable-component inventory, data/API contracts, decisions, open risks, acceptance plan and reconciled cost model. | Existing partner and architect drafts are useful sources but are inconsistent and not approved as a final hand-off. |

The previously stated acceptance criteria remain useful as gates; passing a build or a visual review is not equivalent to passing them. No code change, branch change, commit, push or deployment is authorised by this synthesis.

## 11. Recommended sequence

1. Review and approve or correct this narrative and the claims table.
2. Reconcile the outgoing research description and the 45-record source-status discrepancy before using “verified” externally.
3. Complete the recorded demo acceptance route and mark all local-only, simulated and blocked actions.
4. Define the pilot's owner, repeated enquiry, data permissions, user roles, baseline and measure definitions.
5. Rework the internal configurator around the guided questions above; treat selections as a versioned scope request, not approval of a price.
6. Ask the architect to compare buy, adapt and build against the same pilot acceptance requirements and identify reuse by component.
7. Rebuild the budget from the reconciled scope, current sourced rates and recurring costs. Show calculations to Alex before using them in a proposal.
8. Prepare the external Board pack and partner hand-off only after the relevant gates are accepted.

This sequence keeps the strategic horizon visible while preventing it from being sold as a feature set the current prototype does not deliver.
