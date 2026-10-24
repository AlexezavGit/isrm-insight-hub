export const BRIEFING_MILESTONES = [
  {
    id: "feasibility",
    fraction: 0.3,
    title: { en: "Feasibility & agreement", uk: "Оцінка здійсненності та угода" },
    detail: {
      en: "Agree the detailed specification, permitted data sources, human review responsibilities, AI assistance, delivery timetable and final price. Sign the agreement before implementation.",
      uk: "Погодити детальне технічне завдання, дозволені джерела даних, відповідальних за людську перевірку, використання ШІ, строки й остаточну ціну. Підписати угоду до початку реалізації.",
    },
    acceptance: { en: "Approved specification and signed agreement", uk: "Погоджене технічне завдання та підписана угода" },
  },
  {
    id: "initial-deployment",
    fraction: 0.5,
    title: { en: "Initial deployment & integration", uk: "Перший запуск та інтеграція" },
    detail: {
      en: "Provide the agreed ISRM user group with a testable application or service. Collect feedback, connect approved existing systems and record acceptance and any corrections required.",
      uk: "Надати погодженому колу користувачів ISRM застосунок або сервіс для тестування. Зібрати відгуки, підключити погоджені наявні системи й зафіксувати приймання та потрібні виправлення.",
    },
    acceptance: { en: "Tested release, integration review and acceptance record", uk: "Протестований запуск, перевірка інтеграцій та акт приймання" },
  },
  {
    id: "operations",
    fraction: 0.2,
    title: { en: "Operational refinement & handover", uk: "Налаштування роботи та передача" },
    detail: {
      en: "Refine the service around ISRM's actual working practices, complete the agreed corrections and hand over code or usage rights as contracted. Wider access and further development require ISRM's decision.",
      uk: "Налаштувати сервіс під реальні практики ISRM, завершити погоджені виправлення й передати код або права користування за договором. Розширення доступу та подальша розробка потребують рішення ISRM.",
    },
    acceptance: { en: "Agreed corrections completed and handover accepted", uk: "Погоджені виправлення завершено, передачу прийнято" },
  },
] as const;