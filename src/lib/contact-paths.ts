type LocalStore = Pick<Storage, "getItem" | "setItem">;

export const CONTACT_PATHS_KEY = "isrm-contact-paths-v1";

export const CONTACT_INTERMEDIARIES = ["specialty", "practice", "regional"] as const;
export type ContactIntermediary = (typeof CONTACT_INTERMEDIARIES)[number];
export type ContactPath =
  | { kind: "direct"; status: "prepared" | "in-contact" }
  | {
      kind: "recommendation";
      intermediary: ContactIntermediary;
      status: "prepared" | "in-contact";
    };
export type ContactPathMap = Record<string, ContactPath>;

function isIntermediary(value: unknown): value is ContactIntermediary {
  return CONTACT_INTERMEDIARIES.some((intermediary) => intermediary === value);
}

function isContactPath(value: unknown): value is ContactPath {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const path = value as Record<string, unknown>;
  if (path["status"] !== "prepared" && path["status"] !== "in-contact") return false;
  if (path["kind"] === "direct") return true;
  return path["kind"] === "recommendation" && isIntermediary(path["intermediary"]);
}

export function readContactPaths(store: LocalStore): ContactPathMap {
  const value: unknown = JSON.parse(store.getItem(CONTACT_PATHS_KEY) || "{}");
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid contact path collection");
  const paths: ContactPathMap = {};
  for (const [code, path] of Object.entries(value)) {
    if (!isContactPath(path)) throw new Error("Invalid contact path");
    paths[code] = path;
  }
  return paths;
}

export function writeContactPath(
  store: LocalStore,
  code: string,
  path: ContactPath,
): ContactPathMap {
  if (!code || !isContactPath(path)) throw new Error("Invalid contact path");
  const paths = { ...readContactPaths(store), [code]: path };
  store.setItem(CONTACT_PATHS_KEY, JSON.stringify(paths));
  return paths;
}

export function removeContactPath(store: LocalStore, code: string): ContactPathMap {
  const paths = readContactPaths(store);
  delete paths[code];
  store.setItem(CONTACT_PATHS_KEY, JSON.stringify(paths));
  return paths;
}
