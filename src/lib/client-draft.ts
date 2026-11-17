import { packageIsCustom, packageServiceIds } from "./tailored-scope";
import { z } from "zod";
import {
  CORE_SERVICE_IDS,
  CLIENT_SERVICES,
  CLIENT_WORKFLOWS,
  type ClientLocale,
  type ServiceId,
} from "./client-catalog";
const serviceEnum = z.enum([
  "search",
  "groups",
  "research",
  "review",
  "evidence",
  "contact",
  "integration",
  "publishing",
  "survey",
]);
const schema = z.object({
  version: z.literal(1),
  mode: z.enum(["full", "graph", "research-only"]),
  serviceIds: z.array(serviceEnum),
  packageServices: z
    .object({
      core: z.array(serviceEnum),
      engagement: z.array(serviceEnum),
      expertise: z.array(serviceEnum),
      monitoring: z.array(serviceEnum),
    })
    .partial()
    .default({}),
  workflowIds: z.array(z.enum(["engagement", "expertise", "monitoring"])),
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
  scopeConfirmed: z.boolean().default(false),
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
  serviceIds: [],
  workflowIds: [],
  packageServices: {},
  requests: [],
  shortlist: [],
  groupName: "",
  customIncluded: true,
  oneOffResearch: false,
  integrationInterest: false,
  scopeConfirmed: false,
  budgetPosition: "discuss",
  budgetCeiling: "",
  currency: "GBP",
  name: "",
  email: "",
  notes: "",
});
export const parseDraft = (raw: string): ClientDraft => {
  const parsed = schema.parse(JSON.parse(raw));
  return parsed.budgetPosition === "approve"
    ? { ...parsed, budgetPosition: "discuss", scopeConfirmed: false }
    : parsed;
};
export function updateDraft(draft: ClientDraft, changes: Partial<ClientDraft>): ClientDraft {
  const next = schema.parse({ ...draft, ...changes });
  if (changes.mode && changes.mode !== draft.mode) {
    next.workflowIds = [];
    next.integrationInterest =
      changes.mode === "full" ? (changes.integrationInterest ?? false) : false;
    next.serviceIds = changes.mode === "full" ? (changes.serviceIds ?? []) : [];
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
    "packageServices",
    "integrationInterest",
    "requests",
    "customIncluded",
    "scopeConfirmed",
  ].some(
    (key) =>
      key in changes &&
      JSON.stringify(draft[key as keyof ClientDraft]) !==
        JSON.stringify(next[key as keyof ClientDraft]),
  );
  if (scopeChanged && !("scopeConfirmed" in changes)) next.scopeConfirmed = false;
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
  return [
    ...new Set<ServiceId>([
      ...(draft.packageServices?.core === undefined ? [] : packageServiceIds(draft, "core")),
      ...draft.serviceIds.filter((id) => !CORE_SERVICE_IDS.includes(id)),
    ]),
  ];
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
  const services = new Set(selectedServiceIds(d));
  const selected = CLIENT_SERVICES.filter((service) => services.has(service.id));
  const omitted = CLIENT_SERVICES.filter((service) => !services.has(service.id));
  const requests = d.customIncluded ? d.requests : [];
  return [
    `ISRM · ${uk ? "Підтвердження функціонального обсягу для оцінки" : "Functional scope confirmation for estimation"}`,
    uk
      ? "Цей документ фіксує функції, які замовник просить оцінити. Він не є замовленням робіт чи прийняттям остаточної ціни."
      : "This document records the functions the client asks to have estimated. It is not an order for work or acceptance of a final price.",
    `${uk ? "Контакт" : "Contact"}: ${d.name || "—"} · ${d.email || "—"}`,
    ...(d.mode === "full" && ["core", ...d.workflowIds].some((id) => packageIsCustom(d, id))
      ? [
          `\n${uk ? "Змінений склад пакета" : "Tailored composition"}`,
          uk
            ? "Зміни до стандартного складу потребують окремої оцінки; показані суми є лише орієнтирами."
            : "Changes to the reference composition require a separate estimate; displayed amounts are indicative only.",
        ]
      : []),
    `\n${uk ? "ОБРАНІ СЕРВІСНІ ФУНКЦІЇ" : "SELECTED SERVICE FUNCTIONS"}`,
    ...(selected.length
      ? selected.map(
          (service) =>
            `• ${service.title[locale]}\n  ${service.detail[locale]}\n  ${service.status[locale]}`,
        )
      : [uk ? "Функції ще не обрано." : "No functions have been selected yet."]),
    `\n${uk ? "НЕ ВКЛЮЧЕНО ДО ЦЬОГО ЗАПИТУ" : "NOT INCLUDED IN THIS REQUEST"}`,
    ...(omitted.length
      ? omitted.map((service) => {
          const examples = CLIENT_WORKFLOWS.filter((workflow) =>
            workflow.serviceIds.includes(service.id),
          ).map((workflow) => workflow.title[locale]);
          return `• ${service.title[locale]}${examples.length ? ` — ${uk ? "пов’язані приклади використання" : "related usage examples"}: ${examples.join("; ")}` : ""}`;
        })
      : [
          uk
            ? "Усі описані сервісні функції включені до запиту на оцінку."
            : "All described service functions are included in the estimation request.",
        ]),
    uk
      ? "Приклади workflow в конфігураторі показують можливі зв’язки функцій; вони не є шаблонами, які замовник має обрати або погодити. Власні процеси й послідовність робіт визначаються разом з організацією."
      : "Workflow examples in the configurator show possible connections between functions; they are not templates the client must select or approve. The organisation's own processes and sequence of work are defined together.",
    `\n${uk ? "ВЛАСНІ ВИМОГИ" : "ADDITIONAL REQUIREMENTS"}`,
    ...(requests.length
      ? requests.map((request) => `• ${request.title}\n${request.description}`)
      : [uk ? "Не додано." : "None added."]),
    `\n${uk ? "ПІДТВЕРДЖЕННЯ ОБСЯГУ" : "SCOPE CONFIRMATION"}`,
    d.scopeConfirmed
      ? uk
        ? "Підтверджено для підготовки оцінки; це не прийняття ціни чи договору."
        : "Confirmed for preparation of an estimate; this is not acceptance of a price or contract."
      : uk
        ? "Не підтверджено."
        : "Not confirmed.",
    `\n${uk ? "БЮДЖЕТНА МЕЖА" : "BUDGET LIMIT"}`,
    d.budgetPosition === "limit" && Number(d.budgetCeiling) > 0
      ? `${uk ? "Запропонована максимальна межа" : "Proposed maximum ceiling"}: ${d.currency} ${d.budgetCeiling}`
      : uk
        ? "Межу не зазначено; бюджет належить обговорити."
        : "No ceiling supplied; budget remains to be discussed.",
    uk
      ? "Це межа замовника, а не розрахунок вартості. Після підтвердження функцій готується окрема оцінка з одноразовими роботами й регулярними витратами. Якщо оцінка перевищить межу, варіанти зміни обсягу повертаються на погодження."
      : "This is the client's limit, not a cost estimate. After the functions are confirmed, a separate estimate will show one-off work and recurring costs. If the estimate exceeds the ceiling, scope alternatives will be returned for review.",
    `\n${uk ? "ІНШІ УМОВИ" : "OTHER TERMS"}`,
    uk
      ? "Організаційні workflow, дані та джерела, конкретні інтеграції, критерії приймання, строки, податки, ліцензії, підтримка й умови оплати визначаються в детальній пропозиції. Неоцінені позиції не вважаються безкоштовними."
      : "Organisational workflows, data and sources, specific integrations, acceptance checks, schedule, tax, licences, support and payment terms are defined in the detailed proposal. Unestimated items are not treated as free.",
    `\n${uk ? "ПРИМІТКИ" : "NOTES"}\n${d.notes || (uk ? "—" : "—")}`,
  ].join("\n");
}
export function emailHref(d: ClientDraft, locale: ClientLocale) {
  return `mailto:alexezav@gmail.com,dmitrfilim@gmail.com?subject=${encodeURIComponent("ISRM · Scope discussion")}&body=${encodeURIComponent(buildClientSummary(d, locale))}`;
}
