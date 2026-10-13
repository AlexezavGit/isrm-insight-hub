import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchExperts from "./tools/search-experts";
import getExpert from "./tools/get-expert";
import networkStats from "./tools/network-stats";

// Vite inlines the stable ref; the published SUPABASE_URL may be a proxy.
const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "isrm-connect-forge",
  title: "Isrm Connect Forge",
  version: "0.2.0",
  instructions:
    "Anonymised ISRM Ukraine expert network (178 experts). Callers must sign in. Use `network_stats` for an overview, `search_experts` to find experts, and `get_expert` for a profile. Names and contacts are never exposed; contact requests go through the coordinator in the app.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchExperts, getExpert, networkStats],
});
