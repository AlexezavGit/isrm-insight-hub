import { PROPOSAL_FUNCTIONS } from "@/lib/proposal-data";
import { ClientProposalUpper } from "@/components/ClientProposalUpper";
import { ClientProposalLower } from "@/components/ClientProposalLower";

type Props = {
  locale: "en" | "uk";
  text: (en: string, ua: string) => string;
  uk: boolean;
  setLocale: (locale: "en" | "uk") => void;
};

export function ClientProposalBody({ locale, text, uk, setLocale }: Props) {
  const dependencyEdges = PROPOSAL_FUNCTIONS.flatMap((feature) =>
    feature.dependencies.flatMap((dependencyId) => {
      const prerequisite = PROPOSAL_FUNCTIONS.find((item) => item.id === dependencyId);
      return prerequisite ? [{ prerequisite, feature }] : [];
    }),
  ).slice(0, 3);

  return (
    <main className="partner-review client-proposal client-offer">
      <div className="partner-shell">
        <ClientProposalUpper
          locale={locale}
          text={text}
          uk={uk}
          setLocale={setLocale}
          dependencyEdges={dependencyEdges}
        />
        <ClientProposalLower locale={locale} text={text} uk={uk} />
      </div>
    </main>
  );
}
