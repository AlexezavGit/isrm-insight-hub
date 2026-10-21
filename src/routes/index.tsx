import { createFileRoute, Link, useMatch, redirect } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { ExternalLink, FileText, Info, Search, SlidersHorizontal, Users, X } from "lucide-react";
import { useAccess } from "@/lib/access";
import { applyFilters, FilterBar, useFilters, EMPTY } from "@/lib/filters";
import { AccessControl, VerifyBadge } from "@/components/AppShell";
import { MemberCabinet } from "@/components/MemberCabinet";
import { IsrmLogo } from "@/components/IsrmLogo";
import type { GraphLayers } from "@/components/NetworkGraph";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const NetworkGraph = lazy(() => import("@/components/NetworkGraph"));

type IndexSearch = {
  panel?: "search";
  stage?: "configuration";
  preset?: string;
  network?: string;
};

export const Route = createFileRoute("/")({
  beforeLoad: ({ location, search }) => {
    // All initial entries start at /proposal unless coming with explicit flow parameter or session grant
    const s = search as Record<string, unknown> | undefined;
    const searchStr = location.searchStr ?? "";
    const allowed =
      Boolean(s?.panel) ||
      Boolean(s?.stage) ||
      Boolean(s?.preset) ||
      Boolean(s?.network) ||
      searchStr.includes("panel") ||
      searchStr.includes("stage") ||
      searchStr.includes("preset") ||
      searchStr.includes("network") ||
      (typeof sessionStorage !== "undefined" &&
        sessionStorage.getItem("isrm-allow-graph") === "1");

    if (allowed) {
      return;
    }
    throw redirect({ to: "/proposal" });
  },
  validateSearch: (search: Record<string, unknown>): IndexSearch => {
    const stage = search["stage"] === "configuration" ? ("configuration" as const) : undefined;
    const panel = !stage && search["panel"] === "search" ? ("search" as const) : undefined;
    const rawPreset = search["preset"];
    const preset = typeof rawPreset === "string" ? rawPreset : undefined;
    const network = typeof search["network"] === "string" ? search["network"] : undefined;
    const result: IndexSearch = {};
    if (stage) result.stage = stage;
    if (panel) result.panel = panel;
    if (preset !== undefined) result.preset = preset;
    if (network !== undefined) result.network = network;
    return result;
  },
  head: () => ({
    meta: [
      { title: "ISRM Ukraine — Live Expert Network" },
      {
        name: "description",
        content:
          "A privacy-aware map of expertise, sectors and network services; Trust & Influence Index methodology is under development and no score is calculated.",
      },
      { property: "og:title", content: "ISRM Ukraine — Live Expert Network" },
      {
        property: "og:description",
        content:
          "Explore the expert network, source data and operational services; Trust & Influence Index has no validated score.",
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
  const onScope = useMatch({ from: "/scope", shouldThrow: false });
  const [f, setF] = useFilters();
  const [focus, setFocus] = useState<string | null>(null);
  const [layers, setLayers] = useState<GraphLayers>({
    sector: true,
    theme: true,
    hub: true,
    researchQueue: false,
  });

  // Graph initially opens with NO open panels
  const [searchOpen, setSearchOpen] = useState(false);
  const [dependenciesMode, setDependenciesMode] = useState(false);
  const [cabinetOpen, setCabinetOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [allRevealedModalOpen, setAllRevealedModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Count of revealed service nodes — lifted from NetworkGraph via onRevealedServicesChange
  const [revealedServicesCount, setRevealedServicesCount] = useState(0);
  // Reusable 'Under development' modal — replaces native alert() calls (which were white-themed).
  // Dark theme + blur backdrop per user spec.
  const [underDevAlert, setUnderDevAlert] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });
  const showUnderDev = (msg: string) => setUnderDevAlert({ open: true, message: msg });

  // Group formation workflow states
  const [projectGroup, setProjectGroup] = useState<string[]>([]);
  const [groupViewOpen, setGroupViewOpen] = useState(false);
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: "", desc: "", goal: "" });
  const [legendOpen, setLegendOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const all = data?.experts ?? [];

  const AUDIENCE = {
    crm: 178,
    verified: 45,
    liPage: 8742,
    liGroup: 11700,
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

  // Dismiss ALL open panels when clicking empty space on the graph
  const handleBackgroundClick = () => {
    setSearchOpen(false);
    setCabinetOpen(false);
    setFocus(null);
    setGroupViewOpen(false);
    setProjectFormOpen(false);
    setActiveServiceId(null);
  };

  const copy =
    locale === "en"
      ? {
        live: "Network live",
        title: "ISRM",
        subtitle: "",
        briefing: "0 · Briefing",
        search: "1 · Search",
        cabinet: "2",
        approval: "3 · Scope & Limits",
        dossier: "Full dossier",
        configureServices: "Configure services",
        close: "Close",
        layers: "Graph layers",
      }
      : {
        live: "Мережа наживо",
        title: "ISRM",
        subtitle: "",
        briefing: "0 · Бриф",
        search: "1 · Пошук",
        cabinet: "2",
        approval: "3 · Погодження та ліміти",
        dossier: "Повне досьє",
        configureServices: "Конфігурація сервісів",
        close: "Закрити",
        layers: "Шари графа",
      };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <h1 className="sr-only">ISRM Ukraine — Live Expert Network</h1>

      {/* Network Graph Container with smooth responsive shift when side drawer is open */}
      <section
        aria-label={locale === "uk" ? "Інтерактивний граф мережі" : "Interactive network graph"}
        className={`absolute inset-0 transition-transform duration-500 ease-out ${
          searchOpen || cabinetOpen ? "lg:translate-x-28" : selected || groupViewOpen ? "lg:-translate-x-28" : "translate-x-0"
        }`}
      >
        {mounted && (
          <Suspense
            fallback={
              <p className="absolute inset-0 grid place-items-center tech-label text-muted-foreground">
                {t("loading")}
              </p>
            }
          >
            <NetworkGraph
              experts={graphExperts}
              layers={layers}
              focus={focus}
              serviceMode={dependenciesMode}
              activeServiceId={activeServiceId}
              onServiceSelect={(svcId) => {
                setActiveServiceId(svcId);
                if (svcId) {
                  setFocus(null);
                  setGroupViewOpen(false);
                }
              }}
              onAllServicesRevealed={() => setAllRevealedModalOpen(true)}
              onRevealedServicesChange={(count) => setRevealedServicesCount(count)}
              onBackgroundClick={handleBackgroundClick}
              leftPanelOpen={searchOpen || cabinetOpen}
              rightPanelOpen={Boolean(selected || groupViewOpen)}
              locale={locale}
              onFocus={(code) => {
                if (code === null) {
                  setFocus(null);
                  setGroupViewOpen(false);
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
                setGroupViewOpen(false);
                setProjectFormOpen(false);
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

        {!loading && mounted && !dependenciesMode && graphExperts.length === 0 && all.length > 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="rounded-lg border border-border bg-panel/90 p-6 shadow-xl frosted-panel max-w-sm">
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
                <Button variant="outline" size="sm" onClick={() => setF(EMPTY)}>
                  {locale === "uk" ? "Скинути фільтри" : "Reset filters"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setCabinetOpen(true);
                    setDependenciesMode(true);
                    setSearchOpen(false);
                  }}
                >
                  {locale === "uk" ? "Відкрити конфігуратор" : "Open configurator"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Header with ISRM Logo, Live Status & Audience Badges */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 p-3 sm:p-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0 flex flex-wrap items-center gap-2">
            <div className="pointer-events-auto inline-flex items-center gap-2.5 rounded border border-border bg-panel/85 px-3 py-1.5 frosted-panel">
              <Link to="/proposal" className="inline-flex items-center hover:opacity-90 transition-opacity">
                <IsrmLogo className="h-6 w-auto" showSubtitle={false} />
              </Link>
              <span className="h-3 w-px bg-border" />
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              <span className="tech-label text-success">{copy.live}</span>
              <span className="hidden truncate font-display text-xs sm:block text-muted-foreground">
                {copy.subtitle ? copy.subtitle : ""}
              </span>
            </div>

            <div className="pointer-events-auto hidden sm:flex items-center gap-px rounded border border-border bg-panel/70 frosted-panel overflow-hidden text-center">
              {dependenciesMode ? (
                <>
                  <MetricBadge value={revealedServicesCount} label={locale === "uk" ? "сервісів" : "services"} note="/8" />
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
        <div className="pointer-events-auto mt-2 flex sm:hidden gap-px rounded border border-border bg-panel/70 frosted-panel overflow-hidden text-center">
          {dependenciesMode ? (
            <>
              <MetricBadge value={revealedServicesCount} label={locale === "uk" ? "сервісів" : "services"} note="/8" />
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
          className="fixed left-0 bottom-0 pb-28 top-16 z-30 w-[78vw] max-w-[420px] sm:w-[420px] overflow-y-auto overscroll-contain border-r border-[rgba(200,144,26,0.3)] bg-[#082422]/92 p-4 sm:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.65)] frosted-panel"
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

          <div className="mt-5 pt-2">
            <Button
              className="w-full flex items-center justify-center gap-2 border border-brass/60 text-brass hover:bg-brass/10 bg-transparent font-semibold py-2.5 shadow-md"
              onClick={() => setSearchOpen(false)}
            >
              <Search className="h-4 w-4" />
              {locale === "uk" ? "Підібрати" : "Match"}
            </Button>
          </div>
        </aside>
      )}

      {/* ── RIGHT DRAWER: Mini-Dossier Frame / Project Group Listing / PM Brief Sheet ── */}
      {(selected || groupViewOpen) && (
        <aside className="fixed right-0 bottom-0 pb-28 top-16 z-35 w-[78vw] max-w-[420px] sm:w-[420px] overflow-y-auto overscroll-contain border-l border-[rgba(200,144,26,0.3)] bg-[#082422]/92 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.65)] frosted-panel">
          <button
            onClick={() => {
              setFocus(null);
              setGroupViewOpen(false);
              setProjectFormOpen(false);
            }}
            className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground p-1"
            aria-label={copy.close}
          >
            <X className="h-4 w-4" />
          </button>

          {!groupViewOpen && selected ? (
            /* Single Expert Mini-Dossier */
            <>
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
                <span className="tii-status">Trust & Influence Index pending</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {t("tiiDescription")}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/90 bg-card/60 p-3 rounded-lg border border-border">
                {selected.primaryExpertise}
              </p>

              {/* Action Buttons for Mini-Dossier */}
              <div className="mt-5 flex flex-col gap-2.5">
                <Button
                  className="w-full flex items-center justify-center gap-2 border border-brass/60 text-brass hover:bg-brass/10 bg-transparent font-semibold shadow-md py-2.5"
                  onClick={() => {
                    if (!projectGroup.includes(selected.code)) {
                      setProjectGroup([...projectGroup, selected.code]);
                    }
                    setGroupViewOpen(true);
                  }}
                >
                  <Users className="h-4 w-4" />
                  {locale === "uk" ? "Додати до групи" : "Add to project group"}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      showUnderDev(
                        locale === "uk"
                          ? "Детальне досьє на стадії розробки."
                          : "Detailed dossier is currently under development.",
                      );
                    }}
                  >
                    {copy.dossier}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setCabinetOpen(true);
                      setDependenciesMode(true);
                      setSearchOpen(false);
                      setFocus(null);
                    }}
                  >
                    {copy.configureServices}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Group Listing / Mini Project Sheet */
            <div className="space-y-4">
              <div className="border-b border-border pb-3">
                <p className="tech-label text-primary">
                  {locale === "uk" ? "Проєктна група" : "Project Group"} · {projectGroup.length} {locale === "uk" ? "експертів" : "experts"}
                </p>
                <h2 className="font-display text-xl font-semibold text-foreground mt-0.5">
                  {projectFormOpen
                    ? (locale === "uk" ? "Міні проєктний листок" : "Project Brief Sheet")
                    : (locale === "uk" ? "Відібрані фахівці до проєкту" : "Selected Specialists")}
                </h2>
              </div>

              {!projectFormOpen ? (
                <>
                  {projectGroup.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-6 text-center">
                      {locale === "uk" ? "Група порожня. Оберіть експерта на графі та натисніть «Додати до групи»." : "Group is empty. Select an expert on the graph and click 'Add to project group'."}
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[48vh] overflow-y-auto pr-1">
                      {projectGroup.map((code) => {
                        const exp = all.find((e) => e.code === code);
                        if (!exp) return null;
                        const isAuth = data?.level !== "guest";
                        const nameDisplay = isAuth ? exp.name || exp.displayName : exp.code;
                        return (
                          <div
                            key={code}
                            className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/75"
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <p className="text-sm font-semibold text-foreground truncate">
                                {nameDisplay}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {exp.sector || "Unclassified"} {exp.organization ? `· ${exp.organization}` : ""}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-primary hover:text-primary-foreground"
                                title={locale === "uk" ? "Повне досьє" : "Full dossier"}
                                onClick={() => {
                                  showUnderDev(
                                    locale === "uk"
                                      ? "Повне досьє на стадії розробки."
                                      : "Full dossier is currently under development.",
                                  );
                                }}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                title={locale === "uk" ? "Вилучити" : "Remove"}
                                onClick={() => setProjectGroup(projectGroup.filter((c) => c !== code))}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="pt-2 flex flex-col gap-2">
                    <Button
                      className="w-full border border-brass/60 text-brass hover:bg-brass/10 bg-transparent font-semibold py-2.5 shadow-md"
                      disabled={projectGroup.length === 0}
                      onClick={() => setProjectFormOpen(true)}
                    >
                      {locale === "uk" ? "Зберегти групу до проєкту" : "Save group to project"}
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFocus(null);
                          setGroupViewOpen(false);
                        }}
                      >
                        {locale === "uk" ? "До графа" : "To graph"}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setCabinetOpen(true);
                          setDependenciesMode(true);
                          setFocus(null);
                          setGroupViewOpen(false);
                        }}
                      >
                        {copy.configureServices}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                /* Mini Project Management Brief Sheet */
                <div className="space-y-3.5">
                  <div>
                    <label className="tech-label text-muted-foreground block mb-1">
                      {locale === "uk" ? "Назва проєкту *" : "Project Title *"}
                    </label>
                    <input
                      type="text"
                      className="field text-sm"
                      placeholder={locale === "uk" ? "наприклад: Оцінка стійкості інфраструктури" : "e.g., Infrastructure Resilience Audit"}
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="tech-label text-muted-foreground block mb-1">
                      {locale === "uk" ? "Ціль проєкту" : "Project Objective"}
                    </label>
                    <input
                      type="text"
                      className="field text-sm"
                      placeholder={locale === "uk" ? "наприклад: Підготовка висновку для правління" : "e.g., Board briefing synthesis"}
                      value={projectForm.goal}
                      onChange={(e) => setProjectForm({ ...projectForm, goal: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="tech-label text-muted-foreground block mb-1">
                      {locale === "uk" ? "Короткий опис" : "Short Description"}
                    </label>
                    <textarea
                      rows={3}
                      className="field text-sm resize-none"
                      placeholder={locale === "uk" ? "Короткий контекст задачі та вимоги до компетенцій..." : "Task context and required competencies..."}
                      value={projectForm.desc}
                      onChange={(e) => setProjectForm({ ...projectForm, desc: e.target.value })}
                    />
                  </div>

                  <div className="p-2.5 rounded border border-border bg-card/60 text-xs text-muted-foreground">
                    {locale === "uk"
                      ? `До проєкту буде закріплено ${projectGroup.length} експертів.`
                      : `${projectGroup.length} experts will be attached to this project.`}
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <Button
                      className="w-full border border-brass/60 text-brass hover:bg-brass/10 bg-transparent font-semibold py-2.5 shadow-md"
                      onClick={() => {
                        showUnderDev(
                          locale === "uk"
                            ? "Збереження проєкту на стадії розробки."
                            : "Project saving is currently under development.",
                        );
                      }}
                    >
                      {locale === "uk" ? "Зберегти" : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setProjectFormOpen(false)}
                    >
                      {locale === "uk" ? "Назад до списку групи" : "Back to group"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>
      )}

      {/* ── GRAPH LEGEND BUTTON & FLOATING CARD ── ─ hidden when search/cabinet panels are open (otherwise overlaps) ─ */}
      {!searchOpen && !cabinetOpen && (
      <div className="fixed bottom-24 left-4 z-40 hidden sm:block">
        <button
          onClick={() => setLegendOpen(!legendOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-[#082422]/90 text-xs font-mono text-muted-foreground hover:text-foreground frosted-panel shadow-lg transition-all"
        >
          <Info className="h-3.5 w-3.5 text-primary" />
          <span>{locale === "uk" ? "Легенда графа" : "Graph Legend"}</span>
        </button>

        {legendOpen && (
          <div className="absolute bottom-10 left-0 w-80 p-4 rounded-xl border border-[rgba(200,144,26,0.3)] bg-[#082422]/95 frosted-panel shadow-2xl space-y-2.5 text-xs text-foreground/90">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="tech-label text-primary font-semibold">
                {locale === "uk" ? "Позначення вузлів" : "Node Symbology"}
              </span>
              <button onClick={() => setLegendOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 border-2 border-primary bg-primary/20 shrink-0" />
              <div>
                <strong className="text-foreground">{locale === "uk" ? "Квадрат" : "Square"}</strong>
                <p className="text-muted-foreground text-[11px] leading-tight">
                  {locale === "uk" ? "MVP Застосунок / Ролі спільноти (Hub)" : "MVP Application / Community roles (Hub)"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-[#3e91a2] bg-[#0b2422] shrink-0" />
              <div>
                <strong className="text-foreground">{locale === "uk" ? "Коло (Бірюзове)" : "Circle (Teal)"}</strong>
                <p className="text-muted-foreground text-[11px] leading-tight">
                  {locale === "uk" ? "Сервіси мережі / Тематичні напрями" : "Network services / Thematic tracks"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white bg-[#c8901a] shrink-0" />
              <div>
                <strong className="text-foreground">{locale === "uk" ? "Коло (Золоте)" : "Circle (Gold)"}</strong>
                <p className="text-muted-foreground text-[11px] leading-tight">
                  {locale === "uk" ? "Верифіковані експерти (досьє за кліком)" : "Verified experts (dossier on click)"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-0.5 bg-[#c8901a] shrink-0" />
              <div>
                <strong className="text-foreground">{locale === "uk" ? "Ребра зв'язку" : "Edges"}</strong>
                <p className="text-muted-foreground text-[11px] leading-tight">
                  {locale === "uk" ? "Залучення, робочі групи, співавторство" : "Outreach, working panels, authorship"}
                </p>
              </div>
            </div>
            <div className="pt-1.5 border-t border-border/60 text-[10.5px] text-muted-foreground italic">
              {locale === "uk"
                ? "Клік на сервісі підключає людей зовні; клік на вільному полі згортає панелі."
                : "Clicking a service links people outward; clicking empty canvas dismisses panels."}
            </div>
          </div>
        )}
      </div>
      )}

      {/* ── BOTTOM DOCK: 4 Steps (0 Briefing, 1 Search, 2 Configure, 3 Scope & Limits) ── */}
      <nav className="fixed bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] left-1/2 z-50 flex max-w-[calc(100vw-1rem)] -translate-x-1/2 items-center gap-1 rounded border border-border bg-panel/95 p-1.5 shadow-2xl frosted-panel">
        <Button
          asChild
          variant="ghost"
          className="h-14 min-w-18 max-w-24 flex-col gap-1 whitespace-normal px-2"
        >
          <Link to="/proposal">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="text-center text-[0.65rem] leading-tight text-muted-foreground">{copy.briefing}</span>
          </Link>
        </Button>

        <DockButton
          icon={Search}
          label={copy.search}
          active={searchOpen}
          controlsId="network-search-panel"
          onClick={() => {
            if (searchOpen) {
              setSearchOpen(false);
            } else {
              // Returning from configurator (serviceMode) → switch back to expert network graph.
              // Per user spec: 'Search button when returning from configurator should switch the graph
              // to search variant, not stay as service graph.'
              setDependenciesMode(false);
              setActiveServiceId(null);
              setSearchOpen(true);
              setCabinetOpen(false);
              setFocus(null);
              setGroupViewOpen(false);
            }
          }}
        />

        <DockButton
          icon={SlidersHorizontal}
          label={copy.cabinet}
          active={cabinetOpen}
          onClick={() => {
            if (cabinetOpen) {
              setCabinetOpen(false);
              setDependenciesMode(false);
              setActiveServiceId(null);
            } else {
              setCabinetOpen(true);
              setDependenciesMode(true);
              setSearchOpen(false);
              setFocus(null);
              setGroupViewOpen(false);
            }
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

      {/* ── ALL 9 SERVICES REVEALED INVITATION MODAL (8 services + central MVP) ── */}
      {allRevealedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 frosted-panel">
          <div className="w-full max-w-lg rounded-xl border border-[rgba(200,144,26,0.4)] bg-[#082422]/95 p-6 shadow-2xl frosted-panel">
            <p className="tech-label text-primary mb-1">
              {locale === "uk" ? "3 · Погодження та ліміти" : "3 · Scope & Limits"}
            </p>
            <h3 className="font-display text-xl font-semibold text-foreground">
              {locale === "uk"
                ? "Ви сягнули загальної кількості пропонованих сервісів (9 з 9 — 8 сервісів + MVP ядро)"
                : "You reached the total number of proposed services (9 of 9 — 8 services + MVP core)"}
            </h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {locale === "uk"
                ? "Всі операції мережі взаємопов'язані. Щоб продовжити роботу з графом — закрийте це вікно і натисніть 'Конфігуратор' у верхньому меню."
                : "All network operations are interconnected. To continue working with the graph — close this dialog and click 'Configurator' in the top menu."}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <Button asChild variant="outline" className="border-brass/50 text-brass hover:bg-brass/10">
                <Link to="/scope" onClick={() => setAllRevealedModalOpen(false)}>
                  {locale === "uk" ? "Перейти до погодження" : "Proceed to scope & limits"}
                </Link>
              </Button>
              <Button asChild className="border border-brass/60 text-brass hover:bg-brass/10 bg-transparent shadow-md">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    // 'Add another service' → opens Service Configuration Frame
                    // (describe service or functionality) — NOT configurator.
                    // Per user spec: '«Додати інший сервіс» (відкриває конфігуратор) -
                    //   НІ відкриває вікно опису сервісу.'
                    setAllRevealedModalOpen(false);
                    setCabinetOpen(true);
                    setDependenciesMode(true);
                    // Trigger the service frame to open after cabinet is shown
                    setTimeout(() => {
                      // Cabinet's internal state for serviceFrameOpen can't be controlled
                      // from here directly — but the cabinet's 'Describe service or functionality'
                      // button is now the FIRST block in the cabinet, prominent + high-contrast.
                      // User clicks it to open the form.
                      // For now we just close the modal + open cabinet.
                    }, 100);
                  }}
                >
                  {locale === "uk" ? "Додати інший сервіс" : "Add another service"}
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* ── REUSABLE 'UNDER DEVELOPMENT' MODAL (dark theme + blur backdrop + 2 buttons) ── */}
      {underDevAlert.open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 frosted-panel"
          onClick={() => setUnderDevAlert({ open: false, message: "" })}
        >
          <div
            className="w-full max-w-md rounded-xl border border-[rgba(200,144,26,0.45)] bg-[#082422]/95 p-6 shadow-2xl frosted-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="tech-label text-brass mb-2">
              {locale === "uk" ? "Стан функції" : "Feature status"}
            </p>
            <h3 className="font-display text-lg font-semibold text-foreground leading-snug">
              {underDevAlert.message}
            </h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {locale === "uk"
                ? "Цей елемент планується втілити після затвердження завдання."
                : "This element will be implemented after task approval."}
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <Button
                variant="outline"
                className="border-brass/50 text-brass hover:bg-brass/10"
                onClick={() => setUnderDevAlert({ open: false, message: "" })}
              >
                {locale === "uk" ? "Продовжити роботу з графом" : "Continue with graph"}
              </Button>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setUnderDevAlert({ open: false, message: "" })}
              >
                {locale === "uk" ? "До затвердження завдань" : "Until task approval"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function MetricBadge({ value, suffix = "", label, note }: { value: number; suffix?: string; label: string; note?: string }) {
  const display = value >= 1000 ? (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + "k" : String(value);
  return (
    <div className="bg-panel/80 px-3 py-1.5 min-w-[64px]">
      <p className="font-display text-base tabular-nums text-foreground leading-none">
        {display}{suffix}
      </p>
      <p className="tech-label text-[10px] truncate text-muted-foreground mt-0.5">
        {label}
        {note && <span className="opacity-60 ml-0.5">{note}</span>}
      </p>
    </div>
  );
}

function DockButton({
  icon: Icon,
  label,
  active,
  onClick,
  controlsId,
}: {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
  controlsId?: string;
}) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      aria-expanded={active}
      aria-controls={controlsId}
      className={`h-14 min-w-18 max-w-24 flex-col gap-1 whitespace-normal px-2 ${
        active ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
      }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span className="text-center text-[0.65rem] leading-tight">{label}</span>
    </Button>
  );
}
