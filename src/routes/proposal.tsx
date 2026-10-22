import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { ClientProposalBody } from "@/components/ClientProposalBody";

export const Route = createFileRoute("/proposal")({
  beforeLoad: () => {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("isrm-visited", "1");
    }
  },
  head: () => ({
    meta: [
      { title: "Технології що створюють Довіру — фундамент Trusted Consultancy · ISRM" },
      {
        name: "description",
        content:
          "Технології що створюють Довіру — фундамент Trusted Consultancy. Концепція цифрового хабу мережі експертів ISRM.",
      },
      {
        property: "og:title",
        content: "Технології що створюють Довіру — фундамент Trusted Consultancy",
      },
      {
        property: "og:description",
        content: "Explore the expert workflow, pilot outcomes and indicative package ranges.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClientProposal,
});

function ClientProposal() {
  const { locale, setLocale } = useI18n();
  const uk = locale === "uk";
  const text = (en: string, ua: string) => (uk ? ua : en);
  return <ClientProposalBody locale={locale} text={text} uk={uk} setLocale={setLocale} />;
}
