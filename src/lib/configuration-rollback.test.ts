import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NetworkCapabilityTree } from "../components/NetworkCapabilityTree";
import { NetworkInspectionDock } from "../components/NetworkInspectionDock";
import { stackedInspectionLayout } from "./network-dock";
import { emptyDraft } from "./client-draft";
const noop = () => {};

test("configuration restores the workflow tree rather than a flat service selector", () => {
  const html = renderToStaticMarkup(
    React.createElement(NetworkCapabilityTree, {
      draft: emptyDraft(),
      locale: "en",
      open: "engagement",
      onOpen: noop,
      onService: noop,
      editing: false,
      disabled: false,
      onToggle: noop,
      onWorkflow: noop,
    }),
  );
  assert(html.includes('data-workflow-id="core"'));
  assert(html.includes('data-workflow-id="engagement"'));
  assert(html.includes('data-workflow-id="expertise"'));
  assert(!html.includes("network-service-choices"));
  assert(html.includes("data-service-id="));
});

test("historical configuration keeps the earlier graph reserve and panel headings", () => {
  const open = { search: true, profile: true, shortlist: true };
  const requested = { search: 300, profile: 330, shortlist: 330 };
  const layout = stackedInspectionLayout(1100, open, requested, true);
  assert(layout.graph >= 380);
  const proto = stackedInspectionLayout(1100, open, requested);
  assert(proto.width > layout.width);
  const props = {
    search: React.createElement("p", null, "Tree"),
    profile: React.createElement("p", null, "Workflow"),
    shortlist: React.createElement("p", null, "Service"),
    profileKey: "core",
    layout,
    onWidth: noop,
    onCloseProfile: noop,
    onCloseShortlist: noop,
    onGraph: noop,
    uk: false,
  };
  const historical = renderToStaticMarkup(
    React.createElement(NetworkInspectionDock, { ...props, historical: true }),
  );
  assert(!historical.includes("network-pane-heading"));
  const current = renderToStaticMarkup(React.createElement(NetworkInspectionDock, props));
  assert(current.includes("network-pane-heading"));
});
