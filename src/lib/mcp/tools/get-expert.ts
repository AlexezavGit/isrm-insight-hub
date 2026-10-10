import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { buildPublicExperts } from "../../experts.server";
import { toPublicExpert } from "../shape";

export default defineTool({
  name: "get_expert",
  title: "Get expert profile",
  description: "Get the anonymised profile of one expert by code, e.g. EXP-042.",
  inputSchema: { code: z.string().min(1).max(20).describe("Expert code like EXP-042.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ code }) => {
    const e = buildPublicExperts().find((x) => x.code.toLowerCase() === code.trim().toLowerCase());
    if (!e) throw new ToolError(`No expert with code ${code}`);
    const expert = toPublicExpert(e);
    return { content: [{ type: "text", text: JSON.stringify(expert) }], structuredContent: { expert } };
  },
});
