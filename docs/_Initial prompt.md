# промпт нетворк
Потрібно створити з цього промпт з loop та gates для звірки якості, по всім напрямам: розрахунки, дизайн, розділи, архутектура, технології, швидкість та інше.

Створюємо пропозицію - конфігуратор платформи.
один робочий екран із перемиканням шарів і режимів, а не три окремі сторінки. Це спрощує сприйняття, якщо чітко розділити:
	•	верхні чотири панелі — керування шаром експертної мережі;
	•	нижні чотири панелі — керування шаром функцій і платформи;
	•	перемикач режиму — EXPERTS / FEATURES / MIX;
	•	перемикач видимості шарів — Network layer / Feature layer / Both.
1. Рекомендована модель одного екрана
Режим EXPERTS
Граф показує:
	•	експертів;
	•	сектори;
	•	території;
	•	зв’язки;
	•	verified/in review як статуси;
	•	вибрану групу;
	•	поточні результати фільтрації.
Верхній рядок:
	1	FILTERS
	2	SECTORS
	3	TERRITORIES
	4	EXPERT NETWORK
Цього достатньо. Influence, Trust, Projects та інші індекси не повинні конкурувати з основним сценарієм — їх краще розмістити у досьє або в шарі конфігуратора.
Режим FEATURES
Граф частково або повністю перемикається на:
	•	structural components;
	•	optional features;
	•	dependencies;
	•	integrations;
	•	delivery stages;
	•	feature dossiers.
Нижній рядок може містити чотири панелі, наприклад:
	1	FOUNDATION
	2	FEATURES
	3	DEPENDENCIES
	4	PROPOSAL
Це краще, ніж повторювати назви верхніх кнопок. Верхній і нижній рядки мають однакову механику, але різну семантику.
Режим MIX
Це найцікавіша частина концепції. Граф не замінюється другим графом, а показує проєкцію:
Plain text
експерти → сектори → функції → сервіси → потенційний обсяг використання

Наприклад, клік на feature:
	•	підсвічує відповідний вузол функції;
	•	показує пов’язані сектори;
	•	виділяє експертів, які потенційно можуть бути залучені;
	•	показує кількість таких експертів на тестовій групі;
	•	відображає залежності та пов’язані інтеграції.
Це може добре пояснити ідею SaaS: не як абстрактну підписку, а як регулярний доступ до платформи, її операційних функцій і мережевого потенціалу.
Але треба маркувати цифри:
Potential expert reach based on the current demonstration dataset. Not a forecast of actual demand or usage.
Інакше користувач може сприйняти проєкцію як фінансовий прогноз.
2. Перемикання шарів
Потрібні дві різні дії:
Видимість шарів
Plain text
[✓] EXPERTS
[✓] FEATURES
[ ] RELATIONSHIPS
[ ] CLUSTERS

Це відповідає на питання: що зараз видно на графі?
Режим взаємодії
Plain text
EXPERTS | FEATURES | MIX

Це відповідає на питання: з чим зараз працює користувач?
Не варто об’єднувати ці поняття в одну кнопку. Наприклад, режим FEATURES може показувати feature graph, але користувач ще може залишити експертний шар увімкненим для порівняння.
Кнопка MIX має бути поруч із перемикачем шарів, але її треба оформити як окремий помітний режим:
Plain text
NETWORK
PLATFORM
MIX

При переході:
	•	змінюється заголовок активного режиму;
	•	змінюється акцентна рамка;
	•	змінюється легенда;
	•	показується коротке пояснення;
	•	зберігається вибір експертів і функцій.
Перехід із темного режиму в світлий я б не використовував як основний сигнал. Зміна теми може виглядати декоративно або створити проблеми з контрастом. Краще використати:
	•	чітку зміну кольору рамок;
	•	іншу легенду;
	•	інший підзаголовок;
	•	видимий mode label;
	•	коротку transition-анімацію;
	•	зміну типу вузлів і ребер.
Темну/світлу тему можна залишити як підтримувану тему дизайну, але не як єдиний індикатор режиму.
3. Панелі, що висуваються і зникають
Сама ідея правильна. Вона відповідає графовому робочому середовищу: користувач швидко висуває інструмент, застосовує його, ховає і знову працює з графом.
Але потрібні три стани, а не лише open/closed:
	1	Preview — відкрився при hover або focus.
	2	Pinned — закріплений кліком або клавіатурою.
	3	Closed — схований.
Правило:
	•	hover відкриває лише preview;
	•	click закріплює панель;
	•	клік поза панеллю або Escape закриває;
	•	якщо курсор перемістився з кнопки всередину панелі, вона не закривається;
	•	на mobile hover не використовується;
	•	на mobile панель відкривається tap і має явний Close.
Це збереже задум “висунути → попрацювати → сховати”, але не створить ситуацію, коли панель зникає посеред вибору checkbox.
4. Наскрізний сценарій стає сильнішим
Після уточнення він виглядає так:
Plain text
NETWORK mode
→ фільтри
→ сектори / території
→ expert listing
→ вибір групи
→ mini dossier
→ MIX mode
→ feature selection
→ feature projection on experts
→ layer comparison
→ PROPOSAL
→ validated scope document
→ PDF export
→ client approval
→ contract and full SOW

Це вже не просто презентація. Це інтерактивний discovery та scope-definition інструмент.
Важливо не називати фінальний документ просто Proposal, якщо клієнт його погоджує до договору. Краще розділити документи:
Документ 1 — результат конфігуратора
Validated Scope & Budget Range
Містить:
	•	обрані structural components;
	•	optional features;
	•	виключені можливості;
	•	залежності;
	•	інтеграції;
	•	технічний підхід;
	•	етапи;
	•	припущення;
	•	діапазон бюджету;
	•	очікуваний графік;
	•	відкриті питання;
	•	статус for confirmation.
Це ще не повне ТЗ і не договір.
Документ 2 — після підтвердження клієнта
Commercial Proposal & Statement of Work
Містить:
	•	уточнений scope;
	•	повний технічний опис;
	•	ролі команди;
	•	конкретні deliverables;
	•	acceptance criteria;
	•	календар;
	•	payment schedule;
	•	IP;
	•	support/SaaS;
	•	change-control;
	•	юридичні умови.
Така двоступенева модель набагато надійніша, ніж спроба зробити один PDF одночасно і презентацією, і ТЗ, і договором.
5. Ціноутворення: напрям правильний, але формулювання потрібно уточнити
Ідея показувати діапазон між верхньою українською та верхньою американською ставкою може бути корисною як переговорний коридор, але її не можна подавати як об’єктивну ринкову істину без актуальної перевірки та порівнянності scope.
Краще показати три рівні:
Plain text
Estimated delivery range
нижня межа — lean / Ukrainian delivery model
верхня межа — expanded / US-comparable delivery model

І поруч пояснити:
	•	це не дві різні якості продукту;
	•	різниця пов’язана зі складом команди, резервом, рівнем сервісу, відповідальністю та операційною моделлю;
	•	остаточний розрахунок буде зроблений після підтвердження функцій;
	•	команда та навантаження будуть скориговані після discovery;
	•	зовнішні API, hosting, data services та recurring SaaS costs можуть рахуватися окремо.
Не варто писати просто “українська ціна / американська ціна”. Це може звучати як географічне дисконтування людей, а не як різні delivery-моделі.
Передплата 30%
Це можна закласти як:
Plain text
Initial mobilisation payment: from 30% of the agreed delivery budget.

Але важливо не подавати 30% як остаточне правило до погодження моделі роботи. Воно залежить від:
	•	розміру команди;
	•	необхідності резервувати спеціалістів;
	•	Discovery;
	•	закупівлі інтеграцій;
	•	етапності;
	•	ownership/IP-моделі;
	•	ризику зміни scope.
У конфігураторі краще показати:
	•	Indicative mobilisation payment: 30%+;
	•	Final payment schedule confirmed in the commercial proposal.
6. Варіанти відносин мають впливати на ціну
Це важливе уточнення. Варіанти не повинні бути просто текстовими картками в кінці.
Потрібно показати, що модель відносин змінює:
	•	ownership;
	•	повторне використання компонентів;
	•	підтримку;
	•	governance;
	•	SaaS;
	•	рівень відповідальності команди;
	•	можливу участь у розвитку продукту;
	•	ціну або структуру платежів.
Наприклад:
A. Product for this community
	•	максимальна адаптація під одну спільноту;
	•	більший обсяг кастомізації;
	•	можливе обмеження повторного використання;
	•	вищі вимоги до передачі коду та IP;
	•	разова розробка плюс окрема підтримка.
B. Founding partner / shared development
	•	спільна перевірка першого циклу;
	•	частина рішень може бути reusable;
	•	окреме погодження governance;
	•	можливе зниження початкового навантаження, але не автоматично;
	•	SaaS або revenue model тільки за окремою домовленістю.
C. Platform service / sustainable development
	•	базова платформа;
	•	регулярний service/support retainer;
	•	optional modules;
	•	інтеграційні та операційні витрати;
	•	довгостроковий roadmap.
У UI це потрібно позначити як commercial assumptions, а не як уже доступні юридичні продукти.
7. Технічний стек потрібно показувати у двох рівнях
Ви праві: для decision-maker повний стек буде абракадаброю, але технічно компетентна людина має його оцінити.
Тому потрібні два шари.
Короткий шар для клієнта
Plain text
Secure multi-community web platform
with expert search, graph visualization,
configurable modules and integration adapters.

Technical appendix
	•	React / TypeScript;
	•	graph visualization layer;
	•	relational data model;
	•	search/indexing;
	•	authentication and role-based access;
	•	consent and visibility rules;
	•	audit events;
	•	integration adapters;
	•	server-side persistence;
	•	deployment/runtime;
	•	monitoring;
	•	AI/OSINT human-review controls;
	•	data import pipeline.
Також треба чесно розділити:
	•	implemented in prototype;
	•	proposed architecture;
	•	integration candidate;
	•	requires technical validation.
Логотип інтеграції не повинен виглядати як доказ уже готового конектора.
8. Дизайн: напрям правильний, але не варто копіювати “McKinsey” буквально
Використати McKinsey як орієнтир на:
	•	інформаційну ієрархію;
	•	логіку executive document;
	•	структуру сторінки;
	•	дисципліну таблиць;
	•	чіткість висновків;
	•	якість діаграм;
можна.
Але не слід ставити завдання “зробити як McKinsey” або “як LinkedIn”. Це надто широкі та різні стандарти:
	•	LinkedIn — продуктова платформа з величезною кількістю production-патернів;
	•	consulting-grade PDF — структурований документ для прийняття рішення;
	•	ваш прототип — інтерактивний discovery/configuration experience.
Краще сформулювати стандарт так:
Consulting-grade information design, production-grade interaction patterns, accessible graph exploration, and explicit separation between live prototype, proposed architecture and commercial assumptions.
Щодо візуальної системи, ваш опис має сенс:
	•	темна робоча поверхня для мережі;
	•	світла паперова поверхня для підсумкового scope/PDF;
	•	тонкі акцентні рамки;
	•	тінь і підняті панелі;
	•	локальне світло над поверхнею;
	•	топографічний фон;
	•	збільшений крок сітки;
	•	відсутність надмірної blueprint-сітки;
	•	різні рівні поверхонь;
	•	стримана, не “корпоративно-рожева” палітра.
Але я б не синтезував світлу і темну тему в один хаотичний екран. Краще:
	•	NETWORK / MIX — темна interaction surface;
	•	PROPOSAL / PDF — світла document surface;
	•	перехід між ними — через режим, рамку, легенду та layout, а не лише через різку зміну кольору.
9. Loop-промпт справді має сенс
Так, окремий loop-промпт допоможе не повертатися щоразу до пояснення всіх стандартів. Але він повинен бути не рекламним, а операційним: із критеріями готовності, заборонами та порядком перевірки.
Його структура має бути такою:
Plain text
ROLE
Працювати як senior product architect, UX lead,
accessibility reviewer, technical lead and commercial analyst.

PRODUCT PRINCIPLE
One-screen graph-based discovery and configuration experience.

MODES
EXPERTS / FEATURES / MIX.

VISIBLE STATES
LIVE DEMO / PROPOSED / UNDER DEVELOPMENT /
REQUIRES CONFIGURATION / REQUIRES ORDER.

UX RULES
No hover-only controls.
One shared state across graph, listing, feature map and proposal.
Explicit layer controls.
Textual alternative to every graph-only relationship.
Mobile-first fallback for every desktop interaction.

COMMERCIAL RULES
Indicative range, not fixed offer.
Do not invent market data.
Separate foundation, optional scope, support, SaaS and external costs.
30%+ mobilisation is indicative until commercial model is selected.

TECHNICAL RULES
Integration-first.
No production claims for localStorage/demo inbox.
No unsupported AI or influence ranking.
All feature additions require dependencies, acceptance criteria and pricing class.

DESIGN RULES
Dark graph surface.
Light proposal/PDF surface.
Raised panels, controlled shadows, topology-inspired background,
large grid interval, restrained color system,
text labels in addition to color.

QUALITY GATES
1. User can understand current mode within 3 seconds.
2. User can find an expert without hover.
3. User can explain why a feature is selected.
4. User can see what is lost if excluded.
5. User can identify live versus proposed functionality.
6. User can complete the core scenario on mobile.
7. PDF contains scope, assumptions, range and next step.
8. No runtime or type errors.
9. No unsupported factual or pricing claims.
10. No action appears completed when it is only under development.

LOOP
Inspect current state.
Identify one highest-impact inconsistency.
Change only the necessary files.
Run targeted validation.
Review desktop/mobile/accessibility.
Record remaining risk.
Repeat until all quality gates pass.

Цей промпт буде кориснішим за посилання на “топ-10 продуктів”, бо перетворює абстрактне бажання “зробити доросло” на перевірювані критерії.
Висновок
Нова ідея з одним екраном, двома графовими шарами та режимом MIX підсилює продукт значно більше, ніж попередня модель трьох майже незалежних сторінок.
Найкраща фінальна конструкція:
Plain text
ONE SCREEN
├── EXPERT MODE
│   ├── top four filter panels
│   └── expert graph/list/dossier
├── FEATURE MODE
│   ├── bottom four configurator panels
│   └── feature dependency graph/cards
├── MIX MODE
│   └── expert-to-feature projection
└── VALIDATED SCOPE
    └── PDF → client confirmation → contract + full SOW

Критично важливо не дозволити:
	•	hover-only interaction;
	•	непрозорий influence score;
	•	змішування demo та production;
	•	видачу Validated Scope за договір;
	•	подання ретейнера як вартості самої розробки;
	•	псевдоінтеграції або вигадані ринкові цифри.
Так, loop-промпт із цими стандартами варто зафіксувати до початку наступної серії змін.
You said: Трішки додам: - Influence, Trust, Projects - занести до фіч, інтдекси туди ж, траст по обєктивним перевіркам, інфлюєнс в задежності…
Трішки додам:
	•	Influence, Trust, Projects - занести до фіч, інтдекси туди ж, траст по обєктивним перевіркам, інфлюєнс в задежності від активності та охоплення - теж обєктивно, але це дійсно заморочка побудувати. Якщо є топ міліардерів та кращіх світових топменеджерів, а експертні такі рейти є? Це може бути яркий продукт з провідною якою небудь конторою - за участі AI для обєктивності як раз.
	•	FUNCTION (з точки зору членів комьюніті) які збираються у FUTURES (вимикання функції або фічі) вимиканя будь якої функції, група яких створює фічу - фактично модуль, вирубає весь модуль і навпаки вирубання фцнкції аимикає декілько фенкцій відповідні. Функції та фічі мають використовувані TECHNOLOGY (база для погодинного розрахунку навантаження) таким чином вибодовують орієнтовну ціну - калькулятор приблизного розрахунку меж бюджету, з примітками чого туди не входить. Але коливання ціни буде не пропорційним, бо команду, потрібну для створення базових фіч, не розгониш тільки тому що прибрали якусь функцію. Тільки якщо прибрати базові сервіси, а їх прибрати неможливо.
	•	MIX можливо переназвати DEPENDENCIES
Створбємо промпт та план та контрольні точки погодження на кожному етапі з воротами якості для loop де на початку завдання після підтвердження плану створюєш собі лістінг з чек боксами, а на при кінці перед видачею перевірка та бенчмарк, з виправленням перед видачею
Чи потрібно підключити додати які небудь скіли?
1m ago
Thought for 11s
Ran 1 skill
Copilot said: Так. Доповнення уточнює модель і робить її сильнішою: - Influence, Trust, Projects стають майбутніми функціями/модулями, а не постійними метриками верхньої…
Так. Доповнення уточнює модель і робить її сильнішою:
	•	Influence, Trust, Projects стають майбутніми функціями/модулями, а не постійними метриками верхньої панелі.
	•	MIX доцільно перейменувати на DEPENDENCIES: цей режим пояснює, як функції, модулі, експерти та інтеграції пов’язані між собою.
	•	Функції формують фічі/модулі; модулі формують платформу.
	•	Ціна повинна рахуватися не як сума рядків, а через ресурсну модель із базовим навантаженням команди.
	•	Structural foundation формує незнімну базу; optional features додають змінне навантаження.
	•	Trust та Influence не повинні з’являтися як готові рейтинги, доки не визначені джерела, методика, нормалізація, період і процедура оскарження.
Щодо ринку: існують окремі типи експертних рейтингів — бібліометричні, професійні, медійні, рейтинги авторитетності, thought-leadership, оцінки впливу організацій і мережевої центральності. Але універсального, загальновизнаного рейтингу “найкращих експертів” немає. Рейтинги мільярдерів або топменеджерів не є прямим аналогом: вони здебільшого вимірюють статки, посади, публічну видимість або корпоративні результати. Це може стати окремим premium-продуктом у партнерстві з дослідницькою, рейтинговою або OSINT-компанією, але не повинно бути заявлено як готова властивість поточного прототипу.
Loop-промпт для подальшої роботи
Plain text
Ти працюєш як senior product architect, UX lead, interaction designer,
accessibility reviewer, technical lead та commercial analyst.

## Контекст продукту

Потрібно розвинути один інтерактивний екран ISRM expert-network
у три пов'язані режими:

1. NETWORK / PROTOTYPE
2. PLATFORM CONFIGURATOR
3. DEPENDENCIES

Це не три незалежні сторінки. Це одна робоча поверхня з єдиним станом
вибраних експертів, функцій, модулів, інтеграцій і попереднього scope.

## Головна модель

NETWORK / PROTOTYPE показує:
- експертів;
- сектори;
- території;
- зв'язки;
- статуси перевірки;
- відібрану групу;
- короткі досьє;
- робочі фільтри на тестових даних.

PLATFORM CONFIGURATOR показує:
- structural components;
- функції;
- features/modules;
- integrations;
- future services;
- картки функцій;
- наслідки включення та виключення;
- попередній scope.

DEPENDENCIES показує:
- залежності між експертами, функціями, фічами, модулями та інтеграціями;
- потенційне охоплення експертів кожною функцією;
- проєкцію мережі на сервіси;
- залежність обсягу робіт і команди від конфігурації.

## Ієрархія функціональності

FUNCTION → FEATURE/MODULE → PLATFORM FOUNDATION

Вимкнення функції:
- вимикає пов'язані можливості;
- показує, що саме втрачено;
- оновлює listing;
- перераховує змінне навантаження.

Вимкнення feature/module:
- вимикає групу функцій;
- показує залежні модулі;
- пояснює вплив на користувачів, експертів, інтеграції та ціну.

Structural foundation:
- містить базові компоненти, без яких платформа не працює;
- не зникає через виключення другорядної функції;
- формує базове delivery-навантаження та потенційний support/operating retainer.

## Ціноутворення

Не складати ціну як просту суму рядків.

Розділяти:
- fixed platform foundation;
- minimum team capacity;
- variable feature effort;
- integrations;
- migration/import;
- discovery;
- support/operations;
- hosting and external services;
- SaaS or pay-as-you-go;
- optional AI/OSINT work.

Враховувати:
- базову команду не можна пропорційно скоротити через виключення однієї функції;
- суттєве скорочення можливе лише після вилучення базових компонентів або цілих модулів;
- кожна функція має technology dependencies і трудомісткість;
- діапазон є попереднім і підлягає уточненню після підтвердження scope;
- мінімальний mobilisation payment від 30% показувати лише як комерційне припущення
  до остаточного погодження моделі відносин.

Не називати цю модель остаточною ціною, рахунком або договором.

## Trust, Influence, Projects

Не показувати їх як безумовно готові рейтинги.

Вони мають бути майбутніми функціями або модулями.

Trust:
- тільки на основі визначених перевірок;
- джерело;
- дата;
- тип доказу;
- рівень упевненості;
- human review;
- appeal/correction path.

Influence:
- активність;
- підтверджене охоплення;
- виконані проєкти;
- релевантні публікації;
- цитованість або інші погоджені показники;
- період;
- нормалізація;
- захист від підміни публічної видимості впливом.

Projects:
- підтверджені проєкти;
- роль експерта;
- період;
- результат або статус;
- джерело підтвердження.

До затвердження методики:
- статус UNDER DEVELOPMENT;
- немає автоматичного ранжування;
- немає прихованого score;
- немає автоматичного блокування доступу;
- немає твердження про об'єктивність.

## Interaction rules

- Критичні дії не можуть залежати лише від hover.
- Hover може відкривати preview.
- Click, focus або tap закріплює панель.
- Escape або явна Close закриває панель.
- На mobile всі панелі мають працювати без hover.
- Відкрита панель не повинна зникати під час взаємодії з її вмістом.
- Одночасно відкривається максимум одна панель у кожному рядку.
- Усі фільтри, граф, listing, dossier, feature map і proposal використовують один state model.
- Кожна дія under development має пояснювати:
  1. що зараз недоступно;
  2. навіщо це потрібно;
  3. що буде доступно в майбутньому;
  4. до якої функції або модуля це належить;
  5. куди перейти далі.

## Accessibility

- Для графа існує повноцінний текстовий Connections List.
- Усі зв'язки мають тип, назву пов'язаного експерта і статус.
- Кольори не є єдиним носієм значення.
- Для станів використовуються текст, контур, форма або іконка.
- Зміна кількості результатів оголошується screen reader.
- Всі drawer/panel мають доступний focus behavior.
- Потрібен mobile fallback для графа і feature map.
- Потрібні keyboard-only і print/PDF сценарії.

## Design direction

- NETWORK — темна робоча поверхня.
- PLATFORM CONFIGURATOR — той самий екран, але з чітко відмінним mode state.
- PROPOSAL/PDF — світла документна поверхня.
- Використовувати підняті панелі, контрольовані тіні, поверхневе освітлення,
  топографічний фон і більший крок сітки.
- Не використовувати декоративну “корпоративну рожеву вінілову” естетику.
- Не копіювати буквально McKinsey, LinkedIn або інший бренд.
- Орієнтир: consulting-grade information design,
  production-grade interaction patterns,
  accessible graph exploration,
  explicit commercial boundaries.

## Quality gates

Робота не вважається завершеною, доки:

1. Користувач розуміє поточний режим без пояснення агента.
2. Користувач може знайти експерта без hover.
3. Користувач розуміє різницю між verified, in review та not assessed.
4. Користувач бачить, що відбувається при вимкненні функції.
5. Вимкнення feature/module коректно змінює пов'язані функції.
6. Граф експертів і граф залежностей використовують спільний state model.
7. Користувач може перейти до текстового списку зв'язків.
8. Немає готовим виглядом позначених невиконаних функцій.
9. Бюджет враховує fixed foundation і non-linear team load.
10. Усі числа мають джерело, одиницю, період і формулу.
11. PDF чітко відділяє validated scope від commercial proposal і contract.
12. Ключовий сценарій проходить на mobile.
13. Keyboard-only flow працює.
14. Production claims не базуються на localStorage або demo inbox.
15. Lint, typecheck, build і runtime console перевірені.

## Loop

На кожній ітерації:

1. Прочитай актуальний стан коду та попередні рішення.
2. Визнач одну найважливішу невідповідність.
3. Перевір, чи потрібне уточнення моделі даних або state contract.
4. Зміни лише пов'язані файли.
5. Запусти targeted validation.
6. Перевір desktop, mobile і keyboard behavior.
7. Перевір accessibility та комерційні формулювання.
8. Звір зміни з усіма quality gates.
9. Зафіксуй залишковий ризик.
10. Не переходь до наступної фази без approval gate.
11. Перед фінальною відповіддю проведи повний benchmark review і виправ усі знайдені порушення.

План реалізації з контрольними точками
Фаза 0. Підтвердження моделі
	•	Підтвердити назви:
	•	NETWORK / PROTOTYPE;
	•	PLATFORM CONFIGURATOR;
	•	DEPENDENCIES;
	•	PROPOSAL або VALIDATED SCOPE.
	•	Підтвердити, що це один екран із шарами, а не три незалежні сторінки.
	•	Підтвердити 4 верхні панелі:
	•	FILTERS;
	•	SECTORS;
	•	TERRITORIES;
	•	EXPERT NETWORK.
	•	Підтвердити нижній ряд для конфігуратора.
	•	Підтвердити розділення structural foundation та optional modules.
	•	Підтвердити, що influence/trust/projects є майбутніми функціями.
	•	Підтвердити значення 30%+ mobilisation як попереднього комерційного припущення.
Gate 0
Переходимо далі лише після погодження ментальної моделі та термінології.
Фаза 1. Контракт даних і state model
Файли/області:
	•	src/lib/proposal-config.ts;
	•	типи експертів;
	•	типи графа;
	•	новий feature/module model;
	•	selectors/reducers, якщо їх ще немає.
	•	Визначити типи експертів і статусів.
	•	Визначити типи графових шарів:
	•	experts;
	•	clusters;
	•	features;
	•	dependencies;
	•	relationships.
	•	Визначити activeMode.
	•	Визначити visibleLayers.
	•	Визначити activePanel.
	•	Визначити selectedExperts.
	•	Визначити selectedFeatures.
	•	Визначити selectedModules.
	•	Визначити featureDependencies.
	•	Визначити featureExpertReach.
	•	Визначити структуру pricingClass і resource load.
	•	Визначити live/demo/under-development states.
Gate 1
Перевірити типи та приклади станів:
	•	тільки experts;
	•	experts + clusters;
	•	features;
	•	dependencies;
	•	dependencies + selected group;
	•	виключений базовий модуль;
	•	включена feature з відсутньою залежністю.
Без цього UI не починати.
Фаза 2. Експертний шар і 4 верхні панелі
Файли:
	•	src/routes/index.tsx;
	•	src/components/NetworkGraph.tsx;
	•	src/styles.css;
	•	filter/list/dossier components.
	•	Перенести неперевірених із окремого графа в cluster layer.
	•	Реалізувати FILTERS.
	•	Реалізувати SECTORS.
	•	Реалізувати TERRITORIES.
	•	Реалізувати EXPERT NETWORK.
	•	Додати повний список значень із кількостями.
	•	Додати reset у кожну панель.
	•	Додати selected group.
	•	Додати текстові статуси.
	•	Додати Connections List.
	•	Додати Save group — UNDER DEVELOPMENT.
	•	Додати перемикач видимості шарів.
	•	Перевірити поведінку панелі preview / pinned / closed.
Gate 2
Наскрізний expert flow:
Plain text
filters → sector → territory → listing → selected group
→ graph highlighting → dossier → connections list
→ under-development action

На цьому етапі feature graph ще не підключати.
Фаза 3. Feature/module model і конфігуратор
Файли:
	•	src/routes/coordinator.tsx;
	•	src/routes/proposal.tsx;
	•	src/lib/proposal-config.ts;
	•	новий feature catalog/model;
	•	styles.
	•	Перейменувати FUTURE FEATURES.
	•	Розділити functions, features/modules і foundation.
	•	Додати tutorial card.
	•	Додати feature cards із mini dossier.
	•	Додати dependency graph layer.
	•	Додати картку:
	•	description;
	•	function;
	•	users;
	•	KPI;
	•	result;
	•	dependencies;
	•	impact;
	•	status;
	•	expert reach.
	•	Перенести influence/trust/projects до catalog.
	•	Позначити їх under development.
	•	Додати feature layer toggle.
	•	Додати prototype-only форму створення нової feature card, якщо вона потрібна для демонстрації extensibility.
Gate 3
Користувач може:
Plain text
відкрити feature → прочитати mini dossier
→ побачити залежності → додати/виключити
→ побачити наслідки → повернутися до expert layer

Фаза 4. Режим DEPENDENCIES
	•	З’єднати experts, sectors, features, modules і integrations.
	•	Показати залежності без надмірного шуму.
	•	Додати project feature projection.
	•	Додати estimated expert reach.
	•	Зробити чітке маркування:
	•	based on demonstration dataset;
	•	not a demand forecast;
	•	not a commitment.
	•	Додати layer visibility controls.
	•	Перевірити, що клік по feature не втрачає selected experts.
	•	Перевірити, що клік по експерту не скидає feature configuration.
Gate 4
Перевірити повний сценарій:
Plain text
selected expert group
→ feature
→ dependency projection
→ affected experts/sectors
→ feature dossier
→ return without state loss

Фаза 5. Нелінійний калькулятор
	•	Розділити fixed foundation cost і variable feature cost.
	•	Додати мінімальне командне навантаження.
	•	Додати technology effort per function.
	•	Додати інтеграційні та зовнішні витрати окремо.
	•	Не робити ціну пропорційною кількості checkbox.
	•	Показувати, які базові ресурси залишаються навіть після виключення функції.
	•	Додати діапазон бюджетів.
	•	Додати окремий рядок mobilisation payment 30%+, позначений як indicative.
	•	Додати припущення щодо обсягу команди.
	•	Додати пояснення, що точний розрахунок виконується після прийняття scope та Discovery.
Gate 5
Перевірити щонайменше:
	•	повна конфігурація;
	•	виключення однієї optional function;
	•	виключення цілого optional module;
	•	спроба вилучити structural foundation;
	•	AI/OSINT tier;
	•	різні commercial relationship models.
Результат не повинен змінюватися лінійно там, де зберігається minimum team capacity.
Фаза 6. Варіанти відносин і validated scope
	•	Розділити:
	•	product for this community;
	•	founding/shared development;
	•	platform service/sustainable development.
	•	Для кожної моделі показати вплив на:
	•	IP;
	•	reuse;
	•	support;
	•	governance;
	•	SaaS;
	•	team composition;
	•	payment schedule;
	•	price range.
	•	Створити підсумок Validated Scope & Budget Range.
	•	Позначити його як документ для підтвердження, а не договір.
	•	Додати поля:
	•	version;
	•	date;
	•	selected scope;
	•	excluded scope;
	•	dependencies;
	•	technology approach;
	•	stages;
	•	assumptions;
	•	price range;
	•	mobilisation assumption;
	•	open questions;
	•	approval status.
	•	Підготувати PDF text layer і, за потреби, діаграми.
	•	Не включати в цей документ повний юридичний договір.
Gate 6
Перед створенням PDF перевірити:
	•	чи немає функції, яка виглядає погодженою, але насправді лише запропонована;
	•	чи всі залежності пояснені;
	•	чи немає непідтверджених ринкових чисел;
	•	чи зрозуміло, що остаточний SOW буде після підтвердження.
Фаза 7. Візуальна система
	•	Переглянути попередні скріншоти та витягнути з них фактичні токени.
	•	Зафіксувати, чи основна interaction surface темна.
	•	Зафіксувати світлу PDF/document surface.
	•	Визначити:
	•	палітру;
	•	контраст;
	•	рівні поверхонь;
	•	тіні;
	•	топографічний фон;
	•	крок сітки;
	•	рамки;
	•	active mode treatment;
	•	selected group treatment;
	•	feature states.
	•	Окремо перевірити deuteranopia.
	•	Створити невеликий visual benchmark:
	•	граф;
	•	drawer;
	•	feature node;
	•	mini dossier;
	•	selected group;
	•	PDF page.
	•	Не переписувати всю стилістику до затвердження цього visual benchmark.
Gate 7
Погодити один напрям:
	•	dark interaction + light document;
	•	або інший явно обраний напрям.
Не залишати змішану палітру без правил.
Фаза 8. Mobile, accessibility, performance
	•	Mobile fallback для 4 верхніх панелей.
	•	Mobile fallback для нижніх панелей.
	•	Keyboard behavior.
	•	Screen reader announcements.
	•	Connections List.
	•	Focus management у drawer.
	•	Reduced motion.
	•	Print/PDF.
	•	Граф не повинен блокувати використання списку.
	•	За потреби lazy-load графа, feature map і full dossier.
	•	Перевірити client bundle.
Gate 8
Увесь наскрізний сценарій проходить:
	•	desktop mouse;
	•	keyboard-only;
	•	mobile touch;
	•	print/PDF.
Фаза 9. Факт-чек, benchmark і фінальна перевірка
	•	Перевірити твердження про expert ranking.
	•	Перевірити джерела для Trust/Influence/Projects.
	•	Перевірити актуальність market rates і exchange rate.
	•	Перевірити арифметику ціни.
	•	Перевірити одиниці та формули.
	•	Перевірити відповідність UI узгодженій моделі.
	•	Провести Web Interface Guidelines review.
	•	Провести accessibility review.
	•	Провести browser review desktop/mobile.
	•	Виправити всі знайдені проблеми до видачі.
	•	Повторно виконати весь quality-gate checklist.
	•	Зберегти залишкові ризики та відкладені рішення.
Фінальна перевірка:
Bash
npm run lint
npm run build

Додатково — ручний browser flow, print/PDF і keyboard-only review.
Які skills потрібні
Потрібні:
	1	refactor-plan — для поетапної реалізації, залежностей і approval gates.
	2	design-system — для фіксації палітри, поверхонь, тіней, сітки, типографіки та negative rules.
	3	web-design-guidelines — для фінального UI review після реалізації.
	4	playwright-cli — для desktop/mobile, keyboard, drawer, state synchronization і PDF/browser перевірки.
Корисні, але не обов’язкові:
	•	skill для accessibility review, якщо він доступний у цьому середовищі;
	•	security/secret scanning перед production-oriented persistence;
	•	dependency scanning після структурних змін;
	•	PDF skill — коли почнемо формувати Validated Scope & Budget Range.

і на додаток тільки будь ласка контролюй токен, щоб вписатись в ліміти цього раунду, краще чогось позбутися ніж передавати полузавершений продукт - це просто харакірі для часу та нервів

Feature/module model і конфігуратор якшо першій блок це функції то обирання буд якої з них викликає фрейм фічі - міні-досє - другий блок що розгортається з низу, погодження всієї фічі, може одночасно зараховувати всі фцнкції в цієї фічі, а сам паспорт фічі ставати на місце своє в переліку, наступна розгортається так жеж за тригером від функції поверх тих що вже стоять та потім також штабелюється. Підтвердження висвічує залежність на функціях. Відмова від фічі теж саме робить, але мабудь іншим кольором підсвічує функції а у фреймі у тих жеж самих полях перелічує втрати.
Після підтвердження кожної фічі в третьму блоці розгортається опис технічниого стеку - красиво пишеться зі швидкістю ШІ, в той момент, відмічаються фінкції повязані, фіча займає місце в лістінгу, хай він клікає на підтвердження на стеку він складається в одному рівні із фічею. Поки пишеться технологічний блок розгортається четвертий блок - де як лічильник біжить ціна та ступенєво зростає в залежності від прийняття функцій, на фічах набирає більше і швидче, затвердження тех стеку зупиняє лічильник, і наступний цикл. Хоча можно і не заморачуватись, якщо це навантажує або складно. Під ціною проставляються ціна за MVP - базовий мінімальний набір, та істотні умови виконання. Внизу кнопка сформувати ппропозицію яка з початку відкривається поверх всього що є на екрані, з розахованими частками платежів по єтапам, від 30% і далі, не знаю як вірно буде по модулям/фічам чи у часі єтапами яких оптимально не більше 3. В документі і після відпраки на друк / або відправки на електронну пошту нам писати окремо подяку та повідомлення що це робоче завдання яке буде слугувати для підготовки пропозиції та формалізації відносин

