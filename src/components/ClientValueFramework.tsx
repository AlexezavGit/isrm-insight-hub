import { WorkflowOrbit } from "./WorkflowOrbit";
import { CORE_CAPABILITIES, VALUE_PYRAMID } from "@/lib/client-value-framework";
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
      className={`client-three-levels ${compact ? "is-compact" : ""}`}
      aria-label={
        uk
          ? "Три рівні рішення: ядро та два незалежні опційні workflow"
          : "Three levels: the core and two independent optional workflows"
      }
    >
      <ol>
        {VALUE_PYRAMID.map((level, index) => (
          <li key={level.id} className={`value-structure-level level-${index}`}>
            <span>
              {index === 2
                ? uk
                  ? "Основа"
                  : "Foundation"
                : uk
                  ? "Опційний workflow"
                  : "Optional workflow"}
            </span>
            <strong>{level.title[locale]}</strong>
            {!compact && <p>{level.detail[locale]}</p>}
          </li>
        ))}
      </ol>
      <figcaption>
        {uk
          ? "Ядро — спільна основа. Кожен workflow можна обрати незалежно."
          : "One shared foundation. Each workflow can be selected independently."}
      </figcaption>
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
  return <WorkflowOrbit workflow={workflow} locale={locale} compact={compact} />;
}
