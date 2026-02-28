"use client";
import { ActivityItem } from "@/lib/types";
import { fmtDate } from "@/lib/utils";

export function AuditLog({ items }: { items: ActivityItem[] }) {
  return (
    <ul className="space-y-1 text-xs">
      {items.slice(0, 8).map((i) => (
        <li key={i.id} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--muted)]">
          {i.action}
          <br />
          {fmtDate(i.timestamp)}
        </li>
      ))}
    </ul>
  );
}
