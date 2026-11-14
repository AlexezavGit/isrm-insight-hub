import { useId, useState } from "react";
import type { ClientLocale, Copy } from "@/lib/client-catalog";
import { MAP_SYMBOLS, mapSymbolPath } from "@/lib/map-symbols";
import type { MapKind } from "@/lib/workspace-map";

type Node = {
  id: string;
  x: number;
  y: number;
  label: Copy;
  kind?: MapKind;
  planned?: boolean;
  meaning?: "data" | "capability" | "user-action" | "system-function" | "system" | "goal";
};
type Edge = { from: string; to: string; planned?: boolean };
const c = (en: string, uk: string): Copy => ({ en, uk });
const node = (id: string, x: number, y: number, en: string, uk: string, planned = false): Node => ({
  id,
  x,
  y,
  label: c(en, uk),
  planned,
});
const edge = (from: string, to: string, planned = false): Edge => ({ from, to, planned });
const scenes: Record<number, { nodes: Node[]; edges: Edge[]; caption: Copy }> = {
  0: {
    nodes: [
      { ...node("hold", 80, 195, "Available data", "Наявні дані"), meaning: "data" },
      { ...node("process", 235, 195, "Process data", "Опрацювання", true), meaning: "capability" },
      {
        ...node("convert", 395, 195, "Put it to use", "Застосування", true),
        meaning: "capability",
      },
      { ...node("expertise", 570, 85, "Expertise", "Експертиза", true), meaning: "goal" },
      { ...node("interaction", 570, 195, "Interaction", "Взаємодія", true), meaning: "goal" },
      { ...node("resources", 570, 305, "Resources", "Ресурси", true), meaning: "goal" },
    ],
    edges: [
      edge("hold", "process", true),
      edge("process", "convert", true),
      edge("convert", "expertise", true),
      edge("convert", "interaction", true),
      edge("convert", "resources", true),
    ],
    caption: c(
      "Data → the ability to process and use it → goals. People, tools and rules make that ability possible.",
      "Дані → спроможність опрацьовувати й застосовувати → цілі. Спроможність забезпечують люди, інструменти й правила.",
    ),
  },
  1: {
    nodes: [
      { ...node("record", 75, 185, "Profile & source", "Профіль і джерело"), meaning: "data" },
      { ...node("selection", 245, 185, "Working selection", "Робочий відбір"), meaning: "data" },
      {
        ...node("contact", 420, 185, "Agreed contact", "Погоджений контакт", true),
        meaning: "user-action",
      },
      {
        ...node("outcome", 590, 185, "Recorded outcome", "Зафіксований результат", true),
        meaning: "data",
      },
      { ...node("source", 245, 65, "Source & date", "Джерело й дата"), meaning: "data" },
      { ...node("owner", 420, 310, "Responsible person", "Відповідальний", true), kind: "person" },
      { ...node("consent", 590, 65, "Permission", "Дозвіл", true), kind: "status" },
    ],
    edges: [
      edge("record", "selection"),
      edge("selection", "contact", true),
      edge("contact", "outcome", true),
      edge("source", "selection"),
      edge("owner", "contact", true),
      edge("consent", "contact", true),
    ],
    caption: c(
      "Search and local selection are demonstrated. Agreed contact and outcome tracking require development.",
      "Пошук і локальний відбір демонструються. Погоджений контакт та облік результатів потребують розроблення.",
    ),
  },
  2: {
    nodes: [
      { ...node("enquiry", 100, 65, "Current enquiry", "Поточний запит"), meaning: "data" },
      {
        ...node("expertise", 340, 60, "Relevant expertise", "Потрібна експертиза"),
        kind: "expertise",
      },
      {
        ...node("review", 570, 90, "Professional review", "Фахова перевірка", true),
        meaning: "user-action",
      },
      {
        ...node("use", 570, 265, "Use in current work", "Застосування в роботі", true),
        meaning: "user-action",
      },
      {
        ...node("outcome", 340, 290, "Outcome & learning", "Результат і досвід", true),
        meaning: "data",
      },
      {
        ...node("updates", 100, 265, "Update the record", "Уточнити запис", true),
        meaning: "user-action",
      },
    ],
    edges: [
      edge("enquiry", "expertise"),
      edge("expertise", "review", true),
      edge("review", "use", true),
      edge("use", "outcome", true),
      edge("outcome", "updates", true),
      edge("updates", "enquiry", true),
    ],
    caption: c(
      "Colleagues use and maintain the resource through their work. Dashed steps are proposed; updating is not automatic.",
      "Колеги використовують і підтримують ресурс під час роботи. Пунктирні кроки запропоновані; оновлення не є автоматичним.",
    ),
  },
  5: {
    nodes: [
      {
        ...node("client", 65, 90, "Client request", "Запит клієнта", true),
        meaning: "user-action",
      },
      {
        ...node("david", 245, 265, "David · coordinator", "Девід · координатор", true),
        kind: "person",
      },
      { ...node("person", 440, 90, "Selected expert", "Обрана персона", true), kind: "person" },
      {
        ...node("permission", 440, 265, "Permission in return", "Зустрічний дозвіл", true),
        kind: "status",
      },
      {
        ...node("intro", 625, 170, "Agreed introduction", "Погоджене знайомство", true),
        meaning: "goal",
      },
    ],
    edges: [
      edge("client", "david", true),
      edge("david", "person", true),
      edge("person", "permission", true),
      edge("permission", "david", true),
      edge("permission", "intro", true),
    ],
    caption: c(
      "MODEL · David coordinates the illustrated request; the person grants permission before disclosure.",
      "МОДЕЛЬ · Девід координує показаний запит; персона дає дозвіл до розкриття контактів.",
    ),
  },
  6: {
    nodes: [
      { ...node("membership", 75, 60, "Membership", "Членство", true), meaning: "system" },
      { ...node("learning", 75, 180, "Learning", "Навчання", true), meaning: "system" },
      { ...node("publishing", 75, 300, "Publications", "Публікації", true), meaning: "system" },
      {
        ...node("adapters", 245, 180, "Permitted exchange", "Дозволений обмін", true),
        meaning: "system-function",
      },
      {
        ...node("evidence", 425, 180, "Expertise & evidence", "Експертиза й докази", true),
        meaning: "data",
      },
      {
        ...node("workflows", 600, 60, "Working processes", "Робочі процеси", true),
        meaning: "system-function",
      },
      {
        ...node("results", 600, 300, "Agreed results", "Погоджені результати", true),
        meaning: "data",
      },
    ],
    edges: [
      edge("membership", "adapters", true),
      edge("learning", "adapters", true),
      edge("publishing", "adapters", true),
      edge("adapters", "membership", true),
      edge("adapters", "learning", true),
      edge("adapters", "publishing", true),
      edge("adapters", "evidence", true),
      edge("evidence", "workflows", true),
      edge("workflows", "results", true),
      edge("results", "adapters", true),
    ],
    caption: c(
      "Target architecture: permitted records enter through adapters; agreed results return to existing systems. AI assistance is optional.",
      "Цільова архітектура: дозволені записи надходять через адаптери; погоджені результати повертаються до наявних систем. Допомога ШІ опційна.",
    ),
  },
  7: {
    nodes: [
      { ...node("data", 110, 200, "Research sample", "Дослідницька вибірка"), meaning: "data" },
      node("workshop", 320, 200, "Our workshop", "Наша майстерня"),
      {
        ...node("try", 545, 90, "Try the demonstration", "Спробувати демонстрацію"),
        meaning: "user-action",
      },
      { ...node("feedback", 545, 305, "Your view", "Ваша думка"), meaning: "data" },
    ],
    edges: [
      edge("data", "workshop"),
      edge("workshop", "try"),
      edge("try", "feedback"),
      edge("feedback", "workshop"),
    ],
    caption: c(
      "Explore the map, try the search and tell us what would make it useful.",
      "Огляньте мапу, спробуйте пошук і скажіть, що зробить її корисною.",
    ),
  },
};

// Presentation concepts are not all application functions. Keep their meaning explicit
// while retaining actual map symbols for people, expertise and recorded conditions.
function meaningLabel(n: Node): Copy {
  if (n.kind === "person") return c("Person", "Персона");
  if (n.kind === "expertise") return c("Expertise", "Експертиза");
  if (n.kind === "status") return c("Condition", "Умова");
  switch (n.meaning) {
    case "data":
      return c("Data", "Дані");
    case "capability":
      return c("Capability", "Спроможність");
    case "user-action":
      return c("User action", "Дія користувача");
    case "system-function":
      return c("System function", "Функція системи");
    case "system":
      return c("System", "Система");
    case "goal":
      return c("Goal", "Ціль");
    default:
      return c("Context", "Контекст");
  }
}

function storySymbol(n: Node, r: number) {
  if (n.kind) return mapSymbolPath(n.kind, r);
  if (n.meaning === "goal")
    return mapSymbolPath("country", r) + " " + mapSymbolPath("country", r * 0.45);
  if (n.meaning === "data")
    return `M ${-r * 0.8} ${-r} H ${r * 0.3} L ${r * 0.8} ${-r * 0.5} V ${r} H ${-r * 0.8} Z M ${r * 0.3} ${-r} V ${-r * 0.5} H ${r * 0.8}`;
  if (n.meaning === "capability") return `M ${-r * 1.5} ${-r} H ${r * 1.5} V ${r} H ${-r * 1.5} Z`;
  if (n.meaning === "system" || n.meaning === "system-function")
    return mapSymbolPath("function", r);
  if (n.meaning === "user-action")
    return `M ${-r * 1.25} ${-r} H ${r * 0.65} L ${r * 1.25} 0 L ${r * 0.65} ${r} H ${-r * 1.25} Z`;
  return mapSymbolPath("country", r);
}

function storyColor(n: Node) {
  return n.kind ? MAP_SYMBOLS[n.kind].color : "#e0c16d";
}
function wrap(text: string) {
  const lines: string[] = [];
  for (const word of text.split(" ")) {
    if (!lines.length || lines[lines.length - 1]!.length + word.length > 20) lines.push(word);
    else lines[lines.length - 1] += " " + word;
  }
  return lines;
}
export function BriefingStoryGraph({ index, locale }: { index: number; locale: ClientLocale }) {
  const scene = scenes[index]!;
  const [focus, setFocus] = useState<string | null>(null);
  const marker = useId().replace(/:/g, "");
  const uk = locale === "uk";
  const legend = [...new Map(scene.nodes.map((n) => [meaningLabel(n).en, n])).values()];
  return (
    <figure className="briefing-evidence-figure briefing-story-figure">
      <div className="briefing-story-field">
        <span className="briefing-story-mode">
          {index === 0
            ? uk
              ? "Спроможність організації"
              : "Organisational capability"
            : uk
              ? "Схема процесу"
              : "Process concept"}
        </span>
        <svg viewBox="0 0 680 400" role="group" aria-label={scene.caption[locale]}>
          <defs>
            <marker
              id={marker}
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
          </defs>
          {scene.edges.map((e) => {
            const a = scene.nodes.find((n) => n.id === e.from)!,
              b = scene.nodes.find((n) => n.id === e.to)!;
            const length = Math.hypot(b.x - a.x, b.y - a.y),
              dx = (b.x - a.x) / length,
              dy = (b.y - a.y) / length;
            return (
              <line
                key={e.from + e.to}
                x1={a.x + dx * 15}
                y1={a.y + dy * 15}
                x2={b.x - dx * 17}
                y2={b.y - dy * 17}
                markerEnd={`url(#${marker})`}
                className={`${e.planned ? "is-proposed" : ""} ${focus && [e.from, e.to].includes(focus) ? "is-focus" : ""}`}
              />
            );
          })}
          {scene.nodes.map((n) => (
            <g
              key={n.id}
              role="button"
              tabIndex={0}
              aria-label={`${n.label[locale]} — ${meaningLabel(n)[locale]}`}
              aria-pressed={focus === n.id}
              onClick={() => setFocus(focus === n.id ? null : n.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setFocus(focus === n.id ? null : n.id);
                }
              }}
              className={`briefing-story-node ${n.planned ? "is-proposed" : ""} ${focus === n.id ? "is-focus" : ""}`}
            >
              <title>{`${n.label[locale]} — ${meaningLabel(n)[locale]}`}</title>
              <rect x={n.x - 72} y={n.y - 21} width="144" height="90" className="story-hit-area" />
              <path
                className="briefing-shared-symbol"
                transform={`translate(${n.x} ${n.y})`}
                d={storySymbol(n, 12)}
                fill={n.kind && MAP_SYMBOLS[n.kind].filled ? MAP_SYMBOLS[n.kind].color : "#0c2b39"}
                stroke={storyColor(n)}
                strokeWidth="1.8"
              />
              {(n.meaning === "user-action" ||
                n.meaning === "system-function" ||
                n.meaning === "system") && (
                <text className="briefing-story-node-type" x={n.x} y={n.y - 24} textAnchor="middle">
                  {meaningLabel(n)[locale]}
                </text>
              )}
              <text x={n.x} y={n.y + 32} textAnchor="middle">
                {wrap(n.label[locale]).map((line, i) => (
                  <tspan key={line} x={n.x} dy={i ? 20 : 0}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          ))}
        </svg>
        <p className="briefing-story-caption">{scene.caption[locale]}</p>
        <div className="briefing-story-key">
          {legend.map((n) => (
            <span key={meaningLabel(n).en}>
              <svg viewBox="-18 -18 36 36" aria-hidden="true">
                <path
                  d={storySymbol(n, 10)}
                  fill={n.kind && MAP_SYMBOLS[n.kind].filled ? storyColor(n) : "none"}
                  stroke={storyColor(n)}
                  strokeWidth="1.8"
                />
              </svg>
              {meaningLabel(n)[locale]}
            </span>
          ))}
          <span>┄ {uk ? "Запропонований шлях" : "Proposed path"}</span>
        </div>
      </div>
    </figure>
  );
}
