import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, GitBranch, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROPOSAL_FUNCTIONS } from "@/lib/proposal-data";
import { useI18n } from "@/lib/i18n";
import { EntryFrame } from "@/components/EntryFrame";

export const Route = createFileRoute("/proposal")({
  beforeLoad: () => {
    // Mark that the user has visited the proposal page — unlocks direct access to the graph
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('isrm-visited', '1');
    }
  },
  head: () => ({
    meta: [
      { title: "ISRM — Client proposal" },
      {
        name: "description",
        content:
          "A concise client proposal for the ISRM expert-network MVP and optional expert-community cycle.",
      },
      { property: "og:title", content: "ISRM — Client proposal" },
      {
        property: "og:description",
        content: "Explore the expert workflow, pilot outcomes and indicative package ranges.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClientProposal,
});

function ClientProposal() {
  const { locale, setLocale } = useI18n();
  const uk = locale === "uk";
  const text = (en: string, ua: string) => (uk ? ua : en);
  const dependencyEdges = PROPOSAL_FUNCTIONS.flatMap((feature) =>
    feature.dependencies.flatMap((dependencyId) => {
      const prerequisite = PROPOSAL_FUNCTIONS.find((item) => item.id === dependencyId);
      return prerequisite ? [{ prerequisite, feature }] : [];
    }),
  ).slice(0, 3);


  return (
    <main className="partner-review client-proposal client-offer">
      <div className="partner-shell">
        <header className="partner-header">
          <div>
            <p className="partner-eyebrow">
              {text("ISRM · Client proposal", "ISRM · Пропозиція замовнику")}
            </p>
            <h1>
              {text(
                "From a sorted sheet to a working expert workflow",
                "Від упорядкованої таблиці — до робочого процесу з експертами",
              )}
            </h1>

          </div>
          <div className="partner-header-status">
            <div
              className="partner-locale-switch"
              role="group"
              aria-label={text("Page language", "Мова сторінки")}
            >
              <button
                type="button"
                aria-pressed={!uk}
                className={!uk ? "is-active" : ""}
                onClick={() => setLocale("en")}
              >
                EN
              </button>
              <button
                type="button"
                aria-pressed={uk}
                className={uk ? "is-active" : ""}
                onClick={() => setLocale("uk")}
              >
                UA
              </button>
            </div>

          </div>
        </header>

        

        <section className="partner-view" aria-labelledby="client-offer-heading">
          <article className="partner-card client-offer-hero">
            <p className="partner-kicker">
              {text(
                "Two paths forward for the association",
                "Два шляхи для асоціації",
              )}
            </p>
            <h2 id="client-offer-heading" className="client-offer-hero-headline">
              {text(
                "We can keep identifying experts one request at a time. Or we can build a tool for systematic work — and change how the network operates.",
                "Ми можемо продовжувати ідентифікувати людей по запиту. Або можемо створити інструмент системної роботи — і змінити спосіб, яким мережа діє.",
              )}
            </h2>
            <p className="partner-body">
              {text(
                "Today the association has 178 identified contacts, 45 with verified profiles, and a LinkedIn community of nearly 12,000 people. That is a network. What it lacks is a surface for systematic engagement: finding the right expertise, forming project groups, tracking contributions and making the network's capacity visible — across cross-sell, over-sell, member development and thought leadership.",
                "Сьогодні асоціація має 178 ідентифікованих контактів, 45 із верифікованими профілями та LinkedIn-спільноту майже у 12 000 осіб. Це мережа. Чого не вистачає — поверхні для системної роботи: знаходити потрібну експертизу, формувати проєктні групи, відстежувати внески й робити видимим потенціал мережі — через крос-селл, овер-селл, розвиток членів і thought leadership.",
              )}
            </p>
            <p className="partner-body" style={{ marginTop: "0.75rem" }}>
              {text(
                "The Trust & Influence Index (TII) is the proposed framework for doing this with attribution and evidence — not guesswork. It is co-designed with the client, not imposed as a sector standard.",
                "Trust & Influence Index (TII) — це запропонована рамка для системної роботи з атрибуцією та доказами, а не здогадками. Вона розробляється спільно із замовником, а не нав'язується як галузевий стандарт.",
              )}
            </p>
            <div className="client-offer-actions">
              {/* Service configurator link moved to footer — not surfaced to client */}
            </div>
          </article>

          <section className="client-preview-section" aria-labelledby="client-preview-heading" style={{ marginTop: "3rem" }}>
            <div className="partner-section-heading">
              <span>01</span>
              <div>
                <h2 id="client-preview-heading">
                  {text("See the work, not a mock promise", "Побачити роботу, а не обіцянку")}
                </h2>
                <p>
                  {text(
                    "These interface thumbnails describe prototype paths. The current demo is not a production service or an authenticated client portal.",
                    "Мініатюри показують сценарії прототипу. Поточне демо не є production-сервісом чи автентифікованим кабінетом замовника.",
                  )}
                </p>
              </div>
            </div>
            <div className="client-preview-grid">
              <article className="partner-card client-preview-card">
                <div className="client-preview-window" aria-hidden="true">
                  <div className="client-preview-toolbar">
                    <span>ISRM / EXPERT NETWORK</span>
                    <span className="client-preview-status">SEARCH</span>
                  </div>
                  <div className="client-preview-search">
                    <Search size={15} />
                    <span>{text("Search and filter expertise", "Пошук і фільтри експертизи")}</span>
                  </div>
                  <div className="client-preview-network">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <b />
                    <b />
                    <b />
                  </div>
                </div>
                <h3>{text("Search", "Пошук")}</h3>
                <p className="partner-muted">
                  {text(
                    "Explore the existing search and graph; a match is not evidence of consent, availability or qualification.",
                    "Переглянути наявні пошук і граф; збіг не доводить згоду, доступність чи кваліфікацію.",
                  )}
                </p>
                <section className="partner-value-unlocks" aria-label={text("Value revealed through search", "Цінність, розкрита через пошук")}>
                  <ul>
                    <li>{text("Filter expertise by sector, region and experience without exposing identities", "Фільтрувати експертизу за сектором, регіоном і досвідом — без розкриття ідентичностей")}</li>
                    <li>{text("Browse the network anonymously before any engagement decision", "Переглядати мережу анонімно до будь-якого рішення про залучення")}</li>
                    <li>{text("Identify expertise gaps across sectors before forming a project group", "Виявляти прогалини в експертизі за секторами до формування проєктної групи")}</li>
                    <li>{text("Match candidate experts to specific project requirements through the graph", "Зіставляти кандидатів-експертів із конкретними вимогами проєкту через граф")}</li>
                    <li>{text("Shortlist several experts at once without contacting them prematurely", "Формувати шорт-лист одночасно з кількох експертів — без передчасного контакту")}</li>
                  </ul>
                  <p className="partner-value-unlocks-caption">
                    {text("Planning references, not guaranteed outcomes.", "Планувальні орієнтири, не гарантовані результати.")}
                  </p>
                </section>
              </article>

              <article className="partner-card client-preview-card">
                <div className="client-preview-window client-preview-services" aria-hidden="true">
                  <div className="client-preview-toolbar">
                    <span>FUNCTIONS / MVP</span>
                    <span className="client-preview-status">SELECT</span>
                  </div>
                  {PROPOSAL_FUNCTIONS.filter((item) => item.group === "mvp")
                    .slice(0, 3)
                    .map((item) => (
                      <div className="client-preview-function" key={item.id}>
                        <span />
                        <span>{item.title[uk ? "uk" : "en"]}</span>
                      </div>
                    ))}
                </div>
                <h3>{text("Service functions", "Сервісні функції")}</h3>
                <p className="partner-muted">
                  {text(
                    "Review service options and record an addition/change request; this does not configure a live service.",
                    "Переглянути варіанти сервісів і залишити запит на додавання/зміну; це не налаштовує активний сервіс.",
                  )}
                </p>
                <section className="partner-value-unlocks" aria-label={text("Value revealed through service functions", "Цінність, розкрита через сервісні функції")}>
                  <ul>
                    <li>{text("Form project groups from found experts and assign structured goals", "Формувати проєктні групи із знайдених експертів і призначати структуровані цілі")}</li>
                    <li>{text("Track accepted tasks and outputs per expert and per project group", "Відстежувати прийняті задачі й результати у розрізі кожного експерта й групи")}</li>
                    <li>{text("Send targeted notifications to expert groups without mass broadcast", "Надсилати цільові сповіщення для груп експертів — без масового розсилання")}</li>
                    <li>{text("Record attributable evidence of contributions for each working-group member", "Фіксувати атрибутовані докази внесків для кожного члена робочої групи")}</li>
                    <li>{text("Coordinate agenda-based working groups with defined inputs and expected outputs", "Координувати тематичні робочі групи з визначеними вхідними даними й очікуваними результатами")}</li>
                  </ul>
                  <p className="partner-value-unlocks-caption">
                    {text("Planning references, not guaranteed outcomes.", "Планувальні орієнтири, не гарантовані результати.")}
                  </p>
                </section>
              </article>

              <article className="partner-card client-preview-card">
                <div
                  className="client-preview-window client-preview-dependencies"
                  aria-hidden="true"
                >
                  <div className="client-preview-toolbar">
                    <span>FUNCTIONS / DEPENDENCIES</span>
                    <GitBranch size={14} />
                  </div>
                  {dependencyEdges.map(({ prerequisite, feature }) => (
                    <div className="client-preview-edge" key={`${prerequisite.id}-${feature.id}`}>
                      <span>{prerequisite.title[uk ? "uk" : "en"]}</span>
                      <span aria-hidden="true">→</span>
                      <span>{feature.title[uk ? "uk" : "en"]}</span>
                    </div>
                  ))}
                </div>
                <h3>{text("Dependencies", "Залежності")}</h3>
                <p className="partner-muted">
                  {text(
                    "Inspect which functions depend on other functions before selecting pilot scope.",
                    "Перевірити, які функції залежать одна від одної, перш ніж погоджувати обсяг пілота.",
                  )}
                </p>
                <section className="partner-value-unlocks" aria-label={text("Value revealed through dependencies", "Цінність, розкрита через залежності")}>
                  <ul>
                    <li>
                      {text(
                        "Cross-sell to existing expert-network members from a single selected function",
                        "Крос-селл до наявних членів експертної мережі від однієї обраної функції",
                      )}
                    </li>
                    <li>
                      {text(
                        "Over-sell: increase average client portfolio size by exposing adjacent functions through dependency traversal",
                        "Овер-селл: збільшення клієнтського портфоліо через суміжні функції, які відкриваються при виборі",
                      )}
                    </li>
                    <li>
                      {text(
                        "Member capacity expansion: communities and working groups revealed as downstream opportunities",
                        "Розширення капасіті членів: спільноти та робочі групи як downstream opportunities",
                      )}
                    </li>
                    <li>
                      {text(
                        "Network expertise accumulation: shared evidence review and knowledge capture",
                        "Накопичення мережевої експертизи: спільний перегляд доказів і фіксація знань",
                      )}
                    </li>
                    <li>
                      {text(
                        "Free current publications from working-group outputs",
                        "Безоплатні та актуальні публікації з результатів робочих груп",
                      )}
                    </li>
                    <li>
                      {text(
                        "Publicity development: media-tracked mentions and conference-readiness assessment",
                        "Розвиток паблісіті: відстеження згадок у медіа й оцінка готовності до конференції",
                      )}
                    </li>
                  </ul>
                  <p className="partner-value-unlocks-caption">
                    {text(
                      "Each line is a downstream opportunity revealed through dependency traversal — none of these capabilities were visible without the application service. They are planning references, not guaranteed commercial outcomes.",
                      "Кожен рядок — це downstream opportunity, яку розкриває залежність; жодна з цих можливостей не була видимою без сервісу застосунку. Це планувальні орієнтири, а не гарантовані комерційні результати.",
                    )}
                  </p>
                </section>
              </article>
            </div>
          </section>

          <section aria-labelledby="client-engagement-heading" style={{ marginTop: "4rem" }}>
            <div className="partner-section-heading">
              <span>02</span>
              <div>
                <h2 id="client-engagement-heading">
                  {text(
                    "The expert engagement cycle — how the network grows itself",
                    "Цикл залучення експертів — як мережа розвивається сама",
                  )}
                </h2>
                <p>
                  {text(
                    "This is a cycle, not a sequence. Each element feeds the next and returns to the beginning. The MVP application is the surface that makes the cycle visible and measurable.",
                    "Це цикл, а не послідовність. Кожен елемент живить наступний і повертається до початку. Застосунок MVP — поверхня, яка робить цикл видимим і вимірюваним.",
                  )}
                </p>
              </div>
            </div>

            {/* Cycle diagram */}
            {/* Vertical timeline: left = action, right = revenue */}
            <div className="cycle-timeline" aria-label={text("Expert engagement cycle", "Цикл залучення експертів")}>
              {([
                {
                  id: "members",
                  icon: "👥",
                  action: {
                    en: "Engage active members. Form the working agenda around their expertise gaps, active projects and sector priorities.",
                    uk: "Залучайте активних членів. Формуйте робочу адженду навколо їхніх прогалин, активних проєктів і секторних пріоритетів.",
                  },
                  revenue: null,
                  funnel: { value: "178", note: { en: "CRM contacts · 45 identified", uk: "CRM-контакти · 45 ідентифіковано" } },
                },
                {
                  id: "discussions",
                  icon: "💬",
                  action: {
                    en: "Run structured expert discussions and working groups. Invite LinkedIn followers and course alumni as observers — with consent.",
                    uk: "Проводьте структуровані обговорення та робочі групи. Запрошуйте фоловерів LinkedIn та слухачів курсів як спостерігачів — зі згодою.",
                  },
                  revenue: null,
                  funnel: { value: "~2% of 11.7k", note: { en: "→ ~234 engaged per campaign*", uk: "→ ~234 залучено за кампанію*" } },
                },
                {
                  id: "reports",
                  icon: "📄",
                  action: {
                    en: "Produce analytical reports and a case library from working-group outputs. Attributable evidence of expertise — not marketing copy.",
                    uk: "Готуйте аналітичні звіти та бібліотеку кейсів із результатів робочих груп. Атрибутовані докази — не маркетинговий текст.",
                  },
                  revenue: {
                    en: "Cross-sell: members discover adjacent expertise and services through the reports.",
                    uk: "Крос-селл: члени відкривають суміжну експертизу та сервіси через звіти.",
                  },
                  funnel: null,
                },
                {
                  id: "expertise",
                  icon: "🧠",
                  action: {
                    en: "Build the network expertise map — TII. Verified competencies, active projects, contribution records. The network becomes navigable.",
                    uk: "Формуйте карту мережевої експертизи — TII. Верифіковані компетенції, активні проєкти, записи внесків. Мережа стає навігованою.",
                  },
                  revenue: {
                    en: "Over-sell: deeper engagement with existing members reveals higher-value services and project opportunities.",
                    uk: "Овер-селл: глибше залучення наявних членів відкриває послуги вищої цінності та проєктні можливості.",
                  },
                  funnel: null,
                },
                {
                  id: "membership",
                  icon: "✅",
                  action: {
                    en: "Followers who participated in discussions and read the reports apply for membership. Convert through demonstrated value.",
                    uk: "Фоловери, які брали участь в обговореннях і читали звіти, подають заявки на членство. Конверсія через продемонстровану цінність.",
                  },
                  revenue: {
                    en: "Paid memberships.",
                    uk: "Оплачувані членства.",
                  },
                  funnel: { value: "~30%", note: { en: "→ ~70 new members per cycle*", uk: "→ ~70 нових членів за цикл*" } },
                },
                {
                  id: "warroom",
                  icon: "🗺️",
                  action: {
                    en: "The War Room map shows active members, ongoing projects and deployed expertise in real time. Coordinators see capacity and gaps at a glance.",
                    uk: "Карта War Room показує активних членів, поточні проєкти та задіяну експертизу в реальному часі. Координатори бачать потенціал і прогалини з першого погляду.",
                  },
                  revenue: null,
                  funnel: null,
                },
                {
                  id: "conference",
                  icon: "🎤",
                  action: {
                    en: "Annual conference + almanac: recommendations for practice development, stakeholder risk guidance, professional and regulatory agenda. New followers discover the network here.",
                    uk: "Щорічна конференція + альманах: рекомендації з розвитку практики, поради стейкхолдерам щодо ризиків, профільна та регуляторна адженда. Тут мережу знаходять нові фоловери.",
                  },
                  revenue: {
                    en: "Paid conference tickets. Almanac distribution. New followers enter the cycle.",
                    uk: "Оплачувані квитки на конференцію. Розповсюдження альманаху. Нові фоловери входять у цикл.",
                  },
                  funnel: { value: "8.7k", note: { en: "LinkedIn Page followers · new visibility each cycle", uk: "підписники LinkedIn Page · нова видимість кожного циклу" } },
                },
              ] as const).map((node, i, arr) => (
                <div key={node.id} className="cycle-timeline-row">
                  {/* Left: action only (no funnel) */}
                  <div className="cycle-tl-left">
                    <div className="cycle-tl-card cycle-tl-card--action">
                      <span className="cycle-tl-icon" aria-hidden="true">{node.icon}</span>
                      <p>{node.action[uk ? "uk" : "en"]}</p>
                    </div>
                  </div>

                  {/* Centre: timeline spine */}
                  <div className="cycle-tl-spine">
                    <div className="cycle-tl-dot" aria-hidden="true" />
                    {i < arr.length - 1 && <div className="cycle-tl-line" aria-hidden="true" />}
                    {i === arr.length - 1 && <div className="cycle-tl-return" aria-hidden="true" />}
                  </div>

                  {/* Right: revenue + funnel (audience numbers as outcome) */}
                  <div className="cycle-tl-right">
                    {(node.revenue || node.funnel) ? (
                      <div className="cycle-tl-card cycle-tl-card--revenue">
                        {node.revenue && (
                          <>
                            <span className="cycle-tl-revenue-label" aria-hidden="true">
                              {text("Revenue opportunity", "Можливість доходу")}
                            </span>
                            <p>{node.revenue[uk ? "uk" : "en"]}</p>
                          </>
                        )}
                        {node.funnel && (
                          <div className="cycle-tl-funnel" style={{ marginTop: node.revenue ? "0.5rem" : 0 }}>
                            <strong>{node.funnel.value}</strong>
                            <span>{node.funnel.note[uk ? "uk" : "en"]}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="cycle-tl-empty" aria-hidden="true" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="partner-muted" style={{ fontSize: "0.78rem", marginTop: "0.75rem" }}>
              * {text(
                "Conversion references: Higher Logic Association Community Report, LinkedIn B2B engagement data, ASAE 2026 member onboarding case. Planning references only — not ISRM forecasts.",
                "Орієнтири конверсії: Higher Logic Association Community Report, LinkedIn B2B engagement data, кейс ASAE 2026. Планувальні орієнтири — не прогнози для ISRM.",
              )}
            </p>
          </section>

          <section aria-labelledby="client-consulting-heading" style={{ marginTop: "4rem" }}>
            <div className="partner-section-heading">
              <span>03</span>
              <div>
                <h2 id="client-consulting-heading">
                  {text(
                    "Consulting & strategy — before and alongside the application",
                    "Консалтинг і стратегія — до і паралельно з розробкою",
                  )}
                </h2>
                <p>
                  {text(
                    "Defining the right expertise priorities, preparing the board and co-designing the TII framework requires a dedicated consulting workstream — separate from development cost.",
                    "Визначення правильних пріоритетів, підготовка борду та спільне проєктування рамки TII потребують окремого консалтингового напряму — незалежно від вартості розробки.",
                  )}
                </p>
              </div>
            </div>
            <div className="client-pilot-grid client-pilot-grid--3col">
              {[
                {
                  title: text("Expertise gap analysis", "Аналіз прогалин в експертизі"),
                  detail: text(
                    "Identify the most critical gaps the network faces today and the communities best positioned to fill them.",
                    "Визначте найважливіші прогалини, з якими мережа стикається сьогодні, і спільноти, здатні їх закрити.",
                  ),
                },
                {
                  title: text("Board preparation", "Підготовка борду"),
                  detail: text(
                    "Strategic sessions that turn diagnostic findings into clear decisions — with named owners and concrete next steps.",
                    "Стратегічні сесії, що перетворюють результати діагностики на чіткі рішення — з відповідальними та конкретними наступними кроками.",
                  ),
                },
                {
                  title: text("TII framework co-design", "Спільне проєктування рамки TII"),
                  detail: text(
                    "Define evidence classes, review protocol, governance and correction path with the client — before any score is calculated or any label is applied to a person.",
                    "Визначте класи доказів, протокол перевірки, врядування та шлях виправлення разом із клієнтом — до того як обчислювати будь-який бал або присвоювати будь-яку мітку.",
                  ),
                },
              ].map((step) => (
                <article className="partner-card client-pilot-step" key={step.title}>
                  <h3>{step.title}</h3>
                  <p className="partner-muted">{step.detail}</p>
                </article>
              ))}
            </div>
          </section>
          <EntryFrame locale={locale} />

          <footer className="partner-footer">
            <div className="cta-bottom">
              <Button asChild variant="default" className="button-outline">
                <Link to="/scope">
                  {text("See scope & budget →", "Переглянути обсяг і ціну →")}
                </Link>
              </Button>
            </div>
            <div className="partner-footer-actions">
              <span>
                {text(
                  "Full project context, scope boundaries, estimation limits and source links are in the project description.",
                  "Повний контекст проєкту, межі scope, обмеження оцінювання та посилання на джерела — в описі проєкту.",
                )}
              </span>
            </div>
            <p className="partner-footer-route-notice" role="note">
              {text(
                "This proposal is a browser-local preview, not transmitted, not approved. Indicative ranges are planning references pending preliminary scope and budget-ceiling approval; the first payment is at least 30% of the agreed total and is due on package delivery/acceptance.",
                "Ця пропозиція — локальний браузерний preview, не передана, не погоджена. Індикативні діапазони — планувальні орієнтири, що чекають на попереднє погодження scope та верхньої межі бюджету; перший платіж становить не менше 30% від погодженої суми й здійснюється в момент здачі/приймання пакета.",
              )}
            </p>
            <p style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <Link
                to="/partner"
                style={{ fontSize: "0.7rem", color: "var(--color-muted-foreground)", opacity: 0.4, textDecoration: "none", fontFamily: "var(--font-mono)" }}
                aria-label="Service configurator — partner access only"
              >
                {text("service configurator", "конфігуратор сервісу")}
              </Link>
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
}
