import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CLIENT_OFFER_PACKAGES,
  CLIENT_CONSULTING_OPTION,
  CLIENT_PRICING_STATUS,
} from "@/lib/client-proposal-data";
import { CLIENT_OFFER_COMBINED_ESTIMATE } from "@/lib/proposal-data";
import { MARKET_BENCHMARKS } from "@/lib/proposal-data";
import { useI18n } from "@/lib/i18n";
import { ContactDialog } from "@/components/ContactDialog";

export const Route = createFileRoute("/scope")({
  head: () => ({
    meta: [
      { title: "ISRM — Scope & Budget" },
      {
        name: "description",
        content:
          "Review ISRM project scope and indicative budget. Select the sections that apply and indicate your budget position.",
      },
      { property: "og:title", content: "ISRM — Scope & Budget" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScopePage,
});

// The three scope sections
const SCOPE_SECTIONS = [
  {
    id: "mvp",
    number: "01",
    title: { en: "Application MVP", uk: "MVP застосунку" },
    included: true, // always on
    description: {
      en: "Expert search, group selection, project assignment, profile review and evidence record. The first useful standalone product — not a demo.",
      uk: "Пошук експертів, відбір групи, призначення до проєкту, перевірка профілю та запис доказів. Перший самостійно корисний продукт — не демо.",
    },
    features: {
      en: ["Expert search and filtering", "Purpose-based group selection", "Profile and evidence review", "Project goal and task tracking", "First contact preparation"],
      uk: ["Пошук і фільтрування експертів", "Відбір групи за метою", "Перегляд профілю й доказів", "Облік цілей і задач проєкту", "Підготовка першого контакту"],
    },
    packageIndex: 0,
  },
  {
    id: "pilot",
    number: "02",
    title: { en: "Expert engagement cycle", uk: "Цикл залучення експертів" },
    included: false, // opt-in
    description: {
      en: "Recruitment campaigns, TII co-design, structured working groups and a findings report. Optional after the MVP is accepted — requires a separate decision.",
      uk: "Кампанії залучення, спільне проєктування TII, структуровані робочі групи та звіт. Опційно після прийняття MVP — потребує окремого рішення.",
    },
    features: {
      en: ["Expert recruitment campaigns", "Trust & Influence Index co-design", "Agenda-based working groups", "Community questionnaire", "Publications and findings report"],
      uk: ["Кампанії залучення експертів", "Спільне проєктування TII", "Тематичні робочі групи", "Опитувальник спільноти", "Публікації та звіт"],
    },
    packageIndex: 1,
  },
  {
    id: "consulting",
    number: "03",
    title: { en: "Consulting & strategy", uk: "Консалтинг і стратегія" },
    included: false, // opt-in
    description: {
      en: "Strategic sessions to define expertise priorities, prepare the board for decisions and co-design the TII framework. A separate engagement — not bundled into development.",
      uk: "Стратегічні сесії для визначення пріоритетів експертизи, підготовки борду до рішень і спільного проєктування рамки TII. Окрема залученість — не включена у вартість розробки.",
    },
    features: {
      en: ["Expertise gap analysis", "Board decision facilitation", "TII framework co-design"],
      uk: ["Аналіз прогалин в експертизі", "Фасилітація рішень борду", "Спільне проєктування рамки TII"],
    },
    packageIndex: null, // consulting is separately priced
  },
] as const;

function ScopePage() {
  const { locale, setLocale } = useI18n();
  const [contactOpen, setContactOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [budgetChoice, setBudgetChoice] = useState<"approve" | "limit" | null>(null);
  // Which optional sections are checked
  const [pilotIncluded, setPilotIncluded] = useState(false);
  const [consultingIncluded, setConsultingIncluded] = useState(false);
  const uk = locale === "uk";
  const text = (en: string, ua: string) => (uk ? ua : en);

  const money = (value: number) =>
    new Intl.NumberFormat(uk ? "uk-UA" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  // Price visibility: MVP always shown (high contrast), others gain contrast when checked
  const mvpPrice = CLIENT_OFFER_PACKAGES[0];
  const pilotPrice = CLIENT_OFFER_PACKAGES[1];

  return (
    <main className="partner-review client-proposal client-offer">
      <div className="partner-shell">
        {/* ── Header ────────────────────────────────────────────────── */}
        <header className="partner-header">
          <div>
            <Button asChild variant="ghost" className="partner-back">
              <Link to="/proposal">
                <ArrowLeft aria-hidden="true" />
                {text("Back to the expert network", "До мережі експертів")}
              </Link>
            </Button>
            <p className="partner-eyebrow">{text("ISRM · Scope & Budget", "ISRM · Обсяг і бюджет")}</p>
            <h1>{text("What will be built — and what it costs", "Що буде побудовано — і скільки це коштує")}</h1>
            <p className="partner-lede">
              {text(
                "The MVP is included by default. Check the optional sections that fit your needs, then indicate your budget position.",
                "MVP включено за замовчуванням. Позначте опційні розділи, які відповідають вашим потребам, потім вкажіть свою позицію щодо бюджету.",
              )}
            </p>
          </div>
          <div className="partner-header-status">
            <div className="partner-locale-switch" role="group" aria-label={text("Page language", "Мова сторінки")}>
              <button type="button" aria-pressed={!uk} className={!uk ? "is-active" : ""} onClick={() => setLocale("en")}>EN</button>
              <button type="button" aria-pressed={uk} className={uk ? "is-active" : ""} onClick={() => setLocale("uk")}>UA</button>
            </div>
            <span className="partner-badge">{text("Indicative · not a quote", "Індикативно · не оферта")}</span>
          </div>
        </header>

        {/* ── Main two-column layout: sections left, price right ─────── */}
        <div className="scope-layout">

          {/* LEFT: scope sections */}
          <div className="scope-sections">

            {/* Section 01 — MVP (always included, no checkbox) */}
            <article className="scope-section scope-section--active" aria-labelledby="scope-mvp-heading">
              <div className="scope-section-header">
                <span className="scope-section-number">01</span>
                <div>
                  <h2 id="scope-mvp-heading" className="scope-section-title">
                    {text("Application MVP", "MVP застосунку")}
                  </h2>
                  <span className="scope-section-badge scope-section-badge--included">
                    {text("Included", "Включено")}
                  </span>
                </div>
              </div>
              <p className="scope-section-desc">
                {text(
                  "Expert search, group selection, project assignment, profile review and evidence record. The first useful standalone product.",
                  "Пошук експертів, відбір групи, призначення до проєкту, перевірка профілю та запис доказів. Перший самостійно корисний продукт.",
                )}
              </p>
              <ul className="scope-feature-list">
                {(uk
                  ? ["Пошук і фільтрування експертів", "Відбір групи за метою", "Перегляд профілю й доказів", "Облік цілей і задач проєкту", "Підготовка першого контакту"]
                  : ["Expert search and filtering", "Purpose-based group selection", "Profile and evidence review", "Project goal and task tracking", "First contact preparation"]
                ).map((f) => <li key={f}>{f}</li>)}
              </ul>
            </article>

            {/* Section 02 — Engagement cycle (opt-in) */}
            <article
              className={`scope-section${pilotIncluded ? " scope-section--active" : ""}`}
              aria-labelledby="scope-pilot-heading"
            >
              <div className="scope-section-header">
                <span className="scope-section-number">02</span>
                <div style={{ flex: 1 }}>
                  <label className="scope-section-label" htmlFor="include-pilot">
                    <h2 id="scope-pilot-heading" className="scope-section-title">
                      {text("Expert engagement cycle", "Цикл залучення експертів")}
                    </h2>
                  </label>
                  <label className="scope-checkbox-label" htmlFor="include-pilot">
                    <input
                      id="include-pilot"
                      type="checkbox"
                      checked={pilotIncluded}
                      onChange={(e) => setPilotIncluded(e.target.checked)}
                      className="scope-checkbox"
                    />
                    <span>{text("Include in scope", "Включити до scope")}</span>
                  </label>
                </div>
              </div>
              <p className="scope-section-desc">
                {text(
                  "Recruitment campaigns, TII co-design, structured working groups and a findings report. Optional after the MVP is accepted.",
                  "Кампанії залучення, спільне проєктування TII, структуровані робочі групи та звіт. Опційно після прийняття MVP.",
                )}
              </p>
              <ul className="scope-feature-list">
                {(uk
                  ? ["Кампанії залучення експертів", "Спільне проєктування TII", "Тематичні робочі групи", "Опитувальник спільноти", "Публікації та звіт"]
                  : ["Expert recruitment campaigns", "Trust & Influence Index co-design", "Agenda-based working groups", "Community questionnaire", "Publications and findings report"]
                ).map((f) => <li key={f}>{f}</li>)}
              </ul>
            </article>

            {/* Section 03 — Consulting (opt-in, single checkbox → immediate price) */}
            <article
              className={`scope-section${consultingIncluded ? " scope-section--active" : ""}`}
              aria-labelledby="scope-consulting-heading"
            >
              <div className="scope-section-header">
                <span className="scope-section-number">03</span>
                <div style={{ flex: 1 }}>
                  <label className="scope-section-label" htmlFor="include-consulting">
                    <h2 id="scope-consulting-heading" className="scope-section-title">
                      {text("Consulting & strategy", "Консалтинг і стратегія")}
                    </h2>
                  </label>
                  <label className="scope-checkbox-label" htmlFor="include-consulting">
                    <input
                      id="include-consulting"
                      type="checkbox"
                      checked={consultingIncluded}
                      onChange={(e) => setConsultingIncluded(e.target.checked)}
                      className="scope-checkbox"
                    />
                    <span>{text("Include in scope", "Включити до scope")}</span>
                  </label>
                </div>
              </div>
              <p className="scope-section-desc">
                {text(
                  "Strategic sessions, board preparation, expertise gap analysis and TII framework co-design. Separately priced — not bundled into development.",
                  "Стратегічні сесії, підготовка борду, аналіз прогалин в експертизі та спільне проєктування рамки TII. Окрема ціна — не включена у розробку.",
                )}
              </p>
              <ul className="scope-feature-list">
                {(uk
                  ? ["Аналіз прогалин в експертизі", "Фасилітація рішень борду", "Спільне проєктування рамки TII"]
                  : ["Expertise gap analysis", "Board decision facilitation", "TII framework co-design"]
                ).map((f) => <li key={f}>{f}</li>)}
              </ul>
              {consultingIncluded && (
                <p className="partner-muted" style={{ marginTop: "0.75rem", fontSize: "0.875rem" }}>
                  {CLIENT_CONSULTING_OPTION[uk ? "uk" : "en"]}
                </p>
              )}
            </article>
          </div>

          {/* RIGHT: price panel */}
          <aside className="scope-price-panel" aria-label={text("Indicative budget", "Індикативний бюджет")}>
            <p className="tech-label text-primary" style={{ marginBottom: "1rem" }}>
              {text("Indicative budget ceiling", "Індикативна верхня межа")}
            </p>

            {/* MVP price — always high contrast */}
            <div className={`scope-price-row scope-price-row--mvp`}>
              <span className="scope-price-label">{text("MVP", "MVP")}</span>
              <span className="scope-price-value scope-price-value--active">
                {mvpPrice ? text("Up to", "До") + " " + money(mvpPrice.estimate.high.total) : "—"}
              </span>
            </div>

            {/* Pilot price — gains contrast when checked */}
            <div className={`scope-price-row${pilotIncluded ? " scope-price-row--selected" : ""}`}>
              <span className="scope-price-label">{text("Engagement cycle", "Цикл залучення")}</span>
              <span className={`scope-price-value${pilotIncluded ? " scope-price-value--active" : ""}`}>
                {pilotPrice ? text("Up to", "До") + " " + money(pilotPrice.estimate.high.total) : "—"}
              </span>
            </div>

            {/* Consulting price — gains contrast when checked */}
            <div className={`scope-price-row${consultingIncluded ? " scope-price-row--selected" : ""}`}>
              <span className="scope-price-label">{text("Consulting", "Консалтинг")}</span>
              <span className={`scope-price-value${consultingIncluded ? " scope-price-value--active" : ""}`}>
                {text("Separately quoted", "Окреме котирування")}
              </span>
            </div>

            {/* Total — shown when at least one optional section selected */}
            {(pilotIncluded || consultingIncluded) && (
              <div className="scope-price-row scope-price-row--selected" style={{ borderTop: "2px solid var(--color-border)", marginTop: "0.25rem", paddingTop: "0.75rem" }}>
                <span className="scope-price-label" style={{ fontWeight: 600, color: "var(--color-foreground)" }}>
                  {text("Total (MVP + selected)", "Разом (MVP + обране)")}
                </span>
                <span className="scope-price-value scope-price-value--active">
                  {pilotIncluded
                    ? text("Up to", "До") + " " + money(CLIENT_OFFER_COMBINED_ESTIMATE.high.total)
                    : text("Up to", "До") + " " + money(mvpPrice?.estimate.high.total ?? 0)}
                </span>
              </div>
            )}
            <div className="scope-price-divider" aria-hidden="true" />

            <p className="partner-muted" style={{ fontSize: "0.78rem", lineHeight: "1.5", marginBottom: "1.5rem" }}>
              {text(
                "Upper bound planning scenarios only. Rate inputs unverified. Hosting, AI/API and legal costs excluded.",
                "Лише верхня межа планувального сценарію. Ставки не перевірені. Хостинг, AI/API та юридичні витрати виключені.",
              )}
            </p>

            {/* Budget position */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                {text("Your budget position:", "Ваша позиція щодо бюджету:")}
              </p>
              <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontSize: "0.95rem" }}>
                <input type="radio" name="budget-pos" value="approve" checked={budgetChoice === "approve"} onChange={() => setBudgetChoice("approve")}
                  style={{ width: "1.1rem", height: "1.1rem", accentColor: "var(--color-primary)" }} />
                <span>{text("This range works for me", "Цей діапазон мені підходить")}</span>
              </label>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", cursor: "pointer", fontSize: "0.95rem" }}>
                <input type="radio" name="budget-pos" value="limit" checked={budgetChoice === "limit"} onChange={() => setBudgetChoice("limit")}
                  style={{ width: "1.1rem", height: "1.1rem", accentColor: "var(--color-primary)", marginTop: "0.2rem" }} />
                <div style={{ flex: 1 }}>
                  <span>{text("Set a budget ceiling:", "Визначити бюджетну стелю:")}</span>
                  {budgetChoice === "limit" && (
                    <input
                      type="text" inputMode="numeric"
                      placeholder={text("e.g. $40,000", "напр. $40 000")}
                      value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)}
                      aria-label={text("Budget ceiling", "Бюджетна стеля")}
                      style={{ display: "block", width: "100%", marginTop: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "1rem",
                        border: "1.5px solid var(--color-border)", borderRadius: "6px",
                        background: "var(--color-background)", color: "var(--color-foreground)", outline: "none" }}
                      autoFocus
                    />
                  )}
                </div>
              </label>
            </div>

            <Button
              onClick={() => setContactOpen(true)}
              disabled={!budgetChoice}
              style={{ width: "100%", fontSize: "1rem", padding: "0.8rem 1rem" }}
            >
              {budgetChoice === "approve"
                ? text("Confirm & Send", "Підтвердити та відіслати")
                : budgetChoice === "limit"
                ? text("Confirm & Send", "Підтвердити та відіслати")
                : text("Select a budget position above", "Оберіть позицію вище")}
            </Button>

            <nav className="client-price-sources" style={{ marginTop: "1rem" }} aria-label={text("Rate sources", "Джерела ставок")}>
              <span>{text("Rate sources:", "Джерела ставок:")}</span>
              {MARKET_BENCHMARKS.sources.filter(({ label }) => label.startsWith("Clutch")).map((s) => (
                <a href={s.url} key={s.label} target="_blank" rel="noreferrer">{s.label} <ExternalLink aria-hidden="true" /></a>
              ))}
            </nav>
          </aside>
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <footer className="partner-footer">
          <div className="cta-bottom">
            <Button asChild variant="outline" className="button-outline">
              <Link to="/proposal">{text("Back to the expert network", "До мережі експертів")}</Link>
            </Button>
          </div>
          <p className="partner-footer-route-notice" role="note">
            {text(
              "Indicative ranges are planning references. First payment is at least 30% of the agreed total.",
              "Індикативні діапазони — планувальні орієнтири. Перший платіж — не менше 30% від погодженої суми.",
            )}
          </p>
          <p className="partner-muted" style={{ fontSize: "0.78rem", marginTop: "0.5rem" }}>
            {CLIENT_PRICING_STATUS[uk ? "uk" : "en"]}
          </p>
        </footer>

        <ContactDialog
          open={contactOpen}
          onOpenChange={setContactOpen}
          locale={locale}
          budgetNote={
            budgetChoice === "approve"
              ? text("Budget: approved as presented", "Бюджет: погоджено як представлено") +
                (pilotIncluded ? text(" + engagement cycle", " + цикл залучення") : "") +
                (consultingIncluded ? text(" + consulting", " + консалтинг") : "")
              : budgetChoice === "limit" && budgetInput
              ? `${text("Budget ceiling:", "Бюджетна стеля:")} ${budgetInput}` +
                (pilotIncluded ? text(" + engagement cycle", " + цикл залучення") : "") +
                (consultingIncluded ? text(" + consulting", " + консалтинг") : "")
              : undefined
          }
        />
      </div>
    </main>
  );
}
