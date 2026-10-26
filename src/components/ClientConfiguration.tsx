import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";
import { CoreCapabilities, WorkflowValue } from "./ClientValueFramework";
import { useClientDraft } from "./ClientDraftProvider";
import {
  CORE_SERVICE_IDS,
  CLIENT_SERVICES,
  CLIENT_WORKFLOWS,
  type ServiceId,
} from "@/lib/client-catalog";
import { selectedServiceIds } from "@/lib/client-draft";

type Props = {
  open: boolean;
  onClose: () => void;
  tab: "services" | "workflows";
  setTab: (tab: "services" | "workflows") => void;
  activeService?: string | null;
  onExplore: (ids: ServiceId[]) => void;
};
export function ClientConfiguration({
  open,
  onClose,
  tab,
  setTab,
  activeService,
  onExplore,
}: Props) {
  const { locale } = useI18n();
  const { draft, update, ready } = useClientDraft();
  const [composer, setComposer] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const uk = locale === "uk";
  const ids = selectedServiceIds(draft);
  const linked = CLIENT_WORKFLOWS.filter((w) => draft.workflowIds.includes(w.id)).flatMap(
    (w) => w.serviceIds,
  );
  const start = () => {
    setTitle("");
    setDescription("");
    setEditingId(null);
    setSaved(false);
    setComposer(true);
  };
  useEffect(() => {
    if (open && activeService && tab === "services")
      document
        .getElementById(`client-service-${activeService}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [open, activeService, tab]);
  if (!open) return null;
  return (
    <>
      <aside
        className="client-config-panel"
        aria-label={uk ? "Конфігурація рішення" : "Configure the solution"}
      >
        <header className="client-panel-heading">
          <div>
            <p className="client-eyebrow">
              {uk ? "Обговорення майбутнього рішення" : "Shape the future solution"}
            </p>
            <h2>{uk ? "Що вам потрібно?" : "What would be useful?"}</h2>
          </div>
          <button
            type="button"
            className="client-icon-button"
            onClick={onClose}
            aria-label={uk ? "Закрити панель" : "Close panel"}
          >
            <X />
          </button>
        </header>
        <div
          className="client-tabs"
          role="group"
          aria-label={uk ? "Вид налаштувань" : "Configuration view"}
        >
          <button aria-pressed={tab === "services"} onClick={() => setTab("services")}>
            {uk ? "Сервіси" : "Services"}
          </button>
          <button aria-pressed={tab === "workflows"} onClick={() => setTab("workflows")}>
            Workflows
          </button>
        </div>
        <p className="client-note">
          {uk
            ? "Вибір описує бажаний обсяг. Це не запуск сервісів і не замовлення робіт."
            : "Selections describe your preferred scope. They do not activate services or commission work."}
        </p>
        {tab === "services" && <CoreCapabilities locale={locale} compact />}
        {draft.mode !== "full" && (
          <div className="client-notice">
            <p>
              {uk
                ? "Обрано спрощений варіант. Для повної конфігурації поверніться до застосунку."
                : "A simpler route is selected. Return to the application route to configure services."}
            </p>
            <button onClick={() => update({ mode: "full" })}>
              {uk ? "Конфігурувати застосунок" : "Configure the application"}
            </button>
          </div>
        )}
        {tab === "services"
          ? CLIENT_SERVICES.map((s) => (
              <article
                key={s.id}
                id={`client-service-${s.id}`}
                className={`client-service-card ${activeService === s.id ? "is-focused" : ""}`}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={ids.includes(s.id)}
                    disabled={
                      !ready ||
                      draft.mode !== "full" ||
                      CORE_SERVICE_IDS.includes(s.id) ||
                      linked.includes(s.id)
                    }
                    onChange={(e) =>
                      update({
                        serviceIds: e.target.checked
                          ? [...draft.serviceIds, s.id]
                          : draft.serviceIds.filter((id) => id !== s.id),
                      })
                    }
                  />
                  <strong>{s.title[locale]}</strong>
                </label>
                <p>{s.detail[locale]}</p>
                <span className="client-status">{s.status[locale]}</span>
                {linked.includes(s.id) && (
                  <p className="client-note">
                    {uk
                      ? "Входить до обраного workflow; змінюється разом із ним."
                      : "Included by a selected workflow; change it with that workflow."}
                  </p>
                )}
                <button
                  type="button"
                  className="client-text-button"
                  onClick={() => onExplore([s.id])}
                >
                  {uk ? "Показати на графі" : "Show on the graph"} →
                </button>
              </article>
            ))
          : CLIENT_WORKFLOWS.map((w) => (
              <article key={w.id} className="client-service-card">
                <label>
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
                <p>{w.detail[locale]}</p>
                <WorkflowValue workflow={w.id} locale={locale} compact />
                <ul className="client-output-tags">
                  {w.outputs[locale].map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
                <details>
                  <summary>{uk ? "Задіяні сервіси" : "Services involved"}</summary>
                  <ul>
                    {w.serviceIds.map((id) => (
                      <li key={id}>{CLIENT_SERVICES.find((s) => s.id === id)?.title[locale]}</li>
                    ))}
                  </ul>
                </details>
                <button
                  type="button"
                  className="client-text-button"
                  onClick={() => onExplore(w.serviceIds)}
                >
                  {uk ? "Показати залежності" : "Show dependencies"} →
                </button>
              </article>
            ))}
        <button
          type="button"
          className="client-button client-button-secondary"
          disabled={!ready || draft.mode !== "full"}
          onClick={start}
        >
          {tab === "workflows"
            ? uk
              ? "Описати свій workflow"
              : "Describe your workflow"
            : uk
              ? "Описати свій сервіс"
              : "Describe a service"}
        </button>
        {draft.requests.map((r) => (
          <article className="client-service-card" key={r.id}>
            <strong>{r.title}</strong>
            <p className="client-prewrap">{r.description}</p>
            <div className="client-inline-actions">
              <button
                onClick={() => {
                  setTitle(r.title);
                  setDescription(r.description);
                  setEditingId(r.id);
                  setSaved(false);
                  setComposer(true);
                }}
              >
                {uk ? "Редагувати" : "Edit"}
              </button>
              <button
                onClick={() => update({ requests: draft.requests.filter((x) => x.id !== r.id) })}
              >
                {uk ? "Видалити" : "Remove"}
              </button>
            </div>
          </article>
        ))}
        <footer className="client-panel-footer">
          <Link className="client-button" to="/scope">
            {uk ? "До обсягу й бюджету" : "Review scope & budget"} <ArrowRight size={17} />
          </Link>
          <p className="client-note">
            {uk
              ? "Чернетка зберігається лише в цьому браузері."
              : "Your draft is saved only in this browser."}
          </p>
        </footer>
      </aside>
      <Dialog open={composer} onOpenChange={setComposer}>
        <DialogContent className="client-request-dialog">
          <DialogHeader>
            <DialogTitle>
              {uk ? "Опис бажаної функціональності" : "Describe what you need"}
            </DialogTitle>
            <DialogDescription>
              {uk
                ? "Для кого, яка потреба, потрібні дії, дані та ознака корисного результату. Опис увійде до підсумку."
                : "Who needs it, the problem, actions, information and a useful outcome. Your description will appear in the scope summary."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const request = {
                id: editingId || crypto.randomUUID(),
                kind:
                  (editingId ? draft.requests.find((r) => r.id === editingId)?.kind : undefined) ??
                  (tab === "workflows" ? ("workflow" as const) : ("service" as const)),
                title: title.trim(),
                description: description.trim(),
              };
              update({ requests: [...draft.requests.filter((r) => r.id !== request.id), request] });
              setSaved(true);
            }}
          >
            <label>
              {uk ? "Назва" : "Title"}
              <input
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSaved(false);
                }}
              />
            </label>
            <label>
              {uk ? "Опис" : "Description"}
              <textarea
                required
                rows={7}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setSaved(false);
                }}
              />
            </label>
            {saved ? (
              <div role="status">
                <p>
                  {uk
                    ? "Опис додано до чернетки обсягу."
                    : "Description added to your scope draft."}
                </p>
                <div className="client-inline-actions">
                  <button type="button" onClick={start}>
                    {uk ? "Описати наступний" : "Describe another"}
                  </button>
                  <button type="button" onClick={() => setComposer(false)}>
                    {uk ? "До конфігурації" : "Back to configuration"}
                  </button>
                  <Link to="/scope">{uk ? "До підсумку" : "Review summary"}</Link>
                </div>
              </div>
            ) : (
              <button type="submit" className="client-button" disabled={!ready}>
                {uk ? "Зберегти до обсягу" : "Save to scope"}
              </button>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
