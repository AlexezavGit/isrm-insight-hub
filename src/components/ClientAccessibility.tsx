import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
export function ClientAccessibility() {
  const { locale } = useI18n();
  const [large, setLarge] = useState(false);
  const [contrast, setContrast] = useState(false);
  useEffect(() => {
    try {
      setLarge(localStorage.getItem("isrm-large-text") === "1");
      setContrast(localStorage.getItem("isrm-high-contrast") === "1");
    } catch {
      /* Controls still work for this visit. */
    }
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("client-large-text", large);
    document.documentElement.classList.toggle("client-high-contrast", contrast);
    try {
      localStorage.setItem("isrm-large-text", large ? "1" : "0");
      localStorage.setItem("isrm-high-contrast", contrast ? "1" : "0");
    } catch {
      /* Nonessential preference storage. */
    }
  }, [large, contrast]);
  return (
    <div
      className="client-accessibility"
      role="group"
      aria-label={locale === "uk" ? "Доступність" : "Accessibility"}
    >
      <button type="button" aria-pressed={large} onClick={() => setLarge(!large)}>
        {locale === "uk" ? "Аа · Більший текст" : "Aa · Larger text"}
      </button>
      <button type="button" aria-pressed={contrast} onClick={() => setContrast(!contrast)}>
        {locale === "uk" ? "Контраст" : "Contrast"}
      </button>
    </div>
  );
}
