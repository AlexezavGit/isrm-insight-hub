import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ExternalLink, FileDown, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IsrmLogo } from "@/components/IsrmLogo";
import {
  CLIENT_OFFER_PACKAGES,
  CLIENT_CONSULTING_OPTION,
  CLIENT_PRICING_STATUS,
} from "@/lib/client-proposal-data";
import { CLIENT_OFFER_COMBINED_ESTIMATE } from "@/lib/proposal-data";
import { MARKET_BENCHMARKS } from "@/lib/proposal-data";
import { useI18n } from "@/lib/i18n";

import { NETWORK_SERVICES } from "@/lib/services-data";

export const Route = createFileRoute("/scope")({
  head: () => ({
    meta: [
      { title: "ISRM — Scope & Budget" },
      {
        name: "description",
        content:
          "Review ISRM project scope and indicative budget. Select the sections that apply and indicate your budget position.",
      },
      { property: "og:title", content: "ISRM — Scope & Budget" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScopePage,
});

function ScopePage() {
  const { locale, setLocale } = useI18n();
  const [budgetInput, setBudgetInput] = useState("");
  const [budgetChoice, setBudgetChoice] = useState<"approve" | "limit" | null>(null);
  const [pilotIncluded, setPilotIncluded] = useState(false);
  const [consultingIncluded, setConsultingIncluded] = useState(false);
  const [customNotes, setCustomNotes] = useState("");
  const uk = locale === "uk";
  const text = (en: string, ua: string) => (uk ? ua : en);
  const [sendAttempted, setSendAttempted] = useState(false);
  const canSend = budgetChoice !== null && (budgetChoice !== "limit" || budgetInput.trim() !== "");
  const showError = sendAttempted && !canSend;

  const money = (value: number) =>
    new Intl.NumberFormat(uk ? "uk-UA" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  const mvpPrice = CLIENT_OFFER_PACKAGES[0];
  const pilotPrice = CLIENT_OFFER_PACKAGES[1];

  const handleConfirmAndSend = () => {
    setSendAttempted(true);
    if (!canSend) return;

    const mvpHigh = mvpPrice?.estimate.high.total ?? 0;
    const pilotHigh = pilotPrice?.estimate.high.total ?? 0;
    const combinedHigh = CLIENT_OFFER_COMBINED_ESTIMATE.high.total;

    const fmt = (n: number) =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

    const scopeLines = [
      uk
        ? `• MVP застосунку — до ${fmt(mvpHigh)} (включено)`
        : `• Application MVP — up to ${fmt(mvpHigh)} (included)`,
      pilotIncluded
        ? uk
          ? `• Цикл залучення експертів — до ${fmt(pilotHigh)}`
          : `• Expert Engagement Cycle — up to ${fmt(pilotHigh)}`
        : null,
      consultingIncluded
        ? uk
          ? `• Стратегічний консалтинг — окреме котирування`
          : `• Strategic Advisory — subject to separate quotation`
        : null,
      (pilotIncluded || consultingIncluded)
        ? uk
          ? `  ────────────────────────────────\n  Разом (верхня межа): до ${fmt(pilotIncluded ? combinedHigh : mvpHigh)}`
          : `  ────────────────────────────────\n  Total ceiling: up to ${fmt(pilotIncluded ? combinedHigh : mvpHigh)}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    const budgetText =
      budgetChoice === "approve"
        ? uk
          ? "Погоджено індикативний діапазон"
          : "Indicative range approved"
        : budgetChoice === "limit" && budgetInput
        ? uk
          ? `Бюджетна стеля: ${budgetInput}`
          : `Budget ceiling: ${budgetInput}`
        : "";

    const servicesList = NETWORK_SERVICES.map((s, idx) => {
      const title = s.title[uk ? "uk" : "en"];
      const short = s.short[uk ? "uk" : "en"];
      return `  ${idx + 1}. ${title} — ${short}`;
    }).join("\n");

    const preambleText = uk
      ? `Цей документ є підтвердженою конфігурацією та аналітичним обґрунтуванням для підготовки індивідуального (tailor-made) технічного та комерційного рішення щодо розгортання програмного забезпечення цифрового хабу мережі ISRM. Документ є прямим наслідком вивчення, структурування та погодження архітектури функціональних блоків, програмний код та інфраструктура яких забезпечують:\n— Затверджений функціональний периметр: [перелік обраних сервісів з конфігуратора];\n— Спеціальні вимоги та адаптації: [коментарі, додаткові модулі та індивідуальні сервіси замовника];\n— Граничні параметри реалізації: [погоджена бюджетна стеля або індикативний діапазон строків і навантаження].\nЗафіксована конфігурація слугує базою для випуску специфікації робіт (SOW) та календарного плану розгортання.\n`
      : `This document is the confirmed configuration and analytical rationale for preparing a tailor-made technical and commercial decision on deploying the ISRM network digital hub software. It is the direct result of reviewing, structuring, and aligning the architecture of functional blocks whose code and infrastructure deliver:\n— Approved functional perimeter: [list of selected services from the configurator];\n— Special requirements and adaptations: [comments, additional modules and bespoke services from the client];\n— Boundary parameters of implementation: [agreed budget ceiling or indicative range of timelines and load].\nThe fixed configuration serves as the basis for issuing the Statement of Work (SOW) and the deployment schedule.\n`;

    const notesBlock = customNotes.trim()
      ? uk
        ? `──── КОМЕНТАРІ ТА ДОДАТКОВА ФУНКЦІОНАЛЬНІСТЬ ────\n${customNotes.trim()}\n\n`
        : `──── ADDITIONAL NOTES & SERVICES ────\n${customNotes.trim()}\n\n`
      : "";

    const subject = encodeURIComponent(
      uk
        ? `ISRM Погодження обсягів та бюджету — ${pilotIncluded ? "MVP + Цикл залучення" : "MVP Застосунку"}`
        : `ISRM Scope & Budget Confirmation — ${pilotIncluded ? "MVP + Expert Cycle" : "Application MVP"}`
    );

    const body = encodeURIComponent(
      uk
        ? `Доброго дня,\n\n${preambleText}\n` +
            `──── ОБРАНИЙ ОБСЯГ ────\n${scopeLines}\n\n` +
            `──── ПЕРЕЛІК СЕРВІСІВ (АРХІТЕКТУРА МЕРЕЖІ) ────\n${servicesList}\n\n` +
            notesBlock +
            `──── ПОГОДЖЕННЯ ЛІМІТІВ (ПОЗИЦІЯ ЩОДО БЮДЖЕТУ) ────\n${budgetText}\n\n` +
            `─────────────────────────────────────────────────\n` +
            `Модель взаємодії: цикл «люди → довіра → технології/ШІ → довіра → люди». Органічна конвертація фахової спільноти.\n` +
            `Стратегічний вектор: після фіксації прикладних рішень готові перейти до меморандуму щодо фундаментальних ризиків та архітектури довіри.\n\n` +
            `З повагою,\n`
        : `Hello,\n\n${preambleText}\n` +
            `──── SELECTED SCOPE ────\n${scopeLines}\n\n` +
            `──── SERVICES LISTING (NETWORK ARCHITECTURE) ────\n${servicesList}\n\n` +
            notesBlock +
            `──── BUDGET POSITION & CEILING ────\n${budgetText}\n\n` +
            `Kind regards,\n`
    );

    window.location.href = `mailto:alexezav@gmail.com,dmitrfilim@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className="partner-review client-proposal client-offer">
      <div className="partner-shell">
        {/* ── Header ────────────────────────────────────────────────── */}
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
            <p className="partner-eyebrow">{text("ISRM · Programme Scope & Budget", "ISRM · Обсяг і бюджет")}</p>
            <h1>{text("Deliverables, Programme Scope and Indicative Investment", "Що буде побудовано — і скільки це коштує")}</h1>
            <p className="partner-lede">
              {text(
                "The core Application MVP is established as the essential baseline. Please select any complementary components required, and indicate your institutional budget position.",
                "MVP включено за замовчуванням. Позначте опційні розділи, які відповідають вашим потребам, потім вкажіть свою позицію щодо бюджету.",
              )}
            </p>
          </div>
          <div className="partner-header-status">
            <div className="partner-locale-switch" role="group" aria-label={text("Page language", "Мова сторінки")}>
              <button type="button" aria-pressed={!uk} className={!uk ? "is-active" : ""} onClick={() => setLocale("en")}>
                EN
              </button>
              <button type="button" aria-pressed={uk} className={uk ? "is-active" : ""} onClick={() => setLocale("uk")}>
                UA
              </button>
            </div>
            <span className="partner-badge">{text("Indicative · not a formal tender", "Індикативно · не оферта")}</span>
          </div>
        </header>

        {/* ── Strategic Preamble & Rationale ────────────────────────────── */}
        <section
          className="mb-8 p-5 sm:p-6 rounded-xl border border-primary/20 bg-card/60 backdrop-blur-md shadow-sm"
          aria-labelledby="scope-preamble-heading"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            <p className="text-xs uppercase tracking-wider font-semibold text-primary">
              {text("Strategic Memorandum & Lifecycle Rationale", "Підтверджена конфігурація та довгострокова модель")}
            </p>
          </div>
          <h2 id="scope-preamble-heading" className="text-lg sm:text-xl font-bold text-foreground">
            {text(
              "Foundational Rationale for a Tailor-Made Software Proposal",
              "Підтверджена конфігурація та обґрунтування тейлор-мейд рішення",
            )}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {text(
              "This document is the confirmed configuration and analytical rationale for preparing a tailor-made technical and commercial decision on deploying the ISRM network digital hub software. It is the direct result of reviewing, structuring, and aligning the architecture of functional blocks whose code and infrastructure deliver: the approved functional perimeter (list of selected services from the configurator); special requirements and adaptations (comments, additional modules and bespoke services from the client); boundary parameters of implementation (agreed budget ceiling or indicative range of timelines and load). The fixed configuration serves as the basis for issuing the Statement of Work (SOW) and the deployment schedule.",
              "Цей документ є підтвердженою конфігурацією та аналітичним обґрунтуванням для підготовки індивідуального (tailor-made) технічного та комерційного рішення щодо розгортання програмного забезпечення цифрового хабу мережі ISRM. Документ є прямим наслідком вивчення, структурування та погодження архітектури функціональних блоків, програмний код та інфраструктура яких забезпечують: затверджений функціональний периметр (перелік обраних сервісів з конфігуратора); спеціальні вимоги та адаптації (коментарі, додаткові модулі та індивідуальні сервіси замовника); граничні параметри реалізації (погоджена бюджетна стеля або індикативний діапазон строків і навантаження). Зафіксована конфігурація слугує базою для випуску специфікації робіт (SOW) та календарного плану розгортання.",
            )}
          </p>

          {/* ── Level 2 · Executive Cover Letter ───────────────────────── */}
          <div className="mt-5 p-4 sm:p-5 rounded-lg border border-brass/30 bg-brass/5">
            <p className="text-xs uppercase tracking-wider font-semibold text-brass mb-2">
              {text("Level 2 · Executive Cover Letter", "Рівень 2 · Супровідний офіційний лист")}
            </p>
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">
              {text("Partner Positioning & Expert Dialogue", "Партнерське позиціонування та експертний діалог")}
            </h3>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>
                {text(
                  "We acknowledge the leadership of the Institute of Strategic Risk Management in setting standards for security, resilience, and crisis management across Ukraine and Europe. This document is an invitation to professional exchange, not a sales pitch.",
                  "Визнаємо лідерську роль Інституту стратегічного управління ризиками (ISRM) у формуванні стандартів безпеки, резільєнтності та антикризового управління в Україні та Європі. Цей документ — запрошення до фахового обміну, а не комерційна пропозиція.",
                )}
              </p>
              <p>
                {text(
                  "In a period of devalued surface-level consulting and an oversaturation of unverified generative AI tools, the critical asset is verified expert judgement. Our shared goal is to unite deep institutional expertise with frontier technology in a Centaur model — the experienced practitioner plus supervised analytical agents.",
                  "У період девальвації поверхневого консалтингу та засилля неперевірених генеративних ШІ-інструментів критичним активом стає верифікована експертна оцінка. Наша спільна мета — поєднати глибоку інституційну експертизу з передовими технологіями у моделі «Centaur»: досвідчений експерт + керовані аналітичні агенти.",
                )}
              </p>
              <p>
                {text(
                  "We do not speak in abstractions — we hand over a ready, working infrastructure: a digitised contact network (178 CRM records, 45 verified), a transparent funnel converting professional discussions into paid membership, and an open analytical reporting layer.",
                  "Ми не говоримо абстракціями — передаємо готову чинну інфраструктуру: оцифровану мережу контактів (178 записів CRM, 45 верифіковано), прозору воронку конвертації фахових дискусій у платне членство, та відкритий шар аналітичної звітності.",
                )}
              </p>
              <p className="font-semibold text-foreground">
                {text(
                  "We approach ISRM colleagues as first-line reviewers and partners — and ask the Board for a professional assessment of the proposed configuration.",
                  "Звертаємося до колег по ISRM як до рецензентів та партнерів першого ешелону — і просимо Правління дати професійну оцінку запропонованої конфігурації.",
                )}
              </p>
            </div>
          </div>

          {/* ── Level 3 · Strategic Manifesto — Mental Health & Resilience ── */}
          <div className="mt-4 p-4 sm:p-5 rounded-lg border border-primary/30 bg-primary/5">
            <p className="text-xs uppercase tracking-wider font-semibold text-primary mb-2">
              {text("Level 3 · Strategic Synergy & High-Risk Analytics", "Рівень 3 · Стратегічна синергія та високі ризики")}
            </p>
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">
              {text("Mental Health, Resilience & Post-War Recovery", "Ментальне здоров'я, стійкість та повоєнне відновлення")}
            </h3>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>
                {text(
                  "We invite the Institute and the Association to professional review and mutual integration in launching an open mental-health data dashboard (dashboard.feelagain.me). The Ukrainian chapter's programme Practical Mental Health Incident Management for Non-Specialists (theisrm.org/practical-mental-health-incident-management-for-non-specialists) sets the methodological foundation we propose to extend with analytical infrastructure.",
                  "Запрошуємо Інститут та асоціацію до фахової експертизи та взаємної інтеграції у запуску відкритого дашборду даних ментального здоров'я (dashboard.feelagain.me). Програма українського чаптера Practical Mental Health Incident Management for Non-Specialists (theisrm.org/practical-mental-health-incident-management-for-non-specialists) задає методологічний фундамент, який пропонуємо розширити аналітичною інфраструктурою.",
                )}
              </p>
              <p>
                {text(
                  "The sector of psychological resilience and recovery is not a purely medical topic — it is the bedrock of national resilience, workforce capacity, and post-war recovery security. The price of an analytical error here is measured not in sampling bias but in the threat of budgetary collapse of the social protection system.",
                  "Сектор психологічної стійкості та відновлення — це не суто медична тема, а фундамент національної резільєнтності, кадрового потенціалу та безпеки повоєнного відновлення. Ціна аналітичної помилки тут вимірюється не похибкою вибірки, а загрозою бюджетного колапсу системи соціального захисту.",
                )}
              </p>
              <p>
                {text(
                  "The risk-modelling practices developed for feelagain and the Institute's crisis-management experience reinforce one another. We propose a joint analytical line-up where the Institute acts as the methodological guarantor before international donors and stakeholders.",
                  "Практики моделювання ризиків, розроблені для feelagain, та досвід ISRM у crisis management підсилюють одне одного. Пропонуємо спільний аналітичний лайн-ап, де інститут виступає експертним гарантом методології перед міжнародними донорами та стейкхолдерами.",
                )}
              </p>
              <p className="font-semibold text-foreground">
                {text(
                  "Bridge to high-stakes analytics: this is the highest-risk, highest-reward track we can offer. We propose completing the practical MVP scope first, then returning to this strategic memorandum under separate terms.",
                  "Міст до високоризикованої аналітики: це трек з найвищим ризиком і найбільшим потенціалом. Пропонуємо спершу завершити практичний MVP-scope, а потім повернутися до цього стратегічного меморандуму на окремих умовах.",
                )}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-3.5 rounded-lg border border-border/50 bg-background/50">
              <strong className="block text-foreground font-semibold mb-1">
                {text("Lifecycle Value & Acquisition Economics", "Цикл взаємодії та економіка залучення")}
              </strong>
              <p className="text-muted-foreground leading-relaxed">
                {text(
                  "We operate through a verified loop: people → trust → technology / AI → trust → people (direct unassisted trust is no longer effective in an era of information noise). Instead of costly and low-converting attempts to sell lifelong memberships, open professional working groups reduce new partner acquisition cost to a near-zero minimum, building sustainable organic reach across Ukraine, Europe, the UK, and US chapters.",
                  "Ми використовуємо замкнений цикл: люди → довіра → технології / ШІ → довіра → люди (бо напряму «люди – довіра – люди» в епоху інформаційного шуму та знецінення контенту більше не працює). Замість дорогої та малоефективної моделі продажу пожиттєвого членства, відкриті фахові робочі групи знижують вартість залучення нових платних партнерів (CAC) до смішного мінімуму, масштабуючи мережу в Україні, Європі, Великій Британії та США.",
                )}
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-border/50 bg-background/50">
              <strong className="block text-foreground font-semibold mb-1">
                {text("Practical Engine & Strategic Horizon", "Прикладне ядро та стратегічний вектор")}
              </strong>
              <p className="text-muted-foreground leading-relaxed">
                {text(
                  "The presented interfaces represent the operational tip of the technological iceberg for trusted consultancy. The specialist search and CRM data are already in place as a working engine. Strategic horizon: we hold a broader hypothesis on trust architecture, accountability, and critical risk intelligence — subject to an independent memorandum following practical alignment.",
                  "Показаний інтерфейс — це авансована надводна частина практичного застосунку для довірчого консалтингу. Пошук експертів та дані CRM уже заведені як робоче промислове ядро. Стратегічний вектор: ми маємо концептуальну гіпотезу ширшого масштабу щодо фундаментальної архітектури довіри, розподілу відповідальності та роботи з великими даними ризиків. За наявності взаємного інтересу після фіксації прикладних рішень — перейдемо до окремого стратегічного меморандуму.",
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ── Main two-column layout: sections left, price right ─────── */}
        <div className="scope-layout">
          {/* LEFT: scope sections */}
          <div className="scope-sections">
            {/* Section 01 — MVP (always included, checked + disabled checkbox) */}
            <article className="scope-section scope-section--active" aria-labelledby="scope-mvp-heading">
              <div className="scope-section-header">
                <span className="scope-section-number">01</span>
                <div style={{ flex: 1 }}>
                  <h2 id="scope-mvp-heading" className="scope-section-title">
                    {text("Application MVP", "MVP застосунку")}
                  </h2>
                  <label className="scope-checkbox-label" style={{ cursor: "not-allowed", opacity: 0.9 }}>
                    <input type="checkbox" checked={true} disabled={true} className="scope-checkbox accent-primary" />
                    <span className="font-semibold text-primary">{text("Included (core)", "Включено (основа)")}</span>
                  </label>
                </div>
              </div>
              <p className="scope-section-desc">
                {text(
                  "Specialist search, collegiate panel selection, project assignment, credential verification, and attributable evidence logging. The foundational standalone platform.",
                  "Пошук експертів, відбір групи, призначення до проєкту, перевірка профілю та запис доказів. Перший самостійно корисний продукт.",
                )}
              </p>
              <ul className="scope-feature-list">
                {(uk
                  ? [
                      "Пошук і фільтрування експертів",
                      "Відбір групи за метою",
                      "Перегляд профілю й доказів",
                      "Облік цілей і задач проєкту",
                      "Підготовка першого контакту",
                    ]
                  : [
                      "Specialist search and capability filtering",
                      "Mandate-based expert panel selection",
                      "Profile review and evidence validation",
                      "Project objectives and deliverable tracking",
                      "First collegiate contact preparation",
                    ]
                ).map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </article>

            {/* Section 02 — Engagement cycle (opt-in) */}
            <article className={`scope-section${pilotIncluded ? " scope-section--active" : ""}`} aria-labelledby="scope-pilot-heading">
              <div className="scope-section-header">
                <span className="scope-section-number">02</span>
                <div style={{ flex: 1 }}>
                  <label className="scope-section-label" htmlFor="include-pilot">
                    <h2 id="scope-pilot-heading" className="scope-section-title">
                      {text("Expert Engagement Cycle", "Цикл залучення експертів")}
                    </h2>
                  </label>
                  <label className="scope-checkbox-label" htmlFor="include-pilot">
                    <input
                      id="include-pilot"
                      type="checkbox"
                      checked={pilotIncluded}
                      onChange={(e) => setPilotIncluded(e.target.checked)}
                      className="scope-checkbox"
                    />
                    <span>{text("Include in scope", "Включити до scope")}</span>
                  </label>
                </div>
              </div>
              <p className="scope-section-desc">
                {text(
                  "Collegiate recruitment campaigns, Trust & Influence Index co-design, structured inquiry panels, and a published synthesis report. Commissioned following MVP acceptance.",
                  "Кампанії залучення, спільне проєктування Trust & Influence Index, структуровані робочі групи та звіт. Опційно після прийняття MVP.",
                )}
              </p>
              <ul className="scope-feature-list">
                {(uk
                  ? [
                      "Кампанії залучення експертів",
                      "Спільне проєктування Trust & Influence Index",
                      "Тематичні робочі групи",
                      "Опитувальник спільноти",
                      "Публікації та звіт",
                    ]
                  : [
                      "Collegiate recruitment campaigns",
                      "Trust & Influence Index co-design",
                      "Agenda-based working panels",
                      "Fellowship community questionnaire",
                      "Monographs and annual synthesis report",
                    ]
                ).map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </article>

            {/* Section 03 — Consulting (opt-in) */}
            <article className={`scope-section${consultingIncluded ? " scope-section--active" : ""}`} aria-labelledby="scope-consulting-heading">
              <div className="scope-section-header">
                <span className="scope-section-number">03</span>
                <div style={{ flex: 1 }}>
                  <label className="scope-section-label" htmlFor="include-consulting">
                    <h2 id="scope-consulting-heading" className="scope-section-title">
                      {text("Strategic Advisory & Governance", "Консалтинг і стратегія")}
                    </h2>
                  </label>
                  <label className="scope-checkbox-label" htmlFor="include-consulting">
                    <input
                      id="include-consulting"
                      type="checkbox"
                      checked={consultingIncluded}
                      onChange={(e) => setConsultingIncluded(e.target.checked)}
                      className="scope-checkbox"
                    />
                    <span>{text("Include in scope", "Включити до scope")}</span>
                  </label>
                </div>
              </div>
              <p className="scope-section-desc">
                {text(
                  "Strategic advisory sessions, Board governance briefings, capability gap analysis, and bespoke methodology formulation. Individually quoted — distinct from software development.",
                  "Стратегічні сесії, підготовка борду, аналіз прогалин в експертизі та спільне проєктування рамки Trust & Influence Index. Окрема ціна — не включена у розробку.",
                )}
              </p>
              <ul className="scope-feature-list">
                {(uk
                  ? ["Аналіз прогалин в експертизі", "Фасилітація рішень борду", "Спільне проєктування рамки Trust & Influence Index"]
                  : ["Institutional expertise gap analysis", "Council and Board governance facilitation", "Trust & Influence Index framework co-design"]
                ).map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              {consultingIncluded && (
                <p className="partner-muted" style={{ marginTop: "0.75rem", fontSize: "0.875rem" }}>
                  {CLIENT_CONSULTING_OPTION[uk ? "uk" : "en"]}
                </p>
              )}
            </article>

            {/* Section 04: Custom Notes / Additional Requirements */}
            <article className="scope-section scope-section--active" style={{ marginTop: "1rem" }}>
              <div className="scope-section-header">
                <span className="scope-section-number">04</span>
                <div style={{ flex: 1 }}>
                  <h2 className="scope-section-title">
                    {text("Custom Notes & Functional Adaptations", "Коментарі та додаткова функціональність")}
                  </h2>
                  <span className="text-xs text-muted-foreground block mt-0.5">
                    {text("Tailor-made requirements, comments, and project specifics", "Тейлор-мейд побажання, додаткові модулі та коментарі")}
                  </span>
                </div>
              </div>
              <p className="scope-section-desc">
                {text(
                  "Specify any custom integrations, data slices, or specific requirements for your expert group in Ukraine, Europe, the UK, or the US.",
                  "Вкажіть особливі побажання, додаткові сервіси або коментарі для вашої робочої групи в Україні, Європі, Великій Британії чи США.",
                )}
              </p>
              <div className="mt-3">
                <textarea
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder={text(
                    "e.g. Additional data filtering by region, custom verification criteria, direct integration with our community channels...",
                    "наприклад: додаткові регіональні зрізи, інтеграція з ком'юніті-каналами, специфічні критерії валідації..."
                  )}
                  rows={4}
                  className="w-full p-3 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary print:hidden"
                />
                {customNotes.trim() && (
                  <div className="hidden print:block p-3 rounded border border-neutral-300 text-xs whitespace-pre-wrap text-black">
                    <strong>{text("Additional notes:", "Додаткові коментарі:")}</strong>
                    <p className="mt-1">{customNotes}</p>
                  </div>
                )}
              </div>
            </article>
          </div>

          {/* RIGHT: price panel */}
          <aside className="scope-price-panel" aria-label={text("Indicative budget", "Індикативний бюджет")}>
            <p className="tech-label text-primary" style={{ marginBottom: "1rem" }}>
              {text("Indicative budget ceiling", "Індикативна верхня межа")}
            </p>

            {/* MVP price */}
            <div className="scope-price-row scope-price-row--mvp">
              <span className="scope-price-label">{text("Application MVP", "MVP")}</span>
              <span className="scope-price-value scope-price-value--active">
                {mvpPrice ? text("Up to", "До") + " " + money(mvpPrice.estimate.high.total) : "—"}
              </span>
            </div>

            {/* Pilot price */}
            <div className={`scope-price-row${pilotIncluded ? " scope-price-row--selected" : ""}`}>
              <span className="scope-price-label">{text("Engagement Cycle", "Цикл залучення")}</span>
              <span className={`scope-price-value${pilotIncluded ? " scope-price-value--active" : ""}`}>
                {pilotPrice ? text("Up to", "До") + " " + money(pilotPrice.estimate.high.total) : "—"}
              </span>
            </div>

            {/* Consulting price */}
            <div className={`scope-price-row${consultingIncluded ? " scope-price-row--selected" : ""}`}>
              <span className="scope-price-label">{text("Strategic Advisory", "Консалтинг")}</span>
              <span className={`scope-price-value${consultingIncluded ? " scope-price-value--active" : ""}`}>
                {text("Subject to separate quotation", "Окреме котирування")}
              </span>
            </div>

            {/* Total */}
            {(pilotIncluded || consultingIncluded) && (
              <div
                className="scope-price-row scope-price-row--selected"
                style={{ borderTop: "2px solid var(--color-border)", marginTop: "0.25rem", paddingTop: "0.75rem" }}
              >
                <span className="scope-price-label" style={{ fontWeight: 600, color: "var(--color-foreground)" }}>
                  {text("Total (MVP + selected)", "Разом (MVP + обране)")}
                </span>
                <span className="scope-price-value scope-price-value--active">
                  {pilotIncluded
                    ? text("Up to", "До") + " " + money(CLIENT_OFFER_COMBINED_ESTIMATE.high.total)
                    : text("Up to", "До") + " " + money(mvpPrice?.estimate.high.total ?? 0)}
                </span>
              </div>
            )}
            <div className="scope-price-divider" aria-hidden="true" />

            <p className="partner-muted" style={{ fontSize: "0.78rem", lineHeight: "1.5", marginBottom: "1.5rem" }}>
              {text(
                "Upper bound planning scenarios only. Rate inputs unverified. Hosting, AI/API and legal costs excluded.",
                "Лише верхня межа планувального сценарію. Ставки не перевірені. Хостинг, AI/API та юридичні витрати виключені.",
              )}
            </p>

            {/* Budget position */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                {text("Your budget position:", "Ваша позиція щодо бюджету:")}
              </p>
              <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontSize: "0.95rem" }}>
                <input
                  type="radio"
                  name="budget-pos"
                  value="approve"
                  checked={budgetChoice === "approve"}
                  onChange={() => setBudgetChoice("approve")}
                  style={{ width: "1.1rem", height: "1.1rem", accentColor: "var(--color-primary)" }}
                />
                <span>{text("This range works for me", "Цей діапазон мені підходить")}</span>
              </label>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", cursor: "pointer", fontSize: "0.95rem" }}>
                <input
                  type="radio"
                  name="budget-pos"
                  value="limit"
                  checked={budgetChoice === "limit"}
                  onChange={() => setBudgetChoice("limit")}
                  style={{ width: "1.1rem", height: "1.1rem", accentColor: "var(--color-primary)", marginTop: "0.2rem" }}
                />
                <div style={{ flex: 1 }}>
                  <span>{text("Set a budget ceiling:", "Визначити бюджетну стелю:")}</span>
                  {budgetChoice === "limit" && (
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={text("e.g. $40,000", "напр. $40 000")}
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      aria-label={text("Budget ceiling", "Бюджетна стеля")}
                      style={{
                        display: "block",
                        width: "100%",
                        marginTop: "0.5rem",
                        padding: "0.5rem 0.75rem",
                        fontSize: "1rem",
                        border: "1.5px solid var(--color-border)",
                        borderRadius: "6px",
                        background: "var(--color-background)",
                        color: "var(--color-foreground)",
                        outline: "none",
                      }}
                      autoFocus
                    />
                  )}
                </div>
              </label>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {/* Save PDF Button */}
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="w-full flex items-center justify-center gap-2"
                style={{ fontSize: "0.95rem", padding: "0.75rem 1rem" }}
              >
                <FileDown className="h-4 w-4 text-primary" />
                {text("Save as PDF", "Зберегти в PDF")}
              </Button>

              {/* Confirm & Send Button via direct Mailto */}
              {showError && (
                <p
                  id="budget-error"
                  role="alert"
                  style={{
                    fontSize: "0.82rem",
                    color: "#c0392b",
                    textAlign: "center",
                    marginBottom: "0.25rem",
                  }}
                >
                  {text(
                    budgetChoice === "limit" && !budgetInput.trim()
                      ? "Please enter a budget ceiling amount."
                      : "Please select a budget position before sending.",
                    budgetChoice === "limit" && !budgetInput.trim()
                      ? "Будь ласка, вкажіть суму бюджетної стелі."
                      : "Будь ласка, вкажіть вашу позицію щодо бюджету.",
                  )}
                </p>
              )}
              <Button
                onClick={handleConfirmAndSend}
                aria-describedby={showError ? "budget-error" : undefined}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold min-h-[50px] h-auto py-3 px-4 whitespace-normal text-center leading-snug shadow-md"
                style={{ fontSize: "1rem", opacity: sendAttempted && !canSend ? 0.75 : 1 }}
              >
                <Send className="h-4 w-4 shrink-0" />
                <span>{text("Confirm & Send Email", "Підтвердити та відіслати email")}</span>
              </Button>
            </div>

            <p className="text-[11px] text-muted-foreground mt-2 text-center">
              {text(
                "Opens your default email client addressed to alexezav@gmail.com and dmitrfilim@gmail.com. Scope and budget details are pre-filled in the message body.",
                "Відкриває ваш поштовий клієнт з листом на alexezav@gmail.com та dmitrfilim@gmail.com. Обсяги та бюджет вже заповнені у тілі листа.",
              )}
            </p>

            <nav className="client-price-sources" style={{ marginTop: "1rem" }} aria-label={text("Rate sources", "Джерела ставок")}>
              <span>{text("Rate sources:", "Джерела ставок:")}</span>
              {MARKET_BENCHMARKS.sources
                .filter(({ label }) => label.startsWith("Clutch"))
                .map((s) => (
                  <a href={s.url} key={s.label} target="_blank" rel="noreferrer">
                    {s.label} <ExternalLink aria-hidden="true" />
                  </a>
                ))}
            </nav>
          </aside>
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <footer className="partner-footer">
          <div className="cta-bottom">
            <Button asChild variant="outline" className="button-outline">
              <Link to="/proposal">
                <ArrowLeft aria-hidden="true" className="mr-1.5 h-4 w-4" />
                {text("Back to proposal", "До пропозиції")}
              </Link>
            </Button>
          </div>
          <p className="partner-footer-route-notice" role="note">
            {text(
              "Indicative ranges are planning references. First payment is at least 30% of the agreed total.",
              "Індикативні діапазони — планувальні орієнтири. Перший платіж — не менше 30% від погодженої суми.",
            )}
          </p>
          <p className="partner-muted" style={{ fontSize: "0.78rem", marginTop: "0.5rem" }}>
            {CLIENT_PRICING_STATUS[uk ? "uk" : "en"]}
          </p>
        </footer>
      </div>
    </main>
  );
}
