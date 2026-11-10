# Опублікування app-first збірки ISRM — 2026-11-10

## Результат

Актуальну робочу поверхню застосунку опубліковано на Cloudflare Pages: https://isrm.pages.dev/. Root (`/`) тепер відкриває пошук із графом, а не вступний екран. `/scope` та `/proposal` збережені й відповідають успішно. Реліз не означає, що локальні mock-процеси стали спільним production-сховищем або що весь продукт готовий до клієнтського handoff.

## Гілки та перенесення коду

- Кодову зміну app-first зафіксовано у вже наявній `codex/isrm-prototype-panels` комітом `900e4ed` (`Open the workspace on expert search`). Гілку не створювали.
- Production-гілка до релізу була `codex/network-workflow-batch` на `3ce13068e29304f1eeeb636ced07fd30c05953a2`.
- Оскільки production-гілка та актуальна кодова копія мали різні історії, повне злиття не виконували. У тимчасовому detached worktree від наявного production ref перенесли лише актуальне дерево `src/`, перевірили, що diff не містить `package.json`, deployment workflow чи scripts, і створили commit `d950d520f888285a8b5c7221366c848f22fe76e8` (`Publish current app workspace and preserve proposal routes`).
- Коміт запушено вперед у ту саму `codex/network-workflow-batch`; force push, rebase, amend, squash та видалення refs не виконувалися. Production workflow і скрипти лишилися незміненими.
- Активні `src/data/experts.json` і `src/lib/experts.server.ts` не містять ключів `phone` та `linkedin`. Це не повна анонімізація профільних даних і не очищення попередньої Git-історії.
- Внутрішні `docs/` і `plan/` із документаційної копії не переносили до публічної production-гілки. Документаційна гілка `publish/isrm-client-dev-v2` лишається окремою та розбіжною з `origin/isrm-partner-ranges-v1`; її не зливали й не пушили.

## Перевірки

У release worktree пройшли 100 library tests, Cloudflare Pages production build і підготовка allowlist release-артефакту. GitHub Actions workflow `Publish ISRM to Cloudflare Pages` завершився успішно: https://github.com/AlexezavGit/isrm-insight-hub/actions/runs/42756867706. Його smoke check підтвердив production SHA та маршрути `/proposal`, `/scope`, `/?view=map` і дозволені Markdown-файли.

Після deployment `https://isrm.pages.dev/release.json` повернув `d950d520f888285a8b5c7221366c848f22fe76e8`; прямі HTTP-перевірки `/`, `/scope` та `/proposal` повернули успішні відповіді. На production root візуально підтверджено граф пошуку та нижню навігацію; окремо локально переглянуто вузький mobile viewport. TypeScript `tsc --noEmit` у цьому release проході не запускався, тому попередні відомі типові помилки не вважаються виправленими.

## Документація та наступний стан

Кореневий README веде до `docs/project/ENTRY.md`, а той — до цієї нотатки. Попередні README, ENTRY та session-note index збережено до редагування в `docs/project/archive/2026-11-10-before-cloudflare-release-document-update/`; SHA-256 перелічені в `SHA256SUMS`.

Продуктова модель, межа першого клієнтського scope, імпорт, спільне збереження, доступи, manifest та event bus лишаються предметом попередньої дослідницької рекомендації й відкритих рішень. Графову композицію користувач раніше не прийняв; ця публікація її не оголошує погодженою. Зовнішня передача продукту як production-системи не підтверджена.
