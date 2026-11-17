# Workflow pricing and partner workbook implementation plan

Goal: fulfil Alex's instruction to add a separate future monitoring workflow, repair selectable scope workflows, show indicative optional prices and supply a private partner comparison workbook.

Architecture: keep one public planning basis (hours, UK scenario rate, overhead and target discount) for the website and spreadsheet. Keep Ukrainian costs, partner fees, allocations and all internal source workbooks private. Existing core/fallback entry prices remain £33,600/£10,080. OSINT technical connection is included once in core and incremental only in fallback. Future monitoring is proposed, not connected or operating.

## Tasks
- [x] Add regression tests for selecting a workflow from fallback, restoring the core, preserving requests, summing optional workflow/OSINT prices and retaining unknown cost distinctions.
- [x] Add monitoring to the shared catalogue/schema/export and graph tree as a clearly future workflow. One bounded source, topic/region filtering, expert review and briefing archive. Proposed160developer hours; licences and ongoing analyst/reviewer work separate.
- [x] Use existing216/256workflow and96OSINT hours, £60UK scenario,25–30% overhead,30% target discount. Show ranges and priced subtotal independently of unpriced custom requirements. Do not duplicate the96hours already inside640core hours.
- [x] Make workflow selections return from fallback to full scope with a visible explanation. Apply consistently in scope/configuration/network.
- [x] Build a private editable XLSX with summary, detailed developer WBS, partner responsibilities and fee inputs, OSINT/recurring cost inputs and dated market benchmarks. Unknown amounts must not become zero or distributable profit. Keep graph compensation separate and subtract once.
- [x] Run behavioural tests, build and focused checks; browser desktop/mobile and exports; inspect/recalculate/render workbook; commit locally and publish only public application changes through the safe clone in one batch.

Review focus: fallback exclusivity, persisted older drafts, additive workflow prices, public/private separation, core OSINT double counting, unpriced partner/recurring work, future-monitoring status and licences.

## Pricing checkpoint
- All43behavioural tests pass, Pages build passes, focused lint passes and changed modules have no TypeScript errors (the pre-existing partner/test issues remain).
- Browser confirmed fallback10080 + OSINT5040 =15120 low; selecting engagement restores core and retains workflow. Known subtotal stays visible with an unpriced legacy survey request. Monitoring selection appears as its own priced line.
- Private six-sheet workbook exported, recalculated and rendered; saved XLSX re-opened successfully with cached formula results and a valid numeric date. Input changes, optional selection, missing costs and restoration were tested. Library id libfile_c19df3d634388191a765aace684673c7. Contains separate current-demonstration replacement estimate132–212hours, not historical billed time.
- Current source history alone has11calendar dates of source commits from22September to28October;137trackedsrcfiles and30172lines before this package. Multi-branch log has19dates; neither is a workday/time record. The workbook does not use these counts to price labour.
- Remaining: final mobile check, safe public source sync and one accumulated deployment after the subsequent UX batch. Internal workbook/builder/notes never enter public source or Pages assets.

## Next UX batch (owner explicitly requested after completing pricing)
- [x] Search second click closes both explicit and persistent panels.
- [x] Structured people view separates expertise, sector and country radii; preserve the initially live draggable graph.
- [x] Restore the six-field requirement template from isrm-partner-ranges-v1 into the shared request composer.
- [x] Compact movable node inspection strip, expandable service descriptions and an obvious questionnaire preview before scope approval.

## UX verification and completed local package
- Search persistent/expanded state reproduced in Chrome before the fix; after the fix two successive clicks close/open correctly. Mobile390px: panel318px,72px graph gutter, document390px; second click removes the panel.
- Structured category regression failed before layout change and passed afterwards. Expertise230, sectors310, countries390; faint guides appear only in structured overview. Person-centred distance rings and initial live simulation retain their existing behaviour.
- Restored the six exact questions/help from the old MemberCabinet template. Browser filled role/problem/result/data/acceptance, saved to scope and verified all supplied text. Removed only the QA-created request afterwards. Canonical summary/Markdown/email test covers retention.
- Questionnaire is visible in the graph legend and above the workflow tree. Browser opened the canonical approved eight-question Markdown in a modal, without navigating toscope or collecting answers. Survey service selection also opens the preview directly.
- Service description is collapsible; users/outcomes/dependencies/technology disclosure starts closed.
- Native Chrome click selected Austria; node actions strip measured38.8pxdesktop. Native pointer drag moved it180pxleft/100pxup. ArrowRight moved24px. Mobile strip75.6px high, fully inside390px document. Position resets on viewport resize. Proof: docs/review/graph-ux-refinement-2026-10-28.png.
- Final45behavioural tests and Pages build pass. Focused lint clean. Global TypeScript retains the previously recorded partner/test errors; changed modules have no errors.

## Publication checkpoint
Pricing and the first graph UX package were published successfully as public commit f82ed8f47a79d09f158a543556f8ca95a4cdc4e2 (Actions 40680333769). The subsequent receipt/material/motion package is tracked separately in the 2026-10-28 graph-motion plan. Current workbook remains the six-sheet Library version1; no new estimate of measured hours has been introduced.
