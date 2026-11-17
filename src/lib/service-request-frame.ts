export type ServiceFrameField =
  "userRole" | "need" | "behavior" | "outcome" | "dataIntegration" | "acceptance";
export const SERVICE_FRAME_FIELDS: {
  id: ServiceFrameField;
  en: string;
  uk: string;
  helpEn: string;
  helpUk: string;
  rows: number;
}[] = [
  {
    id: "userRole",
    en: "Who needs this service, and in what role?",
    uk: "Кому потрібен цей сервіс і в якій ролі?",
    helpEn: "Name the user group and the situation in which they would use it.",
    helpUk: "Вкажіть групу користувачів і ситуацію, у якій вони скористаються сервісом.",
    rows: 2,
  },
  {
    id: "need",
    en: "What gap or problem should it address?",
    uk: "Яку потребу або проблему він має закрити?",
    helpEn: "Describe what is difficult or missing today, not a proposed feature list.",
    helpUk: "Опишіть, чого зараз бракує або що не працює, а не перелік бажаних функцій.",
    rows: 3,
  },
  {
    id: "behavior",
    en: "What should the service let people do?",
    uk: "Що саме людина має мати змогу зробити?",
    helpEn: "Compare the alternatives you have in mind, or describe another preferred flow.",
    helpUk: "Порівняйте варіанти, які розглядаєте, або опишіть бажаний процес інакше.",
    rows: 4,
  },
  {
    id: "outcome",
    en: "What useful result should it produce?",
    uk: "Який корисний результат він має дати?",
    helpEn: "Describe an observable output or decision that would show the service helped.",
    helpUk: "Опишіть видимий результат або рішення, за яким можна оцінити користь сервісу.",
    rows: 2,
  },
  {
    id: "dataIntegration",
    en: "What information or system connection is required?",
    uk: "Які дані або інтеграція потрібні?",
    helpEn: "Identify the source, access boundary and any system it must work with.",
    helpUk: "Назвіть джерело, межі доступу та системи, з якими потрібно взаємодіяти.",
    rows: 3,
  },
  {
    id: "acceptance",
    en: "How will you decide the change is complete?",
    uk: "Як визначити, що зміну виконано?",
    helpEn: "State a checkable acceptance condition; avoid a general goal such as “better”.",
    helpUk: "Задайте перевірювану умову приймання, а не загальну мету на кшталт «краще».",
    rows: 2,
  },
];

export const emptyServiceFrame = (): Record<ServiceFrameField, string> => ({
  userRole: "",
  need: "",
  behavior: "",
  outcome: "",
  dataIntegration: "",
  acceptance: "",
});
export function missingRequirementFields(
  title: string,
  values: Pick<Record<ServiceFrameField, string>, "need" | "outcome">,
) {
  return (["title", "need", "outcome"] as const).filter(
    (key) => !(key === "title" ? title : values[key]).trim(),
  );
}
export function serviceFrameText(values: Record<ServiceFrameField, string>, locale: "en" | "uk") {
  return SERVICE_FRAME_FIELDS.filter((field) => values[field.id].trim())
    .map((field) => `${field[locale]}\n${values[field.id].trim()}`)
    .join("\n\n");
}
