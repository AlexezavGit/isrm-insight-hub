export type InspectionWidths = { profile: number; shortlist: number };
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
