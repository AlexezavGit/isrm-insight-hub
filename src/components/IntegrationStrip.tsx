import wordpressMark from "@/assets/integrations/wordpress.svg?url";
import moodleMark from "@/assets/integrations/moodle.svg?url";
import { Database, MessagesSquare, FileSpreadsheet, ScanSearch, Radio } from "lucide-react";
import type { ClientLocale } from "@/lib/client-catalog";
export function IntegrationStrip({ locale }: { locale: ClientLocale }) {
  const uk = locale === "uk";
  return (
    <section
      className="integration-strip"
      aria-label={uk ? "Інтеграційний підхід" : "Integration-led approach"}
    >
      <strong>
        {uk
          ? "Інтеграційне рішення — поєднати потрібне"
          : "An integration-led solution — connect what is useful"}
      </strong>
      <div>
        <span>
          <FileSpreadsheet size={21} />
          CSV / XLSX
        </span>
        <span>
          <Database size={21} />
          CRM / {uk ? "членство" : "membership"}
        </span>
        <span>
          <MessagesSquare size={21} />
          {uk ? "Комунікації" : "Communications"}
        </span>
        <span>
          <ScanSearch size={21} />
          AI OSINT
        </span>
        <span className="integration-candidate">
          <img src={wordpressMark} alt="" width="22" height="22" />
          WordPress
        </span>
        <span className="integration-candidate">
          <img src={moodleMark} alt="" width="22" height="22" />
          Moodle / LMS
        </span>
        <span>
          <Radio size={21} />
          World Monitor
        </span>
      </div>
      <small>
        {uk
          ? "Категорії та приклади інтеграцій, не підключені сервіси. OSINT — наявний помічник; CRM, LMS, комунікації й моніторинг — за погодженими API, правами та окремим обсягом. Логотипи не означають партнерства."
          : "Integration categories and examples, not connected services. OSINT uses the existing assistant; CRM, LMS, communications and monitoring depend on agreed APIs, rights and scope. Marks do not imply a partnership."}
      </small>
    </section>
  );
}
