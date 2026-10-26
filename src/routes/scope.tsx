import { createFileRoute, Link } from "@tanstack/react-router";
import { CoreServiceDeck, WorkflowDeck } from "@/components/ScopeCardDecks";
import { DataUseNotice } from "@/components/DataUseNotice";
import { useState } from "react";
import { ArrowLeft, Download, Mail, Printer, Copy } from "lucide-react";
import { useClientDraft } from "@/components/ClientDraftProvider";
import { ClientAccessibility } from "@/components/ClientAccessibility";
import { AccessControl } from "@/components/AppShell";
import { useI18n } from "@/lib/i18n";
import { CLIENT_SERVICES, CLIENT_WORKFLOWS } from "@/lib/client-catalog";
import { CLIENT_APPROVED_PRICES, clientQuote } from "@/lib/client-pricing";
import { BRIEFING_MILESTONES } from "@/lib/briefing-milestones";
import { buildClientSummary, emailHref } from "@/lib/client-draft";
export const Route = createFileRoute("/scope")({
  head: () => ({
    meta: [
      { title: "ISRM · Scope & budget discussion" },
      {
        name: "description",
        content:
          "Review your selected services, workflows, custom needs and budget position before requesting a detailed proposal.",
      },
    ],
  }),
  component: ScopePage,
});
function ScopePage() {
  const { draft, update, ready } = useClientDraft();
  const { locale } = useI18n();
  const uk = locale === "uk";
  const t = (en: string, ua: string) => (uk ? ua : en);
  const [notice, setNotice] = useState("");
  const quote = clientQuote(draft);
  const money = (value: number | null) =>
    value === null
      ? t("Pending approval", "Очікує погодження")
      : new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "en-GB", {
          style: "currency",
          currency: CLIENT_APPROVED_PRICES.currency,
          maximumFractionDigits: 0,
        }).format(value);
  const summary = buildClientSummary(draft, locale);
  const validLimit =
    draft.budgetPosition !== "limit" ||
    (Number(draft.budgetCeiling) > 0 && Number.isFinite(Number(draft.budgetCeiling)));
  const download = () => {
    const url = URL.createObjectURL(new Blob([summary], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "ISRM-scope-request.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <main className="client-scope scope-card-cabinet">
      <header className="client-topbar">
        <Link to="/proposal" className="client-wordmark">
          ISRM <span>INSIGHT HUB</span>
        </Link>
        <div className="client-topbar-actions">
          <ClientAccessibility />
          <AccessControl />
        </div>
      </header>
      <div className="client-scope-shell">
        <Link className="client-back-link" to="/" search={{ view: "map" }}>
          <ArrowLeft size={18} />
          {t("Back to the network", "До мережі")}
        </Link>
        <header className="client-slide-topline scope-page-title">
          <div>
            <p className="client-eyebrow">
              {t("A basis for our next conversation", "Основа наступної розмови")}
            </p>
            <h1>
              {t(
                "A project to develop safer professional communication and strengthen trust in network expertise across ISRM’s sphere of influence.",
                "Проєкт із розвитку безпеки професійних комунікацій та зміцнення довіри до носіїв мережевої експертизи в зоні впливу ISRM.",
              )}
            </h1>
          </div>
        </header>
        <p className="scope-project-subtitle">
          {t(
            "Agreement on digital application capabilities, stages and limits",
            "Погодження функціональності цифрового додатку, етапів та лімітів",
          )}
        </p>
        <section className="scope-trust-mandate">
          <p className="scope-trust-slogan">
            {t(
              "Trust is a mandate in trusted consultancy.",
              "Довіра — це мандат для сектору trusted consultancy.",
            )}
          </p>
          <p>
            {t(
              "That mandate can change with the outcomes of interaction and the evidence that supports or challenges it. Timely awareness and verified information underpin trusted consultancy.",
              "Цей мандат може змінюватися залежно від результатів взаємодії та даних, що підтверджують або спростовують підстави для довіри. Своєчасна поінформованість і перевірені дані — основа trusted consultancy.",
            )}
          </p>
        </section>
        <p className="client-lede">
          {t(
            "The project combines data verification, research and the development of network expertise with safer professional communication and the automation of agreed routine operations. AI assists research, completeness checks and the identification of insights and effective practices; professional review remains essential. AI-generated misinformation makes the provenance and verification of evidence increasingly valuable.",
            "Проєкт поєднує перевірку даних, дослідження й розвиток мережевої експертизи з безпечнішою професійною комунікацією та автоматизацією погоджених рутинних операцій. ШІ допомагає досліджувати, перевіряти повноту даних, знаходити інсайти й ефективні практики; професійна перевірка висновків залишається необхідною. Поширення згенерованої ШІ дезінформації посилює значення походження й верифікації доказів.",
          )}
        </p>
        <DataUseNotice context="scope" />
        <div className="client-scope-grid scope-linear-layout">
          <div>
            <CoreServiceDeck locale={locale} draft={draft} ready={ready} update={update} />
            <WorkflowDeck locale={locale} draft={draft} ready={ready} update={update} />
            <section className="client-scope-card">
              <h2>
                {t(
                  "Client-described service capabilities and workflows",
                  "Описані замовником сервісні функціональності та workflow",
                )}{" "}
                ({draft.requests.length})
              </h2>
              <label className="client-route-choice">
                <input
                  type="checkbox"
                  checked={draft.customIncluded && draft.mode === "full"}
                  disabled={!ready || draft.mode !== "full" || !draft.requests.length}
                  onChange={(e) => update({ customIncluded: e.target.checked })}
                />
                <span>
                  {t(
                    "Include the described functions and workflows in the estimate",
                    "Включити описані функції та workflow до оцінки",
                  )}
                </span>
              </label>
              {draft.mode !== "full" && draft.requests.length > 0 && (
                <p className="client-notice">
                  {t(
                    "Retained for reference; excluded from the selected simpler route.",
                    "Збережено для довідки; не входить до обраного спрощеного варіанта.",
                  )}
                </p>
              )}
              {draft.requests.length ? (
                draft.requests.map((r) => (
                  <article key={r.id}>
                    <h3>{r.title}</h3>
                    <p className="client-prewrap">{r.description}</p>
                    <button
                      className="client-text-button"
                      onClick={() =>
                        update({ requests: draft.requests.filter((x) => x.id !== r.id) })
                      }
                    >
                      {t("Remove", "Видалити")}
                    </button>
                  </article>
                ))
              ) : (
                <p>
                  {t(
                    "No additional requests yet. You can describe a service or a complete workflow in the configuration panel.",
                    "Додаткових запитів поки немає. Можна описати сервіс або повний workflow у панелі конфігурації.",
                  )}
                </p>
              )}
            </section>
            <section className="client-scope-card scope-next-iteration">
              <p className="client-eyebrow">
                {t("Possible second iteration", "Можлива друга ітерація")}
              </p>
              <h2>
                {t(
                  "Connect the tools that already do the job",
                  "Підключити інструменти, які вже виконують цю роботу",
                )}
              </h2>
              <p>
                {t(
                  "Project planning, time management, task progress and operational reporting can connect to an existing management system. Discovery, licences and integration would have a separate scope and budget; they are outside this core estimate.",
                  "Планування проєктів, тайм-менеджмент, контроль задач та операційну звітність можна підключити через наявну систему управління. Обстеження, ліцензії й інтеграція матимуть окремий обсяг та бюджет; до поточної оцінки ядра вони не входять.",
                )}
              </p>
            </section>
            <section className="client-scope-card">
              <h2>{t("Proposed delivery stages", "Запропоновані етапи виконання")}</h2>
              <ol className="client-milestones">
                {BRIEFING_MILESTONES.map((step) => (
                  <li key={step.id}>
                    <span>{Math.round(step.fraction * 100)}%</span>
                    <div>
                      <h3>{step.title[locale]}</h3>
                      <p>{step.detail[locale]}</p>
                      <ul>
                        {step.results[locale].map((result) => (
                          <li key={result}>{result}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="client-note">
                {t(
                  "Proposed payment shares, subject to the final agreement. They are delivery stages, not separate feature packages.",
                  "Частки платежів пропонуються для остаточної угоди. Це етапи виконання, а не окремі функціональні пакети.",
                )}
              </p>
            </section>
            <section className="client-scope-card scope-fallback">
              <p className="client-eyebrow">
                {t("A smaller starting point", "Менший стартовий обсяг")}
              </p>
              <h2>{t("Graph & search", "Граф і пошук")}</h2>
              <p>
                {t(
                  "A standalone route on the existing foundation: explore the supplied sample, search and prepare a working shortlist. Additional capabilities can be discussed separately.",
                  "Самостійний варіант на наявній основі: перегляд переданої вибірки, пошук і підготовка робочого списку. Додаткові можливості можна обговорити окремо.",
                )}
              </p>
              <footer className="scope-block-decision">
                <Link to="/" search={{ view: "map" }} className="client-text-button">
                  {t("Explore the graph", "Переглянути граф")}
                </Link>
                <strong className="scope-block-price">{money(CLIENT_APPROVED_PRICES.graph)}</strong>
              </footer>
            </section>
            <section className="client-scope-card">
              <h2>{t("Which route fits your needs?", "Який варіант вам підходить?")}</h2>
              {(
                [
                  [
                    "full",
                    t("Tailored network application", "Застосунок для роботи з мережею"),
                    t(
                      "Core capabilities with the services and workflows selected above.",
                      "Базові можливості з обраними вище сервісами та workflow.",
                    ),
                  ],
                  [
                    "graph",
                    t("Start with graph & search", "Почати з графа та пошуку"),
                    t(
                      "A smaller standalone scope using the existing foundation; optional additions can be discussed.",
                      "Менший самодостатній обсяг на наявній основі; доповнення можна обговорити окремо.",
                    ),
                  ],
                ] as const
              ).map(([mode, title, detail]) => (
                <label className="client-route-choice" key={mode}>
                  <input
                    type="radio"
                    name="route"
                    checked={draft.mode === mode}
                    disabled={!ready}
                    onChange={() => update({ mode })}
                  />
                  <span>
                    <strong>{title}</strong>
                    <span>{detail}</span>
                  </span>
                </label>
              ))}
              <p className="client-note">
                {t(
                  "Changing to a simpler route clears service and workflow selections. Your written requests remain available but are excluded from that route until you return to the application.",
                  "Перехід до простішого варіанта скидає вибрані сервіси та workflow. Власні описи зберігаються, але не входять до цього варіанта до повернення до застосунку.",
                )}
              </p>
            </section>
          </div>
          <aside id="scope-budget-panel" className="client-scope-budget">
            <p className="client-eyebrow">{t("Budget discussion", "Обговорення бюджету")}</p>
            <h2>{t("Indicative budget ceiling", "Індикативна межа бюджету")}</h2>
            <div className="client-price-receipt" aria-live="polite" aria-atomic="true">
              <p>
                <span>
                  {draft.mode === "graph"
                    ? t("Graph & search", "Граф і пошук")
                    : t("Core application", "Базовий застосунок")}
                </span>
                <strong>
                  {money(
                    draft.mode === "graph"
                      ? CLIENT_APPROVED_PRICES.graph
                      : CLIENT_APPROVED_PRICES.base,
                  )}
                </strong>
              </p>
              {draft.mode === "full" &&
                CLIENT_WORKFLOWS.filter((w) => draft.workflowIds.includes(w.id)).map((w) => (
                  <p key={w.id}>
                    <span>{w.title[locale]}</span>
                    <strong>{money(CLIENT_APPROVED_PRICES[w.id])}</strong>
                  </p>
                ))}
              {draft.mode === "graph" &&
                draft.serviceIds.map((id) => (
                  <p key={id}>
                    <span>{CLIENT_SERVICES.find((s) => s.id === id)?.title[locale]}</span>
                    <strong>{money(CLIENT_APPROVED_PRICES.addons[id] ?? null)}</strong>
                  </p>
                ))}
              {draft.customIncluded && draft.requests.length > 0 && draft.mode === "full" && (
                <p>
                  <span>
                    {t("Custom descriptions", "Власні описи")} · {draft.requests.length}
                  </span>
                  <strong>{t("To estimate", "До оцінки")}</strong>
                </p>
              )}
              <p className="client-price-total">
                <span>{t("Total", "Разом")}</span>
                <strong className="scope-quote-value" key={String(quote)}>
                  {money(quote)}
                </strong>
              </p>
            </div>
            <p className="scope-receipt-note">
              {t(
                "Indicative amounts. Custom requests and unpriced integrations are estimated separately. Hosting, AI/API usage and recurring operations are outside these amounts.",
                "Індикативні суми. Власні вимоги й інтеграції без ціни оцінюються окремо. Хостинг, AI/API та постійна операційна робота до цих сум не входять.",
              )}
            </p>
            <a className="client-button scope-receipt-next" href="#scope-response-section">
              {t("Review & respond", "Перевірити й відповісти")}
            </a>
          </aside>
        </div>
        <section id="scope-response-section" className="client-scope-card scope-response-section">
          <p className="client-eyebrow">{t("Your next step", "Ваш наступний крок")}</p>
          <h2>
            {t("A concrete basis for our next conversation", "Предметна основа наступної розмови")}
          </h2>
          <form
            id="scope-response"
            onSubmit={(e) => {
              e.preventDefault();
              if (!validLimit) {
                setNotice(t("Enter a positive budget ceiling.", "Вкажіть додатну межу бюджету."));
                return;
              }
              const href = emailHref(draft, locale);
              if (href.length > 7000) {
                download();
                window.location.href =
                  "mailto:alexezav@gmail.com,dmitrfilim@gmail.com?subject=" +
                  encodeURIComponent("ISRM · Scope discussion") +
                  "&body=" +
                  encodeURIComponent(
                    t(
                      "Please find my scope request in the file I will attach to this email.",
                      "Мій запит щодо обсягу — у файлі, який я додам до цього листа.",
                    ),
                  );
                setNotice(
                  t(
                    "The complete request was downloaded. Attach ISRM-scope-request.txt to the email, review it and press Send. Nothing has been sent automatically.",
                    "Повний запит завантажено. Додайте ISRM-scope-request.txt до листа, перевірте та натисніть «Надіслати». Автоматично нічого не надіслано.",
                  ),
                );
                return;
              }
              window.location.href = href;
              setNotice(
                t(
                  "Email draft opened. Please review it and press Send in your email application. Delivery has not been confirmed here.",
                  "Відкрито чернетку листа. Перевірте її та натисніть «Надіслати» у поштовому застосунку. Доставку тут не підтверджено.",
                ),
              );
            }}
          >
            <fieldset disabled={!ready}>
              <legend>{t("Your budget position", "Ваша бюджетна позиція")}</legend>
              <label className="client-radio-label">
                <input
                  type="radio"
                  name="budget"
                  checked={draft.budgetPosition === "approve"}
                  disabled={quote === null}
                  onChange={() => update({ budgetPosition: "approve" })}
                />
                {t("This indicative budget is acceptable", "Цей індикативний бюджет прийнятний")}
              </label>
              <label className="client-radio-label">
                <input
                  type="radio"
                  name="budget"
                  checked={draft.budgetPosition === "discuss"}
                  onChange={() => update({ budgetPosition: "discuss" })}
                />
                {t("Discuss a suitable budget", "Обговорити відповідний бюджет")}
              </label>
              <label className="client-radio-label">
                <input
                  type="radio"
                  name="budget"
                  checked={draft.budgetPosition === "limit"}
                  onChange={() => update({ budgetPosition: "limit" })}
                />
                {t("I have a budget ceiling", "Маю бюджетне обмеження")}
              </label>
              {draft.budgetPosition === "limit" && (
                <div className="client-budget-inputs">
                  <label>
                    {t("Currency", "Валюта")}
                    <select
                      value={draft.currency}
                      onChange={(e) =>
                        update({ currency: e.target.value as "GBP" | "USD" | "EUR" })
                      }
                    >
                      {["GBP", "USD", "EUR"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    {t("Ceiling", "Межа")}
                    <input
                      required
                      type="number"
                      min="0.01"
                      step="any"
                      value={draft.budgetCeiling}
                      onChange={(e) => update({ budgetCeiling: e.target.value })}
                    />
                  </label>
                </div>
              )}
              <label>
                {t("Your name", "Ваше ім’я")}
                <input
                  autoComplete="name"
                  value={draft.name}
                  onChange={(e) => update({ name: e.target.value })}
                />
              </label>
              <label>
                {t("Email for a reply", "Email для відповіді")}
                <input
                  type="email"
                  autoComplete="email"
                  value={draft.email}
                  onChange={(e) => update({ email: e.target.value })}
                />
              </label>
              <label>
                {t("Notes, systems or constraints", "Примітки, системи чи обмеження")}
                <textarea
                  rows={4}
                  value={draft.notes}
                  onChange={(e) => update({ notes: e.target.value })}
                />
              </label>
            </fieldset>
          </form>
          <p className="client-note">
            {t(
              "Email opens a draft for your review. It does not send automatically. The same request is used for email, PDF, download and copy.",
              "Відкривається чернетка листа для вашої перевірки. Автоматичного надсилання немає. Лист, PDF, завантаження й копіювання використовують той самий запит.",
            )}
          </p>
          <p className="client-note client-recipient">alexezav@gmail.com · dmitrfilim@gmail.com</p>
          <div className="client-export-actions scope-action-cards">
            <button
              className="scope-action-card"
              form="scope-response"
              type="submit"
              disabled={!ready}
            >
              <Mail size={20} />
              <span>{t("Prepare an email", "Підготувати лист")}</span>
            </button>
            <button className="scope-action-card" onClick={() => window.print()}>
              <Printer size={17} />
              {t("Print / PDF", "Друк / PDF")}
            </button>
            <button className="scope-action-card" onClick={download}>
              <Download size={17} />
              {t("Download full text", "Завантажити текст")}
            </button>
            <button
              className="scope-action-card"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(summary);
                  setNotice(
                    t(
                      "Full summary copied. It has not been sent.",
                      "Повний підсумок скопійовано. Його не надіслано.",
                    ),
                  );
                } catch {
                  setNotice(
                    t(
                      "Copy is unavailable. Download the request instead.",
                      "Копіювання недоступне. Завантажте запит окремою дією.",
                    ),
                  );
                }
              }}
            >
              <Copy size={17} />
              {t("Copy", "Копіювати")}
            </button>
          </div>
          {notice && (
            <p className="client-notice" role="status">
              {notice}
            </p>
          )}
          <label className="client-route-choice">
            <input
              type="checkbox"
              checked={draft.oneOffResearch}
              disabled={!ready}
              onChange={(e) => update({ oneOffResearch: e.target.checked })}
            />
            <span>
              {t(
                "I would also like research on individual requests",
                "Також бажаю отримувати дані за разовими замовленнями",
              )}
            </span>
          </label>
          <p className="client-note">
            {t(
              "Your contact details and choices are stored only in this browser until you send them yourself. This is a request for discussion, not an order or acceptance of a price.",
              "Контактні дані й вибір зберігаються лише в цьому браузері до вашого надсилання. Це запит на обговорення, а не замовлення чи погодження ціни.",
            )}
          </p>{" "}
        </section>
        <footer className="client-scope-footer">
          <Link to="/proposal">{t("Back to the briefing", "До брифінгу")}</Link>
          <p>
            {t(
              "Demonstration and discussion material · not a binding offer",
              "Демонстрація та матеріал для обговорення · не зобов’язувальна оферта",
            )}
          </p>
        </footer>
      </div>
      <a className="scope-mobile-total" href="#scope-budget-panel">
        <span>{t("Your indicative total", "Ваш індикативний підсумок")}</span>
        <strong>{money(quote)}</strong>
        <ArrowLeft size={17} aria-hidden="true" />
      </a>
      <article className="client-print-summary">
        <pre>{summary}</pre>
      </article>
    </main>
  );
}
