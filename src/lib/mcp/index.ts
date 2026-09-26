import { defineMcp } from "@lovable.dev/mcp-js";
import searchExperts from "./tools/search-experts";
import getExpert from "./tools/get-expert";
import networkStats from "./tools/network-stats";

export default defineMcp({
  name: "isrm-insight-hub",
  title: "ISRM Insight Hub",
  version: "0.1.0",
  instructions:
    "Anonymised ISRM Ukraine expert network (178 experts). Use `network_stats` for an overview, `search_experts` to find experts, and `get_expert` for a profile. Names and contacts are never exposed; contact requests go through the coordinator in the app.",
  tools: [searchExperts, getExpert, networkStats],
});
