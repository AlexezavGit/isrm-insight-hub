import { IntegrationStrip } from "@/components/IntegrationStrip";
import { ScopeDeliveryNotes } from "@/components/ScopeDeliveryNotes";
import { packageIsCustom } from "@/lib/tailored-scope";
import { BoardDecisionNote } from "@/components/BoardDecisionNote";
import { BOARD_RECIPIENT, BOARD_CAPACITY } from "@/lib/board-brief";
import { ClientHeader } from "@/components/ClientHeader";
import { ScopePrintDocument } from "@/components/ScopePrintDocument";
import { buildClientMarkdown } from "@/lib/scope-document";
import { IsrmContextLinks } from "@/components/IsrmContextLinks";
import { useDismissibleDetails } from "@/components/useDismissibleDetails";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CoreServiceDeck, WorkflowDeck } from "@/components/ScopeCardDecks";
import { DataUseNotice } from "@/components/DataUseNotice";
import { useState } from "react";
import { ArrowLeft, Download, Mail, Printer, Copy, ChevronDown } from "lucide-react";
import { useClientDraft } from "@/components/ClientDraftProvider";
import { ClientAccessibility } from "@/components/ClientAccessibility";
import { AccessControl } from "@/components/AppShell";
import { useI18n } from "@/lib/i18n";
import { CLIENT_SERVICES, CLIENT_WORKFLOWS } from "@/lib/client-catalog";
import {
  CLIENT_APPROVED_PRICES,
  clientQuote,
  clientPriceLines,
  clientQuoteRange,
  indicativePriceLabel,
} from "@/lib/client-pricing";
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
  const responseHint = useDismissibleDetails();
  const quote = clientQuote(draft);
  const estimate = clientQuoteRange(draft);
  const money = (value: number | null) => indicativePriceLabel(value, locale);
  const summary = buildClientSummary(draft, locale);
  const validLimit =
    draft.budgetPosition !== "limit" ||
    (Number(draft.budgetCeiling) > 0 && Number.isFinite(Number(draft.budgetCeiling)));
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
      <ClientHeader hideOnScroll />
      <div className="client-scope-shell">
        <Link className="client-back-link" to="/" search={{ view: "map" }}>
          <ArrowLeft size={18} />
          {t("Back to the network", "До мережі")}
        </Link>
        <header className="client-slide-topline scope-page-title">
          <div>
            <h1>{t("Your priorities. Our next steps.", "Ваші пріоритети. Наші наступні дії.")}</h1>
          </div>
          <aside className="client-title-meta">
            <p className="client-eyebrow">
              {t("A basis for our next conversation", "Основа наступної розмови")}
            </p>
          </aside>
        </header>
        <section className="scope-project-introduction">
          <p>
            {t(
              "A project to develop safer professional communication and strengthen trust in network expertise across ISRM’s sphere of influence.",
              "Проєкт із розвитку безпеки професійних комунікацій та зміцнення довіри до носіїв мережевої експертизи в зоні впливу ISRM.",
            )}
          </p>
          <p>
            {t(
              "Our role is to help ISRM define the practical approach, responsibilities and evidence needed to support its members. The proposed application brings together management consulting, professional research and digital delivery around those requirements.",
              "Наша роль — допомогти ISRM визначити практичний підхід, відповідальність і доказову основу для підтримки своїх членів. Запропонований застосунок поєднує управлінський консалтинг, професійні дослідження й цифрові інструменти навколо цих потреб.",
            )}
          </p>
          <details className="scope-context-note">
            <summary>
              {t("Relevant consulting experience", "Профільний консалтинговий досвід")}
            </summary>
            <p>
              {t(
                "Our approach draws on experience in institutional development and human capital. Alex Zvolinskiy’s project record includes coordinating the strategic and operational development of Ukraine’s Chamber of Commerce and Industry within a CIPE project, as project coordinator and HR management expert. The work covered long-term strategy, operational planning and staff development in sustainable organisational development.",
                "Наш підхід спирається на досвід інституційного розвитку та управління людським капіталом. Серед проєктів Олексія Зволінського — стратегічний і операційний розвиток ТПП України в проєкті CIPE, у ролі координатора та експерта з управління людськими ресурсами. Робота охоплювала довгострокову стратегію, операційний план і навчання персоналу сталому організаційному розвитку.",
              )}
            </p>
            <a
              href="https://www.linkedin.com/in/alexeyzvolinskiy/details/projects/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("Project record · Alex Zvolinskiy", "Проєктний досвід · Олексій Зволінський")}
            </a>
          </details>
        </section>
        <p className="scope-recipient">
          <strong>{BOARD_RECIPIENT}</strong>
          <br />
          {BOARD_CAPACITY[locale]}
        </p>
        <p className="scope-project-subtitle">
          {t(
            "Proposed application capabilities, delivery stages and budget limits",
            "Погодження функціональності цифрового додатку, етапів та лімітів",
          )}
        </p>
        <details className="scope-trust-mandate scope-large-folder scope-page-folder">
          <summary className="scope-workflow-tab">
            <span className="scope-trust-slogan">
              {t(
                "Trust is a mandate in trusted consultancy.",
                "Довіра — це мандат для сектору trusted consultancy.",
              )}
            </span>
            <ChevronDown size={20} aria-hidden="true" />
          </summary>
          <p>
            {t(
              "That mandate can change with the outcomes of interaction and the evidence that supports or challenges it. Timely awareness and verified information underpin trusted consultancy.",
              "Цей мандат може змінюватися залежно від результатів взаємодії та даних, що підтверджують або спростовують підстави для довіри. Своєчасна поінформованість і перевірені дані — основа trusted consultancy.",
            )}
          </p>
        </details>
        <div className="client-scope-grid scope-linear-layout">
          <div>
            <p className="scope-workflow-definition">
              {t(
                "A workflow is an organised sequence of recurring actions: who contributes, what happens next and how the result is used. The application can support and automate the agreed steps.",
                "Workflow — це впорядкована послідовність повторюваних дій: хто долучається, що відбувається далі та як використовується результат. Застосунок підтримує й автоматизує погоджені кроки.",
              )}
            </p>
            <p className="scope-delivery-intro">
              {t(
                "Delivery follows three stages. The core and each workflow have their own self-contained results, agreed for each stage.",
                "Виконання передбачає три етапи. Ядро та кожен workflow мають власні самодостатні результати, які погоджуються для кожного етапу.",
              )}
            </p>
            <IntegrationStrip locale={locale} />
            <BoardDecisionNote locale={locale} />
            <DataUseNotice context="scope" compact />
            <p className="scope-deck-hint">
              {t(
                "Consider how this would support your work",
                "Подумайте, як це допоможе у вашій роботі",
              )}
            </p>
            <CoreServiceDeck locale={locale} draft={draft} ready={ready} update={update} />
            <details className="scope-large-folder scope-page-folder">
              <summary className="scope-workflow-tab">
                <h2>
                  {t("Your project requirements", "Ваші проєкти та вимоги")} (
                  {draft.requests.length})
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
                    {draft.mode === "full"
                      ? t(
                          "Include the described functions and workflows in the estimate",
                          "Включити описані функції та workflow до оцінки",
                        )
                      : t(
                          "Retain these additional requests for separate discussion; excluded from the simpler option and its price",
                          "Зберегти додаткові запити для окремого обговорення; не включені до fallback та його ціни",
                        )}
                  </span>
                </label>
                <label className="scope-manual-request">
                  {t(
                    "Describe the capabilities or workflow you need",
                    "Опишіть потрібну функціональність або workflow",
                  )}
                  <textarea
                    rows={4}
                    disabled={!ready}
                    value={draft.requests.find((r) => r.id === "scope-manual")?.description ?? ""}
                    placeholder={t(
                      "Your requirements, systems and desired result…",
                      "Ваші вимоги, системи та бажаний результат…",
                    )}
                    onChange={(e) => {
                      const remaining = draft.requests.filter((r) => r.id !== "scope-manual");
                      update({
                        requests: e.target.value.trim()
                          ? [
                              ...remaining,
                              {
                                id: "scope-manual",
                                kind: "workflow",
                                title: t("Client requirements", "Вимоги замовника"),
                                description: e.target.value,
                              },
                            ]
                          : remaining,
                      });
                    }}
                  />
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
                  <p>
                    {t(
                      "Describe your requirements in the field above.",
                      "Опишіть додаткові вимоги в полі вище.",
                    )}
                  </p>
                )}
              </div>
            </details>
            <p className="scope-workflow-intro">
              {t(
                "Work on a workflow can begin whenever you decide it is needed. Each builds on the core; the starting scope and dependencies are agreed separately.",
                "Роботу над будь-яким workflow можна почати, коли ви вирішите, що він потрібний. Кожен спирається на ядро; початковий обсяг і залежності погоджуються окремо.",
              )}
            </p>
            <WorkflowDeck locale={locale} draft={draft} ready={ready} update={update} />
            <p className="scope-deck-hint">
              {t(
                "Consider how this would support your work",
                "Подумайте, як це допоможе у вашій роботі",
              )}
            </p>
            <details className="scope-large-folder scope-page-folder scope-next-iteration">
              <summary className="scope-workflow-tab">
                <h2>
                  Integration
                  <span className="scope-heading-subtitle">
                    {t("Future development & AI", "Подальший розвиток та ШІ")}
                  </span>
                </h2>
                <ChevronDown size={20} aria-hidden="true" />
              </summary>
              <div className="scope-large-folder-body">
                <p className="client-eyebrow">
                  {t(
                    "Further development · for consideration in the proposal",
                    "Наступна ітерація · до розрахунків у пропозиції",
                  )}
                </p>
                <p>
                  {t(
                    "A consultant’s AI assistant trained on approved professional expertise is a separate next step. The existing OSINT research assistant works with data and sources; it is not this trained consultant. Future work may also connect project-management tools and paid ISRM services, subject to licences, permissions and available interfaces.",
                    "AI-консультант — помічник консультанта, навчений на погодженій професійній експертизі, — окремий наступний крок. Наявний OSINT-помічник досліджує дані й джерела; це інший інструмент. Наступна ітерація може також підключити системи управління проєктами та платні сервіси ISRM за погодженими ліцензіями, правами доступу й доступними інтерфейсами.",
                  )}
                </p>
                <details className="scope-context-note">
                  <summary>{t("ISRM context", "Контекст ISRM")}</summary>
                  <IsrmContextLinks context="integration" locale={locale} />
                </details>
                <label className="scope-block-choice">
                  <input
                    type="checkbox"
                    checked={draft.mode === "full" && draft.integrationInterest}
                    disabled={!ready}
                    onChange={(e) =>
                      update({ mode: "full", integrationInterest: e.target.checked })
                    }
                  />
                  <span>
                    {t(
                      "Approve scope discussion · outside the core budget",
                      "Погоджую опрацювання · поза бюджетом ядра",
                    )}
                  </span>
                </label>
              </div>
            </details>
          </div>
          <aside id="scope-budget-panel" className="client-scope-budget">
            <p className="client-eyebrow">
              {t(
                "For your proposal · not a payment request",
                "До пропозиції · не рахунок на оплату",
              )}
            </p>
            <h2>{t("Your selected scope", "Обраний обсяг")}</h2>
            <div className="client-price-receipt" aria-live="polite" aria-atomic="true">
              {clientPriceLines(draft, locale).map((line) => (
                <p key={line.id}>
                  <span>{line.title}</span>
                  <strong>{money(line.value)}</strong>
                </p>
              ))}
              {draft.mode !== "full" &&
                draft.customIncluded &&
                draft.requests.map((request) => (
                  <p key={request.id}>
                    <span>{request.title}</span>
                    <strong>{t("Separate discussion", "Окреме обговорення")}</strong>
                  </p>
                ))}
              <p className="client-price-total">
                <span>
                  {estimate.pending
                    ? t("Priced scope subtotal", "Сума оцінених позицій")
                    : t("Indicative total", "Індикативна сума")}
                </span>
                <strong className="scope-quote-value" key={String(quote)}>
                  {indicativePriceLabel(estimate.low, locale, estimate.high)}
                </strong>
              </p>
            </div>
            <p className="scope-receipt-note">
              {t(
                "Indicative prices only; exact calculations follow in the detailed proposal we prepare. Changed package contents require reassessment. Campaigns, content, licences, AI/API usage and ongoing professional review are quoted separately; unpriced requests are excluded.",
                "Ціни виключно індикативні; точні розрахунки — у детальній пропозиції, яку ми підготуємо. Зміна складу пакетів потребує переоцінки. Кампанії, контент, ліцензії, AI/API й постійне рецензування оцінюються окремо; неоцінені запити не включені.",
              )}
            </p>
            {draft.mode === "full" && (
              <p className="scope-receipt-note">
                {t(
                  "The AI OSINT technical integration is already included in the core. It is an additional item only for the fallback route.",
                  "Технічна інтеграція AI OSINT уже включена до ядра. Додатковою позицією вона є лише у fallback.",
                )}
              </p>
            )}
            <section className="scope-fallback" aria-labelledby="scope-fallback-title">
              <h3 id="scope-fallback-title">
                {t("Fallback options", "Fallback · альтернативний варіант")}
              </h3>
              <p className="scope-receipt-note">
                {t(
                  "If the proposed development goes beyond your present requirements:",
                  "Якщо розробка перевищує ваші поточні потреби:",
                )}
              </p>
              <label className="client-route-choice">
                <input
                  type="checkbox"
                  checked={draft.mode === "graph"}
                  disabled={!ready}
                  onChange={(e) => update({ mode: e.target.checked ? "graph" : "full" })}
                />
                <span>
                  <span>
                    {t(
                      "Application as is · search, dossiers, shortlist & OSINT",
                      "Застосунок як є · пошук, досьє, shortlist та OSINT",
                    )}
                  </span>
                  <small>
                    {t(
                      "Replaces the core and workflow selections. OSINT uses the existing research service; volumes and fees require agreement.",
                      "Замінює вибір ядра та workflow. OSINT виконує наявний дослідницький сервіс; обсяг і вартість погоджуються.",
                    )}
                  </small>
                </span>
              </label>
              <label className="client-route-choice">
                <input
                  type="checkbox"
                  checked={draft.mode === "graph" && draft.serviceIds.includes("research")}
                  disabled={!ready || draft.mode !== "graph"}
                  onChange={(e) => update({ serviceIds: e.target.checked ? ["research"] : [] })}
                />
                <span>
                  {t(
                    "Add the AI research assistant integration?",
                    "Додати інтеграцію ШІ-асистента дослідника?",
                  )}
                </span>
              </label>
              <p className="scope-receipt-note">
                {t(
                  "Individual OSINT searches remain available without integration. Research usage and integration costs are agreed separately.",
                  "Разові OSINT-пошуки залишаються доступними без інтеграції. Обсяг досліджень і вартість підключення погоджуються окремо.",
                )}
              </p>
              <Link to="/" search={{ view: "map" }} className="client-text-button">
                {t("Explore the tool", "Дослідити інструмент")}
              </Link>
            </section>
            <fieldset className="scope-budget-position" disabled={!ready}>
              <legend>{t("Your budget position", "Ваша бюджетна позиція")}</legend>
              <label className="client-radio-label">
                <input
                  form="scope-response"
                  type="radio"
                  name="budget"
                  checked={draft.budgetPosition === "approve"}
                  disabled={quote === null}
                  onChange={() => update({ budgetPosition: "approve" })}
                />
                {t("Approve", "Погоджую")}
              </label>
              <label className="client-radio-label">
                <input
                  form="scope-response"
                  type="radio"
                  name="budget"
                  checked={draft.budgetPosition === "discuss"}
                  onChange={() => update({ budgetPosition: "discuss" })}
                />
                {t("Will discuss", "Обговоримо")}
              </label>
              <label className="client-radio-label">
                <input
                  form="scope-response"
                  type="radio"
                  name="budget"
                  checked={draft.budgetPosition === "limit"}
                  onChange={() => update({ budgetPosition: "limit", currency: "GBP" })}
                />
                {t("Estimated ceiling", "Орієнтовна межа")}
              </label>
              <label className="scope-ceiling-entry">
                <span className="sr-only">
                  {t("Estimated ceiling in GBP", "Орієнтовна межа у GBP")}
                </span>
                <input
                  form="scope-response"
                  type="number"
                  min="0.01"
                  step="any"
                  placeholder="XXXXX"
                  value={draft.budgetCeiling}
                  required={draft.budgetPosition === "limit"}
                  disabled={draft.budgetPosition !== "limit"}
                  onChange={(e) => update({ budgetCeiling: e.target.value, currency: "GBP" })}
                />
                <span>GBP</span>
              </label>
            </fieldset>
            {draft.mode === "full" && (
              <p className="scope-receipt-note">
                {t(
                  "Proposed core delivery and payment terms: ",
                  "Попередні умови виконання й оплати ядра: ",
                )}
                {BRIEFING_MILESTONES.map(
                  (step) => `${step.title[locale]} — ${Math.round(step.fraction * 100)}%`,
                ).join("; ")}
                {t(
                  ". Subject to agreement. Workflows have separate scope and delivery agreements.",
                  ". Підлягають погодженню. Обсяг і виконання workflow погоджуються окремо.",
                )}
              </p>
            )}
            <p className="scope-receipt-note">
              {draft.mode === "full" &&
                !packageIsCustom(draft, "core") &&
                t(
                  "Core planning range £33,600–34,944. ",
                  "Плановий діапазон ядра £33 600–34 944. ",
                )}
              {t(
                "Final price follows agreed scope. Unpriced requests, hosting, AI/API usage and ongoing operations are estimated separately.",
                "Остаточна ціна залежить від погодженого обсягу. Запити без ціни, хостинг, AI/API та постійна операційна робота оцінюються окремо.",
              )}
            </p>
            <a className="client-button scope-receipt-next" href="#scope-response-section">
              {t("Accept & arrange a discussion", "Погодити та домовитися про обговорення")}
            </a>
            <ScopeDeliveryNotes locale={locale} />
          </aside>
        </div>
        <section id="scope-response-section" className="client-scope-card scope-response-section">
          <details className="scope-large-folder scope-page-folder" open>
            <summary className="scope-workflow-tab">
              <h2>{t("Our next steps", "Наші наступні дії")}</h2>
              <ChevronDown size={20} aria-hidden="true" />
            </summary>
            <div className="scope-large-folder-body">
              <details ref={responseHint} className="scope-response-hint">
                <summary>{t("Client response", "Відповідь замовника")}</summary>
                <p>
                  {t(
                    "Confirm the capabilities you want discussed, select the fallback if appropriate, and leave your contact details. We will prepare a detailed proposal; this does not place an order or approve a final price.",
                    "Погодьте функціональність для обговорення, за потреби оберіть fallback та залиште контактні дані. На цій основі підготуємо детальну пропозицію; це не замовлення робіт і не погодження остаточної ціни.",
                  )}
                </p>
              </details>
              <form
                id="scope-response"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!validLimit) {
                    setNotice(
                      t("Enter a positive budget ceiling.", "Вкажіть додатну межу бюджету."),
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
                  <span>{t("Send", "Надіслати")}</span>
                </button>
                <button className="scope-action-card" onClick={() => window.print()}>
                  <Printer size={19} />
                  <span>PDF</span>
                </button>
                <Link to="/proposal" className="scope-action-card">
                  <ArrowLeft size={19} />
                  <span>{t("Back to start", "На початок")}</span>
                </Link>
              </div>
              {notice && (
                <p className="client-notice" role="status">
                  {notice}
                </p>
              )}
              <p className="client-note">
                {t(
                  "Your contact details and choices are stored only in this browser until you send them yourself. This is a request for discussion, not an order or acceptance of a price.",
                  "Контактні дані й вибір зберігаються лише в цьому браузері до вашого надсилання. Це запит на обговорення, а не замовлення чи погодження ціни.",
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
        <span>{t("Your indicative total", "Ваш індикативний підсумок")}</span>
        <strong>{indicativePriceLabel(estimate.low, locale, estimate.high)}</strong>
        <ArrowLeft size={17} aria-hidden="true" />
      </a>
      <ScopePrintDocument summary={summary} locale={locale} />
    </main>
  );
}
