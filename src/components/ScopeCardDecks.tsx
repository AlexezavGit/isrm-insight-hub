import { IsrmContextLinks } from "./IsrmContextLinks";
import { Check, ChevronDown } from "lucide-react";
import {
  CLIENT_SERVICES,
  CLIENT_WORKFLOWS,
  CORE_SERVICE_IDS,
  WORKFLOW_OUTCOME_COPY,
  type ClientLocale,
} from "@/lib/client-catalog";
import { CLIENT_APPROVED_PRICES, indicativePriceLabel } from "@/lib/client-pricing";
import { selectedServiceIds, type ClientDraft } from "@/lib/client-draft";

type Props = {
  locale: ClientLocale;
  draft: ClientDraft;
  ready: boolean;
  update: (changes: Partial<ClientDraft>) => void;
};
function ScopePrice({ value, locale }: { value: number | null; locale: ClientLocale }) {
  return <strong className="scope-block-price">{indicativePriceLabel(value, locale)}</strong>;
}
function ServiceFolder({
  service,
  locale,
  included = false,
  index,
  group,
}: {
  service: (typeof CLIENT_SERVICES)[number];
  locale: ClientLocale;
  included?: boolean;
  index: number;
  group: string;
}) {
  return (
    <details
      className={`scope-file-card scope-interactive-folder ${included ? "is-selected" : ""}`}
      name={group}
    >
      <summary className="scope-file-tab">
        <span>{service.title[locale]}</span>
        <ChevronDown size={17} aria-hidden="true" />
      </summary>
      <div className="scope-file-body">
        <span className="scope-file-number">{String(index + 1).padStart(2, "0")}</span>
        <p>{service.detail[locale]}</p>
        <small>{service.status[locale]}</small>
        {included && (
          <span className="scope-file-selection">
            <Check size={15} aria-hidden="true" />
            {locale === "uk" ? "У складі ядра" : "Included in the core"}
          </span>
        )}
      </div>
    </details>
  );
}
export function CoreServiceDeck({ locale, draft }: Props) {
  const uk = locale === "uk",
    selected = new Set(selectedServiceIds(draft));
  return (
    <section className="scope-deck-section" aria-labelledby="scope-core-title">
      <p className="scope-deck-hint">{uk ? "Ваші пріоритети" : "Your priorities"}</p>
      <details className="scope-large-folder" open>
        <summary className="scope-workflow-tab">
          <h2 id="scope-core-title">
            {uk ? "Сервісна функціональність ядра" : "Core service capabilities"}
          </h2>
          <ChevronDown size={20} aria-hidden="true" />
        </summary>
        <div className="scope-large-folder-body">
          <div className="scope-file-deck">
            {CLIENT_SERVICES.filter((s) => CORE_SERVICE_IDS.includes(s.id)).map(
              (service, index) => (
                <ServiceFolder
                  key={service.id}
                  service={service}
                  index={index}
                  locale={locale}
                  included={draft.mode === "full" && selected.has(service.id)}
                  group="scope-core-services"
                />
              ),
            )}
          </div>
          <details className="scope-context-note">
            <summary>
              {uk ? "Контекст ISRM та межі реалізації" : "ISRM context and delivery boundaries"}
            </summary>
            <IsrmContextLinks context="core" locale={locale} />
            <p>
              {uk
                ? "Описані можливості належать до погоджуваного ядра. Демонстрація показує частину функцій; обсяг даних, правила доступу та конкретні інтеграції уточнюються в ТЗ. Платні ресурси, навчальні платформи й системи управління проєктами — наступна ітерація Integration."
                : "These capabilities describe the core to be agreed. The demonstration shows a subset; data volumes, access rules and specific integrations are defined in the specification. Paid resources, learning platforms and project-management systems belong to the next Integration iteration."}
            </p>
          </details>
          {draft.mode === "full" && (
            <footer className="scope-block-decision">
              <ScopePrice value={CLIENT_APPROVED_PRICES.base} locale={locale} />
            </footer>
          )}
        </div>
      </details>
    </section>
  );
}
export function WorkflowDeck({ locale, draft, ready, update }: Props) {
  const uk = locale === "uk";
  return (
    <>
      <div className="scope-workflow-timeline">
        {CLIENT_WORKFLOWS.map((w) => (
          <article
            className={`scope-deck-section scope-workflow-card ${draft.workflowIds.includes(w.id) ? "is-selected" : ""}`}
            key={w.id}
            id={`scope-workflow-${w.id}`}
          >
            <p className="scope-deck-hint">
              {uk
                ? "Подумайте, як це допоможе у вашій роботі"
                : "Consider how this would support your work"}
            </p>
            <details className="scope-large-folder">
              <summary className="scope-workflow-tab">
                <h2 className="scope-workflow-name">{w.title[locale]}</h2>
                <ChevronDown size={20} aria-hidden="true" />
              </summary>
              <div className="scope-workflow-body">
                {w.id === "monitoring" && <p className="scope-receipt-note">{w.detail[locale]}</p>}
                {draft.mode !== "full" && (
                  <p className="scope-receipt-note">
                    {uk
                      ? "Вибір цього workflow поверне повний обсяг ядра замість fallback."
                      : "Selecting this workflow restores the full core instead of the fallback."}
                  </p>
                )}
                <ul className="scope-outcome-deck">
                  {w.outputs[locale].map((output, i) => (
                    <li key={output}>
                      <details className="scope-outcome-folder">
                        <summary>
                          <span>0{i + 1}</span>
                          <strong>{output}</strong>
                          <ChevronDown size={16} aria-hidden="true" />
                        </summary>
                        <p>{WORKFLOW_OUTCOME_COPY[w.id][locale][i]}</p>
                      </details>
                    </li>
                  ))}
                </ul>
                <details className="scope-interactive-folder scope-workflow-conditions">
                  <summary className="scope-file-tab">
                    <span>
                      {uk
                        ? w.id === "engagement"
                          ? "Кампанія та умови реалізації"
                          : w.id === "monitoring"
                            ? "Джерела, права й умови пілоту"
                            : "Авторство та умови використання"
                        : w.id === "engagement"
                          ? "Campaign and delivery conditions"
                          : w.id === "monitoring"
                            ? "Sources, rights & pilot boundaries"
                            : "Attribution and usage conditions"}
                    </span>
                    <ChevronDown size={17} aria-hidden="true" />
                  </summary>
                  <div className="scope-file-body">
                    <p>
                      {uk
                        ? w.id === "engagement"
                          ? "Ви зможете залучати цільові аудиторії через погоджену медіакампанію й спрямовувати звернення до потрібних сервісів. Стратегія, креатив, матеріали, модерація, аналіз результатів і медіарозміщення потребують оцінки для пропозиції; до поточної ціни ядра вони не включені. Аудиторії, дозволи на комунікацію та відповідальність погоджуються в ТЗ."
                          : "Ви зможете перетворювати перевірені дані й внески колег у продукти, зберігаючи джерела, авторство та дозволи на повторне використання. Результати застосування можуть повертатися до спільної експертизи. Вплив на довіру, репутацію та гонорари оцінюється за практичними результатами."
                        : w.id === "engagement"
                          ? "An agreed communications campaign could help ISRM reach interested professional audiences and direct their enquiries to the appropriate services. Strategy, creative work, content, moderation, results analysis and media placement require an estimate in the proposal; they are outside the current core price. Audiences, communication permissions and responsibilities are agreed in the specification."
                          : "ISRM and its members could develop reviewed information and colleagues’ experience into useful professional resources, retaining sources, attribution and agreed permissions. Experience from applying them can feed back into shared expertise. Effects on trust, reputation and fees are assessed through practical outcomes."}
                    </p>
                    {w.id === "monitoring" && (
                      <p>
                        {uk
                          ? "Орієнтир стосується розробки обмеженого пілоту на одному джерелі. Ліцензії World Monitor або іншого постачальника, API, постійний моніторинг і професійне рецензування оцінюються окремо. Робота спирається на ядро; повторно базові сервіси не оплачуються."
                          : "The estimate covers development of a bounded pilot using one source. World Monitor or other provider licences, API usage, ongoing monitoring and professional review are estimated separately. The workflow builds on the core without charging again for its shared services."}
                      </p>
                    )}
                    <IsrmContextLinks context={w.id} locale={locale} />
                  </div>
                </details>
                <footer className="scope-block-decision">
                  <ScopePrice value={CLIENT_APPROVED_PRICES[w.id]} locale={locale} />
                  <label className="scope-block-choice">
                    <input
                      type="checkbox"
                      checked={draft.mode === "full" && draft.workflowIds.includes(w.id)}
                      disabled={!ready}
                      onChange={(e) =>
                        update({
                          mode: "full",
                          workflowIds: e.target.checked
                            ? [...draft.workflowIds, w.id]
                            : draft.workflowIds.filter((id) => id !== w.id),
                        })
                      }
                    />
                    <span>
                      {uk
                        ? "Погоджую — додати до розрахунків у пропозиції"
                        : "Approve — include in the proposal estimate"}
                    </span>
                  </label>
                </footer>
              </div>
            </details>
          </article>
        ))}
      </div>
    </>
  );
}
