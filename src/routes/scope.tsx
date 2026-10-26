import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Download, Mail, Printer, Copy } from "lucide-react";
import { useClientDraft } from "@/components/ClientDraftProvider";
import { CoreCapabilities, WorkflowValue } from "@/components/ClientValueFramework";
import { ClientAccessibility } from "@/components/ClientAccessibility";
import { AccessControl } from "@/components/AppShell";
import { useI18n } from "@/lib/i18n";
import { CLIENT_SERVICES, CLIENT_WORKFLOWS } from "@/lib/client-catalog";
import { CLIENT_APPROVED_PRICES, clientQuote } from "@/lib/client-pricing";
import { BRIEFING_MILESTONES } from "@/lib/briefing-milestones";
import { buildClientSummary, emailHref, selectedServiceIds } from "@/lib/client-draft";
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
  const ids = selectedServiceIds(draft);
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
    <main className="client-scope">
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
        <p className="client-eyebrow">
          {t("A basis for our next conversation", "Основа наступної розмови")}
        </p>
        <h1>
          {t("Your priorities. A scope we can discuss.", "Ваші пріоритети. Обсяг для обговорення.")}
        </h1>
        <p className="client-lede">
          {t(
            "Review the functions you would find useful. Add a budget boundary if you have one. We will use this to prepare a detailed specification, timetable and offer.",
            "Перегляньте потрібні функції. Додайте бюджетне обмеження, якщо воно є. Це стане основою детального ТЗ, строків і пропозиції.",
          )}
        </p>
        <section className="client-scope-card">
          <p className="client-eyebrow">
            {t(
              "Core application · three delivery stages",
              "Базовий застосунок · три етапи виконання",
            )}
          </p>
          <h2>
            {t(
              "Safer professional communication and trusted network expertise",
              "Безпечніша професійна комунікація та довіра до мережевої експертизи",
            )}
          </h2>
          <p>
            {t(
              "The core application imports and improves data, supports configurable profile fields, mini-profiles and dossiers, maps relationships, enables search and working lists, and connects AI-assisted open-source research with accountable human review and agreed ISRM systems.",
              "Ядро завантажує й покращує дані, підтримує налаштовувані поля, міні-профілі та досьє, мапує зв’язки, забезпечує пошук і робочі списки та поєднує AI OSINT з відповідальною людською перевіркою й погодженими системами ISRM.",
            )}
          </p>
        </section>
        <CoreCapabilities locale={locale} />
        <div className="client-scope-grid">
          <div>
            <section className="client-scope-card">
              <h2>{t("Which route fits your needs?", "Який варіант вам підходить?")}</h2>
              {(
                [
                  [
                    "full",
                    t("Tailored network application", "Застосунок для роботи з мережею"),
                    t(
                      "Core capabilities with the services and workflows selected below.",
                      "Базові можливості з обраними нижче сервісами та workflow.",
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
            {draft.mode === "graph" && (
              <section className="client-scope-card">
                <h2>
                  {t(
                    "Optional additions to graph & search",
                    "Опційні доповнення до графа й пошуку",
                  )}
                </h2>
                {CLIENT_SERVICES.filter((s) =>
                  ["groups", "contact", "research", "integration"].includes(s.id),
                ).map((s) => (
                  <label className="client-route-choice" key={s.id}>
                    <input
                      type="checkbox"
                      checked={draft.serviceIds.includes(s.id)}
                      disabled={!ready}
                      onChange={(e) =>
                        update({
                          serviceIds: e.target.checked
                            ? [...draft.serviceIds, s.id]
                            : draft.serviceIds.filter((id) => id !== s.id),
                        })
                      }
                    />
                    <span>
                      <strong>{s.title[locale]}</strong>
                      <span>{money(CLIENT_APPROVED_PRICES.addons[s.id] ?? null)}</span>
                    </span>
                  </label>
                ))}
              </section>
            )}
            <section className="client-scope-card">
              <h2>{t("Selected services", "Обрані сервіси")}</h2>
              <ul className="client-scope-service-list">
                {CLIENT_SERVICES.filter((s) => ids.includes(s.id)).map((s) => (
                  <li key={s.id}>
                    <strong>{s.title[locale]}</strong>
                    <p>{s.detail[locale]}</p>
                    <span className="client-status">{s.status[locale]}</span>
                  </li>
                ))}
              </ul>
              <Link to="/" search={{ stage: "configuration" }} className="client-text-button">
                {t("Change services", "Змінити сервіси")} →
              </Link>
            </section>
            <section className="client-scope-card">
              <h2>{t("Optional workflows", "Опційні workflow")}</h2>
              {CLIENT_WORKFLOWS.map((w) => (
                <article key={w.id}>
                  <label className="client-route-choice">
                    <input
                      type="checkbox"
                      checked={draft.workflowIds.includes(w.id)}
                      disabled={!ready || draft.mode !== "full"}
                      onChange={(e) =>
                        update({
                          workflowIds: e.target.checked
                            ? [...draft.workflowIds, w.id]
                            : draft.workflowIds.filter((id) => id !== w.id),
                        })
                      }
                    />
                    <strong>{w.title[locale]}</strong>
                  </label>
                  <p className="client-price-tag">
                    {t("Indicative addition:", "Індикативне доповнення:")}{" "}
                    {money(CLIENT_APPROVED_PRICES[w.id])}
                  </p>
                  <p>{w.detail[locale]}</p>
                  <WorkflowValue workflow={w.id} locale={locale} />
                  <ul className="client-output-tags">
                    {w.outputs[locale].map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </article>
              ))}
              <Link
                to="/"
                search={{ stage: "configuration", preset: "engagement" }}
                className="client-text-button"
              >
                {t("Review workflows", "Переглянути workflow")} →
              </Link>
            </section>
            <section className="client-scope-card">
              <h2>
                {t("Your descriptions", "Ваші описи")} ({draft.requests.length})
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
            <section className="client-scope-card">
              <h2>{t("Demonstration shortlist", "Демонстраційна група")}</h2>
              <p>{draft.groupName || t("No group name", "Назву не задано")}</p>
              <p>
                {draft.shortlist.join(", ") || t("No profiles selected.", "Профілі не обрані.")}
              </p>
              <p className="client-note">
                {t(
                  "Supplied ISRM records for private board review; no people have been invited or assigned.",
                  "Передані записи ISRM для закритого перегляду правлінням; людей не запрошено чи призначено.",
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
          </div>
          <aside className="client-scope-budget">
            <p className="client-eyebrow">{t("Budget discussion", "Обговорення бюджету")}</p>
            <h2>{t("Indicative budget ceiling", "Індикативна межа бюджету")}</h2>
            <div className="client-price-receipt">
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
                <strong>{money(quote)}</strong>
              </p>
            </div>
            <div className="client-notice">
              {t(
                "Indicative prices cover the stated scope. Custom requirements and unpriced integrations are estimated separately before agreement.",
                "Індикативні ціни охоплюють зазначений обсяг. Власні вимоги та інтеграції без ціни оцінюємо окремо до укладення угоди.",
              )}
            </div>
            <p>
              {t(
                "Development, professional work, rights to reuse existing assets, integrations and recurring hosting/AI costs will be shown separately. Scope, permitted data, integrations and delivery model determine the estimate and timetable.",
                "Розробка, професійна робота, права на наявні активи, інтеграції та регулярні витрати на хостинг/ШІ будуть показані окремо. Оцінка та строки залежать від обсягу, дозволених даних, інтеграцій і моделі передачі.",
              )}
            </p>
            <form
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
                <button className="client-button" type="submit">
                  <Mail size={18} />
                  {t("Prepare an email", "Підготувати лист")}
                </button>
              </fieldset>
            </form>
            <p className="client-note">
              {t(
                "This opens your email application; it does not send automatically. For long requests, copy the complete text below or attach the downloaded file.",
                "Відкривається ваш поштовий застосунок; автоматичного надсилання немає. Довгий запит скопіюйте нижче або додайте завантажений файл.",
              )}
            </p>
            <p className="client-note client-recipient">
              alexezav@gmail.com · dmitrfilim@gmail.com
            </p>
            <div className="client-export-actions">
              <button onClick={() => window.print()}>
                <Printer size={17} />
                {t("Print / PDF", "Друк / PDF")}
              </button>
              <button onClick={download}>
                <Download size={17} />
                {t("Download full text", "Завантажити текст")}
              </button>
              <button
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
                        "Copy is unavailable. Select the complete text below or download it.",
                        "Копіювання недоступне. Виділіть повний текст нижче або завантажте його.",
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
            </p>
          </aside>
        </div>
        <section className="client-summary-section">
          <h2>{t("Complete request", "Повний запит")}</h2>
          <p className="client-note">
            {t(
              "This same text is used for download, email and print.",
              "Цей самий текст використовується для завантаження, листа та друку.",
            )}
          </p>
          <pre className="client-summary">{summary}</pre>
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
      <article className="client-print-summary">
        <pre>{summary}</pre>
      </article>
    </main>
  );
}
