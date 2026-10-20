import { createFileRoute, redirect } from "@tanstack/react-router";

// /spec has been retired. The full project description is available
// as a direct download from /ISRM_Project_Description.md
export const Route = createFileRoute("/spec")({
  beforeLoad: () => {
    throw redirect({ to: "/proposal", replace: true });
  },
  component: () => null,
});
