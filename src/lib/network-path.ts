import type { NetworkModel, NetworkNode } from "./network-model";

export function sharedProfileMatches(model: NetworkModel, from: string) {
  const nodes = new Map(model.nodes.map((node) => [node.id, node]));
  if (nodes.get(from)?.kind !== "expert") return [];
  const links = model.links.filter((link) => link.kind === "category");
  const sharedAttributes = new Set(
    links
      .filter(
        (link) => link.source === from && /^(organisation|expertise|sector):/.test(link.target),
      )
      .map((link) => link.target),
  );
  const matches = new Map<string, NetworkNode[]>();
  for (const { source, target } of links) {
    if (source === from || !sharedAttributes.has(target) || nodes.get(source)?.kind !== "expert")
      continue;
    const attribute = nodes.get(target);
    if (!attribute) continue;
    const attributes = matches.get(source) ?? [];
    if (!attributes.includes(attribute)) matches.set(source, [...attributes, attribute]);
  }
  const priority = (a: NetworkNode) => (a.kind === "organisation" ? 0 : a.kind === "theme" ? 1 : 2);
  return [...matches].map(([code, attributes]) => ({
    code,
    attributes: attributes.sort((a, b) => priority(a) - priority(b)),
  }));
}

export function recordedPath(model: NetworkModel, from: string, to: string) {
  if (!model.nodes.some((n) => n.id === from) || !model.nodes.some((n) => n.id === to)) return [];
  const queue = [[from]],
    seen = new Set([from]);
  while (queue.length) {
    const path = queue.shift()!;
    if (path.at(-1) === to) return path;
    if (path.length > 6) continue;
    for (const link of model.links.filter((l) => l.kind === "category")) {
      const end =
        link.source === path.at(-1)
          ? link.target
          : link.target === path.at(-1)
            ? link.source
            : null;
      if (end && !seen.has(end)) {
        seen.add(end);
        queue.push([...path, end]);
      }
    }
  }
  return [];
}

/** Shortest recorded route plus distinct detours that avoid one of its edges. */
export function routeOptions(model: NetworkModel, from: string, to: string) {
  if (!from || !to || from === to) return [];
  const adjacent = new Map<string, Set<string>>();
  for (const { source, target, kind } of model.links) {
    if (!["category", "public-role", "public-jurisdiction"].includes(kind)) continue;
    for (const [a, b] of [
      [source, target],
      [target, source],
    ] as const) {
      const neighbours = adjacent.get(a) ?? new Set<string>();
      neighbours.add(b);
      adjacent.set(a, neighbours);
    }
  }
  const shortest = (skipA?: string, skipB?: string) => {
    const queue = [from];
    const parent = new Map<string, string | null>([[from, null]]);
    for (let i = 0; i < queue.length; i++) {
      const node = queue[i]!;
      for (const next of adjacent.get(node) ?? []) {
        if (
          parent.has(next) ||
          (node === skipA && next === skipB) ||
          (node === skipB && next === skipA)
        )
          continue;
        parent.set(next, node);
        if (next === to) {
          const path = [to];
          for (let id: string | null = node; id !== null; id = parent.get(id)!) path.push(id);
          return path.reverse();
        }
        queue.push(next);
      }
    }
    return [];
  };
  const first = shortest();
  if (!first.length) return [];
  const routes = [first];
  for (let i = 1; i < first.length; i++) {
    const other = shortest(first[i - 1], first[i]);
    if (other.length && !routes.some((path) => path.join("\n") === other.join("\n")))
      routes.push(other);
  }
  return routes.sort((a, b) => a.length - b.length);
}
