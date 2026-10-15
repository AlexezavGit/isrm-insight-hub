import { GitBranch, Search } from "lucide-react";

type Props = {
  locale: "en" | "uk";
  text: (en: string, ua: string) => string;
  uk: boolean;
  setLocale: (locale: "en" | "uk") => void;
  dependencyEdges: Array<{ prerequisite: any; feature: any }>;
};

export function ClientProposalUpper({ text, uk, setLocale, dependencyEdges }: Props) {
  return (
    <>
      <header className="partner-header">
        <div>
          <div className="partner-logo-row" aria-label="ISRM">
            <img
              className="partner-isrm-logo"
              src="https://www.theisrm.org/wp-content/uploads/2025/02/isrm-logo.jpg"
              alt="ISRM"
              width={1000}
              height={552}
              style={{ display: "block", height: 52, width: "auto" }}
            />
          </div>
          <p className="partner-eyebrow">{text("Client proposal", "Пропозиція замовнику")}</p>
          <h1>
            {text(
              "AI, open-source intelligence, and human judgement — a place for experts the Institute can trust",
              "Штучний інтелект, відкриті джерела і людське судження — місце для експертів, яким Інститут може довіряти",
            )}
          </h1>
          <p
            className="partner-lede partner-question-plaque"
            style={{
              maxWidth: 820,
              marginTop: "1rem",
              padding: "0.9rem 1.1rem",
              borderLeft: "4px solid var(--brass, #c8901a)",
              borderRadius: "0 6px 6px 0",
              background: "color-mix(in oklab, var(--brass, #c8901a) 12%, var(--card, #f2eadb))",
              fontSize: "1.02rem",
              lineHeight: 1.55,
            }}
          >
            {text(
              "You asked what comes next. We can keep assessing experts one by one, as we do now. Or we can give the Institute a working tool — not another spreadsheet. With it you can find the right expert, form a project group, see what each person has contributed, and see what the network can take on. The same tool helps you offer members further work, help them develop, and publish what the network knows.",
              "Ви питали, що далі. Можна й надалі оцінювати експертів по одному, як зараз. Або дати Інституту робочий інструмент — не ще одну таблицю. Ним можна знайти потрібного експерта, зібрати проєктну групу, бачити внесок кожної людини і бачити, що мережа здатна взяти на себе. Той самий інструмент допомагає пропонувати членам подальшу роботу, розвивати їх і публікувати те, що знає мережа.",
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
        </div>
      </header>

      <section className="partner-view" aria-labelledby="client-offer-heading">
        <article className="partner-card client-offer-hero" id="client-offer-heading">
          <p className="partner-kicker">{text("The network today", "Мережа сьогодні")}</p>
          <p className="partner-body">
            {text(
              "The association now has 178 named contacts, 45 with a checked profile, and 8,742 followers on its LinkedIn page (the group has about 11,700). That is already a network. The first application is what turns those names into day-to-day work.",
              "Зараз в асоціації 178 названих контактів, 45 із перевіреним профілем і 8 742 підписники сторінки LinkedIn (у групі близько 11 700). Це вже мережа. Перший застосунок перетворює ці імена на щоденну роботу.",
            )}
          </p>
        </article>

        <section className="client-preview-section" aria-labelledby="client-preview-heading" style={{ marginTop: "3rem" }}>
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
              <p className="partner-muted">
                {text(
                  "Look through the people already on the graph. A match does not mean the person has agreed, is free, or is the right one for the job.",
                  "Переглянути людей, які вже є на графі. Збіг не означає, що людина згодна, вільна чи підходить для цієї роботи.",
                )}
              </p>
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
              <p className="partner-muted">
                {text(
                  "Look at the services and note what you want added or changed. This screen does not switch a live service on.",
                  "Переглянути сервіси і позначити, що додати чи змінити. Цей екран не вмикає живий сервіс.",
                )}
              </p>
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
              <p className="partner-muted">
                {text(
                  "See which services depend on others before you decide what the first stage should include.",
                  "Побачити, які сервіси залежать від інших, перш ніж вирішити, що входить у перший етап.",
                )}
              </p>
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
