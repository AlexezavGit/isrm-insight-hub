import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { IsrmLogo } from "@/components/IsrmLogo";
import { ArrowRight, Users, ShieldCheck, BriefcaseBusiness, Globe, Mail, Calendar, Play } from "lucide-react";

export const Route = createFileRoute("/proposal-v2")({
  beforeLoad: () => {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("isrm-visited", "1");
    }
  },
  head: () => ({
    meta: [
      { title: "Технології що створюють Довіру — концепція конфігуратора сервісів · ISRM" },
      {
        name: "description",
        content:
          "Концепція першої сторінки цифрового хабу мережі експертів ISRM: ланцюжок довіри, концепційні гіпотези, три воркфлоу та інтерактивний конфігуратор сервісів.",
      },
      {
        property: "og:title",
        content: "Технології що створюють Довіру — концепція конфігуратора сервісів · ISRM",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProposalPage,
});

function ProposalPage() {
  const { locale, setLocale } = useI18n();
  const uk = locale === "uk";
  const text = (en: string, ua: string) => (uk ? ua : en);

  return (
    <main className="partner-review min-h-screen flex flex-col">
      <style>{`
        .trust-triangle { stroke-width: 2; }
        .trust-node { cursor: pointer; transition: r 0.3s, fill 0.3s, stroke 0.3s; }
        .trust-node:hover { r: 10; fill: var(--isrm-gold-pale); stroke: var(--isrm-gold); }
        .trust-edge { stroke: var(--isrm-gold); stroke-dasharray: 6 4; transition: stroke 0.3s; }
        .workflow-block { transition: border-color 0.2s, transform 0.2s; }
        .workflow-block:hover { border-color: var(--isrm-gold); transform: translateY(-1px); }
      `}</style>

      {/* Topbar */}
      <div
        className="partner-topbar"
        style={{
          padding: "1rem 0 1.25rem",
          marginBottom: "1.75rem",
          borderBottom: "1px solid color-mix(in oklab, var(--isrm-gold) 25%, var(--border))",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div aria-label="ISRM" style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
            <IsrmLogo className="h-9 w-auto" />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div className="partner-locale-switch" role="group" aria-label={text("Page language", "Мова сторінки")}>
            <button type="button" aria-pressed={!uk} className={!uk ? "is-active" : ""} onClick={() => setLocale("en")}>
              EN
            </button>
            <button type="button" aria-pressed={uk} className={uk ? "is-active" : ""} onClick={() => setLocale("uk")}>
              UA
            </button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <header className="partner-header" style={{ display: "block", padding: "0 0 2rem" }}>
        <div>
          <address
            style={{
              fontSize: "0.85rem",
              lineHeight: 1.35,
              color: "color-mix(in oklab, var(--isrm-gold) 80%, var(--foreground, #13302c))",
              fontStyle: "normal",
              margin: 0,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.02em",
            }}
          >
            {text("Dr David Rubens D.SyRM, CSyP, F.ISRM", "Dr David Rubens D.SyRM, CSyP, F.ISRM")}
            <br />
            <span style={{ opacity: 0.85 }}>
              {text("Executive Director of the ISRM — for the Strategic Board", "Executive Director of the ISRM — для Стратегічної ради")}
            </span>
          </address>

          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight mb-4">
            {text("Technologies that create Trust — the foundation of Trusted Practice", "Технології що створюють Довіру — фундамент Trusted Practice")}
          </h1>

          <div
            style={{
              maxWidth: 860,
              marginTop: "1.5rem",
              padding: "1.25rem 0",
              borderTop: "1px solid rgba(200,144,26,0.3)",
              borderBottom: "1px solid rgba(200,144,26,0.3)",
            }}
          >
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#0a2e24", margin: 0, fontWeight: 500 }}>
              {text(
                "Trust is not a static certificate — it is the operational infrastructure of professional advisory. In an era where direct unassisted trust between individuals is undermined by total information noise, we rely on a verified operational loop: people → trust → technology / AI → trust → people. The decisive advantage belongs to verified practitioners with transparent analytical evidence on board.",
                "Довіра — це не статичний сертифікат, а фундаментальна інфраструктура фахового консалтингу. В епоху, коли прямий зв’язок «люди – довіра – люди» знецінюється тотальним інформаційним шумом, ми спираємося на замкнений операційний цикл: люди → довіра → технології / ШІ → довіра → люди. Вирішальна перевага належить верифікованим експертам із прозорим аналітичним інструментарієм.",
              )}
            </p>
          </div>

          <div
            className="partner-lede partner-question-plaque"
            style={{
              maxWidth: 860,
              marginTop: "1.25rem",
              padding: "1.25rem 1.5rem",
              borderLeft: "5px solid var(--isrm-gold)",
              borderRadius: "0 8px 8px 0",
              background: "color-mix(in oklab, var(--isrm-gold) 14%, var(--card, #f2eadb))",
              fontSize: "1.02rem",
              lineHeight: 1.6,
            }}
          >
            <p style={{ fontSize: "1.02rem", lineHeight: 1.6, color: "#0a2e24", margin: 0 }}>
              {text(
                "This proposal introduces an interactive collegiate workflow rather than an inert register: an operational surface to convene network expertise, assemble multidisciplinary project commissions, record peer contributions, illuminate institutional capacity, and advance thought leadership — with AI-verified evidence at every stage.",
                "Ця пропозиція — інтерактивний воркфлоу, а не чергова таблиця: робоча поверхня для збору мережевої експертизи, формування проєктних груп, обліку внесків, унаочнення потенціалу та лідерства думок — з верифікацією фактів за допомогою ШІ на кожному етапі.",
              )}
            </p>
          </div>
        </div>
      </header>

      <div className="partner-shell">
        {/* Section 01 — Recognition of ISRM role */}
        <section aria-labelledby="isrm-role-heading" style={{ marginTop: "2rem" }}>
          <div className="partner-section-heading" style={{ margin: "1rem 0 1.5rem" }}>
            <span>01</span>
            <div>
              <h2 id="isrm-role-heading" style={{ font: "600 clamp(1.5rem, 2.5vw, 2.1rem)/1.15 var(--font-display)" }}>
                {text("Recognition of ISRM's Role", "Визнання ролі ISRM")}
              </h2>
              <p style={{ color: "var(--muted-foreground)", lineHeight: 1.5 }}>
                {text(
                  "ISRM shapes safety, resilience and anti-crisis management standards in Britain, Europe and worldwide. Special thanks for opening the Ukrainian chapter and for attention to issues critical for Ukrainians and the country. Complementarity of approaches is recognised, especially regarding mental well-being (see linked ISRM event).",
                  "ISRM формує стандарти безпеки, резільєнтності та антикризового управління в Британії, Європі та світі. Особлива подяка за відкриття українського чаптера та увагу до важливих питань для українців та країни. Відзначення комплементарності підходів, особливо з огляду на питання ментального добробуту (посилання на івент ISRM).",
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Section 02 — Trust Triangle Infographic */}
        <section aria-labelledby="trust-triangle-heading" style={{ marginTop: "2rem" }}>
          <div className="partner-section-heading" style={{ margin: "1rem 0 1.5rem" }}>
            <span>02</span>
            <div>
              <h2 id="trust-triangle-heading" style={{ font: "600 clamp(1.5rem, 2.5vw, 2.1rem)/1.15 var(--font-display)" }}>
                {text("The Trust Triangle — Verified Expertise Loop", "Трикутник довіри — цикл верифікованої експертизи")}
              </h2>
              <p style={{ color: "var(--muted-foreground)", lineHeight: 1.5, maxWidth: 700, marginBottom: "1.5rem" }}>
                {text(
                  "Trust is not static. It is a closed loop: people trust verified expertise, expertise is verified through AI instrumentation, AI earns trust through people.",
                  "Довіра не статична. Це замкнутий цикл: люди довіряють верифікованій експертизі, експертиза верифікується інструментарієм ШІ, ШІ набуває довіри через людей.",
                )}
              </p>

              <div style={{ maxWidth: 700, margin: "0 auto 2rem" }}>
                <svg
                  className="trust-triangle w-full h-[340px] max-h-[55vh] text-[var(--isrm-ink)]"
                  viewBox="0 0 700 340"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label={text("Trust triangle diagram", "Діаграма трикутника довіри")}
                >
                  <defs>
                    <marker id="trust-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="var(--isrm-gold)" />
                    </marker>
                  </defs>

                  {/* Triangle edges */}
                  <path d="M 140 120 Q 350 60 560 120" stroke="var(--isrm-gold)" fill="none" markerEnd="url(#trust-arrow)" className="trust-edge" />
                  <path d="M 560 120 Q 620 200 350 280" stroke="var(--isrm-gold)" fill="none" markerEnd="url(#trust-arrow)" className="trust-edge" />
                  <path d="M 350 280 Q 140 200 140 120" stroke="var(--isrm-gold)" fill="none" markerEnd="url(#trust-arrow)" className="trust-edge" />

                  {/* Nodes: People -> AI -> Expert */}
                  <circle cx="140" cy="120" r="22" className="trust-node" fill="var(--isrm-teal-deep)" stroke="var(--isrm-gold)" />
                  <text x="140" y="124" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" fill="#fff" letterSpacing="0.05em">PEOPLE</text>

                  <circle cx="350" cy="60" r="22" className="trust-node" fill="var(--isrm-teal)" stroke="var(--isrm-gold)" />
                  <text x="350" y="64" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" fill="#fff" letterSpacing="0.05em">AI</text>

                  <circle cx="560" cy="120" r="22" className="trust-node" fill="var(--isrm-teal-light)" stroke="var(--isrm-gold)" />
                  <text x="560" y="124" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" fill="#fff" letterSpacing="0.05em">EXPERT</text>

                  {/* Edge labels: trust on every edge */}
                  <text x="350" y="45" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--isrm-gold)" letterSpacing="0.08em">trust</text>
                  <text x="600" y="190" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--isrm-gold)" letterSpacing="0.08em">trust</text>
                  <text x="350" y="298" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--isrm-gold)" letterSpacing="0.08em">trust</text>

                  {/* Node captions */}
                  <text x="140" y="155" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--muted-foreground)" letterSpacing="0.08em">{uk ? "Люди" : "People"}</text>
                  <text x="350" y="95" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--muted-foreground)" letterSpacing="0.08em">{uk ? "ШІ" : "AI"}</text>
                  <text x="560" y="155" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--muted-foreground)" letterSpacing="0.08em">{uk ? "Експерт" : "Expert"}</text>
                </svg>
              </div>

              <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.82rem", color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>
                {text("AI attracts trust, then establishes the link with the expert — trust pulses across all nodes and edges of the triangle.", "ШІ примагнічує довіру, потім встановлює зв’язок з експертом — довіра біжить по усіх вузлах і ребрах трикутника.")}
              </p>
            </div>
          </div>
        </section>

        {/* Section 03 — Challenge / Answer */}
        <section style={{ marginTop: "2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
            <div style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "1.5rem", background: "var(--card)" }}>
              <h3 style={{ font: "600 1.1rem var(--font-display)", color: "var(--isrm-red)", margin: "0 0 1rem" }}>{text("The Challenge", "Виклик")}</h3>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", lineHeight: 1.7, fontSize: "0.95rem", color: "var(--muted-foreground)" }}>
                <li>{text("Erosion of trust and devaluation of relationships across sectors.", "Криза довіри та девальвація відносин у всіх секторах.")}</li>
                <li>{text("Surface-level consulting mass-produced by generative AI tools.", "Поверхневий консалтинг, рахунком оснащений генеративними ШІ-інструментами.")}</li>
                <li>{text("AI has reached an expert position — competing with it directly is a lost game.", "ШІ досягла експертної позиції; гра з нею на її полі вже програна.")}</li>
              </ul>
            </div>
            <div style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "1.5rem", background: "var(--card)" }}>
              <h3 style={{ font: "600 1.1rem var(--font-display)", color: "var(--isrm-teal)", margin: "0 0 1rem" }}>{text("Our Answer", "Відповідь")}</h3>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", lineHeight: 1.7, fontSize: "0.95rem", color: "var(--muted-foreground)" }}>
                <li>{text("Verified expertise + AI instrumentation — not AI instead of experts.", "Верифікована експертиза + інструментарієм ШІ, а не заміна експертів.")}</li>
                <li>{text("Trust is not a certificate — it is an operational loop: people → trust → AI → trust → people.", "Довіра — не сертифікат, а цикл: люди → довіра → ШІ + експертиза → довіра → люди.")}</li>
                <li>{text("Competitive advantage belongs to verified practitioners with transparent evidence.", "Перевага належить верифікованим експертам із прозорими доказами.")}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 04 — Conceptual Hypotheses */}
        <section aria-labelledby="hypotheses-heading" style={{ marginTop: "2rem" }}>
          <div className="partner-section-heading" style={{ margin: "1rem 0 1.5rem" }}>
            <span>03</span>
            <div>
              <h2 id="hypotheses-heading" style={{ font: "600 clamp(1.5rem, 2.5vw, 2.1rem)/1.15 var(--font-display)" }}>
                {text("Conceptual Hypotheses", "Концепційні гіпотези")}
              </h2>
              <p style={{ color: "var(--muted-foreground)", lineHeight: 1.5, maxWidth: 700 }}>
                {text(
                  "Two hypotheses underpin the proposed architecture before the commercial proposal is drafted.",
                  "Дві концепційні гіпотези лежать в основі пропонованої архітектури перед складенням комерційної пропозиції.",
                )}
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
            <div style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "1.5rem", background: "var(--card)", borderTop: "4px solid var(--isrm-teal)" }}>
              <span style={{ font: "700 0.75rem var(--font-mono)", color: "var(--isrm-teal)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.5rem" }}>
                {text("Hypothesis 1", "Гіпотеза 1")}
              </span>
              <h3 style={{ font: "600 1.05rem var(--font-display)", color: "#0a2e24", margin: "0 0 0.75rem", lineHeight: 1.3 }}>
                {text("AI armed — verified expertise remains the advantage", "ШІ на озброєнні — перевага за верифікованою експертизою")}
              </h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#2d4a3e", margin: "0 0 1rem" }}>
                {text(
                  "If AI is taken on board, the critical asset and competitive advantage remains professional expertise and proven successful experience — verified by AI, which people now trust.",
                  "Якщо взяти ШІ на озброєння, критичним активом і конкурентною перевагою все одно буде професійна експертиза та підтверджений успішний досвід, який верифіковано ШІ, якому тепер довіряють люди.",
                )}
              </p>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "var(--muted-foreground)", margin: 0 }}>
                {text(
                  "Trust is not a static certificate but the foundation of trusted consultancy. In an era where the direct link “people → trust → people” is devalued by total information noise, the sequence is: people → trust in AI technologies + expertise and experience → trust → people. Advantage belongs to the tandem of verified experts with transparent analytical instrumentation.",
                  "Довіра — не статичний сертифікат, а постійний фундамент trusted consultancy. В епоху, коли прямий зв’язок «люди – довіра – люди» знецінюється тотальним інформаційним шумом, потрібна послідовність: люди → довіра до технологій ШІ + експертиза та досвід → довіра → люди. Перевага належить тандему верифікованих експертів із прозорим аналітичним інструментарієм на борту.",
                )}
              </p>
            </div>

            <div style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "1.5rem", background: "var(--card)", borderTop: "4px solid var(--isrm-gold)" }}>
              <span style={{ font: "700 0.75rem var(--font-mono)", color: "var(--isrm-gold)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.5rem" }}>
                {text("Hypothesis 2", "Гіпотеза 2")}
              </span>
              <h3 style={{ font: "600 1.05rem var(--font-display)", color: "#0a2e24", margin: "0 0 0.75rem", lineHeight: 1.3 }}>
                {text("Confidence in expertise is non-negotiable value", "Упевненість у експертизі — неприпустима цінність")}
              </h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#2d4a3e", margin: "0 0 1rem" }}>
                {text(
                  "Confidence in expertise and successful application experience is a non-negotiable value for clients of any rank — a factor affecting reputation, trust and fees. It starts from the middle of horizontal ties in the professional community.",
                  "Упевненість у експертизі та успішному досвіді застосування рішень є неприпустною цінністю для клієнтів будь-якого рангу — фактором що впливає на репутацію, довіру та розмір гонорарів. І починається вона з середини горизонтальних звязків професійного комьюніті.",
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Section 05 — Three Workflows (separate blocks) */}
        <section aria-labelledby="workflows-heading" style={{ marginTop: "2rem" }}>
          <div className="partner-section-heading" style={{ margin: "1rem 0 1.5rem" }}>
            <span>04</span>
            <div>
              <h2 id="workflows-heading" style={{ font: "600 clamp(1.5rem, 2.5vw, 2.1rem)/1.15 var(--font-display)" }}>
                {text("Three Workflows — Each Self-Contained", "Три воркфлоу — кожне окреме та самодостатнє")}
              </h2>
              <p style={{ color: "var(--muted-foreground)", lineHeight: 1.5, maxWidth: 700 }}>
                {text(
                  "Not a pile of cards — three sequential, independently valuable workflows. Each can stop and still have a working result.",
                  "Не купа карток — три послідовні, окремова цінні воркфлоу. Кожне може зупинитися і все ще мати робочий результат.",
                )}
              </p>
            </div>
          </div>

          <WorkflowBlock
            num="01"
            title={text("Base Interactive Workflow — MVP", "Базовий інтерактивний воркфлоу — MVP")}
            color="var(--isrm-teal)"
            description={text(
              "A digital application — not another table — for mapping available expertise and its carriers, with built-in AI OSINT and core service capabilities: search and selection of expertise or specific consultants, requests for professional support, invitations to discussions, R&D initiation, expert commentary for publications, and other professional community activities.",
              "Це не чергова таблиця, а цифровий додаток для мапування доступної експертизи та її носіїв, з вбудованим ШІ OSINT та базовими сервісними можливостями: пошук та відбір експертизи чи конкретних консультантів, запити професійної підтримки, запрошення до обговорень, ініціювання R&D та проведення досліджень, надання коментарів або експертних висновків для публікацій, інших активностей та взаємодії у професійному комьюніті, може навіть і до участі в проектах для клієнтів."
            )}
            demo={text(
              "The demonstration includes SEARCH and the SERVICES CONFIGURATOR that need to be developed (blocks corrected according to this description). For industrial SEARCH use, real member data must be reloaded. Search already works, contains participant data that is sorted — allowing you to see connections and dependencies, search for insights.",
              "Надана демонстрація містить ПОШУК та конфігуратор сервісів, які потребують розробки (розписати з корекцією контенту блоків у відповідності до цього опису). Для промислового використання ПОШУКУ потрібно перезалити дані про дійсних членів. Пошук вже працює, містить надані дані про учасників, які відсортовані що вже дозволяє бачити звязки та залежності, шукати інсайти."
            )}
            result={text("Expected: rails for horizontal connections and group dynamics.", "Очікуваний результат: створення рейків для забезпечення горизонтальних звязків та запуску групової динаміки.")}
          />

          <WorkflowBlock
            num="02"
            title={text("Acquisition & Recruitment Cycle", "Цикл еквізішену та рекрутингу членів")}
            color="var(--isrm-gold)"
            description={text(
              "Not a one-off attention campaign, but the embodiment of digital support for a self-reproducing engagement cycle — acquisition through activities in chapters and expertise sectors, on principles of mutual digital trust.",
              "Це не моментна кампанія з привертання уваги до діяльності інституту, це втілення цифрового супроводу, спрощення відносин, програмування повторюваного самовоспроизводящегося циклу залучення — еквізішену через активності в чаптерах та секторах експертизи, на принципах взаємної цифрової Довіри."
            )}
            demo={text(
              "The demonstration includes SEARCH — services configurator — and shows DEPENDENCIES for interaction with specific participants. For industrial use, the service part needs development and an AGENDA must be populated to enable interaction, follower data upload, and a communication campaign.",
              "Надана демонстрація містить: ПОШУК - конфігуратор сервісів та показує ЗАЛЕЖНОСТІ для взаємодії до конкретних учасників. Для промислового використання потребує розробки сервісної частини та наповнення АДЖЕНДИ яка забезпечить взаємодію, заливки даних про фоловерів, комунікаційної кампанії."
            )}
            result={text("Expected: target audience coverage, content flow, capacity growth.", "Очікуваний результат: охоплення цільової аудиторії для залучення-еквізішену, здібність до створення потоку контенту відкритих аналітичних звітів із залученням цільових аудиторій для нарощування капасити, визначення прийнятної групової динаміки.")}
          />

          <WorkflowBlock
            num="03"
            title={text("Network Expertise Accumulation Cycle", "Цикл накопичення мережевої експертизи")}
            color="var(--isrm-teal)"
            description={text(
              "Not another knowledge bank, but a constantly updated data flow, transformed into training programmes and publication materials — a surface for collecting network expertise and group interaction.",
              "Це не черговий банк знань, це побудова постійно оновлюваного потоку даних, його трансформації до навчальних програм та матеріалів публікацій, поверхня для збору мережевої експертизи та групової взаємодії."
            )}
            demo={text("—", "—")}
            result={text(
              "Expected: collection and timely update of network expertise, broad paid access to it. Demonstrating potential and thought leadership with AI-verified facts. Ability to convert expert discussions into paid membership. Preconditions for project groups and cross-selling of services.",
              "Очікуваний результат: колекціонування та своєчасне оновлення мережевої експертизи та забезпечення широкого оплачуваного доступу до неї. Унаочнення потенціалу та лідерства думок з верифікованими фактами за допомогою ШІ. Здібності конвертації фахових дискусій у платне членство. Створення передумов для формування проєктних груп та перехрестних продажів послуг."
            )}
          />
        </section>

        {/* Section 06 — Service Configurator */}
        <section aria-labelledby="configurator-heading" style={{ marginTop: "2rem", padding: "2rem 0" }}>
          <div className="partner-section-heading" style={{ margin: "1rem 0 1.5rem" }}>
            <span>05</span>
            <div>
              <h2 id="configurator-heading" style={{ font: "600 clamp(1.5rem, 2.5vw, 2.1rem)/1.15 var(--font-display)" }}>
                {text("Service Configurator — Build Your Engagement", "Конфігуратор сервісів — складіть свої послуги")}
              </h2>
              <p style={{ color: "var(--muted-foreground)", lineHeight: 1.5, maxWidth: 700 }}>
                {text(
                  "Choose the services your board needs. The configurator calculates dependencies, shows which experts are involved, and prepares a brief for the coordination stage.",
                  "Оберіть послуги, які потрібні вашій раді. Конфігуратор розрахує залежності, покаже задіяних експертів і підготує бриф до етапу погодження."
                )}
              </p>
            </div>
          </div>

          <ServiceConfigurator locale={locale} uk={uk} text={text} />
        </section>

        {/* Section 07 — Demo Network CTA */}
        <section style={{ marginTop: "3rem" }}>
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "3rem 2rem", textAlign: "center", background: "var(--card)" }}>
            <Play className="mb-3" style={{ width: "32px", height: "32px", fill: "var(--isrm-gold)" }} />
            <h2 style={{ font: "600 1.5rem var(--font-display)", color: "#0a2e24", margin: "0 0 1rem" }}>{text("Demonstration of Capability — Network Graph", "Демонстрація спроможності — мережевий граф")}</h2>
            <p style={{ color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: "2rem", maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
              {text(
                "Interactive prototype of the digitised contact network that reveals internal dependencies and insights. Can be used as a standalone ISRM application for working with members and followers. AI OSINT functions can be added separately by agreement, ported to the production application.",
                "Інтерактивний прототип для роботи з оцифрованими даними про мережу контактів, яка розкриває внутрішні залежності та інсайти. Цей прототип може бути використаний як самодостатній застосунок для використання ISRM для роботи з членами та фоловерами. По окремому погодженню функції ШІ OSINT можуть бути додані з переводом у промисловий застосунок."
              )}
            </p>
            <Button
              asChild
              variant="default"
              className="px-8 py-3 shadow-lg"
              style={{ fontSize: "0.95rem", borderRadius: "2px" }}
            >
              <Link to="/" search={{ network: "true" }} onClick={() => { if (typeof sessionStorage !== "undefined") sessionStorage.setItem("isrm-allow-graph", "1"); }}>
                {text("Open Network Demo →", "Кнопка до демонстрації мережі →")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Section 08 — Executors */}
        <section style={{ marginTop: "3rem" }}>
          <div className="partner-section-heading" style={{ margin: "1rem 0 1.5rem" }}>
            <span>★</span>
            <div>
              <h2 style={{ font: "600 1.3rem var(--font-display)", color: "#0a2e24", margin: 0 }}>{text("Executors", "Виконавці")}</h2>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", margin: "0.25rem 0 0" }}>
                {text(
                  "Experts engaged to prepare the value-ready solution: organisational development in NGOs and human capital market restructuring, and personal data protection. Application and technology framework design conducted.",
                  "Для підготовки цінностного виконуваного рішення залучено есперта з організаційного розвитку в недержавних організаціях та реструктуризації ринків людського капіталу, та експерта у захисті персональних даних, проведено конструювання застосунку та фреймворку використання технологій."
                )}
              </p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
            <PractitionerCard role={text("Organisational Development & Human Capital", "Організаційний розвиток, людський капітал")} name="Alexey Zvolinskiy" bio={text("Organisational development, NGO restructuring, human capital markets.", "Організаційний розвиток, реструктуризація НВО, ринки людського капіталу.")} href="https://www.linkedin.com/in/alexeyzvolinskiy/" />
            <PractitionerCard role={text("Personal Data Protection & GDPR", "Захист персональних даних, GDPR")} name="Arsen Nizelsky" bio={text("Personal data protection and GDPR compliance.", "Захист персональних даних та відповідність GDPR.")} href="https://www.linkedin.com/in/arsen-nizelsky-59aba428/" />
          </div>
        </section>
      </div>

      <footer className="partner-footer" style={{ background: "#ffffff", marginTop: "auto", padding: "1.5rem", borderRadius: "8px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
          <img src="https://frishberg.com/wp-content/uploads/2023/07/logo.jpg" alt="Frishberg" style={{ height: "48px", width: "auto", objectFit: "contain" }} />
        </div>
        <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#94a3b8", margin: 0 }}>
          © 2026 Frishberg & Partners. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

function WorkflowBlock({ num, title, color, description, demo, result }: { num: string; title: string; color: string; description: string; demo: string; result: string }) {
  return (
    <div className="workflow-block" style={{ border: "1px solid var(--border)", borderTop: `4px solid ${color}`, borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem", background: "var(--card)" }}>
      <span style={{ font: "700 0.75rem var(--font-mono)", color: color, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.5rem" }}>{num}</span>
      <h3 style={{ font: "600 1.05rem var(--font-display)", color: "#0a2e24", margin: "0 0 0.75rem", lineHeight: 1.3 }}>{title}</h3>
      <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#2d4a3e", margin: "0 0 1rem" }}>{description}</p>

      <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: "6px", background: "color-mix(in oklab, var(--isrm-gold) 6%, var(--card))", border: "1px dashed color-mix(in oklab, var(--isrm-gold) 40%, var(--border))" }}>
        <p style={{ margin: "0 0 0.5rem", font: "600 0.75rem var(--font-mono)", color: color, textTransform: "uppercase", letterSpacing: "0.08em" }}>{text("Demonstration state", "Стан у демонстрації")}</p>
        <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.6, color: "#2d4a3e" }}>{demo}</p>
      </div>

      <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px dashed rgba(11,84,76,0.15)", fontSize: "0.78rem", color: color, fontWeight: 700 }}>{result}</div>
    </div>
  );
}

function ServiceConfigurator({ locale, uk, text }: { locale: "en" | "uk"; uk: boolean; text: (en: string, ua: string) => string }) {
  const services = [
    {
      id: "mvp",
      icon: BriefcaseBusiness,
      title: text("MVP Application", "MVP Застосунок"),
      short: text("Core expert workflow, search and group formation", "Основа робочого процесу, пошук та формування груп"),
      metrics: text("45 verified profiles · 178 CRM records", "45 верифікованих профілів · 178 записів у CRM"),
      color: "var(--isrm-teal)",
    },
    {
      id: "acquisitions",
      icon: Users,
      title: text("Active Acquisitions", "Активні залучення"),
      short: text("Targeted outreach by sector & jurisdiction", "Таргетований аутріч за секторами й юрисдикціями"),
      metrics: text("~175 target candidates / cycle", "~175 цільових кандидатів / цикл"),
      color: "var(--isrm-gold)",
    },
    {
      id: "discussions",
      icon: Globe,
      title: text("Expert Discussions", "Експертні обговорення"),
      short: text("Roundtables, agendas, invitations", "Круглі столи, адженди, запрошення"),
      metrics: text("~175 engaged per campaign", "~175 залучених за кампанію"),
      color: "var(--isrm-teal-light)",
    },
    {
      id: "reports",
      icon: Mail,
      title: text("Reports & Publications", "Звіти та публікації"),
      short: text("Transcription, reports, media outreach", "Розшифрування, звіти, медіа-поширення"),
      metrics: text("8.7k LinkedIn audience reach", "8.7k охоплення аудиторії LinkedIn"),
      color: "var(--isrm-teal)",
    },
    {
      id: "expertise",
      icon: ShieldCheck,
      title: text("Network Expertise — Cases", "Мережева експертиза — Кейси"),
      short: text("Verified author permission, project fees", "Підтверджений запит автора, гонорари"),
      metrics: text("Composite TII record", "Композитний запис TII"),
      color: "var(--isrm-gold)",
    },
    {
      id: "conferences",
      icon: Calendar,
      title: text("Conferences by Sector", "Конференції за секторами"),
      short: text("Agenda, tickets, speaker pool, Almanac", "Адженда, квитки, пул спікерів, Альманах"),
      metrics: text("~43 paid attendees / cycle", "~43 платних відвідувачів / цикл"),
      color: "var(--isrm-teal-light)",
    },
  ];

  const [selected, setSelected] = React.useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
      {services.map((svc) => {
        const isSelected = selected.includes(svc.id);
        return (
          <div
            key={svc.id}
            onClick={() => toggle(svc.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && toggle(svc.id)}
            style={{
              border: `1px solid ${isSelected ? svc.color : "var(--border)"}`,
              borderTop: `4px solid ${svc.color}`,
              borderRadius: "8px",
              padding: "1.25rem",
              background: isSelected ? "color-mix(in oklab, var(--isrm-teal) 8%, var(--card))" : "var(--card)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <svc.icon className={`h-5 w-5 mb-2`} style={{ fill: svc.color }} />
            <h4 style={{ font: "600 0.95rem var(--font-display)", color: "#0a2e24", margin: "0 0 0.5rem" }}>{svc.title}</h4>
            <p style={{ fontSize: "0.82rem", lineHeight: 1.5, color: "var(--muted-foreground)", margin: "0 0 0.75rem" }}>{svc.short}</p>
            <div style={{ font: "700 0.72rem var(--font-mono)", color: svc.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>{svc.metrics}</div>
            <div style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
              {isSelected ? text("✓ Included in your brief", "✓ Додано до брифу") : text("Add to brief", "Додати до брифу")}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PractitionerCard({ role, name, bio, href }: { role: string; name: string; bio: string; href?: string }) {
  const Comp = href ? "a" : "div";
  const extraProps = href ? { href, target: "_blank", rel: "noopener noreferrer", style: { color: "var(--isrm-teal)", textDecoration: "none" } as React.CSSProperties } : {};
  return (
    <Comp {...extraProps} style={{ display: "flex", flexDirection: "column", padding: "1rem", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--card)" }}>
      <p style={{ font: "700 0.65rem var(--font-mono)", color: "var(--isrm-gold)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.3rem" }}>{role}</p>
      <h3 style={{ font: "600 0.9rem var(--font-display)", color: "#0a2e24", margin: "0 0 0.4rem", textAlign: "center" }}>{name}</h3>
      <p style={{ fontSize: "0.78rem", lineHeight: 1.5, color: "#2d4a3e", margin: 0, textAlign: "center" }}>{bio}</p>
    </Comp>
  );
}
