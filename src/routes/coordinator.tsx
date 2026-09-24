import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { clearInbox, readInbox, useAccess, type InboxItem } from "@/lib/access";

export const Route = createFileRoute("/coordinator")({
  head: () => ({
    meta: [
      { title: "Кабінет координатора — ISRM Ukraine" },
      { name: "description", content: "Вхідні запити контактів та пропозиції від ЛПР для координатора мережі." },
      { property: "og:title", content: "Кабінет координатора — ISRM Ukraine" },
      { property: "og:description", content: "Черга запитів та відгуків координатора ISRM Ukraine." },
    ],
  }),
  component: Coordinator,
});

function Coordinator() {
  const { data } = useAccess();
  const [items, setItems] = useState<InboxItem[]>([]);
  useEffect(() => setItems(readInbox()), []);
  if (data?.level !== "coordinator")
    return (
      <main className="mx-auto max-w-lg px-5 py-24 text-center">
        <ShieldAlert className="mx-auto h-8 w-8 text-primary" />
        <h1 className="mt-4 font-display text-3xl">Доступ лише для координатора</h1>
        <p className="mt-2 text-muted-foreground">Натисніть «Розкрити дані» вгорі та введіть адміністративний пароль.</p>
      </main>
    );
  const e = data.experts;
  const stats = [
    ["Записів", e.length],
    ["Verified", e.filter((x) => x.verified).length],
    ["Потребують ідентифікації", e.filter((x) => x.identityStatus === "Unidentified").length],
    ["High priority", e.filter((x) => x.priority === "High").length],
  ];
  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Кабінет координатора</p>
      <h1 className="mt-1 font-display text-4xl">Вхідні та стан мережі</h1>
      <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded border border-border bg-border md:grid-cols-4">
        {stats.map(([l, v]) => (
          <div key={l} className="bg-card p-4"><p className="font-display text-3xl tabular-nums">{v}</p><p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{l}</p></div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-2xl">Черга ({items.length})</h2>
        {items.length > 0 && <button onClick={() => { clearInbox(); setItems([]); }} className="text-xs text-muted-foreground hover:text-destructive">Очистити</button>}
      </div>
      <ul className="mt-3 divide-y divide-border rounded border border-border">
        {items.length === 0 && <li className="p-6 text-sm text-muted-foreground">Поки немає запитів чи пропозицій.</li>}
        {items.map((i) => (
          <li key={i.id} className="p-4">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <span className={`rounded-sm px-1.5 py-0.5 uppercase ${i.kind === "contact" ? "bg-primary/15 text-primary" : "bg-chart-2/15 text-chart-2"}`}>{i.kind === "contact" ? "Запит контакту" : "Пропозиція"}</span>
              {i.target && <span>→ {i.target}</span>}
              {i.topic && <span>· {i.topic}</span>}
              <span className="ml-auto">{new Date(i.createdAt).toLocaleString("uk-UA")}</span>
            </div>
            <p className="mt-2 text-sm font-medium">{i.from}</p>
            <p className="mt-1 text-sm text-muted-foreground">{i.message}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
