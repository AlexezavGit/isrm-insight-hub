# ISRM: інвентаризація семи checkout-ів і межі конфігуратора — 2026-11-10

## Межі перевірки

Перевірено `git worktree list --porcelain`, `git status`, локальні refs і HEAD у двох клонах: `/Users/alexzvo/.copilot/repos/isrm-insight-hub` та `/Users/alexzvo/Documents/ChatGPT/isrm/isrm-insight-hub`. Знайдено сім checkout/worktree: п’ять на іменованих гілках і два detached. Це **не сім назв гілок**: гілка є змінним посиланням на історію, checkout — окремим робочим деревом; у клонах є також refs, які зараз не checkout-нуті. Паспорт кількості checkout-ів: `ISRM-OBS-WORKTREE-CHECKOUTS-2026-11-10` у [Registry](../REGISTRY.csv).

Перевірка локальна й обмежена цими двома клонами на 10 листопада 2026 року; вона не доводить відсутність інших копій на дисках, хмарних сховищах або в інших сесіях. Git-статус не дає підстав видаляти чи скидати жоден робочий стан. Значення персональних даних сюди не копіювалися.

## Сім перевірених checkout-ів

| Checkout | Гілка або стан | HEAD | Зміни та рішення |
|---|---|---|---|
| Copilot clone: `/Users/alexzvo/.copilot/repos/isrm-insight-hub` | `isrm-partner-ranges-v1` | `0bf378f` | Є зміни `.andromity/crons.json` і `.gitignore`, локально видалені `AGENTS.md`, CRM-таблиця, початковий prompt та файли pricing-model; поряд є численні локальні документи, протоколи, архіви й повторно додані матеріали. Це не чиста копія upstream. Не перемикати, не скидати й не чистити до розбору походження видалень і дублікатів. |
| Copilot worktree: `/Users/alexzvo/.copilot/repos/copilot-worktrees/isrm-insight-hub/alexezavgit-miniature-guide` | `alexezavgit-miniature-guide` | `a7aa00a` | Локальні зміни стосуються експертного JSON і серверної проєкції, типів та локалізації, сторінки експерта, OAuth resource route і MCP route. Поряд лежать локальні Playwright/browser-артефакти та скриншоти графа. Це не готовий production-патч; вміст із персональними даними не копіювався й не виводився. |
| Copilot worktree: `/Users/alexzvo/.copilot/repos/copilot-worktrees/isrm-insight-hub/mentalhealthyouare-spec-vigilant-broccoli` | `codex/isrm-client-release` | `9db2716` | Історія комітів охоплює приватний брифінг, scope-процес і рамку цінності експертизи. Незакомічені зміни охоплюють briefing/configurator/graph/catalog/draft/routes/styles та OAuth/MCP; є нові `ClientWorkflowGuide`, `group-insights` із тестом і чернетка handoff. Старий тестовий результат не підтверджує збірку чи коректність теперішнього повного diff. Не переносити файли цілком без ручного порівняння з production. |
| Kilo worktree: `/Users/alexzvo/.local/share/kilo/worktree-pool/isrm-insight-hub-d37c584a8694/charmed-plantain` | detached | `a7aa00a` | Чисте дерево на тому самому базовому commit, що й `alexezavgit-miniature-guide`. Воно керується Kilo; хоч це й дубль commit, не видаляти без окремого підтвердження та перевірки, чи його використовує сесія. |
| Документаційний clone: `/Users/alexzvo/Documents/ChatGPT/isrm/isrm-insight-hub` | `publish/isrm-client-dev-v2` | `8380485` | Тут лежать потрібні Registry, Overlay, Entry та інші локальні project docs. Трековані зміни включають README, Entry, user-journey review, індекс і також MCP/OAuth source-файли; нові матеріали охоплюють Registry, Overlay, дослідження, capability map, plan, session notes та архіви. Гілка розходиться з налаштованим upstream; не пушити її цілком. Це приватна робоча копія, а не вже опублікована документація. |
| Документаційний worktree: `/Users/alexzvo/Documents/ChatGPT/isrm/work/isrm-live-port-review` | detached | `3ce1306` | Локальний patch до `NetworkGraph`, `NetworkWorkbench`, `NetworkShortlist`, стилів та нові `group-insights` і тест. Його задум — квадратна позначка вибраного профілю й підсумок групи; це окремий кандидат для ручної звірки, не злитий і не розгорнутий. |
| Документаційний worktree: `/Users/alexzvo/Documents/ChatGPT/isrm/work/isrm-prototype-panels` | `codex/isrm-prototype-panels` | `900e4ed` | Коміт `900e4ed` відкриває кореневий маршрут на робочому пошуку. Попередній `3fe4d2a` містить значну перебудову workspace, selection, scope та стилів. Трекований стан зараз чистий; локально лишилися `.playwright-cli/` і `design-qa.md`. Не плутати цей app-first commit із реалізацією конфігуратора чи з production release. |

У Copilot clone додатково є refs `main` і `andromity-snapshots`, які не відповідають окремим worktree. У документаційному clone refs `backup/isrm-before-client-release-20261026`, `codex/isrm-client-release`, `codex/network-workflow-batch`, `isrm-partner-ranges-v1` та `publish/isrm-client-release` також не слід плутати з окремими checkout-ами; той самий ref name в різних clones може мати різний локальний стан. За локальним ref `codex/network-workflow-batch` має подальший commit `c0c5343`, але перевірений release marker в окремій deployment-нотатці — `d950d52`; не робити висновку, що цей пізніший локальний tip уже задеплоєний.

Жоден із семи checkout-ів не видалявся або не скидався під час інвентаризації. Особливо не видаляти чистий Kilo `charmed-plantain`: чистота дерева не доводить, що сесія ним не користується.

## Чому не можна пушити документаційну гілку цілком

`publish/isrm-client-dev-v2` не є гілкою production. Вона має локальні коміти, яких немає в upstream, і водночас відстає від нього; звичайний push до налаштованого upstream не є fast-forward. Пуш force перезаписав би чужу історію, а публікація під новим remote branch оприлюднила б усю розбіжну історію, а не лише `Registry`, `Overlay` та `Entry`.

Репозиторій `AlexezavGit/isrm-insight-hub` публічний. У проєктних документах є абсолютні локальні шляхи та посилання на внутрішні джерела. Технічно можливо окремо підготувати очищений commit лише з погоджених документів поверх наявної гілки, але спершу треба перевірити й прибрати локальні шляхи та інший внутрішній зміст; без прямого рішення Алекса його не публікувати. Поточна документаційна копія лишається локальною.

## Кореневий пошук і граф конфігуратора — різні поверхні

Production `/` відкриває робочий пошук із графом експертів; `/scope` та `/proposal` збережені. Це app-first маршрут пошуку. Він **не є** екраном конфігуратора, на який стосувалася вимога графічно вибирати сервіси/функції та складати з них workflow.

Попередня помилка оцінки полягала в тому, що концепцію графа конфігуратора порівняли з кореневим графом пошуку. Висновок про відсутність запропонованої композиції на `/` не встановлює стан екрана конфігуратора. Проблеми читабельності та незгоду з конкретною композицією Алекс повідомляв саме щодо графа конфігуратора; для оцінки цієї поверхні треба дивитися її окремо, а не підміняти її production root.

Авторські ринкові тези, каталог функцій, залежності та workflow збережені в [сесійній нотатці з моделлю можливостей](2026-11-10-user-capability-model-and-branch-history.md) та [Capability Map](../capability-map.md). Це не підтверджує, що UX-концепція вже реалізована, і не затверджує MVP scope. Ринкові твердження про прогалини конкурентів лишаються гіпотезами до перевірки джерелами.

У графі конфігуратора функція, workflow, спільне ядро та тип зв’язку — окремі поняття; ці описи не стосуються автоматично графа пошуку. «Digital checked trust & influence» — авторська концепція ядра, а не доказ реалізованого trust score, перевірки експертів або спільної бази. MVP scope залишається непогодженим.
