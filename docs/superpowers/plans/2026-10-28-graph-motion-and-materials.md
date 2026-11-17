# Graph motion and shared materials · implementation checkpoint

**Goal:** Implement the owner's successive approved visual and interaction corrections in one accumulated public release.

**Scope supplied by the owner:** default Play; unfold from one point with settling; hover illuminates recorded neighbours; zoom progressively reveals labels; grouped concentrator browsing without people; slow shrinking background graph on each briefing slide; moving light segment on the irregular orbit; matching translucent headers and slate folder tabs; British English; separate current-development estimate and organised working documents.

**Architecture:** Keep React Force Graph and the existing model/layout. A timed opening hands node positions to D3 after three seconds, with ISRM pinned. Only rendered edges participate in hover. A shared pure helper covers motion boundaries, direct neighbours and concentrator groups. SVG coordinates animate the briefing backdrop over four seconds; the light dash follows the existing closed path. The owner's explicit Play preference is local to this demonstration; no OS preference is changed. Pause remains visible.

**Constraints:** No fabricated relationships or accreditation. Keep the service wheel fixed. No private documents in the public repository/release. Original documents are preserved. Existing browser-local workflows remain demonstrations. No partner emails or real survey dispatch.

- [x] Add initially failing tests for reveal boundaries, four-second approach, immediate neighbours and category browsing without people.
- [x] Implement motion helpers and wire the live graph with cancellation on mode/pause/unmount.
- [x] Highlight direct neighbours/edges and introduce zoom-dependent labels with collision-aware placement.
- [x] Replace the mixed native select with collapsible categories and a three-letter filter; outside click/Escape dismiss it.
- [x] Implement keyed per-slide SVG approach, shared header material, active slate tabs and path-following sweep.
- [x] Regression: slides with no named community roles fall back to recorded sectors instead of an empty background; test before fix.
- [x] Review user-facing copy for British spelling. Internal schema keys remain compatible.
- [x] Move superseded private estimates/generators into a labelled archive, retain one current workbook, create a source manifest and an explicit backlog.
- [x] Final tests, focused lint, build and safe public sync; verify exact production SHA.

Review focus: pause/resume during opening, repeated slide changes cancel pending frames, empty roles do not invent data or erase the background, canvas label overlap, small-screen header width, no duplicate billing, and private/public separation.

Browser limitation in this environment: the previous browser runtime is unavailable and Kapture reports no connected tabs/extension. New UI motion has not been visually verified in the user's browser. Automated behaviour/build checks are reported separately. The optional attempt to verify the old local access password against production was rejected by automatic review; no retry or alternate route is used.

## Release

- Public commit: a9123d0ce4456bba8361f3166c799afcc09b1dbc.
- GitHub Actions 40711893913 completed successfully; install, all 50 tests, build, destination guard, deploy and exact-SHA production checks passed.
- Twelve reviewed source files copied to the safe public clone; no private documents copied. The prepared release contains only the application, standard metadata and two approved Markdown documents; no XLSX, DOCX, ZIP, source maps or private docs.
- Source/private commit f317070 retains the document index, archive, reference copies and backlog. The library workbook is unchanged and has six sheets including the separate current-development replacement estimate.
- Focused lint passes. The project-wide TypeScript check still reports pre-existing partner-route/test errors; no errors occur in this batch's changed modules.
- Browser visual verification remains outstanding because the browser connection is unavailable. No screenshot from an earlier release is represented as proof of this release.
