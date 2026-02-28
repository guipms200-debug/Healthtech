"use client";

import { useEffect, useMemo, useState } from "react";
import { Chat } from "@/components/Chat";
import { CohortSummary } from "@/components/CohortSummary";
import { Composer } from "@/components/Composer";
import { ExportModal } from "@/components/ExportModal";
import { LeftSidebar } from "@/components/LeftSidebar";
import { ModeToggle } from "@/components/ModeToggle";
import { TableViewDrawer } from "@/components/TableViewDrawer";
import { TagChips } from "@/components/TagChips";
import { ThemeToggle } from "@/components/ThemeToggle";
import { exportRowsToCsv, exportRowsToJson } from "@/lib/export";
import { runCohortQuery } from "@/lib/mock";
import { readStorage, writeStorage } from "@/lib/storage";
import { ActivityItem, AppMode, ChatContext, Message, ProjectOption, SavedCohort, CohortResult } from "@/lib/types";
import { uid } from "@/lib/utils";

const projects: ProjectOption[] = [
  { id: "a", name: "Estudo A" },
  { id: "b", name: "Auditoria Qualidade" },
  { id: "c", name: "Feasibility Pharma" }
];

export default function HomePage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mode, setMode] = useState<AppMode>("feasibility");
  const [projectId, setProjectId] = useState("a");
  const [messages, setMessages] = useState<Message[]>([]);
  const [result, setResult] = useState<CohortResult | null>(null);
  const [cohortName, setCohortName] = useState("Cohort atual");
  const [saved, setSaved] = useState<SavedCohort[]>([]);
  const [audit, setAudit] = useState<ActivityItem[]>([]);
  const [exportOpen, setExportOpen] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);

  useEffect(() => {
    setTheme(readStorage("theme", "light"));
    setMode(readStorage("mode", "feasibility"));
    setProjectId(readStorage("projectId", "a"));
    setMessages(readStorage("messages", []));
    setResult(readStorage("result", null));
    setSaved(readStorage("saved", []));
    setAudit(readStorage("audit", []));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    writeStorage("theme", theme);
    writeStorage("mode", mode);
    writeStorage("projectId", projectId);
    writeStorage("messages", messages);
    writeStorage("result", result);
    writeStorage("saved", saved);
    writeStorage("audit", audit);
  }, [theme, mode, projectId, messages, result, saved, audit]);

  const history = useMemo(() => messages.filter((m) => m.role === "user").map((m) => m.content).reverse(), [messages]);

  const addAudit = (action: string) => setAudit((a) => [{ id: uid(), action, timestamp: new Date().toISOString() }, ...a]);

  async function handleSend(text: string) {
    const userMsg: Message = { id: uid(), role: "user", content: text, createdAt: new Date().toISOString() };
    const assistantMsg: Message = { id: uid(), role: "assistant", content: "", loading: true, createdAt: new Date().toISOString() };
    setMessages((m) => [...m, userMsg, assistantMsg]);

    const ctx: ChatContext = {
      projectId,
      mode,
      previousCriteria: result?.criteria ?? [],
      globalTimeRange: "Últimos 12 meses"
    };

    const out = await runCohortQuery(text, ctx);
    setResult(out);

    const fullText = `### Resultado (${mode})\n- Total N: **${out.counts.totalN}**\n- Critérios aplicados: ${out.criteria.length}\n\n${out.metadata.explanation}`;
    let cursor = "";
    const chars = fullText.split("");
    let i = 0;
    const timer = setInterval(() => {
      cursor += chars[i] ?? "";
      i += 1;
      setMessages((prev) => prev.map((m) => (m.id === assistantMsg.id ? { ...m, content: cursor, loading: i < chars.length, result: out } : m)));
      if (i >= chars.length) clearInterval(timer);
    }, 12);
    addAudit("Query executada");
  }

  const doSave = () => {
    if (!result) return;
    const item: SavedCohort = {
      id: uid(),
      projectId,
      name: cohortName,
      version: 1,
      tags: [mode, "mock"],
      mode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      result
    };
    setSaved((s) => [item, ...s]);
    addAudit("Cohort v1 saved");
  };

  const newVersion = () => {
    if (!result) return;
    const existing = saved.find((s) => s.name === cohortName);
    const version = (existing?.version ?? 1) + 1;
    setSaved((s) => [{ ...existing, id: uid(), name: cohortName, version, result, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString(), projectId, tags: [mode] } as SavedCohort, ...s]);
    addAudit(`Cohort v${version} saved`);
  };

  return (
    <main className="h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h1 className="font-semibold">Hillary Cohort Builder</h1>
          <p className="text-xs text-zinc-500">Mock/Offline • Dados da própria unidade codificados localmente • LGPD by design</p>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle mode={mode} setMode={setMode} />
          <ThemeToggle theme={theme} onToggle={() => setTheme((t) => (t === "light" ? "dark" : "light"))} />
          <button onClick={() => setExportOpen(true)} className="rounded bg-accent-600 px-3 py-1 text-sm text-white">Export</button>
        </div>
      </header>

      <div className="grid h-[calc(100vh-65px)] grid-cols-12">
        <div className="col-span-3"><LeftSidebar
          projects={projects}
          projectId={projectId}
          setProjectId={setProjectId}
          cohorts={saved.filter((s) => s.projectId === projectId)}
          onLoad={(id) => { const c = saved.find((x) => x.id === id); if (c) { setResult(c.result); setCohortName(c.name); addAudit(`Loaded ${c.name}`); } }}
          onDelete={(id) => { setSaved((s) => s.filter((x) => x.id !== id)); addAudit("Cohort deleted"); }}
          onDuplicate={(id) => { const c = saved.find((x) => x.id === id); if (c) { setSaved((s) => [{ ...c, id: uid(), name: `${c.name} copy`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...s]); addAudit("Cohort duplicated"); } }}
          history={history}
          audit={audit}
        /></div>

        <section className="col-span-6 flex h-full flex-col">
          <Chat messages={messages} />
          <div className="border-t p-4">
            <TagChips onPick={handleSend} />
            <Composer onSend={handleSend} />
          </div>
        </section>

        <div className="col-span-3">
          <CohortSummary
            name={cohortName}
            setName={setCohortName}
            result={result}
            onRemoveCriterion={(id) => {
              if (!result) return;
              const criteria = result.criteria.filter((c) => c.id !== id);
              setResult({ ...result, criteria });
              addAudit("Criterion removed");
            }}
            onSave={doSave}
            onVersion={newVersion}
            onClear={() => { setResult(null); setMessages([]); addAudit("Cohort cleared"); }}
            onTable={() => setTableOpen(true)}
          />
        </div>
      </div>

      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        onCSV={() => { exportRowsToCsv(result?.rows ?? []); addAudit("Export CSV"); setExportOpen(false); }}
        onJSON={() => { exportRowsToJson(result?.rows ?? []); addAudit("Export JSON"); setExportOpen(false); }}
      />
      <TableViewDrawer open={tableOpen} onClose={() => setTableOpen(false)} rows={result?.rows ?? []} />
    </main>
  );
}
