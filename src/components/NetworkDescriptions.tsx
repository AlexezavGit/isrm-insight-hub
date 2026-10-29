import { IntegrationStrip } from "./IntegrationStrip";
import { Link } from "@tanstack/react-router";
import {
  CLIENT_SERVICES,
  CLIENT_WORKFLOWS,
  CORE_SERVICE_IDS,
  type ClientLocale,
  type ServiceId,
} from "@/lib/client-catalog";
import { SERVICE_CONTEXT } from "@/lib/service-context";
export function NetworkServiceDependencies({
  id,
  locale,
  expanded = false,
}: {
  id: ServiceId;
  locale: ClientLocale;
  expanded?: boolean;
}) {
  const c = SERVICE_CONTEXT[id],
    uk = locale === "uk";
  return (
    <details className="network-service-dependencies" open={expanded || undefined}>
      <summary>
        {uk ? "Користувачі, результат і залежності" : "Users, outcome & dependencies"}
      </summary>
      <dl className="network-service-context">
        <dt>{uk ? "Хто користуватиметься" : "Who would use it"}</dt>
        <dd>{c.users[locale]}</dd>
        <dt>{uk ? "Очікуваний результат" : "Intended result"}</dt>
        <dd>{c.result[locale]}</dd>
        <dt>{uk ? "Від чого залежить" : "Dependencies"}</dt>
        <dd>{c.dependencies[locale]}</dd>
        <dt>{uk ? "Запропонована технологія" : "Proposed technology"}</dt>
        <dd>{c.technology[locale]}</dd>
      </dl>
      <IntegrationStrip locale={locale} />
    </details>
  );
}
export function NetworkWorkflowDescription({
  id,
  locale,
  onService,
  compact = false,
}: {
  id: string;
  locale: ClientLocale;
  onService: (id: ServiceId) => void;
  compact?: boolean;
}) {
  const uk = locale === "uk",
    w = CLIENT_WORKFLOWS.find((w) => w.id === id),
    ids = id === "core" ? CORE_SERVICE_IDS : (w?.serviceIds ?? []);
  return (
    <>
      {!compact && (
        <h2>{id === "core" ? (uk ? "Ядро довіри" : "Trust core") : w?.title[locale]}</h2>
      )}
      <p>
        {id === "core"
          ? uk
            ? "Ви зможете знаходити доречних колег, збирати робочі списки, досліджувати питання й зберігати перевірені висновки. Команди чаптерів і правління отримають спільну основу для професійної взаємодії."
            : "You would be able to find relevant colleagues, build working lists, investigate questions and retain reviewed findings. Chapter teams and the Board gain a shared foundation for professional interaction."
          : w?.detail[locale]}
      </p>
      {w && (
        <>
          <h3>{uk ? "Для членів, чаптерів і правління" : "For members, chapters and the Board"}</h3>
          <ul>
            {w.outputs[locale].map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </>
      )}
      {!compact && <h3>{uk ? "Задіяні сервіси та залежності" : "Services and dependencies"}</h3>}
      {!compact &&
        ids.map((id) => (
          <button className="network-service-tab" key={id} onClick={() => onService(id)}>
            {CLIENT_SERVICES.find((s) => s.id === id)?.title[locale]}
          </button>
        ))}
      <details>
        <summary>
          {uk ? "Запропонований технологічний підхід" : "Proposed technology approach"}
        </summary>
        <p>
          {uk
            ? "Спільний інтерфейс React / TypeScript, захищені записи й ролі доступу, журнал перевірки та погоджені API-конектори. Підключення OSINT, навчальних систем, CRM і каналів комунікації визначається окремо."
            : "A shared React / TypeScript interface, protected records and access roles, a review trail and agreed API connectors. OSINT, learning systems, CRM and communication channels are scoped individually."}
        </p>
      </details>
      <p className="network-panel-note">
        {uk
          ? "Колесо показує запропоновану функціональність. Поява профілю біля сервісу — ілюстрація можливого охоплення, не підтвердження участі."
          : "The wheel represents proposed capabilities. A profile appearing beside a service illustrates potential coverage, not confirmed participation."}
      </p>
      <Link
        className="network-folder-button"
        to="/scope"
        hash={id === "core" ? "scope-core-title" : "scope-workflow-" + id}
      >
        {uk ? "До погодження обсягу" : "Review in scope"}
      </Link>
    </>
  );
}
