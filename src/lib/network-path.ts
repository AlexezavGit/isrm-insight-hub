import type { NetworkModel } from "./network-model";
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
