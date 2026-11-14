import { ClientHeader } from "@/components/ClientHeader";
import { ScopePrintDocument } from "@/components/ScopePrintDocument";
import { buildClientMarkdown } from "@/lib/scope-document";
import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { ServiceFunctionDeck } from "@/components/ScopeCardDecks";
import { DataUseNotice } from "@/components/DataUseNotice";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, Mail, Printer, ChevronDown } from "lucide-react";
import { useClientDraft } from "@/components/ClientDraftProvider";
import { useI18n } from "@/lib/i18n";
import { CLIENT_SERVICES } from "@/lib/client-catalog";
import { buildClientSummary, emailHref, selectedServiceIds } from "@/lib/client-draft";
export const Route = createFileRoute("/scope")({
  head: () => ({
    meta: [
      { title: "ISRM · Scope & budget discussion" },
      {
        name: "description",
        content:
          "Confirm selected service functions, adjust the scope and record a client budget limit for estimation.",
      },
    ],
  }),
  component: ScopePage,
});
function ScopePage() {
  const location = useLocation();
  const { draft, update, ready } = useClientDraft();
  const { locale } = useI18n();
  const uk = locale === "uk";
  const t = (en: string, ua: string) => (uk ? ua : en);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const target = location.hash.replace(/^#/, "");
    if (!target) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(target)?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.hash]);
  const summary = buildClientSummary(draft, locale);
  const selectedServices = selectedServiceIds(draft);
  const includedRequestCount = draft.customIncluded ? draft.requests.length : 0;
  const functionCount = selectedServices.length + includedRequestCount;
  const validLimit =
    !draft.budgetCeiling.trim() ||
    (Number(draft.budgetCeiling) > 0 && Number.isFinite(Number(draft.budgetCeiling)));
  const validScope = functionCount > 0 && draft.scopeConfirmed;
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([buildClientMarkdown(draft, locale)], { type: "text/markdown;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "ISRM-scope-request.md";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <main className="client-scope scope-card-cabinet">
      <ClientHeader hideOnScroll baseline />
      <div className="client-scope-shell">
        <Link className="client-back-link" to="/" search={{ view: "map" }}>
          <ArrowLeft size={18} />
          {t("Back to the network", "До мережі")}
        </Link>
        <header className="client-slide-topline scope-page-title">
          <div>
            <h1>
              {t(
                "Confirm functions. Set a budget limit.",
                "Підтвердьте функції. Вкажіть межу бюджету.",
              )}
            </h1>
          </div>
          <aside className="client-title-meta">
            <p>
              {t("Functional scope · estimate request", "Функціональний обсяг · запит на оцінку")}
            </p>
          </aside>
        </header>
        <section className="scope-project-introduction">
          <p>
            {t(
              "Choose the individual functions to include in an estimate request. You can change them here; the configurator explains each function and shows non-binding examples of how functions may connect. This page does not ask you to approve a preset workflow or price.",
              "Оберіть окремі функції для запиту на оцінку. Тут можна змінити вибір; конфігуратор пояснює кожну функцію та показує необов’язкові приклади їх поєднання. Ця сторінка не просить погоджувати типовий workflow чи ціну.",
            )}
          </p>
        </section>
        <p className="scope-project-subtitle">
          {t(
            "Select functions. Confirm the estimate request.",
            "Оберіть функції. Підтвердіть запит на оцінку.",
          )}
        </p>
        <div className="client-scope-grid scope-linear-layout">
          <div>
            <DataUseNotice context="scope" compact />
            <ServiceFunctionDeck locale={locale} draft={draft} ready={ready} update={update} />
            <details
              id="scope-additional-functions"
              className="scope-large-folder scope-page-folder"
              defaultOpen={location.hash.includes("scope-additional-functions")}
            >
              <summary className="scope-workflow-tab">
                <h2>
                  {t("Additional functions", "Додаткова функціональність")} ({draft.requests.length}
                  )
                </h2>
                <ChevronDown size={20} aria-hidden="true" />
              </summary>
              <div className="scope-large-folder-body">
                <label className="client-route-choice">
                  <input
                    type="checkbox"
                    checked={draft.customIncluded}
                    disabled={!ready || !draft.requests.length}
                    onChange={(e) => update({ customIncluded: e.target.checked })}
                  />
                  <span>
                    {t(
                      "Include these additional functions in the estimate request",
                      "Включити цю функціональність до запиту на оцінку",
                    )}
                  </span>
                </label>
                <label className="scope-manual-request">
                  {t(
                    "Describe a function you need that is not listed",
                    "Опишіть потрібну функцію, якої немає у списку",
                  )}
                  <textarea
                    rows={4}
                    disabled={!ready}
                    value={draft.requests.find((r) => r.id === "scope-manual")?.description ?? ""}
                    placeholder={t(
                      "Describe the capability and the result you need…",
                      "Опишіть потрібну функцію та очікуваний результат…",
                    )}
                    onChange={(e) => {
                      const remaining = draft.requests.filter((r) => r.id !== "scope-manual");
                      update({
                        requests: e.target.value.trim()
                          ? [
                              ...remaining,
                              {
                                id: "scope-manual",
                                kind: "service",
                                title: t(
                                  "Additional client function",
                                  "Додаткова функція замовника",
                                ),
                                description: e.target.value,
                              },
                            ]
                          : remaining,
                      });
                    }}
                  />
                </label>
                {draft.requests.length ? (
                  draft.requests
                    .filter((r) => r.id !== "scope-manual")
                    .map((r) => (
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
                  <p>{t("No additional functions described.", "Додаткових функцій не описано.")}</p>
                )}
              </div>
            </details>
          </div>
          <aside id="scope-budget-panel" className="client-scope-budget">
            <h2>{t("Scope confirmation", "Підтвердження обсягу")}</h2>
            <div className="client-price-receipt" aria-live="polite" aria-atomic="true">
              <p className="client-price-total">
                <span>{t("Functions selected", "Обрано функцій")}</span>
                <strong>{functionCount}</strong>
              </p>
              {functionCount ? (
                <ul>
                  {CLIENT_SERVICES.filter((service) => selectedServices.includes(service.id)).map(
                    (service) => (
                      <li key={service.id}>{service.title[locale]}</li>
                    ),
                  )}
                  {draft.customIncluded &&
                    draft.requests.map((request) => <li key={request.id}>{request.title}</li>)}
                </ul>
              ) : (
                <p>{t("No service functions selected.", "Сервісні функції не обрано.")}</p>
              )}
            </div>
            <p className="scope-receipt-note">
              {t(
                "This request asks for an itemised estimate of the selected functions. It is not a quotation or contract. Unpriced integrations, licences, hosting and ongoing services must be identified separately in the estimate; they are not assumed to be free.",
                "Цей запит просить деталізовану оцінку обраних функцій. Це не комерційна пропозиція і не договір. Інтеграції, ліцензії, хостинг і постійні послуги без оцінки мають бути вказані окремо; вони не вважаються безкоштовними.",
              )}
            </p>
            <fieldset className="scope-budget-position" disabled={!ready}>
              <legend>
                {t("Your budget ceiling (optional)", "Ваша межа бюджету (необов’язково)")}
              </legend>
              <label className="scope-ceiling-entry" htmlFor="scope-budget-ceiling">
                <span className="sr-only">
                  {t("Maximum budget amount", "Максимальна сума бюджету")}
                </span>
                <input
                  id="scope-budget-ceiling"
                  type="number"
                  min="0.01"
                  step="any"
                  placeholder={t("Leave blank to discuss", "Залиште порожнім для обговорення")}
                  value={draft.budgetCeiling}
                  onChange={(e) =>
                    update({
                      budgetCeiling: e.target.value,
                      budgetPosition: e.target.value.trim() ? "limit" : "discuss",
                    })
                  }
                />
                <select
                  aria-label={t("Budget currency", "Валюта бюджету")}
                  value={draft.currency}
                  onChange={(e) => {
                    const currency = e.target.value;
                    if (currency === "GBP" || currency === "EUR" || currency === "USD")
                      update({ currency });
                  }}
                >
                  <option value="GBP">GBP</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </label>
              <p className="scope-receipt-note">
                {t(
                  "This is your maximum budget, not an estimate of the work's cost.",
                  "Це ваша максимальна межа, а не оцінка вартості робіт.",
                )}
              </p>
            </fieldset>
            <label className="client-route-choice">
              <input
                type="checkbox"
                checked={draft.scopeConfirmed}
                disabled={!ready || functionCount === 0}
                onChange={(e) => update({ scopeConfirmed: e.target.checked })}
              />
              <span>
                {t(
                  "Confirm these functions for an estimate",
                  "Підтверджую ці функції для підготовки оцінки",
                )}
              </span>
            </label>
            {functionCount === 0 && (
              <p className="scope-receipt-note" role="status">
                {t(
                  "Select at least one service function before confirming the scope.",
                  "Оберіть щонайменше одну сервісну функцію, перш ніж підтвердити обсяг.",
                )}
              </p>
            )}
            <p className="scope-receipt-note">
              {t(
                "You can revise the functions before creating the request. The estimate will need to describe any exclusions and assumptions.",
                "Перед створенням запиту можна змінити функції. В оцінці мають бути описані виключення та припущення.",
              )}
            </p>
            <a className="client-button scope-receipt-next" href="#scope-response-section">
              {t("Prepare estimate request", "Підготувати запит на оцінку")}
            </a>
          </aside>
        </div>
        <section id="scope-response-section" className="client-scope-card scope-response-section">
          <details className="scope-large-folder scope-page-folder" open>
            <summary className="scope-workflow-tab">
              <h2>{t("Our next steps", "Наші наступні дії")}</h2>
              <ChevronDown size={20} aria-hidden="true" />
            </summary>
            <div className="scope-large-folder-body">
              <details className="scope-response-hint">
                <summary>{t("Client response", "Відповідь замовника")}</summary>
                <p>
                  {t(
                    "Your response records the functions to estimate and any budget limit you choose to share. It does not approve an organisation-specific workflow, place an order or accept a final price.",
                    "Ваша відповідь фіксує функції для оцінки та, за бажанням, бюджетну межу. Вона не погоджує workflow організації, не є замовленням і не підтверджує остаточну ціну.",
                  )}
                </p>
              </details>
              <form
                id="scope-response"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!validScope) {
                    setNotice(
                      functionCount === 0
                        ? t(
                            "Select at least one service function before creating the request.",
                            "Оберіть щонайменше одну сервісну функцію, перш ніж створити запит.",
                          )
                        : t(
                            "Confirm the selected functions for an estimate before creating the request.",
                            "Підтвердіть обрані функції для оцінки, перш ніж створити запит.",
                          ),
                    );
                    return;
                  }
                  if (!validLimit) {
                    setNotice(
                      t(
                        "Enter a budget ceiling greater than zero, or clear the field to leave it open.",
                        "Вкажіть бюджетну межу більшу за нуль або очистьте поле, щоб не задавати її.",
                      ),
                    );
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
                        "The complete request was downloaded. Attach ISRM-scope-request.md to the email, review it and press Send. Nothing has been sent automatically.",
                        "Повний запит завантажено. Додайте ISRM-scope-request.md до листа, перевірте та натисніть «Надіслати». Автоматично нічого не надіслано.",
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
                  "Email opens a draft for your review. It does not send automatically. Email and PDF use the same request.",
                  "Відкривається чернетка листа для вашої перевірки. Автоматичного надсилання немає. Лист і PDF використовують той самий запит.",
                )}
              </p>
              <p className="client-note client-recipient">
                alexezav@gmail.com · dmitrfilim@gmail.com
              </p>
              <div className="client-export-actions scope-action-cards scope-compact-actions">
                <button
                  className="scope-action-card"
                  form="scope-response"
                  type="submit"
                  disabled={!ready}
                >
                  <Mail size={19} />
                  <span>{t("Create email draft", "Створити чернетку листа")}</span>
                </button>
                <button className="scope-action-card" onClick={download} disabled={!ready}>
                  <Download size={19} />
                  <span>{t("Download request", "Завантажити запит")}</span>
                </button>
                <button className="scope-action-card" onClick={() => window.print()}>
                  <Printer size={19} />
                  <span>PDF</span>
                </button>
              </div>
              {notice && (
                <p className="client-notice" role="status">
                  {notice}
                </p>
              )}
              <p className="client-note">
                {t(
                  "Your details and selections stay in this browser until you choose to create an email draft. The draft must be reviewed and sent by you.",
                  "Ваші дані та вибір залишаються в цьому браузері, доки ви не створите чернетку листа. Її потрібно перевірити й надіслати самостійно.",
                )}
              </p>{" "}
            </div>
          </details>
        </section>
        <footer className="client-scope-footer">
          <p>
            {t(
              "Demonstration and discussion material · not a binding offer",
              "Демонстрація та матеріал для обговорення · не зобов’язувальна оферта",
            )}
          </p>
        </footer>
      </div>
      <a className="scope-mobile-total" href="#scope-budget-panel">
        <span>{t("Functions in estimate request", "Функцій у запиті на оцінку")}</span>
        <strong>{functionCount}</strong>
        <ArrowLeft size={17} aria-hidden="true" />
      </a>
      <ScopePrintDocument summary={summary} locale={locale} />
    </main>
  );
}
