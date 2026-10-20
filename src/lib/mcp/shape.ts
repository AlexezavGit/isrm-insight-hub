import type { Expert } from "../types";

// Anonymised fields only — never names, organisations or contacts.
export const toPublicExpert = (e: Expert) => ({
  code: e.code,
  pseudonym: e.displayName,
  sector: e.sector,
  country: e.country,
  verified: e.verified,
  communityRole: e.communityRole,
  tags: e.tags.map((t) => t),
  primaryExpertise: e.primaryExpertise ?? "",
  ukraineCategory: e.ukraineCategory,
  potentialContribution: e.contribution ?? "",
});
