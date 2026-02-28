"use client";
import { CohortFunnelStep } from "@/lib/types";

export function FunnelChart({ steps }: { steps: CohortFunnelStep[] }) {
  const max = steps[0]?.count ?? 1;
  return (
    <div className="space-y-2">
      {steps.map((s) => (
        <div key={s.id}>
          <div className="mb-1 flex justify-between text-xs"><span>{s.label}</span><span>{s.count}</span></div>
          <div className="h-2 rounded bg-zinc-200 dark:bg-zinc-700">
            <div className="h-2 rounded bg-accent-600" style={{ width: `${(s.count / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
