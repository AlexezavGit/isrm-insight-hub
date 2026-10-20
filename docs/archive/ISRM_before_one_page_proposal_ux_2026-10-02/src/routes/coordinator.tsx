import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { clearInbox, pushInbox, readInbox, useAccess, type InboxItem } from "@/lib/access";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { applyFilters, FilterBar, type Filters } from "@/lib/filters";
import {
  CORE_FEATURES,
  setFeatureIncluded,
  useConfiguratorState,
  type FeatureId,
} from "@/lib/proposal-config";
import type { Expert } from "@/lib/types";

type Step = { title: string; prompt: string; fields: [string, string][] };
type Service = {
  id: string;
  phase: string;
  title: string;
  need: string;
  purpose: string;
  result: string;
  steps: [Step, Step, Step];
};

const SERVICES: Service[] = [
  {
    id: "service-war-room",
    phase: "01",
    title: "War Room",
    need: "Leadership needs one operational picture, not scattered updates.",
    purpose: "Join network expertise, situational context, alerts and action ownership.",
    result: "A shared operating picture with a named owner, priority and next action.",
    steps: [
      {
        title: "Define the situation",
        prompt: "What needs active monitoring?",
        fields: [
          ["Situation / topic", "e.g. regional logistics disruption"],
          ["Geography", "country, region or corridor"],
        ],
      },
      {
        title: "Set the operating view",
        prompt: "Choose the signals and people that matter.",
        fields: [
          ["Map layers", "network expertise, public signals, assets"],
          ["Alert threshold", "urgent / material change / daily digest"],
        ],
      },
      {
        title: "Assign action",
        prompt: "Turn monitoring into coordinated response.",
        fields: [
          ["Decision owner", "role or working group"],
          ["Next action", "verify, advise, convene or escalate"],
        ],
      },
    ],
  },
  {
    id: "service-projects",
    phase: "02",
    title: "Projects & expert requests",
    need: "A decision or project is blocked by a missing capability.",
    purpose:
      "Translate an open question into a scoped request, matched experts and a traceable invitation.",
    result: "A request brief, candidate match and an accountable next step.",
    steps: [
      {
        title: "Frame the need",
        prompt: "Describe the decision or task, not just a job title.",
        fields: [
          ["Decision / deliverable", "What must be decided or produced?"],
          ["Context", "Why now? What is already known?"],
        ],
      },
      {
        title: "Specify the match",
        prompt: "Describe the capability and constraints.",
        fields: [
          ["Expertise needed", "skills, sector, operating experience"],
          ["Geography / deadline", "where and by when"],
        ],
      },
      {
        title: "Mobilise",
        prompt: "Choose the involvement model and desired response.",
        fields: [
          ["Participation", "quick advice / review / project role"],
          ["Success signal", "what a useful response looks like"],
        ],
      },
    ],
  },
  {
    id: "service-recruitment",
    phase: "03",
    title: "Expert recruitment",
    need: "A capability gap requires expertise beyond the currently verified pool.",
    purpose: "Plan consent-aware recruitment and manage nominations through verification.",
    result: "A sourced candidate segment, outreach brief and onboarding pipeline.",
    steps: [
      {
        title: "Set the capability gap",
        prompt: "Which capabilities are missing or underrepresented?",
        fields: [
          ["Expertise gap", "sector, seniority, language, experience"],
          ["Target geography", "countries / regions"],
        ],
      },
      {
        title: "Choose the audience",
        prompt: "Define an approved source; this demo does not scrape social platforms.",
        fields: [
          ["Candidate source", "referrals, opt-in list, event participants"],
          ["Consent basis", "referral / explicit opt-in / public invitation"],
        ],
      },
      {
        title: "Plan the invitation",
        prompt: "Make the ask clear and verifiable.",
        fields: [
          ["Invitation message", "purpose, time commitment, safeguards"],
          ["Verification owner", "person or group reviewing applicants"],
        ],
      },
    ],
  },
  {
    id: "service-research",
    phase: "04",
    title: "Expert discussions & research",
    need: "A complex question needs structured input from multiple disciplines.",
    purpose:
      "Set up a moderated session or asynchronous research with clear evidence and synthesis.",
    result: "A research question, participant group, evidence pack and synthesised findings.",
    steps: [
      {
        title: "Frame the question",
        prompt: "Turn the topic into something that can be examined.",
        fields: [
          ["Research question", "What do we need to understand?"],
          ["Decision relevance", "Which decision will this inform?"],
        ],
      },
      {
        title: "Compose the room",
        prompt: "Balance perspectives and protect contributions.",
        fields: [
          ["Expertise mix", "disciplines / regions / roles"],
          ["Participation rules", "attribution, confidentiality, recording"],
        ],
      },
      {
        title: "Capture the outcome",
        prompt: "Specify how insight becomes usable.",
        fields: [
          ["Output", "brief / options / evidence map / dissent log"],
          ["Synthesis owner", "facilitator or editor"],
        ],
      },
    ],
  },
  {
    id: "service-public-engagement",
    phase: "05",
    title: "Public campaigns & hearings",
    need: "An initiative needs trusted public input or a transparent external conversation.",
    purpose:
      "Plan an accessible campaign or hearing with participation rules and response tracking.",
    result: "An engagement plan, stakeholder map and documented response themes.",
    steps: [
      {
        title: "Set the public purpose",
        prompt: "What public decision, question or change is at stake?",
        fields: [
          ["Purpose", "inform / consult / co-design / hear evidence"],
          ["Audience", "communities, institutions, sectors"],
        ],
      },
      {
        title: "Design participation",
        prompt: "Choose accessible and safe channels.",
        fields: [
          ["Format", "hearing / roundtable / online consultation"],
          ["Safeguards", "moderation, accessibility, privacy"],
        ],
      },
      {
        title: "Close the loop",
        prompt: "Show how input influences the decision.",
        fields: [
          ["Synthesis method", "themes, evidence, response matrix"],
          ["Feedback commitment", "when and how participants hear back"],
        ],
      },
    ],
  },
  {
    id: "service-leads",
    phase: "06",
    title: "Consulting opportunities",
    need: "Network expertise can solve an external problem and create sustainable value.",
    purpose: "Qualify opportunities and match them without exposing the whole network.",
    result: "A qualified lead, capability match and proposed next step.",
    steps: [
      {
        title: "Qualify the opportunity",
        prompt: "Understand the client's need and urgency.",
        fields: [
          ["Client sector", "sector and organisation type"],
          ["Problem / outcome", "what result is needed?"],
        ],
      },
      {
        title: "Scope delivery",
        prompt: "Check that the network can deliver responsibly.",
        fields: [
          ["Required capabilities", "expertise / team composition"],
          ["Constraints", "timeline, geography, conflicts, sensitivity"],
        ],
      },
      {
        title: "Propose a next step",
        prompt: "Make conversion clear without premature commitment.",
        fields: [
          ["Commercial model", "discovery / fixed scope / retainer"],
          ["Lead owner", "person responsible for follow-up"],
        ],
      },
    ],
  },
  {
    id: "service-news-alerts",
    phase: "07",
    title: "Network news & alerts",
    need: "A time-sensitive update must reach the right people, not everyone by default.",
    purpose: "Publish a verified update and target alerts by expertise, role or geography.",
    result: "A reviewed bulletin, audience preview and delivery/acknowledgement record.",
    steps: [
      {
        title: "Prepare the update",
        prompt: "Separate verified facts from interpretation.",
        fields: [
          ["Headline / update", "concise, actionable summary"],
          ["Source / verification", "source and verification owner"],
        ],
      },
      {
        title: "Target recipients",
        prompt: "Choose the smallest relevant audience.",
        fields: [
          ["Expertise / role", "which group needs to know?"],
          ["Geography / urgency", "where and by when?"],
        ],
      },
      {
        title: "Choose delivery",
        prompt: "Match channel to urgency and consent.",
        fields: [
          ["Approved channel", "in-app / email / approved messenger"],
          ["Acknowledgement", "yes / no / action owners only"],
        ],
      },
    ],
  },
  {
    id: "service-meetings",
    phase: "08",
    title: "Meeting operations",
    need: "Valuable conversations get lost between invitations, access checks and follow-up.",
    purpose: "Manage virtual and in-person sessions from invitation through materials and actions.",
    result: "An event workspace with attendance, agenda, library and action log.",
    steps: [
      {
        title: "Configure the session",
        prompt: "Set format and access requirements.",
        fields: [
          ["Format / venue", "online / in-person / hybrid"],
          ["Date / access", "time, access list, check-in needs"],
        ],
      },
      {
        title: "Build the agenda",
        prompt: "Design a useful flow for senior participants.",
        fields: [
          ["Agenda outcomes", "decisions, questions, timeboxes"],
          ["Facilitator / speakers", "roles or named participants"],
        ],
      },
      {
        title: "Prepare follow-through",
        prompt: "Make materials and actions easy to find.",
        fields: [
          ["Library materials", "briefing, slides, links"],
          ["Action owner", "who records and follows up?"],
        ],
      },
    ],
  },
  {
    id: "service-ai-osint",
    phase: "09",
    title: "AI assistant & OSINT review",
    need: "Research should be faster while sources, uncertainty and accountability remain visible.",
    purpose: "Use approved sources with human review; do not automate adverse decisions.",
    result: "A source-linked brief with caveats and a reviewer decision.",
    steps: [
      {
        title: "Define a lawful question",
        prompt: "State purpose and scope before researching a person or entity.",
        fields: [
          ["Research purpose", "specific, legitimate question"],
          ["Subject scope", "organisation / role / public-interest scope"],
        ],
      },
      {
        title: "Select sources",
        prompt: "Use only approved, auditable sources.",
        fields: [
          ["Approved source set", "registries, publications, supplied materials"],
          ["Exclude", "sensitive or non-consented data"],
        ],
      },
      {
        title: "Review before action",
        prompt: "A human reviewer validates context and potential harm.",
        fields: [
          ["Reviewer", "role responsible for review"],
          ["Decision boundary", "escalation rules; no automated adverse action"],
        ],
      },
    ],
  },
  {
    id: "service-partners",
    phase: "10",
    title: "Partner services",
    need: "Participants need trusted support that is difficult to find under pressure.",
    purpose:
      "Discover network-approved providers with transparent coverage, evidence and feedback.",
    result: "A relevant shortlist and documented request for a partner offer.",
    steps: [
      {
        title: "State the need",
        prompt: "Choose category and operating context.",
        fields: [
          ["Service needed", "legal, evacuation, field handling, maintenance"],
          ["Location / timing", "where and when"],
        ],
      },
      {
        title: "Compare providers",
        prompt: "Assess fit, not popularity alone.",
        fields: [
          ["Requirements", "licence, language, availability, safeguards"],
          ["Evidence to review", "references, coverage, verified capability"],
        ],
      },
      {
        title: "Request an offer",
        prompt: "Share only what a provider needs to respond.",
        fields: [
          ["Request scope", "minimum information for a quote"],
          ["Response time", "deadline or urgency"],
        ],
      },
    ],
  },
  {
    id: "service-billing",
    phase: "11",
    title: "Network services & billing",
    need: "The network needs a sustainable model without charging for basic participation.",
    purpose: "Separate free membership from optional premium services with explicit cost approval.",
    result: "A transparent estimate or pay-as-you-go request; this demo makes no charge.",
    steps: [
      {
        title: "Choose service level",
        prompt: "Identify what is included and what is premium.",
        fields: [
          ["Service", "membership / event / research / partner service"],
          ["Service tier", "included / premium / pay-as-you-go"],
        ],
      },
      {
        title: "Estimate usage",
        prompt: "Make cost drivers understandable before commitment.",
        fields: [
          ["Volume / duration", "participants, hours, usage units"],
          ["Budget owner", "person or organisation approving spend"],
        ],
      },
      {
        title: "Approve next step",
        prompt: "Request a quote or confirm a no-cost activity.",
        fields: [
          ["Approval status", "draft / request quote / approved"],
          ["Billing contact", "role or business email"],
        ],
      },
    ],
  },
];

export const Route = createFileRoute("/coordinator")({
  head: () => ({
    meta: [
      { title: "Network Cabinet — ISRM Ukraine" },
      {
        name: "description",
        content:
          "Explore expert search and network services through interactive product walkthroughs.",
      },
      { property: "og:title", content: "Network Cabinet — ISRM Ukraine" },
      {
        property: "og:description",
        content: "Expert search and interactive service demonstrations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoordinatorPage,
});

function CoordinatorPage() {
  return (
    <main>
      <CoordinatorSection />
    </main>
  );
}

export function CoordinatorSection() {
  const { data } = useAccess();
  const { locale, t } = useI18n();
  const { state, update } = useConfiguratorState();
  const filters = state.filters;
  const setFilters = (nextFilters: Filters) => update({ filters: nextFilters });
  const [activeService, setActiveService] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [requested, setRequested] = useState("");
  const [items, setItems] = useState<InboxItem[]>([]);
  const includedFeatures = state.includedFeatures;
  useEffect(() => setItems(readInbox()), []);
  const experts = data?.experts ?? [];
  const matches = useMemo(
    () => applyFilters(experts, filters).sort((a, b) => b.trust - a.trust),
    [experts, filters],
  );
  const service = SERVICES.find((item) => item.id === activeService);
  const isLastStep = Boolean(service && stepIndex === service.steps.length - 1);
  const setAnswer = (field: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [`${activeService}:${stepIndex}:${field}`]: value }));
  const toggleIncludedFeature = (featureId: FeatureId) => {
    const next = setFeatureIncluded(
      includedFeatures,
      featureId,
      !includedFeatures.includes(featureId),
    );
    update({ includedFeatures: next });
  };
  const isCoreFeature = (featureId: FeatureId) => CORE_FEATURES.includes(featureId);
  const submitWalkthrough = () => {
    if (!service) return;
    const detail = service.steps
      .flatMap((step, index) =>
        step.fields.map(
          ([label]) => `${label}: ${answers[`${service.id}:${index}:${label}`] || "Not specified"}`,
        ),
      )
      .join("\n");
    pushInbox({
      kind: "feedback",
      from: "Cabinet service walkthrough",
      topic: service.title,
      message: `${service.result}\n\n${detail}`,
    });
    setItems(readInbox());
    setRequested(service.id);
    setActiveService(null);
  };
  const requestLabel =
    locale === "uk" ? "Надіслати запит на обговорення" : "Request a scoped discussion";
  return (
    <section
      id="future-features"
      className="mx-auto max-w-7xl scroll-mt-16 px-4 py-10 pb-16 sm:px-6"
    >
      <header className="mb-8 border-b-2 border-primary/50 pb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-chart-4">
          02 · Future features
        </p>
        <h2 className="mt-2 max-w-3xl font-display text-3xl leading-tight sm:text-4xl">
          Try the workflows before choosing the scope
        </h2>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-muted-foreground">
          Each service preview is a short, specific journey. Add or exclude capabilities here; your
          choices carry through to the proposal below.
        </p>
      </header>

      <section id="expert-search" className="scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
              Start with the need
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl">
              Search expertise across the network
            </h2>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            {matches.length} / {experts.length} profiles match
          </p>
        </div>
        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded border border-primary/40 bg-card p-3 text-sm">
          <input
            type="checkbox"
            checked={includedFeatures.includes("expert-search")}
            disabled
            aria-label="Core capability, always included"
            className="mt-1 h-4 w-4 accent-[var(--primary)]"
          />
          <span>
            <span className="block font-semibold">
              Expert search & dossiers · core capability, always included
            </span>
            <span className="mt-1 block text-xs text-muted-foreground">
              This capability supports project requests, recruitment and consulting-team workflows.
            </span>
          </span>
        </label>
        <div className="mt-4 rounded border border-border bg-card p-4">
          <FilterBar experts={experts} f={filters} setF={setFilters} />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {matches.slice(0, 9).map((expert: Expert) => (
            <ExpertMatch key={expert.code} expert={expert} />
          ))}
          {matches.length === 0 && (
            <p className="rounded border border-border bg-card p-5 text-sm text-muted-foreground">
              No exact matches. Broaden a filter or search by a related capability.
            </p>
          )}
        </div>
      </section>

      <section id="network-services" className="mt-12 scroll-mt-24">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-chart-4">
            Service mockups · 3-step previews
          </p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl">
            See the work, the decisions and the output
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Each mockup is a short, service-specific journey. Your entries form a demonstration
            brief only; nothing is sent externally or billed.
          </p>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((item) => {
            const isActive = activeService === item.id;
            const isRequested = requested === item.id;
            const isIncluded = includedFeatures.includes(item.id as FeatureId);
            const step = item.steps[stepIndex] ?? item.steps[0];
            return (
              <article
                id={item.id}
                key={item.id}
                className={`scroll-mt-24 rounded border bg-card p-4 transition-colors ${isActive ? "border-primary shadow-lg shadow-primary/10" : "border-border"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-primary">
                      Service {item.phase} · 3-step preview
                    </p>
                    <h3 className="mt-1 font-display text-xl">{item.title}</h3>
                  </div>
                  <button
                    type="button"
                    aria-pressed={isIncluded}
                    disabled={isCoreFeature(item.id as FeatureId)}
                    onClick={() => toggleIncludedFeature(item.id as FeatureId)}
                    className="min-h-10 rounded border border-primary/40 px-2 py-1 font-mono text-[10px] text-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isCoreFeature(item.id as FeatureId)
                      ? "✓ Core · always included"
                      : isIncluded
                        ? "✓ Included"
                        : "+ Add to proposal"}
                  </button>
                </div>
                {!isActive ? (
                  <>
                    <p className="mt-3 text-sm">
                      <strong>Need:</strong> {item.need}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <strong className="text-foreground">Service:</strong> {item.purpose}
                    </p>
                    <div className="mt-4 rounded border border-border bg-background/70 p-3">
                      <p className="font-mono text-[9px] uppercase text-muted-foreground">
                        What you get
                      </p>
                      <p className="mt-1 text-sm">{item.result}</p>
                    </div>
                    <Button
                      className="mt-4 w-full"
                      variant="outline"
                      onClick={() => {
                        setActiveService(item.id);
                        setStepIndex(0);
                        setRequested("");
                      }}
                    >
                      Try this service <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div
                      className="mt-4 flex items-center gap-1"
                      aria-label={`Step ${stepIndex + 1} of 3`}
                    >
                      {item.steps.map((s, index) => (
                        <div
                          key={s.title}
                          className={`h-1.5 flex-1 rounded-full ${index <= stepIndex ? "bg-primary" : "bg-muted"}`}
                        />
                      ))}
                      <span className="ml-2 font-mono text-[10px]">{stepIndex + 1}/3</span>
                    </div>
                    <h4 className="mt-4 font-display text-lg">{step.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">{step.prompt}</p>
                    <div className="mt-3 space-y-2">
                      {step.fields.map(([label, placeholder]) => (
                        <label key={label} className="block">
                          <span className="mb-1 block font-mono text-[9px] uppercase tracking-wide text-muted-foreground">
                            {label}
                          </span>
                          <input
                            value={answers[`${item.id}:${stepIndex}:${label}`] ?? ""}
                            onChange={(event) => setAnswer(label, event.target.value)}
                            placeholder={placeholder}
                            className="w-full rounded border border-input bg-background px-2.5 py-2 text-xs outline-none focus:border-primary"
                          />
                        </label>
                      ))}
                    </div>
                    {isLastStep && (
                      <div className="mt-3 rounded border border-success/30 bg-success/5 p-3">
                        <p className="font-mono text-[9px] uppercase text-success">
                          Expected outcome
                        </p>
                        <p className="mt-1 text-xs">{item.result}</p>
                      </div>
                    )}
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          stepIndex === 0 ? setActiveService(null) : setStepIndex(stepIndex - 1)
                        }
                      >
                        <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                        {stepIndex === 0 ? "Cancel" : "Back"}
                      </Button>
                      {isLastStep ? (
                        <Button size="sm" onClick={submitWalkthrough}>
                          {requestLabel}
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => setStepIndex(stepIndex + 1)}>
                          Next step <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </>
                )}
                {isRequested && (
                  <p className="mt-3 flex items-center gap-2 rounded border border-success/30 bg-success/5 p-2 text-xs text-success">
                    <Check className="h-4 w-4" />
                    Demo brief added to the Cabinet inbox.
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-12 overflow-hidden rounded border border-border bg-card/70">
        <div className="border-b border-border p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
            Network pulse · demo replay
          </p>
          <h2 className="mt-1 font-display text-2xl">
            Verification is a process, not a static spreadsheet
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Paused on hover. Demo animation only; it does not change source records.
          </p>
        </div>
        <div className="overflow-hidden">
          <div className="cabinet-expert-ticker flex gap-3 p-4">
            {[...experts.slice(0, 30), ...experts.slice(0, 30)].map((expert, index) => (
              <div
                key={`${expert.code}-${index}`}
                className="min-w-[210px] rounded border border-border bg-background p-3"
              >
                <p className="font-medium">{expert.displayName}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {expert.role || expert.primaryExpertise} · {expert.country}
                </p>
                <span
                  className={`mt-3 inline-block font-mono text-[9px] uppercase ${expert.verified ? "text-success" : "text-muted-foreground"}`}
                >
                  {expert.verified ? "Verified" : "In review"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
              Demonstration inbox
            </p>
            <h2 className="mt-1 font-display text-2xl">Walkthrough briefs ({items.length})</h2>
          </div>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearInbox();
                setItems([]);
              }}
            >
              Clear demo inbox
            </Button>
          )}
        </div>
        <ul className="mt-3 divide-y divide-border rounded border border-border bg-card">
          {items.length === 0 && (
            <li className="p-5 text-sm text-muted-foreground">
              Complete a service preview to see the resulting brief here.
            </li>
          )}
          {items.map((item) => (
            <li key={item.id} className="p-4">
              <p className="font-mono text-[10px] uppercase text-primary">
                {item.topic} ·{" "}
                {new Date(item.createdAt).toLocaleString(locale === "uk" ? "uk-UA" : "en-GB")}
              </p>
              <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">
                {item.message}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

function ExpertMatch({ expert }: { expert: Expert }) {
  const { t } = useI18n();
  return (
    <article className="min-w-0 rounded border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] text-primary">{expert.code}</p>
          <h3 className="truncate font-medium">{expert.displayName}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {expert.sector} · {expert.country}
          </p>
        </div>
        <span className="shrink-0 rounded border border-success/30 px-1.5 py-1 font-mono text-[9px] uppercase text-success">
          {expert.verified ? "Verified" : "Review"}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm">{expert.primaryExpertise}</p>
      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{expert.ukraineCategory}</p>
      <Link
        to="/experts/$code"
        params={{ code: expert.code }}
        className="mt-4 inline-flex items-center rounded-sm border border-primary/50 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wide text-primary hover:bg-primary hover:text-primary-foreground"
      >
        {t("openDossier")} <ArrowRight className="ml-1 h-3 w-3" />
      </Link>
    </article>
  );
}
