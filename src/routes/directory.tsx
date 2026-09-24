import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useAccess } from "@/lib/access";
import { applyFilters, FilterBar, useFilters } from "@/lib/filters";
import { TrustBar, VerifyBadge } from "@/components/AppShell";

export const Route = createFileRoute("/directory")({
  head: () => ({
    meta: [
      { title: "Реєстр експертів — ISRM Ukraine" },
      { name: "description", content: "Пошук і фільтри за 178 записами: верифікація, сектор, географія, український досвід, роль." },
      { property: "og:title", content: "Реєстр експертів — ISRM Ukraine" },
      { property: "og:description", content: "Пошук і фільтри по закритій експертній мережі ISRM Ukraine." },
    ],
  }),
  component: Directory,
});

function Directory() {
  const { data, loading } = useAccess();
  const [f, setF] = useFilters();
  const all = data?.experts ?? [];
  const list = useMemo(() => applyFilters(all, f).sort((a, b) => b.trust - a.trust), [all, f]);
  return (
    <main className="mx-auto max-w-[1600px] px-5 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Реєстр</p>
          <h1 className="mt-1 font-display text-4xl">Експерти мережі</h1>
        </div>
        <p className="font-mono text-xs text-muted-foreground">{list.length} / {all.length} записів</p>
      </div>
      <div className="mt-6 rounded border border-border bg-card p-4">
        <FilterBar experts={all} f={f} setF={setF} />
      </div>
      <div className="mt-4 overflow-x-auto rounded border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              {["Код", "Експерт", "Сектор", "Географія", "Український досвід", "Роль", "Статус", "Довіра"].map((h) => (
                <th key={h} className="px-3 py-2.5 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">Завантаження…</td></tr>}
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
                <td className="px-3 py-2"><TrustBar value={e.trust} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
