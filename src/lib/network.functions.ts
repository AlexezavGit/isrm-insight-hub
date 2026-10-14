import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildExperts, buildPartnerPreview, resolveAccess } from "./experts.server";
import type { NetworkPayload } from "./types";

export const getPartnerPreview = createServerFn({ method: "GET" }).handler(() => {
  if (process.env["NODE_ENV"] !== "development") {
    throw new Error("The partner preview is disabled outside local development.");
  }
  return buildPartnerPreview();
});

export const getNetwork = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ code: z.string().max(200).optional() }).parse(d))
  .handler(async ({ data }): Promise<NetworkPayload> => {
    if (process.env["NODE_ENV"] !== "development" && data.code?.trim()) {
      throw new Error(
        "Identity-bearing network access is disabled until authenticated authorization is configured.",
      );
    }
    const { level, grantedBy } = resolveAccess(data.code);
    return { level, grantedBy, experts: buildExperts(level) };
  });

export const checkAccess = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ code: z.string().max(200) }).parse(d))
  .handler(async ({ data }) => {
    if (process.env["NODE_ENV"] !== "development") {
      throw new Error(
        "Access-code verification is disabled until authenticated authorization is configured.",
      );
    }
    return resolveAccess(data.code);
  });
