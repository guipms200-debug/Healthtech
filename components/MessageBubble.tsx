"use client";
import { marked } from "marked";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MessageBubble({ message }: { message: Message }) {
  return (
    <div className={cn("my-2 flex", message.role === "user" ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[80%] rounded-xl border px-4 py-2 text-sm", message.role === "user" ? "bg-accent-600 text-white" : "bg-white dark:bg-zinc-800")}>
        <div dangerouslySetInnerHTML={{ __html: marked.parse(message.content) as string }} />
        {message.loading && <span className="text-xs opacity-70">digitando...</span>}
      </div>
    </div>
  );
}
