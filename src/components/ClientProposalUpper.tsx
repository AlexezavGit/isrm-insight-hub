import { ArrowLeft, GitBranch, Search } from "lucide-react";
import { IsrmLogo } from "@/components/IsrmLogo";
import { Button } from "@/components/ui/button";
import type { DependencyEdge } from "@/data/client-proposal-data";

type Props = {
  text: (en: string, ua: string) => string;
  uk: boolean;
  setLocale: (next: "en" | "uk") => void;
  dependencyEdges: DependencyEdge[];
};

export function ClientProposalUpper({ text, uk, setLocale, dependencyEdges }: Props) {
  return (
    <>
      {/* ── Верхній колонтитул (Top running header / Toolbar) ──────────── */}
      <div
        className="partner-topbar"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1rem 0 1.25rem",
          marginBottom: "1.75rem",
          borderBottom: "1px solid color-mix(in oklab, var(--brass, #c8901a) 25%, var(--border))",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div aria-label="ISRM">
            <IsrmLogo className="h-9 w-auto" />
          </div>
          <Button asChild variant="ghost" className="partner-back" style={{ padding: "0.25rem 0.5rem", height: "auto" }}>
            <a href="/?network=true" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.85rem" }}>
              <ArrowLeft aria-hidden="true" style={{ width: 14, height: 14 }} />
              <span>{text("Return to network graph", "До графа")}</span>
            </a>
          </Button>
          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>·</span>
          <span style={{ fontSize: "0.74rem", color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
            {text("Strictly Confidential · October 2026", "Конфіденційно · Жовтень 2026")}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <a
            href="/partner"
            style={{
              fontSize: "0.62rem",
              fontWeight: 500,
              padding: "0.2rem 0.45rem",
              borderRadius: "4px",
              border: "none",
              background: "transparent",
              color: "rgba(10, 46, 36, 0.25)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.2rem",
              transition: "opacity 0.3s",
              letterSpacing: "0.03em",
            }}
            title={text("Internal partner configurator", "Внутрішній конфігуратор для партнерів")}
            onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(10,46,36,0.6)"; }}
            onMouseOut={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(10,46,36,0.25)"; }}
          >
            <span>⚙</span>
          </a>
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

      <header className="partner-header" style={{ display: "block", padding: "0 0 2rem" }}>
        <div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
            <p className="partner-eyebrow" style={{ margin: 0 }}>{text("Client proposal", "Пропозиція замовнику")}</p>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            {text(
              "Technologies that create Trust — the foundation of Trusted Consultancy",
              "Технології що створюють Довіру — фундамент Trusted Consultancy",
            )}
          </h1>

          {/* Executive context — Trust as foundation */}
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
                "Trust is not a static certificate — it is the operational infrastructure of professional advisory. In an era where direct unassisted trust between individuals is undermined by total information noise, we rely on a verified operational loop: people → trust → technology / AI → trust → people. The decisive advantage belongs to verified practitioners with transparent analytical evidence on board. This proposal outlines the foundational digital instrument enabling the Institute to convene, mobilise, and evidence trusted expertise across its network.",
                "Довіра — це не статичний сертифікат, а фундаментальна інфраструктура фахового консалтингу. В епоху, коли прямий зв'язок «люди – довіра – люди» знецінюється тотальним інформаційним шумом, ми спираємося на замкнений операційний цикл: люди → довіра → технології / ШІ → довіра → люди. Вирішальна перевага належить колегіальному тандему верифікованих експертів із прозорим аналітичним інструментарієм на борту. Ця пропозиція описує базовий цифровий інструмент, що дозволяє Інституту збирати, мобілізувати та доказово підтверджувати експертизу в масштабах усієї мережі.",
              )}
            </p>
          </div>

          <div
            className="partner-lede partner-question-plaque"
            style={{
              maxWidth: 860,
              marginTop: "1.25rem",
              padding: "1.25rem 1.5rem",
              borderLeft: "5px solid var(--brass, #c8901a)",
              borderRadius: "0 8px 8px 0",
              background: "color-mix(in oklab, var(--brass, #c8901a) 14%, var(--card, #f2eadb))",
              fontSize: "1.02rem",
              lineHeight: 1.6,
            }}
          >
            <p style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: "0.6rem", color: "#0a2e24" }}>
              {text("The question was: what comes next?", "Ви питали, що далі.")}
            </p>
            <p style={{ marginBottom: "0.6rem", color: "#0a2e24", fontSize: "1.02rem", lineHeight: 1.6 }}>
              {text(
                "We may continue appraising individual experts with the same meticulous care — yet what if the Institute were equipped with an authoritative platform enabling active collaboration, verifiable contribution records, and collective intelligence across the entire expert network?",
                "Можна й надалі індивідуально та ретельно оцінювати експертів по одному — але що якби Інститут отримав авторитетну платформу для активної взаємодії, фіксації внесків та колективного інтелекту всієї мережі?",
              )}
            </p>
            <p style={{ color: "#0a2e24", fontSize: "1.02rem", lineHeight: 1.6, margin: 0 }}>
              {text(
                "This proposal introduces an interactive collegiate workflow rather than an inert register: an operational surface to convene network expertise, assemble multidisciplinary project commissions, record peer contributions, illuminate institutional capacity, and advance thought leadership — with AI-verified evidence at every stage.",
                "Ця пропозиція — інтерактивний воркфлоу, а не чергова таблиця: робоча поверхня для збору мережевої експертизи, формування проєктних груп, обліку внесків, унаочнення потенціалу та лідерства думок — з верифікацією фактів за допомогою ШІ на кожному етапі.",
              )}
            </p>
          </div>
        </div>
      </header>

      <section className="partner-view" aria-labelledby="client-preview-heading">
        <section className="client-preview-section" aria-labelledby="client-preview-heading" style={{ marginTop: "4rem" }}>
          <div className="partner-section-heading" style={{ margin: "4rem 0" }}>
            <span>01</span>
            <div>
              <h2 id="client-preview-heading">
                {text("Operational Capabilities", "Що ви зможете робити")}
              </h2>
              <p>
                {text(
                  "These design sketches illustrate key navigational pathways within the interactive prototype. This represents an exploratory architectural model rather than a finalised commercial service or private member portal.",
                  "Ці ескізи показують шляхи в прототипі. Це ще не готовий сервіс і не особистий вхід для членів.",
                )}
              </p>
            </div>
          </div>
          <div className="client-preview-grid">
            <article className="partner-card client-preview-card">
              <div className="client-preview-window" aria-hidden="true">
                <div className="client-preview-toolbar">
                  <span>ISRM / EXPERT NETWORK</span>
                  <span className="client-preview-status">SEARCH</span>
                </div>
                <div className="client-preview-search">
                  <Search size={15} />
                  <span>{text("Search and filter expertise", "Пошук і фільтри експертизи")}</span>
                </div>
                <div className="client-preview-network">
                  <i /><i /><i /><i /><i /><b /><b /><b />
                </div>
              </div>
              <h3>{text("Search", "Пошук")}</h3>
              <section className="partner-value-unlocks" aria-label={text("What search lets you do", "Що дає пошук")}>
                <ul>
                  <li>{text("Filter by sector, jurisdiction, and professional tenure whilst preserving individual anonymity", "Фільтрувати за сектором, регіоном і досвідом, не показуючи, хто це")}</li>
                  <li>{text("Survey the fellowship's capabilities prior to initiating direct contact", "Переглядати мережу, перш ніж вирішите, до кого звертатись")}</li>
                  <li>{text("Identify capacity constraints across specialised sectors prior to convening working groups", "Бачити, в яких секторах мало людей, перш ніж збирати групу")}</li>
                  <li>{text("Align specialist competencies precisely with client mandate requirements", "Добирати людей під те, чого справді потребує проєкт")}</li>
                  <li>{text("Compile a vetted shortlist of distinguished practitioners prior to formal engagement", "Скласти короткий список з кількох експертів, перш ніж писати їм")}</li>
                </ul>
              </section>
            </article>

            <article className="partner-card client-preview-card">
              <div className="client-preview-window client-preview-services" aria-hidden="true">
                <div className="client-preview-toolbar">
                  <span>FUNCTIONS / MVP</span>
                  <span className="client-preview-status">SELECT</span>
                </div>
                <div className="client-preview-function"><span /><span>MVP Application</span></div>
                <div className="client-preview-function"><span /><span>Expert discussions</span></div>
                <div className="client-preview-function"><span /><span>Reports & Publications</span></div>
              </div>
              <h3>{text("Services", "Сервіси")}</h3>
              <section className="partner-value-unlocks">
                <ul>
                  <li>{text("Convene an interdisciplinary panel from identified experts under explicit terms of reference", "Зібрати проєктну групу з знайдених експертів і дати їй чітку мету")}</li>
                  <li>{text("Monitor accepted deliverables and review the analytical output generated by each expert panel", "Бачити, які задачі прийнято і що зробив кожен експерт і кожна група")}</li>
                  <li>{text("Direct targeted communications to specific panels rather than broadcasting across the fellowship", "Писати обраній групі, а не всім поспіль")}</li>
                  <li>{text("Maintain an auditable ledger of intellectual contributions and peer reviews", "Зберігати запис, що саме зробив кожен учасник робочої групи")}</li>
                  <li>{text("Facilitate dedicated enquiries with structured briefs and tangible institutional outcomes", "Вести робочу групу з теми, з чітким завданням і чітким результатом")}</li>
                </ul>
              </section>
            </article>

            <article className="partner-card client-preview-card">
              <div className="client-preview-window client-preview-dependencies" aria-hidden="true">
                <div className="client-preview-toolbar">
                  <span>FUNCTIONS / DEPENDENCIES</span>
                  <GitBranch size={14} />
                </div>
                {dependencyEdges.map(({ prerequisite, feature }) => (
                  <div className="client-preview-edge" key={`${prerequisite.id}-${feature.id}`}>
                    <span>{prerequisite.title[uk ? "uk" : "en"]}</span>
                    <span aria-hidden="true">→</span>
                    <span>{feature.title[uk ? "uk" : "en"]}</span>
                  </div>
                ))}
              </div>
              <h3>{text("What depends on what", "Що від чого залежить")}</h3>
              <section className="partner-value-unlocks">
                <ul>
                  <li>{text("Introduce members to complementary services progressing naturally from established engagements", "Запропонувати членам наступний сервіс, від того, яким вони вже користуються")}</li>
                  <li>{text("Illuminate adjacent practices, enabling practitioners to contribute across multiple mandates", "Показати суміжні сервіси, щоб член міг узяти більше ніж один")}</li>
                  <li>{text("Expand member capabilities through sustained communities of practice and subsequent working panels", "Розширювати можливості членів через спільноти і робочі групи, які з цього випливають")}</li>
                  <li>{text("Institutionalise collective knowledge: rigorously review empirical evidence and formalise findings", "Зберігати те, чого навчилась мережа: разом переглянути докази і записати їх")}</li>
                  <li>{text("Enhance the Institute's public eminence: monitor citations and assess readiness for sector conferences", "Піднімати ім'я Інституту: стежити згадки в пресі і оцінити, чи готові ви до конференції")}</li>
                </ul>
              </section>
            </article>
          </div>
        </section>
      </section>
    </>
  );
}
