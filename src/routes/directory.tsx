import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useAccess } from "@/lib/access";
import { applyFilters, FilterBar, useFilters } from "@/lib/filters";
import { VerifyBadge } from "@/components/AppShell";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/directory")({
  head: () => ({
    meta: [
      { title: "Expert Directory — ISRM Ukraine" },
      { name: "description", content: "Search the expert network by verification, sector, geography, experience and network role." },
      { property: "og:title", content: "Expert Directory — ISRM Ukraine" },
      { property: "og:description", content: "A privacy-aware expert directory for the ISRM Ukraine network." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Directory,
});

function Directory() {
  const { data, loading } = useAccess();
  const { t } = useI18n();
  const [f, setF] = useFilters();
  const all = data?.experts ?? [];
  const list = useMemo(
    () => applyFilters(all, f).sort((a, b) => a.displayName.localeCompare(b.displayName)),
    [all, f],
  );
  return (
    <main className="mx-auto max-w-[1600px] px-5 py-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{t("directory")}</p>
          <h1 className="mt-1 truncate font-display text-3xl sm:text-4xl">{t("experts")}</h1>
        </div>
        <p className="shrink-0 font-mono text-xs text-muted-foreground">{list.length} / {all.length} {t("records")}</p>
      </div>
      <div className="mt-6 rounded border border-border bg-card p-4">
        <FilterBar experts={all} f={f} setF={setF} />
      </div>
      <div className="mt-4 grid gap-2 md:hidden">
        {loading && <p className="p-6 text-center text-muted-foreground">{t("loading")}</p>}
        {list.map((e) => (
          <Link key={e.code} to="/experts/$code" params={{ code: e.code }} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded border border-border bg-card p-4">
            <div className="min-w-0"><p className="font-mono text-[11px] text-primary">{e.code}</p><h2 className="truncate font-medium">{e.displayName}</h2><p className="mt-1 truncate text-xs text-muted-foreground">{e.sector} · {e.country}</p></div>
            <div className="shrink-0 text-right"><VerifyBadge verified={e.verified} /><p className="tii-status mt-2">{t("tiiPending")}</p></div>
          </Link>
        ))}
      </div>
      <div className="mt-4 hidden overflow-x-auto rounded border border-border md:block">
        <table className="w-full text-sm">
          <thead className="bg-card font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              {[t("code"), t("expert"), t("sector"), t("geography"), t("ukraineExperience"), t("isrmRole"), t("status"), t("tii")].map((h) => (
                <th key={h} className="px-3 py-2.5 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">{t("loading")}</td></tr>}
            {list.map((e) => (
              <tr key={e.code} className="hover:bg-accent/50">
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{e.code}</td>
                <td className="px-3 py-2">
                  <Link to="/experts/$code" params={{ code: e.code }} className="hover:text-primary">{e.displayName}</Link>
                  {e.organization && <div className="text-xs text-muted-foreground">{e.organization}</div>}
                </td>
                <td className="px-3 py-2 text-muted-foreground">{e.sector}</td>
                <td className="px-3 py-2 text-muted-foreground">{e.country}</td>
                <td className="max-w-[260px] truncate px-3 py-2 text-muted-foreground">{e.ukraineCategory}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{e.communityRole}</td>
                <td className="px-3 py-2"><VerifyBadge verified={e.verified} /></td>
                <td className="px-3 py-2"><span className="tii-status">{t("tiiPending")}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
