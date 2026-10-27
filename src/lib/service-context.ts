import type { Copy, ServiceId } from "./client-catalog";
export type ServiceContext = { users: Copy; result: Copy; dependencies: Copy; technology: Copy };
const c = (en: string, uk: string): Copy => ({ en, uk });
export const SERVICE_CONTEXT: Record<ServiceId, ServiceContext> = {
  search: {
    users: c(
      "Members and chapter teams looking for relevant colleagues; the Board exploring the available expertise.",
      "Члени й команди чаптерів, які шукають доречних колег; правління, яке досліджує доступну експертизу.",
    ),
    result: c(
      "A relevant, reviewable working list with a clear path back to each source record.",
      "Доречний робочий список, який можна перевірити та простежити до кожного вихідного запису.",
    ),
    dependencies: c(
      "Agreed fields, import rules, access permissions and the quality of source records.",
      "Погоджені поля, правила імпорту, дозволи доступу та якість вихідних записів.",
    ),
    technology: c(
      "React / TypeScript interface, a Canvas graph and indexed search over an agreed protected data store.",
      "Інтерфейс React / TypeScript, Canvas-граф та індексований пошук у погодженому захищеному сховищі.",
    ),
  },
  groups: {
    users: c(
      "Members preparing a client enquiry; chapter coordinators arranging a focused discussion or survey.",
      "Члени, які готують клієнтський запит; координатори чаптерів, які організовують цільову дискусію чи опитування.",
    ),
    result: c(
      "A named shortlist, purpose and next action, with no assumption that inclusion means consent to participate.",
      "Іменований відбір, мета й наступна дія. Потрапляння до списку не означає згоди на участь.",
    ),
    dependencies: c(
      "Search, reviewed profiles, clear ownership and permission for further contact.",
      "Пошук, перевірені профілі, визначений відповідальний і дозвіл на подальший контакт.",
    ),
    technology: c(
      "In the demo: local browser draft. For operations: authenticated records, access roles and an audit trail.",
      "У демонстрації: локальна чернетка браузера. Для роботи: авторизовані записи, ролі доступу й журнал змін.",
    ),
  },
  research: {
    users: c(
      "Consultants and reviewers who need a sourced answer to a defined question.",
      "Консультанти й перевіряльники, яким потрібна відповідь із джерелами на визначене питання.",
    ),
    result: c(
      "A research brief and evidence for professional review, with uncertainty and source dates retained.",
      "Дослідницька довідка та докази для професійної перевірки, зі збереженням невизначеності й дат джерел.",
    ),
    dependencies: c(
      "Agreed purpose, lawful data use, approved sources, AI/API access and human review.",
      "Погоджена мета, правомірне використання даних, дозволені джерела, доступ до AI/API та людська перевірка.",
    ),
    technology: c(
      "A separately agreed research-agent/API connection and source records. No AI research is running in this demonstration.",
      "Окремо погоджене підключення дослідницького агента/API та записи джерел. AI-дослідження в демонстрації не виконуються.",
    ),
  },
  review: {
    users: c(
      "Professional reviewers and the people responsible for the use of a finding.",
      "Професійні перевіряльники та відповідальні за використання висновку.",
    ),
    result: c(
      "An attributable review decision, corrections and a record of what still needs checking.",
      "Рішення з авторством, виправлення та запис того, що ще належить перевірити.",
    ),
    dependencies: c(
      "Source evidence, named review responsibility, agreed criteria and a correction process.",
      "Вихідні докази, відповідальний перевіряльник, погоджені критерії та порядок виправлень.",
    ),
    technology: c(
      "Review states, version history and role-based access; final professional judgement remains human.",
      "Статуси перевірки, історія версій та рольовий доступ; остаточне професійне судження залишається за людиною.",
    ),
  },
  evidence: {
    users: c(
      "Members reusing a finding and authors retaining the context of their expertise.",
      "Члени, які повторно використовують висновок, та автори, які зберігають контекст своєї експертизи.",
    ),
    result: c(
      "A reusable record with its source, author, permissions and review history.",
      "Придатний до повторного використання запис із джерелом, авторством, дозволами та історією перевірки.",
    ),
    dependencies: c(
      "Reviewed material, attribution, usage rights and retention rules.",
      "Перевірений матеріал, авторство, права використання та правила зберігання.",
    ),
    technology: c(
      "Structured records, versioned document storage and a search index; external knowledge platforms require an agreed connector.",
      "Структуровані записи, версійне сховище документів та пошуковий індекс; зовнішні бази знань потребують погодженого конектора.",
    ),
  },
  contact: {
    users: c(
      "Members seeking an introduction; chapter teams coordinating enquiries and referrals.",
      "Члени, яким потрібне знайомство; команди чаптерів, які координують запити й реферали.",
    ),
    result: c(
      "An appropriate next contact, agreed sharing permissions and a recorded follow-up.",
      "Доречний наступний контакт, погоджені дозволи на передачу даних і зафіксована наступна дія.",
    ),
    dependencies: c(
      "A relevant shortlist, contact permission and the responsible sender. A shared category alone is not a personal recommendation.",
      "Доречний відбір, дозвіл на контакт і відповідальний відправник. Спільна категорія сама по собі не є особистою рекомендацією.",
    ),
    technology: c(
      "Permission-aware contact workflow and, if commissioned, email/CRM integration. The demo sends no messages.",
      "Процес контактів з урахуванням дозволів і, за замовленням, інтеграція email/CRM. Демонстрація не надсилає повідомлень.",
    ),
  },
  integration: {
    users: c(
      "ISRM administrators and members who should not have to repeat the same information in several systems.",
      "Адміністратори ISRM та члени, яким не слід повторно вводити ту саму інформацію в кілька систем.",
    ),
    result: c(
      "Controlled data exchange and access that supports the agreed member journey.",
      "Контрольований обмін даними й доступ, які підтримують погоджений шлях члена асоціації.",
    ),
    dependencies: c(
      "System owners, available APIs, licences, access roles and an agreed field mapping.",
      "Власники систем, доступні API, ліцензії, ролі доступу й погоджене зіставлення полів.",
    ),
    technology: c(
      "Protected application records and separately scoped API/SSO connectors. Specific ISRM systems are not presumed to be connected.",
      "Захищені записи застосунку й окремо визначені API/SSO-конектори. Підключення конкретних систем ISRM не припускається автоматично.",
    ),
  },
  survey: {
    users: c(
      "Members, chapter leaders and the Board agreeing where the application would be most useful.",
      "Члени, керівники чаптерів і правління, які визначають, де застосунок буде найкориснішим.",
    ),
    result: c(
      "An agreed view of priority needs, available contributions and suitable starting services.",
      "Погоджене розуміння пріоритетних потреб, можливих внесків і сервісів для початку.",
    ),
    dependencies: c(
      "A short approved questionnaire, recipient permissions, survey ownership and rules for use of responses.",
      "Короткий затверджений опитувальник, дозволи одержувачів, відповідальний за опитування та правила використання відповідей.",
    ),
    technology: c(
      "Draft preview now; an agreed form service, protected response store and aggregate reporting if commissioned.",
      "Зараз — перегляд чернетки; за погодженням — сервіс форм, захищене сховище відповідей та агрегований звіт.",
    ),
  },
  publishing: {
    users: c(
      "Practitioners and editors developing reviewed experience into material for members and agreed external audiences.",
      "Практики й редактори, які перетворюють перевірений досвід на матеріали для членів та погоджених зовнішніх аудиторій.",
    ),
    result: c(
      "A useful publication, learning resource or discussion brief with clear attribution and limits.",
      "Корисна публікація, навчальний матеріал або довідка для обговорення з авторством і межами застосування.",
    ),
    dependencies: c(
      "Reviewed evidence, editorial responsibility, usage rights and an agreed publishing channel.",
      "Перевірені докази, редакційна відповідальність, права використання й погоджений канал публікації.",
    ),
    technology: c(
      "Review and publication workflow with optional CMS/LMS connectors. Model training is a separate future proposal.",
      "Процес перевірки й публікації з опційними CMS/LMS-конекторами. Навчання моделей — окрема майбутня пропозиція.",
    ),
  },
};
