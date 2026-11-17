import { useState } from "react";
import type { Expert } from "@/lib/types";
import type { NetworkModel } from "@/lib/network-model";
import { recordedPath } from "@/lib/network-path";
import { useDismissibleDetails } from "./useDismissibleDetails";
export function NetworkConnectionPath({
  person,
  people,
  model,
  onPath,
  uk,
}: {
  person: Expert;
  people: Expert[];
  model: NetworkModel;
  onPath: (ids: string[]) => void;
  uk: boolean;
}) {
  const [query, setQuery] = useState(""),
    [path, setPath] = useState<string[] | null>(null);
  const t = (en: string, ua: string) => (uk ? ua : en);
  const details = useDismissibleDetails();
  const matches =
    query.trim().length >= 3
      ? people
          .filter(
            (p) =>
              p.code !== person.code &&
              `${p.displayName} ${p.code}`.toLowerCase().includes(query.trim().toLowerCase()),
          )
          .slice(0, 7)
      : [];
  return (
    <details ref={details} className="network-connection-path">
      <summary>
        {t(
          "Through what might these profiles connect?",
          "Через що можуть бути пов’язані ці профілі?",
        )}
      </summary>
      <label>
        {t("Find another profile · at least 3 letters", "Знайдіть інший профіль · від 3 літер")}
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPath(null);
            onPath([]);
          }}
          placeholder={t("Name or profile code", "Ім’я або код профілю")}
        />
      </label>
      {matches.map((p) => (
        <button
          className="network-context-action"
          key={p.code}
          onClick={() => {
            const next = recordedPath(model, person.code, p.code);
            setPath(next);
            onPath(next);
          }}
        >
          {p.displayName}
        </button>
      ))}
      {path && (
        <div role="status">
          {path.length ? (
            <p>
              {t(
                "Recorded route highlighted on the graph",
                "Зафіксований шлях підсвічено на графі",
              )}{" "}
              · {path.length - 1}
            </p>
          ) : (
            <p>
              {t(
                "No recorded path in the visible sample. This does not establish that no connection exists.",
                "Зафіксованого шляху у видимій вибірці немає. Це не означає відсутності зв’язку.",
              )}
            </p>
          )}
        </div>
      )}
      <small>
        {t(
          "Shared records and categories, not evidence of acquaintance or a personal recommendation. A real introduction needs a recorded relationship and permission.",
          "Спільні записи й категорії не підтверджують знайомства чи особистої рекомендації. Реальне знайомство потребує зафіксованого зв’язку й дозволу.",
        )}
      </small>
    </details>
  );
}
