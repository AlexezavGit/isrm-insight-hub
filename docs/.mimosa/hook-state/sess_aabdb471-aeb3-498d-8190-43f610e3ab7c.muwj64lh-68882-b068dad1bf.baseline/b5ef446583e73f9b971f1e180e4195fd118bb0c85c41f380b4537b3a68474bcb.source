import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { PanelLeftOpen, PanelRightOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccess } from "@/lib/access";
import { applyFilters, FilterBar, type Filters } from "@/lib/filters";
import { TrustBar, VerifyBadge } from "@/components/AppShell";
import { useI18n } from "@/lib/i18n";
import { useConfiguratorState } from "@/lib/proposal-config";
import { CoordinatorSection } from "@/routes/coordinator";
import { ProposalSection } from "@/routes/proposal";

const NetworkGraph = lazy(() => import("@/components/NetworkGraph"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Network Map — ISRM Ukraine" },
      {
        name: "description",
        content:
          "Explore the ISRM Ukraine expert network through an interactive graph of expertise, sectors, and community hubs.",
      },
      { property: "og:title", content: "Network Map — ISRM Ukraine" },
      {
        property: "og:description",
        content:
          "An interactive view of expertise and connections across the ISRM Ukraine network.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConfiguratorPage,
});

function ConfiguratorPage() {
  return (
    <main>
      <NetworkSection />
      <CoordinatorSection />
      <ProposalSection />
    </main>
  );
}

export function NetworkSection() {
  const { data, loading } = useAccess();
  const { t } = useI18n();
  const { state, update } = useConfiguratorState();
  const f = state.filters;
  const focus = state.focusedExpertCode;
  const layers = state.layers;
  const setF = (filters: Filters) => update({ filters });
  const setFocus = (focusedExpertCode: string | null) => update({ focusedExpertCode });
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [replayStep, setReplayStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const advance = () => {
      setReplayStep((step) => step + 1);
      timer = setTimeout(advance, 4200 + ((replayStep + 1) % 3) * 1700);
    };
    timer = setTimeout(advance, 5200);
    return () => clearTimeout(timer);
  }, [replayStep]);
  const all = data?.experts ?? [];
  const replayed = useMemo(() => {
    const queue = all.filter((expert) => !expert.verified);
    const promoted = new Set(queue.slice(0, Math.min(replayStep, 2)).map((expert) => expert.code));
    return all.map((expert) =>
      promoted.has(expert.code)
        ? { ...expert, verified: true, trust: Math.min(100, expert.trust + 1) }
        : expert,
    );
  }, [all, replayStep]);
  const list = useMemo(() => applyFilters(replayed, f), [replayed, f]);
  const sel = all.find((e) => e.code === focus);
  const verified = list.filter((e) => e.verified).length;
  useEffect(() => {
    if (focus) setRightPanelOpen(true);
  }, [focus]);

  return (
    <section
      id="network"
      aria-label="Network"
      className="relative mx-auto h-[calc(100dvh-8.5rem)] min-h-[560px] max-w-[1600px] scroll-mt-16 overflow-hidden"
    >
      <section className="blueprint-surface absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-card),var(--color-background)_70%)]">
        {mounted && !loading && (
          <Suspense fallback={null}>
            <NetworkGraph experts={list} layers={layers} focus={focus} onFocus={setFocus} />
          </Suspense>
        )}
        {loading && (
          <p className="absolute inset-0 grid place-items-center font-mono text-xs text-muted-foreground">
            {t("loading")}
          </p>
        )}
      </section>
      <div className="pointer-events-none absolute inset-x-3 top-3 z-10 mx-auto grid max-w-3xl grid-cols-3 gap-1.5 sm:inset-x-6 sm:top-5 sm:gap-3">
        {[
          [t("nodes"), list.length, "Experts in this view"],
          [t("verified"), verified, "Verified profiles"],
          [t("researchQueue"), list.length - verified, "Need review"],
        ].map(([label, value, hint]) => (
          <div
            key={label}
            className="rounded border border-primary/25 bg-card/75 px-2 py-2 shadow backdrop-blur-md sm:px-4 sm:py-3"
          >
            <p className="font-display text-xl tabular-nums sm:text-3xl">{value}</p>
            <p className="truncate font-mono text-[8px] uppercase tracking-wide text-muted-foreground sm:text-[10px]">
              {label}
            </p>
            <p className="hidden text-[10px] text-muted-foreground sm:block">{hint}</p>
          </div>
        ))}
      </div>
      <div className="absolute left-3 top-28 z-20 sm:left-5 sm:top-32">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLeftPanelOpen(!leftPanelOpen)}
          className="bg-card/85 shadow backdrop-blur-md"
        >
          {leftPanelOpen ? (
            <X className="mr-2 h-4 w-4" />
          ) : (
            <PanelLeftOpen className="mr-2 h-4 w-4" />
          )}
          <span className="font-mono text-[10px] uppercase">Expertise filters</span>
        </Button>
      </div>
      <div className="absolute right-3 top-28 z-20 sm:right-5 sm:top-32">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          className="bg-card/85 shadow backdrop-blur-md"
        >
          {rightPanelOpen ? (
            <X className="mr-2 h-4 w-4" />
          ) : (
            <PanelRightOpen className="mr-2 h-4 w-4" />
          )}
          <span className="font-mono text-[10px] uppercase">
            {sel ? "Expert dossier" : "Expert list"}
          </span>
        </Button>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded border border-border bg-card/75 px-3 py-1.5 text-center font-mono text-[9px] uppercase tracking-wide text-muted-foreground backdrop-blur-md sm:bottom-6 sm:text-[10px]">
        {t("networkExploreHint")}
      </div>
      {leftPanelOpen && (
        <aside className="absolute inset-y-0 left-0 z-30 w-[min(340px,88vw)] space-y-5 overflow-y-auto border-r border-primary/35 bg-card/95 p-4 pt-32 shadow-2xl backdrop-blur-xl sm:p-5 sm:pt-36">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                {t("networkSlice")}
              </p>
              <h2 className="mt-1 font-display text-xl">Find relevant expertise</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close filters"
              onClick={() => setLeftPanelOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <FilterBar experts={all} f={f} setF={setF} compact />
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              {t("graphLayers")}
            </p>
            {(
              [
                ["network", t("expertNodes")],
                ["relationships", t("connections")],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
                <input
                  type="checkbox"
                  checked={layers[key]}
                  onChange={(event) =>
                    update({
                      layers: { [key]: event.target.checked },
                      ...(key === "network" && !event.target.checked
                        ? { focusedExpertCode: null }
                        : {}),
                    })
                  }
                  className="accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              {t("clusterLayers")}
            </p>
            {(
              [
                ["sector", t("sectors"), "border-primary"],
                ["theme", t("themes"), "border-chart-2"],
                ["hub", t("hubs"), "border-chart-5"],
              ] as const
            ).map(([key, label, color]) => (
              <label key={key} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
                <input
                  type="checkbox"
                  checked={layers[key]}
                  onChange={(event) => update({ layers: { [key]: event.target.checked } })}
                  className="accent-primary"
                />
                <span className={`h-2.5 w-2.5 rounded-full border-2 ${color}`} />
                {label}
              </label>
            ))}
          </div>
          <p className="border-t border-border pt-3 text-xs text-muted-foreground">
            Matching experts: <strong className="text-foreground">{list.length}</strong>. The graph
            updates with each filter.
          </p>
        </aside>
      )}
      {rightPanelOpen && (
        <aside className="absolute inset-y-0 right-0 z-30 w-[min(360px,90vw)] overflow-y-auto border-l border-primary/35 bg-card/95 p-4 pt-32 shadow-2xl backdrop-blur-xl sm:p-5 sm:pt-36">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                {sel ? "Selected expert" : t("highestTrust")}
              </p>
              <h2 className="mt-1 font-display text-xl">
                {sel ? sel.displayName : "Network experts"}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close expert panel"
              onClick={() => setRightPanelOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {sel ? (
            <div className="space-y-5">
              <div>
                <p className="font-mono text-xs text-primary">{sel.code}</p>
                {sel.organization && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {sel.role} · {sel.organization}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-3">
                  <VerifyBadge verified={sel.verified} />
                  <TrustBar value={sel.trust} />
                </div>
              </div>
              <dl className="space-y-3 text-sm">
                {[
                  [t("sector"), sel.sector],
                  [t("geography"), sel.country],
                  [t("expertise"), sel.primaryExpertise],
                  [t("ukraineExperience"), sel.ukraineTheme],
                  [t("isrmRole"), sel.communityRole],
                ].map(([key, value]) => (
                  <div key={key}>
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {key}
                    </dt>
                    <dd className="mt-0.5">{value}</dd>
                  </div>
                ))}
              </dl>
              <Link
                to="/experts/$code"
                params={{ code: sel.code }}
                className="block rounded bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
              >
                {t("openDossier")}
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {[...list]
                .sort((a, b) => b.trust - a.trust)
                .slice(0, 30)
                .map((expert) => (
                  <li key={expert.code}>
                    <button
                      onClick={() => setFocus(expert.code)}
                      className="flex w-full items-center justify-between gap-3 py-2.5 text-left hover:text-primary"
                    >
                      <span className="min-w-0">
                        <span className="block font-mono text-[10px] text-muted-foreground">
                          {expert.code}
                        </span>
                        <span className="block truncate text-sm">{expert.displayName}</span>
                        <span className="block truncate text-[10px] text-muted-foreground">
                          {expert.primaryExpertise}
                        </span>
                      </span>
                      <TrustBar value={expert.trust} />
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </aside>
      )}
    </section>
  );
}
