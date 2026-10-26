import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DRAFT_KEY, emptyDraft, updateDraft, type ClientDraft } from "@/lib/client-draft";

import { loadClientDraft } from "@/lib/client-storage";

type Context = {
  backup: Record<string, string>;
  draft: ClientDraft;
  ready: boolean;
  error: string;
  update: (changes: Partial<ClientDraft>) => void;
  reset: () => void;
};
const DraftContext = createContext<Context | null>(null);
export function ClientDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState(emptyDraft);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [backup, setBackup] = useState<Record<string, string>>({});
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    let result;
    try {
      result = loadClientDraft(localStorage);
    } catch {
      result = loadClientDraft({
        getItem() {
          throw new Error("unavailable");
        },
      });
    }
    setDraft(result.draft);
    setBackup(result.backup);
    setBlocked(result.problem === "invalid");
    if (result.problem === "invalid")
      setError(
        "Saved data could not be read. Download the retained data before starting a new draft. / Збережені дані не вдалося прочитати. Завантажте їх перед створенням нової чернетки.",
      );
    if (result.problem === "unavailable")
      setError(
        "Browser storage is unavailable. You can work in this tab and download your result before leaving. / Сховище браузера недоступне. Можна працювати в цій вкладці й завантажити результат перед виходом.",
      );
    setReady(true);
  }, []);
  const update = (changes: Partial<ClientDraft>) => {
    if (!ready || blocked) return;
    const next = updateDraft(draft, changes);
    setDraft(next);
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
      setError("");
    } catch {
      setError(
        "Changes are visible in this tab but could not be saved. Download your summary before leaving. / Зміни в цій вкладці не вдалося зберегти. Завантажте підсумок перед виходом.",
      );
    }
  };
  const reset = () => {
    const next = emptyDraft();
    setDraft(next);
    setBlocked(false);
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
      setDraft(next);
      setBlocked(false);
      setError("");
    } catch {
      setError("Browser storage is unavailable. / Сховище браузера недоступне.");
    }
  };
  return (
    <DraftContext.Provider
      value={{ draft, ready: ready && !blocked, error, update, reset, backup }}
    >
      {children}
    </DraftContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useClientDraft() {
  const value = useContext(DraftContext);
  if (!value) throw new Error("ClientDraftProvider is missing");
  return value;
}
