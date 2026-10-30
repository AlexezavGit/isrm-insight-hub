import type { ClientLocale } from "./client-catalog";

export const SCOPE_DELIVERY_HEADING = {
  en: "SCOPE, CHANGES & DELIVERY",
  uk: "ОБСЯГ, ЗМІНИ ТА ВИКОНАННЯ",
};

export const SCOPE_DELIVERY_STATUS = {
  en: "Proposed arrangements for discussion. The detailed proposal and agreement will define the final terms.",
  uk: "Запропонований порядок для обговорення. Остаточні умови визначатимуть детальна пропозиція та угода.",
};

const notes = [
  {
    id: "workload",
    title: { en: "Current workload", uk: "Нинішнє навантаження" },
    body: {
      en: "Use an agreed enquiry to measure the time spent finding expertise, checking sources and preparing a shortlist. Compare the proposed approach with current practice before estimating savings or wider benefits.",
      uk: "На погодженому запиті виміряти час на пошук експертизи, перевірку джерел і підготовку відбору. Порівняти запропонований підхід із поточною практикою до оцінки економії та ширшої користі.",
    },
  },
  {
    id: "boundaries",
    title: { en: "Scope boundaries", uk: "Межі обсягу" },
    body: {
      en: "The specification will name the included capabilities, data volumes, sources and integrations. Additional connectors, migration, native mobile apps, model training and ongoing operations require separate assessment unless explicitly included. Identify licence and usage charges separately.",
      uk: "ТЗ визначить включені можливості, обсяги даних, джерела й інтеграції. Додаткові підключення, міграція, нативні мобільні застосунки, навчання моделей і постійне обслуговування потребують окремої оцінки, якщо їх прямо не включено. Ліцензії та оплату використання зазначити окремо.",
    },
  },
  {
    id: "changes",
    title: { en: "Changes to the scope", uk: "Зміна обсягу" },
    body: {
      en: "Record each requested change and assess its effect on outcomes, dependencies, price and timetable before agreeing it in writing. Distinguish additional capabilities from correcting a defect against the agreed requirements.",
      uk: "Кожну запитану зміну описати й оцінити її вплив на результати, залежності, ціну та строки до письмового погодження. Відрізняти додаткові можливості від виправлення дефекту щодо погоджених вимог.",
    },
  },
  {
    id: "budget",
    title: { en: "Budget control", uk: "Бюджетний контроль" },
    body: {
      en: "Agree the pricing basis, budget limit and escalation point in the detailed proposal. Flag a forecast overrun with options before the limit is reached. Additional chargeable work requires written authorisation; no hours cap is assumed here.",
      uk: "У детальній пропозиції погодити модель оплати, бюджетну межу й момент повідомлення про ризик перевищення. Повідомляти про прогнозоване перевищення та можливі рішення до досягнення межі. Додаткові платні роботи потребують письмового дозволу; ліміт годин тут не встановлюється.",
    },
  },
  {
    id: "acceptance",
    title: { en: "Acceptance and warranty", uk: "Приймання та гарантія" },
    body: {
      en: "Agree acceptance tests, evidence, review period and an authorised ISRM reviewer for each delivery stage. Record acceptance separately from warranty. Define defect correction, any warranty period, support hours and response targets in the agreement.",
      uk: "Для кожного етапу погодити перевірки приймання, докази, строк розгляду й уповноваженого представника ISRM. Фіксувати приймання окремо від гарантії. Порядок виправлення дефектів, можливий гарантійний строк, години підтримки й строки реагування визначити в угоді.",
    },
  },
] as const;

export function scopeDeliveryNotes(locale: ClientLocale) {
  return notes.map((note) => ({
    id: note.id,
    title: note.title[locale],
    body: note.body[locale],
  }));
}
