import type { Copy } from "./client-catalog";
import type { GraphLayers } from "@/components/NetworkGraph";
export type BriefingSlide = {
  label: Copy;
  title: Copy;
  body: Copy;
  note: Copy;
  insight: Copy;
  principle: Copy;
  steps: Copy[];
  layers: GraphLayers;
};
const copy = (en: string, uk: string): Copy => ({ en, uk });
const slide = (label: Copy, title: Copy, body: Copy, note = copy("", "")): BriefingSlide => ({
  label,
  title,
  body,
  note,
  insight: copy("", ""),
  principle: copy("", ""),
  steps: [],
  layers: { sector: true, theme: false, hub: false, researchQueue: true },
});
/** Accepted 14 November 2026; one source for the web presentation and all printed pages. */
export const BRIEFING_SLIDES: BriefingSlide[] = [
  slide(
    copy("The capability gap", "Зміна спроможності працювати з даними"),
    copy("AI changes how we access and use data.", "ШІ змінює доступність і використання даних."),
    copy(
      "With suitable sources and a clear enquiry, AI can help you gather initial information faster. This shift calls for different approaches and tools to process it at scale and turn it into a steady flow of expertise, interaction and resources.",
      "За наявності потрібних джерел і чіткого запиту ШІ може допомогти швидше зібрати первинну інформацію. Ця зміна потребує інших підходів та інструментів, щоб опрацьовувати її у великому обсязі й перетворювати на сталий потік експертизи, взаємодії та ресурсів.",
    ),
  ),
  slide(
    copy("Data that exists is not data that works", "Від запису до дії"),
    copy("Each record needs a path to action.", "Кожному запису потрібен шлях до дії."),
    copy(
      "Data that exists is not data that works. Name the person who controls access, keeps the information current and follows through on the next step. Record the outcome so colleagues can use what the interaction taught them.",
      "Наявність даних ще не означає їх використання. Визначте, хто керує доступом, оновлює інформацію й відповідає за наступний крок. Зафіксуйте результат, щоб колеги могли використати досвід цієї взаємодії.",
    ),
  ),
  slide(
    copy(
      "A standing resource rather than a one-off study",
      "Постійний ресурс замість разового дослідження",
    ),
    copy(
      "Keep expertise current through the work that needs it.",
      "Підтримуйте актуальність експертизи через роботу, для якої вона потрібна.",
    ),
    copy(
      "We began building this for our own consulting work. We had not found the combination of functions we needed in the proprietary tools we tried. Consultants need current evidence for current assignments; AI can assist, while they remain responsible for checking it. An association offers a pilot setting where colleagues could maintain and use shared expertise.",
      "Ми почали розробку для власної консалтингової роботи: у випробуваних пропрієтарних рішеннях не знайшли потрібного поєднання функцій. Консультантам потрібні актуальні докази для поточних завдань; ШІ може допомагати, а перевірка залишається їхньою відповідальністю. Асоціація дає середовище для пілоту, де колеги могли б підтримувати й використовувати спільну експертизу.",
    ),
  ),
  slide(
    copy("What it looks like · ISRM research", "Як це виглядає · дослідження для ISRM"),
    copy(
      "The ISRM demonstration returns the first research results.",
      "Демонстрація повертає ISRM перші результати дослідження.",
    ),
    copy(
      "ISRM shared 178 records. We have gathered initial public-source information on 45 identified profiles; research continues, and its depth can change. The graph shows the attributes recorded so far. Further research can add fields and detail.",
      "ISRM передала 178 записів. Зібрано перші дані з відкритих джерел щодо 45 ідентифікованих профілів; дослідження триває, а його глибину можна змінити. Граф показує наявні записані атрибути. Подальше дослідження може розширити їх перелік і деталізацію.",
    ),
    copy(
      "Research sheet: 28 August 2026. Initial findings do not establish professional endorsement or consent to contact. Selections are saved in this browser.",
      "Дослідницький аркуш — станом на 28 серпня 2026 року. Перші результати не означають професійної рекомендації чи згоди на контакт. Відбір зберігається в цьому браузері.",
    ),
  ),
  slide(
    copy("Where it could go", "Подальші застосування"),
    copy(
      "From a working search to connected workflows.",
      "Від робочого пошуку до пов’язаних процесів.",
    ),
    copy(
      "Working data, a suitable tool and people who can use it are the starting point. Policies, standards and agreed procedures guide their work. The configurator illustrates functions you could combine around your processes, from research assistance to member engagement and team formation. Through use, colleagues could build shared expertise and support organisational development.",
      "Початок — дані, придатні до роботи, відповідний інструмент і люди, здатні ним користуватися. Політики, стандарти й погоджені процедури спрямовують їхню роботу. Конфігуратор показує функції, які можна поєднувати під свої процеси: дослідницьку допомогу, залучення учасників, формування команд. Під час використання колеги могли б накопичувати спільну експертизу й підтримувати організаційний розвиток.",
    ),
    copy(
      "Configuration for discussion. Planned services require development.",
      "Конфігурація для обговорення. Заплановані сервіси потребують розроблення.",
    ),
  ),
  slide(
    copy("Privacy and consent by design", "Приватність і згода в основі проєктування"),
    copy(
      "Seeing a profile should not mean unrestricted access.",
      "Перегляд профілю не повинен означати необмежений доступ.",
    ),
    copy(
      "A useful network needs clear rules for who can see, review and share information. A source record, a colleague’s recommendation and a person’s consent are different things. Introductions need an agreed route and permission to disclose contact details.",
      "Корисній мережі потрібні чіткі правила: хто може бачити, перевіряти й передавати інформацію. Запис у джерелі, рекомендація колеги та згода персони — різні речі. Для знайомства потрібні погоджений шлях і дозвіл розкрити контактні дані.",
    ),
    copy(
      "The demonstration masks direct contacts. Operational access, consent and retention rules require agreement and implementation.",
      "Демонстрація маскує прямі контакти. Операційні правила доступу, згоди та зберігання потребують погодження й реалізації.",
    ),
  ),
  slide(
    copy("Integration landscape", "Поле інтеграції"),
    copy(
      "Connect the systems you use to the expertise you need.",
      "Поєднайте свої системи з потрібною експертизою.",
    ),
    copy(
      "Membership, learning and publication systems can supply information. The proposed integration layer would connect permitted records to expertise, sources and professional review, then return agreed results to the systems you use. You would choose where AI assistance belongs.",
      "Системи членства, навчання й публікацій можуть надавати інформацію. Запропонований інтеграційний шар пов’язував би дозволені записи з експертизою, джерелами й професійною перевіркою, а погоджені результати повертав би до ваших систем. Ви визначаєте, де потрібна допомога ШІ.",
    ),
    copy(
      "Target architecture. Connectors and shared storage require development. Operational AI research is not connected in this demonstration.",
      "Цільова архітектура. Конектори та спільне сховище потребують розроблення. Операційне ШІ-дослідження в цій демонстрації не підключено.",
    ),
  ),
  slide(
    copy("An invitation, not an offer", "Запрошення до відгуку"),
    copy("We would value your view", "Будемо вдячні за вашу думку."),
    copy(
      "Please explore the demonstration when convenient. We would value your view on what is useful, what you would change, and how it relates to your organisation’s work. Think of it as a visit to our workshop using the ISRM research sample.",
      "Огляньте демонстрацію у зручний час. Будемо вдячні за думку: що корисне, що ви змінили б і як це пов’язано з роботою вашої організації. Сприймайте це як візит до нашої майстерні на прикладі дослідницької вибірки ISRM.",
    ),
  ),
];
