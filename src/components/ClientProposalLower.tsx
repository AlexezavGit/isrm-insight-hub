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

      {/*       {/* Section 03: Value Solution Framework */}
      <section aria-labelledby="vsf-heading" style={{ marginTop: '4.5rem' }}>
        <div className="partner-section-heading" style={{ margin: '3.5rem 0 2.5rem' }}>
          <span>03</span>
          <div>
            <h2 id="vsf-heading">{text("Value Solution Framework — 3 Workflows", "Value Solution Framework — 3 vorKflou")}</h2>
            <p className="partner-body" style={{ marginTop: '0.75rem', lineHeight: '1.7', fontSize: '1.05rem', color: '#132a22' }}>
              {text("Three interconnected workflows forming the technological arm for ISRM experts and consultants.", "Tri vazmopovyazani vorKflou, scho formuyut tehnologichne pleche dlya ekspertiv ta konsultantiv merezhi ISRM.")}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '1rem 0 2rem', fontSize: '1.15rem', fontWeight: 700, color: '#0b544c', fontStyle: 'italic' }}>
          {text("Experienced expert + managed AI analytical agents = evolution of trust", "Dosvidcheniy ekspert + kerovani analitichni agenti ShI = evolyutsiya doviry")}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="card-hanging" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '1rem', padding: '1.25rem', borderTop: '4px solid #064e3b' }}>
            <div><p className="tech-label text-muted-foreground" style={{ marginBottom: '0.5rem' }}>{text("Demo", "Demonstratsiya")}</p><ul style={{ fontSize: '0.78rem', color: '#566762', lineHeight: 1.6, margin: 0, paddingLeft: '1rem' }}><li>{text("Expertise search", "Posshuk ekspertizy")}</li><li>{text("Service configurator", "Konfigurator servisiv")}</li><li>{text("Professional support", "Zap profpidtrymky")}</li><li>{text("R&D initiation", "R&D")}</li></ul></div>
            <div style={{ textAlign: 'center' }}><span className="tech-label text-brass">{text("Workflow 1 — Foundation", "VorKflou 1 — Fundament")}</span><h3 className="header-pressed" style={{ fontSize: '1rem', margin: '0.5rem 0' }}>{text("MVP — Interactive Expertise Map", "MVP — Interaktyvna mapa ekspertyzy")}</h3><p style={{ fontSize: '0.85rem', color: '#2d4a3e', lineHeight: 1.55, margin: 0 }}>{text("Digital application for mapping expertise, with built-in AI OSINT.", "TSifrovij dodatok dlya mapuvannya ekspertyzy, z vbudovanim ShI OSINT.")}</p></div>
            <div><p className="tech-label text-brass" style={{ marginBottom: '0.5rem' }}>{text("Expected", "Ochikuvaniy rezultat")}</p><ul style={{ fontSize: '0.78rem', color: '#566762', lineHeight: 1.6, margin: 0, paddingLeft: '1rem' }}><li>{text("Rails for horizontal connections", "Reyki dlya goryzontalnyh zvyazkiv")}</li><li>{text("Group dynamics launch", "Zapusk grupovoi dynamiky")}</li><li>{text("AI tool access", "Poverhnya dostupu do ShI")}</li></ul></div>
          </div>
          <div className="card-hanging" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '1rem', padding: '1.25rem', borderTop: '4px solid #c8901a' }}>
            <div><p className="tech-label text-muted-foreground" style={{ marginBottom: '0.5rem' }}>{text("Demo", "Demonstratsiya")}</p><p style={{ fontSize: '0.82rem', color: '#566762' }}>{text("Search + configurator + dependencies.", "POSHUK + konfigurator + zalezhnosti.")}</p></div>
            <div style={{ textAlign: 'center' }}><span className="tech-label text-brass">{text("Workflow 2", "VorKflou 2")}</span><h3 className="header-pressed" style={{ fontSize: '1rem', margin: '0.5rem 0' }}>{text("Acquisition & Recruitment Cycle", "Tsikl ekvizishenu ta rekrutynhu")}</h3><p style={{ fontSize: '0.85rem', color: '#2d4a3e', lineHeight: 1.55, margin: 0 }}>{text("Self-reproducing engagement cycle through chapters, on principles of mutual digital trust.", "Samovidtvoryuvaniy tsikl zalyuchennya cherez chapteri ta sektory ekspertyzy.")}</p></div>
            <div><p className="tech-label text-brass" style={{ marginBottom: '0.5rem' }}>{text("Expected", "Ochikuvaniy rezultat")}</p><ul style={{ fontSize: '0.78rem', color: '#566762', lineHeight: 1.6, margin: 0, paddingLeft: '1rem' }}><li>{text("Target audience reach", "Ohoplennya TsA")}</li><li>{text("Content flow", "Potik kontentu")}</li><li>{text("Capacity growth", "Zrostannya kapasiti")}</li></ul></div>
          </div>
          <div className="card-hanging" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '1rem', padding: '1.25rem', borderTop: '4px solid #064e3b' }}>
            <div><p className="tech-label text-muted-foreground" style={{ marginBottom: '0.5rem' }}>{text("Demo", "Demonstratsiya")}</p><p style={{ fontSize: '0.82rem', color: '#566762' }}>{text("Search + configurator with dependencies.", "POSHUK + konfigurator z zalezhnostyamy.")}</p></div>
            <div style={{ textAlign: 'center' }}><span className="tech-label text-brass">{text("Workflow 3", "VorKflou 3")}</span><h3 className="header-pressed" style={{ fontSize: '1rem', margin: '0.5rem 0' }}>{text("Network Expertise Accumulation", "Nakopychennya merezhevoyi ekspertyzy")}</h3><p style={{ fontSize: '0.85rem', color: '#2d4a3e', lineHeight: 1.55, margin: 0 }}>{text("Not a knowledge bank — constantly updated data flow, transformed into training and publications.", "Ne bank znan, a potik danyh, transformovaniy u navchalni programy.")}</p></div>
            <div><p className="tech-label text-brass" style={{ marginBottom: '0.5rem' }}>{text("Expected", "Ochikuvaniy rezultat")}</p><ul style={{ fontSize: '0.78rem', color: '#566762', lineHeight: 1.6, margin: 0, paddingLeft: '1rem' }}><li>{text("Thought leadership", "Liderstvo dumok")}</li><li>{text("Project groups + cross-sales", "Proektni gruppy")}</li><li>{text("Paid access to expertise", "Oplachuvaniy dostup")}</li></ul></div>
          </div>
        </div>
        <div style={{ padding: '1.25rem 1.5rem', borderRadius: '2px', border: '1px solid rgba(200,144,26,0.3)', background: 'rgba(200,144,26,0.06)', marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c8901a', margin: '0 0 0.75rem' }}>{text("Proposed Directions", "Proponovani napryamy")}</p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.92rem', lineHeight: 1.7, color: '#0a2e24' }}>
            <li>{text("Modernise horizontal connections using AI.", "Modernizuvaty goryzontalni zvyazky z ShI.")}</li>
            <li>{text("Unite deep expertise with AI verification.", "Ob'yednaty ekspertyzu z verifikatsiyeyu ShI.")}</li>
            <li>{text("Renovate communications: expert + AI = evolution of trust.", "Renuvatuvaty komunukatsiyi: ekspert + ShI = evolyutsiya doviry.")}</li>
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


      {/* Closing statement + MHPSS interest */}
      <section style={{ marginTop: '3rem', marginBottom: '1rem', padding: '1.5rem', borderRadius: '2px', border: '1px solid rgba(200,144,26,0.3)', background: 'rgba(200,144,26,0.04)' }}>
        <p style={{ fontSize: '1rem', lineHeight: 1.75, color: '#0a2e24', margin: '0 0 1rem' }}>
          {text("We view the possibility of realising this non-trivial task with high interest. The demonstration presented here is evidence of that.", "З високої зацікавленості дивимось на можливість реалізації цієї нетривіальної задачі. Надана демонстрація свідчить про це.")}
        </p>
        <p style={{ fontSize: '1rem', lineHeight: 1.75, color: '#0a2e24', margin: '0 0 1rem', fontWeight: 500 }}>
          {text("We acknowledge the leadership of the Institute of Strategic Risk Management in setting standards for security, resilience, and crisis management in Britain, Europe, and the world. We express particular gratitude for the opening of the Ukrainian chapter and your attention to questions important for Ukrainians and the country.", "Визнаємо лідерську роль Інституту стратегічного управління ризиками у формуванні стандартів безпеки, резільєнтності та антикризового управління в Британії, Європі та світі. Висловлюємо особливу подяку за відкриття українського чаптеру та вашу увагу до важливих питань для українців та країни.")}
        </p>
        <p style={{ fontSize: '1rem', lineHeight: 1.75, color: '#0a2e24', margin: '0 0 1rem' }}>
          {text("We have a mutual interest in the potential participation of ISRM experts in risk analysis for the mental wellbeing sector in Ukraine — the backbone of resilience and post-war recovery — with the preparation of a public dashboard.", "Маємо зустрічну зацікавленість щодо потенційної участі експертів ISRM в аналізі ризиків сектору ментального добробуту в Україні — стрижня резільєнтності та повоєнного відновлення країни, з підготовкою публічного дашборду.")}
          {" "}
          <a href="https://dashboard.feelagain.me" target="_blank" rel="noopener noreferrer" style={{ color: '#c8901a', textDecoration: 'underline' }}>dashboard.feelagain.me</a>
          {" | "}
          <a href="https://www.theisrm.org/practical-mental-health-incident-management-for-non-specialists" target="_blank" rel="noopener noreferrer" style={{ color: '#c8901a', textDecoration: 'underline' }}>
            {text("MHPSS programme ↗", "Програма MHPSS ↗")}
          </a>
        </p>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.65, color: '#0a2e24', margin: '0 0 1rem' }}>
          {text("We hope that the complementarity of approaches and attention to mental wellbeing will allow us to perform a publicly valuable exercise for the benefit of Ukrainians, gaining expert positions together.", "Маємо надію, що комплементарність підходів та увага до ментального добробуту дозволить виконати публічно ціннісну вправу на користь українців з надбанням експертних позицій разом.")}
        </p>

        {/* Checkbox — stored in localStorage, flows to /scope email */}
        <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', borderRadius: '4px', border: '1.5px solid #c8901a', background: 'rgba(200,144,26,0.08)' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
            <input type="checkbox" id="dashboard-interest" style={{ width: '1.2rem', height: '1.2rem', marginTop: '0.1rem', accentColor: '#c8901a' }}
              onChange={(e) => {
                try { localStorage.setItem('isrm-dashboard-interest', e.target.checked ? 'interested' : 'not-interested'); } catch(err) {}
              }}
            />
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#13302c', margin: 0 }}>
                {text("Please tick if you would like to receive materials for review.", "Просимо зробити відмітку, якщо бажаєте отримати матеріали для ознайомлення.")}
              </p>
              <p style={{ fontSize: '0.82rem', color: '#566762', margin: '0.3rem 0 0' }}>
                {text("Dashboard: interesting — will be included in the agreement email.", "Дашборд: цікаво — буде включено в лист погодження.")}
              </p>
            </div>
          </label>
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
