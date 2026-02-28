import { CohortResultRow } from "./types";

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportRowsToJson(rows: CohortResultRow[], filename = "cohort-result.json") {
  download(JSON.stringify(rows, null, 2), filename, "application/json");
}

export function exportRowsToCsv(rows: CohortResultRow[], filename = "cohort-result.csv") {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const body = rows.map((r) => headers.map((h) => JSON.stringify((r as never)[h])).join(",")).join("\n");
  download([headers.join(","), body].join("\n"), filename, "text/csv");
}
