import { PROPOSAL_FUNCTIONS } from "@/lib/proposal-data";
import { ClientProposalUpper } from "@/components/ClientProposalUpper";
import { ClientProposalLower } from "@/components/ClientProposalLower";

type Props = {
  locale: "en" | "uk";
  text: (en: string, ua: string) => string;
  uk: boolean;
  setLocale: (locale: "en" | "uk") => void;
};

const LAYOUT = `
.client-proposal .cycle-timeline-row {
  grid-template-columns: minmax(0, 1fr) 28px minmax(0, 1.3fr) !important;
  align-items: stretch;
}
.client-proposal .cycle-tl-left,
.client-proposal .cycle-tl-right { min-width: 0; }
.client-proposal .cycle-tl-funnel {
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  gap: 0.35rem !important;
  width: 100% !important;
}
.client-proposal .cycle-tl-funnel strong {
  display: block !important;
  width: 100% !important;
  text-align: right !important;
  white-space: nowrap !important;
  font-size: 1.35rem !important;
  line-height: 1.2 !important;
}
.client-proposal .cycle-tl-funnel span {
  display: block !important;
  width: 100% !important;
  white-space: normal !important;
  text-align: left !important;
  line-height: 1.45 !important;
}
.client-proposal .client-pilot-grid {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  width: 100% !important;
  gap: 1rem !important;
}
.client-proposal .client-pilot-step {
  width: 100% !important;
  max-width: none !important;
  min-width: 0 !important;
  height: 100%;
}
@media (max-width: 800px) {
  .client-proposal .client-pilot-grid { grid-template-columns: 1fr !important; }
  .client-proposal .cycle-timeline-row { grid-template-columns: 1fr !important; }
}
.client-proposal .consulting-pillars-grid {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 1.5rem !important;
  align-items: stretch !important;
  margin-bottom: 2.5rem !important;
}
@media (max-width: 991px) {
  .client-proposal .consulting-pillars-grid {
    grid-template-columns: 1fr !important;
  }
}
`;

export function ClientProposalBody({ locale, text, uk, setLocale }: Props) {
  const dependencyEdges = PROPOSAL_FUNCTIONS.flatMap((feature) =>
    feature.dependencies.flatMap((dependencyId) => {
      const prerequisite = PROPOSAL_FUNCTIONS.find((item) => item.id === dependencyId);
      return prerequisite ? [{ prerequisite, feature }] : [];
    }),
  ).slice(0, 3);

  return (
    <main className="partner-review client-proposal client-offer">
      <style>{LAYOUT}</style>
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
