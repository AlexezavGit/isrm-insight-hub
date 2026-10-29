import { useEffect, useMemo, useState } from "react";
import type { Expert } from "./types";
import { useI18n } from "./i18n";
import { canonicalCountry, referenceOptions } from "./network-reference";

export interface Filters {
  q: string;
  verified: "all" | "verified" | "queue";
  sector: string;
  country: string;
  theme: string;
  role: string;
  expertise?: string;
  reviewStatus?: string;
}
export const EMPTY: Filters = {
  q: "",
  verified: "all",
  sector: "",
  country: "",
  theme: "",
  role: "",
};

export function useFilters(persist = true) {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("isrm-demo-filters");
      if (raw) {
        const value = JSON.parse(raw);
        if (
          value &&
          ["q", "sector", "country", "theme", "role"].every((k) => typeof value[k] === "string") &&
          ["all", "verified", "queue"].includes(value.verified)
        )
          setFilters(value);
      }
    } catch {
      /* Filtering remains available without storage. */
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded && persist)
      try {
        sessionStorage.setItem("isrm-demo-filters", JSON.stringify(filters));
      } catch {
        /* Session-only preference. */
      }
  }, [filters, loaded, persist]);
  return [filters, setFilters] as const;
}

export function applyFilters(list: Expert[], f: Filters) {
  const q = f.q.trim().toLowerCase();
  return list.filter((e) => {
    if (f.verified === "verified" && !e.verified) return false;
    if (f.verified === "queue" && e.verified) return false;
    if (f.sector && e.sector !== f.sector) return false;
    if (f.country && canonicalCountry(e.country) !== canonicalCountry(f.country)) return false;
    if (f.expertise && e.primaryExpertise !== f.expertise) return false;
    if (f.reviewStatus && e.identityStatus !== f.reviewStatus) return false;
    if (f.theme && e.ukraineCategory !== f.theme) return false;
    if (f.role && e.communityRole !== f.role) return false;
    if (q) {
      const hay = [
        e.code,
        e.displayName,
        e.sector,
        e.primaryExpertise,
        e.organization,
        e.role,
        e.ukraineTheme,
        ...e.tags,
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function counts(list: Expert[], k: (e: Expert) => string) {
  const m = new Map<string, number>();
  list.forEach((e) => m.set(k(e), (m.get(k(e)) || 0) + 1));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

export function FilterBar({
  experts,
  f,
  setF,
  compact,
  showResearchQueue = true,
  includeReference = false,
}: {
  experts: Expert[];
  f: Filters;
  setF: (f: Filters) => void;
  compact?: boolean;
  showResearchQueue?: boolean;
  includeReference?: boolean;
}) {
  const { t, locale } = useI18n();
  const opts = useMemo(
    () => ({
      sector: includeReference
        ? referenceOptions(experts, "sector", locale)
        : counts(experts, (e) => e.sector).map(([value, count]) => ({
            value,
            label: value,
            count,
          })),
      country: includeReference
        ? referenceOptions(experts, "country", locale)
        : counts(experts, (e) => e.country).map(([value, count]) => ({
            value,
            label: value,
            count,
          })),
      theme: counts(experts, (e) => e.ukraineCategory).map(([value, count]) => ({
        value,
        label: value,
        count,
      })),
      role: includeReference
        ? referenceOptions(experts, "role", locale)
        : counts(experts, (e) => e.communityRole).map(([value, count]) => ({
            value,
            label: value,
            count,
          })),
      expertise: referenceOptions(experts, "expertise", locale),
      reviewStatus: referenceOptions(experts, "reviewStatus", locale),
    }),
    [experts, includeReference, locale],
  );
  const sel = "field py-2 text-sm";
  const Label = ({ c }: { c: string }) => (
    <p className="tech-label mb-1 text-muted-foreground">{c}</p>
  );
  return (
    <div className={compact ? "space-y-3" : "grid gap-3 md:grid-cols-6"}>
      <div className={compact ? "" : "md:col-span-2"}>
        <Label c={t("search")} />
        <input
          aria-label={t("search")}
          value={f.q}
          onChange={(e) => setF({ ...f, q: e.target.value })}
          placeholder={t("searchPlaceholder")}
          className={sel}
        />
      </div>

      {(includeReference
        ? (["country", "sector", "expertise", "role", "reviewStatus", "theme"] as const)
        : (["sector", "country", "theme", "role"] as const)
      ).map((k) => (
        <div key={k} data-filter-field={k}>
          <Label
            c={
              {
                sector: t("sector"),
                country: t("geography"),
                theme: t("ukraineExperience"),
                role: t("isrmRole"),
                expertise: locale === "uk" ? "Напрями експертизи" : "Expertise directions",
                reviewStatus: locale === "uk" ? "Статус перевірки" : "Review status",
              }[k]
            }
          />
          <select
            aria-label={
              {
                sector: t("sector"),
                country: t("geography"),
                theme: t("ukraineExperience"),
                role: t("isrmRole"),
                expertise: locale === "uk" ? "Напрями експертизи" : "Expertise directions",
                reviewStatus: locale === "uk" ? "Статус перевірки" : "Review status",
              }[k]
            }
            value={f[k] ?? ""}
            onChange={(e) => setF({ ...f, [k]: e.target.value })}
            className={sel}
          >
            <option value="">{t("all")}</option>
            {opts[k].map(({ value, label, count }) => (
              <option key={value} value={value}>
                {label} · {count}
              </option>
            ))}
          </select>
        </div>
      ))}
      {includeReference && (
        <small className="network-reference-note">
          {locale === "uk"
            ? "0 — у доступній вибірці немає записів із цією позначкою; це також може означати, що записи ще не класифіковані. Країни й території: ISO 3166; сектори: UK SIC 2026; напрями експертизи — робочий каталог."
            : "0 means no records coded to that category in the accessible sample; records may not yet have been classified. Countries and territories: ISO 3166; sectors: UK SIC 2026; expertise directions are a working catalogue."}
        </small>
      )}
    </div>
  );
}
