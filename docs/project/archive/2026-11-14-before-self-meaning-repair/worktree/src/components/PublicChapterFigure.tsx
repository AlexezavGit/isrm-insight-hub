import { useState } from "react";
import { ISRM_PUBLIC_DIRECTORY, publicLeadershipGraph, publicRole } from "@/lib/public-directory";
import { layoutNetwork } from "@/lib/network-layout";
import { mapSymbolPath, MAP_SYMBOLS } from "@/lib/map-symbols";
import { networkSymbolKind } from "@/lib/network-symbols";
import type { ClientLocale } from "@/lib/client-catalog";
const model = publicLeadershipGraph();
const positions = layoutNetwork(model, "people", [], [], "", false);
export function PublicChapterFigure({ locale }: { locale: ClientLocale }) {
  const uk = locale === "uk",
    [selected, setSelected] = useState<string | null>(null);
  const person = selected ? publicRole(selected) : null;
  return (
    <figure className="briefing-evidence-figure briefing-public-chapters">
      <div className="briefing-story-field">
        <p className="public-model-label">
          {uk ? "МОДЕЛЬ ЯДРА · ПУБЛІЧНИЙ ШАР ISRM" : "CORE MODEL · ISRM PUBLIC LAYER"}
        </p>
        <svg
          viewBox="-440 -440 880 880"
          role="img"
          aria-label={
            uk
              ? "Публічні підрозділи й представники ISRM та їхня територія відповідальності"
              : "Published ISRM units, representatives and jurisdiction"
          }
        >
          {[310, 350, 390].map((r) => (
            <circle key={r} r={r} fill="none" stroke="#a5bfc4" opacity=".12" />
          ))}
          {model.links.map((e, i) => {
            const a = positions.get(e.source)!,
              b = positions.get(e.target)!;
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#a5bfc4"
                opacity={selected && e.source !== selected ? 0.07 : 0.3}
                strokeDasharray={e.kind === "public-jurisdiction" ? "5 4" : undefined}
              />
            );
          })}
          <path d={mapSymbolPath("core", 36)} fill="#0c2b39" stroke="#e5c66b" strokeWidth="2" />
          <text textAnchor="middle" y="64" fill="#f0eadb" fontSize="32">
            {uk ? "Суверенне ядро" : "Sovereign core"}
          </text>
          <text textAnchor="middle" y="93" fill="#f0eadb" fontSize="24">
            {uk ? "Докази експертизи + оцінка 360°" : "Expertise evidence + 360° feedback"}
          </text>
          <text textAnchor="middle" y="122" fill="#e5c66b" fontSize="24">
            Trust &amp; Influence Index · {uk ? "модель" : "model"}
          </text>
          {model.nodes.map((n) => {
            const p = positions.get(n.id)!,
              kind = networkSymbolKind(n);
            return (
              <g key={n.id} transform={`translate(${p.x} ${p.y})`}>
                <path
                  d={mapSymbolPath(kind, n.id.startsWith("public-person:") ? 5 : 9)}
                  fill={MAP_SYMBOLS[kind].filled ? MAP_SYMBOLS[kind].color : "#0c2b39"}
                  stroke={MAP_SYMBOLS[kind].color}
                  strokeWidth="2"
                />
                {n.id.startsWith("public-person:") && <circle r="9" fill="none" stroke="#e5c66b" />}
                <title>{n.label}</title>
              </g>
            );
          })}
        </svg>
        <select
          aria-label={uk ? "Опублікований представник ISRM" : "Published ISRM representative"}
          value={selected ?? ""}
          onChange={(e) => setSelected(e.target.value || null)}
        >
          <option value="">
            {uk
              ? "Оберіть представника — ім’я, посада, джерело"
              : "Choose a representative — name, role, source"}
          </option>
          {model.nodes
            .filter((n) => n.id.startsWith("public-person:"))
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
        </select>
        {person && (
          <p className="public-role-caption">
            {person.name} · {person.role} ·{" "}
            <a href={person.sourceUrl} target="_blank" rel="noreferrer">
              {uk ? "Джерело ISRM" : "ISRM source"}
            </a>
          </p>
        )}
      </div>
      <figcaption>
        {uk
          ? "Подвійний контур — публічний представник; квадрат — підрозділ; коло — країна. Лінії: опублікована роль і територія чаптеру, не особисте знайомство. Центр — модель, не розрахований рейтинг."
          : "Double outline: published representative; square: unit; circle: country. Lines show published roles and chapter jurisdiction, not personal acquaintance. The centre is a model, not a calculated score."}
        <small className="briefing-sample-sources">
          ISRM-PUBLIC-DIRECTORY-PAGES-2026-11-14 ·{" "}
          <a href={ISRM_PUBLIC_DIRECTORY.directoryUrl} target="_blank" rel="noreferrer">
            ISRM
          </a>
        </small>
      </figcaption>
    </figure>
  );
}
