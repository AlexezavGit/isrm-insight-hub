import { createFileRoute, Link, useMatch } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { FileText, Search, UserRound, X } from "lucide-react";
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
  const [searchOpen, setSearchOpen] = useState(() => panel === "search");
  const [dependenciesMode, setDependenciesMode] = useState(false);
  const [cabinetOpen, setCabinetOpen] = useState(() => stage === "configuration");
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [allRevealedModalOpen, setAllRevealedModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const all = data?.experts ?? [];

  // Verified audience data — sources: DDD/6_ISRM_Community_Activation_Evidence_and_Data_Gaps.md
  const AUDIENCE = {
    crm: 178,          // CRM-ROWS: WhatsApp-cohort CRM records
    verified: 45,      // CRM-VERIFIED: "Verified profile" status in CRM
    liPage: 8742,      // AUD-LI-PAGE: LinkedIn Page followers
    liGroup: 11700,    // AUD-LI-GROUP: LinkedIn Group members
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
        approval: "3 · Scope & Limits",
        dossier: "Open dossier",
        configureServices: "Configure services",
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
        cabinet: "2 · Конфігуратор",
        approval: "3 · Погодження та ліміти",
        dossier: "Відкрити досьє",
        configureServices: "Конфігурація сервісів",
        close: "Закрити",
        layers: "Шари графа",
      };

  return (
    <main className="relative h-[100svh] min-h-0 overflow-hidden">
      {/* Background Graph Canvas */}
      <section className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-card),transparent_68%)]">
        {mounted && !loading && (
          <Suspense fallback={null}>
            <NetworkGraph
              experts={graphExperts}
              layers={layers}
              focus={focus}
              serviceMode={dependenciesMode}
              activeServiceId={activeServiceId}
              onServiceSelect={(svcId) => setActiveServiceId(svcId)}
              onAllServicesRevealed={() => setAllRevealedModalOpen(true)}
              locale={locale}
              onFocus={(code) => {
                // Background click (code = null): close open side panels
                if (code === null) {
                  setFocus(null);
                  setSearchOpen(false);
                  setCabinetOpen(false);
                  return;
                }
                if (
                  code.startsWith("S:") ||
                  code.startsWith("T:") ||
                  code.startsWith("H:") ||
                  code.startsWith("svc:") ||
                  code.startsWith("hub:") ||
                  code === "P:queue"
                ) {
                  return;
                }
                setFocus(code);
                setSearchOpen(false);
                setCabinetOpen(false);
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
        {!loading && mounted && !dependenciesMode && graphExperts.length === 0 && all.length > 0 && (
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

      {/* Header with Live Status & Audience Badges */}
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
            {/* Dashboard metrics always visible in header */}
            <div className="pointer-events-auto hidden sm:flex items-center gap-px rounded border border-border bg-panel/70 backdrop-blur-xl overflow-hidden text-center">
              {dependenciesMode ? (
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
          </div>
          <div className="pointer-events-auto shrink-0">
            <AccessControl />
          </div>
        </div>

        {/* Mobile dashboard strip */}
        <div className="pointer-events-auto mt-2 flex sm:hidden gap-px rounded border border-border bg-panel/70 backdrop-blur-xl overflow-hidden text-center">
          {dependenciesMode ? (
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

      {/* ── LEFT DRAWER: Search Panel ── */}
      {searchOpen && (
        <aside
          id="network-search-panel"
          className="fixed left-0 bottom-[5.5rem] top-16 z-30 w-[88vw] max-w-[420px] sm:w-[420px] overflow-y-auto overscroll-contain border-r border-border bg-panel/85 p-4 sm:p-5 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="tech-label text-primary">{locale === "uk" ? "1 · Пошук" : "1 · Search"}</p>
              <h2 className="font-display text-lg sm:text-xl font-semibold mt-0.5 text-foreground">
                {locale === "uk" ? "Підбір експертів" : "Expert Search"}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)} aria-label={copy.close}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <FilterBar experts={all} f={f} setF={setF} compact showResearchQueue={false} />

          {/* Graph layers: keep ONLY Research queue as requested */}
          <div className="mt-5 border-t border-border pt-4">
            <p className="tech-label mb-2 text-muted-foreground">{copy.layers}</p>
            <label className="flex cursor-pointer items-center gap-2 py-1.5 text-sm">
              <input
                type="checkbox"
                checked={layers.researchQueue}
                onChange={(event) => setLayers({ ...layers, researchQueue: event.target.checked })}
                className="accent-primary"
              />
              <span className="h-2.5 w-2.5 rounded-full border-2 border-muted-foreground" />
              {t("researchQueue")}
            </label>
          </div>

          {/* Prominent "Підібрати / Match" button */}
          <div className="mt-5 pt-2">
            <Button
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-2.5 shadow-md"
              onClick={() => setSearchOpen(false)}
            >
              <Search className="h-4 w-4" />
              {locale === "uk" ? "Підібрати" : "Match"}
            </Button>
          </div>
        </aside>
      )}

      {/* ── RIGHT DRAWER: Mini-Dossier Frame ── */}
      {selected && (
        <aside className="fixed right-0 bottom-[5.5rem] top-16 z-35 w-[88vw] max-w-[360px] sm:w-[360px] overflow-y-auto overscroll-contain border-l border-border bg-panel/95 p-5 shadow-2xl backdrop-blur-2xl">
          <button
            onClick={() => setFocus(null)}
            className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground p-1"
            aria-label={copy.close}
          >
            <X className="h-4 w-4" />
          </button>
          <p className="tech-label text-primary">
            {selected.code} · {data?.level === "guest" ? t("aliases") : t("fullData")}
          </p>
          <h2 className="mt-2 pr-7 font-display text-2xl leading-tight text-foreground">{selected.displayName}</h2>
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
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                alert(
                  locale === "uk"
                    ? "Детальне досьє поки в розробці (Under development)."
                    : "Detailed dossier is currently under development."
                );
              }}
            >
              {copy.dossier}
            </Button>
            <Button
              onClick={() => {
                setCabinetOpen(true);
                setSearchOpen(false);
                setDependenciesMode(false);
                setFocus(null);
              }}
            >
              {copy.configureServices}
            </Button>
          </div>
        </aside>
      )}

      {/* ── BOTTOM DOCK: 3 Steps (1 Search, 2 Configure, 3 Scope & Limits) ── */}
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
            setFocus(null);
          }}
        />
        <DockButton
          icon={UserRound}
          label={copy.cabinet}
          active={cabinetOpen}
          onClick={() => {
            setCabinetOpen(!cabinetOpen);
            setSearchOpen(false);
            setFocus(null);
          }}
        />
        <Button
          asChild
          variant={onScope ? "secondary" : "default"}
          className="h-14 min-w-24 max-w-36 flex-col gap-1 whitespace-normal px-2.5 shadow-md"
        >
          <Link to="/scope">
            <FileText className="h-5 w-5" />
            <span className="text-center text-[0.65rem] leading-tight font-medium">{copy.approval}</span>
          </Link>
        </Button>
      </nav>

      {/* ── CONFIGURATOR DRAWER (MemberCabinet) ── */}
      <MemberCabinet
        open={cabinetOpen}
        onClose={() => setCabinetOpen(false)}
        onOpenDependencies={(svcId) => {
          setCabinetOpen(false);
          setDependenciesMode(true);
          setActiveServiceId(svcId);
          setFocus(null);
        }}
      />

      {/* ── ALL 8 SERVICES REVEALED INVITATION MODAL ── */}
      {allRevealedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-panel/95 p-6 shadow-2xl backdrop-blur-2xl">
            <p className="tech-label text-primary mb-1">
              {locale === "uk" ? "3 · Погодження та ліміти" : "3 · Scope & Limits"}
            </p>
            <h3 className="font-display text-xl font-semibold text-foreground">
              {locale === "uk" ? "Всі 8 сервісів мережі активовано" : "All 8 network services activated"}
            </h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {locale === "uk"
                ? "Ви ознайомилися з усіма операціями та залежностями експертної мережі. Бажаєте перейти до наступного етапу — погодження обсягів робіт та лімітів бюджету?"
                : "You have explored all operations and dependencies of the expert network. Would you like to proceed to the next stage — agreeing on scope and budget limits?"}
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setAllRevealedModalOpen(false)}
              >
                {locale === "uk" ? "Скасувати" : "Cancel"}
              </Button>
              <Button
                asChild
                className="bg-primary text-primary-foreground font-semibold"
              >
                <Link to="/scope" onClick={() => setAllRevealedModalOpen(false)}>
                  {locale === "uk" ? "Перейти до погоджень" : "Proceed to Scope"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
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
  icon: typeof Search;
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
