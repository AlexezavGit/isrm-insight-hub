import { CLIENT_SERVICES, CLIENT_WORKFLOWS, type ClientLocale } from "@/lib/client-catalog";
import type { Expert } from "@/lib/types";

const SERVICE_LABELS = {
  search: { en: "Search", uk: "Пошук" },
  groups: { en: "Working lists", uk: "Робочі списки" },
  research: { en: "AI research", uk: "Дослідження з ШІ" },
  review: { en: "Professional review", uk: "Професійна перевірка" },
  evidence: { en: "Evidence", uk: "Докази й джерела" },
  contact: { en: "Introductions", uk: "Знайомства" },
  integration: { en: "Integrations", uk: "Інтеграції" },
  publishing: { en: "Shared expertise", uk: "Спільна експертиза" },
  survey: { en: "Member surveys", uk: "Опитування" },
};

function lines(text: string, width = 21) {
  const out: string[] = [];
  for (const word of text.split(/\s+/)) {
    if (!out.length || out[out.length - 1]!.length + word.length + 1 > width) out.push(word);
    else out[out.length - 1] += " " + word;
  }
  return out.slice(0, 3).map((line, i) => (i === 2 && out.length > 3 ? line + "…" : line));
}
function Label({ text, x, y, width = 21 }: { text: string; x: number; y: number; width?: number }) {
  return (
    <text x={x} y={y} textAnchor="middle">
      {lines(text, width).map((line, i) => (
        <tspan key={i} x={x} dy={i ? 17 : 0}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export function ExpertiseMapFigure({
  experts,
  locale,
}: {
  experts: Expert[];
  locale: ClientLocale;
}) {
  const uk = locale === "uk";
  const groups = new Map<string, Expert[]>();
  for (const person of experts) {
    const key = person.primaryExpertise?.trim() || (uk ? "Не зафіксовано" : "Not recorded");
    groups.set(key, [...(groups.get(key) || []), person]);
  }
  const ranked = [...groups].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  const top = ranked.slice(0, 5);
  const rest = ranked.slice(5).flatMap(([, people]) => people);
  const visible = rest.length
    ? [
        ...top,
        [uk ? "Інші записані напрями" : "Other recorded directions", rest] as [string, Expert[]],
      ]
    : top;
  return (
    <figure className="briefing-evidence-figure">
      <svg
        viewBox="0 0 640 460"
        role="img"
        aria-label={
          uk
            ? "Мапа напрямів експертизи з переданої вибірки"
            : "Expertise directions in the supplied sample"
        }
      >
        {visible.map(([label, people], i) => {
          const angle = (i / visible.length) * Math.PI * 2 - Math.PI / 2;
          const x = 320 + Math.cos(angle) * 205,
            y = 205 + Math.sin(angle) * 140;
          return (
            <g key={label}>
              <title>{`${label}: ${people.length}`}</title>
              <line x1="320" y1="205" x2={x} y2={y} className="evidence-map-edge" />
              {people.map((person, j) => {
                const a = j * 2.399963,
                  r = 5 + Math.sqrt(j + 1) * 4;
                return (
                  <circle
                    key={person.code}
                    cx={x + Math.cos(a) * r}
                    cy={y + Math.sin(a) * r}
                    r="2.5"
                    className={person.verified ? "source-confirmed" : "source-unreviewed"}
                  />
                );
              })}
              <Label
                text={`${label} · ${people.length}`}
                x={x}
                y={y + Math.max(48, 22 + Math.sqrt(people.length) * 4)}
              />
            </g>
          );
        })}
        <circle cx="320" cy="205" r="38" className="evidence-map-hub" />
        <text x="320" y="202" textAnchor="middle" className="figure-hub-title">
          {experts.length || "—"}
        </text>
        <text x="320" y="222" textAnchor="middle">
          {uk ? "записів" : "records"}
        </text>
      </svg>
      <figcaption>
        {experts.length
          ? uk
            ? `${experts.length} записів · ${experts.filter((p) => p.verified).length} із вихідною позначкою підтвердження. Групування за записаною експертизою; не доказ знайомства чи рекомендації.`
            : `${experts.length} records · ${experts.filter((p) => p.verified).length} with a source confirmation flag. Grouped by recorded expertise; not proof of acquaintance or recommendation.`
          : uk
            ? "Завантаження переданої вибірки…"
            : "Loading the supplied sample…"}
      </figcaption>
    </figure>
  );
}

export function ServiceAudienceFigure({ locale }: { locale: ClientLocale }) {
  const uk = locale === "uk";
  const coords = CLIENT_SERVICES.map((service, i) => {
    const a = (i / CLIENT_SERVICES.length) * Math.PI * 2 - Math.PI / 2;
    return { id: service.id, x: 340 + Math.cos(a) * 240, y: 220 + Math.sin(a) * 165 };
  });
  return (
    <figure className="briefing-evidence-figure service-audience-figure">
      <svg
        viewBox="0 0 680 460"
        role="img"
        aria-label={
          uk
            ? "Сервіси навколо потреб людей; ребра показують можливе об’єднання в процеси"
            : "Services around people's needs; edges show possible workflow bundles"
        }
      >
        {coords.map((p) => (
          <line key={p.id} x1="340" y1="220" x2={p.x} y2={p.y} className="service-audience-edge" />
        ))}
        {CLIENT_WORKFLOWS.map((w, i) => {
          const points = w.serviceIds
            .map((id) => coords.find((p) => p.id === id))
            .filter((p) => !!p);
          return (
            <polyline
              key={w.id}
              points={points.map((p) => `${p.x},${p.y}`).join(" ")}
              className={`service-workflow-edge workflow-edge-${i}`}
            />
          );
        })}
        <circle cx="340" cy="220" r="74" className="evidence-map-hub" />
        <Label
          x={340}
          y={202}
          width={19}
          text={uk ? "Люди, потреби й можливості" : "People, needs & opportunities"}
        />
        {CLIENT_SERVICES.map((service) => {
          const p = coords.find((p) => p.id === service.id)!;
          return (
            <g key={service.id}>
              <title>{service.title[locale]}</title>
              <rect
                x={p.x - 66}
                y={p.y - 29}
                width="132"
                height="67"
                rx="12"
                className="service-map-node"
              />
              <Label x={p.x} y={p.y - 8} width={14} text={SERVICE_LABELS[service.id][locale]} />
            </g>
          );
        })}
      </svg>
      <figcaption>
        {uk
          ? "Концепція: сервіси можна об’єднувати у workflow. Зв’язки — варіанти організації роботи, не фактичне користування сервісами."
          : "Concept: services can be combined into workflows. Links describe possible working arrangements, not recorded service use."}
      </figcaption>
    </figure>
  );
}

export function ChapterCollaborationFigure({ locale }: { locale: ClientLocale }) {
  const uk = locale === "uk";
  return (
    <figure className="briefing-evidence-figure chapter-collaboration-figure">
      <svg
        viewBox="0 0 640 420"
        role="img"
        aria-label={
          uk
            ? "Можлива взаємодія чаптерів навколо спільних правил"
            : "Potential chapter collaboration around shared rules"
        }
      >
        {Array.from({ length: 35 }, (_, i) => {
          const a = (i / 35) * Math.PI * 2;
          const x = 320 + Math.cos(a) * 245,
            y = 205 + Math.sin(a) * 160;
          return (
            <g key={i}>
              <line x1="320" y1="205" x2={x} y2={y} className="evidence-map-edge" />
              <circle cx={x} cy={y} r="7" className="source-unreviewed" />
            </g>
          );
        })}
        <circle cx="320" cy="205" r="94" className="evidence-map-hub" />
        <text x="320" y="175" textAnchor="middle" className="figure-hub-title">
          35
        </text>
        <Label
          x={320}
          y={200}
          text={
            uk
              ? "чаптерів · спільні стандарти й відповідальність"
              : "chapters · shared standards and responsibility"
          }
        />
      </svg>
      <figcaption>
        {uk
          ? "Масштаб із брифу, не показник активної участі. Мережева користь залежить від внеску людей, актуальності й спільних правил."
          : "Scale described in the brief, not a measure of active participation. Network value depends on contribution, current information and shared rules."}
      </figcaption>
    </figure>
  );
}

export function ParticipationCycleFigure({ locale }: { locale: ClientLocale }) {
  const uk = locale === "uk";
  const labels = uk
    ? ["Навчання та зв’язки", "Корисна взаємодія", "Участь і залучення", "Належність та експертиза"]
    : [
        "Learning & connections",
        "Useful interaction",
        "Participation & engagement",
        "Belonging & expertise",
      ];
  return (
    <figure className="briefing-evidence-figure">
      <svg
        viewBox="0 0 640 420"
        role="img"
        aria-label={
          uk
            ? "Цикл участі навколо потреб аудиторії"
            : "Participation cycle centred on audience needs"
        }
      >
        <ellipse cx="320" cy="205" rx="225" ry="145" className="participation-track" />
        <ellipse
          cx="320"
          cy="205"
          rx="225"
          ry="145"
          pathLength="100"
          className="participation-sweep"
        />
        <circle cx="320" cy="205" r="78" className="evidence-map-hub" />
        <Label
          x={320}
          y={187}
          text={uk ? "Цільові аудиторії, потреби й можливості" : "Audiences, needs & opportunities"}
        />
        {labels.map((label, i) => {
          const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
          const x = 320 + Math.cos(a) * 225,
            y = 205 + Math.sin(a) * 145;
          return (
            <g key={label}>
              <rect
                x={x - 84}
                y={y - 28}
                width="168"
                height="60"
                rx="12"
                className="service-map-node"
              />
              <Label x={x} y={y - 3} text={label} />
            </g>
          );
        })}
      </svg>
      <figcaption>
        {uk
          ? "Корисна участь може повертати досвід у мережу. Готовність долучитися та результат перевіряємо в пілоті."
          : "Useful participation can return experience to the network. Willingness to contribute and outcomes are tested in the pilot."}
      </figcaption>
    </figure>
  );
}
