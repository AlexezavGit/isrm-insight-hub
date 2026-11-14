import { CLIENT_SERVICES, type ClientLocale } from "@/lib/client-catalog";
import { selectedServiceIds, type ClientDraft } from "@/lib/client-draft";
import { serviceSelectionChanges } from "@/lib/tailored-scope";

type Props = {
  locale: ClientLocale;
  draft: ClientDraft;
  ready: boolean;
  update: (changes: Partial<ClientDraft>) => void;
};

export function ServiceFunctionDeck({ locale, draft, ready, update }: Props) {
  const uk = locale === "uk";
  const selected = selectedServiceIds(draft);
  return (
    <section className="scope-deck-section" aria-labelledby="scope-functions-title">
      <div className="scope-large-folder">
        <div className="scope-workflow-tab">
          <h2 id="scope-functions-title">
            {uk
              ? "Функції, включені до запиту на оцінку"
              : "Functions included in the estimate request"}
          </h2>
        </div>
        <div className="scope-large-folder-body">
          <p>
            {uk
              ? "Перевірте список і змініть вибір тут. Невибрані функції залишаться поза запитом; workflow організації визначатиметься окремо."
              : "Review and change the selection here. Unselected functions stay outside this request; the organisation's workflows are defined separately."}
          </p>
          <div className="scope-file-deck">
            {CLIENT_SERVICES.map((service) => {
              const included = selected.includes(service.id);
              return (
                <article
                  key={service.id}
                  id={`scope-service-${service.id}`}
                  className={`scope-file-card scope-interactive-folder ${included ? "is-selected" : ""}`}
                >
                  <label className="scope-file-tab">
                    <input
                      type="checkbox"
                      checked={included}
                      disabled={!ready}
                      onChange={(event) =>
                        update(
                          serviceSelectionChanges(
                            draft,
                            event.target.checked
                              ? [...selected, service.id]
                              : selected.filter((id) => id !== service.id),
                          ),
                        )
                      }
                    />
                    <span>{service.title[locale]}</span>
                  </label>
                  <div className="scope-file-body">
                    <p>{service.detail[locale]}</p>
                    <small>{service.status[locale]}</small>
                    <p className="scope-receipt-note">
                      {included
                        ? uk
                          ? "У запиті на оцінку."
                          : "Included in the estimate request."
                        : uk
                          ? "Не включено: відповідні можливості не входитимуть до оцінюваного обсягу."
                          : "Not included: the corresponding capabilities will remain outside the estimated scope."}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
