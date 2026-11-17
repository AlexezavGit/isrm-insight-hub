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
      { ...node("record", 80, 190, "Profile record", "Запис про персону"), meaning: "data" },
      {
        ...node("relevance", 250, 190, "Relevant expertise", "Доречна експертиза"),
        kind: "expertise",
      },
      {
        ...node("review", 420, 190, "Professional review", "Фахова перевірка", true),
        meaning: "user-action",
      },
      {
        ...node("contact", 590, 190, "Agreed contact", "Погоджений контакт", true),
        meaning: "goal",
      },
      { ...node("source", 250, 75, "Source & date", "Джерело й дата"), meaning: "data" },
      { ...node("owner", 420, 305, "Responsible person", "Відповідальний", true), kind: "person" },
      { ...node("consent", 590, 75, "Permission", "Дозвіл", true), kind: "status" },
    ],
    edges: [
      edge("record", "relevance"),
      edge("relevance", "review", true),
      edge("review", "contact", true),
      edge("source", "relevance"),
      edge("owner", "review", true),
      edge("consent", "contact", true),
    ],
    caption: c(
      "Follow a record beyond the table: relevance, judgement and permission each need work.",
      "Пройдіть від запису далі: доречність, професійне судження й дозвіл потребують окремої роботи.",
    ),
  },
  2: {
    nodes: [
      {
        ...node("sources", 80, 135, "Existing systems", "Наявні системи", true),
        meaning: "system",
      },
      {
        ...node("adapters", 245, 135, "Connectors", "Конектори", true),
        meaning: "system-function",
      },
      { ...node("network", 420, 135, "Expertise map", "Мапа експертизи"), meaning: "data" },
      { ...node("selection", 590, 135, "Saved selection", "Збережений відбір"), meaning: "data" },
      { ...node("next", 575, 305, "Next enquiry", "Наступний запит"), meaning: "data" },
      { ...node("updates", 250, 305, "New findings", "Нові відомості", true), meaning: "data" },
    ],
    edges: [
      edge("sources", "adapters", true),
      edge("adapters", "network", true),
      edge("network", "selection"),
      edge("selection", "next"),
      edge("next", "network", true),
      edge("updates", "network", true),
    ],
    caption: c(
      "Reuse the resource for the next enquiry. Dashed paths are planned connections, not live integrations.",
      "Поверніться до ресурсу з наступним запитом. Пунктир — заплановані зв’язки, а не підключені інтеграції.",
    ),
  },
  5: {
    nodes: [
      { ...node("person", 320, 165, "One profile", "Один профіль"), kind: "person" },
      { ...node("guest", 110, 80, "Guest view", "Гостьовий перегляд"), meaning: "system-function" },
      {
        ...node("coordinator", 530, 80, "Coordinator review", "Перегляд координатором", true),
        meaning: "user-action",
      },
      { ...node("source", 115, 290, "Source record", "Запис у джерелі"), meaning: "data" },
      {
        ...node(
          "recommendation",
          320,
          305,
          "Colleague recommendation",
          "Рекомендація колеги",
          true,
        ),
        meaning: "data",
      },
      {
        ...node(
          "contact",
          540,
          290,
          "Contact: permission required",
          "Контакт: потрібен дозвіл",
          true,
        ),
        meaning: "goal",
      },
    ],
    edges: [
      edge("person", "guest"),
      edge("person", "coordinator", true),
      edge("source", "person"),
      edge("recommendation", "person", true),
      edge("person", "contact", true),
    ],
    caption: c(
      "Separate what is known from who may see it and what the person has agreed to.",
      "Розрізняйте відомості, право доступу та те, на що погодилася людина.",
    ),
  },
  6: {
    nodes: [
      { ...node("enquiry", 90, 120, "Enquiry", "Запит"), meaning: "data" },
      { ...node("search", 310, 120, "Search", "Пошук"), meaning: "system-function" },
      { ...node("selection", 560, 120, "Selection", "Відбір"), meaning: "user-action" },
      { ...node("ai", 90, 280, "AI research", "ШІ-дослідження", true), meaning: "system-function" },
      { ...node("sources", 310, 280, "Sources", "Джерела", true), meaning: "data" },
      {
        ...node("review", 560, 280, "Professional judgement", "Професійне судження", true),
        meaning: "user-action",
      },
    ],
    edges: [
      edge("enquiry", "search"),
      edge("search", "selection"),
      edge("enquiry", "ai", true),
      edge("ai", "sources", true),
      edge("sources", "review", true),
      edge("review", "selection", true),
    ],
    caption: c(
      "The search path stands on its own. AI is an optional branch, with professional judgement.",
      "Пошуковий шлях самостійний. ШІ — додаткова гілка з професійним судженням.",
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
