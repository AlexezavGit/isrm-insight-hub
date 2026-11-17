import { briefingGraph } from "@/lib/briefing-graph";
import { MAP_SYMBOLS, mapSymbolPath } from "@/lib/map-symbols";
import { networkSymbolKind } from "@/lib/network-symbols";
import type { Expert } from "@/lib/types";
import type { ClientLocale } from "@/lib/client-catalog";
export function BriefingSearchJourneyFigure({
  experts,
  locale,
}: {
  experts: Expert[];
  locale: ClientLocale;
}) {
  const uk = locale === "uk",
    graph = briefingGraph(experts, "expertise", locale);
  const selected =
    experts.find((e) => graph.matched.has(e.code) && e.verified) ??
    experts.find((e) => graph.matched.has(e.code));
  const extent =
    Math.max(
      180,
      ...[...graph.positions.values()].map((p) => Math.max(Math.abs(p.x), Math.abs(p.y))),
    ) + 30;
  const labels = uk
    ? [
        "Огляд вибірки",
        "Обрати експертизу",
        "Переглянути досьє",
        "Відібрати",
        "Зберегти й продовжити",
      ]
    : ["Review the sample", "Choose expertise", "Review dossier", "Select", "Save & continue"];
  return (
    <figure className="briefing-evidence-figure briefing-search-journey">
      <div className="briefing-journey-states">
        {labels.map((label, stage) => (
          <div className="briefing-journey-state" key={label}>
            <strong>
              {stage + 1}. {label}
            </strong>
            <svg
              viewBox={`${-extent} ${-extent} ${extent * 2} ${extent * 2}`}
              role="img"
              aria-label={label}
            >
              {graph.links.map((e) => {
                const a = graph.positions.get(e.source)!,
                  b = graph.positions.get(e.target)!;
                return (
                  <line
                    key={`${e.source}-${e.target}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="#a5bfc4"
                    opacity={stage === 0 || graph.matched.has(e.source) ? 0.24 : 0.035}
                  />
                );
              })}
              {graph.nodes.map((n) => {
                const p = graph.positions.get(n.id)!,
                  k = networkSymbolKind(n),
                  active =
                    stage === 0 ||
                    (stage === 1
                      ? graph.matched.has(n.id) || n.id === graph.category?.id
                      : n.id === selected?.code || n.id === graph.category?.id);
                return (
                  <g key={n.id} transform={`translate(${p.x} ${p.y})`} opacity={active ? 1 : 0.1}>
                    <path
                      d={mapSymbolPath(k, n.kind === "expert" ? 6 : 12)}
                      fill={MAP_SYMBOLS[k].filled ? MAP_SYMBOLS[k].color : "#0c2b39"}
                      stroke={MAP_SYMBOLS[k].color}
                      strokeWidth="2"
                    />
                    {stage >= 3 && n.id === selected?.code && (
                      <rect
                        x="-16"
                        y="-16"
                        width="32"
                        height="32"
                        fill="none"
                        stroke="#f0eadb"
                        strokeWidth="4"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
            <p>
              {stage === 0
                ? `${experts.length} ${uk ? "записів" : "records"}`
                : stage === 1
                  ? `${graph.category?.label ?? "—"} · ${graph.matched.size}`
                  : stage === 2
                    ? `${selected?.code ?? "—"} · ${selected?.primaryExpertise ?? ""}`
                    : stage === 3
                      ? `${uk ? "Приклад відбору" : "Example selection"}: ${selected?.code ?? "—"}`
                      : uk
                        ? "Відбір у цьому браузері"
                        : "Selection in this browser"}
            </p>
          </div>
        ))}
      </div>
      <figcaption>
        {uk
          ? "Ті самі реальні записи в послідовних станах. Показаний відбір — навчальний приклад, не рекомендація експерта."
          : "The same real records in successive states. The illustrated selection is a learning example, not an expert recommendation."}{" "}
        <a href="/?view=map&sample=expertise&practice=search">
          {uk ? "Відтворити в живому графі" : "Try it in the live graph"}
        </a>
        <small className="briefing-sample-sources">
          ISRM-DATA-RESEARCH-WORKBOOK-RECORDS-2026-11-12 ·
          ISRM-DATA-RESEARCH-WORKBOOK-PROFILES-2026-08-28
        </small>
      </figcaption>
    </figure>
  );
}
