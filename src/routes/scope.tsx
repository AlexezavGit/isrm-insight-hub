import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ExternalLink, FileDown, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IsrmLogo } from "@/components/IsrmLogo";
import {
  CLIENT_OFFER_PACKAGES,
  CLIENT_CONSULTING_OPTION,
  CLIENT_PRICING_STATUS,
} from "@/lib/client-proposal-data";
import { CLIENT_OFFER_COMBINED_ESTIMATE } from "@/lib/proposal-data";
import { MARKET_BENCHMARKS } from "@/lib/proposal-data";
import { useI18n } from "@/lib/i18n";

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

function ScopePage() {
  const { locale, setLocale } = useI18n();
  const [budgetInput, setBudgetInput] = useState("");
  const [budgetChoice, setBudgetChoice] = useState<"approve" | "limit" | null>(null);
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

  const mvpPrice = CLIENT_OFFER_PACKAGES[0];
  const pilotPrice = CLIENT_OFFER_PACKAGES[1];

  const handleConfirmAndSend = () => {
    const scopeList = [
      uk ? "• MVP застосунку (включено)" : "• Application MVP (included)",
      pilotIncluded ? (uk ? "• Цикл залучення експертів" : "• Expert engagement cycle") : null,
      consultingIncluded ? (uk ? "• Консалтинг і стратегія" : "• Consulting & strategy") : null,
    ]
      .filter(Boolean)
      .join("\n");

    const budgetText =
      budgetChoice === "approve"
        ? uk
          ? "Погоджено індикативний діапазон"
          : "Approved indicative range"
        : budgetChoice === "limit" && budgetInput
        ? uk
          ? `Встановлено бюджетну стелю: ${budgetInput}`
          : `Budget ceiling: ${budgetInput}`
        : uk
        ? "Позиція щодо бюджету не вказана"
        : "Budget position not specified";

    const subject = encodeURIComponent(
      uk
        ? `ISRM Погодження обсягів та бюджету — ${pilotIncluded ? "MVP + Цикл залучення" : "MVP Застосунку"}`
        : `ISRM Scope & Budget Confirmation — ${pilotIncluded ? "MVP + Expert Cycle" : "Application MVP"}`
    );

    const body = encodeURIComponent(
      uk
        ? `Доброго дня,\n\nНадсилаю узгодження обсягів та бюджету для проєкту ISRM Ukraine Insight Hub:\n\n` +
            `ОБРАНИЙ ОБСЯГ (SCOPE):\n${scopeList}\n\n` +
            `ПОЗИЦІЯ ЩОДО БЮДЖЕТУ:\n${budgetText}\n\n` +
            `[До цього листа прикріплено експорт PDF]\n\nЗ повагою,\n`
        : `Hello,\n\nSubmitting preliminary scope and budget confirmation for ISRM Ukraine Insight Hub:\n\n` +
            `SELECTED SCOPE:\n${scopeList}\n\n` +
            `BUDGET POSITION:\n${budgetText}\n\n` +
            `[PDF export attached]\n\nBest regards,\n`
    );

    window.location.href = `mailto:alexezav@gmail.com,dmitrfilim@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className="partner-review client-proposal client-offer">
      <div className="partner-shell">
        {/* ── Header ────────────────────────────────────────────────── */}
        <header className="partner-header">
          <div>
            <div className="mb-3" aria-label="ISRM">
              <IsrmLogo className="h-9 w-auto" showSubtitle={true} />
            </div>
            <Button asChild variant="ghost" className="partner-back">
              <Link to="/" search={{ network: "true" }}>
                <ArrowLeft aria-hidden="true" className="mr-1 h-4 w-4" />
                {text("Back to graph", "До графа")}
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
              <button type="button" aria-pressed={!uk} className={!uk ? "is-active" : ""} onClick={() => setLocale("en")}>
                EN
              </button>
              <button type="button" aria-pressed={uk} className={uk ? "is-active" : ""} onClick={() => setLocale("uk")}>
                UA
              </button>
            </div>
            <span className="partner-badge">{text("Indicative · not a quote", "Індикативно · не оферта")}</span>
          </div>
        </header>

        {/* ── Main two-column layout: sections left, price right ─────── */}
        <div className="scope-layout">
          {/* LEFT: scope sections */}
          <div className="scope-sections">
            {/* Section 01 — MVP (always included, checked + disabled checkbox) */}
            <article className="scope-section scope-section--active" aria-labelledby="scope-mvp-heading">
              <div className="scope-section-header">
                <span className="scope-section-number">01</span>
                <div style={{ flex: 1 }}>
                  <h2 id="scope-mvp-heading" className="scope-section-title">
                    {text("Application MVP", "MVP застосунку")}
                  </h2>
                  <label className="scope-checkbox-label" style={{ cursor: "not-allowed", opacity: 0.9 }}>
                    <input type="checkbox" checked={true} disabled={true} className="scope-checkbox accent-primary" />
                    <span className="font-semibold text-primary">{text("Included (core)", "Включено (основа)")}</span>
                  </label>
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
                  ? [
                      "Пошук і фільтрування експертів",
                      "Відбір групи за метою",
                      "Перегляд профілю й доказів",
                      "Облік цілей і задач проєкту",
                      "Підготовка першого контакту",
                    ]
                  : [
                      "Expert search and filtering",
                      "Purpose-based group selection",
                      "Profile and evidence review",
                      "Project goal and task tracking",
                      "First contact preparation",
                    ]
                ).map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </article>

            {/* Section 02 — Engagement cycle (opt-in) */}
            <article className={`scope-section${pilotIncluded ? " scope-section--active" : ""}`} aria-labelledby="scope-pilot-heading">
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
                  "Recruitment campaigns, Trust & Influence Index co-design, structured working groups and a findings report. Optional after the MVP is accepted.",
                  "Кампанії залучення, спільне проєктування Trust & Influence Index, структуровані робочі групи та звіт. Опційно після прийняття MVP.",
                )}
              </p>
              <ul className="scope-feature-list">
                {(uk
                  ? [
                      "Кампанії залучення експертів",
                      "Спільне проєктування Trust & Influence Index",
                      "Тематичні робочі групи",
                      "Опитувальник спільноти",
                      "Публікації та звіт",
                    ]
                  : [
                      "Expert recruitment campaigns",
                      "Trust & Influence Index co-design",
                      "Agenda-based working groups",
                      "Community questionnaire",
                      "Publications and findings report",
                    ]
                ).map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </article>

            {/* Section 03 — Consulting (opt-in) */}
            <article className={`scope-section${consultingIncluded ? " scope-section--active" : ""}`} aria-labelledby="scope-consulting-heading">
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
                  "Strategic sessions, board preparation, expertise gap analysis and Trust & Influence Index framework co-design. Separately priced — not bundled into development.",
                  "Стратегічні сесії, підготовка борду, аналіз прогалин в експертизі та спільне проєктування рамки Trust & Influence Index. Окрема ціна — не включена у розробку.",
                )}
              </p>
              <ul className="scope-feature-list">
                {(uk
                  ? ["Аналіз прогалин в експертизі", "Фасилітація рішень борду", "Спільне проєктування рамки Trust & Influence Index"]
                  : ["Expertise gap analysis", "Board decision facilitation", "Trust & Influence Index framework co-design"]
                ).map((f) => (
                  <li key={f}>{f}</li>
                ))}
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

            {/* MVP price */}
            <div className="scope-price-row scope-price-row--mvp">
              <span className="scope-price-label">{text("MVP", "MVP")}</span>
              <span className="scope-price-value scope-price-value--active">
                {mvpPrice ? text("Up to", "До") + " " + money(mvpPrice.estimate.high.total) : "—"}
              </span>
            </div>

            {/* Pilot price */}
            <div className={`scope-price-row${pilotIncluded ? " scope-price-row--selected" : ""}`}>
              <span className="scope-price-label">{text("Engagement cycle", "Цикл залучення")}</span>
              <span className={`scope-price-value${pilotIncluded ? " scope-price-value--active" : ""}`}>
                {pilotPrice ? text("Up to", "До") + " " + money(pilotPrice.estimate.high.total) : "—"}
              </span>
            </div>

            {/* Consulting price */}
            <div className={`scope-price-row${consultingIncluded ? " scope-price-row--selected" : ""}`}>
              <span className="scope-price-label">{text("Consulting", "Консалтинг")}</span>
              <span className={`scope-price-value${consultingIncluded ? " scope-price-value--active" : ""}`}>
                {text("Separately quoted", "Окреме котирування")}
              </span>
            </div>

            {/* Total */}
            {(pilotIncluded || consultingIncluded) && (
              <div
                className="scope-price-row scope-price-row--selected"
                style={{ borderTop: "2px solid var(--color-border)", marginTop: "0.25rem", paddingTop: "0.75rem" }}
              >
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
                <input
                  type="radio"
                  name="budget-pos"
                  value="approve"
                  checked={budgetChoice === "approve"}
                  onChange={() => setBudgetChoice("approve")}
                  style={{ width: "1.1rem", height: "1.1rem", accentColor: "var(--color-primary)" }}
                />
                <span>{text("This range works for me", "Цей діапазон мені підходить")}</span>
              </label>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", cursor: "pointer", fontSize: "0.95rem" }}>
                <input
                  type="radio"
                  name="budget-pos"
                  value="limit"
                  checked={budgetChoice === "limit"}
                  onChange={() => setBudgetChoice("limit")}
                  style={{ width: "1.1rem", height: "1.1rem", accentColor: "var(--color-primary)", marginTop: "0.2rem" }}
                />
                <div style={{ flex: 1 }}>
                  <span>{text("Set a budget ceiling:", "Визначити бюджетну стелю:")}</span>
                  {budgetChoice === "limit" && (
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={text("e.g. $40,000", "напр. $40 000")}
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      aria-label={text("Budget ceiling", "Бюджетна стеля")}
                      style={{
                        display: "block",
                        width: "100%",
                        marginTop: "0.5rem",
                        padding: "0.5rem 0.75rem",
                        fontSize: "1rem",
                        border: "1.5px solid var(--color-border)",
                        borderRadius: "6px",
                        background: "var(--color-background)",
                        color: "var(--color-foreground)",
                        outline: "none",
                      }}
                      autoFocus
                    />
                  )}
                </div>
              </label>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {/* Save PDF Button */}
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="w-full flex items-center justify-center gap-2"
                style={{ fontSize: "0.95rem", padding: "0.75rem 1rem" }}
              >
                <FileDown className="h-4 w-4 text-primary" />
                {text("Save as PDF", "Зберегти в PDF")}
              </Button>

              {/* Confirm & Send Button via direct Mailto */}
              <Button
                onClick={handleConfirmAndSend}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold"
                style={{ fontSize: "1rem", padding: "0.85rem 1rem" }}
              >
                <Send className="h-4 w-4" />
                {text("Confirm & Send Email", "Підтвердити та відіслати email")}
              </Button>
            </div>

            <p className="text-[11px] text-muted-foreground mt-2 text-center">
              {text(
                "Direct email to alexezav@gmail.com and dmitrfilim@gmail.com. Attach the saved PDF to complete.",
                "Прямий лист на alexezav@gmail.com та dmitrfilim@gmail.com. Додайте збережений PDF до листа.",
              )}
            </p>

            <nav className="client-price-sources" style={{ marginTop: "1rem" }} aria-label={text("Rate sources", "Джерела ставок")}>
              <span>{text("Rate sources:", "Джерела ставок:")}</span>
              {MARKET_BENCHMARKS.sources
                .filter(({ label }) => label.startsWith("Clutch"))
                .map((s) => (
                  <a href={s.url} key={s.label} target="_blank" rel="noreferrer">
                    {s.label} <ExternalLink aria-hidden="true" />
                  </a>
                ))}
            </nav>
          </aside>
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <footer className="partner-footer">
          <div className="cta-bottom">
            <Button asChild variant="outline" className="button-outline">
              <Link to="/proposal">
                <ArrowLeft aria-hidden="true" className="mr-1.5 h-4 w-4" />
                {text("Back to proposal", "До пропозиції")}
              </Link>
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
      </div>
    </main>
  );
}
