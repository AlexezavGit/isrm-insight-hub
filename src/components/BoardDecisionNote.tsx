import { BOARD_DECISION, BOARD_RESPONSIBILITIES, CORE_ACCEPTANCE } from "@/lib/board-brief";
import type { ClientLocale } from "@/lib/client-catalog";
export function BoardDecisionNote({ locale }: { locale: ClientLocale }) {
  const uk = locale === "uk";
  return (
    <details className="scope-context-note board-decision-note">
      <summary>
        {uk
          ? "Рішення щодо пілоту, відповідальність і приймання"
          : "Pilot decision, responsibilities & acceptance"}
      </summary>
      <h3>{uk ? "Рішення для Ради" : "Decision for the Board"}</h3>
      <p>{BOARD_DECISION[locale]}</p>
      <h3>{uk ? "Щоденна відповідальність" : "Operational responsibility"}</h3>
      <p>{BOARD_RESPONSIBILITIES[locale]}</p>
      <h3>{uk ? "Запропоновані перевірки приймання ядра" : "Proposed core acceptance checks"}</h3>
      <ul>
        {CORE_ACCEPTANCE[locale].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <small>
        {uk
          ? "Це основа для погодження ТЗ, не твердження, що всі можливості вже реалізовані в прототипі."
          : "A basis for agreeing the specification; not a claim that the prototype already implements every capability."}
      </small>
    </details>
  );
}
