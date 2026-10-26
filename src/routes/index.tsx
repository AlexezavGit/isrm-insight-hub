import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { FileText, Search, SlidersHorizontal, UserRound, X, Presentation } from "lucide-react";
import { useAccess } from "@/lib/access";
import { applyFilters, FilterBar, useFilters, EMPTY } from "@/lib/filters";
import { VerifyBadge } from "@/components/AppShell";
import { ClientConfiguration } from "@/components/ClientConfiguration";
import { ClientAccessibility } from "@/components/ClientAccessibility";
import { LanguageSwitcher } from "@/components/AppShell";
import { useClientDraft } from "@/components/ClientDraftProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { ServiceId } from "@/lib/client-catalog";
import type { GraphLayers } from "@/components/NetworkGraph";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const NetworkGraph = lazy(() => import("@/components/NetworkGraph"));

type IndexSearch = {
  view?: "map";
  panel?: "search";
  stage?: "configuration";
  preset?: string;
};

export const Route = createFileRoute("/")({
  beforeLoad: ({ search }) => {
    if (!search.view && !search.panel && !search.stage && !search.preset)
      throw redirect({ to: "/proposal" });
  },
  validateSearch: (search: Record<string, unknown>): IndexSearch => {
    const stage = search["stage"] === "configuration" ? ("configuration" as const) : undefined;
    const panel = !stage && search["panel"] === "search" ? ("search" as const) : undefined;
    const rawPreset = search["preset"];
    const preset = typeof rawPreset === "string" ? rawPreset : undefined;
    const result: IndexSearch = {};
    if (search["view"] === "map") result.view = "map";
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
  const { draft, update, ready } = useClientDraft();
  const [configTab, setConfigTab] = useState<"services" | "workflows">("services");
  const [activeService, setActiveService] = useState<string | null>(null);
  const [exploredServices, setExploredServices] = useState<ServiceId[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [groupOpen, setGroupOpen] = useState(false);
  const { panel, stage, preset } = Route.useSearch();
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
  useEffect(() => {
    if (stage === "configuration") {
      setCabinetOpen(true);
      setSearchOpen(false);
      setConfigTab(preset === "engagement" || preset === "expertise" ? "workflows" : "services");
    }
  }, [stage, preset]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const all = data?.experts ?? [];
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
          live: "Private ISRM network",
          title: "ISRM Ukraine",
          subtitle: "Supplied data · thematic links",
          coverage: "Expertise coverage",
          visible: "Visible experts",
          search: "1 · Search",
          cabinet: "2 · Configure",
          approval: "3 · Proposal & Budget",
          dossier: "Open dossier",
          send: "Add to group",
          close: "Close",
          layers: "Graph layers",
        }
      : {
          live: "Мережа ISRM · ДСП",
          title: "ISRM Ukraine",
          subtitle: "Передані дані · тематичні зв’язки",
          coverage: "Охоплення експертизи",
          visible: "Видимі експерти",
          search: "1 · Пошук",
          cabinet: "2 · Конфігурація",
          approval: "3 · Пропозиція й ціна",
          dossier: "Відкрити досьє",
          send: "Додати до групи",
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
              serviceMode={cabinetOpen || dependenciesMode}
              showExpertsOnServices={dependenciesMode}
              locale={locale}
              onVisibleCount={setVisibleCount}
              activeServiceIds={exploredServices}
              onServiceSelect={(id) => {
                setActiveService(id);
                setConfigTab("services");
                setCabinetOpen(true);
                setSearchOpen(false);
                setFocus(null);
              }}
              onFocus={(code) => {
                // Background click (code = null): close all panels
                if (code === null) {
                  setFocus(null);
                  setSearchOpen(false);
                  // In service/deps mode: keep cabinetOpen so service graph stays
                  // Only close cabinet if we were in pure people graph mode
                  setCabinetOpen(false);
                  setDependenciesMode(false);
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
        {!loading && mounted && !cabinetOpen && graphExperts.length === 0 && all.length > 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="rounded-lg border border-border bg-panel/90 p-6 shadow-xl backdrop-blur-xl max-w-sm">
              <p className="tech-label text-primary mb-2">
                {locale === "uk" ? "Збіг не знайдено" : "No match found"}
              </p>
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
              <MetricBadge value={visibleCount} label={locale === "uk" ? "видимо" : "visible"} />
              <MetricBadge value={list.length} label={locale === "uk" ? "знайдено" : "matched"} />
              <MetricBadge
                value={draft.shortlist.length}
                label={locale === "uk" ? "у групі" : "in group"}
              />
            </div>
          </div>
          <div className="pointer-events-auto shrink-0">
            <div className="pointer-events-auto flex flex-wrap justify-end gap-2">
              <ClientAccessibility />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
        {/* Mobile dashboard strip — switch content by mode */}
        <div className="pointer-events-auto mt-2 flex sm:hidden gap-px rounded border border-border bg-panel/70 backdrop-blur-xl overflow-hidden text-center">
          <MetricBadge value={visibleCount} label={locale === "uk" ? "видимо" : "visible"} />
          <MetricBadge value={list.length} label={locale === "uk" ? "знайдено" : "matched"} />
          <MetricBadge
            value={draft.shortlist.length}
            label={locale === "uk" ? "у групі" : "in group"}
          />
        </div>
      </header>

      {searchOpen && (
        <aside
          id="network-search-panel"
          className="absolute inset-x-0 bottom-[8rem] top-32 z-20 overflow-y-auto overscroll-contain border-b border-border bg-panel/95 p-4 shadow-2xl backdrop-blur-xl sm:bottom-28 sm:inset-y-auto sm:left-0 sm:top-28 sm:w-1/2 sm:max-w-[480px] sm:border-b-0 sm:border-r"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="tech-label text-primary">{t("search")}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(false)}
              aria-label={copy.close}
            >
              <X />
            </Button>
          </div>
          <FilterBar experts={all} f={f} setF={setF} compact showResearchQueue={false} />
          <Button className="mt-4 w-full" onClick={() => setSearchOpen(false)}>
            {locale === "uk" ? "Показати результати" : "Show results"}
          </Button>
          <div className="mt-5 border-t border-border pt-4">
            <p className="tech-label mb-2 text-muted-foreground">{copy.layers}</p>
            {(
              [
                ["sector", t("sectors"), "border-primary"],
                ["theme", t("themes"), "border-brass"],
                ["hub", t("hubs"), "border-success"],
                ["researchQueue", t("researchQueue"), "border-muted-foreground"],
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
          <div className="mt-4 grid gap-2">
            <Button asChild variant="outline">
              <Link to="/experts/$code" params={{ code: selected.code }}>
                {copy.dossier}
              </Link>
            </Button>
            <Button
              disabled={!ready}
              onClick={() =>
                update({
                  shortlist: draft.shortlist.includes(selected.code)
                    ? draft.shortlist.filter((id) => id !== selected.code)
                    : [...draft.shortlist, selected.code],
                })
              }
            >
              {draft.shortlist.includes(selected.code)
                ? locale === "uk"
                  ? "Прибрати з групи"
                  : "Remove from group"
                : copy.send}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setFocus(null);
                setGroupOpen(true);
              }}
            >
              {locale === "uk" ? "Переглянути групу" : "Review group"} ({draft.shortlist.length})
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {locale === "uk"
              ? "ДСП. Відбір зберігається тільки в цьому браузері."
              : "Confidential. Selection is saved only in this browser."}
          </p>
        </aside>
      )}

      <div
        className="client-graph-legend"
        aria-label={locale === "uk" ? "Легенда графа" : "Graph legend"}
      >
        <span>● {locale === "uk" ? "Профіль" : "Profile"}</span>
        <span>○ {locale === "uk" ? "Тема / сектор" : "Theme / sector"}</span>
        <span>□ {locale === "uk" ? "Хаб" : "Hub"}</span>
        <span>
          —{" "}
          {locale === "uk"
            ? "Тематична відповідність; не особиста рекомендація"
            : "Thematic match; not a personal endorsement"}
        </span>
      </div>
      <nav
        className="client-network-dock"
        aria-label={locale === "uk" ? "Навігація демонстрації" : "Demonstration navigation"}
      >
        <Link to="/proposal">
          <Presentation size={21} />
          <span>{locale === "uk" ? "Брифінг" : "Briefing"}</span>
        </Link>
        <button
          aria-pressed={searchOpen}
          onClick={() => {
            setSearchOpen(!searchOpen);
            setCabinetOpen(false);
            setDependenciesMode(false);
            setFocus(null);
          }}
        >
          <Search size={21} />
          <span>{locale === "uk" ? "Пошук" : "Search"}</span>
        </button>
        <button
          aria-pressed={cabinetOpen && configTab === "services"}
          onClick={() => {
            setCabinetOpen(true);
            setConfigTab("services");
            setSearchOpen(false);
            setDependenciesMode(false);
            setFocus(null);
          }}
        >
          <SlidersHorizontal size={21} />
          <span>{locale === "uk" ? "Сервіси" : "Services"}</span>
        </button>
        <button
          aria-pressed={cabinetOpen && configTab === "workflows"}
          onClick={() => {
            setCabinetOpen(true);
            setConfigTab("workflows");
            setSearchOpen(false);
            setDependenciesMode(false);
            setFocus(null);
          }}
        >
          <FileText size={21} />
          <span>Workflows</span>
        </button>
        <button
          onClick={() => {
            setGroupOpen(true);
            setFocus(null);
          }}
        >
          <UserRound size={21} />
          <span>
            {locale === "uk" ? "Група" : "Group"} ({draft.shortlist.length})
          </span>
        </button>
        <Link to="/scope" className="is-primary">
          <FileText size={21} />
          <span>{locale === "uk" ? "Обсяг і бюджет" : "Scope & budget"}</span>
        </Link>
      </nav>
      <ClientConfiguration
        open={cabinetOpen}
        onClose={() => setCabinetOpen(false)}
        tab={configTab}
        setTab={setConfigTab}
        activeService={activeService}
        onExplore={(ids) => {
          setExploredServices(ids);
          setDependenciesMode(true);
          setCabinetOpen(false);
          setFocus(null);
        }}
      />
      <Dialog open={groupOpen} onOpenChange={setGroupOpen}>
        <DialogContent className="client-request-dialog">
          <DialogHeader>
            <DialogTitle>
              {locale === "uk" ? "Локальна робоча група" : "Local working group"}
            </DialogTitle>
            <DialogDescription>
              {locale === "uk"
                ? "Робочий відбір на переданих даних. Нікого не запрошено й не призначено до проєкту."
                : "A working shortlist using supplied records. No invitation or project assignment has been made."}
            </DialogDescription>
          </DialogHeader>
          <label>
            {locale === "uk" ? "Назва / мета групи" : "Group name / purpose"}
            <input
              value={draft.groupName}
              onChange={(e) => update({ groupName: e.target.value })}
            />
          </label>
          <ul>
            {draft.shortlist.map((id) => (
              <li key={id} className="client-shortlist-row">
                <span>{all.find((e) => e.code === id)?.displayName || id}</span>
                <button
                  onClick={() =>
                    update({ shortlist: draft.shortlist.filter((code) => code !== id) })
                  }
                >
                  {locale === "uk" ? "Прибрати" : "Remove"}
                </button>
              </li>
            ))}
          </ul>
          {!draft.shortlist.length && (
            <p>
              {locale === "uk"
                ? "Оберіть профіль на графі або через каталог і додайте до групи."
                : "Choose a profile on the graph or in the directory and add it to the group."}
            </p>
          )}
          <Link to="/directory">
            {locale === "uk"
              ? "Каталог профілів для відбору з клавіатури"
              : "Browse the directory to select with a keyboard"}{" "}
            →
          </Link>
          <div className="client-inline-actions">
            <button
              className="client-button client-button-secondary"
              onClick={() => setGroupOpen(false)}
            >
              {locale === "uk" ? "Повернутись до графа" : "Back to graph"}
            </button>
            <Link to="/scope" className="client-button">
              {locale === "uk" ? "До підсумку" : "Review scope"}
            </Link>
          </div>
        </DialogContent>
      </Dialog>
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
function MetricBadge({
  value,
  suffix = "",
  label,
  note,
}: {
  value: number;
  suffix?: string;
  label: string;
  note?: string;
}) {
  const display =
    value >= 1000 ? (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + "k" : String(value);
  return (
    <div className="bg-panel/80 px-3 py-1.5 min-w-[64px]">
      <p className="font-display text-base tabular-nums text-foreground leading-none">
        {display}
        {suffix}
      </p>
      <p className="tech-label text-[10px] truncate text-muted-foreground mt-0.5">
        {label}
        {note ? <span className="opacity-60"> {note}</span> : null}
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
