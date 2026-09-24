import { useMemo, useState } from "react";
import type { Expert } from "./types";

export interface Filters {
  q: string;
  verified: "all" | "verified" | "queue";
  sector: string;
  country: string;
  theme: string;
  role: string;
}
export const EMPTY: Filters = { q: "", verified: "all", sector: "", country: "", theme: "", role: "" };

export function useFilters() {
  return useState<Filters>(EMPTY);
}

export function applyFilters(list: Expert[], f: Filters) {
  const q = f.q.trim().toLowerCase();
  return list.filter((e) => {
    if (f.verified === "verified" && !e.verified) return false;
    if (f.verified === "queue" && e.verified) return false;
    if (f.sector && e.sector !== f.sector) return false;
    if (f.country && e.country !== f.country) return false;
    if (f.theme && e.ukraineCategory !== f.theme) return false;
    if (f.role && e.communityRole !== f.role) return false;
    if (q) {
      const hay = [e.code, e.displayName, e.sector, e.primaryExpertise, e.organization, e.role, e.ukraineTheme, ...e.tags]
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

export function FilterBar({ experts, f, setF, compact }: { experts: Expert[]; f: Filters; setF: (f: Filters) => void; compact?: boolean }) {
  const opts = useMemo(
    () => ({
      sector: counts(experts, (e) => e.sector),
      country: counts(experts, (e) => e.country),
      theme: counts(experts, (e) => e.ukraineCategory),
      role: counts(experts, (e) => e.communityRole),
    }),
    [experts],
  );
  const vCount = experts.filter((e) => e.verified).length;
  const sel = "w-full rounded border border-input bg-background px-2 py-1.5 text-xs outline-none focus:border-primary";
  const Label = ({ c }: { c: string }) => <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{c}</p>;
  return (
    <div className={compact ? "space-y-3" : "grid gap-3 md:grid-cols-6"}>
      <div className={compact ? "" : "md:col-span-2"}>
        <Label c="Пошук" />
        <input value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} placeholder="Код, експертиза, тег…" className={sel} />
      </div>
      <div>
        <Label c="Верифікація" />
        <div className="flex overflow-hidden rounded border border-input text-xs">
          {([
            ["all", `Усі ${experts.length}`],
            ["verified", `✓ ${vCount}`],
            ["queue", `Черга ${experts.length - vCount}`],
          ] as const).map(([k, l]) => (
            <button key={k} onClick={() => setF({ ...f, verified: k })} className={`flex-1 px-2 py-1.5 ${f.verified === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
      {(["sector", "country", "theme", "role"] as const).map((k) => (
        <div key={k}>
          <Label c={{ sector: "Сектор", country: "Географія", theme: "Український досвід", role: "Роль в ISRM" }[k]} />
          <select value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className={sel}>
            <option value="">Усі</option>
            {opts[k].map(([v, n]) => (
              <option key={v} value={v}>
                {v} · {n}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
