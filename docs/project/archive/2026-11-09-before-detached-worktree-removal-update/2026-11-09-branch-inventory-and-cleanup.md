# Інвентаризація гілок і погоджене очищення — 2026-11-09

**Статус:** інвентаризацію виконано; за двома окремими підтвердженнями видалено п’ять локальних branch aliases і один чистий worktree. Решта refs та робочих дерев збережені.

**Джерело Git:** спільний репозиторій `/Users/alexzvo/.copilot/repos/isrm-insight-hub/.git`; перевірка виконана з наявного Copilot worktree `alexezavgit-miniature-guide`. Стан є локальним знімком на час перевірки; `git fetch` не виконувався.

## Виконане очищення

| Видалена локальна гілка | Видалений worktree | HEAD до видалення | Перевірка |
|---|---|---|---|
| `alexezavgit-studious-pancake` | `/Users/alexzvo/.copilot/repos/copilot-worktrees/isrm-insight-hub/alexezavgit-studious-pancake` | `a7aa00affc009fa21d2a38c25c60101852f81395` | Чисте дерево; вказувала на той самий коміт, що й `origin/main`. |
| `alexezavgit-super-dollop` | `/Users/alexzvo/.copilot/repos/copilot-worktrees/isrm-insight-hub/alexezavgit-super-dollop` | `a7aa00affc009fa21d2a38c25c60101852f81395` | Чисте дерево; вказувала на той самий коміт, що й `origin/main`. |

Підтвердження Алекса в поточній розмові дозволяло видалити саме ці дві локальні гілки та відповідні worktree. Обидві назви відсутні серед local refs і worktree після операції. `origin/main` і всі remote refs залишилися. Унікальні відносно production 15 комітів цільового стану продовжують бути збережені через `origin/main`; код, локальні незбережені зміни або будь-які інші worktree не видалялися.

Перший cleanup раунд видалив лише ці дві локальні гілки та відповідні чисті worktree. Після операції обидві назви були відсутні серед local refs і worktree. `origin/main` і всі remote refs залишилися. Унікальні відносно production 15 комітів цільового стану збережені через `origin/main`.

## Другий погоджений cleanup

Після окремого підтвердження видалено такі локальні aliases:

| Видалена локальна гілка | Видалений worktree | HEAD до видалення | Перевірка |
|---|---|---|---|
| `mentalhealthyouare-spec-expert-adventure` | — | `9db271626414fa5e1e05f10c95f7e414f97e2f8b` | Точно той самий коміт, що й збережена `codex/isrm-client-release`; окремого worktree не було. |
| `mentalhealthyouare-spec-insight-workflows-productization` | — | `a7aa00affc009fa21d2a38c25c60101852f81395` | Точно той самий коміт, що й збережені `origin/main` і поточна робоча гілка. |
| `mentalhealthyouare-spec-isrm-client-journey-audit` | `/Users/alexzvo/.copilot/repos/copilot-worktrees/isrm-insight-hub/mentalhealthyouare-spec-ubiquitous-succotash` | `a7aa00affc009fa21d2a38c25c60101852f81395` | Worktree був чистим; коміт лишився доступним через `origin/main` та інші refs. |

Після видалення перевірено відсутність усіх трьох local refs і пов’язаного worktree. `origin/main`, `codex/isrm-client-release`, інші remote refs та інші worktree не змінювалися.

## Опорні refs

| Ref | SHA | Порівняння / призначення |
|---|---|---|
| `origin/codex/network-workflow-batch` | `3ce13068` | За наявною документацією — гілка останньої успішної публікації; використана тут як production/reference base. |
| `origin/main` | `a7aa00a` | Відрізняється від production base: `origin/codex/network-workflow-batch...origin/main` = 114 комітів лише в production base та 15 лише в `origin/main`. Унікальні зміни включають OAuth/MCP, security fixes, MemberPress-незалежні інтеграційні та залежнісні правки. Збережена. |
| Local `main` | `a1b21a4` | Відстає від `origin/main` на 15 комітів і не має власних комітів поза історією production base. Немає окремого worktree. Не оновлювався й не видалявся: майбутній напрям основної гілки окремо не погоджено. |

## Інші гілки й worktree

| Ref / worktree | Фактичний стан під час перевірки | Висновок |
|---|---|---|
| `isrm-partner-ranges-v1` — `0bf378fde0b7`; worktree `/Users/alexzvo/.copilot/repos/isrm-insight-hub` | Гілка відстає від `origin/isrm-partner-ranges-v1` (`caaa5d5`) на 7 комітів; локальне дерево має 18 змінених/нових/видалених шляхів, серед них джерельні документи, протоколи, CRM-файл і матеріали проєкту. | **Зберегти.** Брудний worktree містить незбережений матеріал; не синхронізувати, не clean/reset і не видаляти. |
| `codex/isrm-client-release` — `9db271626414`; worktree `mentalhealthyouare-spec-vigilant-broccoli` | На 27 комітів позаду production base та має 2 коміти поза ним. Є 14 незбережених змін, серед них UI, scope, тести та нові workflow/insights файли. | **Зберегти.** Є окрема незбережена робота та дві унікальні коміти. |
| `mentalhealthyouare-spec-expert-adventure` — `9db2716` | Local ref без окремого worktree; точно вказував на той самий коміт, що й `codex/isrm-client-release`. | **Видалено** за окремим підтвердженням; коміт збережений через `codex/isrm-client-release`. |
| `andromity-snapshots` — `28e34cb` | Немає пов’язаного worktree. Містить 66 комітів поза production base; різниця зачіпає `.github/workflows`, `.kiro`, `.lovable`, `.mimosa`, `.cortex` та інші файли. У diff присутній шлях `.env`; його вміст не переглядався. | **Зберегти до змістового й чутливого-data review.** Це не порожній дублікат; не публікувати й не видаляти за одним лише ім’ям. |
| `mentalhealthyouare-spec-insight-workflows-productization` — `a7aa00a` | Local ref без worktree; той самий коміт, що й `origin/main`. | **Видалено** за окремим підтвердженням; коміт збережений через `origin/main`. |
| `mentalhealthyouare-spec-isrm-client-journey-audit` — `a7aa00a`; worktree `mentalhealthyouare-spec-ubiquitous-succotash` | Той самий коміт, що й `origin/main`; worktree був чистий. | **Видалено** за окремим підтвердженням; коміт збережений через `origin/main`. |
| Detached `alexezavgit-ideal-garbanzo` — `a7aa00a` | Чистий worktree без branch ref; той самий збережений коміт. | Залишено; окреме підтвердження на видалення не надавалось. |
| Detached `charmed-plantain` — `a7aa00a` | Чистий worktree у `/Users/alexzvo/.local/share/kilo/worktree-pool/...`, поза основним Copilot worktree pool. | **Не чіпати** без окремого визначення власника й призначення інструментального worktree. |
| `alexezavgit-miniature-guide` — `a7aa00a`; поточний worktree | Чотири незбережені записи: дві змінені OAuth/MCP route files і нові `.playwright-cli/`, `graph-search-desktop.png`. | **Не чіпати.** Це активний робочий стан цієї сесії. |
| Remote refs: `origin/main`, `origin/codex/network-workflow-batch`, `origin/isrm-partner-ranges-v1`, `origin/backup/isrm-before-client-release-20261026` | Залишені без змін; жодний fetch, push або видалення remote refs не виконувався. | **Зберегти.** |

## Висновок і наступне рішення

У двох погоджених раундах видалено п’ять локальних aliases; унікальні коміти лишаються доступними через `origin/main` та `codex/isrm-client-release`. Поточні local branch refs, що залишилися: `alexezavgit-miniature-guide`, `andromity-snapshots`, `codex/isrm-client-release`, `isrm-partner-ranges-v1` і `main`; remote refs не змінювалися. Окремо лишилися два detached worktree: чистий `alexezavgit-ideal-garbanzo` на `a7aa00a` та зовнішній для Copilot pool `charmed-plantain`. Брудні робочі копії збережені: 4 статус-записи в активному miniature-guide, 14 у client-release та 18 у partner-ranges. `andromity-snapshots` має 66 комітів поза production base й шлях `.env` у diff, вміст якого не переглядався; цей ref не є alias і має залишатися до окремого review.

Наступний можливий cleanup-об’єкт — лише чистий detached worktree `alexezavgit-ideal-garbanzo`; він не містить branch ref і посилається на збережений `a7aa00a`, однак видалення потребує окремого підтвердження. `charmed-plantain` лежить у зовнішньому Kilo worktree pool і не чіпати без окремого визначення власника/призначення та прямого дозволу. `andromity-snapshots`, брудні worktree, local `main` і remote refs не видаляти.
