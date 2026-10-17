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
                "The Expert Engagement Cycle — Sustained Growth Through Network Dynamics",
                "Цикл залучення експертів — як мережа розвивається сама",
              )}
            </h2>
            <p>
              {text(
                "This architecture represents a continuous operational cycle rather than a linear sequence. Each stage enriches the subsequent phase before returning to reinforce the foundation. The MVP platform provides the operational surface to render this cycle transparent, auditable, and measurable.",
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
                  en: "Engage distinguished fellows and active members. Shape the institutional agenda around critical expertise gaps, active engagements, and sector priorities.",
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
                  en: "Convene expert colloquia and sector roundtables. Record individual contributions as attributable intellectual evidence.",
                  uk: "Проводьте експертні обговорення та секторні круглі столи. Фіксуйте внески як атрибутовані докази.",
                },
                revenue: {
                  en: "Colloquium proceedings translate directly into authoritative reports, monographs, and demonstrable value for members and institutional clients.",
                  uk: "Результати обговорень стають звітами, публікаціями та цінністю для членів та клієнтів.",
                },
                funnel: null as { value: string; note: { en: string; uk: string } } | null,
              },
              {
                id: "publish",
                icon: "📄",
                action: {
                  en: "Synthesise proceedings into rigorous reports and formal publications, distributed across the fellowship and key institutional stakeholders.",
                  uk: "Перетворюйте стенограми на звіти й публікації. Розповсюджуйте серед членів і ширшого кола.",
                },
                revenue: {
                  en: "Thought leadership monographs and authoritative publications emerging from working group deliberations.",
                  uk: "Лідерство думок і відкриті публікації з результатів робочих груп.",
                },
                funnel: null,
              },
              {
                id: "audience",
                icon: "📣",
                action: {
                  en: "Extend institutional visibility across the professional community with each successive cycle of thought leadership.",
                  uk: "Досягайте аудиторії LinkedIn Page з кожним циклом видимості.",
                },
                revenue: {
                  en: "Subscribed fellowship memberships and high-calibre conference delegations drawn from this engaged professional cohort.",
                  uk: "Платні членства та відвідування конференції з того ж пулу аудиторії.",
                },
                funnel: {
                  value: "~52 / ~43",
                  note: {
                    en: "Paid memberships ≈ 8,742 × 2% × 30% ≈ 52 · Conference ≈ 8,742 × 2% × 25% ≈ 43 (planning benchmarks)",
                    uk: "Платні членства ≈ 8 742 × 2% × 30% ≈ 52 · Конференція ≈ 8 742 × 2% × 25% ≈ 43 (планувальні орієнтири)",
                  },
                },
              },
              {
                id: "conference",
                icon: "🎤",
                action: {
                  en: "Deliver national, regional, and sector-specific conferences. Present the fellowship's scholarship, publish the annual synthesis report, and inaugurate the succeeding cycle.",
                  uk: "Проводьте секторальні, галузеві, регіональні, національні конференції. Презентуйте роботу членів, випускайте підсумковий звіт і відкривайте наступний цикл.",
                },
                revenue: {
                  en: "Conference delegation fees, institutional sponsorships, and advanced membership subscriptions.",
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
            "Conversion benchmarks (indicative planning estimates, not ISRM forecasts): Higher Logic Association Community Report · LinkedIn B2B engagement lower band (~2%) · voluntary association free-to-paid / apply-to-accepted benchmarks (~25–30%) · ASAE member onboarding precedents.",
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
                "Strategic Consulting on the Path to Building Network Expertise",
                "Стратегічний консалтинг на шляху до побудови мережевої експертизи",
              )}
            </h2>
            <p className="partner-body" style={{ marginTop: "0.75rem", lineHeight: "1.65", fontSize: "1.05rem", color: "#132a22" }}>
              {text(
                "The essential institutional value of external strategic consulting lies in delivering uncompromised objectivity, cross-sector benchmarking, and an independent perspective unencumbered by internal corporate inertia. The strategic formulations developed do not conclude as abstract advisory reports; rather, they are directly operationalised into practical digital instruments and ongoing workflows that sustain the organisation throughout post-consulting implementation.",
                "Інституційна цінність зовнішнього стратегічного консалтингу полягає у забезпеченні бездоганної об'єктивності, міжгалузевого бенчмаркінгу та незалежного погляду, вільного від внутрішньокорпоративної інерції. Вироблені рішення не залишаються декларативними звітами, а трансформуються у прикладний технологічний інструментарій та цифрові робочі процеси, що забезпечують безперервний пост-консалтинговий супровід організації.",
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
                "Council and Board members establish statutory governance and perimeters; recognised sector leaders direct specialised inquiry tracks; verified fellows provide empirical case evidence; and dedicated coordinators orchestrate knowledge synthesis.",
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
                "A calibrated capacity matrix, proven client portfolios with verifiable outcomes, transparent fee apportionment protocols, active inter-practice referral channels, and interactive risk dashboards informing executive governance.",
                "Дієва матриця капасіті, портфоліо клієнтів із виміряними результатами, прозора модель розподілу гонорарів, активні реферальні ланцюги та інтерактивні дашборди для підтримки управлінських рішень.",
              )}
            </p>
          </div>
        </div>

        {/* ── Two Equal-Height Companion Pillars: Consulting Sequence & Trust & Influence Index ── */}
        <div className="consulting-pillars-grid">
          {/* Pillar 1: Consulting Project Sequence (9 Steps) */}
          <div
            style={{
              border: "2px solid rgba(11, 84, 76, 0.25)",
              borderRadius: "14px",
              padding: "2rem",
              background: "#ffffff",
              boxShadow: "0 10px 32px rgba(18, 60, 58, 0.06)",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
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
                  background: "#064e3b",
                  color: "#ffffff",
                  boxShadow: "0 2px 6px rgba(6, 78, 59, 0.3)",
                }}
              >
                {text("Developmental Pathway", "Шлях розвитку")}
              </span>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "#064e3b", letterSpacing: "-0.01em" }}>
                {text("Consulting Project Sequence", "Послідовність проєкту")}
              </h3>
            </div>

            <p style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "#2d4a3e", marginBottom: "1.25rem" }}>
              {text(
                "A structured nine-stage evolution transitioning from established individual advisory engagements to an internationally respected, network-based Think Tank.",
                "Структурована дев'ятикрокова траєкторія: від успішної індивідуальної експертної практики до формування самостійного міжнародного Think Tank.",
              )}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1, justifyContent: "space-between" }}>
              {[
                {
                  num: "01",
                  title: text("Established Member Practice", "Успішна практика членів"),
                  desc: text(
                    "Originating from substantiated individual advisory and analytical practices of distinguished members.",
                    "Від успішної консалтингової чи експертної практики діючих членів асоціації.",
                  ),
                },
                {
                  num: "02",
                  title: text("Network Expertise & AI Augmentation", "Мережева експертиза та ШІ"),
                  desc: text(
                    "Synthesising collective network expertise, augmented by AI-driven empirical data enrichment and predictive modelling.",
                    "Створення мережевої експертизи, яка аналізується з покращенням даних та прогнозів за допомогою ШІ.",
                  ),
                },
                {
                  num: "03",
                  title: text("Mutual Collegiate Trust", "Побудова взаємної довіри"),
                  desc: text(
                    "Cultivating profound professional trust and mutual confidence between lead consultants and specialised practitioners.",
                    "Побудова взаємної довіри між консультантами та профільними експертами асоціації.",
                  ),
                },
                {
                  num: "04",
                  title: text("Mandate Origination & Multidisciplinary Panels", "Оріджинейшн проєктів"),
                  desc: text(
                    "Originating a robust pipeline of institutional mandates, delivered by bespoke, multidisciplinary member panels.",
                    "Оріджинейшн пулу проєктів із збірними міжгалузевими командами членів асоціації.",
                  ),
                },
                {
                  num: "05",
                  title: text("Equitable Remuneration & Fee Apportionment", "Справедливе сплітування гонорарів"),
                  desc: text(
                    "Formulating a transparent, merit-based fee apportionment framework across origination, technical delivery, and peer review.",
                    "Розробка справедливого та прозорого сплітування гонорарів між лідерами, виконавцями та рев'юерами.",
                  ),
                },
                {
                  num: "06",
                  title: text("Verified Institutional Portfolio", "Портфоліо задоволених клієнтів"),
                  desc: text(
                    "Curating a portfolio of benchmark client engagements demonstrating measurable impact and durable decision architectures.",
                    "Побудова портфоліо клієнтів, які отримали очікуваний досвід та високий рівень дієвих рішень.",
                  ),
                },
                {
                  num: "07",
                  title: text("Inter-Practice Referrals & Advisory Expansion", "Перехресні продажі та реферали"),
                  desc: text(
                    "Establishing structured cross-practice referrals and expanding advisory engagements across adjacent institutional disciplines.",
                    "Запуск перехресних продажів суміжних послуг та дієвої реферальної системи між практиками.",
                  ),
                },
                {
                  num: "08",
                  title: text("Sectoral Intelligence Digests & Dashboards", "Аналітичні дайджести й дашборди"),
                  desc: text(
                    "Publishing authoritative quarterly intelligence digests and interactive telemetry dashboards for senior decision-makers.",
                    "Формування аналітичних дайджестів та інтерактивних дашбордів за секторами консультантів.",
                  ),
                },
                {
                  num: "09",
                  title: text("Institutional Network-Based Think Tank", "Network-based Think Tank"),
                  desc: text(
                    "Crystallising the fellowship's collective intelligence into a permanent, internationally respected Think Tank.",
                    "Утворення самодостатнього, авторитетного інституційного Network-based Think Tank.",
                  ),
                },
              ].map((step) => (
                <div
                  key={step.num}
                  style={{
                    background: "rgba(242, 234, 219, 0.35)",
                    border: "1px solid rgba(11, 84, 76, 0.12)",
                    borderRadius: "7px",
                    padding: "0.6rem 0.85rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.2rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.45rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.8rem",
                        fontWeight: 800,
                        color: "#c8901a",
                      }}
                    >
                      {step.num}
                    </span>
                    <strong style={{ fontSize: "0.88rem", color: "#064e3b" }}>{step.title}</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.78rem", lineHeight: 1.45, color: "#2d4a3e" }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pillar 2: Trust & Influence Index & Composite Balance */}
          <div
            style={{
              border: "2px solid var(--brass, #c8901a)",
              borderRadius: "14px",
              padding: "2rem",
              background: "color-mix(in oklab, var(--brass, #c8901a) 10%, var(--card, #f5ede0))",
              boxShadow: "0 10px 32px rgba(18, 60, 58, 0.08)",
              display: "flex",
              flexDirection: "column",
              height: "100%",
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
                {text("Strategic Framework", "Пропозиція індексу")}
              </span>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "#064e3b", letterSpacing: "-0.01em" }}>
                {text("Trust & Influence Index", "Trust & Influence Index")}
              </h3>
            </div>

            {/* Critique of nominal rankings */}
            <p
              style={{
                fontSize: "0.92rem",
                lineHeight: 1.6,
                color: "#132a22",
                marginBottom: "1.25rem",
              }}
            >
              {text(
                "Transcending nominal industry rankings: Contemporary advisory markets are inundated with superficial honours and closed directories that merely denote membership in an exclusive fraternity. ISRM supersedes subjective badges with a multi-dimensional, fact-based appraisal of verifiable competence, substantiated by empirical case evidence and rigorous collegiate scrutiny.",
                "Подолання номінальних ренкінгів: Ринок консалтингу переповнений відзнаками, каталогами та нагородами, які спираються виключно на формальну належність до тієї чи іншої закритої групи, і лише випадково торкаються об'єктивної оцінки успішності практики. На противагу цьому, Trust & Influence Index забезпечує дійсний, всебічний аналіз ситуації, спираючись на реальні підтвердження фактів, вимірювані результати та багаторівневу перевірку.",
              )}
            </p>

            {/* Composite Balance of Factors */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <h4
                style={{
                  fontSize: "0.82rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 800,
                  color: "#064e3b",
                  marginBottom: "0.75rem",
                }}
              >
                {text("Composite Balance of Assessment Factors", "Композитний баланс факторів оцінки")}
              </h4>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                {[
                  {
                    label: text("Publications & Citations", "Публікації та цитування"),
                    note: text("Scholarly papers, institutional almanacs, sector intelligence, and authoritative citations", "Аналітичні звіти, альманахи, фахові статті та цитування в медіа"),
                  },
                  {
                    label: text("Substantiated Case Evidence", "Підтверджені успішні кейси"),
                    note: text("Documented client engagements with rigorously verifiable outcomes", "Реалізовані проєкти з підтвердженими фактами досягнутих результатів"),
                  },
                  {
                    label: text("Scale & Complexity of Resolved Challenges", "Масштаб та комплексність вирішених задач"),
                    note: text("Enterprise architectures, critical national infrastructure, and high-consequence risk environments", "Рівень архітектури, масштаб рішень та системна складність подоланих викликів"),
                  },
                  {
                    label: text("Applied Research & Analytical Modelling", "Прикладні дослідження та моделювання"),
                    note: text("Proprietary methodology development, stress-testing protocols, and predictive risk modelling", "Розробка авторських методик, стрес-тестування та моделювання ризиків"),
                  },
                  {
                    label: text("AI OSINT Verification & Empirical Fact-Checking", "ШІ OSINT перевірка: збір фактів впливу"),
                    note: text("Algorithmic evidence harvesting establishing tangible impact on the client organisation", "Збір підтверджень та фактів дійсного впливу пропонованих рішень на об'єкт консалтингу"),
                  },
                  {
                    label: text("Council, Board & Collegiate Peer Review", "Оцінка правління та колег"),
                    note: text("Formal peer validation, ethical compliance review, and Board-level endorsement", "Колегіальна оцінка фахівцями, етичний комплаєнс та валідація Правлінням"),
                  },
                  {
                    label: text("Client Endorsements & Market Standing", "Рекомендації клієнтів та відгуки ринку"),
                    note: text("Attributed testimonials from institutional buyers and reputable counterparties", "Атрибутовані відгуки замовників, партнерів та інституційні рекомендації"),
                  },
                ].map((factor) => (
                  <div
                    key={factor.label}
                    style={{
                      background: "rgba(255, 255, 255, 0.95)",
                      borderLeft: "4px solid #064e3b",
                      borderRadius: "0 7px 7px 0",
                      padding: "0.6rem 0.85rem",
                      border: "1px solid rgba(6, 78, 59, 0.15)",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
                    }}
                  >
                    <strong style={{ display: "block", fontSize: "0.88rem", color: "#064e3b", marginBottom: "0.2rem" }}>
                      {factor.label}
                    </strong>
                    <span style={{ fontSize: "0.78rem", color: "#2d4a3e", lineHeight: 1.4 }}>{factor.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <EntryFrame locale={locale} />

      {/* ── Footer ── */}
      <footer className="partner-footer">
        <div className="cta-bottom" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", alignItems: "center" }}>
          <Button asChild variant="default" className="button-outline text-base px-6 py-5 shadow-lg">
            <Link to="/scope">{text("Examine scope & budget →", "Переглянути обсяг і ціну →")}</Link>
          </Button>
          <Button asChild variant="outline" className="button-outline text-base px-6 py-5 border-primary/50 text-primary hover:bg-primary/10 shadow-md">
            <Link to="/partner">{text("Partner Configurator ↗", "Конфігуратор для партнерів ↗")}</Link>
          </Button>
        </div>

        <div className="partner-footer-actions" style={{ marginTop: "1.75rem", textAlign: "center" }}>
          <span style={{ display: "block", marginBottom: "0.5rem" }}>
            {text(
              "Comprehensive project context, governance boundaries, budgetary limits, and source citations are detailed within the formal specification.",
              "Повний контекст проєкту, межі обсягу, ліміти розрахунків та посилання на джерела наведено в специфікації проєкту.",
            )}
          </span>
          <div style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
            <Link
              to="/spec"
              className="partner-spec-link"
              style={{ fontWeight: 700, textDecoration: "underline", color: "var(--primary)" }}
            >
              {text("Consult formal specification (ISRM_Project_Description.md) ↗", "Відкрити специфікацію (ISRM_Project_Description.md) ↗")}
            </Link>
            <span style={{ color: "var(--muted-foreground)" }}>·</span>
            <Link
              to="/partner"
              style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", textDecoration: "underline" }}
            >
              {text("Partner portal access", "Вхід для партнерів")}
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
