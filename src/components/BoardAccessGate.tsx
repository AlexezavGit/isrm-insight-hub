import { useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useRouterState } from "@tanstack/react-router";
import { LockKeyhole } from "lucide-react";
import { useAccess } from "@/lib/access";
import { checkAccess } from "@/lib/network.functions";
import { useI18n } from "@/lib/i18n";
export function BoardAccessGate({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data, loading, setCode } = useAccess();
  const { locale, setLocale } = useI18n();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const verify = useServerFn(checkAccess);
  const uk = locale === "uk";
  if (
    !["/", "/proposal", "/scope", "/directory"].includes(pathname) &&
    !pathname.startsWith("/experts/")
  )
    return children;
  if (data?.level === "referral" || data?.level === "coordinator")
    return (
      <>
        {children}
        <button className="client-close-session" onClick={() => setCode("")}>
          {uk ? "Закрити приватний сеанс" : "Close private session"}
        </button>
      </>
    );
  return (
    <main className="client-board-gate">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          try {
            const result = await verify({ data: { code: password } });
            if (result.level === "guest") {
              setError(uk ? "Пароль не прийнято." : "The password was not accepted.");
            } else {
              setCode(password);
              setPassword("");
            }
          } catch {
            setError(
              uk
                ? "Не вдалося перевірити доступ. Спробуйте ще раз."
                : "Access could not be checked. Please try again.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <LockKeyhole size={30} />
        <p className="client-eyebrow">
          ISRM · {uk ? "Для службового користування" : "Private board briefing"}
        </p>
        <h1>{uk ? "Для Девіда та правління ISRM" : "For David and the ISRM Board"}</h1>
        <p>
          {uk
            ? "Робоча мережа на основі переданих матеріалів. Імена, профілі та зв’язки доступні лише після перевірки пароля."
            : "A working network built from the supplied materials. Names, profiles and relationships are available only after the password is verified."}
        </p>
        <label>
          {uk ? "Пароль доступу" : "Access password"}
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="client-button" disabled={busy || loading}>
          {busy || loading
            ? uk
              ? "Перевірка…"
              : "Checking…"
            : uk
              ? "Відкрити брифінг"
              : "Open the briefing"}
        </button>
        {error && <p role="alert">{error}</p>}
        <p className="client-note">
          {uk
            ? "Конфіденційно · Не поширювати посилання та пароль. OSINT ще не підключено."
            : "Confidential · Please do not forward the link or password. OSINT is not yet connected."}
        </p>
        <div className="client-language">
          <button type="button" aria-pressed={!uk} onClick={() => setLocale("en")}>
            EN
          </button>
          <button type="button" aria-pressed={uk} onClick={() => setLocale("uk")}>
            UA
          </button>
        </div>
      </form>
    </main>
  );
}
