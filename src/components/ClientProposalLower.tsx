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
                "Це цикл, а не послідовність. Кожен елемент живить наступний і повертається до початку. Застосунок MVP — поверхня, яка робить цикл видимим і вимірюваним.",
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
                  en: "Discussion outputs become reports, publications and member value.",
                  uk: "Результати обговорень стають звітами, публікаціями та цінністю для членів.",
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
                  en: "Thought leadership and free publications from working-group outputs.",
                  uk: "Thought leadership і безоплатні публікації з результатів робочих груп.",
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
                  en: "Deliver the sector conference. Showcase member work, release the findings report, and open the next cycle.",
                  uk: "Проводьте секторну конференцію. Презентуйте роботу членів, випускайте підсумковий звіт і відкривайте наступний цикл.",
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

      {/* Section 03: Consulting & Strategy */}
      <section aria-labelledby="client-consulting-heading" style={{ marginTop: "4rem" }}>
        <div className="partner-section-heading" style={{ margin: "4rem 0" }}>
          <span>03</span>
          <div>
            <h2 id="client-consulting-heading">
              {text(
                "Consulting & strategy",
                "Консалтинг і стратегія",
              )}
            </h2>
            <p className="partner-body" style={{ marginTop: "0.75rem", lineHeight: "1.6" }}>
              {text(
                "Strategic consulting aligns network capabilities with high-value outcomes. Reaching this stage starts with assessing the current state of network expertise, identifying structural gaps, initiating peer discussions, conducting research, mapping the critical path, and executing focused campaigns within a trusted consultancy perimeter.",
                "Стратегічний консалтинг узгоджує спроможність мережі з високою цінністю для партнерів і замовників. Досягнення цього етапу починається з оцінки базового стану мережевої експертизи, виявлення прогалин (gaps), фахових обговорень, досліджень, побудови критичного шляху та проведення цільових кампаній у зоні довіреного консалтингу.",
              )}
            </p>
          </div>
        </div>

        {/* EXPANDED STRATEGY ARCHITECTURE & TRUST & INFLUENCE INDEX */}
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
              {text("Strategic Anchor", "Стратегічний стрижень")}
            </span>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0, color: "#064e3b", letterSpacing: "-0.01em" }}>
              {text("Trust & Influence Index", "Trust & Influence Index")}
            </h3>
          </div>

          {/* Lead strategic description */}
          <p
            style={{
              fontSize: "1.12rem",
              lineHeight: 1.65,
              color: "#132a22",
              fontWeight: 600,
              marginBottom: "1.5rem",
            }}
          >
            {text(
              "Trust & Influence Index is the strategic spine of the network — an institutional magnet around which dozens and hundreds of risk professionals crystalize. How it is structured determines the network's commercial and reputational power: through sector discussions, territorial chapters, conferences, and demonstrable fee differentiation between ranked experts and unverified practitioners.",
              "Trust & Influence Index — це стратегічний стрижень мережі: інституційний магніт, навколо якого кристалізуються десятки й сотні професіоналів. Те, як він формується, визначає ринкову та репутаційну силу мережі: через секторні обговорення, територіальні хаби, конференції та наочну різницю в гонорарах між експертами з верифікованим рейтингом і практиками без нього.",
            )}
          </p>

          {/* Roadmap steps */}
          <div style={{ marginBottom: "2rem" }}>
            <h4
              style={{
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 800,
                color: "#064e3b",
                marginBottom: "0.85rem",
              }}
            >
              {text("Roadmap to Trusted Consultancy", "Шлях побудови довіреного консалтингу")}
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
              {[
                {
                  step: "01",
                  title: text("Map Expertise & Identify Gaps", "Картування експертизи та виявлення gaps"),
                  desc: text(
                    "Establish the baseline capability of current network members, surface critical gaps across industries and territories.",
                    "Визначити базовий стан наявної експертизи мережі, виявити критичні прогалини за секторами та територіями.",
                  ),
                },
                {
                  step: "02",
                  title: text("Open Sector & Territory Dialogue", "Секторні та територіальні обговорення"),
                  desc: text(
                    "Launch focused roundtables in critical infrastructure, banking, defense, and cyber, collecting attributable peer evidence.",
                    "Запустити фахові круглі столи в критичній інфраструктурі, банкінгу, безпеці та кібер, фіксуючи атрибутовані внески.",
                  ),
                },
                {
                  step: "03",
                  title: text("Applied Research & Case Vault", "Прикладні дослідження та база кейсів"),
                  desc: text(
                    "Convert transcripts and working group sessions into tangible publications, solution blueprints, and conference almanacs.",
                    "Перетворювати стенограми та сесії робочих груп у практичні звіти, архітектури рішень та альманахи конференцій.",
                  ),
                },
                {
                  step: "04",
                  title: text("Critical Path & Leadership Campaign", "Критичний шлях і лідерська кампанія"),
                  desc: text(
                    "Build the critical delivery path, execute thought leadership campaigns, and keep all engagements inside trusted boundaries.",
                    "Побудувати критичний шлях, провести кампанію лідерства думок та утримувати виконання у зоні trusted consultancy.",
                  ),
                },
                {
                  step: "05",
                  title: text("Fee Spread & Market Monetization", "Диференціація гонорарів і ринкова сила"),
                  desc: text(
                    "Showcase clear rate premiums for ranked experts vs unranked, driving active member retention and client trust.",
                    "Демонструвати вищу цінність і преміальні гонорари для експертів із рейтингом проти неперевірених, стимулюючи залучення.",
                  ),
                },
              ].map((item) => (
                <div
                  key={item.step}
                  style={{
                    background: "#ffffff",
                    borderRadius: "8px",
                    padding: "1rem 1.15rem",
                    border: "1px solid rgba(11, 84, 76, 0.18)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 800,
                        fontSize: "0.8rem",
                        color: "#c8901a",
                      }}
                    >
                      {item.step}
                    </span>
                    <strong style={{ fontSize: "0.95rem", color: "#064e3b" }}>{item.title}</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.85rem", lineHeight: 1.5, color: "#2d4a3e" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Composite Balance Factors */}
          <div>
            <h4
              style={{
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 800,
                color: "#064e3b",
                marginBottom: "0.85rem",
              }}
            >
              {text("Composite Balance of Factors", "Композитний баланс факторів оцінки")}
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {[
                { label: text("Publications", "Публікації"), note: text("Reports, almanacs, articles", "Звіти, альманахи, статті") },
                { label: text("Successful Cases", "Успішні кейси"), note: text("Verified deployed projects", "Підтверджені впроваджені кейси") },
                { label: text("Solution Level", "Рівень рішень"), note: text("Architectural complexity", "Складність і масштаб солюшинів") },
                { label: text("Applied Research", "Дослідження"), note: text("Empirical risk models", "Аналітичні та ризик-моделі") },
                { label: text("Peer Interaction", "Професійна взаємодія"), note: text("Working group validation", "Валідація колегами та робочими групами") },
                { label: text("Recommendations", "Рекомендації"), note: text("Client & sponsor endorsements", "Відгуки замовників та інституцій") },
              ].map((factor) => (
                <div
                  key={factor.label}
                  style={{
                    background: "rgba(255, 255, 255, 0.85)",
                    borderLeft: "3.5px solid #064e3b",
                    borderRadius: "0 6px 6px 0",
                    padding: "0.75rem 0.9rem",
                    border: "1px solid rgba(6, 78, 59, 0.15)",
                  }}
                >
                  <strong style={{ display: "block", fontSize: "0.9rem", color: "#064e3b", marginBottom: "0.2rem" }}>
                    {factor.label}
                  </strong>
                  <span style={{ fontSize: "0.78rem", color: "#3a564b" }}>{factor.note}</span>
                </div>
              ))}
            </div>
            <p
              style={{
                marginTop: "1.25rem",
                fontSize: "0.85rem",
                lineHeight: 1.55,
                color: "#1a382e",
                fontStyle: "italic",
                borderTop: "1px solid rgba(200, 144, 26, 0.3)",
                paddingTop: "0.85rem",
                margin: "1.25rem 0 0 0",
              }}
            >
              {text(
                "Evidence before labels: Attribution rules, case verification criteria, and peer validation protocols are established collectively with the client before computing any score or issuing ratings.",
                "Докази перед мітками: Правила атрибуції, критерії перевірки кейсів і протоколи колегіальної валідації узгоджуються спільно із замовником до обчислення будь-якого балу чи присвоєння рейтингу.",
              )}
            </p>
          </div>
        </div>
      </section>

      <EntryFrame locale={locale} />

      <footer className="partner-footer">
        <div className="cta-bottom">
          <Button asChild variant="default" className="button-outline">
            <Link to="/scope">{text("See scope & budget →", "Переглянути обсяг і ціну →")}</Link>
          </Button>
        </div>
        <div className="partner-footer-actions">
          <span>
            {text(
              "Full project context, scope boundaries, estimation limits and source links are in the project description.",
              "Повний контекст проєкту, межі обсягу, ліміти розрахунків та посилання на джерела наведено в описі проєкту.",
            )}
          </span>
          <a
            href="/ISRM_Project_Description.md"
            target="_blank"
            rel="noopener noreferrer"
            className="partner-spec-link"
          >
            {text("Open specification (ISRM_Project_Description.md) ↗", "Відкрити специфікацію (ISRM_Project_Description.md) ↗")}
          </a>
        </div>
      </footer>
    </>
  );
}
