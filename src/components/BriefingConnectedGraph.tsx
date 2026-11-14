import { useMemo, useState, useEffect, useRef } from "react";
import { CLIENT_SERVICES, type ClientLocale } from "@/lib/client-catalog";
import { briefingGraph } from "@/lib/briefing-graph";
import { MAP_SYMBOLS, mapSymbolPath } from "@/lib/map-symbols";
import { networkSymbolKind } from "@/lib/network-symbols";
import { interpolatePoint } from "@/lib/network-layout";
import type { Expert } from "@/lib/types";

type Scene = "responsibility" | "configuration" | "integration" | "invitation";
const workflows = [
  {
    id: "search",
    en: "Search & save",
    uk: "Пошук і збереження",
    cycle: false,
    services: ["search", "review", "groups", "contact"],
  },
  {
    id: "engagement",
    en: "Engagement cycle",
    uk: "Цикл залучення",
    cycle: true,
    services: ["survey", "contact", "integration", "groups", "publishing"],
  },
  {
    id: "expertise",
    en: "Shared expertise cycle",
    uk: "Мережева експертиза",
    cycle: true,
    services: ["groups", "research", "review", "evidence", "publishing"],
  },
  {
    id: "requests",
    en: "Client request & team",
    uk: "Запит і добір команди",
    cycle: false,
    services: ["search", "groups", "contact", "integration"],
  },
];
const systems = [
  { id: "membership", en: "Membership / CRM", uk: "Членство / CRM" },
  { id: "learning", en: "Learning / LMS", uk: "Навчання / LMS" },
  { id: "publishing", en: "WordPress / publications", uk: "WordPress / публікації" },
  { id: "communication", en: "Email / calendars", uk: "Пошта / календарі" },
  { id: "ai", en: "Optional AI assistance", uk: "Допомога ШІ — за вибором" },
];
function lines(text: string, limit = 19) {
  const rows: string[] = [];
  for (const word of text.split(" ")) {
    if (!rows.length || rows[rows.length - 1]!.length + word.length > limit) rows.push(word);
    else rows[rows.length - 1] += ` ${word}`;
  }
  return rows;
}
const shortService: Record<string, [string, string]> = {
  search: ["Mapping & search", "Мапування й пошук"],
  groups: ["Working lists", "Робочі списки"],
  research: ["AI research", "ШІ-дослідження"],
  review: ["Professional review", "Фахова перевірка"],
  evidence: ["Sources & findings", "Джерела й висновки"],
  contact: ["Introductions & referrals", "Знайомства й реферали"],
  integration: ["Access & integrations", "Доступ та інтеграції"],
  survey: ["Member survey", "Опитування учасників"],
  publishing: ["Knowledge into use", "Застосування знань"],
};
export function BriefingConnectedGraph({
  experts,
  locale,
  scene,
  printMode = false,
  motionPaused = false,
}: {
  experts: Expert[];
  locale: ClientLocale;
  scene: Scene;
  printMode?: boolean;
  motionPaused?: boolean;
}) {
  const uk = locale === "uk",
    graph = useMemo(() => briefingGraph(experts, "expertise", locale), [experts, locale]);
  const [stage, setStage] = useState(printMode ? 2 : scene === "configuration" ? 0 : 2),
    [selected, setSelected] = useState<string | null>(null),
    [service, setService] = useState<string | null>(null);
  const chosen = workflows.find((w) => w.id === selected);
  const baseScale = scene === "responsibility" ? 0.43 : 0.32;
  const basePoint = (id: string) => {
    const p = graph.positions.get(id) ?? { x: 0, y: 0 };
    return {
      x: 380 + Math.round(p.x * baseScale * 1000) / 1000,
      y: 255 + Math.round(p.y * baseScale * 1000) / 1000,
    };
  };
  const serviceTargets = useMemo(
    () =>
      CLIENT_SERVICES.map((s, i) => {
        const a = (i / CLIENT_SERVICES.length) * Math.PI * 2 - Math.PI / 2;
        const order = chosen?.services.indexOf(s.id) ?? -1;
        if (chosen && order >= 0) {
          const b = (order / chosen.services.length) * Math.PI * 2 - Math.PI / 2;
          return {
            ...s,
            x: chosen.cycle
              ? 380 + Math.round(Math.cos(b) * 185000) / 1000
              : 120 + order * (520 / (chosen.services.length - 1)),
            y: chosen.cycle ? 255 + Math.round(Math.sin(b) * 135000) / 1000 : 255,
          };
        }
        return {
          ...s,
          x: 380 + Math.round(Math.cos(a) * 200000) / 1000,
          y: 255 + Math.round(Math.sin(a) * 140000) / 1000,
        };
      }),
    [chosen],
  );
  const framePositions = useRef(new Map(serviceTargets.map((s) => [s.id, { x: s.x, y: s.y }])));
  const [servicePoints, setServicePoints] = useState(serviceTargets);
  useEffect(() => {
    if (
      printMode ||
      motionPaused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      framePositions.current = new Map(serviceTargets.map((s) => [s.id, { x: s.x, y: s.y }]));
      setServicePoints(serviceTargets);
      return;
    }
    const from = new Map(framePositions.current),
      start = performance.now();
    let raf = 0;
    const animate = (now: number) => {
      const progress = Math.min(1, (now - start) / 700);
      const next = serviceTargets.map((s) => ({
        ...s,
        ...interpolatePoint(from.get(s.id) ?? s, s, progress),
      }));
      framePositions.current = new Map(next.map((s) => [s.id, { x: s.x, y: s.y }]));
      setServicePoints(next);
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [serviceTargets, printMode, motionPaused]);
  const positions = new Map(servicePoints.map((s) => [s.id, s]));
  const workflowPoints = workflows.map((w, i) => ({ ...w, x: 90 + i * 193, y: 460 }));
  const systemPoints = systems.map((s, i) => ({
    ...s,
    x: 90 + i * 145,
    y: i % 2 === 0 ? 72 : 104,
  }));
  const stages = uk
    ? ["Персони й дані", "Додати функції", "Пов’язати у воркфлоу"]
    : ["People & data", "Add functions", "Connect workflows"];
  const modelCaption =
    scene === "responsibility"
      ? uk
        ? "МОДЕЛЬ: люди визначають мету й перевіряють важливе; ШІ допомагає. У графі — ті самі записи вибірки."
        : "MODEL: people set the purpose and check what matters; AI assists. The graph retains the same sample records."
      : scene === "integration"
        ? uk
          ? "ЦІЛЬОВА АРХІТЕКТУРА: до того самого графа додаються дозволені джерела й канали обміну. Значки не означають підключених конекторів."
          : "TARGET ARCHITECTURE: permitted sources and exchange routes extend the same graph. Symbols do not indicate connected adapters."
        : scene === "invitation"
          ? uk
            ? "Дослідницький кейс → налаштування під вашу роботу → відгук. Ви можете вплинути на подальшу розробку."
            : "Research case → configuration around your work → feedback. You can help shape further development."
          : uk
            ? "МОДЕЛЬ: ті самі персони залишаються в полі графа; функції поєднуються в процеси. Це не прогноз інтересу або чисельності користувачів сервісу."
            : "MODEL: the same people remain in the graph as functions connect into processes. This is not a forecast of service interest or adoption.";
  return (
    <figure className={`briefing-evidence-figure briefing-connected-figure is-${scene}`}>
      <div className="briefing-story-field">
        {scene === "configuration" ? (
          <div
            className="briefing-connected-stages"
            aria-label={uk ? "Послідовне складання конфігурації" : "Configuration steps"}
          >
            {stages.map((s, i) => (
              <button
                type="button"
                key={s}
                aria-pressed={stage === i}
                onClick={() => {
                  setStage(i);
                  setSelected(null);
                  setService(null);
                }}
              >
                {s}
              </button>
            ))}
          </div>
        ) : (
          <p className="public-model-label">
            {scene === "responsibility"
              ? uk
                ? "ЛЮДСЬКА МЕТА · ІНСТРУМЕНТИ · ПРАВИЛА"
                : "HUMAN PURPOSE · TOOLS · RULES"
              : uk
                ? "ТЕ САМЕ ПОЛЕ ГРАФА · МОДЕЛЬ"
                : "THE SAME GRAPH · MODEL"}
          </p>
        )}
        <svg viewBox="0 0 760 520" role="img" aria-label={modelCaption}>
          {graph.links.map((e) => {
            const a = basePoint(e.source),
              b = basePoint(e.target);
            return (
              <line
                key={`${e.source}-${e.target}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#a5bfc4"
                opacity={scene === "responsibility" ? 0.25 : 0.12}
              />
            );
          })}
          {graph.nodes.map((n) => {
            const p = basePoint(n.id),
              k = networkSymbolKind(n);
            return (
              <g
                key={n.id}
                transform={`translate(${p.x} ${p.y})`}
                opacity={scene === "responsibility" ? 0.8 : 0.35}
                data-record-id={n.kind === "expert" ? n.id : undefined}
              >
                <path
                  d={mapSymbolPath(k, n.kind === "expert" ? 2.8 : 5)}
                  fill={MAP_SYMBOLS[k].filled ? MAP_SYMBOLS[k].color : "#0c2b39"}
                  stroke={MAP_SYMBOLS[k].color}
                />
                <title>{n.kind === "expert" ? n.id : n.label}</title>
              </g>
            );
          })}
          {scene === "responsibility" ? (
            <>
              <path
                d="M 120 90 L 610 90 L 610 410 L 120 410 Z"
                fill="none"
                stroke="#d2bd70"
                strokeDasharray="6 5"
                opacity=".6"
              />
              {[
                { x: 150, y: 100, en: "People’s purpose", uk: "Людська мета" },
                { x: 610, y: 100, en: "AI assistance", uk: "Допомога ШІ" },
                { x: 140, y: 410, en: "Ordinary work", uk: "Звичайна робота" },
              ].map((n, i) => (
                <g key={n.en}>
                  <path
                    transform={`translate(${n.x} ${n.y})`}
                    d={mapSymbolPath(i === 1 ? "function" : "person", 12)}
                    fill={i === 1 ? "#0c2b39" : "#92c8ba"}
                    stroke="#e0c16d"
                    strokeWidth="2"
                  />
                  <text x={n.x} y={n.y + (i === 2 ? 32 : -24)} textAnchor="middle" fontSize="22">
                    {uk ? n.uk : n.en}
                  </text>
                </g>
              ))}
              <rect x="220" y="210" width="320" height="80" fill="#0c2b39" />
              <text x="380" y="238" textAnchor="middle" fontSize="24">
                {uk ? "Відносини з колегами" : "Relationships with colleagues"}
              </text>
              <text x="380" y="268" textAnchor="middle" fontSize="24">
                {uk ? "та клієнтами" : "and clients"}
              </text>
              <text x="505" y="415" textAnchor="middle" fontSize="20">
                {uk ? "Політики · стандарти" : "Policies · standards"}
              </text>
              <text x="505" y="442" textAnchor="middle" fontSize="20">
                {uk ? "процедури · відповідальність" : "procedures · responsibility"}
              </text>
            </>
          ) : (
            <>
              {stage >= 1 && (
                <>
                  {(chosen ? [chosen] : workflows).flatMap((w) =>
                    w.services.slice(1).map((id, i) => {
                      const a = positions.get(
                          w.services[i] as (typeof CLIENT_SERVICES)[number]["id"],
                        ),
                        b = positions.get(id as (typeof CLIENT_SERVICES)[number]["id"]);
                      return a && b ? (
                        <line
                          key={`${w.id}-${i}`}
                          x1={a.x}
                          y1={a.y}
                          x2={b.x}
                          y2={b.y}
                          stroke="#d2bd70"
                          strokeDasharray="5 4"
                          opacity={chosen ? 0.8 : 0.2}
                        />
                      ) : null;
                    }),
                  )}
                  {chosen?.cycle &&
                    (() => {
                      const a = positions.get(
                          chosen.services[0] as (typeof CLIENT_SERVICES)[number]["id"],
                        )!,
                        b = positions.get(
                          chosen.services[
                            chosen.services.length - 1
                          ] as (typeof CLIENT_SERVICES)[number]["id"],
                        )!;
                      return (
                        <line
                          x1={a.x}
                          y1={a.y}
                          x2={b.x}
                          y2={b.y}
                          stroke="#d2bd70"
                          strokeDasharray="5 4"
                        />
                      );
                    })()}
                  {servicePoints.map((s) => (
                    <g
                      key={s.id}
                      opacity={!chosen || chosen.services.includes(s.id) ? 1 : 0.15}
                      className="briefing-connected-node"
                      tabIndex={0}
                      role="button"
                      aria-label={s.title[locale]}
                      onClick={() => setService(s.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setService(s.id);
                        }
                      }}
                    >
                      <path
                        transform={`translate(${s.x} ${s.y})`}
                        d={mapSymbolPath("function", 11)}
                        fill="#0c2b39"
                        stroke={service === s.id ? "#fff2bc" : "#d2bd70"}
                        strokeWidth={service === s.id ? 4 : 2}
                      />
                      {lines(shortService[s.id]![uk ? 1 : 0], 14).map((txt, i) => (
                        <text
                          key={i}
                          x={s.x}
                          y={s.y + 26 + i * 23}
                          textAnchor="middle"
                          fontSize="19"
                        >
                          {txt}
                        </text>
                      ))}
                      <title>{`${s.title[locale]} · ${uk ? "Модель застосування" : "Proposed use"}`}</title>
                    </g>
                  ))}
                </>
              )}
              {stage >= 2 &&
                workflowPoints.map((w) => (
                  <g
                    key={w.id}
                    tabIndex={0}
                    role="button"
                    aria-label={w[locale]}
                    onClick={() => {
                      setSelected(selected === w.id ? null : w.id);
                      setService(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelected(selected === w.id ? null : w.id);
                      }
                    }}
                    className="briefing-connected-node"
                  >
                    <path
                      transform={`translate(${w.x} ${w.y})`}
                      d={mapSymbolPath("workflow", 12)}
                      fill="#0c2b39"
                      stroke={selected === w.id ? "#fff2bc" : "#8eb9d6"}
                      strokeWidth="2"
                    />
                    {lines(w[locale], 18).map((txt, i) => (
                      <text key={i} x={w.x} y={w.y + 27 + i * 22} textAnchor="middle" fontSize="18">
                        {txt}
                      </text>
                    ))}
                  </g>
                ))}
              {scene === "integration" &&
                systemPoints.map((s) => (
                  <g key={s.id}>
                    <path
                      transform={`translate(${s.x} ${s.y})`}
                      d={mapSymbolPath(s.id === "ai" ? "function" : "organisation", 12)}
                      fill="#0c2b39"
                      stroke="#e4c48b"
                      strokeWidth="2"
                    />
                    <line
                      x1={s.x}
                      y1={s.y + 18}
                      x2={positions.get(s.id === "ai" ? "research" : "integration")!.x}
                      y2={positions.get(s.id === "ai" ? "research" : "integration")!.y}
                      stroke="#e4c48b"
                      strokeDasharray="5 4"
                      opacity=".5"
                    />
                    {lines(s[locale], 18).map((txt, i) => (
                      <text key={i} x={s.x} y={s.y - 36 + i * 22} textAnchor="middle" fontSize="18">
                        {txt}
                      </text>
                    ))}
                  </g>
                ))}
              {scene === "invitation" && (
                <>
                  <rect x="215" y="195" width="330" height="110" fill="#0c2b39" />
                  <text x="380" y="232" textAnchor="middle" fontSize="26">
                    {uk ? "Ваша звичайна робота" : "Your ordinary work"}
                  </text>
                  <text x="380" y="268" textAnchor="middle" fontSize="23">
                    {uk ? "Ваші процеси · ваш відгук" : "Your processes · your view"}
                  </text>
                </>
              )}
            </>
          )}
        </svg>
        <p className="briefing-story-caption" aria-live="polite">
          {service
            ? CLIENT_SERVICES.find((s) => s.id === service)!.detail[locale]
            : chosen
              ? `${chosen[locale]} · ${uk ? (chosen.cycle ? "цикл" : "послідовність із результатом") : chosen.cycle ? "cycle" : "sequence with an outcome"}`
              : scene === "configuration"
                ? stages[stage]
                : uk
                  ? "Експертиза · взаємодія · ресурси — цілі застосування"
                  : "Expertise · interaction · resources are goals of use"}
        </p>
      </div>
      <figcaption>
        {modelCaption}
        <small className="briefing-sample-sources">
          ISRM-DATA-RESEARCH-WORKBOOK-RECORDS-2026-11-12 ·
          ISRM-DATA-RESEARCH-WORKBOOK-PROFILES-2026-08-28
        </small>
      </figcaption>
    </figure>
  );
}
