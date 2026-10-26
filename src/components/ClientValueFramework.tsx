import { CORE_CAPABILITIES, ENGAGEMENT_CYCLE, VALUE_PYRAMID } from "@/lib/client-value-framework";
import type { ClientLocale, WorkflowId } from "@/lib/client-catalog";

export function CoreCapabilities({
  locale,
  compact = false,
}: {
  locale: ClientLocale;
  compact?: boolean;
}) {
  const content = (
    <div className="client-capabilities">
      {CORE_CAPABILITIES.map((group) => (
        <article key={group.id}>
          <h3>{group.title[locale]}</h3>
          <ul>
            {group.outcomes.map((item) => (
              <li key={item.en}>{item[locale]}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
  if (compact)
    return (
      <details className="client-value-details">
        <summary>
          {locale === "uk" ? "Що ви зможете робити" : "What you will be able to do"}
        </summary>
        {content}
      </details>
    );
  return (
    <section className="client-core-capabilities">
      <h2>{locale === "uk" ? "Що ви зможете робити" : "What you will be able to do"}</h2>
      {content}
      <p className="client-note">
        {locale === "uk"
          ? "Можливості базового рішення. Поточна робоча версія показує пошук, граф, досьє й локальний відбір; OSINT та інші погоджені операції підключаються під час реалізації."
          : "Capabilities of the core solution. The current working version shows search, graph, dossiers and local selection; OSINT and other agreed operations are connected during implementation."}
      </p>
    </section>
  );
}
export function ExpertisePyramid({
  locale,
  compact = false,
}: {
  locale: ClientLocale;
  compact?: boolean;
}) {
  const uk = locale === "uk";
  return (
    <figure
      className={`client-value-lighthouse ${compact ? "is-compact" : ""}`}
      aria-label={
        uk
          ? "Маяк цінності: експертиза задає напрям"
          : "A value lighthouse: expertise sets the direction"
      }
    >
      <div className="lighthouse-composition">
        <svg viewBox="0 0 150 240" fill="none" aria-hidden="true">
          <path className="lighthouse-rays" d="M59 44 5 19M59 51 0 51M92 44 145 19M92 51 150 51" />
          <path d="m51 35 24-20 25 20H51Zm4 1h40v35H55V36Zm-7 36h55v9H48v-9ZM58 82 41 218m52-136 17 136M48 146h54M43 191h65M28 219h95v12H28v-12Z" />
          <path className="lighthouse-lamp" d="M67 45h16v15H67zM61 65h28M67 37v27m17-27v27" />
          <path d="M66 218v-21a10 10 0 0 1 20 0v21M66 121h18M67 116v10m15-10v10" />
          <path className="lighthouse-water" d="M5 237h140M20 231h112" />
        </svg>
        <ol>
          {VALUE_PYRAMID.map((level, index) => (
            <li key={level.id}>
              <span>
                {uk
                  ? ["Напрям", "Взаємодія", "Основа"][index]
                  : ["Direction", "Connection", "Foundation"][index]}
              </span>
              <strong>{level.title[locale]}</strong>
              {!compact && <p>{level.detail[locale]}</p>}
            </li>
          ))}
        </ol>
      </div>
      {!compact && (
        <figcaption>
          {uk
            ? "Ядро підтримує два незалежні опційні workflow. Експертиза + AI можуть відкрити подальший напрям професійної взаємодії; його доречність, права й обсяг визначатимуться окремо."
            : "The core supports two independent optional workflows. Expertise + AI may open a further direction for professional collaboration; its relevance, permissions and scope would be considered separately."}
        </figcaption>
      )}
    </figure>
  );
}
export function WorkflowValue({
  workflow,
  locale,
  compact = false,
}: {
  workflow: WorkflowId;
  locale: ClientLocale;
  compact?: boolean;
}) {
  if (workflow === "expertise") return <ExpertisePyramid locale={locale} compact={compact} />;
  return (
    <figure className={`client-engagement-cycle ${compact ? "is-compact" : ""}`}>
      <figcaption>
        {locale === "uk"
          ? "Цикл залучення експертів — як мережа розвивається сама"
          : "The expert engagement cycle — how the network develops"}
      </figcaption>
      <ol>
        {ENGAGEMENT_CYCLE.map((step, index) => (
          <li key={step.id}>
            <span className="client-cycle-number">{index + 1}</span>
            <div>
              <strong>{step.title[locale]}</strong>
              {!compact && <p>{step.action[locale]}</p>}
              <p className="client-cycle-opportunity">{step.opportunities[locale]}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="client-cycle-return">
        ↻{" "}
        {locale === "uk"
          ? "Результати й нові потреби повертаються в адженду наступного циклу."
          : "Findings and new needs shape the agenda for the next cycle."}
      </p>
    </figure>
  );
}
