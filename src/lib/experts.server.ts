import raw from "@/data/experts.json";
import type { AccessLevel, Expert } from "./types";

type Raw = (typeof raw)[number] & { verified_details: Record<string, string> };

const CONF: Record<string, number> = { High: 40, "Medium-high": 30, Medium: 20, Low: 10, None: 0 };
function identityScore(s: string) {
  if (s.startsWith("Confirmed")) return 30;
  return ({ Probable: 20, "Self-identified": 15, Partial: 8 } as Record<string, number>)[s] ?? 0;
}

function ukraineCategory(t: string) {
  if (!t) return "Не оцінено";
  if (t.includes("— verify") || t.includes("— assess")) return t.replace(/ — (verify|assess)$/, "");
  return "Задокументований український кейс";
}

export function buildExperts(level: AccessLevel): Expert[] {
  return (raw as Raw[]).map((r) => {
    const ed: any = r.expertise_details;
    const vd: any = r.verified_details || {};
    const cat = ukraineCategory(ed.ukraine_theme);
    const trust = Math.min(
      100,
      (CONF[r.confidence] ?? 0) +
        identityScore(r.identity_status) +
        (r.is_verified ? 20 : 0) +
        (/Documented/i.test(ed.evidence_basis || "") ? 10 : 0),
    );
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
      trust,
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

export function resolveAccess(code: string | undefined): { level: AccessLevel; grantedBy?: string } {
  const c = (code || "").trim();
  if (!c) return { level: "guest" };
  const admin = process.env["ISRM_ADMIN_CODE"] || "ISRM-COORD-2026";
  if (c === admin) return { level: "coordinator", grantedBy: "Координатор" };
  const norm = c.toLowerCase();
  const ref = (raw as Raw[]).find(
    (r) =>
      r.is_verified &&
      (r.code.toLowerCase() === norm || (r.name && r.name.toLowerCase() === norm)),
  );
  if (ref) return { level: "referral", grantedBy: `Рекомендація ${ref.code}` };
  return { level: "guest" };
}
