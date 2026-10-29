export type HighlightRect = { x: number; y: number; width: number; height: number };
export function placeCoach(
  w: number,
  h: number,
  target: HighlightRect | null,
  cw: number,
  ch: number,
) {
  const clamp = (n: number, max: number) => Math.max(8, Math.min(max, n));
  const maxX = Math.max(8, w - cw - 8),
    maxY = Math.max(8, h - ch - 8);
  if (!target) return { x: maxX, y: maxY };
  const candidates = [
    { x: maxX, y: maxY },
    { x: 8, y: 8 },
    { x: maxX, y: 8 },
    { x: 8, y: maxY },
    { x: clamp(target.x, maxX), y: target.y + target.height + 12 },
    { x: clamp(target.x, maxX), y: target.y - ch - 12 },
  ].map((p) => ({ x: clamp(p.x, maxX), y: clamp(p.y, maxY) }));
  const overlap = (p: { x: number; y: number }) =>
    Math.max(0, Math.min(p.x + cw, target.x + target.width + 8) - Math.max(p.x, target.x - 8)) *
    Math.max(0, Math.min(p.y + ch, target.y + target.height + 8) - Math.max(p.y, target.y - 8));
  return candidates.sort((a, b) => overlap(a) - overlap(b))[0]!;
}
