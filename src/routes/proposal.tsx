import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Server, ShieldCheck, Sparkles } from "lucide-react";
import { pushInbox } from "@/lib/access";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/proposal")({
  head: () => ({
    meta: [
      { title: "ISRM Ukraine Platform Proposal" },
      { name: "description", content: "Bilingual product proposal, delivery roadmap and transparent pricing for the ISRM Ukraine expert network." },
      { property: "og:title", content: "ISRM Ukraine Platform Proposal" },
      { property: "og:description", content: "Product scope, architecture, roadmap and pricing for the ISRM Ukraine platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Proposal,
});

const COPY = {
  uk: {
    eyebrow: "Артефакт-пропозиція · для ЛПР", title: "Цифрова інфраструктура довіри для експертної мережі ISRM Ukraine",
    step: "Крок", next: "Далі", architecture: "Архітектура", roadmap: "Дорожня карта", pricing: "Цінова пропозиція",
    pricingIntro: "Три сценарії інвестиції — від перевірки цінності до захищеної міжнародної платформи. Суми наведені без ПДВ і сторонніх сервісів.",
    recommended: "Рекомендовано", oneTime: "одноразово", monthly: "підтримка / місяць", choose: "Обговорити пакет",
    rationale: "Що формує ціну", rationaleText: "Оцінка базується не на кількості екранів, а на ризику даних, складності графа, рівнях доступу, якості імпорту CRM та обсязі перевірки. Кожен наступний пакет включає попередній.",
    assumptions: "Припущення оцінки", assumptionsText: "До 250 профілів на старті, один набір CRM-даних, дві мови інтерфейсу, одна організація-замовник. Остаточна пропозиція уточнюється після короткої технічної сесії.",
    feedback: "Пропозиція координатору", feedbackText: "Ваш відгук потрапить напряму у кабінет координатора ISRM Ukraine.", thanks: "Дякуємо. Пропозицію передано координатору.", name: "Ім'я, посада", message: "Ваша пропозиція", send: "Надіслати",
    steps: [
      ["Карта мережі", "Force-directed граф 178 вузлів із трьома шарами кластерів. Дотик фокусує оточення експерта, масштабування та фільтри перебудовують граф наживо.", "/", "Відкрити карту"],
      ["Протокол приватності", "За замовчуванням дані знеособлені. Код рекомендодавця відкриває імена й організації; пароль координатора — прямі контакти.", "/directory", "Спробувати"],
      ["Реєстр і фільтри", "Пошук за 178 записами: статус верифікації, сектор, географія, український досвід і роль в ISRM.", "/directory", "До реєстру"],
      ["Досьє та індекс довіри", "Індекс 0–100 поєднує впевненість співставлення, статус ідентичності, верифікацію та доказову базу.", "/experts/$code", "Приклад досьє"],
      ["Кабінет координатора", "Єдина черга запитів контактів та пропозицій ЛПР з операційними показниками мережі.", "/coordinator", "Кабінет"],
    ],
    arch: [["Клієнт", "Граф, реєстр і досьє для ЛПР та аналітиків."], ["Шар доступу", "Серверна перевірка прав і знеособлення до передачі даних."], ["Дані", "178 CRM-записів: ідентичність, верифікація та експертиза."], ["Координація", "Захищена черга запитів, згода та сповіщення."]],
    road: [["Q4 2026", "MVP", "Граф, реєстр, досьє, рівні доступу та кабінет координатора."], ["Q1 2027", "Довіра", "Персональні входи, аудит розкриттів, згода експерта і 2FA."], ["Q2 2027", "Інтелект", "AI-збагачення профілів, рекомендації та змістовий пошук."], ["Q3 2027", "Масштаб", "Мультихаби, події, кейс-бібліотека та API для партнерів."]],
    packages: [
      { name: "Pilot", price: "€12 000", monthly: "€450", time: "4–6 тижнів", desc: "Перевірка цінності на реальних даних і закритій групі користувачів.", features: ["Імпорт та очищення до 250 профілів", "Граф, реєстр, досьє і фільтри", "Дві мови та мобільний формат", "Базові рівні доступу й навчання"] },
      { name: "Operational", price: "€29 000", monthly: "€900", time: "8–12 тижнів", desc: "Робоча система для щоденного використання координатором і керівництвом.", features: ["Захищена база та персональні входи", "Ролі, журнал аудиту і керування згодами", "Сповіщення та спільна черга запитів", "Аналітика, резервування і супровід запуску"], recommended: true },
      { name: "Network Scale", price: "€58 000", monthly: "€1 800", time: "14–20 тижнів", desc: "Масштабування на міжнародні хаби та інтеграції з робочими процесами.", features: ["Усе з Operational та мультихаби", "AI-пошук і рекомендації експертів", "Автоматизоване збагачення профілів", "API, SSO, розширена безпека та SLA"] },
    ],
    topics: ["Функціональність", "Приватність і доступ", "Дорожня карта", "Партнерство", "Цінова пропозиція"],
  },
  en: {
    eyebrow: "Product proposal · for decision-makers", title: "A digital trust infrastructure for the ISRM Ukraine expert network",
    step: "Step", next: "Next", architecture: "Architecture", roadmap: "Roadmap", pricing: "Pricing proposal",
    pricingIntro: "Three investment paths, from value validation to a secure international platform. Prices exclude VAT and third-party services.",
    recommended: "Recommended", oneTime: "one-time", monthly: "support / month", choose: "Discuss this package",
    rationale: "What drives the price", rationaleText: "The estimate is based on data risk, graph complexity, access levels, CRM import quality and assurance scope—not screen count. Each package includes the previous one.",
    assumptions: "Pricing assumptions", assumptionsText: "Up to 250 profiles at launch, one CRM dataset, two interface languages and one client organisation. A short technical discovery session will confirm the final offer.",
    feedback: "Proposal to the coordinator", feedbackText: "Your feedback goes directly to the ISRM Ukraine coordinator inbox.", thanks: "Thank you. Your proposal was sent to the coordinator.", name: "Name, role", message: "Your proposal", send: "Send",
    steps: [
      ["Network map", "A force-directed graph of 178 nodes across three cluster layers. Tap to focus, zoom freely and rebuild the graph with live filters.", "/", "Open map"],
      ["Privacy protocol", "Data is anonymous by default. A referrer code reveals names and organisations; the coordinator password reveals direct contacts.", "/directory", "Try it"],
      ["Directory and filters", "Search 178 records by verification, sector, geography, Ukraine experience and ISRM role.", "/directory", "Open directory"],
      ["Dossier and trust index", "The 0–100 index combines match confidence, identity status, verification and supporting evidence.", "/experts/$code", "View dossier"],
      ["Coordinator workspace", "One queue for contact requests and decision-maker feedback, with operational network metrics.", "/coordinator", "Open workspace"],
    ],
    arch: [["Client", "Graph, directory and dossiers for decision-makers and analysts."], ["Access layer", "Server-side permission checks and anonymisation before delivery."], ["Data", "178 CRM records covering identity, verification and expertise."], ["Coordination", "Secure request queue, consent management and notifications."]],
    road: [["Q4 2026", "MVP", "Graph, directory, dossiers, access levels and coordinator workspace."], ["Q1 2027", "Trust", "Personal accounts, disclosure audit, expert consent and 2FA."], ["Q2 2027", "Intelligence", "AI profile enrichment, recommendations and semantic search."], ["Q3 2027", "Scale", "Multiple hubs, events, case library and partner API."]],
    packages: [
      { name: "Pilot", price: "€12,000", monthly: "€450", time: "4–6 weeks", desc: "Validate value with real data and a closed user group.", features: ["Import and clean up to 250 profiles", "Graph, directory, dossiers and filters", "Two languages and mobile experience", "Basic access levels and training"] },
      { name: "Operational", price: "€29,000", monthly: "€900", time: "8–12 weeks", desc: "A production platform for daily coordinator and leadership use.", features: ["Secure database and personal accounts", "Roles, audit log and consent management", "Notifications and shared request queue", "Analytics, backups and launch support"], recommended: true },
      { name: "Network Scale", price: "€58,000", monthly: "€1,800", time: "14–20 weeks", desc: "Scale to international hubs and operational integrations.", features: ["Everything in Operational plus multiple hubs", "AI expert search and recommendations", "Automated profile enrichment", "API, SSO, enhanced security and SLA"] },
    ],
    topics: ["Functionality", "Privacy and access", "Roadmap", "Partnership", "Pricing proposal"],
  },
} as const;

function Proposal() {
  const { locale } = useI18n();
  const c = COPY[locale];
  const [step, setStep] = useState(0);
  const [from, setFrom] = useState("");
  const [topic, setTopic] = useState<string>(c.topics[0]);
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const s = c.steps[step] ?? c.steps[0];
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-5 sm:py-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{c.eyebrow}</p>
      <h1 className="mt-2 max-w-4xl font-display text-4xl leading-tight sm:text-5xl">{c.title}</h1>

      <section className="mt-10 grid gap-5 md:grid-cols-[240px_1fr]">
        <ol className="flex gap-1 overflow-x-auto pb-1 md:block md:space-y-1">
          {c.steps.map((x, i) => <li key={x[0]} className="shrink-0 md:w-full"><Button variant={i === step ? "secondary" : "ghost"} onClick={() => setStep(i)} className="w-full justify-start"><span className="font-mono text-xs text-primary">0{i + 1}</span>{x[0]}</Button></li>)}
        </ol>
        <div className="rounded border border-border bg-card p-5 sm:p-8">
          <p className="font-mono text-xs text-primary">{c.step} 0{step + 1} / 0{c.steps.length}</p><h2 className="mt-2 font-display text-3xl">{s[0]}</h2><p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{s[1]}</p>
          <div className="mt-7 flex flex-wrap gap-3"><Button asChild><Link to={s[2]} params={{ code: "EXP-004" }}>{s[3]}</Link></Button>{step < c.steps.length - 1 && <Button variant="outline" onClick={() => setStep(step + 1)}>{c.next} →</Button>}</div>
        </div>
      </section>

      <section className="mt-14"><h2 className="font-display text-3xl">{c.architecture}</h2><div className="mt-5 grid gap-px overflow-hidden rounded border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">{c.arch.map(([title, desc], i) => <div key={title} className="bg-card p-5"><p className="font-mono text-[10px] text-primary">L{i + 1}</p><p className="mt-1 font-medium">{title}</p><p className="mt-2 text-sm text-muted-foreground">{desc}</p></div>)}</div></section>
      <section className="mt-14"><h2 className="font-display text-3xl">{c.roadmap}</h2><ol className="mt-5 divide-y divide-border border-y border-border">{c.road.map(([q, title, desc], i) => <li key={q} className="grid gap-1 py-5 sm:grid-cols-[110px_140px_1fr]"><span className={`font-mono text-sm ${i === 0 ? "text-primary" : "text-muted-foreground"}`}>{q}</span><span className="font-medium">{title}</span><span className="text-muted-foreground">{desc}</span></li>)}</ol></section>

      <section className="mt-16 scroll-mt-20" id="pricing">
        <div className="max-w-3xl"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Investment case</p><h2 className="mt-2 font-display text-4xl">{c.pricing}</h2><p className="mt-3 text-muted-foreground">{c.pricingIntro}</p></div>
        <div className="mt-7 grid gap-4 lg:grid-cols-3">{c.packages.map((p) => { const recommended = "recommended" in p && p.recommended; return <article key={p.name} className={`relative flex flex-col rounded border p-5 ${recommended ? "border-primary bg-primary/5" : "border-border bg-card"}`}>{recommended && <span className="absolute right-4 top-4 rounded-sm bg-primary px-2 py-1 font-mono text-[9px] uppercase text-primary-foreground">{c.recommended}</span>}<p className="font-mono text-xs uppercase text-muted-foreground">{p.time}</p><h3 className="mt-3 font-display text-3xl">{p.name}</h3><p className="mt-3 text-sm text-muted-foreground">{p.desc}</p><p className="mt-6 font-display text-4xl text-primary">{p.price}</p><p className="text-xs text-muted-foreground">{c.oneTime} · {p.monthly} {c.monthly}</p><ul className="mt-6 flex-1 space-y-3">{p.features.map((feature) => <li key={feature} className="flex gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />{feature}</li>)}</ul><Button asChild variant={recommended ? "default" : "outline"} className="mt-7 w-full"><a href="#feedback">{c.choose}</a></Button></article>; })}</div>
        <div className="mt-5 grid gap-px overflow-hidden rounded border border-border bg-border md:grid-cols-2"><div className="bg-card p-5"><ShieldCheck className="h-5 w-5 text-primary" /><h3 className="mt-3 font-medium">{c.rationale}</h3><p className="mt-2 text-sm text-muted-foreground">{c.rationaleText}</p></div><div className="bg-card p-5"><Server className="h-5 w-5 text-chart-2" /><h3 className="mt-3 font-medium">{c.assumptions}</h3><p className="mt-2 text-sm text-muted-foreground">{c.assumptionsText}</p></div></div>
      </section>

      <section id="feedback" className="mt-16 grid gap-8 md:grid-cols-2"><div><Sparkles className="h-5 w-5 text-primary" /><h2 className="mt-3 font-display text-3xl">{c.feedback}</h2><p className="mt-2 text-muted-foreground">{c.feedbackText}</p></div>{sent ? <p className="rounded border border-success/40 bg-success/10 p-5 text-success">{c.thanks}</p> : <form onSubmit={(e) => { e.preventDefault(); pushInbox({ kind: "feedback", from, topic, message: msg }); setSent(true); }} className="space-y-3"><input required value={from} onChange={(e) => setFrom(e.target.value)} placeholder={c.name} className="w-full rounded border border-input bg-background px-3 py-2 text-sm" /><select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full rounded border border-input bg-background px-3 py-2 text-sm">{c.topics.map((item) => <option key={item}>{item}</option>)}</select><textarea required value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} placeholder={c.message} className="w-full rounded border border-input bg-background px-3 py-2 text-sm" /><Button>{c.send}</Button></form>}</section>
    </main>
  );
}
