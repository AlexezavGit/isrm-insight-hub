export const GUIDE_STORAGE_KEY = "isrm-network-guide-v1";
export const GUIDE_STEPS = [
  {
    id: "search",
    title: { en: "Find relevant expertise", uk: "Знайдіть потрібну експертизу" },
    body: {
      en: "Use Search to enter a name or choose an area of expertise, sector or country. The graph shows the matching records in this sample.",
      uk: "У пошуку введіть ім’я або оберіть експертизу, сектор чи країну. Граф покаже відповідні записи цієї вибірки.",
    },
  },
  {
    id: "connections",
    title: { en: "See what connects these profiles", uk: "Побачте, що поєднує профілі" },
    body: {
      en: "Hover over a node to highlight its direct connections; on a touch screen, tap it for details. Zoom in for names. Shared categories do not establish a personal introduction.",
      uk: "Наведіть на вузол, щоб підсвітити прямі зв’язки; на сенсорному екрані торкніться для деталей. Наблизьте для імен. Спільна категорія не означає особистого знайомства.",
    },
  },
  {
    id: "dossier",
    title: { en: "Review the profile and evidence", uk: "Перегляньте профіль і джерела" },
    body: {
      en: "Check the person's expertise, organisation and source record status. Full dossier opens the available detail. These supplied records are not a live OSINT assessment.",
      uk: "Перегляньте експертизу, організацію та статус запису у джерелі. Повне досьє відкриває наявні деталі. Передані записи не є поточною OSINT-перевіркою.",
    },
  },
  {
    id: "save",
    title: {
      en: "Keep the people you wish to consider",
      uk: "Збережіть тих, кого варто розглянути",
    },
    body: {
      en: "Choose Add to shortlist in the profile. The group counter confirms your selection. Adding a profile does not contact the person or assign them to a task.",
      uk: "Натисніть «Додати до відбору» у профілі. Лічильник групи підтвердить вибір. Це не надсилає повідомлення людині й не призначає її на завдання.",
    },
  },
  {
    id: "shortlist",
    title: { en: "Your shortlist is ready to review", uk: "Ваш відбір готовий до перегляду" },
    body: {
      en: "Name the group, review profiles and remove anyone you no longer wish to include. The selection stays in this browser. You can now explore Workflows or take your priorities to Scope & budget.",
      uk: "Назвіть групу, перегляньте профілі й за потреби приберіть зайві. Відбір зберігається в цьому браузері. Далі можна дослідити workflow або перейти з пріоритетами до «Обсяг і бюджет».",
    },
  },
] as const;

export function guideNext(
  step: number,
  profileAvailable: boolean,
  profileShortlisted: boolean,
): number | null {
  if (step === 1 && !profileAvailable) return step;
  if (step === 3 && !profileShortlisted) return step;
  return step >= GUIDE_STEPS.length - 1 ? null : step + 1;
}
