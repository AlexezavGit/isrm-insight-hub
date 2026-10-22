import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, FileDown, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IsrmLogo } from "@/components/IsrmLogo";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/scope")({
  head: () => ({
    meta: [
      { title: "ISRM — Scope & Budget" },
      { name: "description", content: "ISRM — прийнятний напрям та загальний обсяг робіт цифрового додатку, погодження цільових лімітів бюджету проєкту." },
      { property: "og:title", content: "ISRM — Scope & Budget" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScopePage,
});

type RefinementKey = "osint" | "groups" | "projects" | "other";

const REFINEMENT_LABELS: Record<RefinementKey, { uk: string; en: string }> = {
  osint: { uk: "Інтеграція ШІ OSINT", en: "AI OSINT integration" },
  groups: { uk: "Відбір груп", en: "Group selection" },
  projects: { uk: "Створення проектів", en: "Project creation" },
  other: { uk: "Інше (опишіть нижче)", en: "Other (describe below)" },
};

function ScopePage() {
  const { locale, setLocale } = useI18n();
  const [refinements, setRefinements] = useState<Record<RefinementKey, boolean>>({ osint: false, groups: false, projects: false, other: false });
  const [otherText, setOtherText] = useState("");
  const [mhpssInterest, setMhpssInterest] = useState(false);
  const [sendAttempted, setSendAttempted] = useState(false);
  const uk = locale === "uk";
  const text = (en: string, ua: string) => (uk ? ua : en);
  const anyRefinement = refinements.osint || refinements.groups || refinements.projects || refinements.other;
  const canSend = true;
  const showError = sendAttempted && !canSend;

  const handleConfirmAndSend = () => {
    setSendAttempted(true);
    if (!canSend) return;

    let serviceDraftsBlock = "";
    try {
      const stored = window.localStorage.getItem("isrm-service-drafts-v1");
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, unknown>;
        const titles = Object.keys(parsed);
        if (titles.length > 0) {
          const lines = titles.map((title) => {
            const draft = parsed[title] as Record<string, string>;
            const fields = [
              `    Тип запиту: ${draft.requestType === "add" ? "Додати сервіс" : "Пропозиція змін"}`,
              draft.userRole ? `    Роль: ${draft.userRole}` : null,
              draft.need ? `    Потреба: ${draft.need}` : null,
              draft.behavior ? `    Поведінка: ${draft.behavior}` : null,
              draft.outcome ? `    Результат: ${draft.outcome}` : null,
              draft.dataIntegration ? `    Інтеграція: ${draft.dataIntegration}` : null,
              draft.acceptance ? `    Прийняття: ${draft.acceptance}` : null,
              draft.needDecision ? `    Рішення: ${draft.needDecision}` : null,
              draft.savedAt ? `    Збережено: ${draft.savedAt}` : null,
            ].filter(Boolean).join("\n");
            return `  ▸ ${title}\n${fields}`;
          });
          serviceDraftsBlock = (uk ? "──── ЧЕРНЕТКИ ОПИСІВ СЕРВІСІВ (з MemberCabinet) ────\n" : "──── SERVICE DRAFTS (from MemberCabinet) ────\n") + lines.join("\n\n") + "\n\n";
        }
      }
    } catch { /* ignore */ }

    const preambleText = uk
      ? `ПРЕАМБУЛА\n\nЦей документ окреслює прийнятний напрям та загальний обсяг робіт, функціональність цифрового додатку, та погодження цільових лімітів бюджету проєкту з "Розвитку безпеки професійних комунікацій та Зміцненню довіри до носіїв мережевої експертизи" в зоні впливу ISRM.\n\nПроект у своєму розвитку може бути дотичним до верифікації використовуваних даних, досліджень, розвитку мережевої експертизи, зовнішніх та внутрішніх горизонтальних каналів професійної комунікації та взаємодії професійної спільноти.\n\nКожний з етапів проекту передбачає створення програмного коду, або надання доступу до цифрових сервісів.\nЕтапність визначає послідовність консультацій та розробки цифрового застосунку, з активним використанням ШІ, для забезпечення перевірки повноти та об\'єктивності даних, що використовуються ISRM та її членами у своїй роботі, автоматизації рутинних адміністративних операцій, проведенні досліджень, пошуку інсайтів та визначенні ефективних практик у межах мережевої експертизи інститута.\n\nБЛОК РОЗРАХУНКУ ГОНОРАРУ\n\nЕтапи мають самодостатні результати, передбачають погодження кількості та спеціалізації підключених ШІ агентів для обробки даних, проведення комплаєнсу, забезпечення повноти та достовірності інформації:\n\n1. ФІЗІБІЛІТІ\nСтворення та затвердження детального ТЗ та Пропозиції з урахуванням затвердженої функціональності, пропозицій та запитів, описаних у цьому документі, з оцінкою періоду та бюджету.\n- формалізація відносин з підписанням Угоди,\n- очікуваний платіж у розмірі 30% від погодженого бюджету.\n\n2. INITIAL DEPLOY AND INTEGRATION\nПередача у використання програмного забезпечення, або забезпечення доступу до цифрового сервісу для погодженого ISRM кола користувачів для тестування — збору зауважень та пропозицій з уніфікації сервісів, інтеграції з наявними цифровими системами та сервісами ISRM для своїх членів та на зовні.\n- прийняття робіт / зобов\'язань усунути зауваження та розглянути нові пропозиції, що до сервісів, або програмного коду, у разі наявності,\n- оплата 50% від погодженого бюджету.\n\nМоже починатись у будь-який момент без залежності від завершення попереднього етапу.\n- аналіз патернів, пошук рішень та можливостей розвитку функціональності для супроводу Циклу еквізішена-рекрутинга членів асоціації та/або користувачів послуг ISRM — драйверу розвитку капасіті та побудови професійного наслідування. З проведенням кампейну у соціальних мережах (короткий опис у брифі та у конфігураторі — поставити лінк).\n\n3. DEPLOY AND OPERATIONS\nВтілення fine-tuning tailor-made під конкретний профіль та патерн користувачів ISRM, відкриття загального входу та реєстрації, та/або погодження нового ТЗ на розширення функціональності, та/або прийняття рішень про продовження / припинення відносин та їх подальшого формату.\n- передача програмного коду, або ліцензії на використання цифрових сервісів за етапом 1,\n- оплата 20% від погодженого бюджету.\n\nМоже починатись у будь-який момент без залежності від завершення попереднього етапу.\n- аналіз патернів та можливостей розвитку функціональності для супроводу Циклу накопичення, трансформації та розповсюдження мережевої експертизи, її впливу на ISRM customer acquisition та оплачуваного членства; розмір гонорарів / рефералс ISRM, завдяки передачі клієнтських запитів; обсяги запитів на навчання; обсяги оріджинейшену сервісів, що можуть бути надані ISRM своїм членам, або разом з ними назовні; на професійні статуси, ренкінги, репутацію та довіру.\n`
      : `PREAMBLE\n\nThis document outlines the acceptable direction and general scope of work, the functionality of the digital application, and the agreement of target budget limits for the project "Development of Professional Communication Security and Strengthening Trust in the Carriers of Network Expertise" within the ISRM sphere of influence.\n\nThe project in its development may be adjacent to the verification of used data, research, the development of network expertise, and external and internal horizontal channels of professional communication and interaction of the professional community.\n\nEach of the project\'s stages involves the creation of software code, or the provision of access to digital services.\nThe staging determines the sequence of consultations and development of the digital application, with active use of AI, to ensure the verification of completeness and objectivity of data used by ISRM and its members in their work, automation of routine administrative operations, research, insight search, and identification of effective practices within the institute\'s network expertise.\n\nHONORARIUM CALCULATION BLOCK\n\nThe stages have self-sufficient results, providing for the agreement of the quantity and specialization of connected AI agents for data processing, compliance, ensuring completeness and reliability of information:\n\n1. FEASIBILITY\nCreation and approval of detailed TOR and Proposal, taking into account the approved functionality, proposals, and requests described in this document, with an estimate of period and budget.\n- formalization of relations with the signing of the Agreement,\n- expected payment of 30% of the agreed budget.\n\n2. INITIAL DEPLOY AND INTEGRATION\nTransfer for use of software, or provision of access to a digital service for the agreed ISRM circle of users for testing — collection of comments and proposals for service unification, integration with existing digital systems and services of ISRM for its members and externally.\n- acceptance of work / obligations to fix comments and review new proposals regarding services, or software code, if any,\n- payment of 50% of the agreed budget.\n\nMay begin at any time without dependence on completion of the previous stage.\n- analysis of patterns, search for solutions and opportunities for developing functionality to support the Cycle of acquisition-recruitment of association members and/or ISRM service users — the driver of capacity development and professional succession building. With a campaign in social networks (brief description in the brief and in the configurator — link).\n\n3. DEPLOY AND OPERATIONS\nImplementation of fine-tuning tailor-made for the specific profile and pattern of ISRM users, opening of general login and registration, and/or agreement of new TOR for expanding functionality, and/or making decisions on the continuation / termination of relations and their further format.\n- transfer of software code, or license to use digital services under stage 1,\n- payment of 20% of the agreed budget.\n\nMay begin at any time without dependence on completion of the previous stage.\n- analysis of patterns and opportunities for developing functionality to support the Cycle of accumulation, transformation, and distribution of network expertise, its impact on ISRM customer acquisition and paid membership; the size of ISRM honoraria / referrals, thanks to the transfer of client requests; volumes of training requests; volumes of origination of services that can be provided by ISRM to its members, or together with them externally; on professional statuses, rankings, reputation, and trust.\n`;

    const refinementLines = (Object.keys(refinements) as RefinementKey[])
      .filter((k) => refinements[k])
      .map((k) => {
        const label = REFINEMENT_LABELS[k][uk ? "uk" : "en"];
        if (k === "other" && otherText.trim()) return `  [x] ${label}: ${otherText.trim()}`;
        return `  [x] ${label}`;
      });
    const refinementBlock = refinementLines.length > 0
      ? (uk ? "──── ПОЗНАЧЕНО ДОПРАЦЮВАННЯ ────\n" : "──── MARKED REFINEMENTS ────\n") + refinementLines.join("\n") + "\n\n"
      : "";

    const mhpssBlock = mhpssInterest
      ? (uk ? "──── MHPSS — ВЗАЄМНИЙ ІНТЕРЕС ────\nБажаємо отримати матеріали для ознайомлення з програмою Practical Mental Health Incident Management for Non-Specialists (theisrm.org).\n\n" : "──── MHPSS — MUTUAL INTEREST ────\nWould like to receive review materials for the Practical Mental Health Incident Management for Non-Specialists programme (theisrm.org).\n\n")
      : "";

    const closingText = uk
      ? `Цей документ слугуватиме обґрунтуванням для підготовки ТЗ та пропозиції.\n\nВизнаючи лідерську роль Інституту стратегічного управління ризиками (ISRM) у формуванні стандартів безпеки, резільєнтності та антикризового управління в Україні та Європі, висловлюємо особливу подяку за відкриття українського чаптеру ISRM — це рішення має історичне значення для професійної спільноти, що працює в умовах високого ризику та невизначеності.\n\nЗапрошуємо Інститут та асоціацію до фахової експертизи та взаємної інтеграції у запуску відкритого дашборду даних ментального здоров\'я (dashboard.feelagain.me). Програма українського чаптера Practical Mental Health Incident Management for Non-Specialists задає методологічний фундамент, який пропонуємо розширити аналітичною інфраструктурою для MHPSS-моделювання ризиків.\n\nЗ високою зацікавленістю смотрим на можливість реалізації цієї не тривіальної задачі, що сполучає глибоку інституційну експертизу з керованими аналітичними агентами, та формує цифрову інфраструктуру довіри для професійної спільноти ISRM.\n\nЗ повагою,\nДмитро Філімонов\nFrishberg & Partners\n`
      : `This document will serve as justification for the preparation of TOR and proposal.\n\nAcknowledging the leadership of the Institute of Strategic Risk Management (ISRM) in setting standards for security, resilience, and crisis management across Ukraine and Europe, we express special gratitude for the opening of the ISRM Ukrainian chapter — this decision has historical significance for the professional community working in conditions of high risk and uncertainty.\n\nWe invite the Institute and the association to professional review and mutual integration in launching an open mental health data dashboard (dashboard.feelagain.me). The Ukrainian chapter\'s programme Practical Mental Health Incident Management for Non-Specialists sets the methodological foundation we propose to extend with analytical infrastructure for MHPSS risk modelling.\n\nWe look with high interest at the possibility of realizing this non-trivial task, which connects deep institutional expertise with managed analytical agents, and forms a digital infrastructure of trust for the ISRM professional community.\n\nKind regards,\nDmytro Filimonov\nFrishberg & Partners\n`;

    const signatureLine = uk
      ? `\n─────────────────────────────────────\nПогоджую: ____________________________\nDr David Rubens, Executive Director, ISRM\nДата: ________________________________\n`
      : `\n─────────────────────────────────────\nAgreed: ____________________________\nDr David Rubens, Executive Director, ISRM\nDate: _______________________________\n`;

    const subject = encodeURIComponent(uk ? "ISRM — Погодження напрямку та етапів" : "ISRM — Direction & Stages Confirmation");
    const body = encodeURIComponent(`Доброго дня,\n\n${preambleText}\n${refinementBlock}${mhpssBlock}${serviceDraftsBlock}${closingText}${signatureLine}`);
    window.location.href = `mailto:alexezav@gmail.com,dmitrfilim@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className="partner-review client-proposal client-offer">
      <div className="partner-shell">
        <header className="partner-header">
          <div>
            <div className="mb-3" aria-label="ISRM">
              <IsrmLogo className="h-9 w-auto" showSubtitle={true} />
            </div>
            <Button asChild variant="ghost" className="partner-back">
              <a href="/?network=true">
                <ArrowLeft aria-hidden="true" className="mr-1 h-4 w-4" />
                {text("Return to network graph", "До графа")}
              </a>
            </Button>
            <p className="partner-eyebrow">{text("ISRM · Scope & Stages", "ISRM · Напрям та етапи")}</p>
            <h1>{text("Acceptable Direction, Scope of Work and Honorarium Stages", "Прийнятний напрям, обсяг робіт та етапи гонорару")}</h1>
            <p className="partner-lede">{text("This document outlines the acceptable direction and general scope of work, the functionality of the digital application, and the agreement of target budget limits for the project.", "Цей документ окреслює прийнятний напрям та загальний обсяг робіт, функціональність цифрового додатку, та погодження цільових лімітів бюджету проєкту.")}</p>
          </div>
          <div className="partner-header-status">
            <div className="partner-locale-switch" role="group" aria-label={text("Page language", "Мова сторінки")}>
              <button type="button" aria-pressed={!uk} className={!uk ? "is-active" : ""} onClick={() => setLocale("en")}>EN</button>
              <button type="button" aria-pressed={uk} className={uk ? "is-active" : ""} onClick={() => setLocale("uk")}>UA</button>
            </div>
            <span className="partner-badge">{text("Basis for TOR & Proposal", "База для ТЗ та пропозиції")}</span>
          </div>
        </header>

        <section className="mb-6 p-5 sm:p-6 rounded-xl border border-primary/20 bg-card/60 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            <p className="text-xs uppercase tracking-wider font-semibold text-primary">{text("Preamble", "Преамбула")}</p>
          </div>
          <p className="text-sm sm:text-base text-foreground leading-relaxed mb-3 font-semibold">{text('This document outlines the acceptable direction and general scope of work, the functionality of the digital application, and the agreement of target budget limits for the project "Development of Professional Communication Security and Strengthening Trust in the Carriers of Network Expertise" within the ISRM sphere of influence.', 'Цей документ окреслює прийнятний напрям та загальний обсяг робіт, функціональність цифрового додатку, та погодження цільових лімітів бюджету проєкту з "Розвитку безпеки професійних комунікацій та Зміцненню довіри до носіїв мережевої експертизи" в зоні впливу ISRM.')}</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{text("The project in its development may be adjacent to the verification of used data, research, the development of network expertise, and external and internal horizontal channels of professional communication and interaction of the professional community.", "Проект у своєму розвитку може бути дотичним до верифікації використовуваних даних, досліджень, розвитку мережевої експертизи, зовнішніх та внутрішніх горизонтальних каналів професійної комунікації та взаємодії професійної спільноти.")}</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{text("Each of the project's stages involves the creation of software code, or the provision of access to digital services.", "Кожний з етапів проекту передбачає створення програмного коду, або надання доступу до цифрових сервісів.")}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{text("The staging determines the sequence of consultations and development of the digital application, with active use of AI, to ensure the verification of completeness and objectivity of data used by ISRM and its members in their work, automation of routine administrative operations, research, insight search, and identification of effective practices within the institute's network expertise.", "Етапність визначає послідовність консультацій та розробки цифрового застосунку, з активним використанням ШІ, для забезпечення перевірки повноти та об'єктивності даних, що використовуються ISRM та її членами у своїй роботі, автоматизації рутинних адміністративних операцій, проведенні досліджень, пошуку інсайтів та визначенні ефективних практик у межах мережевої експертизи інститута.")}</p>
        </section>

        <section className="mb-6 p-5 sm:p-6 rounded-xl border border-brass/30 bg-brass/5 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-brass" aria-hidden="true" />
            <p className="text-xs uppercase tracking-wider font-semibold text-brass">{text("Honorarium Calculation Block", "Блок розрахунку гонорару")}</p>
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-5">{text("The stages have self-sufficient results, providing for the agreement of the quantity and specialization of connected AI agents for data processing, compliance, ensuring completeness and reliability of information:", "Етапи мають самодостатні результати, передбачають погодження кількості та спеціалізації підключених ШІ агентів для обробки даних, проведення комплаєнсу, забезпечення повноти та достовірності інформації:")}</p>

          <article className="mb-5 p-4 sm:p-5 rounded-lg border border-border bg-card/80">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-2xl font-bold text-brass">1</span>
              <h2 className="text-base sm:text-lg font-bold text-foreground">{text("Feasibility", "Фізібіліті")}</h2>
              <span className="ml-auto text-sm font-semibold text-primary">{text("30% of agreed budget", "30% від погодженого бюджету")}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{text("Creation and approval of detailed TOR and Proposal, taking into account the approved functionality, proposals, and requests described in this document, with an estimate of period and budget.", "Створення та затвердження детального ТЗ та Пропозиції з урахуванням затвердженої функціональності, пропозицій та запитів, описаних у цьому документі, з оцінкою періоду та бюджету.")}</p>
            <ul className="text-sm text-foreground space-y-1.5 mb-2">
              <li className="flex gap-2"><span className="text-brass mt-0.5">—</span><span>{text("formalization of relations with the signing of the Agreement", "формалізація відносин з підписанням Угоди,")}</span></li>
              <li className="flex gap-2"><span className="text-brass mt-0.5">—</span><span>{text("expected payment of 30% of the agreed budget", "очікуваний платіж у розмірі 30% від погодженого бюджету")}</span></li>
            </ul>
          </article>

          <article className="mb-5 p-4 sm:p-5 rounded-lg border border-border bg-card/80">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-2xl font-bold text-brass">2</span>
              <h2 className="text-base sm:text-lg font-bold text-foreground">{text("Initial deploy and integration", "Initial deploy and integration")}</h2>
              <span className="ml-auto text-sm font-semibold text-primary">{text("50% of agreed budget", "50% від погодженого бюджету")}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{text("Transfer for use of software, or provision of access to a digital service for the agreed ISRM circle of users for testing — collection of comments and proposals for service unification, integration with existing digital systems and services of ISRM for its members and externally.", "Передача у використання програмного забезпечення, або забезпечення доступу до цифрового сервісу для погодженого ISRM кола користувачів для тестування — збору зауважень та пропозицій з уніфікації сервісів, інтеграції з наявними цифровими системами та сервісами ISRM для своїх членів та на зовні.")}</p>
            <ul className="text-sm text-foreground space-y-1.5 mb-3">
              <li className="flex gap-2"><span className="text-brass mt-0.5">—</span><span>{text("acceptance of work / obligations to fix comments and review new proposals regarding services, or software code, if any", "прийняття робіт / зобов'язань усунути зауваження та розглянути нові пропозиції, що до сервісів, або програмного коду, у разі наявності,")}</span></li>
              <li className="flex gap-2"><span className="text-brass mt-0.5">—</span><span>{text("payment of 50% of the agreed budget", "оплата 50% від погодженого бюджету")}</span></li>
            </ul>
            <p className="text-xs sm:text-sm text-primary italic mb-2">{text("May begin at any time without dependence on completion of the previous stage.", "Може починатись у будь-який момент без залежності від завершення попереднього етапу.")}</p>
            <div className="p-3 rounded border border-brass/30 bg-brass/5">
              <p className="text-sm text-foreground leading-relaxed"><span className="font-semibold text-brass">★</span>{" "}{text("Analysis of patterns, search for solutions and opportunities for developing functionality to support the Cycle of acquisition-recruitment of association members and/or ISRM service users — the driver of capacity development and professional succession building. With a campaign in social networks (brief description in the brief and in the configurator — link).", "Аналіз патернів, пошук рішень та можливостей розвитку функціональності для супроводу Циклу еквізішена-рекрутинга членів асоціації та/або користувачів послуг ISRM — драйверу розвитку капасіті та побудови професійного наслідування. З проведенням кампейну у соціальних мережах (короткий опис у брифі та у конфігураторі — поставити лінк).")}</p>
            </div>
          </article>

          <article className="p-4 sm:p-5 rounded-lg border border-border bg-card/80">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-2xl font-bold text-brass">3</span>
              <h2 className="text-base sm:text-lg font-bold text-foreground">{text("deploy and operations", "deploy and operations")}</h2>
              <span className="ml-auto text-sm font-semibold text-primary">{text("20% of agreed budget", "20% від погодженого бюджету")}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{text("Implementation of fine-tuning tailor-made for the specific profile and pattern of ISRM users, opening of general login and registration, and/or agreement of new TOR for expanding functionality, and/or making decisions on the continuation / termination of relations and their further format.", "Втілення fine-tuning tailor-made під конкретний профіль та патерн користувачів ISRM, відкриття загального входу та реєстрації, та/або погодження нового ТЗ на розширення функціональності, та/або прийняття рішень про продовження / припинення відносин та їх подальшого формату.")}</p>
            <ul className="text-sm text-foreground space-y-1.5 mb-3">
              <li className="flex gap-2"><span className="text-brass mt-0.5">—</span><span>{text("transfer of software code, or license to use digital services under stage 1", "передача програмного коду, або ліцензії на використання цифрових сервісів за етапом 1,")}</span></li>
              <li className="flex gap-2"><span className="text-brass mt-0.5">—</span><span>{text("payment of 20% of the agreed budget", "оплата 20% від погодженого бюджету")}</span></li>
            </ul>
            <p className="text-xs sm:text-sm text-primary italic mb-2">{text("May begin at any time without dependence on completion of the previous stage.", "Може починатись у будь-який момент без залежності від завершення попереднього етапу.")}</p>
            <div className="p-3 rounded border border-brass/30 bg-brass/5">
              <p className="text-sm text-foreground leading-relaxed"><span className="font-semibold text-brass">★</span>{" "}{text("Analysis of patterns and opportunities for developing functionality to support the Cycle of accumulation, transformation, and distribution of network expertise, its impact on ISRM customer acquisition and paid membership; the size of ISRM honoraria / referrals, thanks to the transfer of client requests; volumes of training requests; volumes of origination of services that can be provided by ISRM to its members, or together with them externally; on professional statuses, rankings, reputation, and trust.", "Аналіз патернів та можливостей розвитку функціональності для супроводу Циклу накопичення, трансформації та розповсюдження мережевої експертизи, її впливу на ISRM customer acquisition та оплачуваного членства; розмір гонорарів / рефералс ISRM, завдяки передачі клієнтських запитів; обсяги запитів на навчання; обсяги оріджинейшену сервісів, що можуть бути надані ISRM своїм членам, або разом з ними назовні; на професійні статуси, ренкінги, репутацію та довіру.")}</p>
            </div>
          </article>
        </section>

        <section className="mb-6 p-5 sm:p-6 rounded-xl border border-primary/30 bg-primary/5 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            <p className="text-xs uppercase tracking-wider font-semibold text-primary">{text("Refinement Request", "Запит доопрацювання")}</p>
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-4">{text("In case the functionality you saw in the demo is already sufficient, indicate what degree of refinement is needed — we will separate it from the total scope and propose exactly that variant with relevant calculations.", "У разі якщо вже достатньо тієї функціональності, що побачили в демонстрації, повідомте, який ступінь доопрацювання потрібна — ми відокремимо від загального обсягу робіт та запропонуємо саме такий варіант та надамо відповідні розрахунки.")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(REFINEMENT_LABELS) as RefinementKey[]).map((key) => (
              <label key={key} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card/80 cursor-pointer hover:border-primary/40 transition-colors">
                <input type="checkbox" checked={refinements[key]} onChange={(e) => setRefinements((prev) => ({ ...prev, [key]: e.target.checked }))} className="mt-1 h-4 w-4 accent-primary shrink-0" />
                <span className="text-sm text-foreground leading-snug">{REFINEMENT_LABELS[key][uk ? "uk" : "en"]}</span>
              </label>
            ))}
          </div>
          {refinements.other && (
            <div className="mt-3">
              <textarea value={otherText} onChange={(e) => setOtherText(e.target.value)} placeholder={text("Describe the refinement you need...", "Опишіть доопрацювання, яке потребується...")} rows={3} className="w-full p-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          )}
          {anyRefinement && (
            <div className="mt-4 p-3 rounded border border-primary/40 bg-primary/10" role="note">
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">{text("If you have chosen any variant above MVP and all necessary refinements are included in the budget — nothing needs to wait. Checkbox marks remove all price proposals (we will provide a custom calculation separately).", "Якщо ви обрали будь-який з варіантів вище MVP та всі необхідні доопрацювання входять до бюджету — нічого не потрібно чекати. Відмітки чек-боксів знімають усі цінові пропозиції (ми надамо окремий індивідуальний розрахунок).")}</p>
            </div>
          )}
        </section>

        <section className="mb-6 p-5 sm:p-6 rounded-xl border border-primary/40 bg-card/60 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            <p className="text-xs uppercase tracking-wider font-semibold text-primary">{text("Strategic Synergy — MHPSS", "Стратегічна синергія — MHPSS")}</p>
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-3">{text("We invite the Institute and the association to professional review and mutual integration in launching an open mental health data dashboard (dashboard.feelagain.me). The Ukrainian chapter's programme Practical Mental Health Incident Management for Non-Specialists sets the methodological foundation we propose to extend with analytical infrastructure for MHPSS risk modelling.", "Запрошуємо Інститут та асоціацію до фахової експертизи та взаємної інтеграції у запуску відкритого дашборду даних ментального здоров'я (dashboard.feelagain.me). Програма українського чаптера Practical Mental Health Incident Management for Non-Specialists задає методологічний фундамент, який пропонуємо розширити аналітичною інфраструктурою для MHPSS-моделювання ризиків.")}</p>
          <label className="flex items-start gap-3 p-3 rounded-lg border border-primary/40 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
            <input type="checkbox" checked={mhpssInterest} onChange={(e) => setMhpssInterest(e.target.checked)} className="mt-1 h-4 w-4 accent-primary shrink-0" />
            <span className="text-sm text-foreground leading-snug">{text("Please mark if you would like to receive materials for review of the Practical Mental Health Incident Management for Non-Specialists programme.", "Просимо зробити відмітку, якщо бажаєте отримати матеріали для ознайомлення з програмою Practical Mental Health Incident Management for Non-Specialists.")}</span>
          </label>
        </section>

        <section className="mb-6 p-5 sm:p-6 rounded-xl border border-border bg-card/60 backdrop-blur-md shadow-sm">
          <p className="text-sm sm:text-base text-foreground leading-relaxed mb-4 font-semibold">{text("This document will serve as justification for the preparation of TOR and proposal.", "Цей документ слугуватиме обґрунтуванням для підготовки ТЗ та пропозиції.")}</p>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
            <p>{text("Acknowledging the leadership of the Institute of Strategic Risk Management (ISRM) in setting standards for security, resilience, and crisis management across Ukraine and Europe, we express special gratitude for the opening of the ISRM Ukrainian chapter — this decision has historical significance for the professional community working in conditions of high risk and uncertainty.", "Визнаючи лідерську роль Інституту стратегічного управління ризиками (ISRM) у формуванні стандартів безпеки, резільєнтності та антикризового управління в Україні та Європі, висловлюємо особливу подяку за відкриття українського чаптеру ISRM — це рішення має історичне значення для професійної спільноти, що працює в умовах високого ризику та невизначеності.")}</p>
            <p>{text("We look with high interest at the possibility of realizing this non-trivial task, which connects deep institutional expertise with managed analytical agents, and forms a digital infrastructure of trust for the ISRM professional community.", "З високою зацікавленістю смотрим на можливість реалізації цієї не тривіальної задачі, що сполучає глибоку інституційну експертизу з керованими аналітичними агентами, та формує цифрову інфраструктуру довіри для професійної спільноти ISRM.")}</p>
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{text("Agreed:", "Погоджую:")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="border-b border-foreground/40 h-8 mb-1" />
                <p className="text-foreground font-semibold">Dr David Rubens</p>
                <p className="text-muted-foreground">Executive Director, ISRM</p>
              </div>
              <div>
                <div className="border-b border-foreground/40 h-8 mb-1" />
                <p className="text-muted-foreground">{text("Date", "Дата")}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{text("Frishberg & Partners — on behalf of the working group", "Frishberg & Partners — від імені робочої групи")}</p>
          </div>
        </section>

        <footer className="partner-footer">
          <div className="cta-bottom">
            <Button asChild variant="outline" className="button-outline">
              <Link to="/proposal">
                <ArrowLeft aria-hidden="true" className="mr-1.5 h-4 w-4" />
                {text("Back to proposal", "До пропозиції")}
              </Link>
            </Button>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => window.print()} className="w-full flex items-center justify-center gap-2" style={{ fontSize: "0.95rem", padding: "0.75rem 1rem" }}>
              <FileDown className="h-4 w-4 text-primary" />
              {text("Save as PDF", "Зберегти в PDF")}
            </Button>
            <Button onClick={handleConfirmAndSend} className="w-full flex items-center justify-center gap-2 border border-brass/60 text-brass hover:bg-brass/10 bg-transparent font-semibold min-h-[50px] h-auto py-3 px-4 whitespace-normal text-center leading-snug shadow-md" style={{ fontSize: "1rem", opacity: sendAttempted && !canSend ? 0.75 : 1 }}>
              <Send className="h-4 w-4 shrink-0" />
              <span>{text("Confirm & Send Email", "Підтвердити та відіслати email")}</span>
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3 text-center">{text("Opens your default email client addressed to alexezav@gmail.com and dmitrfilim@gmail.com. The full preamble, three honorarium stages, marked refinements, MHPSS interest, and any saved MemberCabinet service drafts are pre-filled in the message body.", "Відкриває ваш поштовий клієнт з листом на alexezav@gmail.com та dmitrfilim@gmail.com. У тілі листа — повна преамбула, три етапи гонорару, позначені доопрацювання, інтерес MHPSS, та всі збережені чернетки описів сервісів з MemberCabinet.")}</p>
        </footer>
      </div>
    </main>
  );
}
