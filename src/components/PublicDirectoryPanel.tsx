import { useEffect, useRef } from "react";
import { ISRM_PUBLIC_DIRECTORY, publicRole } from "@/lib/public-directory";
export function PublicDirectoryPanel({
  id,
  uk,
  onClose,
}: {
  id: string;
  uk: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const person = publicRole(id);
  const units = person
    ? person.appearances.map((a) => a.unit)
    : ISRM_PUBLIC_DIRECTORY.entries.filter((u) => `public-unit:${u.id}` === id);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      className="public-directory-dialog"
      aria-labelledby="public-directory-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) ref.current.close();
      }}
    >
      <button
        type="button"
        className="public-directory-close"
        onClick={() => ref.current?.close()}
        aria-label={uk ? "Закрити" : "Close"}
      >
        ×
      </button>
      <h2 id="public-directory-title">{person?.name ?? units[0]?.label}</h2>
      {person?.portraitAvailable && (
        <img
          className="public-directory-portrait"
          src={person.portraitUrl}
          alt={person.name}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      )}
      <p>
        {uk
          ? "Публічний запис із сайту ISRM · окремо від початкової дослідницької вибірки"
          : "Public record from ISRM’s website · separate from the original research sample"}
      </p>
      {units.map((unit) => (
        <section key={unit.id}>
          <h3>{unit.label}</h3>
          {(person ? unit.people.filter((p) => p.name === person.name) : unit.people).map((p) => (
            <p key={p.name}>
              <strong>{p.name}</strong>
              <br />
              {p.role}
              {"roleDetail" in p && (
                <>
                  <br />
                  <small>
                    {uk
                      ? "Назву посади на сторінці не зазначено"
                      : "Role title not specified on page"}
                  </small>
                </>
              )}
            </p>
          ))}
          <a href={unit.sourceUrl} target="_blank" rel="noreferrer">
            {uk ? "Відкрити офіційне джерело" : "Open official source"}
          </a>
        </section>
      ))}
      <p>
        <small>
          {uk ? "Перевірено" : "Checked"}: {ISRM_PUBLIC_DIRECTORY.checkedAt.slice(0, 10)} ·{" "}
          {uk
            ? "Посада не означає членства в центральному правлінні, особистої рекомендації або дозволу передавати контакти."
            : "A published role does not establish central board membership, endorsement or permission to disclose contacts."}
        </small>
      </p>
    </dialog>
  );
}
