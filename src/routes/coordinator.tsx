import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { clearInbox, readInbox, useAccess, type InboxItem } from "@/lib/access";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/coordinator")({
  head: () => ({
    meta: [
      { title: "Member Cabinet — ISRM Ukraine" },
      { name: "description", content: "Member projects, expert requests, communications and network service operations." },
      { property: "og:title", content: "Member Cabinet — ISRM Ukraine" },
      { property: "og:description", content: "Operational workspace and network services for verified ISRM Ukraine members." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Coordinator,
});

function Coordinator() {
  const { data } = useAccess();
  const { locale } = useI18n();
  const c = locale === "uk" ? {
    restricted: "Доступ лише для координатора", unlock: "Натисніть «Розкрити дані» вгорі та введіть адміністративний пароль.", eyebrow: "Кабінет координатора", title: "Вхідні та стан мережі", queue: "Черга", clear: "Очистити", empty: "Поки немає запитів чи пропозицій.", contact: "Запит контакту", feedback: "Пропозиція", stats: ["Записів", "Verified", "Потребують ідентифікації", "High priority"]
  } : {
    restricted: "Coordinator access only", unlock: "Select “Reveal data” above and enter the coordinator password.", eyebrow: "Coordinator workspace", title: "Inbox and network status", queue: "Queue", clear: "Clear", empty: "There are no requests or proposals yet.", contact: "Contact request", feedback: "Proposal", stats: ["Records", "Verified", "Need identification", "High priority"]
  };
  const [items, setItems] = useState<InboxItem[]>([]);
  useEffect(() => setItems(readInbox()), []);
  if (data?.level !== "coordinator")
    return (
      <main className="mx-auto max-w-lg px-5 py-24 text-center">
        <ShieldAlert className="mx-auto h-8 w-8 text-primary" />
        <h1 className="mt-4 font-display text-3xl">{c.restricted}</h1>
        <p className="mt-2 text-muted-foreground">{c.unlock}</p>
      </main>
    );
  const e = data.experts;
  const stats = [
    [c.stats[0], e.length],
    [c.stats[1], e.filter((x) => x.verified).length],
    [c.stats[2], e.filter((x) => x.identityStatus === "Unidentified").length],
    [c.stats[3], e.filter((x) => x.priority === "High").length],
  ];
  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{c.eyebrow}</p>
      <h1 className="mt-1 font-display text-4xl">{c.title}</h1>
      <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded border border-border bg-border md:grid-cols-4">
        {stats.map(([l, v]) => (
          <div key={l} className="bg-card p-4"><p className="font-display text-3xl tabular-nums">{v}</p><p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{l}</p></div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-2xl">{c.queue} ({items.length})</h2>
        {items.length > 0 && <Button variant="ghost" size="sm" onClick={() => { clearInbox(); setItems([]); }} className="text-muted-foreground hover:text-destructive">{c.clear}</Button>}
      </div>
      <ul className="mt-3 divide-y divide-border rounded border border-border">
        {items.length === 0 && <li className="p-6 text-sm text-muted-foreground">{c.empty}</li>}
        {items.map((i) => (
          <li key={i.id} className="p-4">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <span className={`rounded-sm px-1.5 py-0.5 uppercase ${i.kind === "contact" ? "bg-primary/15 text-primary" : "bg-chart-2/15 text-chart-2"}`}>{i.kind === "contact" ? c.contact : c.feedback}</span>
              {i.target && <span>→ {i.target}</span>}
              {i.topic && <span>· {i.topic}</span>}
              <span className="sm:ml-auto">{new Date(i.createdAt).toLocaleString(locale === "uk" ? "uk-UA" : "en-GB")}</span>
            </div>
            <p className="mt-2 text-sm font-medium">{i.from}</p>
            <p className="mt-1 text-sm text-muted-foreground">{i.message}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
