import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/partner-finance")({
  head: () => ({
    meta: [
      { title: "ISRM — Partner financial review" },
      {
        name: "description",
        content:
          "Local partner financial review draft: rate card, partner × package × role hours, per-tier totals, module lines, unit economics, KPI per function, go-no-go.",
      },
      { property: "og:title", content: "ISRM — Partner financial review" },
      {
        property: "og:description",
        content:
          "Editable partner financial block sourced from the ISRM price registry. Conservative indicative defaults; every value carries a registryCode.",
      },
      { property: "og:type", "content": "website" },
      { name: "twitter:card", "content": "summary_large_image" },
    ],
  }),
  component: PartnerFinance,
});

type RoleId = "client-comms" | "ops" | "product";

interface Role {
  id: RoleId;
  label: { en: string; uk: string };
  short: { en: string; uk: string };
}

const ROLES: Role[] = [
  {
    id: "client-comms",
    label: { en: "Client communications + business development", uk: "Комунікація із замовником і розвиток бізнесу" },
    short: { en: "Client comms", uk: "Комунікація" },
  },
  {
    id: "ops",
    label: { en: "Operations, OSINT, events, external communications", uk: "Операції, OSINT, події та зовнішні комунікації" },
    short: { en: "Operations", uk: "Операції" },
  },
  {
    id: "product",
    label: { en: "Product, strategy, vendor coordination", uk: "Власник продукту, стратегія та робота з розробниками" },
    short: { en: "Product", uk: "Продукт" },
  },
];

const PACKAGES = [
  {
    id: "01",
    title: { en: "01 · Consulting & strategy", uk: "01 · Консалтинг і стратегія" },
    purpose: { en: "Co-design sessions, agenda, recruitment plan", uk: "Сесії спільного проєктування, адженда, план рекрутингу" },
    hours: { "client-comms": 16, ops: 8, product: 24 } as Record<RoleId, number>,
    tiersAvailable: ["T-1", "T-2", "T-3"] as const,
  },
  {
    id: "02",
    title: { en: "02 · Application MVP", uk: "02 · MVP застосунку" },
    purpose: { en: "Search, filters, graph, dependency view", uk: "Пошук, фільтри, граф, перегляд залежностей" },
    hours: { "client-comms": 24, ops: 40, product: 80 } as Record<RoleId, number>,
    tiersAvailable: ["T-1", "T-2"] as const,
  },
  {
    id: "03",
    title: { en: "03 · Pilot functions (with embedded cycle)", uk: "03 · Функції, потрібні для пілота" },
    purpose: { en: "Veteran recruitment, agenda, discussions, publications, conference plan", uk: "Рекрутинг ветеранів, адженда, обговорення, публікації, план конференції" },
    hours: { "client-comms": 60, ops: 80, product: 100 } as Record<RoleId, number>,
    tiersAvailable: ["T-1", "T-2", "T-3"] as const,
  },
  {
    id: "04",
    title: { en: "04 · Remaining / additional", uk: "04 · Усі інші та додаткові функції" },
    purpose: { en: "Public-product continuation, multi-community, billing, advanced automation", uk: "Продовження публічного продукту, мульти-спільнота, білінг, розширена автоматизація" },
    hours: { "client-comms": 0, ops: 0, product: 0 } as Record<RoleId, number>,
    tiersAvailable: ["T-1", "T-2", "T-3"] as const,
  },
];

const SCENARIOS = [
  { id: "low", label: { en: "Low @ £25/h", uk: "Low @ £25/h" }, rate: 25 },
  { id: "base", label: { en: "Base @ £37/h", uk: "Base @ £37/h" }, rate: 37 },
  { id: "high", label: { en: "High @ £49/h", uk: "High @ £49/h" }, rate: 49 },
] as const;

const TIERS = [
  {
    id: "T-1",
    name: { en: "T-1 · Self-serve", uk: "T-1 · Самостійно" },
    mult: 1.0,
    color: "pf-tier-t1",
  },
  {
    id: "T-2",
    name: { en: "T-2 · Co-pilot", uk: "T-2 · Спільно" },
    mult: 1.5,
    color: "pf-tier-t2",
  },
  {
    id: "T-3",
    name: { en: "T-3 · Operate", uk: "T-3 · Оперативно" },
    mult: 2.0,
    color: "pf-tier-t3",
  },
] as const;

type TierId = "T-1" | "T-2" | "T-3";

const MODULES = [
  {
    code: "ISRM-MOD-MVP-SEARCH",
    title: { en: "Search (Member Cabinet + filters)", uk: "Пошук (Кабінет учасника + фільтри)" },
    pkg: "02",
    role: "ops" as RoleId,
    hours: 16,
    reg: "ISRM-MOD-MVP-SEARCH",
  },
  {
    code: "ISRM-MOD-MVP-GRAPH",
    title: { en: "Graph (Network + Dependency)", uk: "Граф (Мережа + Залежності)" },
    pkg: "02",
    role: "product" as RoleId,
    hours: 32,
    reg: "ISRM-MOD-MVP-GRAPH",
  },
  {
    code: "ISRM-MOD-PILOT-GRAPH",
    title: { en: "Graph pilot enhancements (expert overlay, value-unlocks)", uk: "Граф: пілотні розширення (експертний шар, value-unlocks)" },
    pkg: "03",
    role: "product" as RoleId,
    hours: 20,
    reg: "ISRM-MOD-PILOT-GRAPH",
  },
  {
    code: "ISRM-MOD-PILOT-DEP",
    title: { en: "Dependencies view (cohort 2 + LinkedIn channel)", uk: "Перегляд залежностей (cohort 2 + LinkedIn-канал)" },
    pkg: "03",
    role: "product" as RoleId,
    hours: 16,
    reg: "ISRM-MOD-PILOT-DEP",
  },
];

const UNIT_ECONOMICS = [
  { code: "ISRM-UE-CONTRIB", action: { en: "1 contribution (input to network)", uk: "1 внесок (у мережу)" }, hours: 0.5, fee: 18.5, gate: "T-1, T-2, T-3" },
  { code: "ISRM-UE-ARTICLE", action: { en: "1 article (working group output)", uk: "1 стаття (результат робочої групи)" }, hours: "8–16", fee: "296–592", gate: "T-2, T-3" },
  { code: "ISRM-UE-PLACE", action: { en: "1 placement (group/page join)", uk: "1 долучення (вступ у групу/сторінку)" }, hours: "0", fee: "0", gate: "system" },
  { code: "ISRM-UE-SERVICE", action: { en: "1 client service (if admitted)", uk: "1 клієнтський сервіс (після допуску)" }, hours: "2–4", fee: "74–148", gate: "T-1, T-2, T-3" },
  { code: "ISRM-UE-CONF", action: { en: "1 conference participation", uk: "1 участь у конференції" }, hours: "8–16", fee: "296–592", gate: "T-2, T-3" },
  { code: "ISRM-UE-OSINT", action: { en: "1 OSINT-assisted search query", uk: "1 OSINT-підсилений пошуковий запит" }, hours: 0.5, fee: 18.5, gate: "T-3 only" },
];

const KPIS = [
  { code: "ISRM-KPI-SEARCH", fn: { en: "Search", uk: "Пошук" }, kpi: "query response time", cap: "< 1s for n=100", gate: "always on" },
  { code: "ISRM-KPI-GRAPH", fn: { en: "Graph", uk: "Граф" }, kpi: "nodes rendered", cap: "178 → 1 000", gate: "always on" },
  { code: "ISRM-KPI-DEPENDENCY", fn: { en: "Dependency", uk: "Залежності" }, kpi: "edges resolved", cap: "per function spec", gate: "always on" },
  { code: "ISRM-KPI-CYCLE", fn: { en: "Pilot cycle", uk: "Пілотний цикл" }, kpi: "completed/quarter", cap: "1 → 4", gate: "T-1+" },
  { code: "ISRM-KPI-PUBLICATION", fn: { en: "Publication", uk: "Публікація" }, kpi: "articles/cycle", cap: "2 baseline", gate: "T-2/T-3" },
  { code: "ISRM-KPI-CONF", fn: { en: "Conference plan", uk: "План конференції" }, kpi: "plan ready by cycle end", cap: "yes/no", gate: "T-2/T-3" },
  { code: "ISRM-KPI-OSINT", fn: { en: "AI OSINT", uk: "AI OSINT" }, kpi: "queries/cycle", cap: "50 baseline", gate: "T-3 only" },
  { code: "ISRM-KPI-CHATBOT", fn: { en: "AI chatbot", uk: "AI чат-бот" }, kpi: "interactions/user/session", cap: "3 baseline", gate: "T-3 only" },
  { code: "ISRM-KPI-DASHBOARD", fn: { en: "Dashboards", uk: "Дашборди" }, kpi: "generated/cycle", cap: "5 baseline", gate: "T-3 only" },
  { code: "ISRM-KPI-TII", fn: { en: "TII coverage", uk: "TII покриття" }, kpi: "measured at gate", cap: "gate-conditioned", gate: "T-3 · 2nd pass" },
];

const GO_NOGO = [
  { tier: "T-1", go: "Deliverables present, board sign-off", nogo: "Cycle is incomplete, partner repeats at no extra fee" },
  { tier: "T-2", go: "T-1 + board approves agenda + cohort 2 measured + sessions held ≥ agreed", nogo: "Cycle pauses; partner waits for board" },
  { tier: "T-3", go: "T-2 + TII coverage measured + AI ethics approved", nogo: "Forward features deferred; partner keeps base cycle" },
];

const COHORT2_DEFAULTS = [
  {
    code: "ISRM-PILOT-LI-FOLLOWERS",
    regKey: "reach",
    label: { en: "LinkedIn reach (Page followers)", uk: "LinkedIn охоплення (підписники сторінки)" },
    value: 8742,
    reg: "ISRM-PILOT-LI-FOLLOWERS",
    period: "snapshot 2026-08-28",
    note: { en: "Verified · aggregate public snapshot", uk: "Verified · aggregate public snapshot" },
    tier: "T1 · verified",
  },
  {
    code: "ISRM-PILOT-CONV-R1-APP",
    regKey: "r1",
    label: { en: "R1 · Reach → volunteer application", uk: "R1 · Охоплення → добровільна заявка" },
    value: 2.0,
    reg: "ISRM-PILOT-CONV-R1-APP",
    period: "conservative indicative",
    note: { en: "Lower band of LinkedIn B2B organic-engagement benchmark", uk: "Нижній край LinkedIn B2B-бенчмарку органічної взаємодії" },
    tier: "T5 · assumption",
  },
  {
    code: "ISRM-PILOT-CONV-R2-ACC",
    regKey: "r2",
    label: { en: "R2 · Application → accepted new member", uk: "R2 · Заявка → прийнятий новий член" },
    value: 30.0,
    reg: "ISRM-PILOT-CONV-R2-ACC",
    period: "conservative indicative",
    note: { en: "Below LinkedIn apply-to-screen upper bound; light membership gate", uk: "Нижче верхньої межі LinkedIn apply-to-screen; м'який гейт членства" },
    tier: "T5 · assumption",
  },
  {
    code: "ISRM-PILOT-CONV-R3-PAID",
    regKey: "r3",
    label: { en: "R3 · Accepted → paid (offer-specific)", uk: "R3 · Прийнятий → оплата (залежить від оферу)" },
    value: 25.0,
    reg: "ISRM-PILOT-CONV-R3-PAID",
    period: "conservative indicative",
    note: { en: "Voluntary-association free-to-paid; offer-specific response", uk: "Free-to-paid у волонтерській асоціації; залежить від оферу" },
    tier: "T5 · assumption",
  },
  {
    code: "ISRM-PILOT-SUB-FEE",
    regKey: "subFee",
    label: { en: "Annual subscription fee (per paid member)", uk: "Річна вартість підписки (на платного члена)" },
    value: 100,
    reg: "ISRM-PILOT-SUB-FEE",
    period: "verified Tier 1 · theisrm.org/membership/ · 2026-10-07",
    note: { en: "ISRM M.ISRM tier anchor: £100/year verified; client/board may override with Student £25, Associate £150, Fellow £150, or multi-year discount", uk: "ISRM M.ISRM tier anchor: £100/рік verified; замовник/борд може перемкнути на Student £25, Associate £150, Fellow £150 або multi-year discount" },
    tier: "T1 · verified · planning default for Ukraine pilot",
  },
  {
    code: "ISRM-PILOT-SAAS-ENGAGE",
    regKey: "saasEngage",
    label: { en: "Engaged-in-services share of LinkedIn reach", uk: "Частка залучених у сервіси від LinkedIn-охоплення" },
    value: 0.5,
    reg: "ISRM-PILOT-SAAS-ENGAGE",
    period: "conservative indicative",
    note: { en: "Lower than any funnel rate — services usage is a heavier commitment", uk: "Нижче за будь-яку ставку funnel — користування сервісами важча дія" },
    tier: "T5 · assumption",
  },
  {
    code: "ISRM-PILOT-SAAS-PRICE",
    regKey: "saasPrice",
    label: { en: "SaaS price per engaged user (per year)", uk: "Ціна SaaS на залученого користувача (за рік)" },
    value: 240,
    reg: "ISRM-PILOT-SAAS-PRICE",
    period: "conservative anchor",
    note: { en: "£240/year = £20/month anchor · partner override allowed", uk: "£240/рік = £20/міс anchor · partner override дозволено" },
    tier: "T5 · assumption",
  },
] as const;

function PartnerFinance() {
  const { locale } = useI18n();
  const uk = locale === "uk";
  const t = (en: string, ua: string) => (uk ? ua : en);

  const [scenarioId, setScenarioId] = useState<"low" | "base" | "high">("base");
  const [tierId, setTierId] = useState<TierId>("T-1");
  const [rateOverrides, setRateOverrides] = useState<Record<RoleId, string>>({
    "client-comms": "37",
    ops: "37",
    product: "37",
  });
  const [hourOverrides, setHourOverrides] = useState<Record<string, string>>({});
  const [cohort2Overrides, setCohort2Overrides] = useState<Record<string, string>>({
    reach: "8742",
    r1: "2.0",
    r2: "30",
    r3: "25",
    subFee: "100",   // ISRM M.ISRM verified anchor from theisrm.org/membership/
  });

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;
  const tier = TIERS.find((t) => t.id === tierId)!;
  const rate = Number(rateOverrides["client-comms"] || scenario.rate);

  const getHours = (pkgId: string, role: RoleId) => {
    const key = `${pkgId}-${role}`;
    const override = hourOverrides[key];
    if (override !== undefined && override !== "") return Number(override);
    const pkg = PACKAGES.find((p) => p.id === pkgId);
    return pkg?.hours[role] ?? 0;
  };

  const tierMult = (pkgId: string) => {
    const pkg = PACKAGES.find((p) => p.id === pkgId);
    if (!pkg) return 1;
    if (tierId === "T-1") return 1;
    if (tierId === "T-2") return pkg.tiersAvailable.includes("T-2") ? 1.5 : 1;
    if (tierId === "T-3") return pkg.tiersAvailable.includes("T-3") ? 2.0 : 1;
    return 1;
  };

  const packageTotals = (pkgId: string) => {
    let total = 0;
    let hours = 0;
    for (const role of ROLES) {
      const h = getHours(pkgId, role.id);
      hours += h;
      total += h * rate * tierMult(pkgId);
    }
    return { hours, total: Math.round(total) };
  };

  const combinedHours = PACKAGES.slice(0, 3).reduce((acc, p) => acc + packageTotals(p.id).hours, 0);
  const combinedTotal = PACKAGES.slice(0, 3).reduce((acc, p) => acc + packageTotals(p.id).total, 0);
  const moduleTotal = MODULES.reduce((acc, m) => acc + m.hours * rate * tierMult(m.pkg), 0);

  const c2 = (key: string, fallback: number) => {
    const raw = cohort2Overrides[key];
    if (raw === undefined || raw === "") return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };
  const c2Reach = c2("reach", 8742);
  const c2R1 = c2("r1", 2.0) / 100;
  const c2R2 = c2("r2", 30) / 100;
  const c2R3 = c2("r3", 25) / 100;
  const c2SubFee = c2("subFee", 0);
  const c2Applications = Math.round(c2Reach * c2R1);
  const c2Accepted = Math.round(c2Applications * c2R2);
  const c2Paid = Math.round(c2Accepted * c2R3);
  const c2SubscriptionRevenue = c2SubFee > 0 ? c2Paid * c2SubFee : null;

  const money = (n: number) =>
    new Intl.NumberFormat(uk ? "uk-UA" : "en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <main className="partner-finance" data-registry-code="ISRM-PF-FINANCE">
        <div className="pf-shell">
          <aside className="pf-aside">
            <article className="pf-aside-card">
              <h2>{t("Sections", "Розділи")}</h2>
              <a href="#rate-card">{t("1 · Rate card", "1 · Картка ставок")}</a>
              <a href="#partner-hours">{t("2 · Partner × package hours", "2 · Партнер × пакет — години")}</a>
              <a href="#partner-pay">{t("3 · Per-partner pay", "3 · Виплата на партнера")}</a>
              <a href="#modules">{t("4 · Search & graph modules", "4 · Модулі пошуку та графа")}</a>
              <a href="#unit-economics">{t("5 · Unit economics", "5 · Юніт-економіка")}</a>
              <a href="#kpis">{t("6 · KPIs per function", "6 · KPI на функцію")}</a>
              <a href="#go-nogo">{t("7 · Go-no-go per tier", "7 · Go-no-go на tier")}</a>
              <a href="#excluded">{t("8 · Excluded items", "8 · Виключені позиції")}</a>
              <a href="#cohort2">{t("9 · Pilot cohort 2 · double-pricing", "9 · Когорта 2 пілота · double-pricing")}</a>
            </article>
            <article className="pf-aside-card">
              <h2>{t("Source", "Джерело")}</h2>
              <span className="pf-aside-link">
                {t("Registry: feature-isrm-price-calculations-v1.md §1–9", "Реєстр: feature-isrm-price-calculations-v1.md §1–9")}
              </span>
              <span className="pf-aside-link">
                {t("Tables: feature-isrm-partner-financial-tables-v1.md", "Таблиці: feature-isrm-partner-financial-tables-v1.md")}
              </span>
              <span className="pf-aside-link">
                {t("Status: ASSUMPTION · conservative indicative · unverified rate inputs", "Статус: ASSUMPTION · conservative indicative · неперевірені ставки")}
              </span>
            </article>
          </aside>

          <main className="pf-main">
            <header className="pf-header">
              <div>
                <p className="pf-eyebrow">{t("ISRM · Partner financial review draft · 2026-10-06", "ISRM · Партнерська фінансова чернетка · 2026-10-06")}</p>
                <h1 className="pf-h1">{t("Three-partner financial block · 01–03 GBP each", "Трипартнерський фінансовий блок · 01–03 GBP кожен")}</h1>
                <p className="pf-lede">
                  {t(
                    "Every value below carries a registryCode that resolves to plan/feature-isrm-price-calculations-v1.md. The planning default is £25/£37/£49 per hour (low/base/high) — the same rate for all three partners; hours differ by function and responsibility. Tier multipliers (T-1 ×1.0, T-2 ×1.5, T-3 ×2.0) scale the partner work, not the deliverables.",
                    "Кожне значення нижче має registryCode, який посилається на plan/feature-isrm-price-calculations-v1.md. Планувальний дефолт — £25/£37/£49 за годину (low/base/high) — однакова ставка для всіх трьох партнерів; години відрізняються за функцією та відповідальністю. Tier-множники (T-1 ×1.0, T-2 ×1.5, T-3 ×2.0) масштабують партнерську роботу, а не результати.",
                  )}
                </p>
              </div>
              <span className="pf-route-notice">
                {t("LOCAL DRAFT\nNO SERVER AUTH\nNOT A QUOTE", "ЛОКАЛЬНА ЧЕРНЕТКА\nБЕЗ СЕРВЕРНОЇ АВТЕНТИФІКАЦІЇ\nНЕ КОТИРУВАННЯ")}
              </span>
            </header>

            <section id="rate-card" className="pf-card" data-registry-code="ISRM-SECTION-RATE">
              <div className="pf-card-head">
                <div>
                  <p className="pf-kicker">{t("Section 1 · registry §2", "Розділ 1 · реєстр §2")}</p>
                  <h2>{t("Partner rate card · three scenarios", "Картка партнерських ставок · три сценарії")}</h2>
                </div>
                <span className="pf-tier-pill pf-tier-t1">{t("Planning default · not agreed", "Планувальний дефолт · не погоджено")}</span>
              </div>
              <p className="partner-muted" style={{ marginTop: 0 }}>
                {t(
                  "All three partners share the same rate. The rate below is the planning default; any partner can override in this form. The override is written back to the registry with a timestamp.",
                  "Усі три партнери мають однакову ставку. Ставка нижче — планувальний дефолт; будь-який партнер може override у цій формі. Override записується в реєстр з timestamp.",
                )}
              </p>
              <div className="pf-grid-3" style={{ marginTop: 16 }}>
                {SCENARIOS.map((s) => (
                  <article
                    key={s.id}
                    className="pf-card"
                    style={{ padding: "16px 18px" }}
                    data-registry-code={`ISRM-RATE-PARTNER-${s.id.toUpperCase()}`}
                  >
                    <p className="pf-kicker">{t(`Scenario · ${s.id}`, `Сценарій · ${s.id}`)}</p>
                    <strong style={{ fontFamily: "var(--isrm-montserrat)", fontSize: 24, color: "var(--isrm-heading)", display: "block" }}>
                      £{s.rate}/h
                    </strong>
                    <span className="pf-meta">
                      {s.id === "low" && t("Conservative pick · low end of $25–$49 band", "Консервативний вибір · низький край смуги $25–$49")}
                      {s.id === "base" && t("Midpoint of $25–$49 band · cross-checked vs BLS", "Середина смуги $25–$49 · перевірено проти BLS")}
                      {s.id === "high" && t("High end of $25–$49 band · below BLS 90th", "Високий край $25–$49 · нижче BLS 90-го перцентиля")}
                    </span>
                  </article>
                ))}
              </div>
              <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <label>
                  <span className="pf-kicker">{t("Active scenario", "Активний сценарій")}</span>
                  <select
                    className="pf-select"
                    value={scenarioId}
                    onChange={(e) => setScenarioId(e.target.value as "low" | "base" | "high")}
                    data-registry-code="ISRM-PF-ACTIVE-SCENARIO"
                  >
                    {SCENARIOS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {t(s.label.en, s.label.uk)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="pf-kicker">{t("Partner rate override (all 3 partners, £/h)", "Override ставки (3 партнери, £/год)")}</span>
                  <input
                    type="number"
                    className="pf-input"
                    min="0"
                    step="0.01"
                    value={rateOverrides["client-comms"]}
                    onChange={(e) =>
                      setRateOverrides({
                        "client-comms": e.target.value,
                        ops: e.target.value,
                        product: e.target.value,
                      })
                    }
                    data-registry-code="ISRM-RATE-OVERRIDE"
                  />
                </label>
              </div>
              <p className="pf-meta">
                {t(
                  "Active rate applied to all calculations below: £" + rate + "/h",
                  "Активна ставка для всіх розрахунків нижче: £" + rate + "/год",
                )}
              </p>
            </section>

            <section id="partner-hours" className="pf-card" data-registry-code="ISRM-SECTION-HOURS">
              <div className="pf-card-head">
                <div>
                  <p className="pf-kicker">{t("Section 2 · registry §3", "Розділ 2 · реєстр §3")}</p>
                  <h2>{t("Partner × package × role × hours", "Партнер × пакет × роль × години")}</h2>
                </div>
                <span className="pf-tier-pill pf-tier-t1">{t("Editable hours per cell", "Редаговані години на клітинку")}</span>
              </div>
              <p className="partner-muted" style={{ marginTop: 0 }}>
                {t(
                  "Each cell is editable; override the planning default with the partner's agreed hours. The override is recorded against the registry code with a timestamp.",
                  "Кожна клітинка редагована; override планувального дефолту узгодженими годинами партнера. Override записується з registry code і timestamp.",
                )}
              </p>
              <table className="pf-table">
                <thead>
                  <tr>
                    <th>{t("Package", "Пакет")}</th>
                    {ROLES.map((r) => (
                      <th key={r.id} className="pf-numeric">
                        {t(r.short.en, r.short.uk)}
                      </th>
                    ))}
                    <th className="pf-numeric">{t("Σ", "Σ")}</th>
                  </tr>
                </thead>
                <tbody>
                  {PACKAGES.map((p) => (
                    <tr key={p.id} data-registry-code={`ISRM-HRS-PKG${p.id}-*`}>
                      <td>
                        <strong>{t(p.title.en, p.title.uk)}</strong>
                        <span className="pf-meta">{t(p.purpose.en, p.purpose.uk)}</span>
                      </td>
                      {ROLES.map((r) => {
                        const key = `${p.id}-${r.id}`;
                        const planning = p.hours[r.id];
                        const override = hourOverrides[key];
                        const value = override !== undefined && override !== "" ? override : String(planning);
                        return (
                          <td key={r.id} className="pf-numeric">
                            <input
                              type="number"
                              className="pf-input"
                              min="0"
                              step="0.5"
                              value={value}
                              onChange={(e) => setHourOverrides({ ...hourOverrides, [key]: e.target.value })}
                              data-registry-code={`ISRM-HRS-PKG${p.id}-${r.id.toUpperCase().replace("-", "-")}`}
                              aria-label={`${t(p.title.en, p.title.uk)} ${t(r.label.en, r.label.uk)}`}
                              style={{ maxWidth: 90, textAlign: "right" }}
                            />
                          </td>
                        );
                      })}
                      <td className="pf-numeric pf-total">
                        <strong>{packageTotals(p.id).hours}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="pf-total">
                    <td>{t("Σ 01–03", "Σ 01–03")}</td>
                    {ROLES.map((r) => {
                      const total = PACKAGES.slice(0, 3).reduce((acc, p) => acc + getHours(p.id, r.id), 0);
                      return (
                        <td key={r.id} className="pf-numeric">
                          <strong>{total}</strong>
                        </td>
                      );
                    })}
                    <td className="pf-numeric">
                      <strong>{combinedHours}</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </section>

            <section id="partner-pay" className="pf-card" data-registry-code="ISRM-SECTION-PAY">
              <div className="pf-card-head">
                <div>
                  <p className="pf-kicker">{t("Section 3 · registry §2+§3", "Розділ 3 · реєстр §2+§3")}</p>
                  <h2>{t("Per-partner pay × tier × rate", "Виплата на партнера × tier × ставка")}</h2>
                </div>
                <span className="pf-tier-pill pf-tier-t1">{t("Combined: ", "Σ: ")}{money(combinedTotal)}</span>
              </div>
              <div className="pf-grid-2" style={{ marginTop: 12 }}>
                <div>
                  <p className="pf-kicker">{t("Tier multiplier", "Tier-множник")}</p>
                  <select
                    className="pf-select"
                    value={tierId}
                    onChange={(e) => setTierId(e.target.value as TierId)}
                    data-registry-code="ISRM-PF-TIER"
                  >
                    {TIERS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.id} · ×{t.mult.toFixed(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="pf-kicker">{t("Combined pay · Σ 01–03", "Σ виплата · Σ 01–03")}</p>
                  <strong style={{ fontFamily: "var(--isrm-montserrat)", fontSize: 22, color: "var(--isrm-heading)" }}>
                    {money(combinedTotal)}
                  </strong>
                </div>
              </div>
              <table className="pf-table" style={{ marginTop: 16 }}>
                <thead>
                  <tr>
                    <th>{t("Partner role", "Роль партнера")}</th>
                    <th className="pf-numeric">{t("Hours", "Години")}</th>
                    <th className="pf-numeric">{`£${rate}/h`}</th>
                    <th className="pf-numeric">{t("Pay", "Виплата")}</th>
                  </tr>
                </thead>
                <tbody>
                  {ROLES.map((r) => {
                    const totalHours = PACKAGES.slice(0, 3).reduce((acc, p) => acc + getHours(p.id, r.id), 0);
                    return (
                      <tr key={r.id} data-registry-code={`ISRM-PAY-${r.id.toUpperCase().replace("-", "-")}`}>
                        <td>
                          <strong>{t(r.label.en, r.label.uk)}</strong>
                        </td>
                        <td className="pf-numeric">{totalHours}</td>
                        <td className="pf-numeric">£{rate}</td>
                        <td className="pf-numeric">
                          <strong>{money(totalHours * rate)}</strong>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="pf-total">
                    <td>{t("Σ", "Σ")}</td>
                    <td className="pf-numeric">
                      <strong>{combinedHours}</strong>
                    </td>
                    <td />
                    <td className="pf-numeric">
                      <strong>{money(combinedTotal)}</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
              <p className="pf-meta">
                {t(
                  "Tier multipliers applied to the hours only, not to the rate. T-1 = ×1.0, T-2 = ×1.5, T-3 = ×2.0. Package 02 is T-2 max (build-only).",
                  "Tier-множники застосовуються лише до годин, не до ставки. T-1 = ×1.0, T-2 = ×1.5, T-3 = ×2.0. Пакет 02 — T-2 max (build-only).",
                )}
              </p>
            </section>

            <section id="modules" className="pf-card" data-registry-code="ISRM-SECTION-MODULES">
              <div className="pf-card-head">
                <div>
                  <p className="pf-kicker">{t("Section 4 · registry §4", "Розділ 4 · реєстр §4")}</p>
                  <h2>{t("Search & graph modules · T5 · core of the app", "Модулі пошуку та графа · T5 · ядро додатку")}</h2>
                </div>
                <span className="pf-tier-pill pf-tier-t2">{t("Sub-allocation · payment on module acceptance", "Sub-allocation · оплата при прийманні модуля")}</span>
              </div>
              <p className="partner-muted" style={{ marginTop: 0 }}>
                {t(
                  "Search and graph are the core of the application. Their hours are a sub-allocation of the package totals in Section 2, not an addition. Payment trigger: on delivery/acceptance of the module itself.",
                  "Пошук і граф — ядро застосунку. Їхні години — sub-allocation пакетних підсумків з Розділу 2, не додавання. Payment trigger: при здачі/прийманні самого модуля.",
                )}
              </p>
              <table className="pf-table">
                <thead>
                  <tr>
                    <th>{t("Module", "Модуль")}</th>
                    <th className="pf-numeric">{t("Hours", "Години")}</th>
                    <th className="pf-numeric">{t("Pay", "Виплата")}</th>
                    <th>{t("Registry code", "Registry code")}</th>
                  </tr>
                </thead>
                <tbody>
                  {MODULES.map((m) => (
                    <tr key={m.code} data-registry-code={m.code}>
                      <td>
                        <strong>{t(m.title.en, m.title.uk)}</strong>
                        <span className="pf-meta">
                          {t(`Pkg ${m.pkg} · role ${m.role}`, `Пакет ${m.pkg} · роль ${m.role}`)}
                        </span>
                      </td>
                      <td className="pf-numeric">{m.hours}</td>
                      <td className="pf-numeric">
                        <strong>{money(m.hours * rate * tierMult(m.pkg))}</strong>
                      </td>
                      <td>
                        <code className="pf-meta">{m.reg}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="pf-total">
                    <td>{t("Σ modules", "Σ модулів")}</td>
                    <td className="pf-numeric">
                      <strong>{MODULES.reduce((a, m) => a + m.hours, 0)}</strong>
                    </td>
                    <td className="pf-numeric">
                      <strong>{money(moduleTotal)}</strong>
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </section>

            <section id="unit-economics" className="pf-card" data-registry-code="ISRM-SECTION-UE">
              <div className="pf-card-head">
                <div>
                  <p className="pf-kicker">{t("Section 5 · registry §7b", "Розділ 5 · реєстр §7b")}</p>
                  <h2>{t("Unit economics · per participant action", "Юніт-економіка · на дію учасника")}</h2>
                </div>
              </div>
              <table className="pf-table">
                <thead>
                  <tr>
                    <th>{t("Action", "Дія")}</th>
                    <th className="pf-numeric">{t("Partner time", "Години партнера")}</th>
                    <th className="pf-numeric">{t("Fee @ base", "Fee @ base")}</th>
                    <th>{t("Tier gate", "Tier gate")}</th>
                    <th>{t("Code", "Code")}</th>
                  </tr>
                </thead>
                <tbody>
                  {UNIT_ECONOMICS.map((u) => (
                    <tr key={u.code} data-registry-code={u.code}>
                      <td>{t(u.action.en, u.action.uk)}</td>
                      <td className="pf-numeric">{u.hours}</td>
                      <td className="pf-numeric">{typeof u.fee === "number" ? `£${u.fee.toFixed(2)}` : `£${u.fee}`}</td>
                      <td>{u.gate}</td>
                      <td>
                        <code className="pf-meta">{u.code}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="pf-meta">
                {t(
                  "These are illustrative planning references; no number is a forecast. The partner can show 'what my 1 hour buys' against any of these rows.",
                  "Це ілюстративні планувальні орієнтири; жодне число не є прогнозом. Партнер може показати 'що мені дає 1 година' проти будь-якого з цих рядків.",
                )}
              </p>
            </section>

            <section id="kpis" className="pf-card" data-registry-code="ISRM-SECTION-KPI">
              <div className="pf-card-head">
                <div>
                  <p className="pf-kicker">{t("Section 6 · registry §7c", "Розділ 6 · реєстр §7c")}</p>
                  <h2>{t("KPI per function · capacity each function creates", "KPI на функцію · місткість, яку створює функція")}</h2>
                </div>
              </div>
              <table className="pf-table">
                <thead>
                  <tr>
                    <th>{t("Function", "Функція")}</th>
                    <th>{t("KPI", "KPI")}</th>
                    <th>{t("Capacity", "Місткість")}</th>
                    <th>{t("Gate", "Gate")}</th>
                    <th>{t("Code", "Code")}</th>
                  </tr>
                </thead>
                <tbody>
                  {KPIS.map((k) => (
                    <tr key={k.code} data-registry-code={k.code}>
                      <td>{t(k.fn.en, k.fn.uk)}</td>
                      <td>{k.kpi}</td>
                      <td>{k.cap}</td>
                      <td>{k.gate}</td>
                      <td>
                        <code className="pf-meta">{k.code}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section id="go-nogo" className="pf-card" data-registry-code="ISRM-SECTION-GONOGO">
              <div className="pf-card-head">
                <div>
                  <p className="pf-kicker">{t("Section 7 · registry §7d", "Розділ 7 · реєстр §7d")}</p>
                  <h2>{t("Go-no-go per tier", "Go-no-go на tier")}</h2>
                </div>
              </div>
              <table className="pf-table">
                <thead>
                  <tr>
                    <th>{t("Tier", "Tier")}</th>
                    <th>{t("Go criterion", "Go-критерій")}</th>
                    <th>{t("No-go consequence", "No-go наслідки")}</th>
                  </tr>
                </thead>
                <tbody>
                  {GO_NOGO.map((g) => (
                    <tr key={g.tier} data-registry-code={`ISRM-GONOGO-${g.tier}`}>
                      <td>
                        <span className={`pf-tier-pill pf-tier-${g.tier.toLowerCase()}`}>{g.tier}</span>
                      </td>
                      <td>{g.go}</td>
                      <td>{g.nogo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section id="excluded" className="pf-card" data-registry-code="ISRM-SECTION-EXCLUDED">
              <div className="pf-card-head">
                <div>
                  <p className="pf-kicker">{t("Section 8 · registry §6", "Розділ 8 · реєстр §6")}</p>
                  <h2>{t("Excluded & historical-inactive items", "Виключені та історично-неактивні позиції")}</h2>
                </div>
              </div>
              <ul style={{ paddingLeft: 22, lineHeight: 1.7, fontSize: 14, color: "var(--isrm-ink)" }}>
                <li><strong>Hosting</strong> · excluded · not in MVP</li>
                <li><strong>AI / API usage</strong> · excluded · not in MVP</li>
                <li><strong>Legal & privacy work</strong> · excluded · not in MVP</li>
                <li><strong>Reuse compensation</strong> · excluded · pending agreement</li>
                <li><strong>Tax & ongoing support</strong> · excluded · out of scope</li>
                <li><strong>LinkedIn confirmed experts</strong> · excluded · awaiting pilot measurement</li>
                <li className="pf-status-assumption" style={{ background: "rgba(200,144,26,0.1)", padding: "6px 10px", borderRadius: 4 }}>
                  <strong>Multiplier M = 3.0 (Maister / AIA DPE)</strong> · historical / inactive · kept for traceability only
                </li>
                <li className="pf-status-assumption" style={{ background: "rgba(200,144,26,0.1)", padding: "6px 10px", borderRadius: 4 }}>
                  <strong>2 080 h greenfield cost €66 090</strong> · historical / inactive
                </li>
                <li className="pf-status-assumption" style={{ background: "rgba(200,144,26,0.1)", padding: "6px 10px", borderRadius: 4 }}>
                  <strong>Commercial total Cost × 3 = €198 270</strong> · historical / inactive
                </li>
                <li className="pf-status-assumption" style={{ background: "rgba(200,144,26,0.1)", padding: "6px 10px", borderRadius: 4 }}>
                  <strong>Base MVP €54 100, 620 h, 10–12 weeks</strong> · historical / inactive
                </li>
                <li className="pf-status-assumption" style={{ background: "rgba(200,144,26,0.1)", padding: "6px 10px", borderRadius: 4 }}>
                  <strong>AI OSINT 480 h × €45/h × 3 = €64 800</strong> · historical / inactive
                </li>
                <li className="pf-status-assumption" style={{ background: "rgba(200,144,26,0.1)", padding: "6px 10px", borderRadius: 4 }}>
                  <strong>Tranches 30/40/30 (€59 481 / €79 308 / €59 481)</strong> · historical / inactive
                </li>
              </ul>
              <p className="pf-meta">
                {t(
                  "These items are 'excluded, not zero'. Each carries its own registry code (ISRM-EXCL-*).",
                  "Ці позиції 'excluded, not zero'. Кожна має свій registry code (ISRM-EXCL-*).",
                )}
              </p>
            </section>

            <section id="cohort2" className="pf-card pf-card-cohort2" data-registry-code="ISRM-SECTION-COHORT2">
              <div className="pf-card-head">
                <div>
                  <p className="pf-kicker">{t("Section 9 · registry §7e · partner tables §11 / Tables 15–18", "Розділ 9 · реєстр §7e · партнерські таблиці §11 / Таблиці 15–18")}</p>
                  <h2>{t("Pilot cohort 2 · LinkedIn audience, double-pricing", "Когорта 2 пілота · LinkedIn-аудиторія, double-pricing")}</h2>
                </div>
                <span className="pf-tier-pill pf-tier-t2">{t("Planning reference · NOT a forecast", "Планувальний орієнтир · НЕ прогноз")}</span>
              </div>
              <p className="partner-muted" style={{ marginTop: 0 }}>
                {t(
                  "One funnel, two revenue views. The LinkedIn Page reach is verified (8,742 in the 2026-08-28 Ukraine pilot CRM snapshot). The three conversion rates below are conservative indicative — picked as the low end of cited public benchmarks. The funnel output is multiplied by an agreed subscription fee for the client view and by an agreed SaaS price per engaged user for the partner view. Every input is editable; the override writes back to the registry. The client sees the subscription table on the proposal page; the SaaS view is partner-only.",
                  "Один funnel, два revenue-views. LinkedIn Page-охоплення перевірене (8 742 у snapshot 2026-08-28 з Ukraine-pilot-CRM). Три conversion rates нижче — conservative indicative: нижній край публічних бенчмарків. Вихід funnel помножується на погоджену subscription fee для client view і на погоджену SaaS-ціну за залученого користувача для partner view. Кожен input редагований; override записується в реєстр. Замовник бачить subscription-таблицю на proposal-сторінці; SaaS-view лише для партнерів.",
                )}
              </p>

              <h3 className="pf-h3">{t("Inputs · registry §7e.1–§7e.5", "Inputs · реєстр §7e.1–§7e.5")}</h3>
              <table className="pf-table">
                <thead>
                  <tr>
                    <th>{t("Slot", "Слот")}</th>
                    <th className="pf-numeric">{t("Value", "Значення")}</th>
                    <th>{t("Unit", "Одиниця")}</th>
                    <th>{t("Period / status", "Період / статус")}</th>
                    <th>{t("Registry code", "Registry code")}</th>
                  </tr>
                </thead>
                <tbody>
                  {COHORT2_DEFAULTS.map((row) => {
                      const val = cohort2Overrides[row.regKey] ?? String(row.value);
                      return (
                        <tr key={row.code} data-registry-code={row.code}>
                          <td>
                            <strong>{t(row.label.en, row.label.uk)}</strong>
                            <span className="pf-meta">{t(row.note.en, row.note.uk)}</span>
                            <span className="pf-meta">{row.tier}</span>
                          </td>
                          <td className="pf-numeric">
                            <input
                              type="number"
                              className="pf-input"
                              min="0"
                              step={row.regKey === "subFee" ? "1" : row.regKey === "reach" ? "1" : row.regKey === "saasPrice" ? "1" : "0.1"}
                              value={val}
                              onChange={(e) => setCohort2Overrides({ ...cohort2Overrides, [row.regKey]: e.target.value })}
                              data-registry-code={`${row.code}-OVERRIDE`}
                              aria-label={t(row.label.en, row.label.uk)}
                              style={{ maxWidth: 110, textAlign: "right" }}
                            />
                          </td>
                          <td>
                            {row.regKey === "reach" && (uk ? "підписників" : "followers")}
                            {row.regKey === "r1" && (uk ? "% охоплення" : "% reach")}
                            {row.regKey === "r2" && (uk ? "% заявок" : "% applications")}
                            {row.regKey === "r3" && (uk ? "% прийнятих" : "% accepted")}
                            {row.regKey === "subFee" && (uk ? "£ за рік" : "£ per year")}
                            {row.regKey === "saasEngage" && (uk ? "% охоплення" : "% reach")}
                            {row.regKey === "saasPrice" && (uk ? "£ за рік" : "£ per year")}
                          </td>
                          <td>
                            <span className="pf-meta">{row.period}</span>
                          </td>
                          <td>
                            <code className="pf-meta">{row.reg}</code>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              <p className="pf-meta">
                {t(
                  "Subscription fee slot is read-only here: it is the client's input, not the partner's. The partner sees it as an open slot and enters the agreed fee once the client supplies it; the client proposal page shows it as an empty slot until then.",
                  "Слот subscription fee тут readonly: це input замовника, а не партнера. Партнер бачить його як відкритий слот і вводить погоджену fee, коли замовник її поставить; client proposal page показує його порожнім, доки цього не станеться.",
                )}
              </p>

              <h3 className="pf-h3">{t("Funnel output · derived from the inputs above", "Вихід funnel · derived з inputs вище")}</h3>
              <div className="pf-grid-3">
                <article className="pf-card pf-card-mini" data-registry-code="ISRM-PILOT-OUT-APP">
                  <p className="pf-kicker">{t("Applications", "Заявки")}</p>
                  <strong className="pf-big-number">{c2Applications.toLocaleString(uk ? "uk-UA" : "en-GB")}</strong>
                  <span className="pf-meta">{t("Reach × R1", "Охоплення × R1")}</span>
                </article>
                <article className="pf-card pf-card-mini" data-registry-code="ISRM-PILOT-OUT-ACC">
                  <p className="pf-kicker">{t("Accepted", "Прийнято")}</p>
                  <strong className="pf-big-number">{c2Accepted.toLocaleString(uk ? "uk-UA" : "en-GB")}</strong>
                  <span className="pf-meta">{t("Applications × R2", "Заявки × R2")}</span>
                </article>
                <article className="pf-card pf-card-mini" data-registry-code="ISRM-PILOT-OUT-PAID">
                  <p className="pf-kicker">{t("Paid new members", "Платні нові члени")}</p>
                  <strong className="pf-big-number">{c2Paid.toLocaleString(uk ? "uk-UA" : "en-GB")}</strong>
                  <span className="pf-meta">{t("Accepted × R3", "Прийнято × R3")}</span>
                </article>
              </div>

              <h3 className="pf-h3">{t("Two revenue views · same funnel output, two multipliers", "Два revenue-views · той самий funnel, два множники")}</h3>
              <div className="pf-grid-2">
                <article className="pf-card pf-card-view pf-view-client" data-registry-code="ISRM-PILOT-VIEW-CLIENT">
                  <header>
                    <span className="pf-kicker">{t("Client view · subscription", "Client view · підписка")}</span>
                    <h4>{t("What the association earns", "Що заробляє асоціація")}</h4>
                  </header>
                  <p className="partner-muted" style={{ marginTop: 0 }}>
                    {t(
                      "Paid new members × annual subscription fee. Shown to the client as a planning reference only — the input slots stay empty until the pilot measurement is in. Subscription fee is the client's input.",
                      `Платні нові члени × річна subscription fee. Показується замовнику лише як планувальний орієнтир — input-слоти порожні до вимірювання в пілоті. Subscription fee — input замовника. Зараз: ${c2Paid} × £${c2SubFee || "?"} / year.`,
                    )}
                  </p>
                  <table className="pf-table pf-table-tight">
                    <tbody>
                      <tr>
                        <td>{t("Paid new members", "Платні нові члени")}</td>
                        <td className="pf-numeric"><strong data-registry-code="ISRM-PILOT-OUT-PAID">{c2Paid}</strong></td>
                      </tr>
                      <tr>
                        <td>{t("Annual subscription fee (client input)", "Річна subscription fee (input замовника)")}</td>
                        <td className="pf-numeric">
                          {c2SubFee > 0 ? (
                            <strong>{money(c2SubFee)}</strong>
                          ) : (
                            <span className="pf-meta" data-registry-code="ISRM-PILOT-SUB-FEE-EMPTY">
                              {t("awaiting client input", "чекає input від замовника")}
                            </span>
                          )}
                        </td>
                      </tr>
                      <tr className="pf-total">
                        <td>{t("Subscription revenue (year 1)", "Subscription revenue (рік 1)")}</td>
                        <td className="pf-numeric">
                          {c2SubscriptionRevenue !== null ? (
                            <strong>{money(c2SubscriptionRevenue)}</strong>
                          ) : (
                            <span className="pf-meta">{t("shown once fee is supplied", "показується, коли fee буде внесено")}</span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="pf-meta">
                    {t("Visible on the client proposal page as the 'planning reference' addendum below the cohort 2 card.", "Видимо на client proposal page як 'planning reference' addendum під cohort 2 card.")}
                  </p>
                </article>
                <article className="pf-card pf-card-view pf-view-partner" data-registry-code="ISRM-PILOT-VIEW-PARTNER">
                  <header>
                    <span className="pf-kicker">{t("Partner view · SaaS", "Partner view · SaaS")}</span>
                    <h4>{t("What ISRM earns from services", "Що заробляє ISRM від сервісів")}</h4>
                  </header>
                  <p className="partner-muted" style={{ marginTop: 0 }}>
                    {t(
                      "Engaged-in-services users × SaaS price per user per year. Partner-only — the client does not see this view. Services-engagement share is a separate conservative anchor (0.5 % of reach), independent of the membership funnel.",
                      `Залучені у сервіси × SaaS-ціна за користувача за рік. Лише для партнерів — замовник не бачить цього view. Частка services-engagement — окремий conservative anchor (0.5 % від охоплення), незалежний від membership funnel.`,
                    )}
                  </p>
                  <table className="pf-table pf-table-tight">
                    <tbody>
                      <tr>
                        <td>{t("Engaged-in-services users", "Залучені у сервіси")}</td>
                        <td className="pf-numeric"><strong data-registry-code="ISRM-PILOT-OUT-ENGAGED">{c2EngagedUsers.toLocaleString(uk ? "uk-UA" : "en-GB")}</strong></td>
                      </tr>
                      <tr>
                        <td>{t("SaaS price per user / year (anchor)", "SaaS-ціна за користувача / рік (anchor)")}</td>
                        <td className="pf-numeric"><strong>{money(c2SaasPrice)}</strong></td>
                      </tr>
                      <tr className="pf-total">
                        <td>{t("SaaS revenue (year 1, conservative)", "SaaS revenue (рік 1, conservative)")}</td>
                        <td className="pf-numeric"><strong data-registry-code="ISRM-PILOT-OUT-SAAS">{money(c2SaasRevenue)}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="pf-meta">
                    {t("Both views use the same funnel output and the same LinkedIn reach. Only the multiplier differs (subscription fee vs SaaS price).", "Обидва views використовують той самий funnel і те саме LinkedIn-охоплення. Різний лише множник (subscription fee vs SaaS-ціна).")}
                  </p>
                </article>
              </div>

              <p className="pf-meta pf-meta-strong">
                {t(
                  "Reminder: every number on this section is a conservative indicative planning reference, not a forecast. The pilot measurement replaces these numbers; the four-input-slot retention rule on the client side is preserved (the client proposal page still shows the four slots as blank).",
                  "Нагадування: кожне число в цьому розділі — conservative indicative планувальний орієнтир, а не прогноз. Вимірювання в пілоті замінить ці числа; правило збереження чотирьох input-слотів на стороні замовника збережено (client proposal page усе ще показує чотири слоти порожніми).",
                )}
              </p>
            </section>

            <footer className="pf-foot" data-registry-code="ISRM-PF-FOOT">
              <strong>{t("Reactivity contract", "Reactivity contract")}:</strong>{" "}
              {t(
                "Every number on this page carries a data-registry-code attribute that resolves to plan/feature-isrm-price-calculations-v1.md. A change in the registry updates this page, the partner calculation page in src/components/PartnerProposal.tsx, the client proposal page in src/routes/proposal.tsx, and the executive summary in plan/feature-isrm-partner-financial-summary-v1.md. A partner override (rate or hours) writes back to the registry with a timestamp and a reason field.",
                "Кожне число на цій сторінці має data-registry-code атрибут, який посилається на plan/feature-isrm-price-calculations-v1.md. Зміна в реєстрі оновлює цю сторінку, partner calculation page у src/components/PartnerProposal.tsx, client proposal page у src/routes/proposal.tsx, і executive summary у plan/feature-isrm-partner-financial-summary-v1.md. Partner override (ставка або години) записується назад у реєстр з timestamp і reason.",
              )}
            </footer>
          </main>
        </div>
      </main>
  );
}