export type AppMode = "feasibility" | "extract";
export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  loading?: boolean;
  result?: CohortResult;
}

export interface ChatContext {
  projectId: string;
  mode: AppMode;
  previousCriteria: CohortCriterion[];
  globalTimeRange: string;
}

export interface CohortCriterion {
  id: string;
  label: string;
  description: string;
  conceptsUsed: Array<{ system: string; code: string; term: string }>;
  timeWindow: string;
}

export interface CohortSummary {
  id: string;
  name: string;
  totalN: number;
  criteria: CohortCriterion[];
  funnel: CohortFunnelStep[];
  interpretation: string;
  globalTimeRange: string;
}

export interface CohortFunnelStep {
  id: string;
  label: string;
  count: number;
}

export interface CohortResultRow {
  patient_id: string;
  sexo: "F" | "M";
  idade: number;
  diagnosis_codes: string;
  index_date: string;
  site_id: string;
}

export interface CohortResult {
  counts: { totalN: number };
  criteria: CohortCriterion[];
  funnel: CohortFunnelStep[];
  rows: CohortResultRow[];
  metadata: {
    mode: AppMode;
    generatedAt: string;
    explanation: string;
  };
}

export interface SavedCohort {
  id: string;
  projectId: string;
  name: string;
  version: number;
  tags: string[];
  mode: AppMode;
  createdAt: string;
  updatedAt: string;
  result: CohortResult;
}

export interface ActivityItem {
  id: string;
  action: string;
  timestamp: string;
}

export interface ProjectOption {
  id: string;
  name: string;
}
