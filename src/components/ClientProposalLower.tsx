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

      {/* Section 03: Value Solution Framework — 3 Workflows */}
      <section aria-labelledby="vsf-heading" style={{ marginTop: '4.5rem' }}>
        <div className="partner-section-heading" style={{ margin: '3.5rem 0 2.5rem' }}>
          <span>03</span>
          <div>
            <h2 id="vsf-heading">
              {text("Value Solution Framework — 3 Workflows", "Value Solution Framework — 3 воркфлоу")}
            </h2>
            <p className="partner-body" style={{ marginTop: '0.75rem', lineHeight: '1.7', fontSize: '1.05rem', color: '#132a22' }}>
              {text("Three interconnected workflows that together form the technological arm for experts and consultants of the ISRM network.", "Три взаємопов\u2019язані воркфлоу, що разом формують технологічне плече для експертів та консультантів мережі ISRM.")}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>

          {/* Workflow 1: MVP */}
          <div className="card-hanging" style={{ borderTopColor: '#064e3b', display: 'flex', flexDirection: 'column' }}>
            <span className="tech-label text-brass" style={{ display: 'block', marginBottom: '0.4rem' }}>
              {text("Workflow 1", "Воркфлоу 1")}
            </span>
            <h3 className="header-pressed" style={{ fontSize: '1.05rem', margin: '0 0 0.75rem' }}>
              {text("MVP — Interactive Expertise Map", "MVP — Інтерактивна карта експертизи")}
            </h3>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.65, color: '#2d4a3e', margin: '0 0 1rem', flex: 1 }}>
              {text("A digital application for mapping available expertise and its carriers, with built-in AI OSINT and core service capabilities: search and selection of expertise or specific consultants, requests for professional support, invitations to discussions, R&D initiation, expert commentary for publications, and interaction in the professional community.", "Цифровий додаток для мапування доступної експертизи та її носіїв, з вбудованим ШІ OSINT та базовими сервісними можливостями: пошук та відбір експертизи чи конкретних консультантів, запити професійної підтримки, запрошення до обговорень, ініціювання R&D, експертні коментарі для публікацій, взаємодія у професійному ком\u2019юніті.")}
            </p>
            <div style={{ paddingTop: '0.75rem', borderTop: '1px dashed rgba(11,84,76,0.15)', fontSize: '0.78rem', color: '#064e3b', fontWeight: 700 }}>
              {text("Expected: rails for horizontal connections and group dynamics.", "Очікуваний результат: рейки для горизонтальних зв\u2019язків та групової динаміки.")}
            </div>
          </div>

          {/* Workflow 2: Acquisition Cycle */}
          <div className="card-hanging" style={{ borderTopColor: '#c8901a', display: 'flex', flexDirection: 'column' }}>
            <span className="tech-label text-brass" style={{ display: 'block', marginBottom: '0.4rem' }}>
              {text("Workflow 2", "Воркфлоу 2")}
            </span>
            <h3 className="header-pressed" style={{ fontSize: '1.05rem', margin: '0 0 0.75rem' }}>
              {text("Acquisition & Recruitment Cycle", "Цикл еквізішену та рекрутингу")}
            </h3>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.65, color: '#2d4a3e', margin: '0 0 1rem', flex: 1 }}>
              {text("Not a one-off campaign but the embodiment of digital support for a self-reproducing engagement cycle — acquisition through activities in chapters and expertise sectors, on principles of mutual digital trust.", "Не разова кампанія, а втілення цифрового супроводу самовідтворюваного циклу залучення — еквізішен через активності в чаптерах та секторах експертизи, на принципах взаємної цифрової довіри.")}
            </p>
            <div style={{ paddingTop: '0.75rem', borderTop: '1px dashed rgba(11,84,76,0.15)', fontSize: '0.78rem', color: '#c8901a', fontWeight: 600 }}>
              {text("Expected: target audience reach, content flow, capacity growth.", "Очікуваний результат: охоплення ЦА, потік контенту, зростання капасіті.")}
            </div>
          </div>

          {/* Workflow 3: Network Expertise */}
          <div className="card-hanging" style={{ borderTopColor: '#064e3b', display: 'flex', flexDirection: 'column' }}>
            <span className="tech-label text-brass" style={{ display: 'block', marginBottom: '0.4rem' }}>
              {text("Workflow 3", "Воркфлоу 3")}
            </span>
            <h3 className="header-pressed" style={{ fontSize: '1.05rem', margin: '0 0 0.75rem' }}>
              {text("Network Expertise Accumulation", "Накопичення мережевої експертизи")}
            </h3>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.65, color: '#2d4a3e', margin: '0 0 1rem', flex: 1 }}>
              {text("Not another knowledge bank but a constantly updated data flow, transformed into training programmes and publication materials — a surface for collecting network expertise and group interaction.", "Не черговий банк знань, а постійно оновлюваний потік даних, трансформований у навчальні програми та матеріали публікацій — поверхня для збору мережевої експертизи та групової взаємодії.")}
            </p>
            <div style={{ paddingTop: '0.75rem', borderTop: '1px dashed rgba(11,84,76,0.15)', fontSize: '0.78rem', color: '#064e3b', fontWeight: 700 }}>
              {text("Expected: paid access to expertise, thought leadership, project groups.", "Очікуваний результат: оплачуваний доступ до експертизи, лідерство думок, проєктні групи.")}
            </div>
          </div>

        </div>

        {/* Proposed directions */}
        <div style={{ padding: '1.25rem 1.5rem', borderRadius: '2px', border: '1px solid rgba(200,144,26,0.3)', background: 'rgba(200,144,26,0.06)', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c8901a', margin: '0 0 0.75rem' }}>
            {text("Proposed Directions", "Пропоновані напрями")}
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.92rem', lineHeight: 1.7, color: '#0a2e24' }}>
            <li>{text("Modernise horizontal connections and relationships using technological tooling.", "Модернізувати горизонтальні зв\u2019язки та відносини з використанням технологічного інструментарію.")}</li>
            <li>{text("Unite deep institutional and business network expertise with AI verification.", "Об\u2019єднати глибоку інституційну та бізнесову мережеву експертизу з перевіркою штучного інтелекту.")}</li>
            <li>{text("Renovate positions in digital communication channels: experienced expert + managed AI analytical agents = evolution of trust.", "Реновувати позиції у цифрових каналах комунікації: досвідчений експерт + керовані аналітичні агенти ШІ = еволюція довіри.")}</li>
          </ul>
        </div>
      </section>





      {/* ── Project Group (not "team") — per user spec: 'не називати командою' ── */}
      <section className="mt-12" aria-labelledby="contributors-heading">
        <div className="partner-section-heading" style={{ margin: '3rem 0 2rem' }}>
          <span>★</span>
          <div>
            <h2 id="contributors-heading">
              {text("Working Group for Proposal Preparation", "Учасники робочої групи підготовки пропозиції")}
            </h2>
            <p>{text("Experts engaged for this proposal", "Експерти, залучені до підготовки пропозиції")}</p>
          </div>
        </div>
        {/* All 5 cards in one row on wide screens */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.75rem' }}>
          {/* 1. Frishberg — Supervisor + logo */}
          <div className="card-hanging" style={{ padding: '1.25rem', borderLeft: '4px solid #c8901a', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            
            <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c8901a', fontWeight: 800, marginBottom: '0.3rem' }}>
              {text("Supervisor", "Супервайзер")}
            </p>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#064e3b', margin: '0 0 0.4rem', textAlign: 'center' }}>
              {text("Alex Frishberg", "Алекс Фрішберг")}
            </h3>
            <p style={{ fontSize: '0.78rem', lineHeight: 1.5, color: '#2d4a3e', margin: 0, textAlign: 'center' }}>
              {text("Coordination & value solution framework.", "Координація та value solution framework.")}
            </p>
          </div>
          {/* 2. Filimonov — Head & OSINT */}
          <div className="card-hanging" style={{ padding: '1.25rem', borderLeft: '4px solid #c8901a' }}>
            <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c8901a', fontWeight: 800, marginBottom: '0.3rem' }}>
              {text("OSINT & Communications", "OSINT та комунікації")}
            </p>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#064e3b', margin: '0 0 0.4rem' }}>
              {text("Dmitriy Filimonov", "Дмитро Филімонов")}
            </h3>
            <p style={{ fontSize: '0.78rem', lineHeight: 1.5, color: '#2d4a3e', margin: 0 }}>
              {text("External communications and campaigns, research, OSINT tooling.", "Зовнішні комунікації та кампанії, дослідження, OSINT інструментарій.")}
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
              {text("Organisational development, human capital restructuring.", "Організаційний розвиток, реструктуризація людського капіталу.")}
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
                {/* Technology & OSINT footnote */}
        <div style={{ marginTop: '0.5rem', padding: '0.6rem 0.85rem', fontSize: '0.78rem', lineHeight: 1.5, color: '#566762' }}>
          {text("Several sessions conducted with various development teams on construction and integration. After core preparation, most components can be integrative — project management, calendars, etc. — with capability to add integrations (Asana, Google, Jira, and others).", "Проведено декілька сесій із різними командами розробників із конструювання та інтеграції. Після підготовки ядра, більша частина може бути інтегративною — проектний менеджмент, календарі, тощо — з можливістю додавання інтеграцій (Asana, Google, Jira та інших).")}
        </div>
      </section>

      <EntryFrame locale={locale} />

      {/* ── Footer ── */}
            {/* CTA block — before footer */}
      <div className="mt-8 mb-4" style={{ display: "flex", justifyContent: "center" }}>
        <Button asChild variant="default" className="button-outline px-8 py-5 shadow-lg" style={{ fontSize: "0.95rem", borderRadius: "2px" }} style={{ borderRadius: "2px" }}>
          <Link to="/scope">{text("Proceed to agreement →", "перейти до погодження →")}</Link>
        </Button>
      </div>

      <footer className="partner-footer" style={{ background: "#ffffff", position: "relative", marginBottom: "0", paddingBottom: "0.5rem", width: "100%", padding: "0.5rem 1.5rem", borderRadius: "8px", marginTop: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
          <img src="https://frishberg.com/wp-content/uploads/2023/07/logo.jpg" alt="Frishberg" style={{ height: "48px", width: "auto", objectFit: "contain" }} />
        </div>
        <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#94a3b8", margin: "0.5rem 0 0" }}>
          © 2026 Frishberg & Partners. All rights reserved.
        </p>
        

      </footer>
    </>
  );
}
