import type { ClientLocale } from "@/lib/client-catalog";
import { SCOPE_DELIVERY_STATUS, scopeDeliveryNotes } from "@/lib/scope-delivery-notes";

export function ScopeDeliveryNotes({ locale }: { locale: ClientLocale }) {
  return (
    <details className="scope-delivery-notes">
      <summary>
        {locale === "uk"
          ? "Обсяг, зміни та умови виконання"
          : "Scope, changes & delivery arrangements"}
      </summary>
      <p>{SCOPE_DELIVERY_STATUS[locale]}</p>
      <dl>
        {scopeDeliveryNotes(locale).map((note) => (
          <div key={note.id}>
            <dt>{note.title}</dt>
            <dd>{note.body}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
