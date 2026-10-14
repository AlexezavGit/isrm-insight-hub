import raw from "@/data/experts.json";
import type { AccessLevel, Expert } from "./types";

type Raw = (typeof raw)[number] & { verified_details: Record<string, string> };

export interface PartnerPreviewCandidate {
  id: string;
  name: string;
  sector: string;
}

export interface PartnerPreview {
  recordCount: number;
  candidates: PartnerPreviewCandidate[];
  sectors: { value: string; count: number }[];
}

function ukraineCategory(t: string) {
  if (!t) return "Not assessed";
  if (t.includes("— verify") || t.includes("— assess")) return t.replace(/ — (verify|assess)$/, "");
  return "Documented Ukrainian case";
}

export function buildExperts(level: AccessLevel): Expert[] {
  return (raw as Raw[]).map((r) => {
    const ed = r.expertise_details;
    const vd = r.verified_details || {};
    const cat = ukraineCategory(ed.ukraine_theme);
    const base: Expert = {
      id: r.id,
      code: r.code,
      displayName: r.anonymized_name,
      sector: r.sector,
      country: r.country,
      identityStatus: r.identity_status,
      verified: r.is_verified,
      confidence: r.confidence,
      communityRole: r.community_role,
      crmStage: r.crm_stage,
      priority: r.priority,
      tags: r.expertise_tags,
      primaryExpertise: ed.primary_expertise,
      ukraineTheme: cat,
      ukraineCategory: cat,
      evidence: ed.evidence_basis,
      contribution: ed.potential_contribution,
      potentialRole: ed.potential_role,
      caseTheme: vd.case_study_theme,
      internationalRelevance: vd.international_relevance,
    };
    if (level === "guest") return base;
    return {
      ...base,
      displayName: r.name || r.anonymized_name,
      ukraineTheme: ed.ukraine_theme,
      organization: r.organization,
      role: r.role,
      linkedin: r.linkedin,
      source: vd.primary_source,
      sensitivity: r.sensitivity,
      phone: level === "coordinator" ? (r.phone || "").replace(/\u200e/g, "") : undefined,
    };
  });
}

function broadSector(value: string) {
  const normalized = value.trim().toLowerCase();
  if (
    normalized.includes("security") ||
    normalized.includes("risk") ||
    normalized.includes("resilience")
  ) {
    return "Security / risk / resilience";
  }
  if (normalized.includes("business") || normalized.includes("advisory"))
    return "Business / advisory";
  if (normalized.includes("academia") || normalized.includes("research"))
    return "Academia / research";
  if (normalized.includes("humanitarian") || normalized.includes("ngo"))
    return "Humanitarian / NGO";
  if (normalized.includes("unclassified") || !normalized) return "Unclassified";
  return "Other / grouped";
}

export function buildPartnerPreview(): PartnerPreview {
  const records = raw as Raw[];
  const candidates = records.map((record) => {
    const pseudonym = crypto.randomUUID();
    return {
      id: pseudonym,
      name: `Profile ${pseudonym.slice(0, 12).toUpperCase()}`,
      sector: broadSector(record.sector || ""),
    };
  });

  const sectorCounts = new Map<string, number>();
  for (const candidate of candidates) {
    sectorCounts.set(candidate.sector, (sectorCounts.get(candidate.sector) || 0) + 1);
  }

  return {
    recordCount: records.length,
    candidates,
    sectors: Array.from(sectorCounts, ([value, count]) => ({ value, count })).sort((a, b) =>
      a.value.localeCompare(b.value),
    ),
  };
}

export function resolveAccess(code: string | undefined): {
  level: AccessLevel;
  grantedBy?: string;
} {
  const c = (code || "").trim();
  if (!c) return { level: "guest" };
  const admin = process.env["ISRM_ADMIN_CODE"]?.trim();
  if (admin && c === admin) return { level: "coordinator", grantedBy: "Координатор" };
  const norm = c.toLowerCase();
  const ref = (raw as Raw[]).find(
    (r) =>
      r.is_verified && (r.code.toLowerCase() === norm || (r.name && r.name.toLowerCase() === norm)),
  );
  if (ref) return { level: "referral", grantedBy: `Рекомендація ${ref.code}` };
  return { level: "guest" };
}
