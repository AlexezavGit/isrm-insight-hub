export type InspectionWidths = { profile: number; shortlist: number };
export type StackWidths = InspectionWidths & { search: number };
export function stackedInspectionLayout(
  viewport: number,
  open: Record<keyof StackWidths, boolean>,
  requested: StackWidths,
  historical = false,
) {
  const compact = viewport < 1100;
  const sizes: StackWidths = { search: 0, profile: 0, shortlist: 0 };
  const keys = (["search", "profile", "shortlist"] as const).filter((k) => open[k]);
  for (const key of keys) sizes[key] = Math.max(220, Math.min(560, requested[key]));
  if (compact)
    return {
      ...sizes,
      compact,
      width: keys.length ? Math.min(420, Math.max(0, viewport - 64)) : 0,
      graph: viewport,
    };
  const budget = historical ? viewport - 404 : viewport - Math.max(284, (viewport - 40) / 4 + 24),
    total = Object.values(sizes).reduce((a, b) => a + b, 0),
    minimum = keys.length * 220;
  if (total > budget && total > minimum)
    for (const key of keys)
      sizes[key] -= ((total - budget) * (sizes[key] - 220)) / (total - minimum);
  const width = Object.values(sizes).reduce((a, b) => a + b, 0);
  return { ...sizes, compact, width, graph: viewport - width - 24 };
}
const bounded = (value: number) => Math.max(260, Math.min(560, value));

export function inspectionLayout(
  viewport: number,
  profileOpen: boolean,
  shortlistOpen: boolean,
  searchWidth: number,
  requested: InspectionWidths,
) {
  const compact = viewport < 1100;
  if (compact)
    return {
      compact,
      width: profileOpen || shortlistOpen ? Math.min(420, Math.max(0, viewport - 64)) : 0,
      profile: 0,
      shortlist: 0,
      left: searchWidth,
      graph: viewport,
    };
  let left = searchWidth;
  const count = Number(profileOpen) + Number(shortlistOpen);
  if (viewport - left - 24 - 260 * count < 380) left = 0;
  const budget = Math.max(0, viewport - left - 404);
  let profile = profileOpen ? bounded(requested.profile) : 0;
  let shortlist = shortlistOpen ? bounded(requested.shortlist) : 0;
  const excess = profile + shortlist - budget;
  if (excess > 0) {
    if (count === 1) {
      if (profileOpen) profile = Math.min(profile, budget);
      else shortlist = Math.min(shortlist, budget);
    } else {
      const flexible = profile + shortlist - 520;
      if (flexible > 0) {
        profile -= (excess * (profile - 260)) / flexible;
        shortlist -= (excess * (shortlist - 260)) / flexible;
      }
    }
  }
  const width = profile + shortlist;
  return { compact, width, profile, shortlist, left, graph: viewport - left - width - 24 };
}
