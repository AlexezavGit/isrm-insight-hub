import type { ClientDraft } from "./client-draft";
import { CORE_SERVICE_IDS, CLIENT_WORKFLOWS, type ServiceId } from "./client-catalog";
export type PackageId = "core" | "engagement" | "expertise" | "monitoring";
export function packageServiceIds(draft: ClientDraft, id: string): ServiceId[] {
  const override = draft.packageServices?.[id as PackageId];
  return override
    ? [...override]
    : [
        ...(id === "core"
          ? CORE_SERVICE_IDS
          : (CLIENT_WORKFLOWS.find((w) => w.id === id)?.serviceIds ?? [])),
      ];
}
export function packageIsCustom(draft: ClientDraft, id: string) {
  const baseline =
    id === "core"
      ? CORE_SERVICE_IDS
      : (CLIENT_WORKFLOWS.find((w) => w.id === id)?.serviceIds ?? []);
  return (
    [...new Set(packageServiceIds(draft, id))].sort().join("|") !==
    [...new Set(baseline)].sort().join("|")
  );
}
export function packageChanges(
  draft: ClientDraft,
  id: PackageId,
  ids: ServiceId[],
): Partial<ClientDraft> {
  return { mode: "full", packageServices: { ...draft.packageServices, [id]: [...new Set(ids)] } };
}
export function serviceSelectionChanges(
  draft: ClientDraft,
  ids: ServiceId[],
): Partial<ClientDraft> {
  const selected = [...new Set(ids)];
  return {
    mode: "full",
    workflowIds: [],
    packageServices: {
      ...draft.packageServices,
      core: selected.filter((id) => CORE_SERVICE_IDS.includes(id)),
    },
    serviceIds: selected.filter((id) => !CORE_SERVICE_IDS.includes(id)),
  };
}
export function excludeServiceChanges(
  draft: ClientDraft,
  service: ServiceId,
  packageId: PackageId | null,
): Partial<ClientDraft> {
  const packages = (packageId ? [packageId] : ["core"]) as PackageId[];
  const packageServices = { ...draft.packageServices };
  for (const id of packages)
    packageServices[id] = packageServiceIds(draft, id).filter((s) => s !== service);
  return {
    mode: "full",
    packageServices,
    serviceIds: packageId ? draft.serviceIds : draft.serviceIds.filter((id) => id !== service),
  };
}
