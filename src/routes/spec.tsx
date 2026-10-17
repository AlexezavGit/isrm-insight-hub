import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IsrmLogo } from "@/components/IsrmLogo";

export const Route = createFileRoute("/spec")({
  head: () => ({
    meta: [
      { title: "ISRM Insight Hub — Специфікація проєкту" },
      {
        name: "description",
        content: "Повний опис проєкту та пропозиції для погодження ISRM Insight Hub.",
      },
      { property: "og:title", content: "ISRM Insight Hub — Специфікація проєкту" },
    ],
  }),
  component: SpecPage,
});

function SpecPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 pb-20">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-panel/90 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="gap-1.5">
            <Link to="/proposal">
              <ArrowLeft className="h-4 w-4" />
              <span>Назад до пропозиції</span>
            </Link>
          </Button>
          <span className="h-4 w-px bg-border" />
          <IsrmLogo className="h-7 w-auto" />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => window.print()}
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Друк / Зберегти PDF</span>
          </Button>
          <Button asChild size="sm" className="gap-1.5 text-xs">
            <a href="/ISRM_Project_Description.md" download="ISRM_Project_Description.md">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Завантажити .MD</span>
            </a>
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <article className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          {/* Header Banner */}
          <div className="border-b border-border pb-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-primary/10 text-primary text-xs font-mono uppercase tracking-wider mb-3">
              <FileText className="h-3.5 w-3.5" />
              Офіційний документ
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-foreground m-0">
              ISRM Insight Hub: опис проєкту та пропозиції для погодження
            </h1>
            <div className="mt-4 p-4 rounded-lg border border-border bg-card/60 text-sm space-y-1.5 text-muted-foreground">
              <p className="m-0">
                <strong className="text-foreground">Статус документа:</strong> проєкт для перегляду партнерами та замовником; не є договором, погодженим технічним завданням або підтвердженою пропозицією постачальника.
              </p>
              <p className="m-0">
                <strong className="text-foreground">Мова:</strong> українська. Інтерактивний артефакт також має перемикач української/англійської.
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground font-display border-b border-border/50 pb-2">
              1. Що пропонується
            </h2>
            <p className="leading-relaxed">
              <strong>ISRM Insight Hub</strong> — цифровий інструмент для пошуку експертизи й формування груп під різні проєктні цілі: підготовку матеріалів і статей, накопичення знань та виконання проєктів для клієнтів. MVP має дати самостійну користь до будь-якого експертного пілота: знаходити фахівців за доказами й напрямами, створювати проєкти з цілями, формувати команди та фіксувати призначені задачі й результати. Це обмежений робочий процес, а не повна система керування проєктами з чатом, календарем, білінгом і складною автоматизацією. Поточний застосунок є демонстрацією шляху користувача та пропонованої функціональності; демо-пошук і граф не є готовим захищеним production-сервісом.
            </p>
            <p className="leading-relaxed">
              Пропозиція не передбачає, що одна функція автоматично потрібна кожному замовнику. Замовник переглядає пропозицію й погоджує функції, межі даних, пілот, результати та бюджет. Партнерський маршрут окремо призначений для внутрішнього перегляду ролей, scope, оцінок і відкритих рішень; він не є тим самим клієнтським маршрутом і наразі не має автентифікації.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground font-display border-b border-border/50 pb-2">
              2. Навігація та артефакт
            </h2>
            <p className="leading-relaxed">
              Поточна версія розділяє три поверхні: головна сторінка <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/</code> містить пошук і граф мережі; кнопка конфігурації відкриває каталог сервісів, а кнопка залежностей — граф сервісних функцій із передумовами; <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/proposal</code> — коротка клієнтська пропозиція з MVP і окремим, необов’язковим експертним пілотом після рішення за результатами MVP; <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/partner</code> — внутрішній партнерський перегляд із чотирма внутрішніми scope та моделлю оцінювання.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground font-display border-b border-border/50 pb-2">
              3. Пошук експертів
            </h2>
            <p className="leading-relaxed">
              Пошук фільтрує наявну CRM-когорту за секторами, записаною в CRM географічною ознакою та наявністю публічного джерела; користувач може перейти від графа до картки чи сформованої групи. Ці ознаки описують дані, а не доводять фактичне місце роботи, професійну придатність, зацікавленість, згоду на участь або дозвіл на контакт.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground font-display border-b border-border/50 pb-2">
              4. Конфігуратор сервісів
            </h2>
            <p className="leading-relaxed">
              Граф функцій показує залежності та етапи, а не фактичну готовність кожного модуля. Центральна зона відведена спільним консультаційним сесіям; далі розміщуються функції MVP, функції, потрібні для погодженого пілота, та можливі наступні функції.
            </p>
            <div className="p-4 rounded-lg border-l-4 border-primary bg-primary/5 space-y-2">
              <strong className="text-foreground block">Концепція Trust & Influence Index (TII):</strong>
              <p className="m-0 text-sm leading-relaxed">
                Запропонована концепція індексу для експертів: структурований спосіб збирати й оцінювати атрибутовані докази професійної надійності та впливу фахівця у визначеній сфері, а не рейтинг популярності чи автоматичний вердикт про компетентність. TII розробляється спільно із замовником до обчислення будь-якого балу.
              </p>
            </div>
          </section>

          {/* Section 5: Table of 4 scopes */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground font-display border-b border-border/50 pb-2">
              5. Чотири внутрішні напрями робіт
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse border border-border">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="p-3 border-r border-border font-semibold text-foreground">Scope</th>
                    <th className="p-3 border-r border-border font-semibold text-foreground">Призначення та результат</th>
                    <th className="p-3 font-semibold text-foreground">Межа</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3 border-r border-border font-medium text-foreground whitespace-nowrap">1. Консалтинг і стратегія</td>
                    <td className="p-3 border-r border-border">Додаткова робота з пріоритетами розвитку, прогалинами експертизи, рішеннями борду й організаційною моделлю поза погодженими результатами MVP.</td>
                    <td className="p-3">Спільне проєктування TII не виставляється вдруге. Додаткові сесії мають окремий scope і ціну.</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-r border-border font-medium text-foreground whitespace-nowrap">2. MVP застосунку</td>
                    <td className="p-3 border-r border-border">Корисний самостійний набір функцій: знаходити експертизу, формувати проєктні групи, накопичення знань і клієнтські проєкти.</td>
                    <td className="p-3">Планувальна межа: легкий проєктний робочий процес, не повноцінна PM-система.</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-r border-border font-medium text-foreground whitespace-nowrap">3. Опційний експертний пілот</td>
                    <td className="p-3 border-r border-border">Спільно розробити процедуру TII, провести робочі групи, підготувати звіт і статті, оцінити готовність до конференції.</td>
                    <td className="p-3">До діапазону входять дві статті й один висновок про конференцію.</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-r border-border font-medium text-foreground whitespace-nowrap">4. Віддалене продовження</td>
                    <td className="p-3 border-r border-border">Публічний продукт, членські сервіси, кілька спільнот, оплата та підтримка.</td>
                    <td className="p-3">Не є продуктом цієї пропозиції; розглядається лише на наступних етапах.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground font-display border-b border-border/50 pb-2">
              6. Запропонований пілот і результат для замовника
            </h2>
            <p className="leading-relaxed">
              MVP має дати практичну користь незалежно від запуску пілота. Після його демонстрації замовник і партнери вирішують, чи є підстава проводити окремий експертний цикл. Якщо так, до старту погоджуються порядок денний, склад робочих груп, правила TII, дозволені канали й повідомлення, метрики, період спостереження, обробка згоди та межа якісного аналізу.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
