import { useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { LogIn, LogOut, ShieldCheck } from "lucide-react";
import { useAccess } from "@/lib/access";
import { checkAccess } from "@/lib/network.functions";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-background text-foreground">{children}</div>;
}

export function AccessControl() {
  const { data, setCode } = useAccess();
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const level = data?.level ?? "guest";
  return <><div className="flex items-center gap-1 rounded border border-border bg-panel/75 p-1 backdrop-blur-xl">
    {(["en", "uk"] as const).map((code) => <Button key={code} variant={locale === code ? "secondary" : "ghost"} size="sm" onClick={() => setLocale(code)} className="h-7 px-2 font-mono text-[10px] uppercase">{code}</Button>)}
    {level === "guest" ? <Button onClick={() => setOpen(true)} size="sm"><LogIn />Sign in</Button> : <Button onClick={() => setCode("")} variant="outline" size="sm" className="border-primary/60 bg-primary/10 text-primary">{level === "coordinator" ? <ShieldCheck /> : <LogOut />}<span className="hidden sm:inline">Sign out</span></Button>}
  </div>{open && <UnlockDialog onClose={() => setOpen(false)} />}</>;
}

function UnlockDialog({ onClose }: { onClose: () => void }) {
  const { setCode } = useAccess();
  const { t } = useI18n();
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
    if (r.level === "guest") return setErr(t("invalidAccess"));
    setCode(val);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">{t("trustProtocol")}</p>
        <h2 className="mt-2 font-display text-2xl">{t("revealFull")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("accessHelp")}</p>
        <input autoFocus value={val} onChange={(e) => setVal(e.target.value)} placeholder="EXP-004 · ім'я · пароль" className="mt-5 w-full rounded border border-input bg-background px-3 py-2.5 font-mono text-sm outline-none focus:border-primary" />
        {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
        <div className="mt-3 rounded border border-dashed border-border p-3 font-mono text-[11px] text-muted-foreground">
          {t("demo")}: <span className="text-foreground">EXP-004</span>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" onClick={onClose} variant="ghost">{t("cancel")}</Button>
          <Button disabled={busy || !val}>{busy ? t("checking") : t("confirm")}</Button>
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
  const { t } = useI18n();
  return verified ? (
    <span className="inline-flex items-center gap-1 rounded-sm border border-success/40 bg-success/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-success">{t("verified")}</span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t("researchQueue")}</span>
  );
}
