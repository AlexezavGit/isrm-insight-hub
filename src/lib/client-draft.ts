import { BRIEFING_MILESTONES } from "./briefing-milestones";
import { z } from "zod";
import { CLIENT_APPROVED_PRICES, clientQuote } from "./client-pricing";
import {
  CORE_SERVICE_IDS,
  CLIENT_SERVICES,
  CLIENT_WORKFLOWS,
  WORKFLOW_OUTCOME_COPY,
  type ClientLocale,
  type ServiceId,
} from "./client-catalog";
const schema = z.object({
  version: z.literal(1),
  mode: z.enum(["full", "graph", "research-only"]),
  serviceIds: z.array(
    z.enum([
      "search",
      "groups",
      "research",
      "review",
      "evidence",
      "contact",
      "integration",
      "publishing",
      "survey",
    ]),
  ),
  workflowIds: z.array(z.enum(["engagement", "expertise"])),
  requests: z.array(
    z.object({
      id: z.string(),
      kind: z.enum(["service", "workflow"]),
      title: z.string(),
      description: z.string(),
    }),
  ),
  shortlist: z.array(z.string()),
  groupName: z.string(),
  customIncluded: z.boolean().default(true),
  oneOffResearch: z.boolean().default(false),
  integrationInterest: z.boolean().default(false),
  budgetPosition: z.enum(["discuss", "limit", "approve"]),
  budgetCeiling: z.string(),
  currency: z.enum(["GBP", "USD", "EUR"]),
  name: z.string(),
  email: z.string(),
  notes: z.string(),
});
export type ClientDraft = z.infer<typeof schema>;
export const DRAFT_KEY = "isrm-client-draft-v1";
export const emptyDraft = (): ClientDraft => ({
  version: 1,
  mode: "full",
  serviceIds: ["groups", "research", "review", "evidence", "contact", "integration"],
  workflowIds: [],
  requests: [],
  shortlist: [],
  groupName: "",
  customIncluded: true,
  oneOffResearch: false,
  integrationInterest: false,
  budgetPosition: "approve",
  budgetCeiling: "",
  currency: "GBP",
  name: "",
  email: "",
  notes: "",
});
export const parseDraft = (raw: string): ClientDraft => schema.parse(JSON.parse(raw));
export function updateDraft(draft: ClientDraft, changes: Partial<ClientDraft>): ClientDraft {
  const next = schema.parse({ ...draft, ...changes });
  if (changes.mode && changes.mode !== draft.mode) {
    next.workflowIds = [];
    next.integrationInterest = false;
    next.serviceIds = changes.mode === "full" ? emptyDraft().serviceIds : [];
  }
  if (next.mode === "graph")
    next.serviceIds = next.serviceIds.filter((id) => ["research"].includes(id));
  if (changes.oneOffResearch === true)
    next.serviceIds = next.serviceIds.filter((id) => id !== "research");
  if (changes.serviceIds?.includes("research") && next.mode === "graph")
    next.oneOffResearch = false;
  const scopeChanged = [
    "mode",
    "serviceIds",
    "workflowIds",
    "integrationInterest",
    "requests",
    "customIncluded",
  ].some(
    (key) =>
      key in changes &&
      JSON.stringify(draft[key as keyof ClientDraft]) !==
        JSON.stringify(next[key as keyof ClientDraft]),
  );
  if (next.budgetPosition === "approve" && (scopeChanged || clientQuote(next) === null))
    next.budgetPosition = "discuss";
  return next;
}
export function selectedServiceIds(draft: ClientDraft): ServiceId[] {
  if (draft.mode === "graph")
    return [
      ...new Set<ServiceId>([
        "search",
        "groups",
        "review",
        "evidence",
        ...draft.serviceIds.filter((id) => id === "research"),
        ...(draft.serviceIds.includes("research") ? ["review" as const] : []),
      ]),
    ];
  if (draft.mode === "research-only") return ["research", "review"];
  return [...new Set<ServiceId>([...CORE_SERVICE_IDS, ...draft.serviceIds])];
}
export function includeClientRequest(draft: ClientDraft, request: ClientDraft["requests"][number]) {
  return updateDraft(draft, {
    requests: draft.requests.some((r) => r.id === request.id)
      ? draft.requests
      : [...draft.requests, request],
    customIncluded: true,
  });
}
export function buildClientSummary(d: ClientDraft, locale: ClientLocale): string {
  const uk = locale === "uk";
  const services = selectedServiceIds(d);
  return [
    "ISRM · " +
      (uk ? "Запит на підготовку детальної пропозиції" : "Request for a detailed proposal"),
    uk
      ? "Не є замовленням робіт або погодженням ціни."
      : "Not an order for work or acceptance of a price.",
    `${uk ? "Контакт" : "Contact"}: ${d.name} ${d.email}`,
    `${uk ? "Варіант" : "Route"}: ${d.mode === "graph" ? (uk ? "Застосунок як є: пошук, досьє, shortlist та OSINT-перевірка" : "Application as is: search, dossiers, shortlist and OSINT review") : d.mode === "research-only" ? (uk ? "Разові дослідження" : "Research on request") : uk ? "Застосунок за погодженим складом" : "Application with agreed scope"}`,
    "\n" + (uk ? "СЕРВІСИ" : "SERVICES"),
    ...CLIENT_SERVICES.filter((s) => services.includes(s.id)).map(
      (s) => `• ${s.title[locale]}\n  ${s.detail[locale]}`,
    ),
    "\n" +
      (uk
        ? "WORKFLOWS · ПОГОДЖУЮ · ДОДАТИ ДО РОЗРАХУНКІВ У ПРОПОЗИЦІЇ"
        : "WORKFLOWS · APPROVE · INCLUDE IN THE PROPOSAL ESTIMATE"),
    ...CLIENT_WORKFLOWS.filter((w) => d.mode === "full" && d.workflowIds.includes(w.id)).map(
      (w) =>
        `• ${w.title[locale]}\n${w.detail[locale]}\n${w.outputs[locale].map((title, i) => `${title}: ${WORKFLOW_OUTCOME_COPY[w.id][locale][i]}`).join("\n")}`,
    ),
    ...(d.integrationInterest && d.mode === "full"
      ? [
          uk
            ? "Integration · наступна ітерація: погоджую опрацювання AI-консультанта та ліцензованих інтеграцій; додати до розрахунків у пропозиції."
            : "Integration · next iteration: scope discussion agreed for an AI consultant assistant and licensed integrations; include in the proposal estimate.",
        ]
      : []),
    "\n" + (uk ? "ВЛАСНІ ОПИСИ" : "CUSTOM REQUESTS"),
    ...(d.mode !== "full" && d.customIncluded && d.requests.length
      ? [
          uk
            ? "Додаткові запити для окремого обговорення. Не включені до обраного fallback-обсягу або його ціни."
            : "Additional requests for separate discussion. Excluded from the selected simpler option and its price.",
        ]
      : []),
    ...(d.customIncluded ? d.requests : []).map(
      (r) =>
        `${r.kind === "workflow" ? "Workflow" : uk ? "Сервіс" : "Service"}: ${r.title}\n${r.description}`,
    ),
    "\n" + (uk ? "РОБОЧИЙ ВІДБІР · ДСП" : "WORKING SHORTLIST · CONFIDENTIAL"),
    `${d.groupName || "—"}: ${d.shortlist.join(", ") || "—"}`,
    "\n" + (uk ? "БЮДЖЕТНА ПОЗИЦІЯ" : "BUDGET POSITION"),
    d.budgetPosition === "approve" && clientQuote(d) !== null
      ? uk
        ? "Індикативний бюджет прийнятний для підготовки Пропозиції"
        : "Indicative budget acceptable as a basis for a detailed proposal"
      : d.budgetPosition === "limit"
        ? `${uk ? "Запропонована межа" : "Suggested ceiling"}: ${d.currency} ${d.budgetCeiling}`
        : uk
          ? "Потрібне обговорення бюджету"
          : "Budget to discuss",
    ...[
      [
        d.mode === "graph"
          ? uk
            ? "Застосунок як є: пошук, досьє, shortlist та OSINT-перевірка"
            : "Application as is: search, dossiers, shortlist and OSINT review"
          : uk
            ? "Базовий застосунок"
            : "Core application",
        d.mode === "graph" ? CLIENT_APPROVED_PRICES.graph : CLIENT_APPROVED_PRICES.base,
      ],
      ...(d.mode === "graph"
        ? d.serviceIds
            .filter((id) => id === "research")
            .map((id) => [
              CLIENT_SERVICES.find((s) => s.id === id)?.title[locale],
              CLIENT_APPROVED_PRICES.addons[id] ?? null,
            ])
        : []),
    ].map(
      ([title, value]) =>
        `${title}: ${value === null ? (uk ? "До погодження" : "Pending approval") : `${CLIENT_APPROVED_PRICES.currency} ${value}`}`,
    ),
    `${uk ? "Індикативна сума" : "Indicative total"}: ${clientQuote(d) === null ? (uk ? "До погодження" : "Pending approval") : `${CLIENT_APPROVED_PRICES.currency} ${clientQuote(d)}`}`,
    uk
      ? "Суми індикативні для зазначеного обсягу. Остаточну пропозицію, строки, інтеграції та права визначає угода."
      : "Amounts are indicative for the stated scope. The final offer, timetable, integrations and rights are defined in the agreement.",
    ...(d.mode === "full"
      ? [
          uk
            ? "Попередні умови, що підлягають погодженню, тільки для ядра: ТЗ та угода 30%; перший запуск та інтеграція 50%; налаштування та передача 20%."
            : "Provisional terms, subject to agreement, for the core only: specification & agreement 30%; initial deployment & integration 50%; refinement & handover 20%.",
          ...BRIEFING_MILESTONES.map(
            (step) => `${Math.round(step.fraction * 100)}% · ${step.title[locale]}
${step.detail[locale]}
${step.acceptance[locale]}`,
          ),
        ]
      : []),
    d.oneOffResearch
      ? uk
        ? "Також цікавлять разові дослідження на замовлення."
        : "Also interested in research on individual requests."
      : "",
    "\n" + (uk ? "ДАНІ ТА ВІДПОВІДАЛЬНІСТЬ" : "DATA & RESPONSIBILITY"),
    uk
      ? "Демонстраційна вибірка та тематичні зв’язки не є акредитацією, рекомендацією ISRM чи оцінкою репутації. AI OSINT ще не підключено. Операційне використання даних потребує визначених цілей, правової підстави, відповідальних, строків зберігання та порядку реалізації прав."
      : "The demonstration sample and thematic matches are not accreditation, an ISRM endorsement or a reputation assessment. AI OSINT is not connected. Operational data use requires defined purposes, lawful basis, responsibilities, retention periods and a rights process.",
    "\n" + (uk ? "ПРИМІТКИ" : "NOTES"),
    d.notes,
  ].join("\n");
}
export function emailHref(d: ClientDraft, locale: ClientLocale) {
  return `mailto:alexezav@gmail.com,dmitrfilim@gmail.com?subject=${encodeURIComponent("ISRM · Scope discussion")}&body=${encodeURIComponent(buildClientSummary(d, locale))}`;
}
