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

      {/* ── Section 03: Four Strategic Scopes & Path to Network Expertise ── */}
      <section aria-labelledby="client-consulting-heading" style={{ marginTop: "4.5rem" }}>
        <div className="partner-section-heading" style={{ margin: "3.5rem 0 2.5rem" }}>
          <span>03</span>
          <div>
            <h2 id="client-consulting-heading">
              {text(
                "Four Strategic Scopes on the Path to Building Network Expertise",
                "Чотири внутрішні напрями робіт на шляху до побудови мережевої експертизи",
              )}
            </h2>
            <p className="partner-body" style={{ marginTop: "0.75rem", lineHeight: "1.7", fontSize: "1.05rem", color: "#132a22" }}>
              {text(
                "The essential institutional value of external strategic advisory lies in delivering uncompromised objectivity, cross-sector benchmarking, and an independent perspective unencumbered by internal corporate inertia. Rather than concluding as abstract advisory reports, these four sequential scopes operationalise collective capacity into practical digital workflows, collegiate trust, and sustainable institutional outcomes.",
                "Інституційна цінність зовнішнього стратегічного консалтингу полягає у забезпеченні бездоганної об'єктивності, міжгалузевого бенчмаркінгу та незалежного погляду, вільного від внутрішньокорпоративної інерції. Вироблені рішення не залишаються декларативними звітами, а трансформуються у прикладний технологічний інструментарій та чотири вивірені напрями робіт, що забезпечують системний розвиток ком'юніті.",
              )}
            </p>
          </div>
        </div>

        {/* ── The 4 Strategic Scopes in Prescribed Sequence ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          {/* Scope 1: MVP Application */}
          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid rgba(11, 84, 76, 0.25)",
              borderTop: "4px solid #064e3b",
              borderRadius: "10px",
              padding: "1.5rem",
              boxShadow: "0 6px 16px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#c8901a",
                  fontWeight: 800,
                  display: "block",
                  marginBottom: "0.4rem",
                }}
              >
                {text("Scope 1 · Core Asset", "Напрям 1 · Базовий актив")}
              </span>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#064e3b", margin: "0 0 0.75rem" }}>
                {text("MVP Application & Peer Capital", "MVP застосунку: Базовий інструмент")}
              </h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "#2d4a3e", margin: 0 }}>
                {text(
                  "A concrete foundational instrument for orchestrating network expertise: establishing horizontal peer links, mobilizing collective human capital, maintaining a curated case repository, and automating the workflow from peer inquiry to media resonance. Delivers immediate institutional dividends: cross-practice referrals, client origination pooling, enhanced collective bargaining, and mentorship architectures that secure member retention.",
                  "Конкретний базовий інструмент для роботи з мережею: прокладання горизонтальних зв'язків між фахівцями, мобілізація людського капіталу (peer capital), бібліотека верифікованих кейсів та автоматизація воркфлоу від експертного запиту до згадок у пресі з оцінкою якості комунікацій. Створює передумови наставництва та забезпечує дивіденди кращих практик професійних NGO: перехресні продажі, бізнес-реферали, спільний пул замовлень, посилення ринкової ваги та підвищення retention членів.",
                )}
              </p>
            </div>
            <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px dashed rgba(11, 84, 76, 0.15)", fontSize: "0.8rem", color: "#064e3b", fontWeight: 600 }}>
              {text("Status: Self-contained functional MVP", "Статус: Самостійний завершений MVP")}
            </div>
          </div>

          {/* Scope 2: Optional Expert Pilot */}
          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid rgba(11, 84, 76, 0.25)",
              borderTop: "4px solid #c8901a",
              borderRadius: "10px",
              padding: "1.5rem",
              boxShadow: "0 6px 16px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#c8901a",
                  fontWeight: 800,
                  display: "block",
                  marginBottom: "0.4rem",
                }}
              >
                {text("Scope 2 · Advisory Sharing", "Напрям 2 · Шеринг досвіду")}
              </span>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#064e3b", margin: "0 0 0.75rem" }}>
                {text("Optional Expert Pilot & Engagement Cycle", "Опційний експертний пілот: Цикл залучення")}
              </h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "#2d4a3e", margin: 0 }}>
                {text(
                  "Structuring the professional agenda, convening sector roundtables, synthesising monographs, and planning strategic outreach across secondary networks of member followers. Offered as an open sharing of advisory expertise: we can deepen into these dimensions once the foundational tooling (MVP) is operational and we have cultivated an aligned understanding of the Institute's priorities and conceptual principles. The Institute may utilise this framework autonomously or engage targeted advisory support to co-develop formal project documentation.",
                  "Формування адженди, проведення фахових обговорень, створення аналітичних матеріалів та планування кампанії охоплення із залученням вторинних мереж фоловерів членів асоціації для максимального резонансу. Це бачення пропонується як відкритий шеринг експертизи: ми можемо поглиблюватися в ці напрями тоді, коли матимемо відповідний інструментарій (діюче ядро MVP) та напрацьоване спільне розуміння пріоритетів і концептуальних засад інституту. Інститут може вільно користуватись фреймворком на свій розсуд або залучити консультантів для розвитку концепту в проєктну документацію.",
                )}
              </p>
            </div>
            <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px dashed rgba(11, 84, 76, 0.15)", fontSize: "0.8rem", color: "#c8901a", fontWeight: 600 }}>
              {text("Status: Advisory option at Board's discretion", "Статус: Опція на розсуд Правління")}
            </div>
          </div>

          {/* Scope 3: Strategic Consulting & Diagnostic */}
          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid rgba(11, 84, 76, 0.25)",
              borderTop: "4px solid #064e3b",
              borderRadius: "10px",
              padding: "1.5rem",
              boxShadow: "0 6px 16px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#c8901a",
                  fontWeight: 800,
                  display: "block",
                  marginBottom: "0.4rem",
                }}
              >
                {text("Scope 3 · Vision & Advisory", "Напрям 3 · Стратегія та діагностика")}
              </span>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#064e3b", margin: "0 0 0.75rem" }}>
                {text("Strategic Consulting & Think Tank Vision", "Стратегічний консалтинг і візія Think Tank")}
              </h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "#2d4a3e", margin: 0 }}>
                {text(
                  "For leadership seeking to institutionalise foresight: defining trajectory priorities, mapping emerging competency vectors, and establishing a reputable international Think Tank. Crucially, before executing any expansion, configuring the service catalog provides essential diagnostic self-awareness for the Institute, illuminating institutional boundaries and guiding a precisely tailored advisory engagement.",
                  "Спільна робота над візією майбутнього, напрямами розвитку актуальної експертизи та створенням повноцінного інституційного Think Tank. Принципова передумова: попередня конфігурація сервісів є ефективною самодіагностикою для асоціації, яка дозволяє оцінити внутрішні спроможності та чітко сформувати tailor-made запит з урахуванням ресурсних обмежень.",
                )}
              </p>
            </div>
            <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px dashed rgba(11, 84, 76, 0.15)", fontSize: "0.8rem", color: "#064e3b", fontWeight: 600 }}>
              {text("Status: Diagnostic-led strategic partnership", "Статус: Діагностика та стратегічний діалог")}
            </div>
          </div>

          {/* Scope 4: Long-Term Horizon, SaaS & Trust Index */}
          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid rgba(11, 84, 76, 0.25)",
              borderTop: "4px solid #c8901a",
              borderRadius: "10px",
              padding: "1.5rem",
              boxShadow: "0 6px 16px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#c8901a",
                  fontWeight: 800,
                  display: "block",
                  marginBottom: "0.4rem",
                }}
              >
                {text("Scope 4 · Future Horizon", "Напрям 4 · Віддалена перспектива")}
              </span>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#064e3b", margin: "0 0 0.75rem" }}>
                {text("SaaS Scale & Trust & Influence Index", "Масштабування, SaaS та індекс TII")}
              </h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "#2d4a3e", margin: 0 }}>
                {text(
                  "Long-term trajectories: evolving from internal workflows into a public SaaS platform for specialized advisory networks and participating in major cross-disciplinary commissions. Anchored by the Trust & Influence Index (TII) as an operational hypothesis built on whole governance: convening members with distinguished non-member practitioners, opening professional deliberations, and fostering digital trust in peer decisions augmented by AI — producing an unambiguous map of expertise coverage and network assets.",
                  "Широкі перспективи подальшого розвитку: від створення відкритої SaaS-платформи для експертів і консультантів до участі у масштабних міжгалузевих проектах. Стрижнем концепції виступає Trust & Influence Index (TII) як робоча гіпотеза за принципами whole governance: об'єднання членів асоціації з кращими зовнішніми практиками, відкритість професійних процесів, подолання міряння гонорарами та побудова цифрової довіри до рішень колег разом із ШІ, що дає чітке бачення покритого експертного поля.",
                )}
              </p>
            </div>
            <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px dashed rgba(11, 84, 76, 0.15)", fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>
              {text("Status: Post-pilot evolutionary horizon", "Статус: Пост-пілотне масштабування")}
            </div>
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
          <Button asChild variant="default" className="button-outline text-base px-8 py-5 shadow-lg">
            <Link to="/scope">{text("Examine scope & budget →", "Переглянути обсяг і ціну →")}</Link>
          </Button>
        </div>

        <div className="partner-footer-actions" style={{ marginTop: "1.75rem", textAlign: "center" }}>
          <span style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.82rem", color: "var(--muted-foreground)" }}>
            {text(
              "Comprehensive project context, governance boundaries, budgetary limits, and source citations are available in the full project brief.",
              "Повний контекст проєкту, межі обсягу, ліміти розрахунків та посилання на джерела наведено у повному описі проєкту.",
            )}
          </span>
          <div style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
            <a
              href="/ISRM_Project_Description.md"
              download="ISRM_Project_Description.md"
              className="partner-spec-link"
              style={{ fontWeight: 700, textDecoration: "underline", color: "var(--primary)" }}
            >
              {text("Download full project brief (.md) ↓", "Завантажити повний опис (.md) ↓")}
            </a>
            <span style={{ color: "var(--muted-foreground)" }}>·</span>
            <Link
              to="/partner"
              style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", textDecoration: "underline" }}
            >
              {text("Partner portal access", "Вхід для партнерів")}
            </Link>
          </div>
          <p style={{ marginTop: "1.25rem", fontSize: "0.75rem", color: "var(--muted-foreground)", letterSpacing: "0.03em" }}>
            {text(
              "Prepared for Chairman & Board Review · October 2026 · Strictly Confidential",
              "Підготовлено для перегляду Головою та Правлінням · Жовтень 2026 · Конфіденційно",
            )}
          </p>
        </div>
      </footer>
    </>
  );
}
