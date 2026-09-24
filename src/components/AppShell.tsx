import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Lock, Unlock, ShieldCheck } from "lucide-react";
import { useAccess } from "@/lib/access";
import { checkAccess } from "@/lib/network.functions";

const NAV = [
  { to: "/", label: "Мережа" },
  { to: "/directory", label: "Реєстр" },
  { to: "/proposal", label: "Артефакт-пропозиція" },
  { to: "/coordinator", label: "Кабінет координатора" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { data, setCode } = useAccess();
  const [open, setOpen] = useState(false);
  const level = data?.level ?? "guest";
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-8 px-5">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display text-xl tracking-tight">ISRM</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Ukraine · Network</span>
          </Link>
          <nav className="hidden gap-1 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="rounded px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden font-mono text-[11px] uppercase tracking-wider text-muted-foreground sm:inline">
              {level === "guest" ? "Знеособлений режим" : data?.grantedBy}
            </span>
            {level === "guest" ? (
              <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary">
                <Lock className="h-3.5 w-3.5" /> Розкрити дані
              </button>
            ) : (
              <button onClick={() => setCode("")} className="inline-flex items-center gap-2 rounded border border-primary/50 bg-primary/10 px-3 py-1.5 text-sm text-primary">
                {level === "coordinator" ? <ShieldCheck className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                Вийти з доступу
              </button>
            )}
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-border px-3 py-1 md:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }} className="whitespace-nowrap rounded px-2 py-1 text-xs text-muted-foreground" activeProps={{ className: "bg-secondary text-foreground" }}>
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
      {open && <UnlockDialog onClose={() => setOpen(false)} />}
    </div>
  );
}

function UnlockDialog({ onClose }: { onClose: () => void }) {
  const { setCode } = useAccess();
  const check = useServerFn(checkAccess);
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await check({ data: { code: val } });
    setBusy(false);
    if (r.level === "guest") return setErr("Код або ім'я рекомендодавця не підтверджено.");
    setCode(val);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Протокол довіри</p>
        <h2 className="mt-2 font-display text-2xl">Розкриття повних даних</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Введіть код або повне ім'я верифікованого рекомендодавця (рівень «Рекомендація» — імена, організації, публічні профілі) чи адміністративний пароль координатора (додатково — прямі контакти).
        </p>
        <input autoFocus value={val} onChange={(e) => setVal(e.target.value)} placeholder="EXP-004 · ім'я · пароль" className="mt-5 w-full rounded border border-input bg-background px-3 py-2.5 font-mono text-sm outline-none focus:border-primary" />
        {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
        <div className="mt-3 rounded border border-dashed border-border p-3 font-mono text-[11px] text-muted-foreground">
          Демо: рекомендодавець <span className="text-foreground">EXP-004</span> · координатор <span className="text-foreground">ISRM-COORD-2026</span>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Скасувати</button>
          <button disabled={busy || !val} className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">{busy ? "Перевірка…" : "Підтвердити"}</button>
        </div>
      </form>
    </div>
  );
}

export function TrustBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-16 overflow-hidden rounded bg-secondary">
        <div className="h-full bg-primary" style={{ width: `${value}%` }} />
      </div>
      <span className="font-mono text-xs tabular-nums text-muted-foreground">{value}</span>
    </div>
  );
}

export function VerifyBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="inline-flex items-center gap-1 rounded-sm border border-success/40 bg-success/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-success">Verified</span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Черга ресерчу</span>
  );
}
