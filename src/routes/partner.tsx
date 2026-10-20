import { createFileRoute } from "@tanstack/react-router";
import PartnerProposal from "@/components/PartnerProposal";

// /partner route — internal partner review (financial tables, role breakdowns).
// This route does NOT expose real CRM expert names; it only shows rates, hours, and roles.
// The ⚙ link in ClientProposalUpper partner-topbar is intentionally nearly invisible
// (color rgba(10,46,36,0.25), icon-only). Maintainer-level access only — that's the gate.
// (Previous 5-use counter gate removed per user directive: keep /partner openly reachable
// for internal review without counter friction. The cabinet where real expert names live
// is on the home graph, gated by the AccessControl UnlockDialog with a permanent password.)

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "ISRM — Partner access" },
      {
        name: "description",
        content: "Partner access — internal review draft for ISRM scope, functions and cost scenarios.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <PartnerProposal />,
});
