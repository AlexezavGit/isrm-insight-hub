import { IsrmContextLinks } from "./IsrmContextLinks";
import { IntegrationStrip } from "./IntegrationStrip";
import { Check, ChevronDown } from "lucide-react";
import { CLIENT_SERVICES, CLIENT_WORKFLOWS, type ClientLocale } from "@/lib/client-catalog";
import { CLIENT_APPROVED_PRICES, indicativePriceLabel } from "@/lib/client-pricing";
import type { ClientDraft } from "@/lib/client-draft";
import { PackageServiceEditor } from "./PackageServiceEditor";
import { packageChanges, packageServiceIds } from "@/lib/tailored-scope";

type Props = {
  locale: ClientLocale;
  draft: ClientDraft;
  ready: boolean;
  update: (changes: Partial<ClientDraft>) => void;
};
function ScopePrice({ value, locale }: { value: number | null; locale: ClientLocale }) {
  return <strong className="scope-block-price">{indicativePriceLabel(value, locale)}</strong>;
}
export function CoreServiceDeck({ locale, draft, ready, update }: Props) {
  const uk = locale === "uk";
  const ids = packageServiceIds(draft, "core");
  return (
    <section className="scope-deck-section" aria-labelledby="scope-core-title">
      <details className="scope-large-folder" open>
        <summary className="scope-workflow-tab">
          <h2 id="scope-core-title">
            {uk ? "Сервісна функціональність ядра" : "Core service capabilities"}
          </h2>
          <ChevronDown size={20} aria-hidden="true" />
        </summary>
        <div className="scope-large-folder-body">
          <p className="scope-receipt-note">
            {uk
              ? "Оберіть потрібні сервіси. Змінений склад потребує переоцінки в детальній пропозиції; це не пропорційна зміна ціни за кількістю позначок."
              : "Choose the services you need. A changed composition requires reassessment in the detailed proposal; the price does not change in proportion to the number of ticks."}
          </p>
          <div className="scope-file-deck">
            {CLIENT_SERVICES.map((service, index) => {
              const included = draft.mode === "full" && ids.includes(service.id);
              return (
                <div className="scope-service-folder" key={service.id}>
                  <label className="scope-service-check">
                    <input
                      type="checkbox"
                      disabled={!ready}
                      checked={included}
                      aria-label={
                        (uk ? "Включити до ядра: " : "Include in the core: ") +
                        service.title[locale]
                      }
                      onChange={(event) =>
                        update(
                          packageChanges(
                            draft,
                            "core",
                            event.target.checked
                              ? [...ids, service.id]
                              : ids.filter((id) => id !== service.id),
                          ),
                        )
                      }
                    />
                  </label>
                  <details
                    className={`scope-file-card scope-interactive-folder ${included ? "is-selected" : ""}`}
                    name="scope-core-services"
                  >
                    <summary className="scope-file-tab">
                      <span>{service.title[locale]}</span>
                      <ChevronDown size={17} aria-hidden="true" />
                    </summary>
                    <div className="scope-file-body">
                      <span className="scope-file-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p>{service.detail[locale]}</p>
                      <small>{service.status[locale]}</small>
                      {included && (
                        <span className="scope-file-selection">
                          <Check size={15} aria-hidden="true" />
                          {uk ? "У складі ядра" : "Included in the core"}
                        </span>
                      )}
                    </div>
                  </details>
                </div>
              );
            })}
          </div>
          <IntegrationStrip locale={locale} />
          <details className="scope-context-note">
            <summary>
              {uk ? "Контекст ISRM та межі реалізації" : "ISRM context and delivery boundaries"}
            </summary>
            <IsrmContextLinks context="core" locale={locale} />
            <p>
              {uk
                ? "Демонстрація показує частину функцій. Обсяг даних, доступи й конкретні інтеграції визначаються в ТЗ. Подальші можливості та умови підтримки погоджуються окремо."
                : "The demonstration shows a subset of these capabilities. Data volumes, access and named integrations are defined in the specification. Further capabilities and support arrangements require separate agreement."}
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
    <section
      className="scope-additional-options"
      aria-label={uk ? "Додаткові напрями та умови" : "Additional services and conditions"}
    >
      <p className="scope-receipt-note">
        {uk
          ? "Готові набори — лише орієнтири. Обирайте напрям, якщо він потрібний; описи взаємодій можна дослідити в конфігураторі."
          : "These suggested bundles are starting points. Select a direction if useful; explore the interactions in the configurator."}
      </p>
      {CLIENT_WORKFLOWS.map((w) => {
        const title =
          w.id === "engagement"
            ? uk
              ? "Кампанія та умови реалізації"
              : "Campaign and delivery arrangements"
            : w.id === "expertise"
              ? uk
                ? "Авторство та умови використання"
                : "Authorship and use of expertise"
              : uk
                ? "Джерела, права й умови пілоту"
                : "Sources, rights and pilot arrangements";
        const description =
          w.id === "engagement"
            ? uk
              ? "Погоджена кампанія та подальша робота зі зверненнями. Цільові аудиторії, дозволи на комунікацію, стратегія, контент, модерація, медіавитрати й відповідальні визначаються в пропозиції."
              : "An agreed campaign and enquiry follow-up. Audiences, communication permissions, strategy, content, moderation, media costs and responsibilities are defined in the proposal."
            : w.id === "expertise"
              ? uk
                ? "Використання професійного досвіду в матеріалах і послугах зі збереженням джерел, авторства й дозволів. Погодити перевірку, способи поширення та права повторного використання."
                : "Use professional experience in resources and services while retaining sources, attribution and permission. Agree review, distribution and reuse rights."
              : uk
                ? "Обмежений пілот моніторингу на погодженому джерелі й темі. Ліцензії, API, права поширення, аудиторія та постійне рецензування погоджуються окремо; живий моніторинг у демо не підключено."
                : "A bounded monitoring pilot using an agreed source and topic. Licences, API use, distribution rights, audience and ongoing review require separate agreement; no live monitoring is connected in the demo.";
        return (
          <article className="scope-option-row" id={`scope-workflow-${w.id}`} key={w.id}>
            <label className="scope-option-choice">
              <input
                type="checkbox"
                disabled={!ready}
                checked={draft.mode === "full" && draft.workflowIds.includes(w.id)}
                onChange={(event) =>
                  update({
                    mode: "full",
                    workflowIds: event.target.checked
                      ? [...new Set([...draft.workflowIds, w.id])]
                      : draft.workflowIds.filter((id) => id !== w.id),
                  })
                }
              />
              <strong>{title}</strong>
              <ScopePrice value={CLIENT_APPROVED_PRICES[w.id]} locale={locale} />
            </label>
            <details className="scope-context-note">
              <summary>
                {uk ? "Важливі умови та склад" : "Arrangements and included services"}
              </summary>
              <p>{description}</p>
              <PackageServiceEditor
                id={w.id}
                draft={draft}
                locale={locale}
                disabled={!ready}
                onChange={(id, checked) =>
                  update(
                    packageChanges(
                      draft,
                      w.id,
                      checked
                        ? [...packageServiceIds(draft, w.id), id]
                        : packageServiceIds(draft, w.id).filter((s) => s !== id),
                    ),
                  )
                }
              />
              <IsrmContextLinks context={w.id} locale={locale} />
            </details>
          </article>
        );
      })}
    </section>
  );
}
