import { BOARD_RESPONSIBILITIES, CORE_ACCEPTANCE } from "@/lib/board-brief";
import type { ClientLocale } from "@/lib/client-catalog";
export function BoardDecisionNote({ locale }: { locale: ClientLocale }) {
  const uk = locale === "uk";
  return (
    <details className="scope-context-note board-decision-note">
      <summary>
        {uk
          ? "Відповідальність під час використання · погодити"
          : "Operational responsibilities · to agree"}
      </summary>
      <h3>{uk ? "Щоденна відповідальність" : "Operational responsibility"}</h3>
      <p>{BOARD_RESPONSIBILITIES[locale]}</p>
      <details>
        <summary>
          {uk ? "Перевірки для детальної пропозиції" : "Checks for the detailed proposal"}
        </summary>
        <ul>
          {CORE_ACCEPTANCE[locale].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>
      <small>
        {uk
          ? "Це основа для погодження ТЗ, не твердження, що всі можливості вже реалізовані в прототипі."
          : "A basis for agreeing the specification; not a claim that the prototype already implements every capability."}
      </small>
    </details>
  );
}
