import { GitBranch, Search } from "lucide-react";
import { IsrmLogo } from "@/components/IsrmLogo";
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
      <header className="partner-header">
        <div>
          <div className="partner-logo-row mb-3" aria-label="ISRM">
            <IsrmLogo className="h-10 w-auto" />
          </div>
          <p className="partner-eyebrow">{text("Client proposal", "Пропозиція замовнику")}</p>
          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            {text(
              "AI OSINT and human appraisal — a space of experts with Trust and Influence",
              "ШІ OSINT та людська оцінка — простір експертів із довірою та впливом",
            )}
          </h1>
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
            <p style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: "0.6rem", color: "#064e3b" }}>
              {text("The question was: what comes next?", "Ви питали, що далі.")}
            </p>
            <p style={{ marginBottom: "0.6rem", color: "#132a22", fontSize: "1.02rem", lineHeight: 1.6 }}>
              {text(
                "We maintain the option of continuing to appraise individual experts with meticulous care; yet what if the Institute were equipped with an authoritative platform enabling active collaboration across the expert network?",
                "Можна й надалі індивідуально та ретельно оцінювати експертів по одному, але що якби ви отримали революційний інструмент взаємодії всередині експертної мережі?",
              )}
            </p>
            <p style={{ color: "#132a22", fontSize: "1.02rem", lineHeight: 1.6, margin: 0 }}>
              {text(
                "THIS time, I bring an interactive collegiate workflow rather than an inert register: an operational surface to convene network expertise, assemble multidisciplinary project commissions, record peer contributions, illuminate institutional capacity, and advance professional stewardship and thought leadership.",
                "Цього разу я пропоную інтерактивний воркфлоу експертної мережі, а не чергову відсортовану таблицю: робочу поверхню для залучення та збору мережевої експертизи: підбір потрібного експерта, формування проєктних груп, облік внесків, унаочнення капасіті, крос-сел, овер-сел, розвиток членства та лідерство думок.",
              )}
            </p>
          </div>
        </div>
        <div className="partner-header-status" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <a
            href="/partner"
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              padding: "0.4rem 0.75rem",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--foreground)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <span>{text("Partner Configurator", "Конфігуратор для партнерів")}</span>
            <span aria-hidden="true">↗</span>
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
