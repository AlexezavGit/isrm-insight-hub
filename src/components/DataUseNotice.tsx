import { useDismissibleDetails } from "./useDismissibleDetails";
import { useI18n } from "@/lib/i18n";
/** Layered demonstration information; not a claim of legal approval or a live operational policy. */
export function DataUseNotice({
  context = "network",
  compact = false,
}: {
  context?: "network" | "scope" | "profile";
  compact?: boolean;
}) {
  const { locale } = useI18n();
  const uk = locale === "uk";
  const hint = useDismissibleDetails();
  return (
    <details ref={hint} className={`client-data-notice client-data-notice-${context}`}>
      <summary>
        {compact
          ? uk
            ? "Дані й OSINT"
            : "Data & OSINT"
          : uk
            ? "Дані, доступ і професійна відповідальність"
            : "Data, access & professional responsibility"}
      </summary>
      <p>
        {uk
          ? "Робоча демонстрація на переданій вибірці. Відкритий перегляд використовує кодовані профілі; приватні деталі доступні після авторизованого входу. Кодований профіль може залишатися персональними даними."
          : "Working demonstration using the supplied sample. The public view uses coded profiles; private details require authorised sign-in. A coded profile may still constitute personal data."}
      </p>
      <p>
        {uk
          ? "Тематична відповідність, позначка джерела чи перегляд запису не є акредитацією, рекомендацією ISRM, оцінкою репутації або підтвердженням готовності до співпраці. Висновки потребують контексту й професійної перевірки."
          : "A thematic match, source label or reviewed record is not accreditation, an ISRM endorsement, a reputation score or confirmation of willingness to collaborate. Findings require context and professional review."}
      </p>
      <p>
        {uk
          ? "AI OSINT у демонстрації не підключено; ця функціональність не передає профілі для AI-дослідження або навчання моделей. Для операційного запуску окремо визначаються цілі, правова підстава, відповідальні за обробку, одержувачі, строки зберігання та порядок реалізації прав."
          : "AI OSINT is not connected in this demonstration; this functionality does not submit profiles for AI research or model training. Operational use requires separately established purposes, lawful basis, controller responsibilities, recipients, retention periods and a rights process."}
      </p>
      {context === "scope" && (
        <p>
          {uk
            ? "Вибір і контактні поля зберігаються в цьому браузері. Підготовка листа відкриває ваш поштовий застосунок; після надсилання дані отримають зазначені у листі адресати. Локальну чернетку можна видалити через налаштування даних цього сайту в браузері."
            : "Selections and contact fields are stored in this browser. Preparing an email opens your mail app; sending it discloses the contents to the recipients shown in the message. You can remove the local draft through your browser’s site-data settings."}
        </p>
      )}
      <p>
        <a href="mailto:alexezav@gmail.com?subject=ISRM%20demonstration%20data%20enquiry">
          {uk
            ? "Запит щодо даних, виправлення або обмеження доступу — команді демонстрації"
            : "Contact the demonstration team about data, corrections or restricted access"}
        </a>
      </p>
    </details>
  );
}
