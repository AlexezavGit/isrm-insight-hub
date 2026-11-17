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
      node("hold", 80, 195, "Hold", "Зберігати"),
      node("process", 235, 195, "Process", "Обробляти", true),
      node("convert", 395, 195, "Convert", "Застосовувати", true),
      { ...node("expertise", 570, 85, "Expertise", "Експертиза", true), kind: "expertise" },
      node("interaction", 570, 195, "Interaction", "Взаємодія", true),
      node("resources", 570, 305, "Resources", "Ресурси", true),
    ],
    edges: [
      edge("hold", "process", true),
      edge("process", "convert", true),
      edge("convert", "expertise", true),
      edge("convert", "interaction", true),
      edge("convert", "resources", true),
    ],
    caption: c(
      "Read the path: stored information needs people, tools and rules to become useful.",
      "Читайте шлях: для корисного застосування інформації потрібні люди, інструменти й правила.",
    ),
  },
  1: {
    nodes: [
      { ...node("record", 80, 190, "Profile record", "Запис про персону"), kind: "person" },
      {
        ...node("relevance", 250, 190, "Relevant expertise", "Доречна експертиза"),
        kind: "expertise",
      },
      node("review", 420, 190, "Professional review", "Фахова перевірка", true),
      node("contact", 590, 190, "Agreed contact", "Погоджений контакт", true),
      node("source", 250, 75, "Source & date", "Джерело й дата"),
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
      node("sources", 80, 135, "Existing systems", "Наявні системи", true),
      node("adapters", 245, 135, "Connectors", "Конектори", true),
      node("network", 420, 135, "Expertise map", "Мапа експертизи"),
      node("selection", 590, 135, "Saved selection", "Збережений відбір"),
      node("next", 575, 305, "Next enquiry", "Наступний запит"),
      node("updates", 250, 305, "New findings", "Нові відомості", true),
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
      node("guest", 110, 80, "Guest view", "Гостьовий перегляд"),
      node("coordinator", 530, 80, "Coordinator review", "Перегляд координатором", true),
      node("source", 115, 290, "Source record", "Запис у джерелі"),
      node("recommendation", 320, 305, "Colleague recommendation", "Рекомендація колеги", true),
      node("contact", 540, 290, "Contact: permission required", "Контакт: потрібен дозвіл", true),
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
      node("enquiry", 90, 120, "Enquiry", "Запит"),
      node("search", 310, 120, "Search", "Пошук"),
      node("selection", 560, 120, "Selection", "Відбір"),
      node("ai", 90, 280, "AI research", "ШІ-дослідження", true),
      node("sources", 310, 280, "Sources", "Джерела", true),
      node("review", 560, 280, "Professional judgement", "Професійне судження", true),
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
      node("data", 110, 200, "Research sample", "Дослідницька вибірка"),
      node("workshop", 320, 200, "Our workshop", "Наша майстерня"),
      node("try", 545, 90, "Try the demonstration", "Спробувати демонстрацію"),
      node("feedback", 545, 305, "Your view", "Ваша думка"),
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
  return (
    <figure className="briefing-evidence-figure briefing-story-figure">
      <div className="briefing-story-field">
        <span className="briefing-story-mode">{uk ? "Схема процесу" : "Process concept"}</span>
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
              aria-label={n.label[locale]}
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
              <title>{n.label[locale]}</title>
              <rect x={n.x - 72} y={n.y - 21} width="144" height="90" className="story-hit-area" />
              <path
                className="briefing-shared-symbol"
                transform={`translate(${n.x} ${n.y})`}
                d={mapSymbolPath(n.kind ?? "function", 12)}
                fill={
                  MAP_SYMBOLS[n.kind ?? "function"].filled
                    ? MAP_SYMBOLS[n.kind ?? "function"].color
                    : "#0c2b39"
                }
                stroke={MAP_SYMBOLS[n.kind ?? "function"].color}
                strokeWidth="1.8"
              />
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
          <span>○ {uk ? "Персона" : "Person"}</span>
          <span>□ {uk ? "Дія / функція" : "Action / function"}</span>
          <span>┄ {uk ? "Запропонований шлях" : "Proposed path"}</span>
        </div>
      </div>
    </figure>
  );
}
