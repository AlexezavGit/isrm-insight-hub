import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity, BellRing, Bot, BriefcaseBusiness, CalendarDays, ChevronRight,
  CircleDollarSign, FileSearch, Handshake, Library, Mail, Megaphone,
  MessageSquareText, Newspaper, Send, ShieldCheck, Star, Users, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

type Composer = "task" | "invite" | "alert" | null;

const SERVICES = [
  { icon: BriefcaseBusiness, title: "Projects & expert requests", purpose: "Turn an expertise need into a scoped project, matched team and controlled delivery.", role: "Join as lead, contributor or reviewer.", stage: 1 },
  { icon: Megaphone, title: "Recruitment campaigns", purpose: "Recruit experts through segmented outreach, social media and trusted messengers.", role: "Refer candidates, review profiles and join outreach.", stage: 1 },
  { icon: MessageSquareText, title: "Expert discussions", purpose: "Run private roundtables, collaborative research and structured consultations.", role: "Contribute evidence, moderate or author a synthesis.", stage: 1 },
  { icon: CalendarDays, title: "Meeting operations", purpose: "Manage access, agenda, attendance, materials and follow-up for online or in-person sessions.", role: "Host, attend or provide briefing materials.", stage: 1 },
  { icon: Newspaper, title: "Network intelligence", purpose: "A curated feed of network news, calls, opportunities and sector signals.", role: "Follow topics, submit a signal or respond to a call.", stage: 1 },
  { icon: BellRing, title: "Targeted alerts", purpose: "Reach verified expert groups by expertise and geography through controlled channels.", role: "Set preferences and answer time-sensitive calls.", stage: 1 },
  { icon: Bot, title: "AI & OSINT", purpose: "Prepare reviewed intelligence briefs, verification research and a network assistant.", role: "Request research, validate findings and attach them to work.", stage: 3 },
  { icon: Handshake, title: "Partner services", purpose: "Vetted operational support: legal, evacuation, local handling and equipment maintenance.", role: "Request, deliver or rate a trusted service.", stage: 2 },
  { icon: Library, title: "Knowledge repository", purpose: "Reuse permissioned project outputs, meeting materials and research reports.", role: "Search, request access or contribute an artifact.", stage: 2 },
  { icon: FileSearch, title: "Compliance & conflicts", purpose: "Check consent, NDA, disclosure and conflicts before sensitive participation.", role: "Maintain declarations and clear project eligibility.", stage: 1 },
  { icon: Star, title: "Trust & credentials", purpose: "Build a verified contribution record that improves matching and recommendations.", role: "Request endorsements and strengthen your dossier.", stage: 2 },
  { icon: Activity, title: "Consulting pipeline", purpose: "Convert targeted sector demand into qualified consulting leads and projects.", role: "Set availability, accept a lead and submit a scope.", stage: 2 },
] as const;

export function MemberCabinet({ open, onClose, onFindExpert }: { open: boolean; onClose: () => void; onFindExpert: () => void }) {
  const { locale } = useI18n();
  const [composer, setComposer] = useState<Composer>(null);
  const [sent, setSent] = useState(false);
  const [active, setActive] = useState(0);
  const copy = locale === "en" ? {
    eyebrow: "Member cabinet · demo profile", title: "Operations and network services", member: "Verified member", directory: "Expert directory", projects: "Active projects", billing: "Billing", free: "Membership · free", payg: "Premium services · pay as you go", stage: "Stage", purpose: "What it provides", role: "Your participation", explore: "Service proposal", actions: ["Create project task", "Invite to network", "Send targeted alert"], sent: "Demo message recorded in this browser.", close: "Close cabinet",
  } : {
    eyebrow: "Кабінет учасника · демо-профіль", title: "Операції та сервіси мережі", member: "Верифікований учасник", directory: "Реєстр експертів", projects: "Активні проєкти", billing: "Білінг", free: "Участь · безплатно", payg: "Преміальні сервіси · pay as you go", stage: "Етап", purpose: "Що надає", role: "Ваша участь", explore: "Опис сервісу", actions: ["Створити проєктну задачу", "Запросити до мережі", "Надіслати цільовий alert"], sent: "Демо-повідомлення збережено в цьому браузері.", close: "Закрити кабінет",
  };
  const service = SERVICES[active] ?? SERVICES[0];
  const stages = useMemo(() => ["Operational", "Service unification", "AI integration"], []);
  if (!open) return null;
  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto border-l border-border bg-panel/90 pb-24 backdrop-blur-2xl sm:max-w-xl">
      <header className="sticky top-0 z-10 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-border bg-panel/90 p-5 backdrop-blur-xl">
        <div className="min-w-0"><p className="tech-label text-primary">{copy.eyebrow}</p><h2 className="mt-1 truncate font-display text-2xl sm:text-3xl">{copy.title}</h2><p className="mt-1 text-sm text-muted-foreground">Alex Morgan · {copy.member}</p></div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label={copy.close} title={copy.close}><X /></Button>
      </header>

      <div className="space-y-7 p-4 sm:p-5">
        <section className="grid grid-cols-3 gap-px overflow-hidden rounded border border-border bg-border">
          <button onClick={onFindExpert} className="bg-card/80 p-3 text-left"><Users className="h-4 w-4 text-primary" /><p className="mt-3 font-display text-xl">178</p><p className="text-xs text-muted-foreground">{copy.directory}</p></button>
          <div className="bg-card/80 p-3"><BriefcaseBusiness className="h-4 w-4 text-brass" /><p className="mt-3 font-display text-xl">03</p><p className="text-xs text-muted-foreground">{copy.projects}</p></div>
          <div className="bg-card/80 p-3"><CircleDollarSign className="h-4 w-4 text-success" /><p className="mt-3 font-display text-base">€0</p><p className="text-xs text-muted-foreground">{copy.billing}</p></div>
        </section>

        <section>
          <p className="tech-label text-muted-foreground">Quick operations</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {copy.actions.map((label, i) => <Button key={label} variant="outline" onClick={() => { setSent(false); setComposer((["task", "invite", "alert"] as const)[i] ?? null); }} className="h-auto justify-start whitespace-normal py-3 text-left">{i === 2 ? <BellRing /> : i === 1 ? <Mail /> : <BriefcaseBusiness />}{label}</Button>)}
          </div>
        </section>

        <section>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3"><div className="min-w-0"><p className="tech-label text-primary">Service deck · {active + 1}/{SERVICES.length}</p><h3 className="mt-1 font-display text-2xl">Customisable network services</h3></div><div className="flex gap-1"><Button size="icon" variant="outline" onClick={() => setActive((active - 1 + SERVICES.length) % SERVICES.length)} aria-label="Previous">←</Button><Button size="icon" variant="outline" onClick={() => setActive((active + 1) % SERVICES.length)} aria-label="Next">→</Button></div></div>
          <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-3">
            {SERVICES.map((item, i) => <button key={item.title} onClick={() => setActive(i)} className={`min-h-32 w-48 shrink-0 snap-start rounded border p-4 text-left transition-colors ${i === active ? "border-primary bg-primary/10" : "border-border bg-card/65 hover:border-brass/60"}`}><item.icon className="h-5 w-5 text-primary" /><p className="mt-5 text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{copy.stage} {item.stage}</p></button>)}
          </div>
          <article className="blueprint-corners rounded border border-border bg-card/70 p-5">
            <div className="flex items-start justify-between gap-4"><service.icon className="h-6 w-6 text-primary" /><span className="tech-label text-brass">{stages[service.stage - 1]}</span></div>
            <h3 className="mt-5 font-display text-2xl">{service.title}</h3>
            <dl className="mt-5 space-y-4 text-sm"><div><dt className="tech-label text-muted-foreground">{copy.purpose}</dt><dd className="mt-1 leading-relaxed">{service.purpose}</dd></div><div><dt className="tech-label text-muted-foreground">{copy.role}</dt><dd className="mt-1 leading-relaxed">{service.role}</dd></div></dl>
            <Button asChild variant="outline" className="mt-5"><Link to="/proposal">{copy.explore}<ChevronRight /></Link></Button>
          </article>
        </section>

        <section className="grid gap-2 sm:grid-cols-2"><div className="rounded border border-success/40 bg-success/10 p-4"><p className="tech-label text-success">Member plan</p><p className="mt-2 font-medium">{copy.free}</p></div><div className="rounded border border-brass/40 bg-brass/10 p-4"><p className="tech-label text-brass">Service billing</p><p className="mt-2 font-medium">{copy.payg}</p></div></section>
      </div>
      {composer && <ComposerModal kind={composer} sent={sent} onSent={() => setSent(true)} onClose={() => setComposer(null)} onFindExpert={() => { setComposer(null); onFindExpert(); }} message={copy.sent} />}
    </aside>
  );
}

function ComposerModal({ kind, sent, onSent, onClose, onFindExpert, message }: { kind: Exclude<Composer, null>; sent: boolean; onSent: () => void; onClose: () => void; onFindExpert: () => void; message: string }) {
  const title = kind === "task" ? "Project task" : kind === "invite" ? "Network invitation" : "Targeted alert";
  return <div className="fixed inset-0 z-[60] grid place-items-center bg-background/65 p-4 backdrop-blur-sm" onClick={onClose}><form onSubmit={(e) => { e.preventDefault(); onSent(); }} onClick={(e) => e.stopPropagation()} className="blueprint-corners w-full max-w-lg rounded border border-primary/50 bg-panel p-5 shadow-2xl">
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3"><div><p className="tech-label text-primary">Demo composer</p><h3 className="mt-1 font-display text-2xl">{title}</h3></div><Button type="button" size="icon" variant="ghost" onClick={onClose}><X /></Button></div>
    {sent ? <p className="mt-6 rounded border border-success/40 bg-success/10 p-4 text-success">{message}</p> : <div className="mt-5 space-y-3">
      <input required placeholder={kind === "alert" ? "Expert group or geography" : "Recipient or project"} className="field" />
      <textarea required rows={5} defaultValue={kind === "task" ? "We invite you to review the project brief and confirm your availability, role and proposed next step." : kind === "invite" ? "You are invited to join the verified ISRM Ukraine expert network. Please review the trust and privacy protocol." : "Priority request: please confirm relevant experience and availability for a rapid expert response."} className="field" />
      <div className="flex flex-wrap gap-2"><Button type="button" variant="outline"><Mail />Email</Button><Button type="button" variant="outline"><MessageSquareText />Signal</Button><Button type="button" variant="ghost" onClick={onFindExpert}><Users />Find expert on map</Button></div>
      <Button className="w-full"><Send />Send demo</Button>
    </div>}
  </form></div>;
}