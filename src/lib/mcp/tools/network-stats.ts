import { defineTool } from "@lovable.dev/mcp-js";
import { buildExperts } from "../../experts.server";

const count = (xs: string[]) => {
  const m: Record<string, number> = {};
  for (const x of xs) m[x || "Unknown"] = (m[x || "Unknown"] ?? 0) + 1;
  return m;
};

export default defineTool({
  name: "network_stats",
  title: "Network statistics",
  description: "Summary of the ISRM Ukraine expert network: totals, verification, sectors, countries and Ukrainian experience themes.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const all = buildExperts("guest");
    const stats = {
      total: all.length,
      verified: all.filter((e) => e.verified).length,
      bySector: count(all.map((e) => e.sector)),
      byCountry: count(all.map((e) => e.country)),
      byUkraineTheme: count(all.map((e) => e.ukraineCategory)),
      byCommunityRole: count(all.map((e) => e.communityRole)),
    };
    return { content: [{ type: "text", text: JSON.stringify(stats) }], structuredContent: stats };
  },
});
