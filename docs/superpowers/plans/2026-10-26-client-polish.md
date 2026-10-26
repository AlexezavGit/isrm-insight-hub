# Client polish Implementation Plan
> **For agentic workers:** Execute inline with superpowers:executing-plans. User approved implementation; no additional design gate.
**Goal:** Apply approved narrative and visual polish to existing client journey.
**Architecture:** Separate bilingual briefing content from slider rendering; existing graph receives stable slide-specific layers. Add isolated presentation visuals and a final CSS theme layer; preserve prices and authentication.
**Tech Stack:** React 19, TanStack Start, CSS/Tailwind, lucide-react.
**Spec:** docs/superpowers/specs/2026-10-26-client-polish-design.md
## Global constraints
Existing public anonymised view and member login remain intact. Prices 26000/10000/12000, payments 30/50/20 unchanged. No claimed live OSINT, integration or AI model. Fixed slider frame and controls; allow overflow at zoom. Giant subtle engineering grid. No orientation work.
## Review focus
Mobile portrait and landscape: stationary controls, readable content and no horizontal overflow. Both languages: same six sections. Reduced motion: layout settles without animation. Keyboard navigation must not hijack form controls. Scope draft and price must survive navigation.
## Task 1: Narrative and visuals
- [x] Add src/lib/briefing-slides.ts bilingual content and stable graph layers.
- [x] Update BriefingSlider.tsx: header title, six distinct visuals, remove animate button, reliable scroll reset and keyboard navigation.
- [x] Update /scope narrative and expertise horizon without touching calculation modules.
## Task 2: Design system
- [x] Add file-tab class to shared buttons; apply transparent file-divider treatment to bespoke client controls.
- [x] Apply DS blue/sand/gold, recessed title, giant grid and fixed responsive slider.
## Task 3: Verification and delivery
- [x] Run existing node tests (tsx loader via vite-node or esbuild bundle as available), build, targeted TypeScript check.
- [x] Browser-check all six slides, EN/UK, scope, graph, mobile and zoom; fix observed issues.
- [x] Review diff, preserve a reproducible build, deploy to existing Cloudflare project if accessible, verify live version.

## Verification / delivery record
- Existing suite: 16/16 passed; production build passed; no new TypeScript errors in changed files. Legacy internal partner TypeScript errors remain.
- Independent review: no important code regressions found; auth/pricing unchanged.
- Published and verified at https://isrm.pages.dev/proposal. Preview at https://client-polish.isrm.pages.dev/proposal is an earlier intermediate build.
- Verified six slides EN/UK, invariant 489.414px frame and footer at 1278x605; mobile 390x844, landscape 844x390, increased text and contrast, scope mobile width and network navigation.
- Reduced-motion blank graph corrected via warmup + first render; visually verified live graph behind slides.
- Minor: at the compact 1278x605 viewport UK slide 5 needs 9px internal scroll; footer remains stationary. Further 0.65rem padding refinement was built but not published after browser control was interrupted; source retained at published 1rem padding to match release.
- Ruling: keep small-screen internal scrolling rather than reduce legibility; main frame and controls remain fixed.
