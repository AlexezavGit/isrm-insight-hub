import { CLIENT_SERVICES, type ClientLocale, type ServiceId } from "@/lib/client-catalog";
import type { ClientDraft } from "@/lib/client-draft";
import { packageServiceIds, packageIsCustom, type PackageId } from "@/lib/tailored-scope";
export function PackageServiceEditor({
  id,
  draft,
  locale,
  disabled,
  onChange,
}: {
  id: PackageId;
  draft: ClientDraft;
  locale: ClientLocale;
  disabled: boolean;
  onChange: (id: ServiceId, checked: boolean) => void;
}) {
  const ids = packageServiceIds(draft, id),
    uk = locale === "uk";
  return (
    <div className="package-service-editor" data-package-editor={id}>
      <p>
        {uk
          ? "Оберіть склад цього пакета. Зміна складу потребує переоцінки, а не автоматичної знижки."
          : "Choose the contents of this package. A change requires a revised estimate, not an automatic discount."}
      </p>
      {CLIENT_SERVICES.map((s) => (
        <label key={s.id}>
          <input
            type="checkbox"
            checked={ids.includes(s.id)}
            disabled={disabled}
            onChange={(e) => onChange(s.id, e.target.checked)}
          />
          <span>{s.title[locale]}</span>
        </label>
      ))}
      {packageIsCustom(draft, id) && (
        <small role="status">
          {uk
            ? "Індивідуальний склад · ціна й результати до погодження"
            : "Tailored composition · price and outcomes to agree"}
        </small>
      )}
      <small>
        {uk
          ? "Вимоги до доступу, джерел і людської перевірки залишаються предметом погодження навіть за вилучення відповідного сервісу."
          : "Access, provenance and human review requirements still need agreement if the corresponding capability is removed."}
      </small>
    </div>
  );
}
