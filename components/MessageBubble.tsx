"use client";
import { marked } from "marked";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MessageBubble({ message }: { message: Message }) {
  return (
    <div className={cn("my-3 flex", message.role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl border px-4 py-3 text-sm",
          message.role === "user"
            ? "border-transparent bg-[var(--accent)] text-white"
            : "glass"
        )}
      >
        <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(message.content) as string }} />
        {message.loading && <span className="text-xs opacity-70">digitando...</span>}
      </div>
    </div>
  );
}
