import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { IsrmLogo } from "@/components/IsrmLogo";
import { ArrowRight, Users, ShieldCheck, BriefcaseBusiness, Globe, Mail, Calendar } from "lucide-react";

export const Route = createFileRoute("/proposal-v2")({
  beforeLoad: () => {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("isrm-visited", "1");
    }
  },
  head: () => ({
    meta: [
      { title: "Технології що створюють Довіру — концепція конфігуратора сервісів · ISRM" },
      {
        name: "description",
        content:
          "Концепція першої сторінки цифрового хабу мережі експертів ISRM: інфографіка ланцюжка довіри, три воркфлоу та інтерактивний конфігуратор сервісів.",
      },
      {
        property: "og:title",
        content: "Технології що створюють Довіру — концепція конфігуратора сервісів · ISRM",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProposalPage,
});

function ProposalPage() {
  const { locale, setLocale } = useI18n();
  const uk = locale === "uk";
  const text = (en: string, ua: string) => (uk ? ua : en);

  return (
    <main className="partner-review min-h-screen flex flex-col">
      <style>{`
        .proposal-infographic { stroke-width: 1.5; }
        .proposal-node { cursor: pointer; transition: r 0.2s, fill 0.2s; }
        .proposal-node:hover { r: 9; fill: var(--isrm-gold-pale); }
        .proposal-edge { stroke-dasharray: 6 4; transition: stroke 0.2s; }
        .proposal-step-card { transition: transform 0.2s, border-color 0.2s; }
        .proposal-step-card:hover { transform: translateY(-2px); border-color: var(--isrm-gold); }
      `}</style>

      {/* Topbar */}
      <div
        className="partner-topbar"
        style={{
          padding: "1rem 0 1.25rem",
          marginBottom: "1.75rem",
          borderBottom: "1px solid color-mix(in oklab, var(--isrm-gold) 25%, var(--border))",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div aria-label="ISRM" style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
            <IsrmLogo className="h-9 w-auto" />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div className="partner-locale-switch" role="group" aria-label={text("Page language", "Мова сторінки")}>
            <button type="button" aria-pressed={!uk} className={!uk ? "is-active" : ""} onClick={() => setLocale("en")}>
              EN
            </button>
            <button type="button" aria-pressed={uk} className={uk ? "is-active" : ""} onClick={() => setLocale("uk")}>
              UA
            </button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <header className="partner-header" style={{ display: "block", padding: "0 0 2rem" }}>
        <div>
          <address
            style={{
              fontSize: "0.85rem",
              lineHeight: 1.35,
              color: "color-mix(in oklab, var(--isrm-gold) 80%, var(--foreground, #13302c))",
              fontStyle: "normal",
              margin: 0,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.02em",
            }}
          >
            {text("Dr David Rubens D.SyRM, CSyP, F.ISRM", "Dr David Rubens D.SyRM, CSyP, F.ISRM")}
            <br />
            <span style={{ opacity: 0.85 }}>
              {text("Executive Director of the ISRM — for the Strategic Board", "Executive Director of the ISRM — для Стратегічної ради")}
            </span>
          </address>

          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight mb-4">
            {text("Technologies that create Trust — the foundation of Trusted Practice", "Технології що створюють Довіру — фундамент Trusted Practice")}
          </h1>

          <div
            style={{
              maxWidth: 860,
              marginTop: "1.5rem",
              padding: "1.25rem 0",
              borderTop: "1px solid rgba(200,144,26,0.3)",
              borderBottom: "1px solid rgba(200,144,26,0.3)",
            }}
          >
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#0a2e24", margin: 0, fontWeight: 500 }}>
              {text(
                "Trust is not a static certificate — it is the operational infrastructure of professional advisory. In an era where direct unassisted trust between individuals is undermined by total information noise, we rely on a verified operational loop: people → trust → technology / AI → trust → people. The decisive advantage belongs to verified practitioners with transparent analytical evidence on board.",
                "Довіра — це не статичний сертифікат, а фундаментальна інфраструктура фахового консалтингу. В епоху, коли прямий зв’язок «люди – довіра – люди» знецінюється тотальним інформаційним шумом, ми спираємося на замкнений операційний цикл: люди → довіра → технології / ШІ → довіра → люди. Вирішальна перевага належить верифікованим експертам із прозорим аналітичним інструментарієм.",
              )}
            </p>
          </div>

          <div
            className="partner-lede partner-question-plaque"
            style={{
              maxWidth: 860,
              marginTop: "1.25rem",
              padding: "1.25rem 1.5rem",
              borderLeft: "5px solid var(--isrm-gold)",
              borderRadius: "0 8px 8px 0",
              background: "color-mix(in oklab, var(--isrm-gold) 14%, var(--card, #f2eadb))",
              fontSize: "1.02rem",
              lineHeight: 1.6,
            }}
          >
            <p style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: "0.6rem", color: "#0a2e24" }}>
              {text("The question was: what comes next?", "Ви питали, що далі.")}
            </p>
            <p style={{ marginBottom: "0.6rem", color: "#0a2e24", fontSize: "1.02rem", lineHeight: 1.6 }}>
              {text(
                "This proposal introduces an interactive collegiate workflow rather than an inert register: an operational surface to convene network expertise, assemble multidisciplinary project commissions, record peer contributions, illuminate institutional capacity, and advance thought leadership — with AI-verified evidence at every stage.",
                "Ця пропозиція — інтерактивний воркфлоу, а не чергова таблиця: робоча поверхня для збору мережевої експертизи, формування проєктних груп, обліку внесків, унаочнення потенціалу та лідерства думок — з верифікацією фактів за допомогою ШІ на кожному етапі.",
              )}
            </p>
          </div>
        </div>
      </header>

      <div className="partner-shell">
        {/* Section 01 — Trust Chain Infographic */}
        <section aria-labelledby="trust-chain-heading" style={{ marginTop: "2rem" }}>
          <div className="partner-section-heading" style={{ margin: "1rem 0 1.5rem" }}>
            <span>01</span>
            <div>
              <h2 id="trust-chain-heading" style={{ font: "600 clamp(1.5rem, 2.5vw, 2.1rem)/1.15 var(--font-display)" }}>
                {text("The Trust Chain — How Expertise Becomes Verified", "Ланцюжок довіри — як експертиза стає верифікованою")}
              </h2>
              <p style={{ color: "var(--muted-foreground)", lineHeight: 1.5 }}>
                {text(
                  "In the AI era, expert status alone is no longer a competitive advantage. The advantage belongs to the tandem of verified practitioners with transparent analytical instrumentation.",
                  "В епоху ШІ саме по експертному статусу Wettbewerbe вже не виграти. Перевага належить тандему верифікованих практиків із прозорим аналітичним інструментарієм.",
                )}
              </p>
            </div>
          </div>

          <div style={{ maxWidth: 900, margin: "0 auto 3rem" }}>
            <svg
              className="proposal-infographic w-full h-[420px] max-h-[60vh] text-[var(--isrm-ink)]"
              viewBox="0 0 900 420"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label={text("Trust chain diagram", "Діаграма ланцюжка довіри")}
            >
              <defs>
                <marker id="arrowhead-v2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="var(--isrm-gold)" />
                </marker>
              </defs>

              {/* Nodes */}
              <circle cx="130" cy="140" r="26" className="proposal-node" fill="var(--isrm-teal-deep)" stroke="var(--isrm-gold)" />
              <text x="130" y="144" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" fill="#fff" letterSpacing="0.05em">PEOPLE</text>

              <circle cx="380" cy="140" r="26" className="proposal-node" fill="var(--isrm-teal)" stroke="var(--isrm-gold)" />
              <text x="380" y="144" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" fill="#fff" letterSpacing="0.05em">TRUST + AI</text>

              <circle cx="630" cy="140" r="26" className="proposal-node" fill="var(--isrm-teal-light)" stroke="var(--isrm-gold)" />
              <text x="630" y="144" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" fill="#fff" letterSpacing="0.05em">VERIFIED EXPERTISE</text>

              <circle cx="380" cy="330" r="26" className="proposal-node" fill="var(--isrm-gold)" stroke="var(--isrm-teal-deep)" />
              <text x="380" y="334" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" fill="#0a2e24" letterSpacing="0.05em">TRUSTED PRACTICE</text>

              {/* Edges */}
              <path d="M 156 140 Q 260 140 354 140" stroke="var(--isrm-gold)" fill="none" markerEnd="url(#arrowhead-v2)" className="proposal-edge" />
              <path d="M 406 140 Q 510 140 604 140" stroke="var(--isrm-gold)" fill="none" markerEnd="url(#arrowhead-v2)" className="proposal-edge" />
              <path d="M 406 166 Q 406 260 380 304" stroke="var(--isrm-gold)" fill="none" markerEnd="url(#arrowhead-v2)" className="proposal-edge" />
              <path d="M 354 304 Q 260 304 156 304" stroke="var(--isrm-gold)" fill="none" markerEnd="url(#arrowhead-v2)" className="proposal-edge" />

              {/* Labels on edges */}
              <text x="245" y="120" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--isrm-gold)" letterSpacing="0.08em">trust → technology</text>
              <text x="505" y="120" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--isrm-gold)" letterSpacing="0.08em">technology → verified</text>
              <text x="415" y="230" textAnchor="start" fontFamily="var(--font-mono)" fontSize="10" fill="var(--isrm-gold)" letterSpacing="0.08em">verified → practice</text>
              <text x="215" y="315" textAnchor="end" fontFamily="var(--font-mono)" fontSize="10" fill="var(--isrm-gold)" letterSpacing="0.08em">practice → people</text>

              {/* Node captions */}
              <text x="130" y="180" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--muted-foreground)" letterSpacing="0.08em">{uk ? "Люди" : "People"}</text>
              <text x="380" y="180" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--muted-foreground)" letterSpacing="0.08em">{uk ? "Довіра + ШІ" : "Trust + AI"}</text>
              <text x="630" y="180" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--muted-foreground)" letterSpacing="0.08em">{uk ? "Верифікована експертиза" : "Verified Expertise"}</text>
              <text x="380" y="370" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="#0a2e24" fontWeight="700">{uk ? "Trusted Practice" : "Trusted Practice"}</text>
            </svg>

            <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.82rem", color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>
              {text("Closed loop: expertise is not claimed, it is evidenced and re-verified through the network.", "Замкнутий цикл: експертиза не декларується, вона доказується та перевіряється мережею.")}
            </p>
          </div>
        </section>

        {/* Section 02 — Problem / Solution */}
        <section style={{ marginTop: "2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
            <div style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "1.5rem", background: "var(--card)" }}>
              <h3 style={{ font: "600 1.1rem var(--font-display)", color: "var(--isrm-red)", margin: "0 0 1rem" }}>{text("The Challenge", "Виклик")}</h3>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", lineHeight: 1.7, fontSize: "0.95rem", color: "var(--muted-foreground)" }}>
                <li>{text("Erosion of trust and devaluation of relationships across sectors.", "Криза довіри та девальвація відносин у всіх секторах.")}</li>
                <li>{text("Surface-level consulting mass-produced by generative AI tools.", "Поверхневий консалтинг, рахунком оснащений генеративними ШІ-інструментами.")}</li>
                <li>{text("AI has reached an expert position — competing with it directly is a lost game.", "ШІ досягла експертної позиції; гра з нею на її полі вже програна.")}</li>
              </ul>
            </div>
            <div style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "1.5rem", background: "var(--card)" }}>
              <h3 style={{ font: "600 1.1rem var(--font-display)", color: "var(--isrm-teal)", margin: "0 0 1rem" }}>{text("Our Answer", "Відповідь")}</h3>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", lineHeight: 1.7, fontSize: "0.95rem", color: "var(--muted-foreground)" }}>
                <li>{text("Verified expertise + AI instrumentation — not AI instead of experts.", "Верифікована експертиза + інструментарієм ШІ, а не заміна експертів.")}</li>
                <li>{text("Trust is not a certificate — it is an operational loop: people → trust → AI → trust → people.", "Довіра — не сертифікат, а цикл: люди → довіра → ШІ + експертиза → довіра → люди.")}</li>
                <li>{text("Competitive advantage belongs to verified practitioners with transparent evidence.", "Перевага належить верифікованим експертам із прозоримиावाми.")}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 03 — Three Workflows (Pyramid) */}
        <section aria-labelledby="workflows-heading" style={{ marginTop: "2rem" }}>
          <div className="partner-section-heading" style={{ margin: "1rem 0 1.5rem" }}>
            <span>02</span>
            <div>
              <h2 id="workflows-heading" style={{ font: "600 clamp(1.5rem, 2.5vw, 2.1rem)/1.15 var(--font-display)" }}>
                {text("Three Workflows — From MVP to Network Expertise", "Три воркфлоу — від MVP до мережевої експертизи")}
              </h2>
              <p style={{ color: "var(--muted-foreground)", lineHeight: 1.5 }}>
                {text(
                  "A digital application, not a register: search expertise, form groups, initiate R&D, publish analytical outputs.",
                  "Цифровий додаток, а не реєстр: пошук експертизи, формування груп, ініціативу R&D, публікаціюアナлітики.",
                )}
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
            {[
              {
                num: "01",
                title: text("MVP — Interactive Expertise Map", "MVP — Інтерактивна карта експертизи"),
                color: "var(--isrm-teal)",
                desc: text(
                  "A digital application for mapping available expertise and its carriers, with built-in AI OSINT and core service capabilities: search and selection of expertise or specific consultants, requests for professional support, invitations to discussions, R&D initiation, expert commentary for publications.",
                  "Цифровий додаток для мапування доступної експертизи та її носіїв, з вбудованим ШІ OSINT та базовими сервісними можливостями: пошук та відбір експертизи чи конкретних консультантів, запити професійної підтримки, запрошення до обговорень, ініціювання R&D, експертні коментарі для публікацій.",
                ),
                result: text("Rails for horizontal connections and group dynamics.", "Рейки для горизонтальних зв’язків та групової динаміки."),
              },
              {
                num: "02",
                title: text("Acquisition & Recruitment Cycle", "Цикл еквізішену та рекрутингу"),
                color: "var(--isrm-gold)",
                desc: text(
                  "Not a one-off campaign but digital support for a self-reproducing engagement cycle — acquisition through activities in chapters and expertise sectors, on principles of mutual digital trust.",
                  "Не разова кампанія, а цифрове супроводу самовідтворюваного циклу залучення — еквізішен через активності в чаптерах та секторах експертизи, на принципах взаємної цифрової довіри.",
                ),
                result: text("Target audience reach, content flow, capacity growth.", "Охоплення цільової аудиторії, потік контенту, зростання капасіті."),
              },
              {
                num: "03",
                title: text("Network Expertise Accumulation", "Накопичення мережевої експертизи"),
                color: "var(--isrm-teal)",
                desc: text(
                  "Not another knowledge bank but a constantly updated data flow, transformed into training programmes and publication materials — a surface for collecting network expertise and group interaction.",
                  "Не черговий банк знань, а постійно оновлюваний потік даних, трансформований у навчальні програми та матеріали публікацій — поверхня для збору мережевої експертизи та групової взаємодії.",
                ),
                result: text("Paid access to expertise, thought leadership, project groups.", "Оплачуваний доступ до експертизи, лідерство думок, проєктні групи."),
              },
            ].map((w) => (
              <div
                key={w.num}
                className="proposal-step-card"
                style={{
                  border: "1px solid var(--border)",
                  borderTop: "4px solid " + w.color,
                  borderRadius: "8px",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span style={{ font: "700 0.8rem var(--font-mono)", color: w.color, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.5rem" }}>{w.num}</span>
                <h3 style={{ font: "600 1.05rem var(--font-display)", color: "#0a2e24", margin: "0 0 0.75rem", lineHeight: 1.3 }}>{w.title}</h3>
                <p style={{ fontSize: "0.88rem", lineHeight: 1.65, color: "#2d4a3e", margin: "0 0 1rem", flex: 1 }}>{w.desc}</p>
                <div style={{ paddingTop: "0.75rem", borderTop: "1px dashed rgba(11,84,76,0.15)", fontSize: "0.78rem", color: w.color, fontWeight: 700 }}>{w.result}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 04 — Service Configurator (Homepage Core) */}
        <section aria-labelledby="configurator-heading" style={{ marginTop: "2rem", padding: "2rem 0" }}>
          <div className="partner-section-heading" style={{ margin: "1rem 0 1.5rem" }}>
            <span>03</span>
            <div>
              <h2 id="configurator-heading" style={{ font: "600 clamp(1.5rem, 2.5vw, 2.1rem)/1.15 var(--font-display)" }}>
                {text("Service Configurator — Build Your Engagement", "Конфігуратор сервісів — складіть свої послуги")}
              </h2>
              <p style={{ color: "var(--muted-foreground)", lineHeight: 1.5, maxWidth: 700 }}>
                {text(
                  "Choose the services your board needs. The configurator calculates dependencies, shows which experts are involved, and prepares a brief for the coordination stage.",
                  "Оберіть послуги, які потрібні вашій раді. Конфігуратор розрахує залежності, покаже задіяних експертів і підготує бриф до етапу погодження.",
                )}
              </p>
            </div>
          </div>

          <ServiceConfigurator locale={locale} uk={uk} text={text} />
        </section>

        {/* Section 05 — Demo Network CTA */}
        <section style={{ marginTop: "3rem" }}>
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "3rem 2rem", textAlign: "center", background: "var(--card)" }}>
            <h2 style={{ font: "600 1.5rem var(--font-display)", color: "#0a2e24", margin: "0 0 1rem" }}>{text("See the Network in Action", "Подивіться мережу у дії")}</h2>
            <p style={{ color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: "2rem", maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
              {text(
                "Interactive prototype of the digitised contact network that reveals internal dependencies and insights. Can be used as a standalone ISRM application for working with members and followers.",
                "Інтерактивний прототип оцифрованої мережі контактів, що розкриває внутрішні залежності та інсайти. Може бути використаний як самодостатній застосунок ISRM для роботи з членами та фоловерами.",
              )}
            </p>
            <Button
              asChild
              variant="default"
              className="px-8 py-3 shadow-lg"
              style={{ fontSize: "0.95rem", borderRadius: "2px" }}
            >
              <Link to="/" search={{ network: "true" }} onClick={() => { if (typeof sessionStorage !== "undefined") sessionStorage.setItem("isrm-allow-graph", "1"); }}>
                {text("Open Network Demo →", "Відкрити демо мережі →")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Section 06 — Practitioners */}
        <section style={{ marginTop: "3rem" }}>
          <div className="partner-section-heading" style={{ margin: "1rem 0 1.5rem" }}>
            <span>★</span>
            <div>
              <h2 style={{ font: "600 1.3rem var(--font-display)", color: "#0a2e24", margin: 0 }}>{text("Working Group for Proposal Preparation", "Учасники робочої групи підготовки пропозиції")}</h2>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
            <PractitionerCard role={text("Supervisor", "Супервайзер")} name={text("Alex Frishberg", "Алекс Фрішберг")} bio={text("Coordination & value solution framework.", "Координація та value solution framework.")} color="var(--isrm-gold)" />
            <PractitionerCard role={text("OSINT & Communications", "OSINT та комунікації")} name={text("Dmitriy Filimonov", "Дмитро Філімонов")} bio={text("External communications and campaigns, research, OSINT tooling.", "Зовнішні комунікації та кампанії, дослідження, OSINT інструментарій.")} color="var(--isrm-gold)" />
            <PractitionerCard role={text("Management Consultant", "Менеджмент-консультант")} name={text("Alexey Zvolinskiy", "Олексій Зволинський")} bio={text("Organisational development, human capital restructuring.", "Організаційний розвиток, реструктуризація людського капіталу.")} href="https://www.linkedin.com/in/alexeyzvolinskiy/" />
            <PractitionerCard role={text("Legal Advisor", "Юридичний радник")} name={text("Arsen Nizelsky", "Арсен Нізельський")} bio={text("Personal data protection and GDPR compliance.", "Захист персональних даних та відповідність GDPR.")} href="https://www.linkedin.com/in/arsen-nizelsky-59aba428/" />
          </div>
        </section>
      </div>

      <footer className="partner-footer" style={{ background: "#ffffff", marginTop: "auto", padding: "1.5rem", borderRadius: "8px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
          <img src="https://frishberg.com/wp-content/uploads/2023/07/logo.jpg" alt="Frishberg" style={{ height: "48px", width: "auto", objectFit: "contain" }} />
        </div>
        <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#94a3b8", margin: 0 }}>
          © 2026 Frishberg & Partners. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

function ServiceConfigurator({ locale, uk, text }: { locale: "en" | "uk"; uk: boolean; text: (en: string, ua: string) => string }) {
  const services = [
    {
      id: "mvp",
      icon: BriefcaseBusiness,
      title: text("MVP Application", "MVP Застосунок"),
      short: text("Core expert workflow, search and group formation", "Основа робочого процесу, пошук та формування груп"),
      metrics: text("45 verified profiles · 178 CRM records", "45 верифікованих профілів · 178 записів у CRM"),
      color: "var(--isrm-teal)",
    },
    {
      id: "acquisitions",
      icon: Users,
      title: text("Active Acquisitions", "Активні залучення"),
      short: text("Targeted outreach by sector & jurisdiction", "Таргетований аутріч за секторами й юрисдикціями"),
      metrics: text("~175 target candidates / cycle", "~175 цільових кандидатів / цикл"),
      color: "var(--isrm-gold)",
    },
    {
      id: "discussions",
      icon: Globe,
      title: text("Expert Discussions", "Експертні обговорення"),
      short: text("Roundtables, agendas, invitations", "Круглі столи, адженди, запрошення"),
      metrics: text("~175 engaged per campaign", "~175 залучених за кампанію"),
      color: "var(--isrm-teal-light)",
    },
    {
      id: "reports",
      icon: Mail,
      title: text("Reports & Publications", "Звіти та публікації"),
      short: text("Transcription, reports, media outreach", "Розшифрування, звіти, медіа-поширення"),
      metrics: text("8.7k LinkedIn audience reach", "8.7k охоплення аудиторії LinkedIn"),
      color: "var(--isrm-teal)",
    },
    {
      id: "expertise",
      icon: ShieldCheck,
      title: text("Network Expertise — Cases", "Мережева експертиза — Кейси"),
      short: text("Verified author permission, project fees", "Підтверджений запит автора, гонорари"),
      metrics: text("Composite TII record", "Композитний запис TII"),
      color: "var(--isrm-gold)",
    },
    {
      id: "conferences",
      icon: Calendar,
      title: text("Conferences by Sector", "Конференції за секторами"),
      short: text("Agenda, tickets, speaker pool, Almanac", "Адженда, квитки, пул спікерів, Альманах"),
      metrics: text("~43 paid attendees / cycle", "~43 платних відвідувачів / цикл"),
      color: "var(--isrm-teal-light)",
    },
  ];

  const [selected, setSelected] = React.useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
      {services.map((svc) => {
        const isSelected = selected.includes(svc.id);
        return (
          <div
            key={svc.id}
            onClick={() => toggle(svc.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && toggle(svc.id)}
            style={{
              border: `1px solid ${isSelected ? svc.color : "var(--border)"}`,
              borderTop: `4px solid ${svc.color}`,
              borderRadius: "8px",
              padding: "1.25rem",
              background: isSelected ? "color-mix(in oklab, var(--isrm-teal) 8%, var(--card))" : "var(--card)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <svc.icon className={`h-5 w-5 mb-2`} style={{ fill: svc.color }} />
            <h4 style={{ font: "600 0.95rem var(--font-display)", color: "#0a2e24", margin: "0 0 0.5rem" }}>{svc.title}</h4>
            <p style={{ fontSize: "0.82rem", lineHeight: 1.5, color: "var(--muted-foreground)", margin: "0 0 0.75rem" }}>{svc.short}</p>
            <div style={{ font: "700 0.72rem var(--font-mono)", color: svc.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>{svc.metrics}</div>
            <div style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
              {isSelected ? text("✓ Included in your brief", "✓ Додано до брифу") : text("Add to brief", "Додати до брифу")}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PractitionerCard({ role, name, bio, color, href }: { role: string; name: string; bio: string; color?: string; href?: string }) {
  const Comp = href ? "a" : "div";
  const extraProps = href ? { href, target: "_blank", rel: "noopener noreferrer", style: { color, textDecoration: "none" } as React.CSSProperties } : {};
  return (
    <Comp {...extraProps} style={{ display: "flex", flexDirection: "column", padding: "1rem", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--card)" }}>
      <p style={{ font: "700 0.65rem var(--font-mono)", color: color ?? "var(--isrm-gold)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.3rem" }}>{role}</p>
      <h3 style={{ font: "600 0.9rem var(--font-display)", color: "#0a2e24", margin: "0 0 0.4rem", textAlign: "center" }}>{name}</h3>
      <p style={{ fontSize: "0.78rem", lineHeight: 1.5, color: "#2d4a3e", margin: 0, textAlign: "center" }}>{bio}</p>
    </Comp>
  );
}
