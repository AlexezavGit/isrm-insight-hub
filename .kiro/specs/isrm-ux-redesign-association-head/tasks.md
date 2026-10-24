# Implementation Plan: ISRM UX Redesign — Association Head Flow

## Overview

Реалізація поетапно перебудовує три маршрути (`/proposal`, `/`, `/scope`) в єдиний наративний потік для голови асоціації. Кожен крок будується на попередньому і завершується повним з'єднанням усіх частин.

## Tasks

- [x] 1. Створити компонент `EntryFrame`
  - [x] 1.1 Реалізувати `src/components/EntryFrame.tsx` з IntersectionObserver-анімацією
    - Визначити `EntryFrameProps` з полем `locale: "en" | "uk"`
    - Додати `useRef` для DOM-вузла та `useState(false)` для стану `visible`
    - Реалізувати `useEffect` з `IntersectionObserver` (threshold: 0.4); при недоступності API одразу встановити `visible = true`
    - Застосувати CSS-класи `opacity-0 translate-y-4` початково; при `visible === true` — `opacity-100 translate-y-0 transition-[opacity,transform] duration-[600ms]`
    - Розмістити `<h2>`, `<p>` та `<Button asChild><Link to="/" search={{ panel: "search" }}>`
    - Обробити двомовний текст через `locale`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [ ]* 1.2 Написати property-тест для EntryFrame — IntersectionObserver fallback
    - **Property з design: IntersectionObserver fallback → visible state**
    - Симулювати відсутність `IntersectionObserver` і перевірити, що компонент рендериться з класом `is-visible` / `opacity-100`
    - **Validates: Requirements 1.4**

- [x] 2. Реалізувати компонент `ContactDialog`
  - [x] 2.1 Створити `src/components/ContactDialog.tsx` з Radix UI Dialog і Zod-валідацією
    - Визначити `ContactDialogProps`: `open`, `onOpenChange`, `locale`
    - Стейт: `name`, `email`, `message`, `errors`, `submitted`
    - Zod-схема: `name` — `z.string().min(1)`, `email` — `z.string().email()`, `message` — `z.string().min(1)`
    - `handleSubmit`: валідувати через Zod, встановити `errors` при невдачі; при успіху — `setSubmitted(true)`, `setTimeout(() => onOpenChange(false), 1800)`
    - Показувати `<p role="status">` успіху або форму з inline `<p role="alert" aria-live="polite">` помилками
    - Підтримка двомовного тексту через `locale`
    - _Requirements: 5.3, 5.4, 5.5, 5.6, 5.7_
  - [ ]* 2.2 Написати property-тест: ContactDialog блокує сабміт при порожньому полі (Property 7)
    - **Property 7: Contact Dialog blocks submission when any required field is empty**
    - Генерувати довільні комбінації полів, де хоча б одне порожнє або whitespace-only
    - Перевирити, що `submitted === false` і є inline-помилки
    - **Validates: Requirements 5.7**
  - [ ]* 2.3 Написати property-тест: ContactDialog показує success при валідних даних (Property 8)
    - **Property 8: Contact Dialog success on valid input**
    - Генерувати валідне ім'я, email і повідомлення; перевірити перехід у `submitted === true` без мережевих запитів
    - **Validates: Requirements 5.6**

- [x] 3. Checkpoint — базові компоненти
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Оновити `NetworkPage` (`src/routes/index.tsx`) — search-параметри, висота панелей, Bottom Nav
  - [x] 4.1 Додати типобезпечні search-параметри через `validateSearch` у `createFileRoute("/")`
    - Оголосити `IndexSearch`: `panel?: "search"`, `stage?: "configuration"`, `preset?: string`
    - Реалізувати `validateSearch` так, щоб повертати `undefined` для невідомих значень `panel` і `stage`
    - _Requirements: 2.1, 2.5, 8.1_
  - [x] 4.2 Ініціалізувати стан `searchOpen` / `cabinetOpen` з параметрів маршруту
    - `searchOpen = useState(() => stage !== "configuration")` — тобто true за замовчуванням та при `panel=search`, false тільки при `stage=configuration`
    - `cabinetOpen = useState(() => stage === "configuration")`
    - Гарантувати інваріант: `searchOpen && cabinetOpen` ніколи не `true` одночасно у всіх сеттерах
    - _Requirements: 2.2, 2.3, 2.4, 2.5_
  - [ ]* 4.3 Написати property-тест: взаємна виключність overlay (Property 1)
    - **Property 1: Mutual exclusion overlay state**
    - Генерувати довільні послідовності відкриття/закриття панелей і перевіряти, що `searchOpen && cabinetOpen` завжди `false`
    - **Validates: Requirements 2.4**
  - [ ]* 4.4 Написати property-тести: ініціалізація стану з URL-параметрів (Properties 2, 3, 4)
    - **Property 2:** `panel="search"` → `searchOpen=true, cabinetOpen=false`
    - **Property 3:** `stage="configuration"` → `cabinetOpen=true, searchOpen=false`
    - **Property 4:** будь-яке невідоме значення `panel` → `searchOpen=true`
    - **Validates: Requirements 2.2, 2.3, 2.5**
  - [x] 4.5 Додати `max-h-[50svh] overflow-y-auto` до Search Panel `<aside>` для мобільних viewport
    - Зберегти `sm:max-h-[calc(100svh-11rem)]` для десктопу
    - _Requirements: 3.1, 3.3, 3.4_
  - [x] 4.6 Оновити `MemberCabinet.tsx` — додати `max-h-[50svh] overflow-y-auto` на мобільних
    - Переконатися, що Bottom Nav залишається видимою при відкритому Cabinet
    - _Requirements: 3.2, 3.3, 3.5_
  - [x] 4.7 Оновити Bottom Nav: замінити третю кнопку на `<Link to="/scope">` з `useMatch` для активного стану
    - Додати `FileText` іконку та двомовний підпис `"3 · Пропозиція й ціна"` / `"3 · Proposal & price"`
    - `variant={onScope ? "secondary" : "default"}`
    - Зберегти кнопки «1 · Пошук» і «2 · Конфігурація» без змін
    - _Requirements: 6.1, 6.2, 6.3_
  - [ ]* 4.8 Написати property-тест: Bottom Nav активний варіант на `/scope` (Property 9)
    - **Property 9: Bottom Nav approval button active variant on `/scope`**
    - При поточному маршруті `/scope` третя кнопка Bottom Nav SHALL мати `variant="secondary"`
    - **Validates: Requirements 6.2**

- [x] 5. Checkpoint — NetworkPage
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Оновити `proposal.tsx` — Value-Unlock списки, видалення секцій, Entry Frame
  - [x] 6.1 Додати Value-Unlock список під картку «Search» у розділі 01
    - Використати `<section className="partner-value-unlocks">` з `<span>`, `<h3>`, `<ul>` (5 `<li>`), `<p className="partner-value-unlocks-caption">`
    - Вміст: фільтрація за сектором, анонімний огляд мережі, виявлення прогалин, зіставлення кандидатів, шорт-лист без контакту
    - Підтримати двомовний текст через існуючу функцію `text(en, ua)`
    - _Requirements: 4.1, 4.4, 4.5_
  - [x] 6.2 Додати Value-Unlock список під картку «Service functions» у розділі 01
    - Аналогічна структура `partner-value-unlocks`; вміст: формування груп, облік задач, цільові сповіщення, атрибуція внесків, координація груп
    - _Requirements: 4.2, 4.4, 4.6_
  - [ ]* 6.3 Написати property-тести: кількість елементів і CSS-клас Value-Unlock списків (Properties 5, 6)
    - **Property 5:** для обох локалей (`"en"`, `"uk"`) кожен Value-Unlock список Search і Service functions містить від 4 до 6 `<li>`
    - **Property 6:** кожна `<section>` Value-Unlock (Search, Service functions, Dependencies) має клас `partner-value-unlocks`
    - **Validates: Requirements 4.1, 4.2, 4.4**
  - [x] 6.4 Видалити секцію 03 (`aria-labelledby="client-packages-heading"`) із `proposal.tsx`
    - Видалити відповідні невикористовувані імпорти: `CLIENT_OFFER_PACKAGES`, `CLIENT_PRICING_STATUS`, `CLIENT_OFFER_NOTE`, `CLIENT_CONSULTING_OPTION`, `ShieldCheck`, `ExternalLink`
    - _Requirements: 7.1, 7.3_
  - [x] 6.5 Видалити секцію capacity (`aria-labelledby="client-capacity-heading"`) і cohort2 із `proposal.tsx`
    - _Requirements: 7.2, 7.3_
  - [x] 6.6 Замінити всі CTA-якорі на `#client-packages-heading` і `#client-capacity-heading` на `<Link to="/scope">`
    - _Requirements: 5.10, 7.4_
  - [x] 6.7 Додати `<EntryFrame locale={locale} />` як фінальний елемент перед `<footer>` у `proposal.tsx`
    - Зберегти `<footer>` без pricing CTA
    - _Requirements: 1.1, 7.4_

- [x] 7. Checkpoint — proposal.tsx
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Створити нову сторінку `/scope` (`src/routes/scope.tsx`)
  - [x] 8.1 Створити `src/routes/scope.tsx` з `createFileRoute("/scope")` і head-метаданими
    - `title`: `"ISRM — Scope & Budget"`; `description`: опис призначення сторінки
    - Імпортувати `CLIENT_OFFER_PACKAGES`, `CLIENT_PRICING_STATUS`, `CLIENT_OFFER_NOTE`, `CLIENT_CONSULTING_OPTION` з `@/lib/client-proposal-data`
    - Додати `useI18n`, `useState` для `contactOpen`
    - _Requirements: 5.1, 5.2, 8.2, 8.4_
  - [x] 8.2 Перенести JSX секції 03 (пакети) з `proposal.tsx` до `ScopePage`
    - Замінити кнопку «Confirm scope» на `<Button onClick={() => setContactOpen(true)}>` із двомовним підписом «Discuss scope & budget»
    - _Requirements: 5.2, 5.3, 5.4_
  - [x] 8.3 Перенести JSX секції capacity до `ScopePage`
    - Оновити `aria-labelledby` на `scope-capacity-heading`
    - _Requirements: 5.2_
  - [x] 8.4 Додати кнопку «← До пропозиції» (`<Link to="/proposal">`) у header `ScopePage`
    - _Requirements: 5.9_
  - [x] 8.5 Додати перемикач мови EN / UA у `ScopePage`, аналогічний `proposal.tsx`
    - _Requirements: 5.8_
  - [x] 8.6 Підключити `<ContactDialog>` до `ScopePage` через `contactOpen` / `setContactOpen`
    - _Requirements: 5.3, 5.4_

- [x] 9. Оновити `__root.tsx` — виключити `/scope` із завантаження graph-даних
  - [x] 9.1 Змінити умову `loadExpertNetwork` у `__root.tsx` на `pathname !== "/proposal" && pathname !== "/scope"`
    - _Requirements: 8.1, 8.4_

- [x] 10. Фінальне з'єднання та перевірка маршрутів
  - [x] 10.1 Переконатися, що `routeTree.gen.ts` містить `/scope` після збірки або зареєструвати маршрут вручну якщо автогенерація не спрацює
    - _Requirements: 8.1, 8.4_

- [x] 11. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Завдання, позначені `*`, є опціональними property-based тестами з fast-check; їх можна пропустити для швидшого MVP
- Кожне завдання посилається на конкретні вимоги для трасованості
- Усі взаємодії залишаються browser-local mock-станом
- Property tests використовують `fast-check` (сумісний з Vite + TypeScript)
- Порядок: нові компоненти → NetworkPage → proposal.tsx → scope.tsx → root

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["1.2", "2.2", "2.3", "4.1"] },
    { "id": 2, "tasks": ["4.2", "4.5", "4.6", "4.7"] },
    { "id": 3, "tasks": ["4.3", "4.4", "4.8", "6.1", "6.2"] },
    { "id": 4, "tasks": ["6.3", "6.4", "6.5", "6.6"] },
    { "id": 5, "tasks": ["6.7", "8.1"] },
    { "id": 6, "tasks": ["8.2", "8.3", "8.4", "8.5"] },
    { "id": 7, "tasks": ["8.6", "9.1"] },
    { "id": 8, "tasks": ["10.1"] }
  ]
}
```
