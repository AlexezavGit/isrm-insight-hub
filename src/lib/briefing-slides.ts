import type { Copy } from "./client-catalog";
import type { GraphLayers } from "@/components/NetworkGraph";
export type BriefingSlide = {
  label: Copy;
  projectName?: Copy;
  title: Copy;
  body: Copy;
  note: Copy;
  principle: Copy;
  steps: Copy[];
  layers: GraphLayers;
};
export const BRIEFING_SLIDES: BriefingSlide[] = [
  {
    label: { en: "Professional scale", uk: "Масштаб професійної мережі" },
    title: {
      en: "Scale works through a professional network.",
      uk: "Масштаб працює через професійну мережу.",
    },
    body: {
      en: "A broad enquiry is less precise than a targeted one. Scale becomes useful when professionals stand behind their judgements and work to shared policies. ISRM could provide that professional centre; technology helps the network extend its reach.",
      uk: "Масовий запит менш точний, ніж точковий. Масштаб стає перевагою, коли його забезпечують професіонали, готові відповідати репутацією за висновки й діяти за спільними політиками. ISRM може стати таким професійним ядром.",
    },
    principle: {
      en: "The network offers reach that is costly for a single source.",
      uk: "Мережа дає охоплення, якого одному джерелу досягати дорого.",
    },
    note: {
      en: "11,000+ LinkedIn contacts is the audience cited in your enquiry. Conversion and return need testing; they are not assumed.",
      uk: "Понад 11 000 LinkedIn-контактів — аудиторія з вашого запиту. Конверсію та віддачу потрібно перевірити; ми не припускаємо їх наперед.",
    },
    steps: [
      { en: "Professional confidence", uk: "Професійна впевненість" },
      { en: "Shared policies", uk: "Спільні політики" },
      { en: "Network reach", uk: "Мережеве охоплення" },
    ],
    layers: { sector: true, theme: false, hub: false, researchQueue: true },
  },
  {
    label: { en: "Value Solution Framework", uk: "Value Solution Framework" },
    title: { en: "AI prepares. Professionals verify.", uk: "AI готує. Професіонали перевіряють." },
    body: {
      en: "Professional judgement frames the question and the evidence required. AI assists the enquiry; a named professional reviews the conclusion and takes responsibility for how another person’s expertise is represented.",
      uk: "Професійне судження задає питання й вимоги до доказів. AI допомагає досліджувати; фахівець перевіряє висновок і відповідає за те, як представлено чужу експертизу.",
    },
    principle: {
      en: "Stand behind the judgement. Keep it open to review.",
      uk: "За судженням — ім’я й репутація. Висновок відкритий до перегляду.",
    },
    note: {
      en: "Retain the source, date, reviewer, access rules and correction route. AI OSINT is proposed; it is not connected in this demonstration.",
      uk: "Зберігаємо джерело, дату, відповідального, правила доступу й шлях виправлення. AI OSINT запропоновано; у демонстрації його ще не підключено.",
    },
    steps: [
      { en: "Professional review", uk: "Професійне судження" },
      { en: "Source evidence", uk: "Джерела й докази" },
      { en: "AI-assisted checks", uk: "Перевірки з AI" },
      { en: "Controlled reuse", uk: "Контрольоване використання" },
    ],
    layers: { sector: false, theme: true, hub: false, researchQueue: true },
  },
  {
    label: { en: "ISRM + its members", uk: "ISRM + члени асоціації" },
    title: {
      en: "Map expertise. Make collaboration possible.",
      uk: "Мапуємо експертизу. Поєднуємо спроможності.",
    },
    body: {
      en: "Professional opportunities often travel by word of mouth. A shared chapter dashboard could connect expertise, needs and introductions across the network, supporting collaboration and relevant opportunities beyond each person’s immediate contacts.",
      uk: "Професійні можливості часто передаються з уст в уста. Спільний дашборд чаптерів може поєднати експертизу, потреби й знайомства — та розширити взаємодію за межі особистого кола контактів.",
    },
    principle: {
      en: "Engage the 35 chapters through the existing questionnaire.",
      uk: "Залучаємо 35 чаптерів через наявний опитувальник.",
    },
    note: {
      en: "First establish needs, willingness to participate and review capacity. An ongoing cycle connects these with learning, membership, partnerships and conferences.",
      uk: "Спочатку визначаємо потреби, готовність долучитися й ресурс перевірки. Постійний цикл пов’язує їх із навчанням, членством, партнерствами та конференціями.",
    },
    steps: [
      { en: "35 chapters · listen", uk: "35 чаптерів · почути" },
      { en: "Expertise · connect", uk: "Експертиза · поєднати" },
      { en: "Opportunities · act", uk: "Можливості · діяти" },
    ],
    layers: { sector: true, theme: false, hub: true, researchQueue: true },
  },
  {
    label: { en: "Shared value", uk: "Взаємна користь" },
    title: {
      en: "A digital capability. A win for everyone.",
      uk: "Цифрове плече розвитку. Виграють усі.",
    },
    body: {
      en: "Members gain useful tools and professional opportunities. Clients gain better-supported decisions. ISRM gains stronger connections and reusable expertise. The application, AI OSINT and the professional network form a continuing capability: a fishing rod for future enquiries.",
      uk: "Члени отримують інструменти й можливості. Клієнти — краще обґрунтовані рішення. ISRM — розвиток зв’язків і повторно використовуваної експертизи. Застосунок, AI OSINT і професіонали утворюють постійну спроможність — вудку для наступних запитів.",
    },
    principle: {
      en: "Trust → reputation → professional value.",
      uk: "Довіра → репутація → гонорар.",
    },
    note: {
      en: "Members: useful tools and opportunities. Clients: better-supported decisions. ISRM: stronger services, connections and reusable expertise.",
      uk: "Членам — інструменти й можливості. Клієнтам — краще обґрунтовані рішення. ISRM — розвиток сервісів, зв’язків і повторно використовуваної експертизи.",
    },
    steps: [
      { en: "Members", uk: "Члени" },
      { en: "Clients", uk: "Клієнти" },
      { en: "ISRM", uk: "ISRM" },
    ],
    layers: { sector: true, theme: true, hub: true, researchQueue: true },
  },
  {
    label: { en: "A possibility to discuss", uk: "Можливий напрям для розмови" },
    title: {
      en: "Expertise + AI. A direction worth exploring?",
      uk: "Експертиза + AI. Напрям, вартий розмови?",
    },
    projectName: {
      en: "Safer professional communication and stronger trust in network expertise across ISRM’s sphere of influence.",
      uk: "Розвиток безпеки професійних комунікацій та зміцнення довіри до носіїв мережевої експертизи в зоні впливу ISRM.",
    },
    body: {
      en: "Within professional-to-professional relationships, expertise + AI may offer a useful, multifaceted direction. An exploratory thought that could be interesting to discuss.",
      uk: "У professional-to-professional експертиза + AI можуть стати корисним і багатогранним напрямом. Гіпотеза, яку було б цікаво обговорити.",
    },
    principle: {
      en: "Perhaps a conversation to continue.",
      uk: "Можливо, привід продовжити розмову.",
    },
    note: {
      en: "An exploratory thought beyond the original enquiry; no model, ranking or additional programme is proposed for approval here.",
      uk: "Гіпотеза поза початковим запитом; погодження моделі, рейтингу чи додаткової програми тут не пропонується.",
    },
    steps: [
      { en: "Professional expertise", uk: "Професійна експертиза" },
      { en: "AI assistance", uk: "Підтримка AI" },
      { en: "Considered judgement", uk: "Виважене судження" },
    ],
    layers: { sector: false, theme: true, hub: true, researchQueue: true },
  },
  {
    label: { en: "Our next step together", uk: "Наш наступний спільний крок" },
    title: {
      en: "Explore. Define priorities. Shape the proposal.",
      uk: "Дослідімо. Визначмо пріоритети. Узгодьмо напрям.",
    },
    body: {
      en: "Explore the supplied sample. Choose useful capabilities and workflows, or describe your own scenario. Review the scope and indicative budget; together we can shape a detailed specification, timetable and formal proposal.",
      uk: "Перегляньте передану вибірку. Оберіть можливості та workflow або опишіть свій сценарій. Перевірте обсяг і бюджетний орієнтир — далі разом сформуємо ТЗ, строки й детальну пропозицію.",
    },
    principle: {
      en: "An informed next conversation, with a concrete starting point.",
      uk: "Предметна наступна розмова з конкретною основою.",
    },
    note: {
      en: "Core application + two independent optional workflows. Three delivery payments: 30% / 50% / 20%. This briefing does not commission work.",
      uk: "Базовий застосунок + два незалежні опційні workflow. Три платежі за етапами: 30% / 50% / 20%. Цей брифінг не є замовленням робіт.",
    },
    steps: [
      { en: "Explore the network", uk: "Переглянути мережу" },
      { en: "Scope & budget", uk: "Обсяг і бюджет" },
      { en: "Tailored proposal", uk: "Детальна пропозиція" },
    ],
    layers: { sector: true, theme: true, hub: false, researchQueue: true },
  },
];
