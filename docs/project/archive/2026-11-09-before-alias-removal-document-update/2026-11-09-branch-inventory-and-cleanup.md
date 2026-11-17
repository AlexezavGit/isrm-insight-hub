# Інвентаризація гілок і погоджене очищення — 2026-11-09

**Статус:** read-only інвентаризацію виконано; видалено лише дві гілки та їхні чисті worktree за прямим підтвердженням Алекса. Решта refs збережені.

**Джерело Git:** спільний репозиторій `/Users/alexzvo/.copilot/repos/isrm-insight-hub/.git`; перевірка виконана з наявного Copilot worktree `alexezavgit-miniature-guide`. Стан є локальним знімком на час перевірки; `git fetch` не виконувався.

## Виконане очищення

| Видалена локальна гілка | Видалений worktree | HEAD до видалення | Перевірка |
|---|---|---|---|
| `alexezavgit-studious-pancake` | `/Users/alexzvo/.copilot/repos/copilot-worktrees/isrm-insight-hub/alexezavgit-studious-pancake` | `a7aa00affc009fa21d2a38c25c60101852f81395` | Чисте дерево; вказувала на той самий коміт, що й `origin/main`. |
| `alexezavgit-super-dollop` | `/Users/alexzvo/.copilot/repos/copilot-worktrees/isrm-insight-hub/alexezavgit-super-dollop` | `a7aa00affc009fa21d2a38c25c60101852f81395` | Чисте дерево; вказувала на той самий коміт, що й `origin/main`. |

Підтвердження Алекса в поточній розмові дозволяло видалити саме ці дві локальні гілки та відповідні worktree. Обидві назви відсутні серед local refs і worktree після операції. `origin/main` і всі remote refs залишилися. Унікальні відносно production 15 комітів цільового стану продовжують бути збережені через `origin/main`; код, локальні незбережені зміни або будь-які інші worktree не видалялися.

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
| `mentalhealthyouare-spec-expert-adventure` — `9db2716` | Local ref без окремого worktree; точно вказує на той самий коміт, що й `codex/isrm-client-release`. | **Кандидат на локальний alias cleanup** після окремого підтвердження; не містить окремої історії, але не видалявся. |
| `andromity-snapshots` — `28e34cb` | Немає пов’язаного worktree. Містить 66 комітів поза production base; різниця зачіпає `.github/workflows`, `.kiro`, `.lovable`, `.mimosa`, `.cortex` та інші файли. У diff присутній шлях `.env`; його вміст не переглядався. | **Зберегти до змістового й чутливого-data review.** Це не порожній дублікат; не публікувати й не видаляти за одним лише ім’ям. |
| `mentalhealthyouare-spec-insight-workflows-productization` — `a7aa00a` | Local ref без worktree; той самий коміт, що й `origin/main`. | **Кандидат на локальний alias cleanup** після окремого підтвердження. |
| `mentalhealthyouare-spec-isrm-client-journey-audit` — `a7aa00a`; worktree `mentalhealthyouare-spec-ubiquitous-succotash` | Той самий коміт, що й `origin/main`; worktree чистий. | **Кандидат на alias/worktree cleanup** після окремого підтвердження. |
| Detached `alexezavgit-ideal-garbanzo` — `a7aa00a` | Чистий worktree без branch ref; той самий збережений коміт. | Можливий кандидат на видалення чистого worktree, але потрібне окреме підтвердження. |
| Detached `charmed-plantain` — `a7aa00a` | Чистий worktree у `/Users/alexzvo/.local/share/kilo/worktree-pool/...`, поза основним Copilot worktree pool. | **Не чіпати** без окремого визначення власника й призначення інструментального worktree. |
| `alexezavgit-miniature-guide` — `a7aa00a`; поточний worktree | Чотири незбережені записи: дві змінені OAuth/MCP route files і нові `.playwright-cli/`, `graph-search-desktop.png`. | **Не чіпати.** Це активний робочий стан цієї сесії. |
| Remote refs: `origin/main`, `origin/codex/network-workflow-batch`, `origin/isrm-partner-ranges-v1`, `origin/backup/isrm-before-client-release-20261026` | Залишені без змін; жодний fetch, push або видалення remote refs не виконувався. | **Зберегти.** |

## Висновок і наступне рішення

Погоджене очищення видалило дві дубльовані локальні назви, але не прибрало всі потенційні alias/worktree на `a7aa00a`. Важливі відмінності: гілка `andromity-snapshots` має значну власну історію; `isrm-partner-ranges-v1` та `codex/isrm-client-release` мають незбережені робочі дерева; `origin/main` містить 15 комітів, відсутніх у production base. Тому автоматичне прибирання інших refs не виправдане.

Наступний крок — вирішити окремо, чи прибирати лише три очевидні local aliases (`mentalhealthyouare-spec-expert-adventure`, `mentalhealthyouare-spec-insight-workflows-productization`, `mentalhealthyouare-spec-isrm-client-journey-audit`) та їхній clean worktree, чи спершу оглянути `andromity-snapshots` і detached worktree. Віддалені refs, брудні worktree, локальний `main` і поточний worktree не включати без окремого підтвердження.
