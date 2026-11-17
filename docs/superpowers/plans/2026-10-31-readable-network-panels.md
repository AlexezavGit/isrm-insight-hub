# Readable graph and focused panels — implementation plan

**Goal:** Start graph expansions at a readable scale and give selection, dossier and configuration one clear job each.

**Authorised design:** The user's detailed instructions and subsequent “continue” define the design. No graph-image saving feature is requested. Keep selection persistence and label it accurately. No backend work, price changes or source-record verification is implied.

**Architecture:** Keep the existing graph and adjacent inspection dock. Use one service list and a service description in configuration; workflow descriptions move out of docked panels into dismissible hints on the graph. Store dossier working notes/statuses locally, separately from supplied evidence. Unconnected operations navigate to the relevant capability for agreement.

**Tech stack:** Existing React/TypeScript, react-force-graph, native details, browser storage and route search state; no new dependency.

## Tasks

- [x] `network-layout.ts`, `NetworkGraph.tsx`: readable automatic scale at or above the expert-label threshold; an explicit overview can show the whole graph. Preserve live unfolding, dragging, hover and user zoom. Cover readable and overview camera cases in layout tests.
- [x] `NetworkInspectionDock.tsx`, `network-dock.ts`, `NetworkWorkbench.tsx`, CSS: measure upper tabs, use their width and left edge for initial panel columns; keep resizing, same-edge stacking and a tappable graph strip on phones. Test column defaults and width bounds.
- [x] `NetworkShortlist.tsx`: remove mini-graph, profile descriptions and note editors; keep selected names, inspect, flag, remove, restore/save selection and download. Explain local browser storage, never call it an image snapshot.
- [x] `profile-work.ts`, `NetworkProfile.tsx`: preserve per-person notes; add local working review marks, distinct from supplied status hierarchy. Expand to full dossier by width or button. Unconnected review/research/recommendation/group operations go to a named configurator service or scope; keep the guided research example labelled and separate. Test storage isolation, malformed input and no mutation of source records.
- [x] `NetworkCapabilityTree.tsx`, `NetworkWorkbench.tsx`: flat service choices, no workflow description pane. Workflow node clicks and information controls show dismissible graph hints. Retain composition changes and scope handoff.
- [x] `NetworkConnectionPath.tsx`, `NetworkGraph.tsx`: route-finding controls live only on graph, with route drawn there rather than a dossier text list.
- [x] Update guided replay anchors/copy where panel structure changes. Verify targeted tests, all library tests, lint/build, source-only publication and exact release. Do not claim live browser verification if none is available.

## Review focus

Do not overwrite another person's notes, restore walkthrough examples into real storage, label a working mark as actual verification, lose selected people while inspecting, or let three panels consume the entire viewport. No graph screenshot/image-save implementation.

## Verification

80 tests passed, including server-rendered mini/full dossier and selected-only shortlist checks, camera scale, dock columns, isolated notes and restore preservation. Focused lint and production builds passed. No connected browser tab was available; creating a test tab also timed out, so live visual alignment and gestures are not claimed as verified. No graph screenshot saving was added; the existing saved selection is labelled explicitly as local browser storage.

## Release evidence

Published source: `0490b0c5e786f630f7428c3af0bf9d166dd3f4c9` on `codex/network-workflow-batch`. Cloudflare workflow https://github.com/AlexezavGit/isrm-insight-hub/actions/runs/41147804640 succeeded. Exact release and five route/document checks passed. The live configuration route serves the flat service chooser and no old workflow pane. All 19 changed source/test files match the public checkout. Price data and private partner materials were not changed or published. The return-to-graph control remains visible beside the counters and closes all panels.
