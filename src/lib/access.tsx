import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getNetwork } from "./network.functions";
import type { NetworkPayload } from "./types";

const KEY = "isrm-access-code";

interface Ctx {
  code: string;
  setCode: (c: string) => void;
  data: NetworkPayload | undefined;
  loading: boolean;
}
const AccessCtx = createContext<Ctx | null>(null);

export function AccessProvider({ children }: { children: ReactNode }) {
  const [code, setCodeState] = useState("");
  useEffect(() => {
    setCodeState(sessionStorage.getItem(KEY) || "");
  }, []);
  const setCode = (c: string) => {
    if (c) sessionStorage.setItem(KEY, c);
    else sessionStorage.removeItem(KEY);
    setCodeState(c);
  };
  const fetchNet = useServerFn(getNetwork);
  const q = useQuery({
    queryKey: ["network", code],
    queryFn: () => fetchNet({ data: { code } }),
    staleTime: Infinity,
  });
  const v = useMemo(() => ({ code, setCode, data: q.data, loading: q.isLoading }), [code, q.data, q.isLoading]);
  return <AccessCtx.Provider value={v}>{children}</AccessCtx.Provider>;
}

export function useAccess() {
  const c = useContext(AccessCtx);
  if (!c) throw new Error("AccessProvider missing");
  return c;
}

// Coordinator inbox (demo persistence in the browser)
export interface InboxItem {
  id: string;
  kind: "contact" | "feedback";
  createdAt: string;
  target?: string;
  from: string;
  message: string;
  topic?: string;
}
const INBOX = "isrm-coordinator-inbox";
export function readInbox(): InboxItem[] {
  try {
    return JSON.parse(localStorage.getItem(INBOX) || "[]");
  } catch {
    return [];
  }
}
export function pushInbox(item: Omit<InboxItem, "id" | "createdAt">) {
  const all = readInbox();
  all.unshift({ ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  localStorage.setItem(INBOX, JSON.stringify(all));
}
export function clearInbox() {
  localStorage.removeItem(INBOX);
}
