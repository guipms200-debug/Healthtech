import { ChatContext, CohortCriterion, CohortResult, CohortResultRow } from "./types";
import { uid } from "./utils";

const terms = ["CID-10 E11", "HbA1c", "TUSS 40201012", "SNOMED 44054006", "LOINC 4548-4", "RxNorm 860975"];

function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507)) >>> 0) / 4294967296;
}

function makeRows(rand: () => number, n: number): CohortResultRow[] {
  return Array.from({ length: n }).map((_, i) => ({
    patient_id: `PT-${Math.floor(rand() * 99999).toString().padStart(5, "0")}`,
    sexo: rand() > 0.5 ? "F" : "M",
    idade: Math.floor(rand() * 60) + 18,
    diagnosis_codes: rand() > 0.5 ? "E11,I50" : "E11",
    index_date: `2024-${String(Math.floor(rand() * 12) + 1).padStart(2, "0")}-${String(Math.floor(rand() * 28) + 1).padStart(2, "0")}`,
    site_id: `SITE-${(i % 3) + 1}`
  }));
}

/**
 * TODO: Replace with backend/API integration when available.
 * TODO: Add real streaming via SSE/WebSocket.
 * TODO: Add auth/roles enforcement.
 * TODO: Enforce project-level permissions.
 */
export async function runCohortQuery(userText: string, context: ChatContext): Promise<CohortResult> {
  const rand = seeded(`${userText}-${context.projectId}-${context.mode}`);
  const base = Math.floor(rand() * 8000) + 500;
  const criteria: CohortCriterion[] = [
    {
      id: uid(),
      label: userText.slice(0, 45),
      description: "Critério interpretado a partir do prompt do usuário.",
      conceptsUsed: terms.slice(0, 3).map((t) => ({ system: t.split(" ")[0], code: t.split(" ")[1] ?? "N/A", term: t })),
      timeWindow: "Últimos 12 meses"
    },
    ...context.previousCriteria
  ];

  const funnel = [
    { id: uid(), label: "Base Population", count: base },
    ...criteria.map((c, i) => ({ id: c.id, label: `Critério ${i + 1}`, count: Math.max(20, Math.floor(base * (0.75 - i * 0.12))) }))
  ];

  const totalN = funnel[funnel.length - 1]?.count ?? base;
  const rows = context.mode === "extract" ? makeRows(rand, 48) : makeRows(rand, 6);

  return {
    counts: { totalN },
    criteria,
    funnel,
    rows,
    metadata: {
      mode: context.mode,
      generatedAt: new Date().toISOString(),
      explanation: "Dados simulados da própria unidade (mock/offline), já codificados e normalizados localmente (LGPD by design)."
    }
  };
}
