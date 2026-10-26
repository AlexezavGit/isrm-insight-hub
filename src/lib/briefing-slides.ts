import type { Copy } from "./client-catalog";
import type { GraphLayers } from "@/components/NetworkGraph";
export type BriefingSlide = {
  label: Copy;
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
      en: "Manual research at scale creates a costly bottleneck. Unreviewed AI findings create a credibility risk: one material error can undermine the service. Combine AI-assisted research with accountable expert review, and retain evidence for permitted reuse.",
      uk: "Ручне дослідження в масштабі створює дороге вузьке місце. Неперевірені AI-висновки створюють ризик для довіри: одна суттєва помилка може підірвати весь сервіс. Поєднаймо AI-дослідження з відповідальною експертною перевіркою та збереженням доказів для дозволеного повторного використання.",
    },
    principle: { en: "Trust with digital controls.", uk: "Довіра з цифровим контролем." },
    note: {
      en: "Retain the source, date, reviewer, access rules and correction route. AI OSINT is proposed; it is not connected in this demonstration.",
      uk: "Зберігаємо джерело, дату, відповідального, правила доступу й шлях виправлення. AI OSINT запропоновано; у демонстрації його ще не підключено.",
    },
    steps: [
      { en: "Source evidence", uk: "Джерела й докази" },
      { en: "AI research", uk: "AI-дослідження" },
      { en: "Professional review", uk: "Перевірка фахівцем" },
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
      en: "ISRM gains a map of expertise and the infrastructure for horizontal connections. Members gain relevant colleagues, evidence and professional opportunities. Together, these support multidisciplinary groups, client referrals and continuing engagement across chapters.",
      uk: "ISRM отримує мапу експертизи та інфраструктуру горизонтальних зв’язків. Члени — доступ до релевантних колег, доказів і професійних можливостей. Разом це підтримує міждисциплінарні групи, клієнтські реферали та постійну взаємодію між чаптерами.",
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
    label: { en: "The innovation horizon", uk: "Горизонт інновацій" },
    title: {
      en: "Network expertise. The next frontier for AI.",
      uk: "Мережева експертиза. Новий горизонт AI.",
    },
    body: {
      en: "Professional intelligence and AI, close to a source of practices and standards, can do more than OSINT checks. ISRM could help make responsible AI part of best practice: from a consultants’ assistant to specialist models trained on permissioned expertise, and potentially a wider market.",
      uk: "Професійний інтелект та AI біля джерела практик і стандартів здатні на більше, ніж OSINT-перевірки. ISRM може допомогти зробити відповідальне використання AI частиною best practice: від помічника консультантів до спеціалізованих моделей на дозволеній експертизі й потенційного виходу на ринок.",
    },
    principle: {
      en: "Build on expertise. Connect to the tools people already use.",
      uk: "Розвиваємо експертизу. Поєднуємо з інструментами, якими вже користуються.",
    },
    note: {
      en: "Development horizon, not the current deliverable. Model training and integrations require their own agreed scope, permissions and evaluation.",
      uk: "Горизонт розвитку, а не поточний результат замовлення. Навчання моделей та інтеграції потребують окремого обсягу, дозволів і оцінювання.",
    },
    steps: [
      { en: "Reviewed expertise", uk: "Перевірена експертиза" },
      { en: "Consultants’ assistant", uk: "Помічник консультантів" },
      { en: "Specialist models", uk: "Спеціалізовані моделі" },
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
