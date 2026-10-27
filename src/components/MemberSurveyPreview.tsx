import { Link } from "@tanstack/react-router";
import { useClientDraft } from "./ClientDraftProvider";
import type { ClientLocale } from "@/lib/client-catalog";
import { includeClientRequest } from "@/lib/client-draft";
const questions = [
  {
    en: "Where would better access to colleagues or information help you most?",
    uk: "Де кращий доступ до колег або інформації допоміг би вам найбільше?",
  },
  {
    en: "What expertise, resources or practical experience could you contribute?",
    uk: "Якою експертизою, ресурсами чи практичним досвідом ви могли б поділитися?",
  },
  {
    en: "Which support would you use first: search, reviewed research, introductions, learning or a professional discussion?",
    uk: "Чим ви скористалися б спочатку: пошуком, перевіреним дослідженням, знайомствами, навчанням чи професійною дискусією?",
  },
  {
    en: "What currently makes it difficult to take part or share useful knowledge?",
    uk: "Що зараз заважає долучатися або ділитися корисними знаннями?",
  },
  {
    en: "Would you like a separate invitation to discuss your contribution or a pilot?",
    uk: "Чи бажаєте отримати окреме запрошення обговорити свій внесок або пілот?",
  },
];
export function MemberSurveyPreview({ locale }: { locale: ClientLocale }) {
  const { draft, update, ready } = useClientDraft(),
    uk = locale === "uk";
  return (
    <section className="member-survey-preview">
      <p>
        {uk
          ? "Коротка версія для першого обговорення, на основі наявної чернетки. Тут відповіді не збираються й нічого не надсилається."
          : "A short opening version based on the existing draft. This preview collects no responses and sends nothing."}
      </p>
      <ol>
        {questions.map((q) => (
          <li key={q.en}>{q[locale]}</li>
        ))}
      </ol>
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
      <details>
        <summary>{uk ? "Повна вихідна чернетка" : "Full original draft"}</summary>
        <a href="/ISRM_Community_Member_Survey_Draft.md" target="_blank" rel="noreferrer">
          {uk ? "Переглянути повний документ" : "Read the full document"}
        </a>
      </details>
    </section>
  );
}
