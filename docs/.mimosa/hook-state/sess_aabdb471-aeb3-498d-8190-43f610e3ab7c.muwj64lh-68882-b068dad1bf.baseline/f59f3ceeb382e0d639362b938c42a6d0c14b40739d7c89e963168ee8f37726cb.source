import { useEffect, useState } from "react";
import { EMPTY, type Filters } from "@/lib/filters";

export const FEATURE_IDS = [
  "service-war-room",
  "service-projects",
  "expert-search",
  "service-recruitment",
  "service-research",
  "service-public-engagement",
  "service-leads",
  "service-news-alerts",
  "service-meetings",
  "service-ai-osint",
  "service-partners",
  "service-billing",
] as const;

export type FeatureId = (typeof FEATURE_IDS)[number];

export const CORE_FEATURES: readonly FeatureId[] = [
  "expert-search",
  "service-recruitment",
  "service-news-alerts",
  "service-meetings",
];

export type ConfiguratorMode = "network" | "platform" | "dependencies";

export interface GraphLayers {
  network: boolean;
  features: boolean;
  relationships: boolean;
  clusters: boolean;
  sector: boolean;
  theme: boolean;
  hub: boolean;
}

export interface ConfiguratorState {
  version: 1;
  mode: ConfiguratorMode;
  layers: GraphLayers;
  filters: Filters;
  focusedExpertCode: string | null;
  selectedExpertCodes: string[];
  includedFeatures: FeatureId[];
  clientRequirements: ClientRequirement[];
}

export interface ClientRequirement {
  id: string;
  title: string;
  need: string;
  outcome: string;
  constraints: string;
}

export interface ConfiguratorStateUpdate {
  mode?: ConfiguratorMode;
  layers?: Partial<GraphLayers>;
  filters?: Partial<Filters>;
  focusedExpertCode?: string | null;
  selectedExpertCodes?: string[];
  includedFeatures?: FeatureId[];
  clientRequirements?: ClientRequirement[];
}

const STORAGE_KEY = "isrm-configurator-state";
const LEGACY_STORAGE_KEY = "isrm-proposal-features";
const CHANGE_EVENT = "isrm:configurator-state-changed";
const featureIdSet = new Set<string>(FEATURE_IDS);

export const DEFAULT_FEATURES: FeatureId[] = [...CORE_FEATURES];

export const DEFAULT_CONFIGURATOR_STATE: ConfiguratorState = {
  version: 1,
  mode: "network",
  layers: {
    network: true,
    features: false,
    relationships: true,
    clusters: true,
    sector: true,
    theme: true,
    hub: true,
  },
  filters: { ...EMPTY },
  focusedExpertCode: null,
  selectedExpertCodes: [],
  includedFeatures: [...DEFAULT_FEATURES],
  clientRequirements: [],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isConfiguratorMode(value: unknown): value is ConfiguratorMode {
  return value === "network" || value === "platform" || value === "dependencies";
}

function uniqueStrings(value: unknown): string[] | undefined {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    return undefined;
  }
  return [...new Set(value)];
}

function validFeatures(value: unknown): FeatureId[] | undefined {
  const values = uniqueStrings(value);
  return values?.filter((id): id is FeatureId => featureIdSet.has(id));
}

function validClientRequirements(value: unknown): ClientRequirement[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.filter(
    (item): item is ClientRequirement =>
      isRecord(item) &&
      typeof item["id"] === "string" &&
      typeof item["title"] === "string" &&
      typeof item["need"] === "string" &&
      typeof item["outcome"] === "string" &&
      typeof item["constraints"] === "string",
  );
}

function normalizeConfiguratorState(
  value: unknown,
  legacyFeatures: FeatureId[],
): ConfiguratorState {
  if (!isRecord(value)) {
    return { ...DEFAULT_CONFIGURATOR_STATE, includedFeatures: [...legacyFeatures] };
  }

  const layers = isRecord(value["layers"]) ? value["layers"] : {};
  const filters = isRecord(value["filters"]) ? value["filters"] : {};
  const verified =
    filters["verified"] === "verified" || filters["verified"] === "queue"
      ? filters["verified"]
      : "all";
  const storedFeatures = validFeatures(value["includedFeatures"]);
  const selectedExpertCodes = uniqueStrings(value["selectedExpertCodes"]);
  const mode = value["mode"];
  const storedFocus = value["focusedExpertCode"];
  const layer = (key: keyof GraphLayers) =>
    typeof layers[key] === "boolean" ? layers[key] : DEFAULT_CONFIGURATOR_STATE.layers[key];

  return {
    version: 1,
    mode: isConfiguratorMode(mode) ? mode : DEFAULT_CONFIGURATOR_STATE.mode,
    layers: {
      network: layer("network"),
      features: layer("features"),
      relationships: layer("relationships"),
      clusters: layer("clusters"),
      sector: layer("sector"),
      theme: layer("theme"),
      hub: layer("hub"),
    },
    filters: {
      q: typeof filters["q"] === "string" ? filters["q"] : EMPTY.q,
      verified,
      sector: typeof filters["sector"] === "string" ? filters["sector"] : EMPTY.sector,
      country: typeof filters["country"] === "string" ? filters["country"] : EMPTY.country,
      theme: typeof filters["theme"] === "string" ? filters["theme"] : EMPTY.theme,
      role: typeof filters["role"] === "string" ? filters["role"] : EMPTY.role,
    },
    focusedExpertCode: typeof storedFocus === "string" ? storedFocus : null,
    selectedExpertCodes: selectedExpertCodes ?? [],
    includedFeatures: [...new Set([...CORE_FEATURES, ...(storedFeatures ?? legacyFeatures)])],
    clientRequirements: validClientRequirements(value["clientRequirements"]) ?? [],
  };
}

function readLegacyFeatures(): FeatureId[] {
  try {
    const stored = JSON.parse(window.localStorage.getItem(LEGACY_STORAGE_KEY) || "null");
    return validFeatures(stored) ?? [...DEFAULT_FEATURES];
  } catch {
    return [...DEFAULT_FEATURES];
  }
}

export function readConfiguratorState(): ConfiguratorState {
  if (typeof window === "undefined") return DEFAULT_CONFIGURATOR_STATE;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const legacyFeatures = readLegacyFeatures();
    if (!stored) {
      return { ...DEFAULT_CONFIGURATOR_STATE, includedFeatures: legacyFeatures };
    }
    return normalizeConfiguratorState(JSON.parse(stored), legacyFeatures);
  } catch {
    return {
      ...DEFAULT_CONFIGURATOR_STATE,
      includedFeatures: readLegacyFeatures(),
    };
  }
}

export function writeConfiguratorState(state: ConfiguratorState): void {
  const normalized = normalizeConfiguratorState(state, [...DEFAULT_FEATURES]);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  window.localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(normalized.includedFeatures));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function updateConfiguratorState(update: ConfiguratorStateUpdate): ConfiguratorState {
  const current = readConfiguratorState();
  const next = normalizeConfiguratorState(
    {
      ...current,
      ...update,
      layers: { ...current.layers, ...update.layers },
      filters: { ...current.filters, ...update.filters },
    },
    current.includedFeatures,
  );
  writeConfiguratorState(next);
  return next;
}

export function subscribeConfiguratorState(onChange: (state: ConfiguratorState) => void) {
  const refresh = () => onChange(readConfiguratorState());
  window.addEventListener(CHANGE_EVENT, refresh);
  const refreshFromStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === LEGACY_STORAGE_KEY) refresh();
  };
  window.addEventListener("storage", refreshFromStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, refresh);
    window.removeEventListener("storage", refreshFromStorage);
  };
}

export function useConfiguratorState() {
  const [state, setState] = useState(DEFAULT_CONFIGURATOR_STATE);
  useEffect(() => {
    const unsubscribe = subscribeConfiguratorState(setState);
    setState(readConfiguratorState());
    return unsubscribe;
  }, []);
  return {
    state,
    update: updateConfiguratorState,
  };
}

export function readConfiguredFeatures(): FeatureId[] {
  return readConfiguratorState().includedFeatures;
}

export function writeConfiguredFeatures(features: FeatureId[]): void {
  updateConfiguratorState({ includedFeatures: features });
}

export function subscribeConfiguredFeatures(onChange: (features: FeatureId[]) => void) {
  return subscribeConfiguratorState((state) => onChange(state.includedFeatures));
}

export function setFeatureIncluded(
  features: FeatureId[],
  featureId: FeatureId,
  included: boolean,
): FeatureId[] {
  if (!included && CORE_FEATURES.includes(featureId)) return [...features];
  return included
    ? [...new Set([...features, featureId])]
    : features.filter((id) => id !== featureId);
}
