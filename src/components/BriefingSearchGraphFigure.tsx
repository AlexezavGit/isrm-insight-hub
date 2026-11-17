import { useMemo, useState } from "react";
import type { NetworkNode } from "@/lib/network-model";
import { briefingGraph } from "@/lib/briefing-graph";
import { MAP_SYMBOLS, mapSymbolPath } from "@/lib/map-symbols";
import { networkSymbolKind } from "@/lib/network-symbols";
import type { Expert } from "@/lib/types";
import type { ClientLocale } from "@/lib/client-catalog";

type View = "sectors" | "expertise";

function categoryShape(node: NetworkNode, x: number, y: number) {
  const kind = networkSymbolKind(node);
  return (
    <path
      transform={`translate(${x} ${y})`}
      d={mapSymbolPath(kind, 9)}
      fill="none"
      stroke={MAP_SYMBOLS[kind].color}
      strokeWidth="1.8"
    />
  );
}

export function BriefingSearchGraphFigure({
  experts,
  locale,
  view: initialView,
}: {
  experts: Expert[];
  locale: ClientLocale;
  view: View;
}) {
  const uk = locale === "uk";
  const [view, setView] = useState(initialView);
  const [unstructured, setUnstructured] = useState(false);
  const graph = useMemo(() => {
    const projection = briefingGraph(experts, view, locale);
    const { nodes, links, counts } = projection;
    const linkedPeople = new Set(links.map((link) => link.source));
    const withoutCategory = nodes.filter(
      (node) => node.kind === "expert" && !linkedPeople.has(node.id),
    ).length;
    const positions = unstructured ? projection.free : projection.positions;
    const values = nodes.map((node) => positions.get(node.id) ?? { x: 0, y: 0 });
    const extent = Math.max(180, ...values.map((point) => Math.hypot(point.x, point.y))) + 75;
    const labels = nodes
      .filter((node) => node.kind !== "expert")
      .sort((a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0))
      .slice(0, 6);
    const labelled = new Set(labels.map((node) => node.id));
    const otherPeople = new Set(
      links.filter((link) => !labelled.has(link.target)).map((link) => link.source),
    );
    return {
      nodes,
      links,
      positions,
      extent,
      counts,
      labels,
      withoutCategory,
      otherCount: otherPeople.size,
    };
  }, [experts, locale, view, unstructured]);
  const flagged = experts.filter((person) => person.verified).length;
  const title =
    view === "sectors"
      ? uk
        ? "Перші результати: записи за наявними секторами"
        : "First findings: records by available sector"
      : uk
        ? "Огляд записаної експертизи"
        : "Overview of recorded expertise";
  return (
    <figure className="briefing-evidence-figure briefing-search-graph-figure">
      <div className="briefing-search-graph-frame">
        <div className="briefing-search-graph-head" aria-hidden="true">
          <span>{title}</span>
          <strong>
            {experts.length} {uk ? "записів" : "records"} · {flagged}{" "}
            {uk ? "перші дані" : "initial findings"}
          </strong>
        </div>
        <div className="briefing-sample-switch" aria-label={uk ? "Зріз вибірки" : "Sample view"}>
          {(["expertise", "sectors"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={view === value}
              onClick={() => setView(value)}
            >
              {value === "expertise"
                ? uk
                  ? "Експертиза"
                  : "Expertise"
                : uk
                  ? "Сектори"
                  : "Sectors"}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={unstructured}
            onClick={() => setUnstructured((v) => !v)}
          >
            {unstructured
              ? uk
                ? "Упорядкувати"
                : "Group records"
              : uk
                ? "Без упорядкування"
                : "Ungroup records"}
          </button>
        </div>
        <div className="briefing-sample-map">
          <svg
            viewBox={`${-graph.extent} ${-graph.extent} ${graph.extent * 2} ${graph.extent * 2}`}
            role="img"
            aria-label={
              uk
                ? `Граф із ${experts.length} записів, серед них для ${flagged} зібрано перші дані з відкритих джерел`
                : `Graph of ${experts.length} records, including ${flagged} with initial public-source data collected`
            }
          >
            {graph.links.map((link, i) => {
              const a = graph.positions.get(link.source);
              const b = graph.positions.get(link.target);
              return a && b ? (
                <line
                  key={`${link.source}-${link.target}-${i}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  className="briefing-search-graph-edge"
                />
              ) : null;
            })}
            {graph.nodes.map((node) => {
              const point = graph.positions.get(node.id);
              if (!point) return null;
              if (node.kind !== "expert")
                return <g key={node.id}>{categoryShape(node, point.x, point.y)}</g>;
              return (
                <g key={node.id}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    className="briefing-search-graph-person"
                  />
                  {node.expert?.verified && (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="6.7"
                      className="briefing-search-graph-source"
                    />
                  )}
                </g>
              );
            })}
            {!unstructured &&
              graph.labels.map((node, index) => {
                const point = graph.positions.get(node.id);
                if (!point) return null;
                return (
                  <g key={`label-${node.id}`}>
                    <rect
                      x={point.x - 19}
                      y={point.y + 15}
                      width="38"
                      height="30"
                      rx="3"
                      className="briefing-search-graph-label-bg"
                    />
                    <text
                      x={point.x}
                      y={point.y + 36}
                      textAnchor="middle"
                      className="briefing-search-graph-label"
                    >
                      {index + 1}
                    </text>
                  </g>
                );
              })}
            {!unstructured && view === "expertise" && graph.withoutCategory > 0 && (
              <g>
                <rect
                  x="-116"
                  y="126"
                  width="232"
                  height="30"
                  rx="3"
                  className="briefing-search-graph-label-bg"
                />
                <text x="0" y="146" textAnchor="middle" className="briefing-search-graph-label">
                  {uk ? "Експертизу не записано" : "Expertise not recorded"}
                </text>
              </g>
            )}
          </svg>
          <ol
            className="briefing-sample-structure"
            aria-label={uk ? "Структура вибірки" : "Sample structure"}
          >
            {graph.labels.map((node) => (
              <li key={node.id}>
                <span>{node.label}</span>
                <strong>{graph.counts.get(node.id) ?? 0}</strong>
              </li>
            ))}
            {graph.otherCount > 0 && (
              <li className="is-other">
                <span>{uk ? "Інші записані напрями" : "Other recorded categories"}</span>
                <strong>{graph.otherCount}</strong>
              </li>
            )}
            {graph.withoutCategory > 0 && (
              <li className="is-other">
                <span>{uk ? "Без записаної категорії" : "No category recorded"}</span>
                <strong>{graph.withoutCategory}</strong>
              </li>
            )}
          </ol>
        </div>
        <div className="briefing-search-graph-legend" aria-hidden="true">
          <span>
            <i className="briefing-legend-person" />
            {uk ? "Запис" : "Record"}
          </span>
          <span>
            <i className="briefing-legend-source" />
            {uk ? "Перші джерельні дані" : "Initial source data"}
          </span>
        </div>
      </div>
      <figcaption>
        {experts.length
          ? uk
            ? "Почніть з огляду, потім звужуйте пошук. Позначка джерела не є фаховою перевіркою. Запис не доводить членства чи згоди на контакт."
            : "Start with the overview, then narrow the search. A source mark is not professional review. A record does not establish membership or permission to contact."
          : uk
            ? "Завантаження переданої вибірки…"
            : "Loading the supplied sample…"}
        {experts.length > 0 && (
          <a className="briefing-live-graph-link" href={`/?view=map&sample=${view}`}>
            {uk
              ? "Відкрити цей самий зріз у живому графі"
              : "Open this same view in the live graph"}
          </a>
        )}
        <a className="briefing-live-graph-link" href="/?view=map&sample=expertise&practice=search">
          {uk
            ? "Спробувати: напрям → досьє → відбір → збереження"
            : "Try: category → dossier → shortlist → save"}
        </a>
        <small className="briefing-sample-sources">
          ISRM-DATA-RESEARCH-WORKBOOK-RECORDS-2026-11-12 ·
          ISRM-DATA-RESEARCH-WORKBOOK-PROFILES-2026-08-28
        </small>
      </figcaption>
    </figure>
  );
}
