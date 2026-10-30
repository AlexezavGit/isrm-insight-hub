import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  createRootRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
} from "@tanstack/react-router";
import { NetworkProfile } from "../components/NetworkProfile";
import { NetworkShortlist } from "../components/NetworkShortlist";
import type { Expert } from "./types";

const person = {
  id: 1,
  code: "A",
  displayName: "Selected expert",
  primaryExpertise: "Risk advisory",
  sector: "Security",
  country: "Ukraine",
  verified: true,
  identityStatus: "Source confirmed",
  evidence: "Restricted evidence detail",
  source: "https://example.org/source",
  phone: "PRIVATE-CONTACT",
  tags: [],
} as Expert;
const noop = () => {};
async function render(node: React.ReactNode) {
  const root = createRootRoute({ component: () => node });
  const router = createRouter({
    routeTree: root,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  await router.load();
  return renderToStaticMarkup(React.createElement(RouterProvider, { router }));
}
test("mini dossier stays concise while full dossier exposes notes and explicit service handoffs", async () => {
  const props = {
    expert: person,
    uk: false,
    onFull: noop,
    shortlisted: false,
    onToggle: noop,
    onGroup: noop,
    onConnections: noop,
    ready: true,
  };
  const mini = await render(React.createElement(NetworkProfile, { ...props, full: false }));
  assert(mini.includes("Selected expert"));
  assert(!mini.includes("Restricted evidence detail"));
  assert(!mini.includes("PRIVATE-CONTACT"));
  assert(!mini.includes("textarea"));
  assert(!mini.includes("Through what might these profiles connect?"));
  const full = await render(React.createElement(NetworkProfile, { ...props, full: true }));
  assert(full.includes("Restricted evidence detail"));
  assert(full.includes("textarea"));
  assert(full.includes("Working review mark"));
  assert(full.includes("capability=research"));
  assert(full.includes("capability=review"));
  assert(full.includes("capability=contact"));
  assert(full.includes("capability=groups"));
  assert(full.includes("not a change to the source record"));
});
test("shortlist contains selected names and actions without profile descriptions or note editors", async () => {
  const html = await render(
    React.createElement(NetworkShortlist, {
      people: [person, { ...person, code: "B", displayName: "Not selected" }],
      codes: ["A"],
      name: "Enquiry",
      onName: noop,
      onInspect: noop,
      onRemove: noop,
      onClose: noop,
      onSearch: noop,
      onRestore: noop,
      onExpand: noop,
      uk: false,
    }),
  );
  assert(html.includes("Selected expert"));
  assert(!html.includes("Not selected"));
  assert(!html.includes("Risk advisory"));
  assert(!html.includes("textarea"));
  assert(!html.includes("PRIVATE-CONTACT"));
  assert(html.includes("Save this shortlist in the browser"));
  assert(!html.includes("Save a snapshot"));
  assert(html.includes("Download") || html.includes("Markdown"));
});
