import { useId, useState } from "react";
import { CLIENT_SERVICES, type ClientLocale, type Copy } from "@/lib/client-catalog";
import { mapSymbolPath, MAP_SYMBOLS } from "@/lib/map-symbols";

const c = (en: string, uk: string): Copy => ({ en, uk });
// Process concepts describe the accepted design, never measured service use or demand.
const paths = [
  {
    label: c("Search & save", "Пошук і збереження"),
    cycle: false,
    steps: [
      { id: "search", label: c("Search", "Пошук"), live: true },
      { id: "dossier", label: c("Dossier review", "Перегляд досьє"), live: true },
      { id: "groups", label: c("Shortlist", "Відбір"), live: true },
      { id: "contact", label: c("Agreed contact", "Погоджений контакт"), live: false },
    ],
  },
  {
    label: c("Engagement", "Залучення"),
    cycle: true,
    steps: [
      { id: "groups", label: c("Audience", "Аудиторія"), live: false },
      { id: "survey", label: c("Needs", "Потреби"), live: false },
      { id: "contact", label: c("Invitation", "Запрошення"), live: false },
      { id: "integration", label: c("Participation", "Участь"), live: false },
      { id: "publishing", label: c("Shared experience", "Спільний досвід"), live: false },
    ],
  },
  {
    label: c("Shared expertise", "Мережева експертиза"),
    cycle: true,
    steps: [
      { id: "groups", label: c("Selection", "Відбір"), live: true },
      { id: "research", label: c("Research", "Дослідження"), live: false },
      { id: "review", label: c("Professional review", "Фахова перевірка"), live: false },
      { id: "evidence", label: c("Evidence", "Докази"), live: false },
      { id: "publishing", label: c("Use & learning", "Застосування й навчання"), live: false },
    ],
  },
  {
    label: c("Client request", "Клієнтський запит"),
    cycle: false,
    steps: [
      { id: "request", label: c("Client request", "Запит клієнта"), live: false },
      { id: "search", label: c("Team selection", "Добір команди"), live: true },
      { id: "commitment", label: c("Agreed participation", "Погоджена участь"), live: false },
      { id: "assignment", label: c("Project & outcome", "Проєкт і результат"), live: false },
    ],
  },
];
function lines(text: string) {
  const rows: string[] = [];
  for (const word of text.split(" ")) {
    if (!rows.length || rows[rows.length - 1]!.length + word.length > 19) rows.push(word);
    else rows[rows.length - 1] += ` ${word}`;
  }
  return rows;
}
export function BriefingWorkflowFigure({ locale }: { locale: ClientLocale }) {
  const [selected, setSelected] = useState(0),
    path = paths[selected]!;
  const marker = useId().replace(/:/g, "");
  const uk = locale === "uk";
  const points = path.steps.map((step, i) => {
    const a = (i / path.steps.length) * Math.PI * 2 - Math.PI / 2;
    return {
      ...step,
      x: path.cycle ? 340 + Math.cos(a) * 215 : 85 + i * 170,
      y: path.cycle ? 175 + Math.sin(a) * 115 : 160,
    };
  });
  return (
    <figure className="briefing-evidence-figure briefing-workflow-figure">
      <div className="briefing-story-field">
        <div
          className="briefing-workflow-tabs"
          aria-label={uk ? "Приклади процесів" : "Example workflows"}
        >
          {paths.map((p, i) => (
            <button
              key={p.label.en}
              type="button"
              aria-pressed={selected === i}
              onClick={() => setSelected(i)}
            >
              {p.label[locale]}
            </button>
          ))}
        </div>
        <svg viewBox="0 0 680 365" role="img" aria-label={path.label[locale]}>
          <defs>
            <marker
              id={marker}
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#adc8c3" />
            </marker>
          </defs>
          {points.map((p, i) => {
            const next = points[(i + 1) % points.length]!;
            if (!path.cycle && i === points.length - 1) return null;
            const distance = Math.hypot(next.x - p.x, next.y - p.y),
              dx = (next.x - p.x) / distance,
              dy = (next.y - p.y) / distance;
            return (
              <line
                key={p.id}
                x1={p.x + dx * 17}
                y1={p.y + dy * 17}
                x2={next.x - dx * 20}
                y2={next.y - dy * 20}
                markerEnd={`url(#${marker})`}
                className={p.live && next.live ? "" : "is-proposed"}
              />
            );
          })}
          {points.map((p) => (
            <g key={p.id}>
              <title>{`${CLIENT_SERVICES.find((s) => s.id === p.id)?.title[locale] ?? p.label[locale]} · ${p.live ? (uk ? "Демонструється" : "Demonstrated") : uk ? "Запропоновано" : "Proposed"}`}</title>
              <path
                transform={`translate(${p.x} ${p.y})`}
                d={mapSymbolPath("function", 11)}
                fill="#0c2b39"
                stroke={MAP_SYMBOLS.function.color}
                strokeWidth="2"
                strokeDasharray={p.live ? undefined : "4 3"}
              />
              <text x={p.x} y={p.y + 34} textAnchor="middle">
                {lines(p.label[locale]).map((line, i) => (
                  <tspan key={line} x={p.x} dy={i ? 20 : 0}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          ))}
          {path.cycle && (
            <text x="340" y="175" textAnchor="middle" className="briefing-workflow-centre">
              {uk ? "Потреби людей" : "People’s needs"}
            </text>
          )}
        </svg>
        <p className="briefing-story-caption">
          {uk
            ? "Суцільне: демонструється. Пунктир: потребує розроблення. Це приклади поєднання функцій."
            : "Solid: demonstrated. Dashed: requires development. These are example combinations of functions."}
        </p>
      </div>
    </figure>
  );
}
