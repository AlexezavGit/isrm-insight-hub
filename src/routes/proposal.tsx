import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bot, Check, Cpu, Database, Layers3, Network, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/proposal")({
  head: () => ({ meta: [
    { title: "Network Services & Architecture — ISRM Ukraine" },
    { name: "description", content: "Service architecture, delivery roadmap and pricing for the ISRM Ukraine expert network platform." },
    { property: "og:title", content: "Network Services & Architecture — ISRM Ukraine" },
    { property: "og:description", content: "A controllable service system for a trusted and growing expert network." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Proposal,
});

const SERVICES = [
  ["Network map", "Live expertise coverage, trusted pathways and targeted expert discovery."],
  ["Projects & expert requests", "From a structured brief to matched participants, tasks and controlled delivery."],
  ["Campaigns & alerts", "Recruitment, targeted outreach and rapid alerts by expertise or geography."],
  ["Discussions & meetings", "Roundtables, research, agendas, access control and reusable materials."],
  ["Consulting pipeline", "Sector campaigns that convert demand into qualified member opportunities."],
  ["AI & OSINT", "Human-reviewed verification, intelligence briefs and an assistant for network work."],
  ["Partner operations", "Rated legal, evacuation, handling and equipment-maintenance support."],
  ["Trust, knowledge & billing", "Credentials, consent, reusable evidence and pay-as-you-go service accounting."],
] as const;

const LAYERS = [
  { icon: Database, code: "L1", title: "Trusted data foundation", tech: "Encrypted relational data · controlled imports · audit trail", value: "Verified dossiers, consent, provenance and scalable records beyond the initial 178 members." },
  { icon: ShieldCheck, code: "L2", title: "Identity & trust", tech: "Role-based access · privacy rules · trust scoring", value: "The right person sees the right detail; every disclosure and participation decision remains accountable." },
  { icon: Network, code: "L3", title: "Network intelligence", tech: "Graph engine · segmentation · matching", value: "Search by expertise, geography and relationships; reveal gaps, clusters and qualified teams." },
  { icon: Workflow, code: "L4", title: "Service orchestration", tech: "Projects · alerts · campaigns · meetings", value: "Turn insight into assignments, invitations, communications and measurable operational work." },
  { icon: Bot, code: "L5", title: "Controlled AI services", tech: "OSINT · retrieval · reviewed automation", value: "Research and recommendations remain permissioned, traceable and reviewed by network operators." },
  { icon: Cpu, code: "L6", title: "Member interfaces", tech: "Responsive web · integrations · MCP/API", value: "One consistent surface for members, coordinators, partners and approved software agents." },
] as const;

const STAGES = [
  { n: "01", title: "Operational product", subtitle: "Internal testing · onboarding · usability feedback", features: ["Live network map and expert dossiers", "Privacy protocol and trust index", "Expert requests, alerts and meeting operations", "Member onboarding and service feedback"] },
  { n: "02", title: "Service unification product", subtitle: "Connected workflows · internal billing", features: ["Projects, campaigns and consulting pipeline", "Knowledge repository and partner services", "Credentials, consent and conflict checks", "Pay-as-you-go billing and impact analytics"] },
  { n: "03", title: "AI service integration product", subtitle: "Controllable network growth", features: ["Reviewed OSINT and verification assistance", "Semantic matching and recommendation", "AI-supported briefings and network assistant", "War Room intelligence and governed integrations"] },
] as const;

const HINTS = [
  ["Privacy by default", "Guest views are anonymised before data reaches the browser."],
  ["Progressive disclosure", "Identity and contacts unlock only at an appropriate trust level."],
  ["Evidence over popularity", "Trust reflects verification, identity confidence and supporting evidence."],
  ["Consent before contact", "Participation and direct outreach remain controlled by the network protocol."],
  ["Human accountability", "AI and automation support decisions; verified people remain responsible."],
] as const;

function Proposal() {
  const { locale } = useI18n();
  const uk = locale === "uk";
  return <main className="min-h-screen pb-20">
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Button asChild variant="ghost"><Link to="/"><ArrowLeft />{uk ? "До мережі" : "Back to network"}</Link></Button>
      <header className="mt-8 max-w-4xl"><p className="tech-label text-primary">Service system · proposal</p><h1 className="mt-3 font-display text-4xl leading-tight sm:text-6xl">{uk ? "Цифрові сервіси для верифікованої мережі" : "Digital services for a verified network"}</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">{uk ? "Кожна функція платформи — кастомізований сервіс, що перетворює довіру мережі на керовану співпрацю, операції та цінність для учасників." : "Every platform capability is a customisable service that turns network trust into controlled collaboration, operations and member value."}</p></header>

      <section className="mt-14"><SectionTitle code="01" title={uk ? "Сервісна модель" : "Service model"} /><div className="mt-5 grid gap-px overflow-hidden rounded border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">{SERVICES.map(([title, desc]) => <article key={title} className="bg-card/75 p-5 backdrop-blur"><Sparkles className="h-5 w-5 text-primary" /><h3 className="mt-5 font-display text-xl">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p><p className="mt-5 tech-label text-brass">Custom scope · Pay as you go</p></article>)}</div></section>

      <section className="mt-16"><SectionTitle code="02" title={uk ? "П’ять принципів довіри" : "Five trust principles"} /><div className="mt-5 grid gap-3 lg:grid-cols-5">{HINTS.map(([title, desc], i) => <article key={title} className="blueprint-corners border border-border bg-card/65 p-4"><p className="font-display text-3xl text-primary">0{i + 1}</p><h3 className="mt-4 font-medium">{title}</h3><p className="mt-2 text-sm text-muted-foreground">{desc}</p></article>)}</div></section>

      <section className="mt-16"><SectionTitle code="03" title={uk ? "Шари сервісної архітектури" : "Service architecture layers"} /><div className="mt-6 space-y-2">{LAYERS.map((layer, i) => <article key={layer.code} className="grid gap-4 border border-border bg-card/70 p-5 backdrop-blur sm:grid-cols-[64px_1fr_1.2fr] sm:items-center"><div className="grid h-12 w-12 place-items-center border border-primary/50 text-primary"><layer.icon /></div><div><p className="tech-label text-brass">{layer.code} · {i === 0 ? "Foundation" : "Built on previous layers"}</p><h3 className="mt-1 font-display text-xl">{layer.title}</h3><p className="mt-1 font-mono text-xs text-muted-foreground">{layer.tech}</p></div><p className="text-sm leading-relaxed text-muted-foreground">{layer.value}</p></article>)}</div></section>

      <section className="mt-16"><SectionTitle code="04" title={uk ? "Timeline вводу сервісів" : "Service rollout timeline"} /><ol className="relative mt-8 space-y-8 before:absolute before:bottom-4 before:left-6 before:top-4 before:w-px before:bg-border sm:before:left-8">{STAGES.map((stage) => <li key={stage.n} className="relative grid gap-4 pl-16 sm:grid-cols-[220px_1fr] sm:pl-24"><span className="absolute left-0 grid h-12 w-12 place-items-center rounded-full border border-primary bg-background font-display text-lg text-primary sm:left-2">{stage.n}</span><div><p className="tech-label text-brass">Product stage</p><h3 className="mt-1 font-display text-2xl">{stage.title}</h3><p className="mt-1 text-sm text-muted-foreground">{stage.subtitle}</p></div><ul className="grid gap-2 sm:grid-cols-2">{stage.features.map((feature) => <li key={feature} className="flex gap-2 border border-border bg-card/65 p-3 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />{feature}</li>)}</ul></li>)}</ol></section>

      <section className="mt-16"><SectionTitle code="05" title={uk ? "Комерційна модель" : "Commercial model"} /><div className="mt-5 grid gap-3 lg:grid-cols-3">{[["Membership", "€0", "Verified participation, profile and core network access."], ["Operational services", "Pay as you go", "Projects, meetings, campaigns, research and partner support scoped to the task."], ["Platform development", "3 stages", "Investment follows unlocked service capability, governance and operational maturity."]].map(([title, value, text], i) => <article key={title} className={`border p-5 ${i === 1 ? "border-primary bg-primary/10" : "border-border bg-card/70"}`}><p className="tech-label text-muted-foreground">{title}</p><p className="mt-4 font-display text-3xl text-primary">{value}</p><p className="mt-3 text-sm text-muted-foreground">{text}</p></article>)}</div></section>
    </div>
  </main>;
}

function SectionTitle({ code, title }: { code: string; title: string }) { return <div className="flex items-center gap-3"><span className="tech-label text-primary">SHEET {code}</span><span className="h-px flex-1 bg-border" /><h2 className="font-display text-2xl sm:text-3xl">{title}</h2></div>; }