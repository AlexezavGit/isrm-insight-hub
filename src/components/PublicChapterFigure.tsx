import { useState } from "react";
import {
  ISRM_PUBLIC_DIRECTORY,
  publicLeadershipGraph,
  publicRole,
  publicRoleId,
} from "@/lib/public-directory";
import { layoutNetwork } from "@/lib/network-layout";
import { mapSymbolPath, MAP_SYMBOLS } from "@/lib/map-symbols";
import { networkSymbolKind } from "@/lib/network-symbols";
import type { ClientLocale } from "@/lib/client-catalog";
const model = publicLeadershipGraph();
const positions = layoutNetwork(model, "people", [], [], "", false);
export function PublicChapterFigure({ locale }: { locale: ClientLocale }) {
  const uk = locale === "uk",
    [selected, setSelected] = useState<string | null>(null),
    [unitId, setUnitId] = useState<string>("");
  const selectedUnit = ISRM_PUBLIC_DIRECTORY.entries.find((u) => u.id === unitId);
  const person = selected ? publicRole(selected) : null;
  const focusedUnits = person
    ? person.appearances.map((a) => a.unit)
    : selectedUnit
      ? [selectedUnit]
      : [];
  const highlightedIds = new Set(
    focusedUnits.flatMap((u) => [
      `public-unit:${u.id}`,
      ...u.people.map((p) => publicRoleId(p.name)),
      ...(u.coverageCountry ? [`country:${u.coverageCountry}`] : []),
    ]),
  );
  return (
    <figure className="briefing-evidence-figure briefing-public-chapters">
      <div className="briefing-story-field">
        <p className="public-model-label">
          {uk ? "ЗВИЧАЙНА РОБОТА · ПУБЛІЧНА МЕРЕЖА ISRM" : "ORDINARY WORK · ISRM PUBLIC NETWORK"}
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
                opacity={
                  highlightedIds.size
                    ? highlightedIds.has(e.source) && highlightedIds.has(e.target)
                      ? 0.75
                      : 0.035
                    : 0.3
                }
                strokeDasharray={e.kind === "public-jurisdiction" ? "5 4" : undefined}
              />
            );
          })}
          <path d={mapSymbolPath("core", 36)} fill="#0c2b39" stroke="#e5c66b" strokeWidth="2" />
          <text textAnchor="middle" y="-100" fontSize="44">
            {uk ? "Поточне завдання" : "Current task"}
          </text>
          <text textAnchor="middle" y="-40" fontSize="44">
            {uk ? "Перевірка → застосування" : "Review → use"}
          </text>
          <text textAnchor="middle" y="80" fontSize="44">
            {uk ? "Результат → уточнення" : "Outcome → update"}
          </text>
          <text textAnchor="middle" y="140" fontSize="36">
            {uk ? "Довіра · рекомендації" : "Trust · recommendations"}
          </text>
          {model.nodes.map((n) => {
            const p = positions.get(n.id)!,
              kind = networkSymbolKind(n);
            return (
              <g
                key={n.id}
                transform={`translate(${p.x} ${p.y})`}
                opacity={highlightedIds.size && !highlightedIds.has(n.id) ? 0.12 : 1}
              >
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
          aria-label={uk ? "Сторінка чаптеру або підрозділу ISRM" : "ISRM chapter or unit page"}
          value={unitId}
          onChange={(e) => {
            setUnitId(e.target.value);
            setSelected(null);
          }}
        >
          <option value="">
            {uk ? "Усі підрозділи — оберіть окрему сторінку" : "All units — choose a unit page"}
          </option>
          {ISRM_PUBLIC_DIRECTORY.entries.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>
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
            .filter(
              (n) =>
                n.id.startsWith("public-person:") &&
                (!selectedUnit || selectedUnit.people.some((p) => publicRoleId(p.name) === n.id)),
            )
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
        </select>
        {selectedUnit && !person && (
          <p className="public-role-caption">
            <a href={selectedUnit.sourceUrl} target="_blank" rel="noreferrer">
              {selectedUnit.label} · {uk ? "Окрема офіційна сторінка" : "Individual official page"}
            </a>
          </p>
        )}
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
          ? "Подвійний контур — публічний представник; квадрат — підрозділ; коло — країна. Лінії: опублікована роль і територія чаптеру, не особисте знайомство. Центр — модель підтримки актуальності через звичайну роботу."
          : "Double outline: published representative; square: unit; circle: country. Lines show published roles and chapter jurisdiction, not personal acquaintance. The centre shows how ordinary work could keep knowledge current."}
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
