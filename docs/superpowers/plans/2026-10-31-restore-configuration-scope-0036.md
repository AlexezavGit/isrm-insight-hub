# Restore configuration and scope to 00:36 Kyiv time

The user requests a rollback of the configurator and `/scope`, dated 31 October 2026 at 00:36 Europe/Kyiv. Git identifies public `a52daf83e9e897c9c78a04e15564e60cdd4f9a30` (30 October 21:40 +02:00) as the last published source before the cutoff. Private source at that cutoff is `f960aa2`.

Restore the scope markup, capability decks, operational note, response/export logic, workflow tree and configuration walkthrough. Restore adjacent tree → workflow → service panels, historical panel sizing and camera fit. Retain current presentation and operational expertise prototype, including dossiers, notes, shortlist and readable graph. Scope/configuration header and styles use their historical presentation; the latest inspection styling is scoped to the prototype. Keep browser selections and notes intact. Apply a new forward commit; do not reset, rewrite history, or discard the more recent versions.

- [x] Identify the published revision before the cutoff.
- [x] Restore scope and configuration while isolating retained prototype behaviour.
- [x] Verify restored files against baseline, configuration tree/panels, retained prototype tests, lint and build.
- [x] Publish source-only changes, verify the exact production release, and commit the local result.

Verification before publication: eight restored modules/markup were compared with the cutoff revision (scope differs only by the isolated historical-header flag); the full cutoff stylesheet remains an unchanged prefix. 80 tests, focused lint and build passed. Prototype dossier/shortlist components and working-note storage are retained. No browser data was erased.

Published rollback: `3ce13068e29304f1eeeb636ced07fd30c05953a2`. Cloudflare workflow https://github.com/AlexezavGit/isrm-insight-hub/actions/runs/41184536813 succeeded. Exact release and five standard route/document checks passed. Live HTML verifies historical scope fields and header, workflow tree in configuration, absence of the flat service picker, and retained prototype mode without the historical header. No force push or history rewrite.
