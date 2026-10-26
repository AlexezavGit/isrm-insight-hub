import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "uk" | "en";

type Dictionary = Record<string, { uk: string; en: string }>;

const dictionary: Dictionary = {
  network: { uk: "Мережа", en: "Network" },
  directory: { uk: "Реєстр", en: "Directory" },
  proposal: { uk: "Пропозиція", en: "Proposal" },
  coordinator: { uk: "Координатор", en: "Coordinator" },
  anonymous: { uk: "Знеособлений режим", en: "Anonymous mode" },
  reveal: { uk: "Розкрити дані", en: "Reveal data" },
  exitAccess: { uk: "Вийти з доступу", en: "Exit access" },
  trustProtocol: { uk: "Протокол довіри", en: "Trust protocol" },
  revealFull: { uk: "Розкриття повних даних", en: "Full data access" },
  accessHelp: {
    uk: "Локальне демо приймає код рекомендодавця або налаштований на сервері код координатора. Це не є авторизацією для розгортання.",
    en: "The local demo accepts a referrer code or a coordinator code configured on the server. This is not authentication for a deployment.",
  },
  accessUnavailable: {
    uk: "Перевірка доступу недоступна. Для розгортання спершу налаштуйте автентифіковану авторизацію.",
    en: "Access validation is unavailable. Configure authenticated authorization before deployment.",
  },
  demo: { uk: "Демо", en: "Demo" },
  cancel: { uk: "Скасувати", en: "Cancel" },
  confirm: { uk: "Підтвердити", en: "Confirm" },
  checking: { uk: "Перевірка…", en: "Checking…" },
  invalidAccess: {
    uk: "Код або ім'я рекомендодавця не підтверджено.",
    en: "The referrer code or name could not be verified.",
  },
  verified: { uk: "Підтверджено", en: "Verified" },
  researchQueue: { uk: "Черга ресерчу", en: "Research queue" },
  loading: { uk: "Завантаження…", en: "Loading…" },
  search: { uk: "Пошук", en: "Search" },
  searchPlaceholder: { uk: "Код, експертиза, тег…", en: "Code, expertise, tag…" },
  verification: { uk: "Верифікація", en: "Verification" },
  all: { uk: "Усі", en: "All" },
  sector: { uk: "Сектор", en: "Sector" },
  geography: { uk: "Географія", en: "Geography" },
  ukraineExperience: { uk: "Український досвід", en: "Ukraine experience" },
  isrmRole: { uk: "Роль в ISRM", en: "ISRM role" },
  records: { uk: "записів", en: "records" },
  experts: { uk: "Експерти мережі", en: "Network experts" },
  status: { uk: "Статус", en: "Status" },
  trust: { uk: "Trust & Influence Index (TII)", en: "Trust & Influence Index (TII)" },
  tii: { uk: "Trust & Influence Index (TII)", en: "Trust & Influence Index (TII)" },
  tiiPending: {
    uk: "Методологію не валідовано · балів немає",
    en: "Method not validated · no score",
  },
  expert: { uk: "Експерт", en: "Expert" },
  code: { uk: "Код", en: "Code" },
  nodes: { uk: "Вузлів", en: "Nodes" },
  networkSlice: { uk: "Зріз мережі", en: "Network snapshot" },
  clusterLayers: { uk: "Шари кластерів", en: "Cluster layers" },
  sectors: { uk: "Сектори", en: "Sectors" },
  themes: { uk: "Теми українського досвіду", en: "Ukraine experience themes" },
  hubs: { uk: "Хаби / ролі спільноти", en: "Hubs / community roles" },
  verifiedExpert: { uk: "Верифікований експерт", en: "Verified expert" },
  graphHint: {
    uk: "Розмір вузлів однаковий; бал TII не розраховується. Дотик — фокус на оточенні.",
    en: "Node sizes are uniform; no TII score is calculated. Tap to focus on connections.",
  },
  aliases: { uk: "псевдоніми", en: "aliases" },
  fullData: { uk: "повні дані", en: "full data" },
  highestTrust: {
    uk: "Методологію не валідовано · балів немає",
    en: "Method not validated · no score",
  },
  openDossier: { uk: "Відкрити досьє", en: "Open dossier" },
  expertise: { uk: "Експертиза", en: "Expertise" },
  backDirectory: { uk: "Реєстр", en: "Directory" },
  dossier: { uk: "ДОСЬЄ", en: "DOSSIER" },
  hiddenIdentity: {
    uk: "Ідентичність приховано протоколом приватності",
    en: "Identity is hidden by the privacy protocol",
  },
  keyExpertise: { uk: "Ключова експертиза", en: "Core expertise" },
  caseTheme: { uk: "Тема кейсу", en: "Case theme" },
  international: { uk: "Міжнародна релевантність", en: "International relevance" },
  contribution: { uk: "Потенційний внесок в ISRM", en: "Potential contribution to ISRM" },
  competencies: { uk: "Компетенції", en: "Competencies" },
  trustIndex: { uk: "Trust & Influence Index (TII)", en: "Trust & Influence Index (TII)" },
  tiiDescription: {
    uk: "Запропонований індекс експертів. Джерела, період оцінювання, людська перевірка, виправлення й оскарження, врядування та валідація потребують спільного проєктування. Поточні дані не утворюють бал або рейтинг.",
    en: "A proposed expert index. Sources, assessment period, human review, correction and appeal, governance and validation need co-design. Current data do not constitute a score or ranking.",
  },
  matchConfidence: {
    uk: "Упевненість зіставлення · поле джерела, не бал TII",
    en: "Match confidence · source field, not a TII score",
  },
  contacts: { uk: "Контакти", en: "Contacts" },
  directContacts: {
    uk: "Прямі контакти доступні лише координатору.",
    en: "Direct contacts are available to the coordinator only.",
  },
  linkedin: { uk: "Профіль LinkedIn", en: "LinkedIn profile" },
  safeRequest: { uk: "Безпечний запит контакту", en: "Secure contact request" },
  sendCoordinator: { uk: "Надіслати координатору", en: "Send to coordinator" },
  requestSent: {
    uk: "Локальну демонстраційну чернетку збережено. Повідомлення координатору не надіслано.",
    en: "Local demonstration draft saved. No message has been sent to a coordinator.",
  },
  contactConsent: {
    uk: "Контакт встановлюється лише через координатора ISRM — експерт дає згоду до розкриття даних.",
    en: "Contact is arranged only through the ISRM coordinator, with expert consent before disclosure.",
  },
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}
const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  useEffect(() => {
    const saved = localStorage.getItem("isrm-locale");
    if (saved === "uk" || saved === "en") setLocaleState(saved);
  }, []);
  const setLocale = (next: Locale) => {
    localStorage.setItem("isrm-locale", next);
    setLocaleState(next);
  };
  const value = useMemo(
    () => ({ locale, setLocale, t: (key: string) => dictionary[key]?.[locale] ?? key }),
    [locale],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("I18nProvider missing");
  return value;
}
