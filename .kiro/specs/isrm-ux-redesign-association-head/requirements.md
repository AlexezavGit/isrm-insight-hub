# Requirements Document

## Introduction

Редизайн UX-потоку платформи ISRM Insight Hub під сприйняття голови асоціації (~70 років). Мета — перебудувати маршрути `/proposal`, `/` (граф) та нову сторінку `/scope` в єдиний послідовний наративний потік: бріф → живий граф → конфігурація сервісів → погодження обсягу й ціни. Зміни охоплюють: картки Search і Functions з рівноцінними value-unlock пунктами; Entry Frame з IntersectionObserver-анімацією наприкінці `/proposal`; автоматичне відкриття панелі пошуку при переході на `/?panel=search`; фіксацію висоти оверлеїв панелей; перенесення цінових секцій (03 + capacity) на окрему сторінку `/scope` з Contact-діалогом замість «Confirm scope».

Технічний стек: React 19, TypeScript, TanStack Router, Tailwind CSS v4, Radix UI.

Усі взаємодії залишаються browser-local mock-станом до явного підключення спільного автентифікованого сховища.

## Glossary

- **Proposal Page** (`/proposal`): Наративна сторінка-бріф без цінових секцій; завершується Entry Frame.
- **Entry Frame**: Анімований CTA-блок наприкінці `/proposal`, що з'являється при прокручуванні через IntersectionObserver і веде на `/?panel=search`.
- **Network Page** (`/`): Домашня поверхня з повноекранним графом; підтримує параметри `panel` і `stage` у рядку запиту.
- **Search Panel**: Оверлейна панель фільтрів і метрик мережі, що відкривається при `panel=search` або натисканні кнопки «1 · Пошук» у нижній навігації.
- **Cabinet Overlay**: Оверлейна панель конфігурації сервісів (MemberCabinet), що відкривається при `stage=configuration`.
- **Scope Page** (`/scope`): Нова окрема сторінка для погодження обсягу та цінових пакетів; містить Contact Dialog замість «Confirm scope».
- **Contact Dialog**: Radix UI Dialog на сторінці `/scope`, що дозволяє надіслати запит на обговорення бюджету й обсягу; залишається browser-local mock.
- **Value-Unlock List**: Маркований список із 4–6 пунктів, що показує конкретні можливості, які розкриваються через відповідний модуль (Search, Functions або Dependencies).
- **Bottom Nav**: Фіксована нижня навігаційна панель на `/`; містить кнопки «Пошук», «Конфігурація» і посилання на «Пропозиція та бюджет».
- **Panel Height Constraint**: Обмеження висоти оверлейних панелей до `max-h-[50svh]`, щоб не перекривати Bottom Nav.
- **IntersectionObserver**: Браузерний API, що відстежує видимість елементів у viewport для тригерування анімацій.
- **TanStack Router**: Маршрутизатор, що підтримує типобезпечні search-параметри (URLSearchParams) у `createFileRoute`.

## Requirements

### Requirement 1: Entry Frame на `/proposal`

**User Story:** Як голова асоціації, я хочу побачити чіткий заклик до дії наприкінці сторінки пропозиції, щоб знати, куди перейти після ознайомлення з брифом.

#### Acceptance Criteria

1. THE Proposal Page SHALL відображати Entry Frame як окремий блок після основного контенту сторінки `/proposal`.
2. WHEN Entry Frame потрапляє у viewport на 40% або більше, THE Entry Frame SHALL запустити CSS-анімацію появи (fade-in + translateY) тривалістю 600 мс.
3. THE Entry Frame SHALL містити заголовок, підзаголовок і єдину кнопку CTA, що веде на `/?panel=search`.
4. WHEN IntersectionObserver недоступний у браузері, THE Entry Frame SHALL відображатися без анімації у видимому стані.
5. THE Entry Frame SHALL відображатися коректно на мобільних (320 px – 767 px) та десктопних (768 px і більше) viewport.

### Requirement 2: Автовідкриття Search Panel за параметром `panel=search`

**User Story:** Як голова асоціації, я хочу, щоб при переході за посиланням `/?panel=search` панель пошуку відкривалася автоматично, щоб не шукати, де натиснути.

#### Acceptance Criteria

1. THE Network Page SHALL читати параметр `panel` із рядка запиту під час монтування компонента.
2. WHEN параметр `panel` дорівнює `"search"`, THE Network Page SHALL встановити стан `searchOpen = true` і `cabinetOpen = false` до першого рендеру.
3. WHEN параметр `stage` дорівнює `"configuration"`, THE Network Page SHALL встановити стан `cabinetOpen = true` і `searchOpen = false` до першого рендеру.
4. THE Network Page SHALL підтримувати одночасно лише один відкритий оверлей (Search Panel або Cabinet Overlay, але не обидва).
5. IF параметр `panel` містить значення, відмінне від `"search"`, THEN THE Network Page SHALL ігнорувати цей параметр і рендерити стандартний стан (`searchOpen = true`).
6. WHEN параметри `panel=search` і `stage=configuration` присутні у URL одночасно, THE Network Page SHALL надати пріоритет `stage=configuration` і встановити `cabinetOpen = true`, `searchOpen = false`.

### Requirement 3: Обмеження висоти оверлейних панелей

**User Story:** Як голова асоціації, я хочу, щоб панелі не перекривали нижню навігацію, щоб я міг у будь-який момент переключитися між розділами.

#### Acceptance Criteria

1. THE Search Panel SHALL мати CSS-клас `max-h-[50svh]` на мобільних viewport (ширина менше 640 px).
2. THE Cabinet Overlay SHALL мати CSS-клас `max-h-[50svh]` на мобільних viewport (ширина менше 640 px).
3. WHILE панель відкрита, THE Bottom Nav SHALL залишатися повністю видимою і не перекриватися жодним оверлеєм.
4. THE Search Panel SHALL підтримувати вертикальне прокручування всередині себе через `overflow-y-auto` для доступу до прихованого контенту.
5. THE Cabinet Overlay SHALL підтримувати вертикальне прокручування всередині себе через `overflow-y-auto` для доступу до прихованого контенту.

### Requirement 4: Value-Unlock списки для карток Search і Functions

**User Story:** Як голова асоціації, я хочу розуміти конкретні можливості кожного модуля (Пошук і Сервісні функції), щоб оцінити їхню практичну цінність так само, як і модуля Dependencies.

#### Acceptance Criteria

1. THE Proposal Page SHALL відображати Value-Unlock List із 4–6 пунктів під карткою «Search» у розділі 01 клієнтського preview.
2. THE Proposal Page SHALL відображати Value-Unlock List із 4–6 пунктів під карткою «Service functions» у розділі 01 клієнтського preview.
3. THE Proposal Page SHALL відображати Value-Unlock List для картки «Dependencies» без змін у порівнянні з поточною реалізацією.
4. WHEN відображається Value-Unlock List, THE Proposal Page SHALL використовувати той самий CSS-клас `partner-value-unlocks` і структуру `<section>` / `<ul>` / `<li>`, що й у картці Dependencies.
5. THE Value-Unlock List картки «Search» SHALL містити пункти, що описують можливості, яких немає без функції пошуку (наприклад: фільтрація за сектором і досвідом, анонімний попередній огляд мережі, виявлення прогалин в експертизі).
6. THE Value-Unlock List картки «Service functions» SHALL містити пункти, що описують можливості, яких немає без конфігурації сервісів (наприклад: формування проєктних груп, облік виконаних задач, сповіщення для груп експертів).

### Requirement 5: Нова сторінка `/scope` з ціновими секціями

**User Story:** Як голова асоціації, я хочу переглядати цінові пакети на окремій сторінці після ознайомлення з пропозицією, щоб мати зосереджений простір для прийняття рішення.

#### Acceptance Criteria

1. THE Scope Page SHALL існувати за маршрутом `/scope` у файлі `src/routes/scope.tsx` відповідно до конвенцій TanStack Router.
2. THE Scope Page SHALL відображати цінові пакети з секції 03 (`CLIENT_OFFER_PACKAGES`) і секцію capacity з поточного `/proposal`.
3. THE Scope Page SHALL відображати Contact Dialog замість кнопки «Confirm scope».
4. WHEN користувач натискає «Confirm scope» або аналогічну CTA, THE Scope Page SHALL відкривати Contact Dialog через Radix UI Dialog.
5. THE Contact Dialog SHALL містити поля: ім'я, email і текстове повідомлення; усі три поля є обов'язковими для заповнення.
6. WHEN форма Contact Dialog є повністю заповненою і користувач підтверджує відправлення, THE Contact Dialog SHALL зберегти дані (ім'я, email, повідомлення, мітку часу) у `localStorage` браузера за ключем `isrm-contact-submissions`, відобразити повідомлення про успіх і закритися через 1800 мс; жодні дані не передаються на віддалений сервер.
7. IF будь-яке з обов'язкових полів Contact Dialog порожнє, THEN THE Contact Dialog SHALL показувати inline-повідомлення про помилку та блокувати відправлення.
8. THE Scope Page SHALL підтримувати перемикач мови (EN / UA), аналогічний `/proposal`.
9. THE Scope Page SHALL відображати кнопку навігації «Назад до пропозиції» (`← /proposal`) у верхній частині сторінки.
10. THE Proposal Page SHALL замінити посилання на секцію 03 і capacity на посилання `<Link to="/scope">` замість якоря на тій самій сторінці.

### Requirement 6: Оновлення нижньої навігації на `/` для посилання на `/scope`

**User Story:** Як голова асоціації, я хочу мати прямий доступ до сторінки бюджету з головного екрана, щоб не гортати всю пропозицію повторно.

#### Acceptance Criteria

1. THE Bottom Nav SHALL містити кнопку/посилання «3 · Пропозиція й ціна», що веде на `/scope`.
2. THE Bottom Nav SHALL бути спільним компонентом, що рендериться на сторінках `/` і `/scope`. WHEN користувач перебуває на сторінці `/scope`, третя кнопка («3 · Пропозиція й ціна») SHALL відображатися з `variant="secondary"` для індикації активного маршруту. WHEN користувач перебуває на сторінці `/`, активний variant SHALL відображати стан поточного відкритого оверлею (search або configuration).
3. THE Bottom Nav SHALL продовжувати відображати кнопки «1 · Пошук» і «2 · Конфігурація» у незмінному вигляді.

### Requirement 7: Видалення цінових секцій із `/proposal`

**User Story:** Як голова асоціації, я хочу, щоб сторінка `/proposal` містила лише бріф і структуру проєкту без цінових пакетів, щоб не відволікатися від суті при першому знайомстві.

#### Acceptance Criteria

1. THE Proposal Page SHALL не відображати секцію 03 («Four sequential packages») після перенесення на `/scope`.
2. THE Proposal Page SHALL не відображати секцію capacity («How capacity grows») після перенесення на `/scope`.
3. THE Proposal Page SHALL зберігати секції 01 (клієнтський preview) і 02 (optional expert-community cycle) у незмінному вигляді.
4. WHEN користувач прокручує сторінку `/proposal` до кінця, THE Proposal Page SHALL відображати Entry Frame (Requirement 1) як фінальний елемент замість цінових секцій.

### Requirement 8: Збереження існуючих маршрутів і SEO-метаданих

**User Story:** Як розробник і власник продукту, я хочу, щоб усі наявні URL залишалися дієвими після рефакторингу, щоб уникнути битих посилань.

#### Acceptance Criteria

1. THE Router SHALL продовжувати обробляти маршрути `/`, `/proposal`, `/partner`, `/partner-finance`, `/directory`, `/coordinator`, `/experts/$code` без змін.
2. THE Scope Page SHALL мати власні head-метадані: title `"ISRM — Scope & Budget"` і description, що описує призначення сторінки.
3. THE Proposal Page SHALL зберігати поточні head-метадані `title` і `description` без змін.
4. IF браузер звертається до маршруту `/scope`, THEN THE Router SHALL рендерити `ScopePage` без перенаправлення.
