import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { CLIENT_WORKFLOWS, type ClientLocale, type ServiceId } from "@/lib/client-catalog";
import { NetworkWorkflowDescription } from "./NetworkDescriptions";
export function NetworkWorkflowHint({
  id,
  locale,
  onClose,
  onService,
  selected,
  onSelect,
  disabled,
}: {
  id: string;
  locale: ClientLocale;
  onClose: () => void;
  onService: (id: ServiceId) => void;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  disabled: boolean;
}) {
  const ref = useRef<HTMLElement>(null),
    uk = locale === "uk";
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Element &&
        !event.target.closest(".network-graph canvas,.network-workflow-info") &&
        !ref.current?.contains(event.target)
      )
        onClose();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [onClose]);
  const workflow = CLIENT_WORKFLOWS.find((w) => w.id === id);
  return (
    <aside
      ref={ref}
      className="network-workflow-hint"
      role="dialog"
      aria-label={uk ? "Пояснення workflow" : "Workflow explanation"}
    >
      <header>
        <strong>
          {id === "core" ? (uk ? "Ядро довіри" : "Trust core") : workflow?.title[locale]}
        </strong>
        <button onClick={onClose} aria-label={uk ? "Закрити пояснення" : "Close explanation"}>
          <X size={18} />
        </button>
      </header>
      <NetworkWorkflowDescription id={id} locale={locale} onService={onService} compact />
      {workflow && (
        <label>
          <input
            type="checkbox"
            disabled={disabled}
            checked={selected}
            onChange={(event) => onSelect(event.target.checked)}
          />
          {uk ? "Додати цей набір до пропозиції" : "Include this bundle in the proposal"}
        </label>
      )}
    </aside>
  );
}
