import directory from "@/data/isrm-public-directory.json";
import type { NetworkModel, NetworkNode } from "./network-model";
export { directory as ISRM_PUBLIC_DIRECTORY };
export type PublicRole = (typeof directory.entries)[number]["people"][number];
export type PublicUnit = (typeof directory.entries)[number];
export function publicRoleId(name: string) {
  return `public-person:${encodeURIComponent(name)}`;
}
export function publicRole(id: string) {
  const appearances = directory.entries.flatMap((unit) =>
    unit.people
      .filter((person) => publicRoleId(person.name) === id)
      .map((person) => ({ ...person, unit })),
  );
  return appearances.length ? { ...appearances[0]!, appearances } : null;
}
/** Separate public institutional layer. Never re-identifies or enlarges the private research sample. */
export function publicLeadershipGraph(): NetworkModel {
  const nodes: NetworkNode[] = [],
    links: NetworkModel["links"] = [];
  const people = new Map<string, NetworkNode>();
  for (const unit of directory.entries) {
    const unitId = `public-unit:${unit.id}`;
    nodes.push({ id: unitId, kind: "organisation", label: unit.label, size: 1 });
    for (const person of unit.people) {
      const id = publicRoleId(person.name);
      if (!people.has(id)) people.set(id, { id, kind: "hub", label: person.name, size: 1 });
      links.push({ source: id, target: unitId, kind: "public-role" });
    }
    if (unit.coverageCountry) {
      const id = `country:${unit.coverageCountry}`;
      nodes.push({ id, kind: "hub", label: unit.coverageCountry, size: 1 });
      links.push({ source: unitId, target: id, kind: "public-jurisdiction" });
    }
  }
  nodes.push(...people.values());
  return { nodes, links };
}
