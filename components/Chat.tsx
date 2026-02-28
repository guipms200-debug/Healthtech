"use client";
import { Message } from "@/lib/types";
import { MessageBubble } from "./MessageBubble";

export function Chat({ messages }: { messages: Message[] }) {
  return <div className="flex-1 overflow-auto p-4">{messages.map((m) => <MessageBubble key={m.id} message={m} />)}</div>;
}
