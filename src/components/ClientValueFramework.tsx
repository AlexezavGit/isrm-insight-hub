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
  return (
    <figure
      className={`client-value-pyramid ${compact ? "is-compact" : ""}`}
      aria-label={
        locale === "uk"
          ? "Піраміда цінності: експертиза на вершині"
          : "Value pyramid: expertise at the top"
      }
    >
      <ol>
        {VALUE_PYRAMID.map((level, index) => (
          <li key={level.id} className={`pyramid-level pyramid-level-${index}`}>
            <span className="pyramid-level-label">
              {locale === "uk"
                ? ["Вершина", "Розвиток", "Основа"][index]
                : ["Value", "Growth", "Foundation"][index]}
            </span>
            <strong>{level.title[locale]}</strong>
            {!compact && <p>{level.detail[locale]}</p>}
          </li>
        ))}
      </ol>
      {!compact && (
        <figcaption>
          {locale === "uk"
            ? "Основа підтримує два опційні workflow. Це рівні цінності, а не обов’язкова черговість замовлення. Подальша перспектива — AI-помічник консультантів і, можливо, AI-консультант для ринку; це окреме рішення."
            : "The foundation supports two optional workflows. These are value layers, not a mandatory purchasing sequence. A future AI assistant for consultants, and perhaps a market-facing AI consultant, would be a separate decision."}
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
