export type PrototypePanel = "search" | "results" | "profile" | "shortlist";
type View = "overview" | "search" | "inspect" | "selection";
export type PrototypeWorkspace = {
  view: View;
  known: PrototypePanel[];
  collapsed: PrototypePanel[];
  closed: PrototypePanel[];
  focus: PrototypePanel | null;
  origin: "results" | "shortlist";
  hasProfile: boolean;
  full: boolean;
};
export type WorkspaceAction =
  | { type: "search" }
  | { type: "inspect"; origin?: "results" | "shortlist" }
  | { type: "shortlist" | "add" }
  | { type: "full"; full: boolean }
  | { type: "collapse" | "close" | "restore"; panel: PrototypePanel }
  | { type: "graph" }
  | { type: "reset" };

export function initialWorkspace(panel?: string): PrototypeWorkspace {
  const state: PrototypeWorkspace = {
    view: "overview",
    known: [],
    collapsed: [],
    closed: [],
    focus: null,
    origin: "results",
    hasProfile: false,
    full: false,
  };
  return panel === "search"
    ? changeWorkspace(state, { type: "search" })
    : panel === "shortlist"
      ? changeWorkspace(state, { type: "shortlist" })
      : state;
}

export function workspacePair(state: PrototypeWorkspace): PrototypePanel[] {
  if (state.view === "search") return ["search", "results"];
  if (state.view === "inspect") return state.hasProfile ? ["results", "profile"] : ["results"];
  if (state.view === "selection")
    return state.hasProfile ? ["profile", "shortlist"] : ["shortlist"];
  return [];
}

export function openWorkspacePanels(state: PrototypeWorkspace) {
  return workspacePair(state).filter(
    (p) => !state.collapsed.includes(p) && !state.closed.includes(p),
  );
}

function enter(state: PrototypeWorkspace, view: View, focus: PrototypePanel): PrototypeWorkspace {
  const next = { ...state, view, focus };
  const pair = workspacePair(next);
  return {
    ...next,
    known: [...new Set([...state.known, ...pair])],
    collapsed: state.collapsed.filter((p) => !pair.includes(p)),
    closed: state.closed.filter((p) => !pair.includes(p)),
  };
}

export function changeWorkspace(
  state: PrototypeWorkspace,
  action: WorkspaceAction,
): PrototypeWorkspace {
  switch (action.type) {
    case "reset":
      return initialWorkspace();
    case "search":
      return enter(state, "search", "search");
    case "inspect": {
      const origin = action.origin ?? (state.view === "selection" ? "shortlist" : "results");
      return enter(
        { ...state, origin, hasProfile: true, full: false },
        origin === "shortlist" ? "selection" : "inspect",
        "profile",
      );
    }
    case "shortlist":
    case "add":
      return enter(
        { ...state, origin: "shortlist", full: action.type === "add" ? false : state.full },
        "selection",
        "shortlist",
      );
    case "full":
      return { ...state, full: action.full, focus: "profile" };
    case "graph":
      return {
        ...state,
        collapsed: [...new Set([...state.collapsed, ...openWorkspacePanels(state)])],
        focus: null,
      };
    case "close":
    case "collapse": {
      const remaining = openWorkspacePanels(state).filter((p) => p !== action.panel);
      return {
        ...state,
        closed:
          action.type === "close" ? [...new Set([...state.closed, action.panel])] : state.closed,
        collapsed:
          action.type === "collapse"
            ? [...new Set([...state.collapsed, action.panel])]
            : state.collapsed,
        focus: state.focus === action.panel ? (remaining.at(-1) ?? null) : state.focus,
      };
    }
    case "restore": {
      const view =
        action.panel === "search"
          ? "search"
          : action.panel === "shortlist"
            ? "selection"
            : action.panel === "profile"
              ? state.origin === "shortlist"
                ? "selection"
                : "inspect"
              : state.hasProfile && state.origin === "results"
                ? "inspect"
                : "search";
      return enter(state, view, action.panel);
    }
  }
}

export function prototypeLayout(
  viewport: number,
  state: PrototypeWorkspace,
  requested: Record<PrototypePanel, number>,
) {
  const compact = viewport < 1100;
  const pair = openWorkspacePanels(state);
  let panels = compact ? pair.filter((p) => p === state.focus) : [...pair];
  if (compact && !panels.length && pair.length) panels = [pair.at(-1)!];
  const rails = () => state.known.filter((p) => !state.closed.includes(p) && !panels.includes(p));
  const sizes = { search: 0, results: 0, profile: 0, shortlist: 0 };
  const budget = () =>
    Math.max(220, viewport - Math.max(284, viewport / 4) - rails().length * 32 - 16);
  for (const p of panels) sizes[p] = Math.max(220, Math.min(560, requested[p]));
  if (compact) {
    if (panels[0])
      sizes[panels[0]] = Math.max(0, Math.min(420, viewport - rails().length * 32 - 16));
  } else if (
    state.full &&
    panels.includes("profile") &&
    panels.reduce((sum, p) => sum + sizes[p], 0) > budget()
  ) {
    panels = ["profile"];
    for (const p of Object.keys(sizes) as PrototypePanel[]) if (p !== "profile") sizes[p] = 0;
    sizes.profile = Math.min(sizes.profile, budget());
  } else {
    const total = panels.reduce((sum, p) => sum + sizes[p], 0);
    if (total > budget())
      for (const p of panels) sizes[p] = Math.max(220, (sizes[p] * budget()) / total);
  }
  const width = panels.reduce((sum, p) => sum + sizes[p], 0) + rails().length * 32;
  return {
    ...sizes,
    panels,
    rails: rails(),
    compact,
    width,
    graph: Math.max(0, viewport - width),
    active: panels.at(-1) ?? null,
  };
}
