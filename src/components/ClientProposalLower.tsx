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
                  en: "Sector and territory conferences. Almanac, speakers, tickets and follow-up into the next cycle.",
                  uk: "Конференції за секторами та територіями. Альманах, доповідачі, квитки й повернення в наступний цикл.",
                },
                revenue: {
                  en: "Paid conference tickets. Almanac distribution. New followers enter the cycle.",
                  uk: "Оплачувані квитки на конференцію. Розповсюдження альманаху. Нові фоловери входять у цикл.",
                },
                funnel: {
                  value: "8,742",
                  note: {
                    en: "LinkedIn Page followers · source pool each cycle",
                    uk: "підписники LinkedIn Page · вихідний пул кожного циклу",
                  },
                },
              },
            ] as const
          ).map((node, i, arr) => (
            <div key={node.id} className="cycle-timeline-row">
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

      <section aria-labelledby="client-consulting-heading" style={{ marginTop: "4rem" }}>
        <div className="partner-section-heading" style={{ margin: "4rem 0" }}>
          <span>03</span>
          <div>
            <h2 id="client-consulting-heading">
              {text(
                "Consulting & strategy · Trust and Influence Index",
                "Консалтинг і стратегія · Trust and Influence Index",
              )}
            </h2>
            <p>
              {text(
                "TII is the spine of the strategy — a composite balance of publications, successful cases, solution level, research, professional interaction and recommendations. It is co-designed with the client before any score is calculated.",
                "TII — стрижень стратегії: композитний баланс публікацій, успішних кейсів, рівня рішень, досліджень, професійної взаємодії та рекомендацій. Розробляється спільно із замовником до будь-якого розрахунку балу.",
              )}
            </p>
          </div>
        </div>
        <div className="client-pilot-grid" style={{ display: "grid", gap: "0.75rem" }}>
          {[
            {
              title: text("Map network expertise", "Картувати мережеву експертизу"),
              detail: text(
                "Establish the current state of network expertise, surface gaps, open sector and territory discussions.",
                "Визначити поточний стан мережевої експертизи, виявити gaps, відкрити обговорення за секторами та територіями.",
              ),
            },
            {
              title: text("Critical path & campaign", "Критичний шлях і кампанія"),
              detail: text(
                "Build the critical path, run the campaign, and keep work inside trusted consultancy boundaries.",
                "Побудувати критичний шлях, провести кампанію, утримувати роботу в зоні trusted consultancy.",
              ),
            },
            {
              title: text("Evidence before labels", "Докази перед мітками"),
              detail: text(
                "Co-design attribution rules with the client before computing any score or assigning any label.",
                "Спільно з клієнтом узгодити правила атрибуції до обчислення будь-якого балу чи присвоєння мітки.",
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
