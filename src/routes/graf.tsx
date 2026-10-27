import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/graf")({
  beforeLoad: () => {
    throw redirect({ to: "/", search: { view: "map" } });
  },
});
