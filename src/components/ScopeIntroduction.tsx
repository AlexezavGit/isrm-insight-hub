import type { ClientLocale } from "@/lib/client-catalog";
import { BOARD_RECIPIENT } from "@/lib/board-brief";
import { PROJECT_POSITIONING } from "@/lib/project-positioning";

export function ScopeIntroduction({ locale }: { locale: ClientLocale }) {
  const uk = locale === "uk";
  const items = [
    {
      title: uk ? "Для кого?" : "Who is it for?",
      text: uk
        ? `${BOARD_RECIPIENT}, правління та члени ISRM — відповідно до погоджених ролей і доступів.`
        : `${BOARD_RECIPIENT}, the Board and ISRM members, with agreed roles and access.`,
    },
    {
      title: uk ? "Що пропонується?" : "What is proposed?",
      text: uk
        ? "Цифровий застосунок для пошуку експертизи, досліджень і перевірки інформації. Прототип використовує передану вибірку зі 178 записів; операційне підключення AI research та наявних систем належить погодити."
        : "A digital application for finding expertise, research and information review. The prototype uses the supplied 178-record sample; operational AI research and connections to existing systems remain to be agreed.",
    },
    { title: uk ? "Для чого?" : "Why is it useful?", text: PROJECT_POSITIONING.purpose[locale] },
    {
      title: uk ? "Як це працює?" : "How does it work?",
      text: PROJECT_POSITIONING.explanation[locale],
    },
  ];
  return (
    <section
      className="scope-introduction-grid"
      aria-label={uk ? "Пропозиція у чотирьох питаннях" : "The proposal in four questions"}
    >
      {items.map((item) => (
        <div key={item.title}>
          <h2>{item.title}</h2>
          <p>{item.text}</p>
        </div>
      ))}
    </section>
  );
}
