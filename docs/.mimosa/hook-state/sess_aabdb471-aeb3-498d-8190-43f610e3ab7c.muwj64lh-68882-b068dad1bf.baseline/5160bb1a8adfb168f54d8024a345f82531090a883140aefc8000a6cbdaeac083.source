import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Lock, Moon, Sun, Unlock, ShieldCheck } from "lucide-react";
import { useAccess } from "@/lib/access";
import { checkAccess } from "@/lib/network.functions";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/#network", label: "Network" },
  { href: "/#future-features", label: "Future features" },
  { href: "/#proposal", label: "Proposal" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { data, setCode } = useAccess();
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [themeReady, setThemeReady] = useState(false);
  const level = data?.level ?? "guest";
  useEffect(() => {
    let savedTheme: string | null = null;
    try {
      savedTheme = window.localStorage.getItem("isrm-theme");
    } catch (error) {
      console.error("Could not read the saved theme preference.", error);
    }
    setTheme(savedTheme === "light" ? "light" : "dark");
    setThemeReady(true);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("theme-light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  useEffect(() => {
    if (!themeReady) return;
    try {
      window.localStorage.setItem("isrm-theme", theme);
    } catch (error) {
      console.error("Could not save the theme preference.", error);
    }
  }, [theme, themeReady]);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto grid min-h-14 max-w-[1600px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2 sm:flex sm:px-5">
          <Link to="/" className="flex min-w-0 items-baseline gap-2">
            <span className="font-display text-xl tracking-tight">ISRM</span>
            <span className="truncate font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Ukraine · Network
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              className="h-8 px-2"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
            </Button>
            <div className="flex rounded border border-border p-0.5" aria-label="Language">
              {(["uk", "en"] as const).map((code) => (
                <Button
                  key={code}
                  type="button"
                  variant={locale === code ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setLocale(code)}
                  className="h-7 px-2 font-mono text-[10px] uppercase"
                >
                  {code}
                </Button>
              ))}
            </div>
            <span className="hidden font-mono text-[11px] uppercase tracking-wider text-muted-foreground sm:inline">
              {level === "guest" ? t("anonymous") : data?.grantedBy}
            </span>
            {level === "guest" ? (
              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                size="sm"
                aria-label={t("reveal")}
                title={t("reveal")}
              >
                <Lock className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">{t("reveal")}</span>
              </Button>
            ) : (
              <Button
                onClick={() => setCode("")}
                variant="outline"
                size="sm"
                className="border-primary/50 bg-primary/10 text-primary"
              >
                {level === "coordinator" ? (
                  <ShieldCheck className="h-3.5 w-3.5" />
                ) : (
                  <Unlock className="h-3.5 w-3.5" />
                )}
                <span className="hidden lg:inline">{t("exitAccess")}</span>
              </Button>
            )}
          </div>
        </div>
      </header>
      {children}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-primary/30 bg-card/95 px-2 py-2 shadow-2xl backdrop-blur-md"
        aria-label="Primary navigation"
      >
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-1">
          {NAV.map((n, index) => (
            <a
              key={n.href}
              href={n.href}
              className="flex items-center justify-center gap-1 rounded-sm px-1 py-2 font-mono text-[10px] uppercase tracking-[0.04em] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:gap-2 sm:px-2 sm:tracking-[0.14em]"
            >
              <span className="text-primary">0{index + 1}</span>
              <span>{n.label}</span>
            </a>
          ))}
        </div>
      </nav>
      {open && <UnlockDialog onClose={() => setOpen(false)} />}
    </div>
  );
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-2xl"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
          {t("trustProtocol")}
        </p>
        <h2 className="mt-2 font-display text-2xl">{t("revealFull")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("accessHelp")}</p>
        <input
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="EXP-004 · ім'я · пароль"
          className="mt-5 w-full rounded border border-input bg-background px-3 py-2.5 font-mono text-sm outline-none focus:border-primary"
        />
        {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
        <div className="mt-3 rounded border border-dashed border-border p-3 font-mono text-[11px] text-muted-foreground">
          {t("demo")}: <span className="text-foreground">EXP-004</span> ·{" "}
          <span className="text-foreground">ISRM-COORD-2026</span>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" onClick={onClose} variant="ghost">
            {t("cancel")}
          </Button>
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
    <span className="inline-flex items-center gap-1 rounded-sm border border-success/40 bg-success/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-success">
      {t("verified")}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
      {t("researchQueue")}
    </span>
  );
}
