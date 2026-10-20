import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "uk" | "en";

type Dictionary = Record<string, { uk: string; en: string }>;

const dictionary: Dictionary = {
  network: { uk: "Мережа", en: "Network" },
  directory: { uk: "Реєстр", en: "Directory" },
  proposal: { uk: "Пропозиція", en: "Proposal" },
  coordinator: { uk: "Координатор", en: "Coordinator" },
  search: { uk: "Пошук", en: "Search" },
  cabinet: { uk: "Кабінет", en: "Cabinet" },
  warRoom: { uk: "War Room", en: "War Room" },
  anonymous: { uk: "Знеособлений режим", en: "Anonymous mode" },
  reveal: { uk: "Розкрити дані", en: "Reveal data" },
  exitAccess: { uk: "Вийти з доступу", en: "Exit access" },
  trustProtocol: { uk: "Протокол довіри", en: "Trust protocol" },
  revealFull: { uk: "Розкриття повних даних", en: "Full data access" },
  accessHelp: {
    uk: "Введіть код або повне ім'я верифікованого рекомендодавця чи адміністративний пароль координатора.",
    en: "Enter a verified referrer's code or full name, or the coordinator password.",
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
  trust: { uk: "Довіра", en: "Trust" },
  expert: { uk: "Експерт", en: "Expert" },
  code: { uk: "Код", en: "Code" },
  nodes: { uk: "Вузлів", en: "Nodes" },
  networkExploreHint: {
    uk: "Перевірені експерти показані окремо; неперевірені зібрані в кластер. Оберіть вузол експерта, щоб відкрити коротке досьє.",
    en: "Verified experts appear individually; unverified profiles are grouped. Select an expert node to reveal a short dossier.",
  },
  networkSlice: { uk: "Зріз мережі", en: "Network snapshot" },
  graphLayers: { uk: "Шари графа", en: "Graph layers" },
  expertNodes: { uk: "Вузли експертів", en: "Expert nodes" },
  connections: { uk: "Зв'язки", en: "Connections" },
  clusterLayers: { uk: "Шари кластерів", en: "Cluster layers" },
  sectors: { uk: "Сектори", en: "Sectors" },
  themes: { uk: "Теми українського досвіду", en: "Ukraine experience themes" },
  hubs: { uk: "Хаби / ролі спільноти", en: "Hubs / community roles" },
  verifiedExpert: { uk: "Верифікований експерт", en: "Verified expert" },
  graphHint: {
    uk: "Розмір вузла — індекс довіри. Дотик — фокус на оточенні.",
    en: "Node size shows trust score. Tap to focus on connections.",
  },
  aliases: { uk: "псевдоніми", en: "aliases" },
  fullData: { uk: "повні дані", en: "full data" },
  highestTrust: { uk: "Найвищий рівень довіри", en: "Highest trust" },
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
  trustIndex: { uk: "Індекс довіри", en: "Trust index" },
  contacts: { uk: "Контакти", en: "Contacts" },
  directContacts: {
    uk: "Прямі контакти доступні лише координатору.",
    en: "Direct contacts are available to the coordinator only.",
  },
  linkedin: { uk: "Профіль LinkedIn", en: "LinkedIn profile" },
  safeRequest: { uk: "Безпечний запит контакту", en: "Secure contact request" },
  sendCoordinator: { uk: "Надіслати координатору", en: "Send to coordinator" },
  requestSent: {
    uk: "Запит передано координатору. Він зв'яжеться з експертом та поверне відповідь.",
    en: "The request was sent to the coordinator, who will contact the expert and follow up.",
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
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
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
