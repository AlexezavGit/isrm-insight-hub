import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useAccess } from "@/lib/access";
import { applyFilters, FilterBar, useFilters } from "@/lib/filters";
import { TrustBar, VerifyBadge } from "@/components/AppShell";
import type { GraphLayers } from "@/components/NetworkGraph";
import { useI18n } from "@/lib/i18n";

const NetworkGraph = lazy(() => import("@/components/NetworkGraph"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Карта мережі — ISRM Ukraine" },
      { name: "description", content: "Інтерактивний граф 178 експертів ISRM Ukraine: сектори, теми українського досвіду, хаби спільноти." },
      { property: "og:title", content: "Карта мережі — ISRM Ukraine" },
      { property: "og:description", content: "Інтерактивний граф закритої експертної мережі ISRM Ukraine." },
    ],
  }),
  component: NetworkPage,
});

function NetworkPage() {
  const { data, loading } = useAccess();
  const { locale, t } = useI18n();
  const [f, setF] = useFilters();
  const [focus, setFocus] = useState<string | null>(null);
  const [layers, setLayers] = useState<GraphLayers>({ sector: true, theme: true, hub: true });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const all = data?.experts ?? [];
  const list = useMemo(() => applyFilters(all, f), [all, f]);
  const sel = all.find((e) => e.code === focus);
  const verified = list.filter((e) => e.verified).length;

  return (
    <div className="mx-auto grid max-w-[1600px] gap-0 lg:h-[calc(100vh-3.5rem)] lg:grid-cols-[300px_1fr_340px]">
      <aside className="space-y-5 border-b border-border p-4 sm:p-5 lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{t("networkSlice")}</p>
          <div className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded border border-border bg-border">
            {[
              [t("nodes"), list.length],
              [t("verified"), verified],
              [t("researchQueue"), list.length - verified],
            ].map(([l, v]) => (
              <div key={l} className="bg-card p-3">
                <p className="font-display text-2xl tabular-nums">{v}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <FilterBar experts={all} f={f} setF={setF} compact />
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{t("clusterLayers")}</p>
          {([
            ["sector", t("sectors"), "border-primary"],
            ["theme", t("themes"), "border-chart-2"],
            ["hub", t("hubs"), "border-chart-5"],
          ] as const).map(([k, l, c]) => (
            <label key={k} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
              <input type="checkbox" checked={layers[k]} onChange={(e) => setLayers({ ...layers, [k]: e.target.checked })} className="accent-primary" />
              <span className={`h-2.5 w-2.5 rounded-full border-2 ${c}`} />
              {l}
            </label>
          ))}
        </div>
        <div className="space-y-1.5 border-t border-border pt-4 text-xs text-muted-foreground">
          <p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-success" />{t("verifiedExpert")}</p>
          <p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-muted-foreground" />{t("researchQueue")}</p>
          <p>{t("graphHint")}</p>
        </div>
      </aside>

      <section className="relative h-[62svh] min-h-[420px] overflow-hidden bg-[radial-gradient(circle_at_center,var(--color-card),var(--color-background)_70%)] lg:h-auto lg:min-h-0">
        {mounted && !loading && (
          <Suspense fallback={null}>
            <NetworkGraph experts={list} layers={layers} focus={focus} onFocus={setFocus} />
          </Suspense>
        )}
        {loading && <p className="absolute inset-0 grid place-items-center font-mono text-xs text-muted-foreground">{t("loading")}</p>}
        <div className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Force-directed · {data?.level === "guest" ? t("aliases") : t("fullData")}
        </div>
      </section>

      <aside className="overflow-y-auto border-t border-border p-4 sm:p-5 lg:border-l lg:border-t-0">
        {sel ? (
          <div className="space-y-5">
            <div>
              <p className="font-mono text-xs text-primary">{sel.code}</p>
              <h2 className="mt-1 font-display text-2xl leading-tight">{sel.displayName}</h2>
              {sel.organization && <p className="mt-1 text-sm text-muted-foreground">{sel.role} · {sel.organization}</p>}
              <div className="mt-3 flex items-center gap-3"><VerifyBadge verified={sel.verified} /><TrustBar value={sel.trust} /></div>
            </div>
            <dl className="space-y-3 text-sm">
              {[
                [t("sector"), sel.sector],
                [t("geography"), sel.country],
                [t("expertise"), sel.primaryExpertise],
                [t("ukraineExperience"), sel.ukraineTheme],
                [t("isrmRole"), sel.communityRole],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
                  <dd className="mt-0.5">{v}</dd>
                </div>
              ))}
            </dl>
            <Link to="/experts/$code" params={{ code: sel.code }} className="block rounded bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground">
              {t("openDossier")}
            </Link>
          </div>
        ) : (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{t("highestTrust")}</p>
            <ul className="mt-3 divide-y divide-border">
              {[...list].sort((a, b) => b.trust - a.trust).slice(0, 14).map((e) => (
                <li key={e.code}>
                  <button onClick={() => setFocus(e.code)} className="flex w-full items-center justify-between gap-3 py-2 text-left hover:text-primary">
                    <span className="min-w-0">
                      <span className="block font-mono text-[11px] text-muted-foreground">{e.code}</span>
                      <span className="block truncate text-sm">{e.displayName}</span>
                    </span>
                    <TrustBar value={e.trust} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}
