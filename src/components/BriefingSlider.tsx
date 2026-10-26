import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAccess } from "@/lib/access";
import { ExpertisePyramid } from "./ClientValueFramework";
import { ClientAccessibility } from "./ClientAccessibility";
import { CLIENT_WORKFLOWS } from "@/lib/client-catalog";
const NetworkGraph = lazy(() => import("./NetworkGraph"));
const slides = [
  {
    eyebrow: { en: "01 · Your question", uk: "01 · Ваше питання" },
    title: {
      en: "How could the Ukraine analysis serve a much larger network?",
      uk: "Як українське дослідження може працювати для значно більшої мережі?",
    },
    body: {
      en: "David, your question concerns 11,000+ LinkedIn contacts. The Ukraine exercise showed what careful research can reveal. At a larger scale, the first decision is which professional questions the information should help answer.",
      uk: "Девіде, ваше питання стосується понад 11 000 контактів у LinkedIn. Українське дослідження показало можливості ретельної роботи з даними. За більшого масштабу перше рішення — на які професійні питання повинна відповідати ця інформація.",
    },
    note: {
      en: "The contact count is from your request; it is not a verified count of unique members or willing participants.",
      uk: "Чисельність контактів наведена з вашого запиту; це не перевірена кількість унікальних членів або готових учасників.",
    },
    visual: {
      en: ["A professional question", "Relevant evidence", "A useful decision"],
      uk: ["Професійне питання", "Релевантні докази", "Корисне рішення"],
    },
  },
  {
    eyebrow: { en: "02 · A proportionate response", uk: "02 · Співмірне рішення" },
    title: {
      en: "Investigate where there is a reason. Keep what remains useful.",
      uk: "Досліджувати там, де є потреба. Зберігати те, що залишається корисним.",
    },
    body: {
      en: "Targeted research remains appropriate for a specific enquiry. A reusable tool becomes useful when questions recur: finding expertise, understanding a counterpart, forming a group or connecting a client need with a colleague. Cost depends on depth, volume and update frequency.",
      uk: "Цільове дослідження доречне для конкретного запиту. Інструмент багаторазового використання корисний, коли питання повторюються: пошук експертизи, розуміння контрагента, формування групи або передача клієнтської потреби колезі. Вартість залежить від глибини, обсягу й частоти оновлення.",
    },
    note: {
      en: "A large database loses value if no one owns its purpose, evidence and updating.",
      uk: "Велика база втрачає цінність, якщо немає відповідальних за її призначення, докази й оновлення.",
    },
    visual: {
      en: ["Research on request", "Reusable evidence", "Review when needed"],
      uk: ["Дослідження за запитом", "Повторне використання", "Перевірка за потребою"],
    },
  },
  {
    eyebrow: { en: "03 · Professional accountability", uk: "03 · Професійна відповідальність" },
    title: {
      en: "AI can organise evidence. Professional judgement gives it meaning.",
      uk: "ШІ може впорядковувати докази. Професійне судження надає їм зміст.",
    },
    body: {
      en: "AI-assisted open-source research can prepare findings. A named reviewer checks sources, context and conclusions before they are relied upon or shared. Keep the source, date, reviewer, permission and correction route with the information.",
      uk: "Дослідження відкритих джерел із ШІ може готувати матеріали. Визначений фахівець перевіряє джерела, контекст і висновки до їх використання чи поширення. Разом з інформацією зберігаються джерело, дата, перевіряльник, дозвіл і шлях виправлення.",
    },
    note: {
      en: "Chapter expertise is a potential resource. Participation, capacity and responsibilities need agreement. AI research is proposed, not connected in this demonstration.",
      uk: "Експертиза чаптерів — потенційний ресурс. Участь, спроможність і відповідальності потребують погодження. ШІ-дослідження запропоноване, але не підключене в демонстрації.",
    },
    visual: {
      en: ["Sources & AI assistance", "Accountable human review", "Permitted reuse"],
      uk: ["Джерела й допомога ШІ", "Відповідальна людська перевірка", "Дозволене використання"],
    },
  },
  {
    eyebrow: { en: "04 · One tool, different networks", uk: "04 · Один інструмент, різні мережі" },
    title: {
      en: "The tool is universal. The data follows the question.",
      uk: "Інструмент універсальний. Дані визначає питання.",
    },
    body: {
      en: "One map could describe counterparts; another, association members and their expertise. Their permitted intersection can reveal where a need meets relevant capability. The same search, evidence and group tools support each view.",
      uk: "Одна мапа може описувати контрагентів; інша — членів асоціації та їхню експертизу. Їхній дозволений перетин допомагає побачити, де потреба зустрічається з відповідною спроможністю. Кожне представлення використовує ті самі інструменти пошуку, доказів і груп.",
    },
    note: {
      en: "A thematic match is not proof of a personal connection, endorsement or willingness to work together. Every relationship needs a clear meaning.",
      uk: "Тематичний збіг не доводить особистого зв’язку, рекомендації чи готовності співпрацювати. Кожен тип зв’язку має зрозуміле значення.",
    },
    visual: {
      en: ["Counterpart network", "Needs ↔ expertise", "Association network"],
      uk: ["Мережа контрагентів", "Потреби ↔ експертиза", "Мережа асоціації"],
    },
  },
  {
    eyebrow: { en: "05 · Two continuing workflows", uk: "05 · Два постійні процеси" },
    title: {
      en: "Useful interactions can create continuing value for ISRM.",
      uk: "Корисна взаємодія може створювати постійну цінність для ISRM.",
    },
    body: {
      en: "An ongoing engagement workflow can direct interest towards learning, membership, partnerships, alumni resources, cross-selling, expanded engagements, client referrals and conferences. A knowledge workflow turns reviewed experience into learning, publications and professional solutions.",
      uk: "Перманентний workflow залучення може спрямовувати інтерес до навчання, членства, партнерств, ресурсів alumni, крос-селлу, розширення замовлень, клієнтських рефералів і конференцій. Workflow знань перетворює перевірений досвід на навчання, публікації та професійні рішення.",
    },
    note: {
      en: "Longer term, this may support an AI assistant for consultants and perhaps a market-facing AI consultant. That is a possibility for later evaluation, not a promised deliverable.",
      uk: "Згодом це може підтримати AI-помічника консультантів і, можливо, AI-консультанта для ринку. Це перспектива для подальшої оцінки, а не обіцяний результат цього замовлення.",
    },
    visual: {
      en: ["Professional interaction", "Engagement & opportunities", "Reusable expertise"],
      uk: [
        "Професійна взаємодія",
        "Залучення та можливості",
        "Повторно використовувана експертиза",
      ],
    },
  },
  {
    eyebrow: { en: "06 · The next decision", uk: "06 · Наступне рішення" },
    title: {
      en: "Explore the starting point. Tell us what would be useful.",
      uk: "Дослідіть початкову основу. Визначмо, що буде корисним.",
    },
    body: {
      en: "The demonstration shows search, network mapping and local group selection. Choose services or workflows, describe an unmet need and indicate your budget position. We can then prepare a detailed specification, delivery timetable and formal offer for your consideration.",
      uk: "Демонстрація показує пошук, мапування мережі й локальний відбір групи. Оберіть сервіси чи workflow, опишіть потребу та вкажіть бюджетну позицію. Далі можна підготувати детальне ТЗ, строки виконання й офіційну пропозицію для вашого розгляду.",
    },
    note: {
      en: "Indicative prices are available in the scope review; calendar dates will be agreed together. Delivery is proposed in three stages: specification & agreement; initial deployment & integration; refinement & handover. No work is commissioned through this briefing.",
      uk: "Індикативні ціни наведені в огляді обсягу; календарні строки погодимо разом. Пропонуються три етапи: ТЗ та угода; перший запуск та інтеграція; налаштування та передача. Цей бриф не замовляє роботи.",
    },
    visual: {
      en: ["Explore", "Define scope & budget", "Detailed proposal"],
      uk: ["Переглянути", "Визначити обсяг і бюджет", "Детальна пропозиція"],
    },
  },
] as const;
export function BriefingSlider() {
  const { locale, setLocale } = useI18n();
  const uk = locale === "uk";
  const [slide, setSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [paused, setPaused] = useState(true);
  const { data } = useAccess();
  const experts = data?.experts ?? [];
  useEffect(() => {
    setMounted(true);
    setPaused(matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  const current = slides[slide]!;
  return (
    <main className="client-briefing">
      <div className="client-briefing-graph" aria-hidden="true">
        {mounted && (
          <Suspense fallback={null}>
            <NetworkGraph
              experts={experts}
              layers={{ sector: true, theme: true, hub: true, researchQueue: true }}
              focus={null}
              onFocus={() => {}}
              locale={locale}
              motionPaused={paused}
            />
          </Suspense>
        )}
      </div>
      <header className="client-topbar">
        <Link to="/proposal" className="client-wordmark">
          ISRM <span>INSIGHT HUB</span>
        </Link>
        <div className="client-topbar-actions">
          <ClientAccessibility />
          <div className="client-language" role="group" aria-label={uk ? "Мова" : "Language"}>
            {(["en", "uk"] as const).map((l) => (
              <button key={l} aria-pressed={locale === l} onClick={() => setLocale(l)}>
                {l === "uk" ? "UA" : "EN"}
              </button>
            ))}
          </div>
        </div>
      </header>
      <section
        className="client-slide-surface"
        aria-roledescription={uk ? "Презентація" : "carousel"}
        aria-label={
          uk
            ? "Відповідь Девіду Рубенсу та правлінню ISRM"
            : "A response to David Rubens and the ISRM Strategic Board"
        }
        onKeyDown={(e) => {
          if ((e.target as HTMLElement).tagName === "INPUT") return;
          if (e.key === "ArrowRight") {
            e.preventDefault();
            setSlide((s) => Math.min(slides.length - 1, s + 1));
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            setSlide((s) => Math.max(0, s - 1));
          }
        }}
      >
        <div className="client-slide-topline">
          <p className="client-eyebrow">
            {uk
              ? "Брифінг для обговорення · Відповідь на ваш запит"
              : "Executive briefing · In response to your question"}
          </p>
          <span>{String(slide + 1).padStart(2, "0")} / 06</span>
        </div>
        <div className="client-slide-content" aria-live="polite" aria-atomic="true">
          <p className="client-eyebrow">{current.eyebrow[locale]}</p>
          <h1>{current.title[locale]}</h1>
          <p className="client-slide-body">{current.body[locale]}</p>
          {slide === 4 ? (
            <ExpertisePyramid locale={locale} compact />
          ) : (
            <>
              <ol
                className={`client-slide-diagram ${slide === 4 ? "is-cycle" : ""}`}
                aria-label={uk ? "Логіка рішення" : "How it works"}
              >
                {current.visual[locale].map((v, i) => (
                  <li key={v}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <strong>{v}</strong>
                  </li>
                ))}
              </ol>
            </>
          )}
          {slide === 4 && (
            <div className="client-workflow-links">
              {CLIENT_WORKFLOWS.map((w) => (
                <Link key={w.id} to="/" search={{ stage: "configuration", preset: w.id }}>
                  {w.title[locale]} <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          )}
          {slide === 2 && (
            <a
              className="client-context-link"
              href="https://www.theisrm.org/ai-in-risk-management/"
              target="_blank"
              rel="noreferrer"
            >
              ISRM · AI in Risk Management ↗
            </a>
          )}
          {slide === 4 && (
            <a
              className="client-context-link"
              href="https://www.theisrm.org/international-chapters/"
              target="_blank"
              rel="noreferrer"
            >
              ISRM · International Chapters ↗
            </a>
          )}
          <p className="client-slide-note">{current.note[locale]}</p>
        </div>
        <footer className="client-slide-footer">
          <div className="client-slide-navigation">
            <button
              className="client-icon-button"
              disabled={slide === 0}
              onClick={() => setSlide((s) => s - 1)}
              aria-label={uk ? "Попередній слайд" : "Previous slide"}
            >
              <ArrowLeft />
            </button>
            <div className="client-slide-dots">
              {slides.map((s, i) => (
                <button
                  key={s.eyebrow.en}
                  aria-label={`${uk ? "Слайд" : "Slide"} ${i + 1}`}
                  aria-current={slide === i ? "step" : undefined}
                  onClick={() => setSlide(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              className="client-icon-button"
              disabled={slide === slides.length - 1}
              onClick={() => setSlide((s) => s + 1)}
              aria-label={uk ? "Наступний слайд" : "Next slide"}
            >
              <ArrowRight />
            </button>
          </div>
          <div className="client-inline-actions">
            <Link to="/scope" className="client-text-button">
              {uk ? "Обсяг і бюджет" : "Scope & budget"}
            </Link>
            <Link to="/" search={{ view: "map" }} className="client-button">
              {uk ? "Дослідити інструмент" : "Explore the tool"} <ArrowRight size={18} />
            </Link>
          </div>
        </footer>
      </section>
      <div className="client-backdrop-caption">
        <p>
          {uk
            ? "ДСП · Передана база ISRM · тематичні зв’язки"
            : "Confidential · Supplied ISRM dataset · thematic relationships"}
        </p>
        <button onClick={() => setPaused(!paused)} aria-pressed={paused}>
          {paused ? <Play size={15} /> : <Pause size={15} />}
          {paused ? (uk ? "Рух графа" : "Animate graph") : uk ? "Зупинити рух" : "Pause motion"}
        </button>
      </div>
    </main>
  );
}
