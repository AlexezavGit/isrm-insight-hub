# User journey review — ISRM demonstration

Source read in full: «ШЛЯХ КОРИСТУВАЧА.md», Library libfile_d51633bc4af08191a6098252855dde9f (171 lines). Compared with src/routes/index.tsx and src/components/ClientConfiguration.tsx. This is an implementation review, not confirmation that every browser transition has been tested.

## Proposed sequence to agree before graph changes

1. Open the people graph with panels closed. Show visible people count and a compact legend that never overlap the header, dock or panels.
2. Search → apply → close panel → show the filtered graph. Preserve the search and selection when opening a mini dossier or returning from another panel.
3. A person opens a mini dossier. On touch, explicitly distinguish first-tap preview from the action that opens the dossier. Existing working browser-local selection should remain usable; do not replace functioning controls with an “under development” dead end.
4. A single left-side panel family provides Search / Services / Workflows tabs. Opening a service or workflow shows its right-side detail and closes the left selector. The graph shifts into available space.
5. Keep graph mode independent from panel visibility. Clicking the background closes panels without switching the service graph back to people. The current background handler resets dependenciesMode, so this does not yet match the document.
6. Show dependencies as a demonstration of relationships in the supplied data, with meaningful counts. Do not describe a categorical match as proof of suitability, verified expertise or an endorsement.
7. Custom service/workflow descriptions save into the same draft used by /scope, Markdown, PDF and email. Test that chain with a disposable draft and retain it across navigation.
8. Scope follows practical use of the application. Optional workflows are included for proposal estimation, not added as already-priced services.

## Contradictions to resolve in the source document

- “Return to group creation” is described as closing all panels and returning to the graph: the action label and destination disagree. Use “Return to the graph” or actually return to the group form, preserving entered data.
- “Always opens on a node or surface click” conflicts with node clicks opening dossier/detail panels. Separate background, person, service and workflow events.
- A group of services and actual people attached to them must not imply professional suitability that has not been reviewed.
- A full dossier or selection that already works locally should not become an artificial unavailable feature. Explain the local demonstration boundary at shared persistence or unavailable integrations.

## First implementation tranche recommended

Separate graph mode from open panel; unify the three left tabs; implement the right-side service/workflow detail with a clear return; verify custom-description export end to end. Styling, touch behaviour and overlap checks accompany that tranche. Shared storage, OSINT execution and integrations remain outside the current demo.
