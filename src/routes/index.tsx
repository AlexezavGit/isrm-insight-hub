import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { ExternalLink, MapPinned, Search, SlidersHorizontal, UserRound, X } from "lucide-react";
import { useAccess } from "@/lib/access";
import { applyFilters, FilterBar, useFilters } from "@/lib/filters";
import { AccessControl, TrustBar, VerifyBadge } from "@/components/AppShell";
import { MemberCabinet } from "@/components/MemberCabinet";
import type { GraphLayers } from "@/components/NetworkGraph";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const NetworkGraph = lazy(() => import("@/components/NetworkGraph"));

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "ISRM Ukraine — Live Expert Network" },
    { name: "description", content: "A live, privacy-aware map of verified expertise, sectors and network services." },
    { property: "og:title", content: "ISRM Ukraine — Live Expert Network" },
    { property: "og:description", content: "Explore the live expert network, trust signals and operational services." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: NetworkPage,
});

function NetworkPage() {
  const { data, loading } = useAccess();
  const { locale, t } = useI18n();
  const [f, setF] = useFilters();
  const [focus, setFocus] = useState<string | null>(null);
  const [layers, setLayers] = useState<GraphLayers>({ sector: true, theme: true, hub: true });
  const [searchOpen, setSearchOpen] = useState(true);
  const [cabinetOpen, setCabinetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const all = data?.experts ?? [];
  const list = useMemo(() => applyFilters(all, f), [all, f]);
  const selected = all.find((expert) => expert.code === focus);
  const verified = list.filter((expert) => expert.verified).length;
  const coverage = Math.round((new Set(list.filter((expert) => expert.sector !== "Unclassified").map((expert) => expert.sector)).size / Math.max(1, new Set(all.filter((expert) => expert.sector !== "Unclassified").map((expert) => expert.sector)).size)) * 100);
  const copy = locale === "en" ? { live: "Network live", title: "ISRM Ukraine", subtitle: "Expert network command surface", coverage: "Expertise coverage", visible: "Visible experts", search: "Search", cabinet: "Cabinet", war: "War Room", dossier: "Open dossier", send: "Send to project", close: "Close", layers: "Graph layers" } : { live: "Мережа наживо", title: "ISRM Ukraine", subtitle: "Командна поверхня експертної мережі", coverage: "Охоплення експертизи", visible: "Видимі експерти", search: "Пошук", cabinet: "Кабінет", war: "War Room", dossier: "Відкрити досьє", send: "До проєкту", close: "Закрити", layers: "Шари графа" };

  return <main className="relative h-[100svh] min-h-[640px] overflow-hidden">
    <section className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-card),transparent_68%)]">
      {mounted && !loading && <Suspense fallback={null}><NetworkGraph experts={list} layers={layers} focus={focus} onFocus={(code) => code?.startsWith("S:") || code?.startsWith("T:") || code?.startsWith("H:") || code === "P:queue" ? undefined : setFocus(code)} /></Suspense>}
      {loading && <p className="absolute inset-0 grid place-items-center tech-label text-muted-foreground">{t("loading")}</p>}
    </section>

    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 p-3 sm:p-5">
      <div className="min-w-0"><div className="inline-flex items-center gap-2 rounded border border-border bg-panel/70 px-3 py-2 backdrop-blur-xl"><span className="h-2 w-2 animate-pulse rounded-full bg-success" /><span className="tech-label text-success">{copy.live}</span><span className="hidden h-4 w-px bg-border sm:block" /><span className="hidden truncate font-display text-sm sm:block">{copy.title} · {copy.subtitle}</span></div></div>
      <div className="pointer-events-auto shrink-0"><AccessControl /></div>
    </header>

    {searchOpen && <aside className="absolute inset-x-3 top-16 z-20 max-h-[52svh] overflow-y-auto rounded border border-border bg-panel/78 p-4 shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:left-5 sm:top-20 sm:max-h-[calc(100svh-11rem)] sm:w-[310px]">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3"><div><p className="tech-label text-primary">{t("networkSlice")}</p><h1 className="mt-1 font-display text-2xl">{copy.visible}</h1></div><Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)} aria-label={copy.close}><X /></Button></div>
      <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded border border-border bg-border text-center">
        <Metric value={list.length} label={t("nodes")} /><Metric value={verified} label={t("verified")} /><Metric value={coverage} suffix="%" label={copy.coverage} />
      </div>
      <div className="mt-3"><div className="flex justify-between tech-label text-muted-foreground"><span>{t("verified")}</span><span>{verified} → {list.length - verified}</span></div><div className="mt-2 flex h-1.5 overflow-hidden rounded bg-muted"><div className="bg-success transition-all duration-700" style={{ width: `${list.length ? (verified / list.length) * 100 : 0}%` }} /><div className="bg-brass/70 transition-all duration-700" style={{ width: `${list.length ? ((list.length - verified) / list.length) * 100 : 0}%` }} /></div></div>
      <div className="mt-5"><FilterBar experts={all} f={f} setF={setF} compact /></div>
      <div className="mt-5 border-t border-border pt-4"><p className="tech-label mb-2 text-muted-foreground">{copy.layers}</p>{([ ["sector", t("sectors"), "border-primary"], ["theme", t("themes"), "border-brass"], ["hub", t("hubs"), "border-success"] ] as const).map(([key, label, color]) => <label key={key} className="flex cursor-pointer items-center gap-2 py-1.5 text-sm"><input type="checkbox" checked={layers[key]} onChange={(event) => setLayers({ ...layers, [key]: event.target.checked })} className="accent-primary" /><span className={`h-2.5 w-2.5 rounded-full border-2 ${color}`} />{label}</label>)}</div>
    </aside>}

    {selected && <aside className="blueprint-corners absolute bottom-24 left-3 right-3 z-20 rounded border border-border bg-panel/82 p-4 shadow-2xl backdrop-blur-xl sm:left-auto sm:right-5 sm:w-[330px]">
      <button onClick={() => setFocus(null)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground" aria-label={copy.close}><X className="h-4 w-4" /></button>
      <p className="tech-label text-primary">{selected.code} · {data?.level === "guest" ? t("aliases") : t("fullData")}</p><h2 className="mt-2 pr-7 font-display text-2xl leading-tight">{selected.displayName}</h2>{selected.organization && <p className="mt-1 text-sm text-muted-foreground">{selected.role} · {selected.organization}</p>}
      <div className="mt-3 flex items-center gap-3"><VerifyBadge verified={selected.verified} /><TrustBar value={selected.trust} /></div><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{selected.primaryExpertise}</p>
      <div className="mt-4 grid grid-cols-2 gap-2"><Button asChild variant="outline"><Link to="/experts/$code" params={{ code: selected.code }}>{copy.dossier}</Link></Button><Button onClick={() => { setCabinetOpen(true); }}>{copy.send}</Button></div>
    </aside>}

    <nav className="absolute bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded border border-border bg-panel/88 p-1.5 shadow-2xl backdrop-blur-2xl">
      <DockButton icon={Search} label={copy.search} active={searchOpen} onClick={() => { setSearchOpen(!searchOpen); setCabinetOpen(false); }} />
      <DockButton icon={UserRound} label={copy.cabinet} active={cabinetOpen} onClick={() => { setCabinetOpen(true); setSearchOpen(false); }} />
      <Button asChild variant="ghost" className="h-14 min-w-20 flex-col gap-1 px-3"><a href="https://worldmonitor.app/" target="_blank" rel="noreferrer"><MapPinned className="h-5 w-5" /><span className="text-xs">{copy.war}</span><ExternalLink className="absolute right-1 top-1 h-2.5 w-2.5" /></a></Button>
    </nav>
    <MemberCabinet open={cabinetOpen} onClose={() => setCabinetOpen(false)} onFindExpert={() => { setCabinetOpen(false); setSearchOpen(true); }} />
  </main>;
}

function Metric({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) { return <div className="bg-card/75 p-2.5"><p className="font-display text-2xl tabular-nums text-foreground">{value}{suffix}</p><p className="tech-label truncate text-muted-foreground">{label}</p></div>; }
function DockButton({ icon: Icon, label, active, onClick }: { icon: typeof SlidersHorizontal; label: string; active: boolean; onClick: () => void }) { return <Button variant={active ? "secondary" : "ghost"} onClick={onClick} className="h-14 min-w-20 flex-col gap-1 px-3"><Icon className={active ? "text-primary" : "text-muted-foreground"} /><span className="text-xs">{label}</span></Button>; }