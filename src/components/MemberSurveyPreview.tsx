import { Link } from "@tanstack/react-router";
import { useClientDraft } from "./ClientDraftProvider";
import type { ClientLocale } from "@/lib/client-catalog";
import { includeClientRequest } from "@/lib/client-draft";
import surveyDraft from "../../public/ISRM_Community_Member_Survey_Draft.md?raw";

function SurveyDocument() {
  const text = surveyDraft.slice(surveyDraft.indexOf("## Proposed introduction"));
  return (
    <div className="survey-document">
      {text
        .trim()
        .split(/\n\n+/)
        .map((block, index) => {
          if (block.startsWith("### ")) return <h4 key={index}>{block.slice(4)}</h4>;
          if (block.startsWith("## ")) return <h3 key={index}>{block.slice(3)}</h3>;
          if (block.startsWith("- "))
            return (
              <ul key={index}>
                {block.split("\n").map((line, i) => (
                  <li key={i}>{line.replace(/^- /, "")}</li>
                ))}
              </ul>
            );
          return <p key={index}>{block.replace(/\*\*/g, "")}</p>;
        })}
    </div>
  );
}
export function MemberSurveyPreview({ locale }: { locale: ClientLocale }) {
  const { draft, update, ready } = useClientDraft(),
    uk = locale === "uk";
  return (
    <section className="member-survey-preview">
      <p>
        {uk
          ? "Погоджена англійська чернетка: 8 основних запитань, варіанти відповідей і умови запуску. Тут відповіді не збираються й нічого не надсилається."
          : "The agreed draft questionnaire: eight opening questions, response options and launch conditions. This preview collects no responses and sends nothing."}
      </p>
      <SurveyDocument />
      <p className="network-panel-note">
        {uk
          ? "Участь добровільна. Дозволи на контакт, публічне авторство й подальшу участь погоджуються окремо. Перед запуском слід визначити відповідального та правила використання відповідей."
          : "Participation is voluntary. Contact, public attribution and further participation are agreed separately. A survey owner and rules for use of responses must be defined before launch."}
      </p>
      <Link
        className={`network-folder-button ${!ready ? "is-disabled" : ""}`}
        aria-disabled={!ready}
        to="/scope"
        onClick={(e) => {
          if (!ready) {
            e.preventDefault();
            return;
          }
          update(
            includeClientRequest(draft, {
              id: "member-survey",
              kind: "service",
              title: uk ? "Опитування членів та правління ISRM" : "ISRM member and Board survey",
              description: uk
                ? "Погодити короткий опитувальник, групи одержувачів, дозволи, спосіб збору та агрегований аналіз відповідей. Запуск і бюджет визначити в пропозиції."
                : "Agree the short questionnaire, recipient groups, permissions, response collection and aggregate analysis. Define the launch and budget in the proposal.",
            }),
          );
        }}
      >
        {uk ? "Погодити опитування в scope" : "Include the survey in the scope discussion"}
      </Link>
      {draft.mode !== "full" && (
        <p className="network-panel-note">
          {uk
            ? "Збережемо як додатковий запит для обговорення. Обраний fallback і його ціна не зміняться; опитування потребує окремої оцінки."
            : "Saved as an additional request for discussion. Your simpler option and its price remain unchanged; the survey requires a separate estimate."}
        </p>
      )}
      <a
        className="network-context-action"
        href="/ISRM_Community_Member_Survey_Draft.md"
        target="_blank"
        rel="noreferrer"
      >
        {uk
          ? "Переглянути повний опитувальник для обговорення"
          : "Read the full discussion questionnaire"}
      </a>
    </section>
  );
}
