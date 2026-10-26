export const BRIEFING_MILESTONES = [
  {
    id: "feasibility",
    fraction: 0.3,
    title: { en: "Feasibility & agreement", uk: "Оцінка здійсненності та угода" },
    detail: {
      en: "Agree the detailed specification, permitted data sources, human review responsibilities, AI assistance, delivery timetable and final price. Sign the agreement before implementation.",
      uk: "Погодити детальне технічне завдання, дозволені джерела даних, відповідальних за людську перевірку, використання ШІ, строки й остаточну ціну. Підписати угоду до початку реалізації.",
    },
    results: {
      en: [
        "Approve the detailed specification and proposal, including requested capabilities, AI agent roles, permitted data and professional review arrangements.",
        "Agree the delivery period and budget; formalise the relationship through a signed agreement.",
        "Expected payment: 30% of the agreed total budget.",
      ],
      uk: [
        "Погодити детальне ТЗ і пропозицію: функціональність, власні запити, кількість і спеціалізації ШІ-агентів, дозволені дані та порядок професійної перевірки.",
        "Оцінити період виконання й бюджет; формалізувати відносини підписанням угоди.",
        "Очікуваний платіж — 30% погодженого загального бюджету.",
      ],
    },
    acceptance: {
      en: "Approved specification and signed agreement",
      uk: "Погоджене технічне завдання та підписана угода",
    },
  },
  {
    id: "initial-deployment",
    fraction: 0.5,
    title: { en: "Initial deployment & integration", uk: "Перший запуск та інтеграція" },
    detail: {
      en: "Provide the agreed ISRM user group with a testable application or service. Collect feedback, connect approved existing systems and record acceptance and any corrections required.",
      uk: "Надати погодженому колу користувачів ISRM застосунок або сервіс для тестування. Зібрати відгуки, підключити погоджені наявні системи й зафіксувати приймання та потрібні виправлення.",
    },
    results: {
      en: [
        "Provide the agreed ISRM user group with software or access to a digital service for testing; collect feedback.",
        "Integrate the agreed existing ISRM systems and services for internal and external use.",
        "Record acceptance and commitments to correct issues; consider additional proposals through separate scope agreement.",
        "Payment: 50% of the agreed budget.",
      ],
      uk: [
        "Передати застосунок або доступ до цифрового сервісу погодженому колу користувачів ISRM для тестування; зібрати зауваження й пропозиції.",
        "Виконати погоджені інтеграції з наявними системами й сервісами ISRM для внутрішнього та зовнішнього використання.",
        "Зафіксувати приймання робіт і зобов’язання усунути зауваження; нові пропозиції розглянути через окреме погодження обсягу.",
        "Оплата — 50% погодженого бюджету.",
      ],
    },
    acceptance: {
      en: "Tested release, integration review and acceptance record",
      uk: "Протестований запуск, перевірка інтеграцій та акт приймання",
    },
  },
  {
    id: "operations",
    fraction: 0.2,
    title: { en: "Operational refinement & handover", uk: "Налаштування роботи та передача" },
    detail: {
      en: "Refine the service around ISRM's actual working practices, complete the agreed corrections and hand over code or usage rights as contracted. Wider access and further development require ISRM's decision.",
      uk: "Налаштувати сервіс під реальні практики ISRM, завершити погоджені виправлення й передати код або права користування за договором. Розширення доступу та подальша розробка потребують рішення ISRM.",
    },
    results: {
      en: [
        "Tailor the service to ISRM user profiles and working patterns, including agreed operational refinements.",
        "Decide on wider access and registration, a new expansion specification, and whether and how the relationship continues.",
        "Hand over the code or service usage rights agreed at stage one.",
        "Payment: 20% of the agreed budget.",
      ],
      uk: [
        "Налаштувати сервіс під профілі й робочі патерни користувачів ISRM; завершити погоджені операційні вдосконалення.",
        "За рішенням ISRM відкрити ширший доступ і реєстрацію, погодити нове ТЗ на розширення та визначити продовження або припинення відносин і їхній формат.",
        "Передати програмний код або ліцензію на цифрові сервіси на умовах, погоджених на першому етапі.",
        "Оплата — 20% погодженого бюджету.",
      ],
    },
    acceptance: {
      en: "Agreed corrections completed and handover accepted",
      uk: "Погоджені виправлення завершено, передачу прийнято",
    },
  },
] as const;
