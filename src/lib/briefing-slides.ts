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
    label: { en: "A professional perspective", uk: "Професійна дружня порада" },
    title: {
      en: "11,000 contacts. Where is the lasting value?",
      uk: "11 тисяч контактів. Де тривала цінність?",
    },
    body: {
      en: "David, researching the entire LinkedIn audience would mean paying for AI research and thousands of human checks before knowing what they will return. The contact count alone tells us little about paid membership, conference attendance or client demand.",
      uk: "Девіде, дослідити всю LinkedIn-аудиторію означає оплатити AI-дослідження й тисячі людських перевірок ще до розуміння віддачі. Кількість контактів сама по собі мало говорить про платне членство, відвідування конференцій чи клієнтський попит.",
    },
    principle: {
      en: "Start with a useful question. Invest where the answer matters.",
      uk: "Почнімо з корисного питання. Інвестуймо там, де відповідь має значення.",
    },
    note: {
      en: "11,000+ LinkedIn contacts is the audience cited in your enquiry. Conversion and return need testing; they are not assumed.",
      uk: "Понад 11 000 LinkedIn-контактів — аудиторія з вашого запиту. Конверсію та віддачу потрібно перевірити; ми не припускаємо їх наперед.",
    },
    steps: [
      { en: "11,000+ contacts", uk: "11 000+ контактів" },
      { en: "A specific need", uk: "Конкретна потреба" },
      { en: "Targeted research", uk: "Цільове дослідження" },
    ],
    layers: { sector: true, theme: false, hub: false, researchQueue: true },
  },
  {
    label: { en: "Value Solution Framework", uk: "Value Solution Framework" },
    title: { en: "AI prepares. Professionals verify.", uk: "AI готує. Професіонали перевіряють." },
    body: {
      en: "Professional review starts before an AI enquiry: define the question, evidence and responsibility. The reviewer puts their name behind the judgement about another person’s expertise. AI helps gather and challenge evidence; a professional decides what can responsibly be relied upon, shared or revisited.",
      uk: "Професійна перевірка починається до AI-запиту: визначаємо питання, докази й відповідальність. Фахівець підписується під судженням про чужу експертизу. AI допомагає зібрати й критично перевірити матеріал; людина вирішує, що обґрунтовано використовувати, поширювати та переглядати.",
    },
    principle: {
      en: "A professional name behind a considered judgement.",
      uk: "За виваженим судженням — ім’я та репутація фахівця.",
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
      en: "Professional opportunities often travel by word of mouth. A shared chapter dashboard could make relevant expertise, needs and introductions easier to find, while preserving the judgement behind each recommendation. Members contribute to a network that can connect colleagues, develop ideas and create professional opportunities.",
      uk: "Професійні можливості часто передаються з уст в уста. Спільний дашборд чаптерів може зробити експертизу, потреби й знайомства доступнішими, зберігши судження за кожною рекомендацією. Члени розвивають мережу, яка поєднує колег, формує нові ідеї та відкриває професійні можливості.",
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
      en: "When convincing content can outpace reliable evidence, members, clients and ISRM share an interest in better-founded decisions. The application, AI OSINT and professional expertise form a continuing capability: a fishing rod for the network, with value beyond each individual enquiry.",
      uk: "Коли переконливий контент випереджає достовірні докази, члени, клієнти та ISRM однаково зацікавлені в обґрунтованих рішеннях. Застосунок, AI OSINT і професійна експертиза утворюють постійну спроможність — вудку для мережі, корисну далеко за межами окремого запиту.",
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
      en: "Within professional-to-professional relationships, this combination may already offer a useful, multifaceted direction. It could begin with support for colleagues’ everyday judgement, and reveal further possibilities through practice.",
      uk: "У межах professional-to-professional ця комбінація вже зараз може виявитися корисним і багатогранним напрямом. Почати можна з підтримки щоденних професійних суджень колег; подальші можливості покаже практика.",
    },
    principle: {
      en: "Perhaps there is a conversation worth continuing.",
      uk: "Можливо, ця розмова матиме продовження.",
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
      en: "Explore the supplied sample in the graph. Choose the core capabilities and optional workflows that would be useful, or describe your own scenario. Review the scope and indicative budget; we can then prepare a tailored specification, timetable and formal proposal.",
      uk: "Перегляньте передану вибірку в графі. Оберіть корисні можливості ядра й опційні workflow або опишіть власний сценарій. Перевірте обсяг та індикативний бюджет — далі підготуємо ТЗ, строки й формальну пропозицію під ваші пріоритети.",
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
