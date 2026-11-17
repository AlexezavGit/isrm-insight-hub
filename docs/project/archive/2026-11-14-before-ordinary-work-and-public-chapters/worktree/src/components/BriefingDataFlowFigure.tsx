import { useMemo, useState } from "react";
import { briefingGraph } from "@/lib/briefing-graph";
import { MAP_SYMBOLS, mapSymbolPath } from "@/lib/map-symbols";
import { networkSymbolKind } from "@/lib/network-symbols";
import type { Expert } from "@/lib/types";
import type { ClientLocale } from "@/lib/client-catalog";

export function BriefingDataFlowFigure({
  experts,
  locale,
}: {
  experts: Expert[];
  locale: ClientLocale;
}) {
  const uk = locale === "uk";
  const [stage, setStage] = useState(0);
  const graph = useMemo(() => briefingGraph(experts, "expertise", locale), [experts, locale]);
  const steps = uk
    ? ["Наявні дані", "Опрацювати", "Застосувати"]
    : ["Available data", "Process", "Apply"];
  const renderMap = (state: number) => {
    const positions = state === 0 ? graph.free : graph.positions;
    const extent =
      Math.max(
        180,
        ...graph.nodes.map((n) => {
          const p = positions.get(n.id)!;
          return Math.max(Math.abs(p.x), Math.abs(p.y));
        }),
      ) + 30;
    const lit = (id: string) => state !== 2 || graph.matched.has(id) || id === graph.category?.id;
    return (
      <svg
        viewBox={`${-extent} ${-extent} ${extent * 2} ${extent * 2}`}
        role="img"
        aria-label={`${steps[state]} · ISRM`}
      >
        {graph.links.map((e) => {
          const a = positions.get(e.source)!,
            b = positions.get(e.target)!;
          return (
            <line
              key={`${e.source}-${e.target}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              style={{ opacity: lit(e.source) ? 0.4 : 0.06 }}
            />
          );
        })}
        {graph.nodes.map((n) => {
          const p = positions.get(n.id)!,
            kind = networkSymbolKind(n);
          return (
            <path
              key={n.id}
              data-record-id={n.kind === "expert" ? n.id : undefined}
              transform={`translate(${p.x} ${p.y})`}
              d={mapSymbolPath(kind, n.kind === "expert" ? 3.8 : 8)}
              fill={MAP_SYMBOLS[kind].filled ? MAP_SYMBOLS[kind].color : "#0c2b39"}
              stroke={MAP_SYMBOLS[kind].color}
              strokeWidth="1.5"
              opacity={lit(n.id) ? 1 : 0.14}
            >
              <title>{n.kind === "expert" ? n.expert?.code : n.label}</title>
            </path>
          );
        })}
      </svg>
    );
  };
  return (
    <figure className="briefing-evidence-figure briefing-data-flow">
      <div className="briefing-story-field">
        <div
          className="briefing-flow-steps"
          aria-label={uk ? "Стани того самого графа" : "States of the same graph"}
        >
          {steps.map((label, i) => (
            <button
              key={label}
              type="button"
              aria-pressed={stage === i}
              onClick={() => setStage(i)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="briefing-flow-live">{renderMap(stage)}</div>
        <div className="briefing-flow-print">
          {steps.map((label, i) => (
            <div key={label}>
              <strong>{label}</strong>
              {renderMap(i)}
            </div>
          ))}
        </div>
        <p className="briefing-story-caption" aria-live="polite">
          {stage === 2 && graph.category
            ? `${graph.category.label} · ${graph.matched.size} ${uk ? "записів за цим атрибутом" : "records with this attribute"}`
            : uk
              ? "Ті самі записи й атрибути; змінюється спосіб роботи з ними."
              : "The same records and attributes; a different way to work with them."}
        </p>
        <div className="briefing-flow-goals">
          {uk
            ? "Цілі: експертиза · взаємодія · ресурси"
            : "Goals: expertise · interaction · resources"}
        </div>
      </div>
      <figcaption>
        {uk
          ? "На прикладі вибірки ISRM. Групування показує структуру; перевірку виконують люди."
          : "Illustrated with the ISRM sample. Grouping reveals structure; people perform the review."}
        <small className="briefing-sample-sources">
          ISRM-DATA-RESEARCH-WORKBOOK-RECORDS-2026-11-12 ·
          ISRM-DATA-RESEARCH-WORKBOOK-PROFILES-2026-08-28
        </small>
      </figcaption>
    </figure>
  );
}
