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
              {text("You asked what comes next.", "Ви питали, що далі.")}
            </p>
            <p style={{ marginBottom: "0.6rem", color: "#132a22", fontSize: "1.02rem", lineHeight: 1.6 }}>
              {text(
                "We have the option of continuing to individually assess experts in a thorough manner, but what if you could receive a game-changing tool enabling interaction within the expert network?",
                "Можна й надалі індивідуально та ретельно оцінювати експертів по одному, але що якби ви отримали революційний інструмент взаємодії всередині експертної мережі?",
              )}
            </p>
            <p style={{ color: "#132a22", fontSize: "1.02rem", lineHeight: 1.6, margin: 0 }}>
              {text(
                "THIS time, I will bring an interactive expert workflow—not another sorted spreadsheet: a surface for engagement and collecting network expertise: finding the right expert, blending project groups, tracking contributions, making capacity visible, cross-sell, over-sell, member development and thought leadership.",
                "Цього разу я пропоную інтерактивний воркфлоу експертної мережі, а не чергову відсортовану таблицю: робочу поверхню для залучення та збору мережевої експертизи: підбір потрібного експерта, формування проєктних груп, облік внесків, унаочнення капасіті, крос-сел, овер-сел, розвиток членства та лідерство думок.",
              )}
            </p>
          </div>
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
        </div>
      </header>

      <section className="partner-view" aria-labelledby="client-preview-heading">
        <section className="client-preview-section" aria-labelledby="client-preview-heading" style={{ marginTop: "2rem" }}>
          <div className="partner-section-heading" style={{ margin: "4rem 0" }}>
            <span>01</span>
            <div>
              <h2 id="client-preview-heading">
                {text("What you would be able to do", "Що ви зможете робити")}
              </h2>
              <p>
                {text(
                  "These pictures show the paths in the prototype. This is not yet a finished service, and it is not a private login for members.",
                  "Ці малюнки показують шляхи в прототипі. Це ще не готовий сервіс і не особистий вхід для членів.",
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
                  <li>{text("Filter by sector, region and experience without showing who the person is", "Фільтрувати за сектором, регіоном і досвідом, не показуючи, хто це")}</li>
                  <li>{text("Look through the network before you decide to approach anyone", "Переглядати мережу, перш ніж вирішите, до кого звертатись")}</li>
                  <li>{text("See which sectors are thin before you form a project group", "Бачити, в яких секторах мало людей, перш ніж збирати групу")}</li>
                  <li>{text("Match people to what a project actually needs", "Добирати людей під те, чого справді потребує проєкт")}</li>
                  <li>{text("Draw up a short list of several experts before you contact them", "Скласти короткий список з кількох експертів, перш ніж писати їм")}</li>
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
                  <li>{text("Form a project group from the experts you have found, and give it a clear aim", "Зібрати проєктну групу з знайдених експертів і дати їй чітку мету")}</li>
                  <li>{text("See which tasks have been accepted, and what each expert and each group has produced", "Бачити, які задачі прийнято і що зробив кожен експерт і кожна група")}</li>
                  <li>{text("Write to a chosen group, rather than to everyone", "Писати обраній групі, а не всім поспіль")}</li>
                  <li>{text("Keep a record of what each member of a working group has contributed", "Зберігати запис, що саме зробив кожен учасник робочої групи")}</li>
                  <li>{text("Run a working group on a set subject, with a clear brief and a clear result", "Вести робочу групу з теми, з чітким завданням і чітким результатом")}</li>
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
                  <li>{text("Offer members a further service, starting from the one they already use", "Запропонувати членам наступний сервіс, від того, яким вони вже користуються")}</li>
                  <li>{text("Show related services, so a member can take on more than one", "Показати суміжні сервіси, щоб член міг узяти більше ніж один")}</li>
                  <li>{text("Grow what members can do, through communities and working groups that follow", "Розширювати можливості членів через спільноти і робочі групи, які з цього випливають")}</li>
                  <li>{text("Keep what the network learns: review the evidence together and write it down", "Зберігати те, чого навчилась мережа: разом переглянути докази і записати їх")}</li>
                  <li>{text("Raise the Institute's profile: track mentions in the press, and judge whether you are ready for a conference", "Піднімати ім'я Інституту: стежити згадки в пресі і оцінити, чи готові ви до конференції")}</li>
                </ul>
              </section>
            </article>
          </div>
        </section>
      </section>
    </>
  );
}
