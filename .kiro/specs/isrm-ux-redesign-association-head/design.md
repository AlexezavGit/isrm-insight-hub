# Design Document

## Overview

Редизайн UX-потоку ISRM Insight Hub для голови асоціації (~70 років). Архітектура перебудовує три маршрути — `/proposal`, `/` (NetworkPage) і новий `/scope` — в єдиний послідовний наратив: бріф → живий граф → конфігурація сервісів → погодження обсягу й ціни. Стек: React 19, TypeScript, TanStack Router, Tailwind CSS v4, Radix UI.

## Architecture

### Загальний потік навігації

```
/proposal (бріф, секції 01 + 02)
    └── Entry Frame (CTA → /?panel=search)
            │
            ▼
/?panel=search  (граф + автовідкрита Search Panel)
    └── Bottom Nav: «1 · Пошук» | «2 · Конфігурація» | «3 · Пропозиція й ціна → /scope»
            │                              │
            ▼                              ▼
/?stage=configuration              /scope (цінові пакети + Contact Dialog)
   (Cabinet Overlay відкрито)
```

### Структура файлів

```
src/
  routes/
    __root.tsx          — без змін (окрім оновлення loadExpertNetwork logic для /scope)
    index.tsx           — NetworkPage: query-param handling, panel height, nav link
    proposal.tsx        — видалити секції 03 + capacity; додати Value-Unlock lists; Entry Frame
    scope.tsx           — НОВИЙ: /scope з ціновими секціями + Contact Dialog
  components/
    EntryFrame.tsx      — НОВИЙ: анімований CTA-блок із IntersectionObserver
    ContactDialog.tsx   — НОВИЙ: Radix UI Dialog з формою (name, email, message)
```

## Components and Interfaces

### 1. `EntryFrame` (`src/components/EntryFrame.tsx`)

Анімований блок у кінці `/proposal`, що веде користувача далі — у живий граф із відкритою Search Panel.

**Props:**
```typescript
interface EntryFrameProps {
  locale: "en" | "uk";
}
```

**Поведінка:**
- Монтується як звичайний DOM-вузол; анімація *вимкнена* за замовчуванням (`opacity-0 translate-y-4`).
- `useEffect` реєструє `IntersectionObserver` з порогом `0.4`. Коли елемент перетинає 40% viewport, додається CSS-клас `is-visible` → `opacity-100 translate-y-0 transition-[opacity,transform] duration-[600ms]`.
- Якщо `typeof IntersectionObserver === 'undefined'` (SSR або старий браузер), елемент одразу отримує клас `is-visible`.
- Містить: `<h2>` (заголовок), `<p>` (підзаголовок), `<Link to="/" search={{ panel: "search" }}>` CTA.

**Структурна схема:**
```tsx
<section ref={frameRef} className="entry-frame" aria-label="...">
  <h2>{heading}</h2>
  <p>{subheading}</p>
  <Button asChild>
    <Link to="/" search={{ panel: "search" }}>
      {ctaLabel} <ArrowRight />
    </Link>
  </Button>
</section>
```

---

### 2. `ContactDialog` (`src/components/ContactDialog.tsx`)

Radix UI Dialog із формою обговорення бюджету. Повністю browser-local mock — жодні дані не відправляються.

**Props:**
```typescript
interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: "en" | "uk";
}
```

**Стан:**
```typescript
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [message, setMessage] = useState("");
const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
const [submitted, setSubmitted] = useState(false);
```

**Валідація (при сабміті):**
- Кожне поле — required; порожнє значення або whitespace-only → inline error.
- Email перевіряється через `zod` (`z.string().email()`).
- При успіху: `setSubmitted(true)` → показуємо success-повідомлення → `setTimeout(() => onOpenChange(false), 1800)`.

**Структура форми:**
```tsx
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent>
    <DialogHeader><DialogTitle>...</DialogTitle></DialogHeader>
    {submitted ? (
      <p role="status">/* Success message */</p>
    ) : (
      <form onSubmit={handleSubmit} noValidate>
        <Label htmlFor="contact-name">...</Label>
        <input id="contact-name" ... />
        {errors.name && <p role="alert" aria-live="polite">...</p>}

        <Label htmlFor="contact-email">...</Label>
        <input id="contact-email" type="email" ... />
        {errors.email && <p role="alert" aria-live="polite">...</p>}

        <Label htmlFor="contact-message">...</Label>
        <textarea id="contact-message" ... />
        {errors.message && <p role="alert" aria-live="polite">...</p>}

        <Button type="submit">...</Button>
      </form>
    )}
  </DialogContent>
</Dialog>
```

---

### 3. Зміни в `NetworkPage` (`src/routes/index.tsx`)

#### 3a. Типобезпечні search-параметри (TanStack Router)

```typescript
export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    panel: search.panel === "search" ? "search" as const : undefined,
    stage: search.stage === "configuration" ? "configuration" as const : undefined,
    preset: typeof search.preset === "string" ? search.preset : undefined,
  }),
  component: NetworkPage,
});
```

#### 3b. Ініціалізація стану з параметрів

```typescript
function NetworkPage() {
  const { panel, stage } = Route.useSearch();

  const [searchOpen, setSearchOpen] = useState(() => {
    if (stage === "configuration") return false;
    // panel==="search" OR unknown/absent panel: default open
    return true;
  });
  const [cabinetOpen, setCabinetOpen] = useState(() =>
    stage === "configuration"
  );
  // ... existing useEffect for window.location fallback removed once validateSearch works
```

> Інваріант: `searchOpen && cabinetOpen` ніколи не може бути `true` одночасно.

#### 3c. Обмеження висоти панелей (Panel Height Constraint)

До Search Panel `<aside>`:
```
className="... max-h-[50svh] overflow-y-auto sm:max-h-[calc(100svh-11rem)] ..."
```

До `MemberCabinet` (Cabinet Overlay): компонент приймає `className` або внутрішньо застосовує `max-h-[50svh] overflow-y-auto` на мобільних. Оновити `MemberCabinet.tsx` аналогічно.

#### 3d. Bottom Nav — третя кнопка → `/scope`

```tsx
<Button asChild className="h-14 min-w-24 max-w-32 ...">
  <Link to="/scope">
    <FileText className="h-5 w-5" />
    <span className="...">{copy.approval}</span>
  </Link>
</Button>
```

Щоб підсвічувати активний стан при перебуванні на `/scope`, використовуємо `useMatch`:

```typescript
const onScope = useMatch({ from: "/scope", shouldThrow: false });
// ...
<Button
  asChild
  variant={onScope ? "secondary" : "default"}
  className="h-14 min-w-24 max-w-32 ..."
>
  <Link to="/scope">...</Link>
</Button>
```

---

### 4. Зміни в `ClientProposal` (`src/routes/proposal.tsx`)

#### 4a. Видалення секцій 03 і capacity

Видалити весь JSX у межах:
- `<section aria-labelledby="client-packages-heading">` (секція 03 — пакети цін)
- `<section aria-labelledby="client-capacity-heading" className="client-capacity-section">` (capacity loop)
- `<section ... className="client-cohort2-section">` (cohort 2)

Видалити невикористовувані імпорти: `CLIENT_OFFER_PACKAGES`, `CLIENT_PRICING_STATUS`, `CLIENT_OFFER_NOTE`, `CLIENT_CONSULTING_OPTION`, `ShieldCheck`, `ExternalLink`.

#### 4b. Додавання Value-Unlock списків

Картка **Search** (після `<p className="partner-muted">...`):
```tsx
<section className="partner-value-unlocks" aria-label={text("Value revealed through search", "Цінність, розкрита через пошук")}>
  <span className="partner-value-unlocks-eyebrow">
    {text("Now accessible · search", "Тепер доступно · пошук")}
  </span>
  <h3>{text("What becomes accessible only through search", "Що стає доступним лише через пошук")}</h3>
  <ul>
    <li>{text("Filter expertise by sector, region and experience level without exposing identities", "Фільтрація експертизи за сектором, регіоном і рівнем досвіду без розкриття ідентичностей")}</li>
    <li>{text("Anonymous preview of the network before any engagement decision", "Анонімний попередній огляд мережі до прийняття будь-якого рішення про залучення")}</li>
    <li>{text("Identify expertise gaps across sectors and themes before forming a project group", "Виявлення прогалин в експертизі за секторами й темами до формування проєктної групи")}</li>
    <li>{text("Match candidate experts to specific project requirements through graph traversal", "Зіставлення кандидатів-експертів із конкретними вимогами проєкту через traversal графа")}</li>
    <li>{text("Shortlist multiple experts simultaneously without contacting them prematurely", "Одночасне складання шорт-листа з кількох експертів без передчасного контакту")}</li>
  </ul>
  <p className="partner-value-unlocks-caption">{text("Planning references, not guaranteed outcomes.", "Планувальні орієнтири, не гарантовані результати.")}</p>
</section>
```

Картка **Service functions** (після `<p className="partner-muted">...`):
```tsx
<section className="partner-value-unlocks" aria-label={text("Value revealed through service functions", "Цінність, розкрита через сервісні функції")}>
  <span className="partner-value-unlocks-eyebrow">
    {text("Now accessible · service functions", "Тепер доступно · сервісні функції")}
  </span>
  <h3>{text("What becomes accessible only through service configuration", "Що стає доступним лише через конфігурацію сервісів")}</h3>
  <ul>
    <li>{text("Form project groups from found experts and assign structured goals", "Формування проєктних груп із знайдених експертів і призначення структурованих цілей")}</li>
    <li>{text("Track accepted tasks and outputs per expert and per project group", "Облік прийнятих задач і результатів у розрізі кожного експерта й проєктної групи")}</li>
    <li>{text("Send targeted notifications to expert groups without mass broadcast", "Надсилання цільових сповіщень для груп експертів без масового розсилання")}</li>
    <li>{text("Record attributable evidence of contributions for each working group member", "Фіксація атрибутованих доказів внесків для кожного члена робочої групи")}</li>
    <li>{text("Coordinate agenda-based working groups with defined inputs and expected outputs", "Координація тематичних робочих груп із визначеними вхідними даними та очікуваними результатами")}</li>
  </ul>
  <p className="partner-value-unlocks-caption">{text("Planning references, not guaranteed outcomes.", "Планувальні орієнтири, не гарантовані результати.")}</p>
</section>
```

#### 4c. Entry Frame як фінальний елемент

Замінити `<footer>` або додати перед ним компонент `<EntryFrame locale={locale} />`:

```tsx
// До закриваючого </section> / </div> partner-shell
<EntryFrame locale={locale} />

<footer className="partner-footer">
  {/* зберегти лише дрібні footer-посилання без pricing CTA */}
</footer>
```

#### 4d. Оновлення посилань CTA

Всі кнопки/посилання, що раніше вели до якірних секцій 03 або capacity (`#client-packages-heading`, `#client-capacity-heading`), замінити на `<Link to="/scope">`.

---

### 5. Нова сторінка `/scope` (`src/routes/scope.tsx`)

```typescript
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CLIENT_OFFER_PACKAGES,
  CLIENT_PRICING_STATUS,
  CLIENT_OFFER_NOTE,
  CLIENT_CONSULTING_OPTION,
} from "@/lib/client-proposal-data";
import { MARKET_BENCHMARKS } from "@/lib/proposal-data";
import { useI18n } from "@/lib/i18n";
import { ContactDialog } from "@/components/ContactDialog";

export const Route = createFileRoute("/scope")({
  head: () => ({
    meta: [
      { title: "ISRM — Scope & Budget" },
      {
        name: "description",
        content: "Погодження обсягу й цінових пакетів ISRM Insight Hub. Оберіть пакет і надішліть запит на обговорення бюджету.",
      },
      { property: "og:title", content: "ISRM — Scope & Budget" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ScopePage,
});
```

**Структура ScopePage:**

```tsx
function ScopePage() {
  const { locale, setLocale } = useI18n();
  const [contactOpen, setContactOpen] = useState(false);
  const uk = locale === "uk";
  const text = (en: string, ua: string) => (uk ? ua : en);

  return (
    <main className="partner-review client-proposal client-offer">
      <div className="partner-shell">
        <header className="partner-header">
          {/* Back link */}
          <Button asChild variant="ghost" className="partner-back">
            <Link to="/proposal">
              <ArrowLeft aria-hidden="true" />
              {text("← Back to proposal", "← До пропозиції")}
            </Link>
          </Button>
          {/* Locale switch — identical to proposal.tsx */}
          ...
          <h1>...</h1>
        </header>

        {/* Section 03 — packages (перенесено з proposal.tsx) */}
        <section aria-labelledby="scope-packages-heading">
          {/* Весь JSX секції 03, включаючи CLIENT_OFFER_PACKAGES grid */}
          ...
          {/* CTA замість Confirm scope */}
          <Button onClick={() => setContactOpen(true)}>
            {text("Discuss scope & budget", "Обговорити scope та бюджет")}
          </Button>
        </section>

        {/* Capacity section (перенесено з proposal.tsx) */}
        <section aria-labelledby="scope-capacity-heading" className="client-capacity-section">
          {/* Весь JSX секції capacity */}
          ...
        </section>

        {/* Contact Dialog */}
        <ContactDialog
          open={contactOpen}
          onOpenChange={setContactOpen}
          locale={locale}
        />
      </div>
    </main>
  );
}
```

---

### 6. Оновлення `__root.tsx`

```typescript
const loadExpertNetwork = pathname !== "/proposal" && pathname !== "/scope";
```

Це запобігає завантаженню graph-даних на сторінках без графа.

---

## Data Models

### TanStack Router search params (index.tsx)

```typescript
type IndexSearch = {
  panel?: "search";
  stage?: "configuration";
  preset?: string;
};
```

### ContactDialog form state

```typescript
type ContactFormState = {
  name: string;
  email: string;
  message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormState, string>>;
```

### EntryFrame animation state

```typescript
type EntryFrameState = {
  visible: boolean; // controlled by IntersectionObserver or fallback
};
```

---

### `EntryFrameProps`

| Prop | Type | Description |
|------|------|-------------|
| `locale` | `"en" \| "uk"` | Мова для відображення тексту |

### `ContactDialogProps`

| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | Стан відкритості Dialog |
| `onOpenChange` | `(open: boolean) => void` | Колбек зміни стану |
| `locale` | `"en" \| "uk"` | Мова для відображення тексту |

---

## Error Handling

### IntersectionObserver недоступний (Вимога 1.4)

```typescript
useEffect(() => {
  if (typeof IntersectionObserver === "undefined") {
    setVisible(true);
    return;
  }
  const observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) setVisible(true); },
    { threshold: 0.4 }
  );
  if (frameRef.current) observer.observe(frameRef.current);
  return () => observer.disconnect();
}, []);
```

### Contact Dialog валідація

Zod-схема для перевірки форми до сабміту:

```typescript
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Ім'я обов'язкове"),
  email: z.string().email("Невірний формат email").min(1, "Email обов'язковий"),
  message: z.string().min(1, "Повідомлення обов'язкове"),
});
```

При неуспішній валідації: `errors` стейт встановлюється з повідомленнями, кнопка Submit залишається активною, але `handleSubmit` повертає раніше.

### URL параметри (Вимога 2.5)

Невідомий `panel` параметр ігнорується завдяки `validateSearch`, який повертає `undefined` для будь-якого значення, що не є `"search"`. Стандартний стан: `searchOpen = true`.

---

## Testing Strategy

**Dual approach:** unit tests для конкретних сценаріїв і крайових випадків + property-based tests для універсальних інваріантів.

**Unit tests:**
- Smoke tests: `/scope` маршрут рендериться без перенаправлення; усі наявні маршрути залишаються активними.
- Example tests: Entry Frame містить заголовок, підзаголовок і CTA-посилання на `/?panel=search`; Contact Dialog містить три обов'язкові поля; Bottom Nav містить посилання на `/scope`; секції 03 і capacity відсутні на `/proposal`; секції 01 і 02 присутні на `/proposal` без змін; перемикач мови на `/scope` працює; кнопка «Назад до пропозиції» присутня на `/scope`; head-метадані `/scope` містять `title="ISRM — Scope & Budget"`.
- Edge case: при `typeof IntersectionObserver === 'undefined'` Entry Frame відображається у видимому стані без анімації.

**Property-based tests (мінімум 100 ітерацій):**
- Mutual exclusion overlay state (Property 1)
- Ініціалізація стану з URL-параметрів (Properties 2, 3, 4)
- Value-Unlock list item count (Property 5)
- CSS-клас `partner-value-unlocks` для всіх карток (Property 6)
- Contact Dialog validation blocking (Property 7)
- Contact Dialog success on valid input (Property 8)
- Bottom Nav active variant (Property 9)

Рекомендований інструмент: `fast-check` (вже сумісний з Vite + TypeScript проєктом).

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Mutual exclusion overlay state

*For any* sequence of user interactions (opening search, opening cabinet, clicking close, navigating with query params), the Network Page state SHALL never have both `searchOpen` and `cabinetOpen` equal to `true` simultaneously.

**Validates: Requirements 2.4**

---

### Property 2: `panel=search` ⇒ search open, cabinet closed

*For any* URL rendered on the Network Page where the `panel` query parameter equals `"search"`, the resulting state SHALL have `searchOpen = true` and `cabinetOpen = false`.

**Validates: Requirements 2.2**

---

### Property 3: `stage=configuration` ⇒ cabinet open, search closed

*For any* URL rendered on the Network Page where the `stage` query parameter equals `"configuration"`, the resulting state SHALL have `cabinetOpen = true` and `searchOpen = false`.

**Validates: Requirements 2.3**

---

### Property 4: Unknown `panel` value ⇒ default search open

*For any* `panel` query parameter value that is not `"search"` (including absent, empty, or arbitrary strings), the Network Page SHALL produce state `searchOpen = true`.

**Validates: Requirements 2.5**

---

### Property 5: Value-Unlock list item count

*For any* rendered locale (`"en"` or `"uk"`), the Value-Unlock List of the «Search» card and the «Service functions» card SHALL each contain between 4 and 6 `<li>` elements.

**Validates: Requirements 4.1, 4.2**

---

### Property 6: Consistent Value-Unlock structure across all cards

*For any* Value-Unlock section rendered on the Proposal Page (Search, Service functions, Dependencies cards), the containing `<section>` element SHALL have the CSS class `partner-value-unlocks`.

**Validates: Requirements 4.4**

---

### Property 7: Contact Dialog blocks submission when any required field is empty

*For any* combination of form field states where at least one of `name`, `email`, or `message` is empty or whitespace-only, attempting to submit the Contact Dialog SHALL not trigger the success state, and inline error messages SHALL be present.

**Validates: Requirements 5.7**

---

### Property 8: Contact Dialog success on valid input

*For any* non-empty, non-whitespace values of `name`, a valid email format in `email`, and a non-empty `message`, submitting the Contact Dialog SHALL transition to the success state and subsequently close the dialog; no network request is made.

**Validates: Requirements 5.6**

---

### Property 9: Bottom Nav approval button active variant on `/scope`

*For any* render of the Network Page (`/`) when the current application route is `/scope`, the approval (third) Bottom Nav button SHALL use `variant="secondary"`.

**Validates: Requirements 6.2**
