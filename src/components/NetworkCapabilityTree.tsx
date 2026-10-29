import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import {
  CLIENT_SERVICES,
  CLIENT_WORKFLOWS,
  type ClientLocale,
  type ServiceId,
  type WorkflowId,
} from "@/lib/client-catalog";
import type { ClientDraft } from "@/lib/client-draft";
import { packageServiceIds, type PackageId } from "@/lib/tailored-scope";
import { PackageServiceEditor } from "./PackageServiceEditor";
export function NetworkCapabilityTree({
  draft,
  locale,
  open,
  onOpen,
  onService,
  editing,
  disabled,
  onToggle,
  onWorkflow,
}: {
  draft: ClientDraft;
  locale: ClientLocale;
  open: string | null;
  onOpen: (id: string) => void;
  onService: (id: ServiceId) => void;
  editing: boolean;
  disabled: boolean;
  onToggle: (packageId: PackageId, serviceId: ServiceId, checked: boolean) => void;
  onWorkflow: (id: WorkflowId, checked: boolean) => void;
}) {
  const uk = locale === "uk",
    [edit, setEdit] = useState(false);
  return (
    <div className="network-capability-tree">
      <button
        className="network-context-action"
        aria-pressed={edit || editing}
        onClick={() => setEdit(!edit)}
      >
        {uk ? "Змінити склад пакетів" : "Edit package composition"}
      </button>
      {[
        { id: "core" as const, title: { en: "Trust core", uk: "Ядро довіри" } },
        ...CLIENT_WORKFLOWS,
      ].map((w) => (
        <section className="capability-tree-branch" key={w.id} data-workflow-id={w.id}>
          <div className="capability-tree-heading">
            <button aria-expanded={open === w.id} onClick={() => onOpen(w.id)}>
              {open === w.id ? <Minus size={17} /> : <Plus size={17} />}
              <span>{w.title[locale]}</span>
            </button>
            {w.id !== "core" && (
              <input
                type="checkbox"
                aria-label={
                  (uk ? "Додати до пропозиції: " : "Include in proposal: ") + w.title[locale]
                }
                checked={draft.workflowIds.includes(w.id)}
                disabled={disabled}
                onChange={(e) => onWorkflow(w.id, e.target.checked)}
              />
            )}
          </div>
          {open === w.id && (
            <div className="capability-tree-leaves">
              {editing || edit ? (
                <PackageServiceEditor
                  id={w.id}
                  draft={draft}
                  locale={locale}
                  disabled={disabled}
                  onChange={(id, checked) => onToggle(w.id, id, checked)}
                />
              ) : (
                packageServiceIds(draft, w.id).map((id) => (
                  <button
                    key={id}
                    className="capability-tree-service"
                    data-service-id={id}
                    onClick={() => onService(id)}
                  >
                    <Plus size={15} />
                    {CLIENT_SERVICES.find((s) => s.id === id)?.title[locale]}
                  </button>
                ))
              )}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
