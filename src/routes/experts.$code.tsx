import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Lock, Send } from "lucide-react";
import { pushInbox, useAccess } from "@/lib/access";
import { TrustBar, VerifyBadge } from "@/components/AppShell";

export const Route = createFileRoute("/experts/$code")({
  head: ({ params }) => ({
    meta: [
      { title: `Досьє ${params.code} — ISRM Ukraine` },
      { name: "description", content: `Профіль експерта ${params.code}: рівень довіри, компетенції, безпечний запит контакту.` },
      { property: "og:title", content: `Досьє ${params.code} — ISRM Ukraine` },
      { property: "og:description", content: "Профіль експерта закритої мережі ISRM Ukraine." },
    ],
  }),
  component: Dossier,
});

function Dossier() {
  const { code } = Route.useParams();
  const { data, loading } = useAccess();
  const e = data?.experts.find((x) => x.code === code);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [from, setFrom] = useState("");
  const [msg, setMsg] = useState("");
  if (loading) return <p className="p-10 font-mono text-xs text-muted-foreground">Завантаження…</p>;
  if (!e) return <p className="p-10">Запис не знайдено.</p>;
  const guest = data?.level === "guest";
  const breakdown = [
    ["Верифікація профілю", e.verified ? "Так" : "Ні"],
    ["Статус ідентичності", e.identityStatus],
    ["Впевненість співставлення", e.confidence],
    ["Доказова база", e.evidence],
    ["Етап CRM", e.crmStage],
    ["Пріоритет", e.priority],
  ];
  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <Link to="/directory" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Реєстр</Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="font-mono text-xs text-primary">{e.code} · ДОСЬЄ</p>
          <h1 className="mt-2 font-display text-4xl leading-tight md:text-5xl">{e.displayName}</h1>
          {e.organization ? (
            <p className="mt-2 text-muted-foreground">{e.role} · {e.organization}</p>
          ) : guest ? (
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground"><Lock className="h-3.5 w-3.5" /> Ідентичність приховано протоколом приватності</p>
          ) : null}
          <div className="mt-4 flex flex-wrap items-center gap-3"><VerifyBadge verified={e.verified} /><span className="text-sm text-muted-foreground">{e.sector} · {e.country}</span></div>

          <section className="mt-10 space-y-6">
            {[
              ["Ключова експертиза", e.primaryExpertise],
              ["Український досвід", e.ukraineTheme],
              ["Тема кейсу", e.caseTheme],
              ["Міжнародна релевантність", e.internationalRelevance],
              ["Потенційний внесок в ISRM", e.contribution],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="border-t border-border pt-4">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{k}</h3>
                  <p className="mt-1.5 text-lg leading-relaxed">{v}</p>
                </div>
              ))}
            <div className="border-t border-border pt-4">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Компетенції</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {e.tags.map((t) => <span key={t} className="rounded-sm border border-border px-2 py-1 text-xs">{t}</span>)}
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded border border-border bg-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Індекс довіри</p>
            <p className="mt-1 font-display text-5xl tabular-nums text-primary">{e.trust}<span className="text-lg text-muted-foreground">/100</span></p>
            <div className="mt-2"><TrustBar value={e.trust} /></div>
            <dl className="mt-4 space-y-2 text-sm">
              {breakdown.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{k}</dt><dd className="text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded border border-border bg-card p-5 text-sm">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Контакти</p>
            {e.phone ? <p className="mt-2 font-mono">{e.phone}</p> : <p className="mt-2 text-muted-foreground">Прямі контакти доступні лише координатору.</p>}
            {e.linkedin && <a href={e.linkedin} target="_blank" rel="noreferrer" className="mt-1 block truncate text-primary">LinkedIn профіль</a>}
            {e.sensitivity && <p className="mt-2 text-xs text-muted-foreground">{e.sensitivity}</p>}
          </div>
          {sent ? (
            <p className="rounded border border-success/40 bg-success/10 p-4 text-sm text-success">Запит передано координатору. Він зв'яжеться з експертом та поверне відповідь.</p>
          ) : open ? (
            <form
              onSubmit={(ev) => {
                ev.preventDefault();
                pushInbox({ kind: "contact", target: e.code, from, message: msg });
                setSent(true);
              }}
              className="space-y-2 rounded border border-primary/40 bg-card p-4"
            >
              <input required value={from} onChange={(x) => setFrom(x.target.value)} placeholder="Ваше ім'я та організація" className="w-full rounded border border-input bg-background px-3 py-2 text-sm" />
              <textarea required value={msg} onChange={(x) => setMsg(x.target.value)} rows={4} placeholder="Мета контакту, контекст, терміни" className="w-full rounded border border-input bg-background px-3 py-2 text-sm" />
              <button className="inline-flex w-full items-center justify-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Send className="h-4 w-4" />Надіслати координатору</button>
            </form>
          ) : (
            <button onClick={() => setOpen(true)} className="w-full rounded bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">Безпечний запит контакту</button>
          )}
          <p className="text-xs text-muted-foreground">Контакт встановлюється лише через координатора ISRM — експерт дає згоду до розкриття даних.</p>
        </aside>
      </div>
    </main>
  );
}
