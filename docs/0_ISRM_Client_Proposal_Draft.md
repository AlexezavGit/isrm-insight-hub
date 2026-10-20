# ISRM Expert Network
## Чернетка пропозиції: цифрова інфраструктура залучення та координації експертів

**Статус:** робоча клієнтська чернетка для погодження змісту. Не є фінальною офертою чи затвердженим кошторисом.

### 1. Навіщо ця робота

Експертні аудиторії ISRM розподілені між професійними групами, навчанням, подіями та партнерськими каналами. Сам факт наявності групи чи каталогу не створює системного способу знаходити потрібну компетенцію, запрошувати людей до змістовної участі й бачити, які канали працюють. Пропозиція спрямована на створення керованої мережевої інфраструктури, що пов’язує пошук експертів із добровільним залученням, довірою до джерел інформації та реальними можливостями участі.

### 2. Запропонований базовий продукт

Єдиний конфігуратор для погодження обсягу ISRM: він пов’язує пошук експертів, відбір групи, набір функцій застосунку та бюджет у межах одного маршруту. Запропонований MVP застосунку охоплює завантаження погоджених даних, перевірку та звірку з експертом, пошук, формування групи для конкретної мети й підготовку першого контакту. Це не автоматизована система перевірки партнерів або клієнтів: перевірку експертних тверджень і рішення про відбір здійснюють уповноважені люди.

Базовий програмний обсяг пропонується сформувати навколо таких функцій:

- **Завантаження й організація даних:** імпорт погоджених профілів та матеріалів із джерел, визначених замовником; перевірка структури, дублювань і повноти даних до завантаження в робочий набір.
- **Людська перевірка профілю:** звірка джерел і тверджень із самим експертом або уповноваженим рецензентом, фіксація дати, результату та потрібного виправлення; застосунок не ухвалює висновок про довіру автоматично.
- **Пошук і групування:** фільтри за погодженими напрямами експертизи, територіями/юрисдикціями та іншими визначеними критеріями; формування й збереження групи експертів для конкретної задачі.
- **Перший контакт:** підготовка контакту через канал, обраний і дозволений замовником; самостійна автоматична розсилка не є частиною MVP без окремо погоджених вимог.
- **Пілот і вимірювання:** підтримка погодженого циклу опитування та залучення спільноти; стратегія, підготовка матеріалів, проведення кампанії, аналіз відповідей і рекомендації є окремим партнерсько-консалтинговим workstream.

#### Що саме пропонується перевірити в пілоті

Перший пілот — це обмежений робочий цикл для одного замовника, а не лише демонстрація інтерфейсу й не запуск відкритої платформи. Замовник обирає один реальний запит або проєкт, погоджує критерії потрібної експертизи й дозволені джерела, а команда проходить цикл: пошук кандидатів у дозволеному наборі → людська перевірка профілів і джерел → формування та збереження групи для цього запиту → погодження й надсилання запрошення дозволеним каналом → фіксація відповідей і рішення про участь → проведення погодженої активності → підготовка результату для замовника → рішення, чи продовжувати цикл і які знання можна зберегти.

Результат пілота для замовника — перевірений на його конкретному робочому процесі сценарій із зафіксованими рішеннями, обмеженнями, результатами активності, проблемами та оцінкою залишкових вимог до застосунку. Умови приймання, тип запиту, фактичний обсяг записів, період, учасники, канал та очікуваний результат погоджуються до старту; цей документ не підставляє непідтверджений розмір когорти, строки, конверсію чи ефект. Пілот не обіцяє, що експерти погодяться, що запит матиме позитивний результат або що інвестиція окупиться.

Пілотне використання для одного замовника не визначає, кому належить продукт, чи можна повторно використовувати код і чи буде система доступна іншим організаціям. Це окремий комерційний вибір, описаний у розділі 7.

AI-функції не входять до базового MVP або поточної оцінки. Їх можна розглядати лише як окрему майбутню опцію після рішення замовника, визначення даних і контролів, тестування якості та окремого ціноутворення.

### 3. Принципи та межі

Публічний сайт ISRM може бути входом до добровільної реєстрації; експертний каталог і контактні дані не пропонуються як відкриті. До підтвердження правових підстав і згоди чинні CRM-дані не використовуються для кампанійного контакту чи публікації.

Застосунок не скрейпить LinkedIn і не запускає автоматичну перевірку партнерів, клієнтів чи експертів за допомогою AI. Джерела та профільні твердження звіряє експерт або уповноважена людина; у системі фіксуються джерело, дата й результат, а контакт і відбір потребують людського рішення. Trust & Influence модель та індекс спільно розробляються із замовником, але не подаються як валідований галузевий стандарт без окремої методики та доказів зовнішньої валідації. Будь-які майбутні AI-функції — лише окрема опція з рішенням, контролями, тестами й ціною.

**Що означає Trust & Influence:** це задум окремого індексу/профілю експертів, а не оцінки надійності клієнта чи партнера і не готовий рейтинг людей. Trust має описувати підтверджені характеристики профілю та компетенцій за визначеними перевірками й джерелами із датою, типом доказу, людським переглядом і можливістю виправлення або оскарження. Influence має описувати спостережувану професійну активність і підтверджене охоплення за визначений період, а не ототожнювати публічну видимість із цінністю експерта. Універсальна формула, ваги, порівнянність між галузями та правила нормалізації поки не визначені; до їх спільного проєктування індекс не обчислюється, не ранжує експертів і не керує доступом чи відбором.

Теоретична довгострокова можливість — розвинути методику до міжорганізаційного або галузевого індексу. Це не властивість клієнтського пілота й не обіцянка репрезентативного рейтингу. Для такого розвитку знадобляться окремі визначення предмета вимірювання, прав на дані, спільних доказових стандартів, governance, покриття учасників, незалежної перевірки методики та процедури апеляції.

Операційний цикл мережі має пов’язати виявлення компетенцій із тематичними групами, спільним навчанням і подіями, практичними запитами та внесками до бази знань. Накопичені теми й прогалини можуть формувати наступні запрошення та навчальні програми, а нова участь — розширювати експертну базу. Це гіпотеза продукту, не гарантія зростання чи фінансового результату; пілот окремо вимірює набір, участь, повторну участь і внески до знань.

### 4. Окремі модулі, не потрібні для стартового ядра

Розширений War Room і ситуаційний моніторинг; складне керування проєктами; окремий research/OSINT продукт; публічні консультації та слухання; комерційний lead pipeline; партнерський маркетплейс і billing; польова/евакуаційна логістика; поглиблена автоматизація кампаній. Кожен модуль оцінюється окремо після уточнення користувачів, джерел, операційної відповідальності, сторонніх ліцензій і критеріїв приймання.

### 5. Запропонована послідовність постачання

1. **Спільне проєктування Trust & Influence:** підготувати й провести стратегічну сесію із замовником для спільного визначення амбіції індексу, моделі та протоколу. Заявлені 2–3 робочі дні підготовки дорівнюють 16–24 людино-годинам лише за припущенням 8 годин на день і одного виконавця; сесія, синтез, розробка моделі/протоколу, зовнішня валідація та оформлення рішень оцінюються окремо й поки мають статус TBD.
2. **Окремий партнерсько-консалтинговий workstream стратегії та залучення:** визначити пріоритетні напрями й прогалини експертизи, погодити спосіб людської перевірки наявних експертів, підготувати опитувальник та матеріали, провести погоджену кампанію, проаналізувати відповіді й подати висновки клієнту та борду. Окремо погодити відбір керівників практик і регіональних представників та коротке навчання; рішення про мобілізацію експертів, базу знань, індекси й інвестицію в застосунок залишається за клієнтом і бордом.
3. **MVP застосунку:** оцінити й реалізувати погоджений залишковий обсяг завантаження даних, людської звірки профілю з експертом, пошуку, відбору/збереження групи для конкретної мети та першого контакту. Групове збереження, призначення до проєкту, production-доступ і інтеграції не вважати завершеними без окремої перевірки build і критеріїв приймання.
4. **Пілот і рішення про наступний етап:** провести лише затверджений сценарій із дозволеними даними та каналами; оцінити визначені показники за чисельниками, знаменниками, періодом, джерелом і формулою; після цього клієнт і борд вирішують, чи розширювати функції, залучення, базу знань або участь експертів в індексах.

### 6. Додатковий блок: економіка приросту спільноти

Це окремий вимірювальний потік, а не прогноз доходу ISRM. Він оцінює потенційне охоплення та кількість учасників на послідовних етапах кампаній лише за підтвердженими знаменниками й власними результатами пілоту. Зовнішні галузеві коефіцієнти не використовуються як конверсія ISRM. Членський дохід не моделюється; ISRM може накласти виміряні обсяги на власні чинні тарифи.

Перший тест доцільно провести через наявні публічні канали й сайт із добровільною реєстрацією. Окрему публічну платформу розглядати, якщо результати покажуть, що чинний сайт не підтримує потрібні opt-in, атрибуцію каналу та шлях до участі.

### 7. Комерційна рамка та відкриті параметри

Обсяг і кошторис проєкту треба розділяти за змістом: окрема стратегія/консалтинг; MVP застосунку; функції, потрібні для пілота залучення експертів; повна функціональність поза межами пілота. Для одного й того самого погодженого scope порівнюються три методи: (1) прямі витрати розробницького постачальника; (2) окрема оплата партнерської роботи плюс підтверджені проєктні витрати; (3) зіставна all-in пропозиція boutique-команди. Різниця між методами може показати сукупний ефект overhead, комерційного супроводу та маржі, але не розкриває їх окремо; робота партнера, уже включена в all-in quote, не додається повторно.

### Варіанти відносин із розробкою та майбутнім продуктом

Пілот для одного замовника можна продовжити за різними моделями. Вибір впливає на права й повторне використання коду, рівень кастомізації, відповідальність за експлуатацію та підтримку, governance, інтеграції й структуру майбутніх платежів. Це предмет обговорення та юридичного/комерційного узгодження, а не вже доступні договори:

| Модель | Що вона означає для замовника | Наслідок для розробки й ціни |
|---|---|---|
| **Продукт для однієї спільноти / замовна розробка** | Робочий продукт максимально пристосовується до процесів одного замовника. Передача вихідного коду або виключні права можливі лише за окремою домовленістю. | Може вимагати більшої кастомізації та чіткої передачі прав; повторне використання компонентів, підтримка й експлуатація визначаються окремо. |
| **Партнер-засновник / спільний розвиток** | Замовник бере участь у перевірці першого циклу й пріоритетах розвитку; частина компонентів може створюватися для повторного використання в інших мережах. | Внесок, governance, IP, право повторного використання й участь у roadmap треба погодити окремо. Початкове зниження ціни чи співвласність не гарантовані. |
| **Платформний сервіс / сталий розвиток** | Замовник використовує розвивану платформу за погодженими умовами доступу, а не обов’язково отримує виключний продукт. | Потрібно окремо оцінити налаштування, ліцензію/SaaS, optional modules, інтеграції, хостинг, безпеку, підтримку та операційний retainer. |

До вибору моделі не слід показувати одну ціну як придатну для всіх трьох варіантів. Спершу узгоджується пілотний scope; окремо — права, повторне використання, підтримка й шлях від клієнтського пілота до можливого публічного продукту.

**Числової ціни й календарного строку в цій чернетці немає.** Повний бюджет проєкту обчислюється лише з погоджених і атрибутованих годин, ставок, пропозицій постачальників, підтверджених зовнішніх витрат, визначеного періоду експлуатації та податкового режиму. Відхилення бюджету, % = (сценарна сума всього проєкту − погоджена базова сума всього проєкту) ÷ погоджена базова сума всього проєкту × 100%. Поки базова сума або компоненти сценарію не підтверджені, результат залишається TBD; довільний відсоток не підставляється. AI-функції та їхні recurring/API-витрати не входять до MVP або поточної оцінки й можуть бути додані лише окремим рішенням. Строк визначається після оцінки scope, доступності команди, рішень ISRM і циклу приймання.

Попередня платіжна рамка — аванс не менше 30% і не більше трьох платежів загалом, якщо підтвердиться в остаточних умовах; наступні платежі прив’язуються до прийнятих результатів. Частки після авансу ще не погоджені.

### 8. Потрібні рішення й дані від ISRM

- Власник продукту та уповноважені адміністратори, які приймають результати кожного етапу.
- Дозволені джерела профілів, межі використання даних і правила добровільної видимості/контакту.
- Критерії релевантного експерта й доказів компетенції, відповідальний за перевірку та шлях виправлення/оскарження.
- Пріоритетні групи, теми кампаній, доступні канали та агреговані метрики, які адміністратори можуть надати.
- Вимоги до розміщення, зберігання/видалення, доступності сервісу, підтримки та передачі інтелектуальної власності.

**Наступний погоджуваний зріз:** базовий обсяг і критерії приймання. Після нього — фінальна перевірка моделі оцінки й лише тоді бюджетна частина; блок економіки зростання лишається окремим додатком до цього рішення.

## English version — draft for bilingual review

**Status:** Working client draft for comments on scope. It is not a final offer or approved estimate.

### 1. Why this work

ISRM expert audiences are distributed across professional groups, training, events and partner channels. The existence of a group or directory alone does not provide a systematic way to find a needed capability, invite people into meaningful participation, or understand which channels work. This proposal is intended to create a managed network capability that connects expert search with voluntary engagement, evidence about expertise and practical opportunities to contribute.

### 2. Proposed core product

A single configurator for agreeing ISRM scope: it connects expert search, group selection, application functions and the project budget in one review path. The proposed application MVP covers upload of approved data, human review and reconciliation with the expert, search, purpose-based group formation, and preparation of first contact. It is not an automated partner- or client-verification system: authorized people review expertise claims and make selection decisions.

The proposed software MVP comprises:

- **Data upload and organization:** import approved profiles and materials from client-designated sources; validate structure, duplicates and completeness before adding records to the working set.
- **Human profile review:** check sources and claims with the expert or an authorized reviewer, and record the date, outcome and any correction needed; the application does not automate a trust judgment.
- **Search and grouping:** filter by agreed expertise areas, recorded territories/jurisdictions and other selected criteria; form and save a group of experts for a defined purpose.
- **First contact:** prepare contact through a channel selected and authorized by the client; automated bulk outreach is outside the MVP unless separately agreed.
- **Pilot and measurement:** support the agreed community questionnaire and engagement cycle. Strategy, material preparation, campaign execution, response analysis and recommendations are a separate partner-consulting workstream.

#### What the client pilot is intended to test

The first pilot is a bounded working cycle for one client, not merely an interface demonstration and not a launch of a public platform. The client selects one real request or project, agrees the expertise criteria and permitted sources, and the team runs the cycle: search the permitted dataset → human review of profiles and evidence → form and persist a group for that request → approve and send an invitation through an authorized channel → record responses and participation decisions → conduct the agreed activity → prepare an output for the client → decide whether to continue the cycle and what knowledge may be retained.

The client's pilot output is a workflow tested against its specific use case, with recorded decisions, limitations, activity outputs, issues and remaining application requirements. Acceptance criteria, request type, actual record volume, period, participants, channel and expected output must be agreed before launch. This draft does not invent a cohort size, duration, conversion rate or impact. The pilot does not guarantee that experts will participate, that the request will produce a positive result, or that investment will pay back.

Using a pilot for one client does not decide who owns the product, whether code may be reused, or whether the system will be available to other organizations. That is a separate commercial choice, described in section 7.

AI functions are outside the base MVP and current estimate. They may be considered only as a separately approved future option after the client decides on the use case, data and controls, quality testing, and separate pricing.

### 3. Principles and boundaries

The public ISRM website may serve as an entry point for voluntary registration; the expert directory and contact details are not proposed as public. Until legal authority and consent are confirmed, existing CRM records are not to be used for campaign contact or publication.

The application will not scrape LinkedIn or run AI-based automated verification of partners, clients or experts. An expert or authorized reviewer checks sources and profile claims; the system records the source, date and outcome, while contact and selection remain human decisions. The Trust & Influence model and index are co-designed with the client, but are not presented as a validated sector standard without a separate validation method and external evidence. Any future AI functions are a separately decided, controlled, tested and priced option.

**What Trust & Influence means:** it is a proposed expert index/profile, not an assessment of client or partner trustworthiness and not a ready-made ranking of people. Trust is intended to describe verified profile and competence attributes using defined checks and sources, with dates, evidence types, human review, and a correction or appeal route. Influence is intended to describe observable professional activity and evidenced reach over a defined period, without treating public visibility as equivalent to an expert's value. A universal formula, weights, cross-sector comparability and normalization rules have not been defined; until they are co-designed, the index is not calculated, does not rank experts, and does not control access or selection.

The theoretical long-term opportunity is to develop the method into an inter-organizational or sector-wide index. This is not a feature of the client pilot and is not a promise of a representative ranking. It would require separate definitions of what is measured, data rights, shared evidence standards, governance, participant coverage, independent method review and an appeal process.

The network operating cycle should connect identified capabilities to topic groups, shared learning and events, practical requests and knowledge-base contributions. Identified themes and gaps may inform future invitations and learning programs, while new participation may broaden the expert network. This is a product hypothesis, not a growth or financial guarantee; a pilot should separately measure recruitment, participation, repeat participation and knowledge contributions.

### 4. Separate modules not required for the initial core

Expanded War Room and situation monitoring; complex project management; a standalone research/OSINT product; public consultations and hearings; commercial lead pipeline; partner marketplace and billing; field or evacuation logistics; and advanced campaign automation. Each module should be assessed separately after its users, sources, operating responsibility, third-party licences and acceptance criteria are defined.

### 5. Proposed delivery sequence

1. **Co-design Trust & Influence:** prepare and hold a strategic session with the client to define the index ambition, model and protocol together. The stated 2–3 preparation working days equal 16–24 person-hours only under the assumptions of 8 hours per day and one preparer; the session, synthesis, model/protocol drafting, external validation and decision record are separate effort items and remain TBD.
2. **Separate partner-consulting strategy and engagement workstream:** identify priority directions and expertise gaps, agree a human review method for existing network experts, prepare the member questionnaire and campaign materials, run the approved campaign, analyze responses and present findings to the client and board. Separately scope selection and short training for practice leaders and regional representatives. The client and board decide whether to mobilize experts, create a knowledge base, involve experts in indices or invest in the application.
3. **Application MVP:** estimate and deliver the approved residual scope for data upload, human reconciliation of profiles with experts, search, purpose-based group selection/saving and first contact. Do not treat group persistence, project assignment, production access or integrations as complete without a verified build review and acceptance criteria.
4. **Pilot and next-stage decision:** run only the approved scenario with permitted data and channels; evaluate agreed measures with numerators, denominators, period, source and formula; then the client and board decide whether to extend functions, engagement, the knowledge base or expert participation in indices.

### 6. Separate community-growth measurement

This is a measurement workstream, not an ISRM revenue forecast. It evaluates potential reach and participant counts at successive campaign stages only from verified denominators and the organization's own observed pilot results. External industry rates are not used as ISRM conversion rates. Membership revenue is not modeled; ISRM may apply measured volumes to its own current fees.

The first test should use existing public channels and the website with voluntary registration. Consider a separate public platform only if results show that the current site cannot support the required opt-in, channel attribution and path to participation.

### 7. Commercial framework and open parameters

Scope and project cost should be separated by purpose: strategy/consulting; application MVP; functions required for the expert-engagement pilot; and full functionality outside the pilot. For the same agreed scope, compare three methods: (1) direct software-provider cost; (2) separately priced partner work plus confirmed project expenses; and (3) a comparable boutique-team all-in proposal. The difference between methods may indicate the combined effect of overhead, commercial support and margin, but does not isolate them; partner work already included in an all-in quote must not be counted twice.

### Development and future-product relationship options

The pilot for one client can continue under different relationship models. The choice affects code rights and reuse, customization, operating and support responsibility, governance, integrations and the structure of future payments. These are options for discussion and legal/commercial agreement, not ready-made contracts:

| Model | What it means for the client | Development and pricing implications |
|---|---|---|
| **Product for one community / commissioned development** | The working product is tailored as closely as possible to one client's processes. Source-code transfer or exclusive rights are possible only by separate agreement. | May require more customization and explicit rights transfer; component reuse, support and operations must be scoped separately. |
| **Founding partner / shared development** | The client participates in validating the first cycle and prioritizing development; some components may be built for reuse across other networks. | Contribution, governance, IP, reuse rights and roadmap participation require separate agreement. A lower initial price or joint ownership is not guaranteed. |
| **Platform service / sustainable development** | The client uses an evolving platform under agreed access terms and does not necessarily receive an exclusive product. | Separately estimate setup, licence/SaaS, optional modules, integrations, hosting, security, support and any operating retainer. |

Until a model is selected, one price should not be presented as suitable for all three. Agree the pilot scope first; separately agree rights, reuse, support and the path from a client pilot to a possible public product.

**No numeric price or calendar duration is stated in this draft.** The whole-project budget can be calculated only from agreed, attributed hours and rates, supplier proposals, confirmed external costs, a defined operating period and tax treatment. Budget variance (%) = (scenario whole-project total − agreed reference whole-project total) ÷ agreed reference whole-project total × 100%. Until the reference total or scenario components are confirmed, the result remains TBD; no arbitrary percentage is inserted. AI functions and recurring/API costs are outside the MVP and current estimate and may be added only by separate decision. The schedule follows scope estimates, team availability, ISRM decisions and acceptance cycles.

The preliminary payment constraint is an advance of at least 30% and no more than three payments total, if confirmed in final terms; later instalments are linked to accepted deliverables. Shares after the advance remain unapproved.

### 8. Decisions and information required from ISRM

- Product owner and authorized administrators who accept each stage's outputs.
- Permitted profile sources, data-use boundaries and voluntary visibility/contact rules.
- Criteria for a relevant expert and evidence of expertise, the reviewer, and a correction/appeal path.
- Priority groups, campaign topics, available channels and aggregate metrics administrators can provide.
- Hosting, retention/deletion, availability, support and intellectual-property transfer requirements.

### Client comments and how this draft will be used

Please add corrections or decisions to [`ISRM_Client_Configuration_Request_Draft.md`](./ISRM_Client_Configuration_Request_Draft.md), including the end-to-end workflow, whether to commission the separate strategy and expert-engagement workstream, data and channel permissions, application need and must-have functions, pilot measures, budget boundary, currency and tax treatment. The member questionnaire is a separate unapproved draft: [`ISRM_Community_Member_Survey_Draft.md`](./ISRM_Community_Member_Survey_Draft.md).

After the configurator is completed and partners approve the residual scope and estimates, the agreed client choices, exclusions, assumptions, acceptance criteria and indicative budget range will be incorporated into the proposal artifact. This draft does not authorize delivery or disclose internal partner rates or the internal demo-module allocation.

## Коментарі клієнта та спосіб використання цієї чернетки

Будь ласка, вносьте виправлення й рішення до [`ISRM_Client_Configuration_Request_Draft.md`](./ISRM_Client_Configuration_Request_Draft.md): наскрізний workflow; потреба в окремому напрямі стратегії та залучення експертів; дозволи щодо даних і каналів; потреба в застосунку й обов’язкові функції; вимірювання пілота; бюджетна межа, валюта та податки. Опитувальник членів є окремою непогодженою чернеткою: [`ISRM_Community_Member_Survey_Draft.md`](./ISRM_Community_Member_Survey_Draft.md).

Після завершення конфігуратора та погодження партнерами залишкового обсягу й оцінок погоджені рішення клієнта, виключення, припущення, критерії приймання та індикативний бюджетний діапазон буде перенесено до артефакту пропозиції. Ця чернетка не дозволяє розпочинати delivery і не розкриває внутрішні ставки партнерів чи внутрішній розподіл за demo-модуль.