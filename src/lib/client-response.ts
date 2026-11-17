// Public professional address confirmed on Frishberg & Partners' own website.
export const RESPONSE_CONTACT = { name: "Alex Frishberg", email: "alex@frishberg.com" } as const;

export function responseEmailHref(body: string) {
  return `mailto:${RESPONSE_CONTACT.email}?subject=${encodeURIComponent("ISRM · Scope discussion")}&body=${encodeURIComponent(body)}`;
}
