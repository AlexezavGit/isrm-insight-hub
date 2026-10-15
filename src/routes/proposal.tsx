import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, GitBranch, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROPOSAL_FUNCTIONS } from "@/lib/proposal-data";
import { useI18n } from "@/lib/i18n";
import { EntryFrame } from "@/components/EntryFrame";

export const Route = createFileRoute("/proposal")({
  beforeLoad: () => {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("isrm-visited", "1");
    }
  },
  head: () => ({
    meta: [
      { title: "ISRM — Client proposal" },
      {
        name: "description",
        content:
          "A concise client proposal for the ISRM expert-network MVP and optional expert-community cycle.",
      },
      { property: "og:title", content: "ISRM — Client proposal" },
      {
        property: "og:description",
        content: "Explore the expert workflow, pilot outcomes and indicative package ranges.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClientProposal,
});

function ClientProposal() {
  const { locale, setLocale } = useI18n();
  const uk = locale === "uk";
  const text = (en: string, ua: string) => (uk ? ua : en);
  const dependencyEdges = PROPOSAL_FUNCTIONS.flatMap((feature) =>
    feature.dependencies.flatMap((dependencyId) => {
      const prerequisite = PROPOSAL_FUNCTIONS.find((item) => item.id === dependencyId);
      return prerequisite ? [{ prerequisite, feature }] : [];
    }),
  ).slice(0, 3);

  return (
    <main className="partner-review client-proposal client-offer">
      <div className="partner-shell">
        <header className="partner-header">
          <div>
            <div className="partner-logo-row" aria-label="ISRM">
              <svg
                className="partner-isrm-logo"
                viewBox="0 0 120 28"
                width="120"
                height="28"
                role="img"
                aria-label="ISRM"
              >
                <title>ISRM</title>
                <text
                  x="0"
                  y="22"
                  fontFamily="Space Grotesk, Montserrat, ui-sans-serif, system-ui, sans-serif"
                  fontWeight="700"
                  fontSize="26"
                  letterSpacing="0.04em"
                  fill="currentColor"
                >
                  ISRM
                </text>
              </svg>
            </div>
            <p className="partner-eyebrow">
              {text("Client proposal", "Пропозиція замовнику")}
            </p>
            <h1>
              {text(
                "AI OSINT and human appraisal — a space of experts with Trust and Influence",
                "AI OSINT і людська оцінка — простір експертів із Trust and Influence",
              )}
            </h1>
            <p className="partner-lede partner-question-plaque">
              {text(
                "The question was: what's next? We can keep assessing experts one by one. Or we can give the network a tool for interaction — not another sorted spreadsheet, but a surface for engagement: finding the right expert, forming project groups, tracking contributions, making capacity visible, cross-sell, over-sell, member development and thought leadership.",
                "Питання було: що далі? Можна й далі оцінювати експертів по одному. Або дати мережі інструмент взаємодії — не ще одну впорядковану таблицю, а поверхню для залучення: знаходити потрібного експерта, формувати проєктні групи, відстежувати внески, робити видимим потенціал, крос-селл, овер-селл, розвиток членів і thought leadership.",
              )}
            </p>
          </div>
          <div className="partner-header-status">
            <div
              className="partner-locale-switch"
              role="group"
              aria-label={text("Page language", "Мова сторінки")}
            >
              <button
                type="button"
                aria-pressed={!uk}
                className={!uk ? "is-active" : ""}
                onClick={() => setLocale("en")}
              >
                EN
              </button>
              <button
                type="button"
                aria-pressed={uk}
                className={uk ? "is-active" : ""}
                onClick={() => setLocale("uk")}
              >
                UA
              </button>
            </div>
          </div>
        </header>

        <section className="partner-view" aria-labelledby="client-offer-heading">
          <article className="partner-card client-offer-hero" id="client-offer-heading">
            <p className="partner-kicker">
              {text("Network baseline", "Базовий стан мережі")}
            </p>
            <p className="partner-body">
              {text(
                "Today the association has 178 identified contacts, 45 with verified profiles, and a LinkedIn Page of 8,742 followers (group ~11,700). That is a network. The MVP application is the surface that turns it into systematic work.",
                "Сьогодні асоціація має 178 ідентифікованих контактів, 45 із верифікованими профілями та LinkedIn Page 8 742 підписники (група ~11 700). Це мережа. MVP-застосунок — поверхня, яка перетворює її на системну роботу.",
              )}
            </p>
          </article>

          {/* FULL_BODY_PLACEHOLDER — remaining sections restored from local patch in next step if truncated */}

          <EntryFrame locale={locale} />

          <footer className="partner-footer">
            <div className="cta-bottom">
              <Button asChild variant="default" className="button-outline">
                <Link to="/scope">
                  {text("See scope & budget →", "Переглянути обсяг і ціну →")}
                </Link>
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
        </section>
      </div>
    </main>
  );
}
