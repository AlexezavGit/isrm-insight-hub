import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { EntryFrame } from "@/components/EntryFrame";

type Props = {
  locale: "en" | "uk";
  text: (en: string, ua: string) => string;
  uk: boolean;
};

export function ClientProposalLower({ locale, text, uk }: Props) {
  return (
    <>
      {/* ── Section 02: Expert engagement cycle ── */}
      <section aria-labelledby="client-engagement-heading" style={{ marginTop: "4rem" }}>
        <div className="partner-section-heading" style={{ margin: "4rem 0" }}>
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
                "Це цикл, а не послідовність. Кожен елемент живить наступний і повертається до початку. MVP застосунку — поверхня, яка робить цикл видимим і вимірюваним.",
              )}
            </p>
          </div>
        </div>

        <div className="cycle-timeline" aria-label={text("Expert engagement cycle", "Цикл залучення експертів")}>
          {(
            [
              {
                id: "members",
                icon: "👥",
                action: {
                  en: "Engage active members. Form the working agenda around their expertise gaps, active projects and sector priorities.",
                  uk: "Залучайте активних членів. Формуйте робочу адженду навколо їхніх прогалин, активних проєктів і секторних пріоритетів.",
                },
                revenue: null as { en: string; uk: string } | null,
                funnel: {
                  value: "178",
                  note: {
                    en: "CRM contacts · 45 identified",
                    uk: "CRM-контакти · 45 ідентифіковано",
                  },
                },
              },
              {
                id: "discuss",
                icon: "💬",
                action: {
                  en: "Run expert discussions and sector roundtables. Capture contributions as attributable evidence.",
                  uk: "Проводьте експертні обговорення та секторні круглі столи. Фіксуйте внески як атрибутовані докази.",
                },
                revenue: {
                  en: "Discussion outputs become reports, publications, and value for members and clients.",
                  uk: "Результати обговорень стають звітами, публікаціями та цінністю для членів та клієнтів.",
                },
                funnel: null as { value: string; note: { en: string; uk: string } } | null,
              },
              {
                id: "publish",
                icon: "📄",
                action: {
                  en: "Turn transcripts into reports and publications. Distribute to members and the wider circle.",
                  uk: "Перетворюйте стенограми на звіти й публікації. Розповсюджуйте серед членів і ширшого кола.",
                },
                revenue: {
                  en: "Thought leadership and open publications from working-group outputs.",
                  uk: "Лідерство думок і відкриті публікації з результатів робочих груп.",
                },
                funnel: null,
              },
              {
                id: "audience",
                icon: "📣",
                action: {
                  en: "Reach the LinkedIn Page audience with each cycle of visibility.",
                  uk: "Досягайте аудиторії LinkedIn Page з кожним циклом видимості.",
                },
                revenue: {
                  en: "Paid memberships and conference attendance from the same audience pool.",
                  uk: "Платні членства та відвідування конференції з того ж пулу аудиторії.",
                },
                funnel: {
                  value: "~52 / ~43",
                  note: {
                    en: "Paid memberships ≈ 8,742 × 2% × 30% ≈ 52 · Conference ≈ 8,742 × 2% × 25% ≈ 43 (planning refs)",
                    uk: "Платні членства ≈ 8 742 × 2% × 30% ≈ 52 · Конференція ≈ 8 742 × 2% × 25% ≈ 43 (планувальні орієнтири)",
                  },
                },
              },
              {
                id: "conference",
                icon: "🎤",
                action: {
                  en: "Deliver sectoral, industry, regional and national conferences. Showcase member work, release the findings report, and open the next cycle.",
                  uk: "Проводьте секторальні, галузеві, регіональні, національні конференції. Презентуйте роботу членів, випускайте підсумковий звіт і відкривайте наступний цикл.",
                },
                revenue: {
                  en: "Conference registrations and higher-tier memberships.",
                  uk: "Реєстрації на конференцію та вищі рівні членства.",
                },
                funnel: null,
              },
            ] as const
          ).map((node, i, arr) => (
            <div className="cycle-timeline-row cycle-tl-row" key={node.id}>
              <div className="cycle-tl-left">
                <div className="cycle-tl-card cycle-tl-card--action">
                  <span className="cycle-tl-icon" aria-hidden="true">
                    {node.icon}
                  </span>
                  <p>{node.action[uk ? "uk" : "en"]}</p>
                </div>
              </div>
              <div className="cycle-tl-spine">
                <div className="cycle-tl-dot" aria-hidden="true" />
                {i < arr.length - 1 && <div className="cycle-tl-line" aria-hidden="true" />}
                {i === arr.length - 1 && <div className="cycle-tl-return" aria-hidden="true" />}
              </div>
              <div className="cycle-tl-right">
                {node.revenue || node.funnel ? (
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
                      <div
                        className="cycle-tl-funnel"
                        style={{ marginTop: node.revenue ? "0.5rem" : 0 }}
                      >
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

        <p className="partner-muted" style={{ fontSize: "0.78rem", marginTop: "1rem" }}>
          *{" "}
          {text(
            "Conversion references (planning only, not ISRM forecasts): Higher Logic Association Community Report · LinkedIn B2B engagement lower band (~2%) · voluntary association free-to-paid / apply-to-accepted benchmarks (~25–30%) · ASAE 2026 member onboarding case.",
            "Орієнтири конверсії (лише планувальні, не прогнози ISRM): Higher Logic Association Community Report · LinkedIn B2B lower band (~2%) · бенчмарки free-to-paid / apply-to-accepted (~25–30%) · кейс ASAE 2026.",
          )}
        </p>
      </section>

      {/* ── Section 03: Strategic consulting on the path to building network expertise ── */}
      <section aria-labelledby="client-consulting-heading" style={{ marginTop: "4rem" }}>
        <div className="partner-section-heading" style={{ margin: "4rem 0" }}>
          <span>03</span>
          <div>
            <h2 id="client-consulting-heading">
              {text(
                "Strategic consulting on the path to building network expertise",
                "Стратегічний консалтинг на шляху до побудови мережевої експертизи",
              )}
            </h2>
            <p className="partner-body" style={{ marginTop: "0.75rem", lineHeight: "1.65", fontSize: "1.05rem", color: "#132a22" }}>
              {text(
                "Why external consulting is irreplaceable: Internal teams inevitably encounter corporate bias, territorial silos, and political inertia when attempting to assess their own risk posture. ISRM consultants provide uncompromising external independence, cross-sector benchmarking, and unbiased analysis. Crucially, the recommendations do not end as paper reports — they are directly translated into operational software tools and ongoing digital workflows that accompany the organization in post-consulting support.",
                "Чому клієнт не може провести це самостійно: Внутрішні команди неминуче стикаються із суб'єктивністю, відомчими бар'єрами та внутрішньополітичним опором при спробі оцінити власні ризики. Консультанти асоціації забезпечують повну зовнішню незалежність, незаангажованість та міжгалузевий бенчмаркінг. Головне — результати консалтингу не залишаються паперовими звітами: вони перекладаються у прикладні технологічні рішення та цифрові інструменти, які супроводжують процеси організації на етапі пост-консалтингового супроводу.",
              )}
            </p>
          </div>
        </div>

        {/* Roles & Joint Outcomes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid rgba(11, 84, 76, 0.2)",
              borderRadius: "10px",
              padding: "1.25rem 1.5rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#c8901a",
                fontWeight: 700,
                display: "block",
                marginBottom: "0.4rem",
              }}
            >
              {text("Role Architecture", "Ролі та залучення")}
            </span>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#064e3b", margin: "0 0 0.5rem" }}>
              {text("Who is involved from the Association", "Хто і як задіяний з боку асоціації")}
            </h3>
            <p style={{ fontSize: "0.88rem", lineHeight: 1.55, color: "#2d4a3e", margin: 0 }}>
              {text(
                "Board members establish governance limits and legal perimeters; recognized sector leaders moderate expert tracks; verified network members contribute real case evidence; and dedicated coordinators orchestrate knowledge capture.",
                "Члени Правління формують мандати та межі управління; визнані галузеві лідери очолюють секторні треки; перевірені члени асоціації надають кейси та практичний досвід; координатори забезпечують регулярний синтез знань.",
              )}
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid rgba(11, 84, 76, 0.2)",
              borderRadius: "10px",
              padding: "1.25rem 1.5rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#c8901a",
                fontWeight: 700,
                display: "block",
                marginBottom: "0.4rem",
              }}
            >
              {text("Target Delivery", "Спільні аутками")}
            </span>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#064e3b", margin: "0 0 0.5rem" }}>
              {text("Outcomes created together", "Які аутками створюються разом")}
            </h3>
            <p style={{ fontSize: "0.88rem", lineHeight: 1.55, color: "#2d4a3e", margin: 0 }}>
              {text(
                "An actionable capability matrix, validated client portfolios, transparent fee splitting mechanics, ongoing cross-selling pipelines, and interactive risk dashboards supporting real management decisions.",
                "Дієва матриця капасіті, портфоліо клієнтів із виміряними результатами, прозора модель розподілу гонорарів, активні реферальні ланцюги та інтерактивні дашборди для підтримки управлінських рішень.",
              )}
            </p>
          </div>
        </div>

        {/* 9-Step Consulting Sequence */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h3
            style={{
              fontSize: "1.15rem",
              fontWeight: 800,
              color: "#064e3b",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>{text("Consulting Project Sequence", "Послідовність консалтингового проєкту")}</span>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#c8901a", fontFamily: "var(--font-mono)" }}>
              (9 кроків розвитку)
            </span>
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.85rem" }}>
            {[
              {
                num: "01",
                title: text("Successful member practice", "Успішна практика членів"),
                desc: text(
                  "Originating from established individual consulting and analytical practices of association members.",
                  "Від успішної консалтингової чи експертної практики діючих членів асоціації.",
                ),
              },
              {
                num: "02",
                title: text("Network expertise & AI analysis", "Мережева експертиза та ШІ"),
                desc: text(
                  "Forming unified network expertise augmented with AI data enhancement, automated OSINT, and predictive analytics.",
                  "Створення мережевої експертизи, яка аналізується з покращенням даних та прогнозів за допомогою ШІ.",
                ),
              },
              {
                num: "03",
                title: text("Mutual consultant-expert trust", "Побудова взаємної довіри"),
                desc: text(
                  "Establishing mutual professional trust between lead consultants and specialized association practitioners.",
                  "Побудова взаємної довіри між консультантами та профільними експертами асоціації.",
                ),
              },
              {
                num: "04",
                title: text("Project origination & mixed teams", "Оріджинейшн проєктів"),
                desc: text(
                  "Originating a robust pipeline of client projects staffed by bespoke, interdisciplinary member teams.",
                  "Оріджинейшн пулу проєктів із збірними міжгалузевими командами членів асоціації.",
                ),
              },
              {
                num: "05",
                title: text("Fair fee-splitting models", "Справедливе сплітування гонорарів"),
                desc: text(
                  "Designing transparent, merit-based compensation splitting rules across origination, delivery, and peer review.",
                  "Розробка справедливого та прозорого сплітування гонорарів між лідерами, виконавцями та рев'юерами.",
                ),
              },
              {
                num: "06",
                title: text("Proven client portfolio", "Портфоліо задоволених клієнтів"),
                desc: text(
                  "Building a portfolio of benchmark clients who attained expected outcomes and effective decision architectures.",
                  "Побудова портфоліо клієнтів, які отримали очікуваний досвід та високий рівень дієвих рішень.",
                ),
              },
              {
                num: "07",
                title: text("Cross-sell & referral engine", "Перехресні продажі та реферали"),
                desc: text(
                  "Activating systematic cross-selling of adjacent services and mutual client referral mechanisms.",
                  "Запуск перехресних продажів суміжних послуг та дієвої реферальної системи між практиками.",
                ),
              },
              {
                num: "08",
                title: text("Sector digests & dashboards", "Аналітичні дайджести й дашборди"),
                desc: text(
                  "Publishing quarterly sector intelligence digests and live telemetry dashboards for institutional leaders.",
                  "Формування аналітичних дайджестів та інтерактивних дашбордів за секторами консультантів.",
                ),
              },
              {
                num: "09",
                title: text("Network-based Think Tank", "Network-based Think Tank"),
                desc: text(
                  "Institutionalizing the collective intelligence into a permanent, internationally recognized Think Tank.",
                  "Утворення самодостатнього, авторитетного інституційного Network-based Think Tank.",
                ),
              },
            ].map((step) => (
              <div
                key={step.num}
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(11, 84, 76, 0.15)",
                  borderRadius: "8px",
                  padding: "0.95rem 1.1rem",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      color: "#c8901a",
                    }}
                  >
                    {step.num}
                  </span>
                  <strong style={{ fontSize: "0.95rem", color: "#064e3b" }}>{step.title}</strong>
                </div>
                <p style={{ margin: 0, fontSize: "0.84rem", lineHeight: 1.5, color: "#2d4a3e" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── NEXT BLOCK / PROPOSAL: Trust & Influence Index & Composite Balance ── */}
        <div
          style={{
            border: "2px solid var(--brass, #c8901a)",
            borderRadius: "14px",
            padding: "2.25rem",
            background: "color-mix(in oklab, var(--brass, #c8901a) 10%, var(--card, #f5ede0))",
            boxShadow: "0 10px 32px rgba(18, 60, 58, 0.08)",
            marginBottom: "2.5rem",
          }}
        >
          {/* Header pill & Title */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.85rem", marginBottom: "1rem" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.3rem 0.75rem",
                borderRadius: "5px",
                background: "var(--brass, #c8901a)",
                color: "#ffffff",
                boxShadow: "0 2px 6px rgba(200, 144, 26, 0.3)",
              }}
            >
              {text("Strategic Proposal", "Пропозиція індексу")}
            </span>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0, color: "#064e3b", letterSpacing: "-0.01em" }}>
              {text("Trust & Influence Index", "Trust & Influence Index")}
            </h3>
          </div>

          {/* Industry awards critique vs Real ISRM Assessment */}
          <p
            style={{
              fontSize: "1.08rem",
              lineHeight: 1.65,
              color: "#132a22",
              fontWeight: 600,
              marginBottom: "1.25rem",
            }}
          >
            {text(
              "Overcoming nominal industry rankings: The consulting market is saturated with awards, badges, and directories that merely reflect membership in an exclusive club or closed fraternity, only accidentally touching upon objective appraisal of real practice. ISRM replaces nominal awards with a thorough, multi-dimensional analysis of actual competence grounded in empirical facts, verifiable case evidence, and cross-disciplinary review.",
              "Подолання номінальних ренкінгів: Ринок консалтингу переповнений відзнаками, каталогами та нагородами, які спираються виключно на формальну належність до тієї чи іншої закритої групи, і лише випадково торкаються об'єктивної оцінки успішності практики. На противагу цьому, Trust & Influence Index забезпечує дійсний, всебічний аналіз ситуації, спираючись на реальні підтвердження фактів, вимірювані результати та багаторівневу перевірку.",
            )}
          </p>

          {/* Composite Balance of Factors */}
          <div>
            <h4
              style={{
                fontSize: "0.9rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 800,
                color: "#064e3b",
                marginBottom: "0.95rem",
              }}
            >
              {text("Composite Balance of Assessment Factors", "Композитний баланс факторів оцінки")}
            </h4>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "0.85rem",
              }}
            >
              {[
                {
                  label: text("Publications & Citations", "Публікації та цитування"),
                  note: text("Research papers, almanacs, industry analytics, and media citations", "Аналітичні звіти, альманахи, фахові статті та цитування в медіа"),
                },
                {
                  label: text("Verified Successful Cases", "Підтверджені успішні кейси"),
                  note: text("Documented client deployments with verifiable outcomes", "Реалізовані проєкти з підтвердженими фактами досягнутих результатів"),
                },
                {
                  label: text("Scale & Complexity of Solved Tasks", "Масштаб та комплексність вирішених задач"),
                  note: text("Enterprise, critical infrastructure, and national security scope", "Рівень архітектури, масштаб рішень та системна складність подоланих викликів"),
                },
                {
                  label: text("Applied Research & Modeling", "Прикладні дослідження та моделювання"),
                  note: text("Methodology authoring, risk stress-testing, and forecasting models", "Розробка авторських методик, стрес-тестування та моделювання ризиків"),
                },
                {
                  label: text("AI OSINT Verification & Fact-Checking", "ШІ OSINT перевірка: збір фактів впливу"),
                  note: text("Algorithmic evidence harvesting of actual impact on the consulting target", "Збір підтверджень та фактів дійсного впливу пропонованих рішень на об'єкт консалтингу"),
                },
                {
                  label: text("Board & Peer Evaluation", "Оцінка правління та колег"),
                  note: text("Formal peer validation, ethical review, and board endorsements", "Колегіальна оцінка фахівцями, етичний комплаєнс та валідація Правлінням"),
                },
                {
                  label: text("Client Endorsements & Market Trust", "Рекомендації клієнтів та відгуки ринку"),
                  note: text("Documented references from institutional buyers and counterparties", "Атрибутовані відгуки замовників, партнерів та інституційні рекомендації"),
                },
              ].map((factor) => (
                <div
                  key={factor.label}
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    borderLeft: "4px solid #064e3b",
                    borderRadius: "0 8px 8px 0",
                    padding: "0.85rem 1rem",
                    border: "1px solid rgba(6, 78, 59, 0.15)",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
                  }}
                >
                  <strong style={{ display: "block", fontSize: "0.92rem", color: "#064e3b", marginBottom: "0.3rem" }}>
                    {factor.label}
                  </strong>
                  <span style={{ fontSize: "0.8rem", color: "#2d4a3e", lineHeight: 1.45 }}>{factor.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <EntryFrame locale={locale} />

      {/* ── Footer ── */}
      <footer className="partner-footer">
        <div className="cta-bottom" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", alignItems: "center" }}>
          <Button asChild variant="default" className="button-outline text-base px-6 py-5 shadow-lg">
            <Link to="/scope">{text("See scope & budget →", "Переглянути обсяг і ціну →")}</Link>
          </Button>
          <Button asChild variant="outline" className="button-outline text-base px-6 py-5 border-primary/50 text-primary hover:bg-primary/10 shadow-md">
            <Link to="/partner">{text("Partner Configurator ↗", "Конфігуратор для партнерів ↗")}</Link>
          </Button>
        </div>

        <div className="partner-footer-actions" style={{ marginTop: "1.75rem", textAlign: "center" }}>
          <span style={{ display: "block", marginBottom: "0.5rem" }}>
            {text(
              "Full project context, scope boundaries, estimation limits and source links are in the project specification.",
              "Повний контекст проєкту, межі обсягу, ліміти розрахунків та посилання на джерела наведено в специфікації проєкту.",
            )}
          </span>
          <div style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
            <Link
              to="/spec"
              className="partner-spec-link"
              style={{ fontWeight: 700, textDecoration: "underline", color: "var(--primary)" }}
            >
              {text("Open specification (ISRM_Project_Description.md) ↗", "Відкрити специфікацію (ISRM_Project_Description.md) ↗")}
            </Link>
            <span style={{ color: "var(--muted-foreground)" }}>·</span>
            <Link
              to="/partner"
              style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", textDecoration: "underline" }}
            >
              {text("Partner access", "Вхід для партнерів")}
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
