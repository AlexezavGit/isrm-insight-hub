import { createFileRoute, Link, useMatch, redirect } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { FileText, Search, SlidersHorizontal, UserRound, X } from "lucide-react";
import { useAccess } from "@/lib/access";
import { applyFilters, FilterBar, useFilters, EMPTY } from "@/lib/filters";
import { AccessControl, VerifyBadge } from "@/components/AppShell";
import { MemberCabinet } from "@/components/MemberCabinet";
import type { GraphLayers } from "@/components/NetworkGraph";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const NetworkGraph = lazy(() => import("@/components/NetworkGraph"));

type IndexSearch = {
  panel?: "search";
  stage?: "configuration";
  preset?: string;
};

export const Route = createFileRoute("/")({
  beforeLoad: ({ location }) => {
    // Skip on server-side where sessionStorage is unavailable
    if (typeof sessionStorage === 'undefined') return;
    // Skip if user is navigating here with panel/stage/preset params (internal navigation)
    const searchStr = location.searchStr ?? '';
    if (searchStr.includes('panel=') || searchStr.includes('stage=') || searchStr.includes('preset=')) return;
    // First-time visitor: redirect to /proposal to start the guided flow
    const visited = sessionStorage.getItem('isrm-visited');
    if (!visited) {
      throw redirect({ to: '/proposal' });
    }
  },
  validateSearch: (search: Record<string, unknown>): IndexSearch => {
    const stage = search["stage"] === "configuration" ? ("configuration" as const) : undefined;
    const panel = !stage && search["panel"] === "search" ? ("search" as const) : undefined;
    const rawPreset = search["preset"];
    const preset = typeof rawPreset === "string" ? rawPreset : undefined;
    const result: IndexSearch = {};
    if (stage) result.stage = stage;
    if (panel) result.panel = panel;
    if (preset !== undefined) result.preset = preset;
    return result;
  },
  head: () => ({
    meta: [
      { title: "ISRM Ukraine — Live Expert Network" },
      {
        name: "description",
        content:
          "A privacy-aware map of expertise, sectors and network services; TII methodology is under development and no score is calculated.",
      },
      { property: "og:title", content: "ISRM Ukraine — Live Expert Network" },
      {
        property: "og:description",
        content:
          "Explore the expert network, source data and operational services; Trust & Influence Index (TII) has no validated score.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NetworkPage,
});

function NetworkPage() {
  const { data, loading } = useAccess();
  const { locale, t } = useI18n();
  const { panel, stage } = Route.useSearch();
  const onScope = useMatch({ from: "/scope", shouldThrow: false });
  const [f, setF] = useFilters();
  const [focus, setFocus] = useState<string | null>(null);
  const [layers, setLayers] = useState<GraphLayers>({
    sector: true,
    theme: true,
    hub: true,
    researchQueue: false,
  });
  const [searchOpen, setSearchOpen] = useState(() => stage !== "configuration");
  const [dependenciesMode, setDependenciesMode] = useState(false);
  const [cabinetOpen, setCabinetOpen] = useState(() => stage === "configuration");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const all = data?.experts ?? [];
  // Verified audience data — sources: DDD/6_ISRM_Community_Activation_Evidence_and_Data_Gaps.md
  const AUDIENCE = {
    crm: 178,          // CRM-ROWS: WhatsApp-cohort CRM records (source: ISRM_Ukraine_Community_CRM_178_FandP.xlsx)
    verified: 45,      // CRM-VERIFIED: "Verified profile" status in CRM
    liPage: 8742,      // AUD-LI-PAGE: LinkedIn Page followers, verified aggregate analytics snapshot 2026-08-28
    liGroup: 11700,    // AUD-LI-GROUP: LinkedIn Group members, user-reported ~11,700, not independently verified
  } as const;
  const list = useMemo(() => applyFilters(all, f), [all, f]);
  const graphExperts = useMemo(
    () => list.filter((expert) => expert.verified || layers.researchQueue),
    [layers.researchQueue, list],
  );
  useEffect(() => {
    if (focus && !graphExperts.some((expert) => expert.code === focus)) setFocus(null);
  }, [focus, graphExperts]);
  const selected = graphExperts.find((expert) => expert.code === focus);
  const verified = graphExperts.filter((expert) => expert.verified).length;
  const queueCount = list.filter((expert) => !expert.verified).length;
  const coverage = Math.round(
    (new Set(
      graphExperts
        .filter((expert) => expert.sector !== "Unclassified")
        .map((expert) => expert.sector),
    ).size /
      Math.max(
        1,
        new Set(
          all.filter((expert) => expert.sector !== "Unclassified").map((expert) => expert.sector),
        ).size,
      )) *
    100,
  );
  const copy =
    locale === "en"
      ? {
        live: "Network live",
        title: "ISRM Ukraine",
        subtitle: "Expert network command surface",
        coverage: "Expertise coverage",
        visible: "Visible experts",
        search: "1 · Search",
        cabinet: "2 · Configure",
        approval: "3 · Proposal & Budget",
        dossier: "Open dossier",
        send: "Send to project",
        close: "Close",
        layers: "Graph layers",
      }
      : {
        live: "Мережа наживо",
        title: "ISRM Ukraine",
        subtitle: "Командна поверхня експертної мережі",
        coverage: "Охоплення експертизи",
        visible: "Видимі експерти",
        search: "1 · Пошук",
        cabinet: "2 · Конфігурація",
        approval: "3 · Пропозиція й ціна",
        dossier: "Відкрити досьє",
        send: "До проєкту",
        close: "Закрити",
        layers: "Шари графа",
      };

  return (
    <main className="relative h-[100svh] min-h-0 overflow-hidden">
      <section
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-card),transparent_68%)] transition-[left,right] duration-300"
        style={{
          left: searchOpen ? "min(50vw, 480px)" : 0,
          right: cabinetOpen ? "min(50vw, 480px)" : 0,
        }}
      >
        {mounted && !loading && (
          <Suspense fallback={null}>
            <NetworkGraph
              experts={graphExperts}
              layers={layers}
              focus={focus}
              serviceMode={cabinetOpen && !dependenciesMode}
              onFocus={(code) => {
                if (
                  code?.startsWith("S:") ||
                  code?.startsWith("T:") ||
                  code?.startsWith("H:") ||
                  code === "P:queue"
                ) {
                  return;
                }
                setFocus(code);
                if (code) {
                  setSearchOpen(false);
                  setCabinetOpen(false);
                }
              }}
            />
          </Suspense>
        )}
        {loading && (
          <p className="absolute inset-0 grid place-items-center tech-label text-muted-foreground">
            {t("loading")}
          </p>
        )}
        {/* Empty state: filters produced no visible experts */}
        {!loading && mounted && !cabinetOpen && graphExperts.length === 0 && all.length > 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="rounded-lg border border-border bg-panel/90 p-6 shadow-xl backdrop-blur-xl max-w-sm">
              <p className="tech-label text-primary mb-2">{locale === "uk" ? "Збіг не знайдено" : "No match found"}</p>
              <p className="font-display text-lg mb-3">
                {locale === "uk"
                  ? "Обрана комбінація фільтрів не повертає жодного експерта."
                  : "The selected filter combination returns no experts."}
              </p>
              <p className="text-sm text-muted-foreground mb-5">
                {locale === "uk"
                  ? "Спробуйте розширити пошук або перейдіть до конфігуратора, щоб розвинути експертне коло."
                  : "Try broadening the search, or go to the configurator to expand the expert network."}
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setF(EMPTY)}
                >
                  {locale === "uk" ? "Скинути фільтри" : "Reset filters"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => { setCabinetOpen(true); setSearchOpen(false); }}
                >
                  {locale === "uk" ? "Відкрити конфігуратор" : "Open configurator"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 p-3 sm:p-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded border border-border bg-panel/70 px-3 py-1.5 backdrop-blur-xl">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              <span className="tech-label text-success">{copy.live}</span>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <span className="hidden truncate font-display text-sm sm:block">
                {copy.title} · {copy.subtitle}
              </span>
            </div>
            {/* Dashboard metrics always visible in header — switch content by mode */}
            <div className="pointer-events-auto hidden sm:flex items-center gap-px rounded border border-border bg-panel/70 backdrop-blur-xl overflow-hidden text-center">
              {cabinetOpen ? (
                <>
                  <MetricBadge value={AUDIENCE.crm} label={locale === "uk" ? "у CRM" : "in CRM"} />
                  <MetricBadge value={AUDIENCE.verified} label={locale === "uk" ? "ідентифіковано" : "identified"} />
                  <MetricBadge value={AUDIENCE.liPage} label={locale === "uk" ? "LinkedIn" : "LinkedIn"} note="~page" />
                </>
              ) : (
                <>
                  <MetricBadge value={graphExperts.length} label={locale === "uk" ? "видимо" : "visible"} />
                  <MetricBadge value={list.filter((e) => e.verified).length} label={locale === "uk" ? "ідентифіковано" : "identified"} />
                  <MetricBadge value={list.length} label={locale === "uk" ? "знайдено" : "found"} />
                </>
              )}
            </div>
          </div>
          <div className="pointer-events-auto shrink-0">
            <AccessControl />
          </div>
        </div>
        {/* Mobile dashboard strip — switch content by mode */}
        <div className="pointer-events-auto mt-2 flex sm:hidden gap-px rounded border border-border bg-panel/70 backdrop-blur-xl overflow-hidden text-center">
          {cabinetOpen ? (
            <>
              <MetricBadge value={AUDIENCE.crm} label={locale === "uk" ? "у CRM" : "in CRM"} />
              <MetricBadge value={AUDIENCE.verified} label={locale === "uk" ? "ідентифіковано" : "identified"} />
              <MetricBadge value={AUDIENCE.liPage} label="LinkedIn" note="~page" />
            </>
          ) : (
            <>
              <MetricBadge value={graphExperts.length} label={locale === "uk" ? "видимо" : "visible"} />
              <MetricBadge value={list.filter((e) => e.verified).length} label={locale === "uk" ? "ідентифіковано" : "identified"} />
              <MetricBadge value={list.length} label={locale === "uk" ? "знайдено" : "found"} />
            </>
          )}
        </div>
      </header>

      {searchOpen && (
        <aside
          id="network-search-panel"
          className="absolute inset-x-0 bottom-[5.5rem] top-16 z-20 overflow-y-auto overscroll-contain border-b border-border bg-panel/95 p-4 shadow-2xl backdrop-blur-xl sm:bottom-0 sm:inset-y-0 sm:left-0 sm:top-16 sm:w-1/2 sm:max-w-[480px] sm:border-b-0 sm:border-r"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="tech-label text-primary">{t("search")}</p>
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)} aria-label={copy.close}>
              <X />
            </Button>
          </div>
          <FilterBar experts={all} f={f} setF={setF} compact showResearchQueue={false} />
          <div className="mt-5 border-t border-border pt-4">
            <p className="tech-label mb-2 text-muted-foreground">{copy.layers}</p>
            {(
              [
                ["sector", t("sectors"), "border-primary"],
                ["theme", t("themes"), "border-brass"],
                ["hub", t("hubs"), "border-success"],
                [
                  "researchQueue",
                  t("researchQueue"),
                  "border-muted-foreground",
                ],
              ] as const
            ).map(([key, label, color]) => (
              <label key={key} className="flex cursor-pointer items-center gap-2 py-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={layers[key]}
                  onChange={(event) => setLayers({ ...layers, [key]: event.target.checked })}
                  className="accent-primary"
                />
                <span className={`h-2.5 w-2.5 rounded-full border-2 ${color}`} />
                {label}
              </label>
            ))}
          </div>
        </aside>
      )}

      {selected && (
        <aside className="blueprint-corners absolute bottom-[calc(env(safe-area-inset-bottom)+6.5rem)] left-3 right-3 z-30 max-h-[calc(100svh-12rem)] overflow-y-auto overscroll-contain rounded border border-border bg-panel/95 p-4 shadow-2xl backdrop-blur-xl sm:bottom-24 sm:left-auto sm:right-5 sm:max-h-none sm:overflow-visible sm:w-[330px]">
          <button
            onClick={() => setFocus(null)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            aria-label={copy.close}
          >
            <X className="h-4 w-4" />
          </button>
          <p className="tech-label text-primary">
            {selected.code} · {data?.level === "guest" ? t("aliases") : t("fullData")}
          </p>
          <h2 className="mt-2 pr-7 font-display text-2xl leading-tight">{selected.displayName}</h2>
          {selected.organization && (
            <p className="mt-1 text-sm text-muted-foreground">
              {selected.role} · {selected.organization}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <VerifyBadge verified={selected.verified} />
            <span className="tii-status">{t("tiiPending")}</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {t("tiiDescription")}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {selected.primaryExpertise}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const goConfig = confirm(
                  locale === "uk"
                    ? "Детальне досьє поки в розробці.\n\nНатисніть OK — перейдемо до конфігурації, або Скасувати — продовжуйте пошук."
                    : "The full dossier is under development.\n\nPress OK to go to the application configuration, or Cancel to continue browsing."
                );
                if (goConfig) {
                  setCabinetOpen(true);
                  setSearchOpen(false);
                  setFocus(null);
                }
              }}
            >
              {copy.dossier}
            </Button>
            <Button
              onClick={() => {
                setCabinetOpen(true);
                setSearchOpen(false);
              }}
            >
              {copy.send}
            </Button>
          </div>
        </aside>
      )}

      <nav className="fixed bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] left-1/2 z-50 flex max-w-[calc(100vw-1rem)] -translate-x-1/2 items-center gap-1 rounded border border-border bg-panel/95 p-1.5 shadow-2xl backdrop-blur-2xl">
        <DockButton
          icon={Search}
          label={copy.search}
          active={searchOpen}
          controlsId="network-search-panel"
          onClick={() => {
            const nextOpen = !searchOpen;
            setSearchOpen(nextOpen);
            setCabinetOpen(false);
            setDependenciesMode(false);
            setFocus(null);
          }}
        />
        <DockButton
          icon={UserRound}
          label={copy.cabinet}
          active={cabinetOpen && !dependenciesMode}
          onClick={() => {
            setCabinetOpen(true);
            setDependenciesMode(false);
            setSearchOpen(false);
            setFocus(null);
          }}
        />
        <DockButton
          icon={SlidersHorizontal}
          label={locale === "uk" ? "Залежності" : "Dependencies"}
          active={dependenciesMode}
          onClick={() => {
            setDependenciesMode((prev) => !prev);
            if (!dependenciesMode) {
              setCabinetOpen(false);
              setSearchOpen(false);
            }
          }}
        />
        <Button
          asChild
          variant={onScope ? "secondary" : "default"}
          className="h-14 min-w-24 max-w-32 flex-col gap-1 whitespace-normal px-2 shadow-md"
        >
          <Link to="/scope">
            <FileText className="h-5 w-5" />
            <span className="text-center text-[0.65rem] leading-tight">{copy.approval}</span>
          </Link>
        </Button>
      </nav>
      <MemberCabinet
        open={cabinetOpen}
        onClose={() => setCabinetOpen(false)}
        onFindExpert={() => {
          setCabinetOpen(false);
          setSearchOpen(true);
        }}
      />
    </main>
  );
}

function Metric({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  return (
    <div className="bg-card/75 p-2.5">
      <p className="font-display text-2xl tabular-nums text-foreground">
        {value}
        {suffix}
      </p>
      <p className="tech-label truncate text-muted-foreground">{label}</p>
    </div>
  );
}
function MetricBadge({ value, suffix = "", label, note }: { value: number; suffix?: string; label: string; note?: string }) {
  const display = value >= 1000
    ? (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + "k"
    : String(value);
  return (
    <div className="bg-panel/80 px-3 py-1.5 min-w-[64px]">
      <p className="font-display text-base tabular-nums text-foreground leading-none">
        {display}{suffix}
      </p>
      <p className="tech-label text-[10px] truncate text-muted-foreground mt-0.5">
        {label}{note ? <span className="opacity-60"> {note}</span> : null}
      </p>
    </div>
  );
}
function DockButton({
  icon: Icon,
  label,
  active,
  controlsId,
  onClick,
}: {
  icon: typeof SlidersHorizontal;
  label: string;
  active: boolean;
  controlsId?: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      onClick={onClick}
      aria-label={label}
      aria-expanded={active}
      aria-controls={controlsId}
      className="h-14 min-w-20 flex-col gap-1 px-3"
    >
      <Icon className={active ? "text-primary" : "text-muted-foreground"} />
      <span className="text-xs">{label}</span>
    </Button>
  );
}
