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
            <div className="cycle-tl-row" key={node.id}>
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

        <p className="partner-muted" style={{ fontSize: "0.78rem", marginTop: "0.75rem" }}>
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

        <div className="client-pilot-grid" style={{ display: "grid", gap: "1rem" }}>
          {[
            {
              title: text("Map network expertise & gaps", "Картувати мережеву експертизу та прогалини"),
              detail: text(
                "Establish the current state of network expertise, surface gaps, open sector and territory discussions.",
                "Визначити поточний стан мережевої експертизи, виявити gaps, відкрити обговорення за секторами та територіями.",
              ),
            },
            {
              title: text("Critical path & leadership campaign", "Критичний шлях і лідерська кампанія"),
              detail: text(
                "Build the critical path, run the leadership campaign, and maintain rigorous standards within trusted consultancy boundaries.",
                "Побудувати критичний шлях, провести лідерську кампанію та утримувати високі стандарти в зоні trusted consultancy.",
              ),
            },
            {
              title: text("Board alignment & trusted decisions", "Підготовка борду та довірені рішення"),
              detail: text(
                "Translate research, market evidence and practitioner feedback into actionable board mandates, governance limits and client offerings.",
                "Перетворення аналітики, ринкових доказів та відгуків практиків на чіткі мандати борду, правила управління та клієнтські пропозиції.",
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

      {/* DEDICATED BLOCK: Trust & Influence Index (ALWAYS written in full, no acronyms) */}
      <section aria-labelledby="tii-spine-heading" style={{ marginTop: "3.5rem" }}>
        <div
          style={{
            border: "1.5px solid var(--brass, #c8901a)",
            borderRadius: "12px",
            padding: "2rem",
            background: "color-mix(in oklab, var(--brass, #c8901a) 8%, var(--card, #f2eadb))",
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "0.25rem 0.6rem",
                borderRadius: "4px",
                background: "var(--brass, #c8901a)",
                color: "#fff",
              }}
            >
              {text("Strategic Anchor", "Стратегічний стрижень")}
            </span>
            <h2 id="tii-spine-heading" style={{ fontSize: "1.35rem", fontWeight: 700, margin: 0, color: "var(--color-foreground)" }}>
              {text("Trust & Influence Index", "Trust & Influence Index")}
            </h2>
          </div>
          <p
            style={{
              fontSize: "1.08rem",
              lineHeight: 1.65,
              color: "var(--color-foreground)",
              fontWeight: 500,
            }}
          >
            {text(
              "Trust & Influence Index is the spine of the strategy — a composite balance of publications, successful cases, solution level, research, professional interaction and recommendations. It is co-designed with the client before any score is calculated.",
              "Trust & Influence Index — це стрижень стратегії: композитний баланс публікацій, успішних кейсів, рівня рішень, досліджень, професійної взаємодії та рекомендацій. Він розробляється спільно із замовником до будь-якого розрахунку балу.",
            )}
          </p>
          <p className="partner-muted" style={{ marginTop: "1rem", fontSize: "0.85rem", lineHeight: 1.5 }}>
            {text(
              "Evidence before labels: Attribution rules, verified case criteria and peer validation protocols are established collectively to ensure professional integrity across all sectors and jurisdictions.",
              "Докази перед мітками: Правила атрибуції, критерії перевірених кейсів і протоколи експертної взаємодії узгоджуються колегіально для гарантії професійної доброчесності за всіма секторами та юрисдикціями.",
            )}
          </p>
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
            style={{
              fontSize: "0.7rem",
              color: "var(--color-muted-foreground)",
              opacity: 0.4,
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
            }}
            aria-label="Service configurator — partner access only"
          >
            {text("service configurator", "конфігуратор сервісу")}
          </Link>
        </p>
      </footer>
    </>
  );
}
