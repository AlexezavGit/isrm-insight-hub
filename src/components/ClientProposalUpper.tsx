import { GitBranch, Search } from "lucide-react";

type Props = {
  locale: "en" | "uk";
  text: (en: string, ua: string) => string;
  uk: boolean;
  setLocale: (locale: "en" | "uk") => void;
  dependencyEdges: Array<{ prerequisite: any; feature: any }>;
};

export function ClientProposalUpper({ text, uk, setLocale, dependencyEdges }: Props) {
  return (
    <>
      <header className="partner-header">
        <div>
          <div className="partner-logo-row" aria-label="ISRM">
            <svg
              className="partner-isrm-logo"
              viewBox="0 0 120 28"
              width="120"
              height="28"
              role="img"
              aria-label="ISRM"
            >
              <title>ISRM</title>
              <text
                x="0"
                y="22"
                fontFamily="Space Grotesk, Montserrat, ui-sans-serif, system-ui, sans-serif"
                fontWeight="700"
                fontSize="26"
                letterSpacing="0.04em"
                fill="currentColor"
              >
                ISRM
              </text>
            </svg>
          </div>
          <p className="partner-eyebrow">{text("Client proposal", "Пропозиція замовнику")}</p>
          <h1>
            {text(
              "AI OSINT and human appraisal — a space of experts with Trust and Influence",
              "AI OSINT і людська оцінка — простір експертів із Trust and Influence",
            )}
          </h1>
          <p
            className="partner-lede partner-question-plaque"
            style={{
              maxWidth: 820,
              marginTop: "1rem",
              padding: "0.9rem 1.1rem",
              borderLeft: "4px solid var(--brass, #c8901a)",
              borderRadius: "0 6px 6px 0",
              background: "color-mix(in oklab, var(--brass, #c8901a) 12%, var(--card, #f2eadb))",
              fontSize: "1.02rem",
              lineHeight: 1.55,
            }}
          >
            {text(
              "The question was: what's next? We can keep assessing experts one by one. Or we can give the network a tool for interaction — not another sorted spreadsheet, but a surface for engagement: finding the right expert, forming project groups, tracking contributions, making capacity visible, cross-sell, over-sell, member development and thought leadership.",
              "Питання було: що далі? Можна й далі оцінювати експертів по одному. Або дати мережі інструмент взаємодії — не ще одну впорядковану таблицю, а поверхню для залучення: знаходити потрібного експерта, формувати проєктні групи, відстежувати внески, робити видимим потенціал, крос-селл, овер-селл, розвиток членів і thought leadership.",
            )}
          </p>
        </div>
        <div className="partner-header-status">
          <div className="partner-locale-switch" role="group" aria-label={text("Page language", "Мова сторінки")}>
            <button type="button" aria-pressed={!uk} className={!uk ? "is-active" : ""} onClick={() => setLocale("en")}>
              EN
            </button>
            <button type="button" aria-pressed={uk} className={uk ? "is-active" : ""} onClick={() => setLocale("uk")}>
              UA
            </button>
          </div>
        </div>
      </header>

      <section className="partner-view" aria-labelledby="client-offer-heading">
        <article className="partner-card client-offer-hero" id="client-offer-heading">
          <p className="partner-kicker">{text("Network baseline", "Базовий стан мережі")}</p>
          <p className="partner-body">
            {text(
              "Today the association has 178 identified contacts, 45 with verified profiles, and a LinkedIn Page of 8,742 followers (group ~11,700). That is a network. The MVP application is the surface that turns it into systematic work.",
              "Сьогодні асоціація має 178 ідентифікованих контактів, 45 із верифікованими профілями та LinkedIn Page 8 742 підписники (група ~11 700). Це мережа. MVP-застосунок — поверхня, яка перетворює її на системну роботу.",
            )}
          </p>
        </article>

        <section className="client-preview-section" aria-labelledby="client-preview-heading" style={{ marginTop: "3rem" }}>
          <div className="partner-section-heading" style={{ margin: "4rem 0" }}>
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
                  <i /><i /><i /><i /><i /><b /><b /><b />
                </div>
              </div>
              <h3>{text("Search", "Пошук")}</h3>
              <p className="partner-muted">
                {text(
                  "Explore the existing search and graph; a match is not evidence of consent, availability or qualification.",
                  "Переглянути наявні пошук і граф; збіг не доводить згоду, доступність чи кваліфікацію.",
                )}
              </p>
              <section className="partner-value-unlocks" aria-label={text("Value revealed through search", "Цінність через пошук")}>
                <ul>
                  <li>{text("Filter expertise by sector, region and experience without exposing identities", "Фільтрувати експертизу за сектором, регіоном і досвідом — без розкриття ідентичностей")}</li>
                  <li>{text("Browse the network anonymously before any engagement decision", "Переглядати мережу анонімно до будь-якого рішення про залучення")}</li>
                  <li>{text("Identify expertise gaps across sectors before forming a project group", "Виявляти прогалини в експертизі за секторами до формування проєктної групи")}</li>
                  <li>{text("Match candidate experts to specific project requirements through the graph", "Зіставляти кандидатів-експертів із конкретними вимогами проєкту через граф")}</li>
                  <li>{text("Shortlist several experts at once without contacting them prematurely", "Формувати шорт-лист одночасно з кількох експертів — без передчасного контакту")}</li>
                </ul>
              </section>
            </article>

            <article className="partner-card client-preview-card">
              <div className="client-preview-window client-preview-services" aria-hidden="true">
                <div className="client-preview-toolbar">
                  <span>FUNCTIONS / MVP</span>
                  <span className="client-preview-status">SELECT</span>
                </div>
                <div className="client-preview-function"><span /><span>MVP Application</span></div>
                <div className="client-preview-function"><span /><span>Expert discussions</span></div>
                <div className="client-preview-function"><span /><span>Reports & Publications</span></div>
              </div>
              <h3>{text("Service functions", "Сервісні функції")}</h3>
              <p className="partner-muted">
                {text(
                  "Review service options and record an addition/change request; this does not configure a live service.",
                  "Переглянути варіанти сервісів і залишити запит на додавання/зміну; це не налаштовує активний сервіс.",
                )}
              </p>
              <section className="partner-value-unlocks">
                <ul>
                  <li>{text("Form project groups from found experts and assign structured goals", "Формувати проєктні групи із знайдених експертів і призначати структуровані цілі")}</li>
                  <li>{text("Track accepted tasks and outputs per expert and per project group", "Відстежувати прийняті задачі й результати у розрізі кожного експерта й групи")}</li>
                  <li>{text("Send targeted notifications to expert groups without mass broadcast", "Надсилати цільові сповіщення для груп експертів — без масового розсилання")}</li>
                  <li>{text("Record attributable evidence of contributions for each working-group member", "Фіксувати атрибутовані докази внесків для кожного члена робочої групи")}</li>
                  <li>{text("Coordinate agenda-based working groups with defined inputs and expected outputs", "Координувати тематичні робочі групи з визначеними вхідними даними й очікуваними результатами")}</li>
                </ul>
              </section>
            </article>

            <article className="partner-card client-preview-card">
              <div className="client-preview-window client-preview-dependencies" aria-hidden="true">
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
              <section className="partner-value-unlocks">
                <ul>
                  <li>{text("Cross-sell to existing expert-network members from a single selected function", "Крос-селл до наявних членів експертної мережі від однієї обраної функції")}</li>
                  <li>{text("Over-sell: increase average client portfolio size by exposing adjacent functions", "Овер-селл: збільшення портфоліо через суміжні функції")}</li>
                  <li>{text("Member capacity expansion: communities and working groups as downstream opportunities", "Розширення капасіті: спільноти та робочі групи як downstream opportunities")}</li>
                  <li>{text("Network expertise accumulation: shared evidence review and knowledge capture", "Накопичення мережевої експертизи: спільний перегляд доказів і фіксація знань")}</li>
                  <li>{text("Publicity development: media-tracked mentions and conference-readiness assessment", "Розвиток паблісіті: згадки в медіа й оцінка готовності до конференції")}</li>
                </ul>
              </section>
            </article>
          </div>
        </section>
      </section>
    </>
  );
}
