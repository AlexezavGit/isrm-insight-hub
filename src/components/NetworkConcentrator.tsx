import { useEffect, useRef, useState } from "react";
import { concentratorGroups } from "@/lib/network-presentation";
import type { NetworkNode } from "@/lib/network-model";

/** Category browsing is separate from the member directory's person search. */
export function NetworkConcentrator({
  nodes,
  value,
  onChange,
  uk,
}: {
  nodes: NetworkNode[];
  value: string;
  onChange: (id: string) => void;
  uk: boolean;
}) {
  const menu = useRef<HTMLDetailsElement>(null);
  const [query, setQuery] = useState("");
  const groups = concentratorGroups(nodes);
  const searching = query.trim().length >= 3;
  const normalise = (text: string) => text.toLocaleLowerCase(uk ? "uk" : "en-GB");
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (menu.current && !menu.current.contains(event.target as Node)) menu.current.open = false;
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  const choose = (id: string) => {
    onChange(id);
    if (menu.current) menu.current.open = false;
    setQuery("");
  };
  const matching = groups
    .map((group) => ({
      ...group,
      nodes: group.nodes.filter(
        (node) => !searching || normalise(node.label).includes(normalise(query.trim())),
      ),
    }))
    .filter((group) => group.nodes.length);
  return (
    <details
      ref={menu}
      className="network-concentrator-menu"
      onKeyDown={(event) => {
        if (event.key === "Escape" && menu.current) {
          menu.current.open = false;
          menu.current.querySelector("summary")?.focus();
        }
      }}
    >
      <summary aria-label={uk ? "Обрати концентратор графа" : "Choose graph concentrator"}>
        <span>{uk ? "Концентратор" : "Concentrator"}</span>
        <strong>{nodes.find((node) => node.id === value)?.label ?? "ISRM"}</strong>
      </summary>
      <div className="network-concentrator-options">
        <label>
          {uk ? "Знайти категорію чи сервіс" : "Find a category or service"}
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={uk ? "Щонайменше 3 літери" : "At least 3 letters"}
          />
        </label>
        <button onClick={() => choose("isrm")} aria-pressed={value === "isrm"}>
          ISRM
        </button>
        {matching.map((group) => (
          <details key={`${group.id}:${searching}`} open={searching || undefined}>
            <summary>
              {uk ? group.uk : group.en} <small>{group.nodes.length}</small>
            </summary>
            <ul>
              {group.nodes.map((node) => (
                <li key={node.id}>
                  <button aria-pressed={node.id === value} onClick={() => choose(node.id)}>
                    {node.label}
                  </button>
                </li>
              ))}
            </ul>
          </details>
        ))}
        {!matching.length && (
          <p role="status">
            {uk ? "Відповідних категорій не знайдено." : "No matching categories found."}
          </p>
        )}
      </div>
    </details>
  );
}
