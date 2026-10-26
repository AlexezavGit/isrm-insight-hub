import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Lock, Send } from "lucide-react";
import { pushInbox, useAccess } from "@/lib/access";
import { VerifyBadge } from "@/components/AppShell";
import { useI18n } from "@/lib/i18n";
import { useClientDraft } from "@/components/ClientDraftProvider";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/experts/$code")({
  head: () => ({
    meta: [
      { title: "Private expert dossier — ISRM" },
      { name: "description", content: "Private ISRM board review." },
      { property: "og:title", content: "Private expert dossier — ISRM" },
      {
        property: "og:description",
        content: "A privacy-aware expert profile in the ISRM Ukraine network.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dossier,
});

function Dossier() {
  const { code } = Route.useParams();
  const { data, loading } = useAccess();
  const { draft, update, ready } = useClientDraft();
  const { locale, t } = useI18n();
  const uk = locale === "uk";
  const e = data?.experts.find((x) => x.code === code);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [from, setFrom] = useState("");
  const [msg, setMsg] = useState("");
  if (loading)
    return <p className="p-10 font-mono text-xs text-muted-foreground">{t("loading")}</p>;
  if (!e) return <p className="p-10">{t("records")} — 0</p>;
  const guest = data?.level === "guest";
  const breakdown = [
    [
      uk ? "Верифікація профілю" : "Profile verification",
      e.verified ? (uk ? "Так" : "Yes") : uk ? "Ні" : "No",
    ],
    [uk ? "Статус ідентичності" : "Identity status", e.identityStatus],
    [t("matchConfidence"), e.confidence],
    [uk ? "Доказова база · вихідне поле" : "Evidence basis · source field", e.evidence],
    [uk ? "Етап CRM · вихідне поле" : "CRM stage · source field", e.crmStage],
    [uk ? "Пріоритет · вихідне поле" : "Priority · source field", e.priority],
  ];
  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <Link
        to="/"
        search={{ view: "map" }}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {t("backDirectory")}
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="font-mono text-xs text-primary">
            {e.code} · {t("dossier")}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {uk
              ? "ДСП · Профіль із переданої ISRM бази. Дані потребують своєчасного оновлення."
              : "Confidential · Profile from the supplied ISRM dataset. Information requires timely review."}
          </p>
          <Button
            className="mt-3"
            disabled={!ready}
            onClick={() =>
              update({
                shortlist: draft.shortlist.includes(code)
                  ? draft.shortlist.filter((id) => id !== code)
                  : [...draft.shortlist, code],
              })
            }
          >
            {draft.shortlist.includes(code)
              ? uk
                ? "Прибрати з локальної групи"
                : "Remove from local group"
              : uk
                ? "Додати до локальної групи"
                : "Add to local group"}
          </Button>
          <h1 className="mt-2 break-words font-display text-4xl leading-tight md:text-5xl">
            {e.displayName}
          </h1>
          {e.organization ? (
            <p className="mt-2 text-muted-foreground">
              {e.role} · {e.organization}
            </p>
          ) : guest ? (
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-3.5 w-3.5" /> {t("hiddenIdentity")}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <VerifyBadge verified={e.verified} />
            <span className="text-sm text-muted-foreground">
              {e.sector} · {e.country}
            </span>
          </div>

          <section className="mt-10 space-y-6">
            {[
              [t("keyExpertise"), e.primaryExpertise],
              [t("ukraineExperience"), e.ukraineTheme],
              [t("caseTheme"), e.caseTheme],
              [t("international"), e.internationalRelevance],
              [t("contribution"), e.contribution],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="border-t border-border pt-4">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    {k}
                  </h3>
                  <p className="mt-1.5 text-lg leading-relaxed">{v}</p>
                </div>
              ))}
            <div className="border-t border-border pt-4">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                {t("competencies")}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {e.tags.map((t) => (
                  <span key={t} className="rounded-sm border border-border px-2 py-1 text-xs">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded border border-border bg-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              {t("trustIndex")}
            </p>
            <p className="mt-2 font-display text-xl text-primary">{t("tiiPending")}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("tiiDescription")}
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              {breakdown.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded border border-border bg-card p-5 text-sm">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              {t("contacts")}
            </p>
            {e.phone ? (
              <p className="mt-2 font-mono">{e.phone}</p>
            ) : (
              <p className="mt-2 text-muted-foreground">{t("directContacts")}</p>
            )}
            {e.linkedin && (
              <a
                href={e.linkedin}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block truncate text-primary"
              >
                {t("linkedin")}
              </a>
            )}
            {e.sensitivity && <p className="mt-2 text-xs text-muted-foreground">{e.sensitivity}</p>}
          </div>
          {sent ? (
            <p className="rounded border border-success/40 bg-success/10 p-4 text-sm text-success">
              {t("requestSent")}
            </p>
          ) : open ? (
            <form
              onSubmit={(ev) => {
                ev.preventDefault();
                pushInbox({ kind: "contact", target: e.code, from, message: msg });
                setSent(true);
              }}
              className="space-y-2 rounded border border-primary/40 bg-card p-4"
            >
              <input
                required
                value={from}
                onChange={(x) => setFrom(x.target.value)}
                placeholder="Ваше ім'я та організація"
                className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
              />
              <textarea
                required
                value={msg}
                onChange={(x) => setMsg(x.target.value)}
                rows={4}
                placeholder="Мета контакту, контекст, терміни"
                className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
              />
              <Button className="w-full">
                <Send className="h-4 w-4" />
                {t("sendCoordinator")}
              </Button>
            </form>
          ) : (
            <Button onClick={() => setOpen(true)} className="h-11 w-full">
              {t("safeRequest")}
            </Button>
          )}
          <p className="text-xs text-muted-foreground">{t("contactConsent")}</p>
        </aside>
      </div>
    </main>
  );
}
