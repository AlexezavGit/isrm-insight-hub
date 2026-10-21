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
                funnel: null,
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
                funnel: null,
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

      {/* ── Section 03: Four Scopes — Progressive Disclosure ── */}
      <section aria-labelledby="client-consulting-heading" style={{ marginTop: "4.5rem" }}>
        <div className="partner-section-heading" style={{ margin: "3.5rem 0 2.5rem" }}>
          <span>03</span>
          <div>
            <h2 id="client-consulting-heading">
              {text(
                "Sequence of solution installation — the technological arm for experts and consultants",
                "Послідовність інсталяції рішень — технологічного плеча для експертів та консультантів",
              )}
            </h2>
            <p className="partner-body" style={{ marginTop: "0.75rem", lineHeight: "1.7", fontSize: "1.05rem", color: "#132a22" }}>
              {text(
                "The decision today is simple: does the Institute want a working platform it can use from day one? Everything else — strategy, advisory, long-term vision — follows naturally once the foundation is in place and the Institute has formed its own priorities.",
                "Рішення сьогодні просте: чи хоче Інститут мати робочу платформу, якою можна користуватися з першого дня? Решта — стратегія, консалтинг, довгостроковий горизонт — виникає природно, коли фундамент стоїть і Інститут сформував власні пріоритети.",
              )}
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>

          {/* Scope 1 — decide today */}
          <div className="card-hanging" style={{ borderTopColor: "#064e3b", display: "flex", flexDirection: "column" }}>
            <span className="tech-label text-brass" style={{ display: "block", marginBottom: "0.4rem" }}>
              {text("Scope 1 · Decide today", "Напрям 1 · Рішення зараз")}
            </span>
            <h3 className="header-pressed" style={{ fontSize: "1.05rem", color: "var(--brass)", margin: "0 0 0.75rem" }}>
              {text("MVP — the working platform", "MVP — робоча платформа")}
            </h3>
            <p style={{ fontSize: "0.88rem", lineHeight: 1.65, color: "#2d4a3e", margin: "0 0 1rem", flex: 1 }}>
              {text(
                "A live expert graph with 178 contacts. Verified profiles, peer links, mandate-based panel assembly, evidence logging. Delivers value from the first day — no additional commitments required.",
                "Живий граф 178 контактів. Верифіковані профілі, горизонтальні зв'язки, збір проєктних груп за мандатом, облік внесків. Приносить цінність з першого дня — без жодних додаткових зобов'язань.",
              )}
            </p>
            <div style={{ paddingTop: "0.75rem", borderTop: "1px dashed rgba(11,84,76,0.15)", fontSize: "0.78rem", color: "#064e3b", fontWeight: 700 }}>
              ✓ {text("Live at isrm.pages.dev — inspect before committing", "Вже працює на isrm.pages.dev — перевірте перед рішенням")}
            </div>
          </div>

          {/* Scope 2 — when MVP is live */}
          <div className="card-hanging" style={{ borderTopColor: "#c8901a", display: "flex", flexDirection: "column", opacity: 0.96 }}>
            <span className="tech-label text-brass" style={{ display: "block", marginBottom: "0.4rem" }}>
              {text("Scope 2 · When MVP is live", "Напрям 2 · Коли MVP стоїть")}
            </span>
            <h3 className="header-pressed" style={{ fontSize: "1.05rem", color: "var(--brass)", margin: "0 0 0.75rem" }}>
              {text("Expert Engagement Cycle", "Цикл залучення експертів")}
            </h3>
            <p style={{ fontSize: "0.88rem", lineHeight: 1.65, color: "#2d4a3e", margin: "0 0 1rem", flex: 1 }}>
              {text(
                "Sector roundtables, published monographs, outreach to the ~11 000 LinkedIn network. Offered as an open advisory sharing — the Institute uses the framework autonomously, or engages further support if needed.",
                "Секторні круглі столи, публікації, охоплення мережі LinkedIn ~11 000. Пропонується як відкритий шеринг досвіду — Інститут використовує фреймворк самостійно або залучає підтримку за потреби.",
              )}
            </p>
            <div style={{ paddingTop: "0.75rem", borderTop: "1px dashed rgba(11,84,76,0.12)", fontSize: "0.78rem", color: "#c8901a", fontWeight: 600 }}>
              {text("Optional — at Board's discretion", "Опція — на розсуд Правління")}
            </div>
          </div>

          {/* Scope 3 — at your request */}
          <div className="card-hanging" style={{ borderTopColor: "#064e3b", display: "flex", flexDirection: "column", opacity: 0.94 }}>
            <span className="tech-label text-brass" style={{ display: "block", marginBottom: "0.4rem" }}>
              {text("Scope 3 · At your request", "Напрям 3 · За вашим запитом")}
            </span>
            <h3 className="header-pressed" style={{ fontSize: "1.05rem", color: "var(--brass)", margin: "0 0 0.75rem" }}>
              {text("Strategic Advisory — diagnostic first", "Стратегічний шеринг досвіду — спочатку діагностика")}
            </h3>
            <p style={{ fontSize: "0.88rem", lineHeight: 1.65, color: "#2d4a3e", margin: "0 0 1rem", flex: 1 }}>
              {text(
                "Configuring the service catalogue is itself the diagnostic: the Institute sees its own gaps. Strategic advisory, governance facilitation, and methodology design follow only when the Institute decides it needs them — on its own terms.",
                "Конфігурація каталогу сервісів є самою діагностикою: Інститут бачить власні прогалини. Стратегічний шеринг досвіду, фасилітація врядування та розробка методологій слідують лише тоді, коли Інститут вирішить, що вони потрібні — на власних умовах.",
              )}
            </p>
            <div style={{ paddingTop: "0.75rem", borderTop: "1px dashed rgba(11,84,76,0.1)", fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>
              {text("Engaged only after diagnostic self-assessment", "Залучається лише після самодіагностики")}
            </div>
          </div>

          {/* Scope 4 — future horizon */}
          <div className="card-hanging" style={{ borderTopColor: "rgba(200,144,26,0.5)", display: "flex", flexDirection: "column", opacity: 0.9, background: "rgba(242,234,219,0.55)" }}>
            <span className="tech-label text-brass" style={{ display: "block", marginBottom: "0.4rem", opacity: 0.85 }}>
              {text("Scope 4 · If it resonates", "Напрям 4 · Якщо відгукується")}
            </span>
            <h3 className="header-pressed" style={{ fontSize: "1.05rem", color: "var(--brass)", margin: "0 0 0.75rem", opacity: 0.9 }}>
              {text("Long-term horizon", "Довгостроковий горизонт")}
            </h3>
            <p style={{ fontSize: "0.88rem", lineHeight: 1.65, color: "#2d4a3e", margin: "0 0 1rem", flex: 1 }}>
              {text(
                "When the network is active and delivering its first results — scaling, SaaS, broader commissions. This is the direction, not the destination for today.",
                "Коли мережа активна і дає перші результати — масштабування, SaaS, ширші комісії. Це напрямок, а не сьогоднішня мета.",
              )}
            </p>
            <div style={{ paddingTop: "0.75rem", borderTop: "1px dashed rgba(11,84,76,0.08)", fontSize: "0.78rem", color: "#94a3b8", fontWeight: 500 }}>
              {text("Post-pilot — only when the foundation delivers", "Після пілоту — тільки коли фундамент працює")}
            </div>
          </div>

        </div>

      </section>



      {/* ── Project Group (not "team") — per user spec: 'не називати командою' ── */}
      <section className="mt-12" aria-labelledby="contributors-heading">
        <div className="partner-section-heading" style={{ margin: '3rem 0 2rem' }}>
          <span>★</span>
          <div>
            <h2 id="contributors-heading">
              {text("Project Group", "Проектна група")}
            </h2>
            <p>{text("Specialists engaged for this proposal", "Фахівці, залучені до підготовки пропозиції")}</p>
          </div>
        </div>
        {/* All 5 cards in one row on wide screens */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.75rem' }}>
          {/* 1. Frishberg — Supervisor + logo */}
          <div className="card-hanging" style={{ padding: '1.25rem', borderLeft: '4px solid #c8901a', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c8901a', fontWeight: 800, marginBottom: '0.3rem' }}>
              {text("Supervisor", "Супервайзер")}
            </p>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#064e3b', margin: '0 0 0.4rem', textAlign: 'center' }}>
              {text("Alex Frishberg", "Алекс Фрішберг")}
            </h3>
            <p style={{ fontSize: '0.78rem', lineHeight: 1.5, color: '#2d4a3e', margin: 0, textAlign: 'center' }}>
              {text("Proposal submitted on his behalf.", "Пропозиція подається від його імені.")}
            </p>
          </div>
          {/* 2. Filimonov — Head & OSINT */}
          <div className="card-hanging" style={{ padding: '1.25rem', borderLeft: '4px solid #c8901a' }}>
            <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c8901a', fontWeight: 800, marginBottom: '0.3rem' }}>
              {text("Head & OSINT", "Керівник та OSINT")}
            </p>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#064e3b', margin: '0 0 0.4rem' }}>
              {text("Dmitriy Filimonov", "Дмитро Филімонов")}
            </h3>
            <p style={{ fontSize: '0.78rem', lineHeight: 1.5, color: '#2d4a3e', margin: 0 }}>
              {text("Client communication, discovery, coordination.", "Комунікація із замовником, діскавері, координація.")}
            </p>
          </div>
          {/* 3. Zvolinskiy — Management Consultant */}
          <div className="card-hanging" style={{ padding: '1.25rem' }}>
            <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c8901a', fontWeight: 800, marginBottom: '0.3rem' }}>
              {text("Management Consultant", "Менеджмент консультант")}
            </p>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.4rem' }}>
              <a href="https://www.linkedin.com/in/alexeyzvolinskiy/" target="_blank" rel="noopener noreferrer" style={{ color: '#064e3b', textDecoration: 'none' }}>
                {text("Alexey Zvolinskiy", "Олексій Зволинський")}
              </a>
            </h3>
            <p style={{ fontSize: '0.78rem', lineHeight: 1.5, color: '#2d4a3e', margin: 0 }}>
              {text("Strategy & organisational development in NGOs; human capital market restructuring.", "Стратегія та організаційний розвиток у недержавних організаціях; реструктуризація ринків людського капіталу.")}
            </p>
          </div>
          {/* 4. Nizelsky — Legal Advisor */}
          <div className="card-hanging" style={{ padding: '1.25rem' }}>
            <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c8901a', fontWeight: 800, marginBottom: '0.3rem' }}>
              {text("Legal Advisor", "Юридичний радник")}
            </p>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.4rem' }}>
              <a href="https://www.linkedin.com/in/arsen-nizelsky-59aba428/" target="_blank" rel="noopener noreferrer" style={{ color: '#064e3b', textDecoration: 'none' }}>
                {text("Arsen Nizelsky", "Арсен Нізельський")}
              </a>
            </h3>
            <p style={{ fontSize: '0.78rem', lineHeight: 1.5, color: '#2d4a3e', margin: 0 }}>
              {text("Personal data protection and GDPR compliance.", "Захист персональних даних та відповідність GDPR.")}
            </p>
          </div>
          {/* 5. Technology & OSINT */}

        </div>
        {/* MHPSS footnote — HIGH CONTRAST (not light/muted), per user spec */}
        <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid rgba(200,144,26,0.4)', background: 'rgba(200,144,26,0.08)', fontSize: '0.82rem', lineHeight: 1.55, color: '#13302c' }}>
          <sup style={{ color: '#c8901a', fontWeight: 700 }}>†</sup>{" "}
          {text("The project group has a mutual interest in participating in the MHPSS dashboard development (dashboard.feelagain.me), having noted the Institute\u2019s interest in this topic — particularly the \u2018Practical Mental Health Incident Management for Non-Specialists\u2019 programme in the Ukrainian chapter.", "Проектна група має взаємний інтерес до участі в розробці дашборду MHPSS (dashboard.feelagain.me), бачачи інтерес Інституту до цієї теми — зокрема програму «Practical Mental Health Incident Management for Non-Specialists» в українському чаптері.")}{" "}
          <a href="https://www.theisrm.org/practical-mental-health-incident-management-for-non-specialists" target="_blank" rel="noopener noreferrer" style={{ color: '#c8901a', textDecoration: 'underline' }}>
            {text("Open programme ↗", "Відкрити програму ↗")}
          </a>
        </div>
        {/* Technology & OSINT footnote */}
        <div style={{ marginTop: '0.5rem', padding: '0.6rem 0.85rem', fontSize: '0.78rem', lineHeight: 1.5, color: '#566762' }}>
          {text("Several sessions conducted with various development teams on construction and integration. After core preparation, most components can be integrative — project management, calendars, etc. — with capability to add integrations (Asana, Google, Jira, and others).", "Проведено декілька сесій із різними командами розробників із конструювання та інтеграції. Після підготовки ядра, більша частина може бути інтегративною — проектний менеджмент, календарі, тощо — з можливістю додавання інтеграцій (Asana, Google, Jira та інших).")}
        </div>
      </section>

      <EntryFrame locale={locale} />

      {/* ── Footer ── */}
      <footer className="partner-footer">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
          <img src="https://frishberg.com/wp-content/uploads/2023/07/logo.jpg" alt="Frishberg" style={{ height: "48px", width: "auto", objectFit: "contain" }} />
        </div>
        <div className="cta-bottom" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", alignItems: "center" }}>
          <Button asChild variant="default" className="button-outline text-base px-8 py-5 shadow-lg">
            <Link to="/scope">{text("Proceed to agreement →", "перейти до погодження →")}</Link>
          </Button>
        </div>

      </footer>
    </>
  );
}
