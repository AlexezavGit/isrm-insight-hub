import { createFileRoute, Link } from "@tanstack/react-router";
import { GitBranch, Search } from "lucide-react";
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
      { title: "ISRM — Executive briefing" },
      {
        name: "description",
        content:
          "An executive briefing for ISRM on AI-assisted open-source research, accountable human review and trusted professional knowledge.",
      },
      { property: "og:title", content: "ISRM — Executive briefing" },
      {
        property: "og:description",
        content: "A response to David Rubens: scaling research through AI assistance and the expertise of the ISRM community.",
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
              {text("ISRM · Executive briefing", "ISRM · Бриф для правління")}
            </p>
            <h1>
              {text(
                "Safer professional communication. Trusted network expertise.",
                "Безпечніша професійна комунікація. Достовірна мережева експертиза.",
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
                "In response to Dr David Rubens and the ISRM Strategic Board",
                "Відповідь д-ру Девіду Рубенсу та Стратегічному правлінню ISRM",
              )}
            </p>
            <h2 id="client-offer-heading" className="client-offer-hero-headline">
              {text(
                "What would it take to extend the Ukraine analysis to ISRM’s 11,000+ LinkedIn contacts?",
                "Що потрібно, щоб поширити українське дослідження на понад 11 000 контактів ISRM у LinkedIn?",
              )}
            </h2>
            <p className="partner-body">
              {text(
                "The Ukraine exercise reviewed 178 community records, including deeper public-source research on 45 verified profiles. David’s question is how this could serve a much larger network. Repeating that work manually for every contact would be costly and difficult to keep current. We suggest a reusable research tool: investigate when there is a professional need, then retain the evidence for authorised reuse.",
                "Українське дослідження охопило 178 записів спільноти, зокрема поглиблене дослідження відкритих джерел для 45 верифікованих профілів. Питання Девіда — як використати цей підхід для значно ширшої мережі. Повторювати всю роботу вручну для кожного контакту було б дорого, а дані швидко застарівали б. Пропонуємо інструмент багаторазового використання: досліджувати за професійною потребою й зберігати докази для дозволеного повторного використання.",
              )}
            </p>
            <p className="partner-body" style={{ marginTop: "0.75rem" }}>
              {text(
                "AI-assisted open-source intelligence (OSINT) can gather and organise evidence. A named human reviewer must check the sources, context and conclusions before information is relied upon or shared. ISRM’s chapter network could provide the relevant expertise, subject to participation, capacity and agreed responsibilities. This briefing opens that discussion; it is not yet a formal offer.",
                "Дослідження відкритих джерел (OSINT) за допомогою ШІ може збирати й упорядковувати докази. Визначений фахівець має перевірити джерела, контекст і висновки, перш ніж дані використовуватимуть або поширюватимуть. Мережа чаптерів ISRM може надати потрібну експертизу — за умови участі, спроможності та погоджених відповідальностей. Цей бриф відкриває обговорення; він ще не є офіційною пропозицією.",
              )}
            </p>
            <div className="client-offer-actions">
              {/* Service configurator link moved to footer — not surfaced to client */}
            </div>
          </article>

          <section className="client-preview-section" aria-labelledby="client-preview-heading" style={{ marginTop: "3rem" }}>
            <div className="partner-section-heading my-16">
              <span>01</span>
              <div>
                <h2 id="client-preview-heading">
                  {text("A digital research capability, built around professional judgement", "Цифровий інструмент дослідження, що спирається на професійне судження")}
                </h2>
                <p>
                  {text(
                    "Research on demand → evidence and source records → accountable human review → authorised reuse. The existing search and graph demonstrate the starting point; AI research and the review process still need to be implemented.",
                    "Професійний запит → докази та джерела → відповідальна перевірка людиною → дозволене повторне використання. Наявні пошук і граф демонструють початкову основу; ШІ-дослідження та процедуру перевірки ще потрібно реалізувати.",
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
                <h3>{text("AI research & human review", "ШІ-дослідження та людська перевірка")}</h3>
                <p className="partner-muted">
                  {text(
                    "Proposed: collect relevant public evidence, record sources and dates, and submit conclusions to a responsible expert. AI output is a research aid, not proof of a person’s competence or integrity.",
                    "Пропонуємо: збирати релевантні відкриті дані, фіксувати джерела й дати та передавати висновки відповідальному експерту. Висновок ШІ — допомога в дослідженні, а не доказ компетентності чи доброчесності людини.",
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
                <h3>{text("Shared professional value", "Спільна професійна цінність")}</h3>
                <p className="partner-muted">{text("A proposed foundation for horizontal cooperation — not a guaranteed commercial return.", "Запропонована основа горизонтальної співпраці — не гарантія комерційного результату.")}</p>
                <section className="partner-value-unlocks">
                  <ul>
                    <li>{text("Review facts with colleagues who understand the sector and context", "Перевіряти факти з колегами, які розуміють сектор і контекст")}</li>
                    <li>{text("Retain reviewed evidence for authorised reuse", "Зберігати перевірені докази для дозволеного повторного використання")}</li>
                    <li>{text("Find complementary expertise for project groups and referrals", "Знаходити взаємодоповнювальну експертизу для проєктних груп і рекомендацій")}</li>
                    <li>{text("Turn agreed findings into training, case studies and publications", "Перетворювати погоджені висновки на навчання, кейси та публікації")}</li>
                    <li>{text("Connect chapter discussions with research and conference agendas", "Пов’язувати обговорення чаптерів із дослідженнями та програмами конференцій")}</li>
                    <li>{text("Make contributions visible without treating participation as endorsement", "Робити внески видимими, не прирівнюючи участь до схвалення")}</li>
                  </ul>
                </section>
              </article>
            </div>
          </section>

          <section aria-labelledby="client-engagement-heading">
            <div className="partner-section-heading my-16">
              <span>02</span>
              <div>
                <h2 id="client-engagement-heading">{text("Two paths for further development", "Два напрями подальшого розвитку")}</h2>
                <p>{text("Start with reliable information and safer communication. Wider services can follow when ISRM identifies a useful purpose, willing participants and a sustainable operating model.", "Почати з достовірної інформації та безпечнішої комунікації. Ширші сервіси розвивати тоді, коли ISRM визначить корисну мету, охочих учасників і сталу модель роботи.")}</p>
              </div>
            </div>
            <div className="client-pilot-grid">
              <article className="partner-card client-pilot-step">
                <h3>{text("Member & service-user engagement", "Залучення членів і користувачів послуг")}</h3>
                <p className="partner-body">{text("Chapter and sector priorities → expert discussions → useful, reviewed content → interested participants → membership or service enquiries. Invitations, event support and communications could make this a repeatable cycle.", "Пріоритети чаптерів і секторів → експертні обговорення → корисний перевірений контент → зацікавлені учасники → запити на членство чи послуги. Запрошення, супровід подій і комунікація можуть зробити цей цикл повторюваним.")}</p>
                <p className="partner-muted">{text("Measure actual participation and enquiries first. No membership, revenue or conversion outcome is promised.", "Спочатку вимірювати реальну участь і запити. Членства, дохід чи рівень конверсії не гарантуються.")}</p>
              </article>
              <article className="partner-card client-pilot-step">
                <h3>{text("Network knowledge: capture, develop, share", "Мережева експертиза: накопичувати, розвивати, поширювати")}</h3>
                <p className="partner-body">{text("Professional request → research and peer review → an attributable report or case → training, publications and authorised reuse. Shared knowledge can support project teams, internal consultation and referrals, subject to consent and agreed rights.", "Професійний запит → дослідження та експертна перевірка → звіт або кейс із визначеним авторством → навчання, публікації та дозволене повторне використання. Спільні знання можуть підтримати проєктні групи, внутрішні консультації та рекомендації — за згодою й погодженими правами.")}</p>
                <p className="partner-muted">{text("Potential links with ISRM’s existing work — not proposed replacements:", "Можливі зв’язки з наявною роботою ISRM — не її заміна:")}</p>
                <nav className="client-price-sources" aria-label={text("ISRM knowledge resources", "Ресурси знань ISRM")}>
                  <a href="https://www.theisrm.org/global-risk-review/" target="_blank" rel="noreferrer">Global Risk Review</a>
                  <a href="https://www.theisrm.org/public-library/" target="_blank" rel="noreferrer">Public Library</a>
                  <a href="https://www.theisrm.org/strategic-risk-case-competition-2026/" target="_blank" rel="noreferrer">Strategic Risk Case Competition</a>
                </nav>
              </article>
            </div>
          </section>

          <section aria-labelledby="client-consulting-heading" style={{ marginTop: "4rem" }}>
            <div className="partner-section-heading my-16">
              <span>03</span>
              <div>
                <h2 id="client-consulting-heading">
                  {text(
                    "Agree the purpose, evidence rules and responsibilities",
                    "Погодити мету, правила доказів та відповідальність",
                  )}
                </h2>
                <p>
                  {text(
                    "The first discussion should define what information ISRM needs, who may use it and who is accountable for its review. Any additional strategic work will be scoped separately; the same work must not be charged twice.",
                    "Перше обговорення має визначити, які дані потрібні ISRM, хто має право їх використовувати та хто відповідає за перевірку. Додаткову стратегічну роботу погоджуватимемо окремо; одна й та сама робота не повинна оплачуватися двічі.",
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
                  title: text("Review responsibilities", "Відповідальність за перевірку"),
                  detail: text(
                    "Agree reviewer expertise, source quality, update intervals, access permissions and a route to correct or challenge findings. AI assistance does not replace professional accountability.",
                    "Погодити компетенції перевіряльників, якість джерел, строки оновлення, права доступу та порядок виправлення або оскарження висновків. Допомога ШІ не замінює професійної відповідальності.",
                  ),
                },
                {
                  title: text("Trust & Influence: a research question", "Trust & Influence: питання для дослідження"),
                  detail: text(
                    "Explore whether publications, cases, solution quality, research, professional interaction and recommendations can support an evidence-based picture of expertise. Any Trust & Influence Index must be co-designed and validated before scoring or ranking people.",
                    "Дослідити, чи можуть публікації, кейси, якість рішень, дослідження, професійна взаємодія та рекомендації формувати доказове уявлення про експертизу. Будь-який Trust & Influence Index потрібно спільно розробити й перевірити до оцінювання чи ранжування людей.",
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
                  {text("Discuss scope & budget limits", "Обговорити обсяг і ліміти бюджету")}
                </Link>
              </Button>
            </div>
            <div className="partner-footer-actions">
              <span>
                {text(
                  "Next: review the demonstration, describe the functions you would find useful, then indicate your preferred scope and budget limit. We will prepare a detailed specification, timetable and formal offer for a further approval round.",
                  "Далі: переглянути демонстрацію, описати корисні для вас функції та вказати бажаний обсяг і ліміт бюджету. Після цього підготуємо детальне технічне завдання, строки й офіційну пропозицію для наступного раунду погодження.",
                )}
              </span>
            </div>
            <p className="partner-footer-route-notice" role="note">
              {text(
                "This is an executive briefing and interactive demonstration, not a production service or a binding offer. AI research is not yet connected. Personal data remains subject to access limits, permitted use and human review. No work is commissioned or invoiced through this page.",
                "Це бриф для правління та інтерактивна демонстрація, а не промисловий сервіс чи зобов’язувальна оферта. ШІ-дослідження ще не підключене. Персональні дані підлягають обмеженням доступу, дозволеному використанню та людській перевірці. Ця сторінка не замовляє роботи й не виставляє рахунків.",
              )}
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
}
