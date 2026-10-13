import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { oauthReturnPath } from "@/lib/oauth-return-path";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({ next: oauthReturnPath(s['next']) }),
  head: () => ({
    meta: [
      { title: "Sign in — ISRM Ukraine" },
      { name: "description", content: "Sign in to connect AI assistants to the ISRM Ukraine expert network." },
      { property: "og:title", content: "Sign in — ISRM Ukraine" },
      { property: "og:description", content: "Sign in to connect AI assistants to the ISRM Ukraine expert network." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

function Login() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg(error.message);
      window.location.href = next;
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: new URL(next, window.location.origin).href },
    });
    setBusy(false);
    setMsg(error ? error.message : "Check your email to confirm your account.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-lg border border-border bg-card p-6">
        <p className="tech-label text-primary">ISRM Ukraine</p>
        <h1 className="mt-2 font-display text-2xl">{mode === "in" ? "Sign in" : "Create account"}</h1>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="field mt-5 w-full" />
        <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="field mt-3 w-full" />
        {msg && <p className="mt-3 text-sm text-muted-foreground">{msg}</p>}
        <Button disabled={busy} className="mt-5 w-full">{busy ? "…" : mode === "in" ? "Sign in" : "Sign up"}</Button>
        <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-3 w-full text-sm text-muted-foreground underline">
          {mode === "in" ? "No account? Sign up" : "Have an account? Sign in"}
        </button>
        <button type="button" onClick={() => navigate({ to: "/" })} className="mt-1 w-full text-sm text-muted-foreground">Back to the map</button>
      </form>
    </main>
  );
}
