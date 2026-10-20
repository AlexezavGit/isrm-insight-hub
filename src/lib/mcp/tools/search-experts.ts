import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { buildExperts } from "../../experts.server";
import { toPublicExpert } from "../shape";

export default defineTool({
  name: "search_experts",
  title: "Search experts",
  description:
    "Search the anonymised ISRM Ukraine expert network by keyword, sector, country or verification status.",
  inputSchema: {
    query: z
      .string()
      .max(200)
      .optional()
      .describe("Keyword matched against expertise, tags and themes."),
    sector: z.string().max(100).optional().describe("Exact sector name."),
    country: z.string().max(100).optional().describe("Country name."),
    verifiedOnly: z.boolean().optional().describe("Only return verified experts."),
    limit: z.number().int().min(1).max(50).optional().describe("Max results (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, sector, country, verifiedOnly, limit }) => {
    const q = query?.toLowerCase();
    const list = buildExperts("guest")
      .filter((e) => !verifiedOnly || e.verified)
      .filter((e) => !sector || e.sector.toLowerCase() === sector.toLowerCase())
      .filter((e) => !country || e.country.toLowerCase() === country.toLowerCase())
      .filter(
        (e) =>
          !q ||
          [e.primaryExpertise, e.ukraineTheme, e.contribution, e.sector, ...e.tags]
            .join(" ")
            .toLowerCase()
            .includes(q),
      )
      .sort((a, b) => a.code.localeCompare(b.code))
      .slice(0, limit ?? 20)
      .map(toPublicExpert);
    return {
      content: [{ type: "text", text: JSON.stringify(list) }],
      structuredContent: { count: list.length, experts: list },
    };
  },
});
