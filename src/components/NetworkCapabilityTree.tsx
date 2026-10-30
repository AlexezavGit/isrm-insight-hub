import { Plus } from "lucide-react";
import { CLIENT_SERVICES, type ClientLocale, type ServiceId } from "@/lib/client-catalog";
import type { ClientDraft } from "@/lib/client-draft";
import { selectedServiceIds } from "@/lib/client-draft";

export function NetworkCapabilityTree({
  draft,
  locale,
  onService,
  disabled,
  onToggle,
}: {
  draft: ClientDraft;
  locale: ClientLocale;
  onService: (id: ServiceId) => void;
  disabled: boolean;
  onToggle: (serviceId: ServiceId, checked: boolean) => void;
}) {
  const uk = locale === "uk",
    selected = selectedServiceIds(draft);
  return (
    <div className="network-capability-tree network-service-choices">
      {CLIENT_SERVICES.map((service) => (
        <div className="capability-service-choice" key={service.id}>
          <input
            type="checkbox"
            checked={selected.includes(service.id)}
            disabled={disabled}
            aria-label={
              (uk ? "Включити до пропозиції: " : "Include in proposal: ") + service.title[locale]
            }
            onChange={(event) => onToggle(service.id, event.target.checked)}
          />
          <button
            className="capability-tree-service"
            data-service-id={service.id}
            onClick={() => onService(service.id)}
          >
            <Plus size={16} />
            <span>{service.title[locale]}</span>
          </button>
        </div>
      ))}
      <small>
        {uk
          ? "Вибір змінює запропонований склад сервісів. Workflow пояснюються на графі; змінений обсяг потребує переоцінки."
          : "Your choices shape the proposed services. Workflow explanations are on the graph; changed scope requires reassessment."}
      </small>
    </div>
  );
}
