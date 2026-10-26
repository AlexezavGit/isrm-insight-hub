import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import {
  CLIENT_SERVICES,
  CLIENT_WORKFLOWS,
  CORE_SERVICE_IDS,
  type ClientLocale,
  type ServiceId,
} from "@/lib/client-catalog";
import { CLIENT_APPROVED_PRICES } from "@/lib/client-pricing";
import { selectedServiceIds, type ClientDraft } from "@/lib/client-draft";
import { WorkflowValue, CoreCapabilities } from "./ClientValueFramework";

type Props = {
  locale: ClientLocale;
  draft: ClientDraft;
  ready: boolean;
  update: (changes: Partial<ClientDraft>) => void;
};
function ScopePrice({ value, locale }: { value: number | null; locale: ClientLocale }) {
  return (
    <strong className="scope-block-price">
      {value === null
        ? locale === "uk"
          ? "За погодженням"
          : "To agree"
        : new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "en-GB", {
            style: "currency",
            currency: CLIENT_APPROVED_PRICES.currency,
            maximumFractionDigits: 0,
          }).format(value)}
    </strong>
  );
}
export function CoreServiceDeck({ locale, draft, ready, update }: Props) {
  const uk = locale === "uk",
    selected = new Set(selectedServiceIds(draft));
  const optional: ServiceId[] = ["groups", "contact", "research", "integration"];
  return (
    <section className="scope-deck-section" aria-labelledby="scope-core-title">
      <p className="scope-deck-hint">
        {uk
          ? "Конфігурувати набір сервісної функціональності"
          : "Configure the service capabilities"}
      </p>
      <h2 id="scope-core-title">
        {uk ? "Сервісна функціональність ядра" : "Core service capabilities"}
      </h2>
      <CoreCapabilities locale={locale} />
      <p className="client-note">
        {uk
          ? "Повний застосунок включає цей набір. Для варіанта «Граф і пошук» нижче можна обрати доступні доповнення. Суми — у ціннику."
          : "The full application includes this set. For the graph-and-search route below, available additions can be selected here. Amounts appear in the price panel."}
      </p>
      <div className="scope-file-deck">
        {CLIENT_SERVICES.filter((s) => CORE_SERVICE_IDS.includes(s.id)).map((service, index) => {
          const included = selected.has(service.id),
            selectable = draft.mode === "graph" && optional.includes(service.id);
          return (
            <article
              className={`scope-file-card ${included ? "is-selected" : ""}`}
              key={service.id}
            >
              <label className="scope-file-tab">
                <input
                  type="checkbox"
                  checked={included}
                  disabled={!ready || !selectable}
                  onChange={(e) =>
                    update({
                      serviceIds: e.target.checked
                        ? [...draft.serviceIds, service.id]
                        : draft.serviceIds.filter((id) => id !== service.id),
                    })
                  }
                />
                <span>{service.title[locale]}</span>
              </label>
              <div className="scope-file-body">
                <span className="scope-file-number">0{index + 1}</span>
                <p>{service.detail[locale]}</p>
                <small>{service.status[locale]}</small>
                <span className="scope-file-selection">
                  {included ? <Check size={15} aria-hidden="true" /> : null}
                  {included
                    ? uk
                      ? "У вибраному обсязі"
                      : "Included in your scope"
                    : selectable
                      ? uk
                        ? "Можна додати"
                        : "Available to add"
                      : uk
                        ? "У повному застосунку"
                        : "Part of the full application"}
                </span>
              </div>
            </article>
          );
        })}
      </div>
      <footer className="scope-block-decision">
        <Link to="/" search={{ stage: "configuration" }} className="client-text-button">
          {uk ? "Уточнити функціональність" : "Refine the capabilities"}
          <ArrowRight size={17} />
        </Link>
        <ScopePrice value={CLIENT_APPROVED_PRICES.base} locale={locale} />
      </footer>
    </section>
  );
}
export function WorkflowDeck({ locale, draft, ready, update }: Props) {
  const uk = locale === "uk";
  return (
    <>
      {CLIENT_WORKFLOWS.map((w) => (
        <article
          className={`scope-deck-section scope-workflow-card ${draft.workflowIds.includes(w.id) ? "is-selected" : ""}`}
          key={w.id}
        >
          <p className="scope-deck-hint">
            {uk
              ? "Трансформувати workflow під вашу практику"
              : "Shape this workflow around your practice"}
          </p>
          <header className="scope-workflow-tab">
            <h2>{w.title[locale]}</h2>
            <span>{uk ? "Опція" : "Optional"}</span>
          </header>
          <div className="scope-workflow-body">
            <p className="scope-workflow-description">{w.detail[locale]}</p>
            {draft.mode !== "full" && (
              <p className="client-note">
                {uk
                  ? "Доступно у варіанті повного застосунку. Оберіть його нижче, щоб додати workflow."
                  : "Available with the full application. Choose that route below to add this workflow."}
              </p>
            )}
            <WorkflowValue workflow={w.id} locale={locale} />
            <p className="scope-deck-hint">
              {uk ? "Можливі вихідні потоки та продукти" : "Possible outcomes and products"}
            </p>
            <ul className="scope-outcome-deck">
              {w.outputs[locale].map((output, i) => (
                <li key={output}>
                  <span>0{i + 1}</span>
                  <strong>{output}</strong>
                </li>
              ))}
            </ul>
            <Link
              to="/"
              search={{ stage: "configuration", preset: w.id }}
              className="client-text-button"
            >
              {uk ? "Уточнити цей workflow" : "Refine this workflow"}
              <ArrowRight size={17} />
            </Link>
            <footer className="scope-block-decision">
              <label className="scope-block-choice">
                <input
                  type="checkbox"
                  checked={draft.mode === "full" && draft.workflowIds.includes(w.id)}
                  disabled={!ready || draft.mode !== "full"}
                  onChange={(e) =>
                    update({
                      workflowIds: e.target.checked
                        ? [...draft.workflowIds, w.id]
                        : draft.workflowIds.filter((id) => id !== w.id),
                    })
                  }
                />
                <span>
                  {draft.mode === "full" && draft.workflowIds.includes(w.id)
                    ? uk
                      ? "Обрано"
                      : "Selected"
                    : uk
                      ? "Додати workflow"
                      : "Add this workflow"}
                </span>
              </label>
              <ScopePrice value={CLIENT_APPROVED_PRICES[w.id]} locale={locale} />
            </footer>
          </div>
        </article>
      ))}
    </>
  );
}
