import type { Expert } from "./types";

// ISO 3166-1 alpha-2 codes from the public-domain IANA tzdb iso3166.tab.
// Snapshot: ISO/TC 46 N1127 (2024-02-29), bundled tzdb file dated 2025-07-01.
// Region labels come from the runtime's CLDR data; territories are included.
const COUNTRY_CODES =
  "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(
    " ",
  );
const enNames = new Intl.DisplayNames(["en"], { type: "region" });
const ukNames = new Intl.DisplayNames(["uk"], { type: "region" });
const simplify = (value: string) => value.trim().toLocaleLowerCase().replace(/[’']/g, "");
const countryNames = new Map<string, string>();
for (const code of COUNTRY_CODES) {
  const canonical = enNames.of(code)!;
  for (const name of [code, canonical, ukNames.of(code)!])
    countryNames.set(simplify(name), canonical);
}
for (const [alias, code] of [
  ["UK", "GB"],
  ["USA", "US"],
  ["United States of America", "US"],
  ["Czech Republic", "CZ"],
  ["Turkey", "TR"],
])
  countryNames.set(simplify(alias!), enNames.of(code!)!);
export const canonicalCountry = (value: string) => countryNames.get(simplify(value)) ?? value;

// All 22 UK SIC 2026 sections (ONS, 3 August 2026; OGL v3.0). Existing source categories are retained alongside
// the reference list; we do not infer an SIC classification from someone's role.
// https://www.ons.gov.uk/methodology/classificationsandstandards/ukstandardindustrialclassificationofeconomicactivities/uksic2026
export const ECONOMIC_SECTORS = [
  "Agriculture, forestry and fishing",
  "Mining and quarrying",
  "Manufacturing",
  "Electricity, gas, steam and air conditioning supply",
  "Water supply; sewerage, waste management and remediation activities",
  "Construction",
  "Wholesale and retail trade",
  "Transportation and storage",
  "Accommodation and food service activities",
  "Publishing, broadcasting, and content production and distribution activities",
  "Telecommunication, computer programming, consulting, computing infrastructure and other information service activities",
  "Financial and insurance activities",
  "Real estate activities",
  "Professional, scientific and technical activities",
  "Administrative and support service activities",
  "Public administration and defence; compulsory social security",
  "Education",
  "Human health and social work activities",
  "Arts, sports and recreation",
  "Other service activities",
  "Activities of households as employers and undifferentiated goods - and service-producing activities of households for own use",
  "Activities of extraterritorial organisations and bodies",
];
// Proposed, extendable professional reference directions — not a universal
// classification or evidence that ISRM currently offers all these capabilities.
export const EXPERTISE_DIRECTIONS = [
  "Risk management",
  "Strategic risk",
  "Crisis management",
  "Emergency management",
  "Business continuity",
  "Organisational resilience",
  "Security management",
  "Cyber security",
  "Intelligence and OSINT",
  "Governance and compliance",
  "Law and public policy",
  "Humanitarian response",
  "Public health",
  "Mental health",
  "Infrastructure resilience",
  "Energy security",
  "Supply-chain resilience",
  "Learning and development",
  "Research and evidence review",
  "Strategic communications",
  "Management consulting",
];
export const NETWORK_ROLES = ["Board", "Chapter", "Member"];
export const REVIEW_STATUSES = [
  "Human recommendation",
  "AI OSINT verified",
  "Awaiting verification",
  "Out of compliance",
];
export type ReferenceField = "country" | "sector" | "expertise" | "role" | "reviewStatus";
export interface ReferenceOption {
  value: string;
  label: string;
  count: number;
}
export function referenceOptions(
  experts: Expert[],
  field: ReferenceField,
  locale: string,
): ReferenceOption[] {
  const fieldKey = {
    country: "country",
    sector: "sector",
    expertise: "primaryExpertise",
    role: "communityRole",
    reviewStatus: "identityStatus",
  } as const;
  const totals = new Map<string, number>();
  for (const expert of experts) {
    const raw = expert[fieldKey[field]];
    if (!raw?.trim()) continue;
    const value = field === "country" ? canonicalCountry(raw) : raw;
    totals.set(value, (totals.get(value) ?? 0) + 1);
  }
  const labels = new Map<string, string>();
  if (field === "country") {
    const display = new Intl.DisplayNames([locale], { type: "region" });
    for (const code of COUNTRY_CODES) labels.set(enNames.of(code)!, display.of(code)!);
  } else {
    const reference = {
      sector: ECONOMIC_SECTORS,
      expertise: EXPERTISE_DIRECTIONS,
      role: NETWORK_ROLES,
      reviewStatus: REVIEW_STATUSES,
    }[field];
    for (const value of reference) labels.set(value, value);
  }
  for (const value of totals.keys()) if (!labels.has(value)) labels.set(value, value);
  return [...labels]
    .map(([value, label]) => ({ value, label, count: totals.get(value) ?? 0 }))
    .sort((a, b) => a.label.localeCompare(b.label, locale));
}
