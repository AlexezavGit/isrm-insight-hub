import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import PartnerProposal from "@/components/PartnerProposal";
import { Button } from "@/components/ui/button";

// Service configurator — protected by a simple session password.
// This is NOT authentication; it is a lightweight access barrier for a local demo.
const SERVICE_PASSWORD = "isrm-service-2026";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "ISRM — Service configurator" },
      {
        name: "description",
        content: "Service configurator — partner review draft for ISRM scope, functions and cost scenarios.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PartnerGate,
});

function PartnerGate() {
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) return <PartnerProposal />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() === SERVICE_PASSWORD) {
      setUnlocked(true);
    } else {
      setError(true);
      setValue("");
    }
  };

  return (
    <div style={{
      minHeight: "100svh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--color-background)",
      padding: "1.5rem",
    }}>
      <form onSubmit={submit} style={{
        width: "100%",
        maxWidth: "360px",
        border: "1px solid var(--color-border)",
        borderRadius: "10px",
        padding: "2rem",
        background: "var(--color-card)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--color-primary)" }}>
          Service configurator
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", margin: 0 }}>
          Partner access
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--color-muted-foreground)", margin: 0 }}>
          Enter the service password to access the partner configuration.
        </p>
        <input
          type="password"
          autoFocus
          autoComplete="current-password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          placeholder="Service password"
          aria-label="Service password"
          aria-invalid={error}
          style={{
            padding: "0.65rem 0.9rem",
            fontSize: "1rem",
            border: `1.5px solid ${error ? "var(--color-destructive)" : "var(--color-border)"}`,
            borderRadius: "6px",
            background: "var(--color-background)",
            color: "var(--color-foreground)",
            outline: "none",
          }}
        />
        {error && (
          <p role="alert" style={{ fontSize: "0.8rem", color: "var(--color-destructive)", margin: 0 }}>
            Incorrect password.
          </p>
        )}
        <Button type="submit" disabled={!value}>
          Continue
        </Button>
      </form>
    </div>
  );
}
