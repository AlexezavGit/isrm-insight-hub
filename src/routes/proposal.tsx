import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { pushInbox } from "@/lib/access";

export const Route = createFileRoute("/proposal")({
  head: () => ({
    meta: [
      { title: "Артефакт-пропозиція — ISRM Ukraine" },
      { name: "description", content: "Покроковий гід по функціях платформи, архітектура та дорожня карта для ЛПР." },
      { property: "og:title", content: "Артефакт-пропозиція — ISRM Ukraine" },
      { property: "og:description", content: "Функції, архітектура та дорожня карта платформи ISRM Ukraine." },
    ],
  }),
  component: Proposal,
});

const STEPS = [
  { t: "Карта мережі", d: "Force-directed граф 178 вузлів із трьома шарами кластерів: сектори, теми українського досвіду та хаби спільноти. Клік фокусує оточення експерта, колесо — масштаб, фільтри перебудовують граф наживо.", link: "/", cta: "Відкрити карту" },
  { t: "Протокол приватності", d: "За замовчуванням — знеособлення: псевдоніми EXP-xxx, сектор, рівень верифікації. Код верифікованого рекомендодавця відкриває імена й організації; пароль координатора — прямі контакти. Рішення про розкриття приймає сервер — дані не потрапляють у браузер без права доступу.", link: "/directory", cta: "Спробувати" },
  { t: "Реєстр і фільтри", d: "Пошук за 178 записами: 45 Verified проти черги ресерчу, сектор, географія (визначена за міжнародним кодом), теми українського досвіду, роль в ISRM.", link: "/directory", cta: "До реєстру" },
  { t: "Досьє та індекс довіри", d: "Індекс 0–100 складається з впевненості співставлення, статусу ідентичності, верифікації та доказової бази. Кнопка безпечного запиту передає контакт лише через координатора.", link: "/experts/$code", cta: "Приклад досьє" },
  { t: "Кабінет координатора", d: "Єдина черга запитів контактів та пропозицій ЛПР, операційні показники ідентифікації та пріоритетів.", link: "/coordinator", cta: "Кабінет" },
] as const;

const ROADMAP = [
  ["Q4 2026", "MVP", "Граф, реєстр, досьє, рівні доступу, кабінет координатора (поточна демо-версія)."],
  ["Q1 2027", "Довіра", "Персональні входи, журнал аудиту розкриттів, згода експерта на кожен контакт, двофакторна автентифікація."],
  ["Q2 2027", "Інтелект", "AI-збагачення профілів із публічних джерел, рекомендації «хто може допомогти», пошук за змістом."],
  ["Q3 2027", "Масштаб", "Мультихаби (Київ, Лондон, Брюссель), події та кейс-бібліотека, API для партнерів."],
];

const ARCH = [
  ["Клієнт", "Інтерфейс для ЛПР і аналітиків: граф на canvas, реєстр, досьє."],
  ["Шар доступу", "Серверна перевірка коду рекомендодавця / пароля; знеособлення до відправки даних."],
  ["Дані", "178 записів CRM: ідентичність, верифікація, експертиза, український досвід."],
  ["Координація", "Черга запитів і відгуків; у продакшн — захищена база та сповіщення."],
];

function Proposal() {
  const [step, setStep] = useState(0);
  const [from, setFrom] = useState("");
  const [topic, setTopic] = useState("Функціональність");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const s = STEPS[step]!;
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Артефакт-пропозиція · для ЛПР</p>
      <h1 className="mt-2 max-w-3xl font-display text-4xl leading-tight md:text-5xl">Цифрова інфраструктура довіри для експертної мережі ISRM Ukraine</h1>

      <section className="mt-12 grid gap-6 md:grid-cols-[260px_1fr]">
        <ol className="space-y-1">
          {STEPS.map((x, i) => (
            <li key={x.t}>
              <button onClick={() => setStep(i)} className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm ${i === step ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                <span className={`font-mono text-xs ${i === step ? "text-primary" : ""}`}>0{i + 1}</span>{x.t}
              </button>
            </li>
          ))}
        </ol>
        <div className="rounded border border-border bg-card p-8">
          <p className="font-mono text-xs text-primary">Крок 0{step + 1} / 0{STEPS.length}</p>
          <h2 className="mt-2 font-display text-3xl">{s.t}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{s.d}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={s.link} params={{ code: "EXP-004" }} className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">{s.cta}</Link>
            {step < STEPS.length - 1 && <button onClick={() => setStep(step + 1)} className="rounded border border-border px-4 py-2 text-sm hover:border-primary">Далі →</button>}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl">Архітектура</h2>
        <div className="mt-6 grid gap-px overflow-hidden rounded border border-border bg-border md:grid-cols-4">
          {ARCH.map(([t, d], i) => (
            <div key={t} className="bg-card p-5">
              <p className="font-mono text-[10px] text-primary">L{i + 1}</p>
              <p className="mt-1 font-medium">{t}</p>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl">Дорожня карта</h2>
        <ol className="mt-6 divide-y divide-border border-y border-border">
          {ROADMAP.map(([q, t, d], i) => (
            <li key={q} className="grid gap-2 py-5 md:grid-cols-[120px_160px_1fr]">
              <span className={`font-mono text-sm ${i === 0 ? "text-primary" : "text-muted-foreground"}`}>{q}</span>
              <span className="font-medium">{t}</span>
              <span className="text-muted-foreground">{d}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl">Пропозиція координатору</h2>
          <p className="mt-2 text-muted-foreground">Ваш відгук потрапить напряму у кабінет координатора ISRM Ukraine.</p>
        </div>
        {sent ? (
          <p className="rounded border border-success/40 bg-success/10 p-5 text-success">Дякуємо. Пропозицію передано координатору.</p>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); pushInbox({ kind: "feedback", from, topic, message: msg }); setSent(true); }} className="space-y-3">
            <input required value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Ім'я, посада" className="w-full rounded border border-input bg-background px-3 py-2 text-sm" />
            <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full rounded border border-input bg-background px-3 py-2 text-sm">
              {["Функціональність", "Приватність і доступ", "Дорожня карта", "Партнерство"].map((t) => <option key={t}>{t}</option>)}
            </select>
            <textarea required value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} placeholder="Ваша пропозиція" className="w-full rounded border border-input bg-background px-3 py-2 text-sm" />
            <button className="rounded bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">Надіслати</button>
          </form>
        )}
      </section>
    </main>
  );
}
