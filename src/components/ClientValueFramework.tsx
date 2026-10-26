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
      className={`client-value-lighthouse ${compact ? "is-compact" : ""}`}
      aria-label={
        uk
          ? "Маяк цінності: експертиза задає напрям"
          : "A value lighthouse: expertise sets the direction"
      }
    >
      <div className="lighthouse-composition">
        <svg viewBox="0 0 180 280" fill="none" aria-hidden="true">
          <path
            className="lighthouse-rays"
            d="M68 53 8 30M68 61 0 61M111 53 173 30M111 61 180 61"
          />
          <path d="M64 42a26 13 0 0 1 52 0H64Zm4 1h44v38H68V43Z" />
          <ellipse cx="90" cy="84" rx="31" ry="5" />
          <path d="M60 83v9h60v-9M67 91c-2 66-10 112-18 153m64-153c2 66 10 112 18 153M49 244q41 8 82 0M39 254q51 11 102 0" />
          <path className="lighthouse-lamp" d="M79 49h22v24H79zM90 49v24" />
          <path d="M82 245v-23a8 8 0 0 1 16 0v23M85 123h10v14H85zM83 167h14v16H83z" />
          <path
            className="lighthouse-water"
            d="M9 268q18-5 36 0t36 0 36 0 36 0M28 276q18-4 36 0t36 0 36 0"
          />
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
  return <WorkflowOrbit workflow={workflow} locale={locale} compact={compact} />;
}
