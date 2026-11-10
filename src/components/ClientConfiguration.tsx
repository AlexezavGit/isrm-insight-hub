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
import { WorkflowValue } from "./ClientValueFramework";
import { useClientDraft } from "./ClientDraftProvider";
import { CLIENT_SERVICES, CLIENT_WORKFLOWS, type ServiceId } from "@/lib/client-catalog";
import { selectedServiceIds } from "@/lib/client-draft";
import { serviceSelectionChanges } from "@/lib/tailored-scope";

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
            {uk ? "Приклади зв’язків" : "Connection examples"}
          </button>
        </div>
        <p className="client-note">
          {uk
            ? "Обирайте потрібні функції. Приклади нижче показують, як їх можна поєднати; це не готові workflow для погодження."
            : "Select the functions you need. The examples show how they can connect; they are not predefined workflows for approval."}
        </p>
        {draft.mode !== "full" && (
          <div className="client-notice">
            <p>
              {uk
                ? "Ви можете переглянути поточний набір і змінити його. Будь-яка зміна переведе запит до оцінки функцій."
                : "You can review and change the current selection. Any change will create a function-based estimate request."}
            </p>
          </div>
        )}
        {tab === "services"
          ? CLIENT_SERVICES.map((s) => (
              <article
                key={s.id}
                id={`client-service-${s.id}`}
                className={`client-service-card ${activeService === s.id ? "is-focused" : ""} ${ids.includes(s.id) ? "is-selected" : ""}`}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={ids.includes(s.id)}
                    disabled={!ready}
                    onChange={(e) =>
                      update(
                        serviceSelectionChanges(
                          draft,
                          e.target.checked ? [...ids, s.id] : ids.filter((id) => id !== s.id),
                        ),
                      )
                    }
                  />
                  <strong>{s.title[locale]}</strong>
                </label>
                <p>{s.detail[locale]}</p>
                <span className="client-status">{s.status[locale]}</span>
                <p className="client-note">
                  {ids.includes(s.id)
                    ? uk
                      ? "Включено до функціонального обсягу."
                      : "Included in the functional scope."
                    : uk
                      ? "Не включено: приклади, яким потрібна ця функція, нижче покажуть її відсутність."
                      : "Not included: examples that use this function below will show the gap."}
                </p>
                <details>
                  <summary>{uk ? "Може підтримувати" : "Can support"}</summary>
                  <ul>
                    {CLIENT_WORKFLOWS.filter((w) => w.serviceIds.includes(s.id)).map((w) => (
                      <li key={w.id}>{w.title[locale]}</li>
                    ))}
                  </ul>
                </details>
                <button
                  type="button"
                  className="client-text-button"
                  onClick={() => onExplore([s.id])}
                >
                  {uk ? "Показати на графі" : "Show on the graph"} →
                </button>
              </article>
            ))
          : CLIENT_WORKFLOWS.map((w) => {
              const missing = w.serviceIds.filter((id) => !ids.includes(id));
              return (
                <article key={w.id} className="client-service-card">
                  <h3>{w.title[locale]}</h3>
                  <p>{w.detail[locale]}</p>
                  <WorkflowValue workflow={w.id} locale={locale} compact />
                  <ul className="client-output-tags">
                    {w.outputs[locale].map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                  <div className="client-note" aria-live="polite">
                    <strong>
                      {uk
                        ? missing.length
                          ? "Чого бракує в обраному наборі"
                          : "Усі пов’язані функції обрані"
                        : missing.length
                          ? "Missing from the selected functions"
                          : "All related functions are selected"}
                    </strong>
                    {missing.length ? (
                      <ul>
                        {missing.map((id) => (
                          <li key={id}>
                            {CLIENT_SERVICES.find((service) => service.id === id)?.title[locale]}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>
                        {uk
                          ? "Це лише приклад зв’язків, не погодження чи вимога реалізувати цей workflow."
                          : "This is only a connection example, not approval or a requirement to implement this workflow."}
                      </p>
                    )}
                    {missing.length > 0 && (
                      <p>
                        {uk
                          ? "Без цих функцій приклад втрачає відповідні можливості. Реальний процес організації може бути іншим."
                          : "Without these functions, the example lacks the corresponding capabilities. The organisation's actual process may differ."}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="client-text-button"
                    onClick={() => onExplore(w.serviceIds)}
                  >
                    {uk ? "Показати залежності" : "Show dependencies"} →
                  </button>
                </article>
              );
            })}
        <button
          type="button"
          className="client-button client-button-secondary"
          disabled={!ready}
          onClick={start}
        >
          {uk ? "Додати власну функціональність" : "Add a capability of your own"}
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
                kind: "service",
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
