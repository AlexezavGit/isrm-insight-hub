import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import PartnerProposal from "@/components/PartnerProposal";
import { Button } from "@/components/ui/button";
import { IsrmLogo } from "@/components/IsrmLogo";

// Canonical shared password (per handoff §3 — single canonical value, 5-use counter, manual re-arm)
const PARTNER_PASSWORD = "isrm-partner-2026";
const COUNTER_KEY = "isrm-partner-counter-v1";
const ARMED_KEY = "isrm-partner-armed-v1";
const MAX_USES = 5;

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "ISRM — Partner access" },
      {
        name: "description",
        content: "Partner access — internal review draft for ISRM scope, functions and cost scenarios.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PartnerGate,
});

function PartnerGate() {
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number>(MAX_USES);
  const [locked, setLocked] = useState<boolean>(false);

  // On mount: read counter from localStorage; if counter <= 0 → locked.
  useEffect(() => {
    try {
      const armed = window.localStorage.getItem(ARMED_KEY);
      const stored = window.localStorage.getItem(COUNTER_KEY);
      const count = stored ? parseInt(stored, 10) : MAX_USES;
      if (armed === "0" || count <= 0) {
        setLocked(true);
        setRemaining(0);
      } else {
        setLocked(false);
        setRemaining(count);
      }
    } catch {
      // localStorage unavailable; treat as fully armed (no lock)
      setRemaining(MAX_USES);
    }
  }, []);

  const persistCounter = (next: number) => {
    try {
      window.localStorage.setItem(COUNTER_KEY, String(next));
      window.localStorage.setItem(ARMED_KEY, next > 0 ? "1" : "0");
    } catch {
      // ignore — localStorage unavailable (e.g., private mode)
    }
  };

  const reArm = () => {
    persistCounter(MAX_USES);
    setRemaining(MAX_USES);
    setLocked(false);
    setError(null);
    setValue("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;
    const clean = value.trim();
    if (!clean) {
      setError("Password cannot be empty.");
      return;
    }
    if (clean !== PARTNER_PASSWORD) {
      setError("Incorrect password.");
      setValue("");
      return;
    }
    const next = remaining - 1;
    persistCounter(next);
    setRemaining(next);
    if (next <= 0) {
      setLocked(true);
    }
    setUnlocked(true);
  };

  if (unlocked) return <PartnerProposal />;

  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-background)",
        padding: "1.5rem",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: "380px",
          border: "1px solid var(--color-border)",
          borderRadius: "12px",
          padding: "2.25rem",
          background: "var(--color-card)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          boxShadow: "0 10px 32px rgba(40,30,15,0.10), inset 0 1px 0 rgba(255,255,255,0.55)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
          <IsrmLogo className="h-9 w-auto" showSubtitle={true} />
        </div>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "var(--color-primary)",
            margin: 0,
            textAlign: "center",
          }}
        >
          Partner access
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.4rem",
            margin: 0,
            textAlign: "center",
            color: "var(--color-foreground)",
          }}
        >
          Internal review
        </h1>

        {locked ? (
          <>
            <p
              role="alert"
              style={{
                fontSize: "0.875rem",
                color: "var(--color-destructive)",
                margin: 0,
                textAlign: "center",
                lineHeight: 1.55,
                padding: "0.75rem 1rem",
                borderRadius: "6px",
                border: "1px solid var(--color-destructive)",
                background: "color-mix(in oklab, var(--color-destructive) 8%, transparent)",
              }}
            >
              The shared access counter is exhausted (5/5 used). Re-arm the gate manually to continue.
            </p>
            <Button type="button" onClick={reArm}>
              Re-arm gate (manual override)
            </Button>
          </>
        ) : (
          <>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--color-muted-foreground)",
                margin: 0,
                textAlign: "center",
                lineHeight: 1.55,
              }}
            >
              Enter the shared partner password. The gate is armed for {MAX_USES} sessions; each successful access decrements the counter. After {MAX_USES} uses the gate locks and requires manual re-arm.
            </p>
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--color-muted-foreground)",
                margin: 0,
                textAlign: "center",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.05em",
              }}
            >
              Remaining accesses: <strong style={{ color: "var(--color-primary)" }}>{remaining}</strong> / {MAX_USES}
            </p>
            <input
              type="password"
              autoFocus
              autoComplete="current-password"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(null);
              }}
              placeholder="Shared partner password"
              aria-label="Shared partner password"
              aria-invalid={Boolean(error)}
              style={{
                padding: "0.7rem 0.95rem",
                fontSize: "1rem",
                border: `1.5px solid ${error ? "var(--color-destructive)" : "var(--color-border)"}`,
                borderRadius: "8px",
                background: "var(--color-background)",
                color: "var(--color-foreground)",
                outline: "none",
              }}
            />
            {error && (
              <p role="alert" style={{ fontSize: "0.8rem", color: "var(--color-destructive)", margin: 0 }}>
                {error}
              </p>
            )}
            <Button type="submit" disabled={!value}>
              Continue
            </Button>
          </>
        )}
      </form>
    </div>
  );
}
