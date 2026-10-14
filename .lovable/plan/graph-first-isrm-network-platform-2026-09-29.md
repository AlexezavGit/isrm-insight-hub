# Graph-first ISRM Network Platform

> **Superseded decision (2026-10-06):** The external World Monitor / War Room navigation described below was removed from the live app at the user's request. This plan is retained as historical context and must not be used to reintroduce that control.

## What will change

- Make English the default language while keeping the UK/EN switch.
- Replace the current graphite styling with the selected translucent command surface: petrol teal canvas, orange and brass accents, cream text, blueprint grid, Space Grotesk headings/numerals, larger labels, and lightly frosted surfaces that keep the live graph visible.
- Remove the top navigation. Keep only a compact identity/language/sign-in status above the map and a fixed bottom command bar: **Search**, **Cabinet**, **War Room**.
- Keep the network graph as the full-screen home surface. Search slides over it from the left; the member cabinet slides over it from the right. War Room opens World Monitor in a new tab.

## Network screen

- Combine Network Snapshot and filters into one compact Search panel, including live totals, verified/research flow, expertise coverage, search, verification, sector, geography, Ukraine experience, role, and graph layers.
- Keep controls and filtered graph visible together on desktop and in the first mobile viewport.
- Animate displayed metrics as filters change and add restrained movement to verification/research counts without inventing new records.
- Tighten graph forces, increase label size/contrast, and reveal real names after access is unlocked.
- On expert selection, open a translucent mini-dossier with trust, expertise, **Open dossier**, and **Send to project** actions.
- Reframe the lock as **Sign in**; after demo access unlocks, show the member identity state and a sign-out action.

## Member cabinet

Build a right-side cabinet for the single demonstration member profile with horizontally scrollable service modules:

- Expert directory and saved experts
- Projects and expert participation requests
- Project-task and network-invitation composer mockups, with email or Signal delivery choice
- Targeted alerts by expert group and/or geography
- Expert recruitment and communications campaigns
- Expert discussions, meetings, collaborative research, and public consultations
- Consulting lead generation and sector campaigns
- Network news
- Virtual and in-person meeting operations: access control, agenda, materials library, attendance
- AI/OSINT and network assistant services
- Partner services with internal ratings: legal support, evacuation, local handling, equipment maintenance
- Knowledge repository, conflict checks, reputation/credentials, and impact analytics
- Billing: membership free; premium services pay-as-you-go

Each service will explain its purpose, member participation, available demo action, rollout stage, and link to its proposal detail.

## Proposal, architecture, and rollout

- Move the current privacy protocol and trust-index principles into five contextual hints near the services they govern.
- Replace the simple architecture row with a layered infographic explaining technologies and user capabilities from data and trust through service orchestration, communications, intelligence, and interfaces.
- Rewrite the roadmap as a timeline with feature unlocks across three stages:
  1. Operational product — internal testing, onboarding, service-usability feedback
  2. Service unification — connected workflows and internal billing
  3. AI service integration — controllable network growth and intelligence
- Keep pricing as a separate proposal route, no longer in global navigation.

## Technical details

- Primary changes: shared shell, network route, graph rendering, filters, language dictionary, member cabinet, proposal, and semantic design tokens.
- Existing anonymisation remains server-side. Demo project, message, invitation, alert, and billing interactions remain browser-local mock data and will be clearly presented as demonstrations rather than shared production records.
- Existing `/directory`, `/coordinator`, and `/proposal` URLs remain valid, but normal navigation moves into the graph overlays and cabinet.
- The World Monitor link opens externally; this phase demonstrates the entry point and service description rather than embedding or cloning World Monitor.

## Validation

- Verify desktop and mobile layouts, first-screen graph visibility, filters, slide-over panels, expert actions, sign-in state, mock composer flows, external War Room opening, and all route metadata.
- Confirm the preview builds without errors.
