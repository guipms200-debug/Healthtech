"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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
import { ActivityItem, AppMode, ChatContext, CohortResult, Message, ProjectOption, SavedCohort } from "@/lib/types";
import { uid } from "@/lib/utils";

const projects: ProjectOption[] = [
  { id: "a", name: "Estudo A" },
  { id: "b", name: "Auditoria Qualidade" },
  { id: "c", name: "Feasibility Pharma" }
];

export default function HomePage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mode, setMode] = useState<AppMode>("feasibility");
  const [projectId, setProjectId] = useState("a");
  const [messages, setMessages] = useState<Message[]>([]);
  const [result, setResult] = useState<CohortResult | null>(null);
  const [cohortName, setCohortName] = useState("Cohort atual");
  const [saved, setSaved] = useState<SavedCohort[]>([]);
  const [audit, setAudit] = useState<ActivityItem[]>([]);
  const [exportOpen, setExportOpen] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setTheme(readStorage("theme", "dark"));
    setMode(readStorage("mode", "feasibility"));
    setProjectId(readStorage("projectId", "a"));
    setMessages(readStorage("messages", []));
    setResult(readStorage("result", null));
    setSaved(readStorage("saved", []));
    setAudit(readStorage("audit", []));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
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

  const isEmpty = messages.length === 0;

  return (
    <main className="relative flex h-screen overflow-hidden text-[var(--text)]">
      <div className="hidden md:block">
        <LeftSidebar
          projects={projects}
          projectId={projectId}
          setProjectId={setProjectId}
          cohorts={saved.filter((s) => s.projectId === projectId)}
          onLoad={(id) => { const c = saved.find((x) => x.id === id); if (c) { setResult(c.result); setCohortName(c.name); addAudit(`Loaded ${c.name}`); } }}
          onDelete={(id) => { setSaved((s) => s.filter((x) => x.id !== id)); addAudit("Cohort deleted"); }}
          onDuplicate={(id) => { const c = saved.find((x) => x.id === id); if (c) { setSaved((s) => [{ ...c, id: uid(), name: `${c.name} copy`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...s]); addAudit("Cohort duplicated"); } }}
          history={history}
          audit={audit}
        />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="h-full" onClick={(e) => e.stopPropagation()}>
            <LeftSidebar
              projects={projects}
              projectId={projectId}
              setProjectId={setProjectId}
              cohorts={saved.filter((s) => s.projectId === projectId)}
              onLoad={(id) => { const c = saved.find((x) => x.id === id); if (c) { setResult(c.result); setCohortName(c.name); addAudit(`Loaded ${c.name}`); } setSidebarOpen(false); }}
              onDelete={(id) => { setSaved((s) => s.filter((x) => x.id !== id)); addAudit("Cohort deleted"); }}
              onDuplicate={(id) => { const c = saved.find((x) => x.id === id); if (c) { setSaved((s) => [{ ...c, id: uid(), name: `${c.name} copy`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...s]); addAudit("Cohort duplicated"); } }}
              history={history}
              audit={audit}
            />
          </div>
        </div>
      )}

      <section className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <div className="flex items-center gap-3">
            <button className="rounded-lg border border-[var(--border)] px-2 py-1 md:hidden" onClick={() => setSidebarOpen(true)}>☰</button>
            <Image src="/loom-logo.svg" alt="Loom" width={210} height={52} priority className="h-10 w-auto" />
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle mode={mode} setMode={setMode} />
            <ThemeToggle theme={theme} onToggle={() => setTheme((t) => (t === "light" ? "dark" : "light"))} />
            <span className="hidden rounded-full border border-[var(--border)] px-2 py-1 text-xs text-[var(--muted)] sm:inline">PT-BR</span>
            <span className="hidden rounded-full border border-[var(--border)] px-2 py-1 text-xs text-[var(--muted)] sm:inline">Demo</span>
            <button onClick={() => setExportOpen(true)} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-sm hover:border-[var(--border-hover)]">Export</button>
            <button onClick={() => setSummaryOpen(true)} className="rounded-full bg-[var(--accent)] px-3 py-1 text-sm text-white">Cohort</button>
            <div className="grid h-8 w-8 place-items-center rounded-full border border-[var(--border)] text-xs">A</div>
          </div>
        </header>

        <div className="mx-auto flex h-full w-full max-w-6xl flex-1 px-3 py-4 md:px-6">
          <div className="glass flex w-full flex-1 flex-col rounded-2xl p-3 md:p-5">
            {isEmpty ? (
              <div className="flex h-full flex-col items-center justify-center">
                <h2 className="mb-6 text-center text-3xl font-semibold md:text-5xl">
                  Olá, como podemos ajudar <span className="text-violet-400">hoje</span>?
                </h2>
                <div className="w-full max-w-3xl">
                  <TagChips onPick={handleSend} />
                  <Composer onSend={handleSend} />
                </div>
              </div>
            ) : (
              <>
                <Chat messages={messages} />
                <div className="border-t border-[var(--border)] pt-4">
                  <TagChips onPick={handleSend} />
                  <Composer onSend={handleSend} />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform border-l border-[var(--border)] bg-[#0a1020] p-4 transition-transform duration-200 ${summaryOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Cohort Summary</h3>
          <button onClick={() => setSummaryOpen(false)} className="rounded border border-[var(--border)] px-2 py-1 text-xs">Close</button>
        </div>
        <div className="h-[calc(100%-40px)] overflow-auto pr-1">
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

      {summaryOpen && <button className="fixed inset-0 z-40 bg-black/30" onClick={() => setSummaryOpen(false)} aria-label="close summary backdrop" />}

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
