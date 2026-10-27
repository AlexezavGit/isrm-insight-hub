import { useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { LogIn, LogOut, ShieldCheck } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { useAccess } from "@/lib/access";
import { checkAccess } from "@/lib/network.functions";
import { useI18n } from "@/lib/i18n";
import { useClientDraft } from "./ClientDraftProvider";
import { Button } from "@/components/ui/button";

/** Standalone language toggle — renders EN / UK buttons. */
export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  return (
    <div
      className="flex items-center gap-0.5 rounded border border-border bg-panel/75 p-1 backdrop-blur-xl"
      role="group"
      aria-label="Page language"
    >
      {(["en", "uk"] as const).map((code) => (
        <Button
          key={code}
          variant={locale === code ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className="h-7 px-2 font-mono text-[10px] uppercase"
        >
          {code}
        </Button>
      ))}
    </div>
  );
}

/**
 * Root shell — wraps every page.
 * On the home page ("/") AccessControl already contains LanguageSwitcher, so
 * we only render the floating global switcher on all other routes.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { error, reset, draft, backup } = useClientDraft();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Pages with their own language switcher in their own header
  const PAGES_WITH_OWN_SWITCHER = ["/", "/proposal", "/partner", "/partner-finance", "/scope"];
  const showGlobal = !PAGES_WITH_OWN_SWITCHER.some(
    (pg) => pathname === pg || pathname.startsWith(pg + "/"),
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showGlobal && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-end p-3 sm:p-4">
          <div className="pointer-events-auto">
            <AccessControl />
          </div>
        </div>
      )}
      {error && (
        <div className="client-storage-error" role="alert">
          <p>{error}</p>
          <button
            onClick={() => {
              const blob = new Blob(
                [JSON.stringify({ retained: backup, currentDraft: draft }, null, 2)],
                {
                  type: "text/plain",
                },
              );
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "ISRM-stored-draft.txt";
              a.click();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }}
          >
            Download stored draft
          </button>
          <button onClick={reset}>Start a new draft</button>
        </div>
      )}
      {children}
    </div>
  );
}

export function AccessControl({ showSignIn = true }: { showSignIn?: boolean }) {
  const { data, setCode } = useAccess();
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const level = data?.level ?? "guest";
  return (
    <>
      <div className="flex items-center gap-1 rounded border border-border bg-panel/75 p-1 backdrop-blur-xl">
        {(["en", "uk"] as const).map((code) => (
          <Button
            key={code}
            variant={locale === code ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setLocale(code)}
            aria-pressed={locale === code}
            className="h-7 px-2 font-mono text-[10px] uppercase"
          >
            {code}
          </Button>
        ))}
        {!showSignIn ? null : level === "guest" ? (
          <Button
            onClick={() => setOpen(true)}
            size="sm"
            className="client-member-signin"
            aria-label={locale === "uk" ? "Увійти в кабінет" : "Member sign in"}
            title={locale === "uk" ? "Увійти в кабінет" : "Member sign in"}
          >
            <LogIn />
            <span>{locale === "uk" ? "Увійти в кабінет" : "Member sign in"}</span>
          </Button>
        ) : (
          <Button
            onClick={() => setCode("")}
            variant="outline"
            size="sm"
            className="border-primary/60 bg-primary/10 text-primary"
          >
            {level === "coordinator" ? <ShieldCheck /> : <LogOut />}
            <span className="hidden sm:inline">{locale === "uk" ? "Вийти" : "Sign out"}</span>
          </Button>
        )}
      </div>
      {open && <UnlockDialog onClose={() => setOpen(false)} />}
    </>
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
    try {
      const r = await check({ data: { code: val } });
      if (r.level === "guest") return setErr(t("invalidAccess"));
      setCode(val);
      onClose();
    } catch {
      setErr(t("accessUnavailable"));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-label={t("revealFull")}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
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
          type="password"
          autoComplete="current-password"
          aria-label={t("accessPassword")}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="mt-5 w-full rounded border border-input bg-background px-3 py-2.5 font-mono text-sm outline-none focus:border-primary"
        />
        {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
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
