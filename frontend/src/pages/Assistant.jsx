import { useEffect, useRef, useState } from "react";
import { Loader2, MessageSquare, Plus, Send } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getChatConversations,
  createChatConversation,
  getChatMessages,
  sendChatMessage,
} from "../services/api";

const Assistant = () => {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const loadConversations = async () => {
    const data = await getChatConversations();
    setConversations(data.conversations ?? []);
    if (!activeId && data.conversations?.length) {
      setActiveId(data.conversations[0].conversationId);
    }
    setLoading(false);
  };

  const loadMessages = async (conversationId) => {
    const data = await getChatMessages(conversationId);
    setMessages(data.messages ?? []);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeId) loadMessages(activeId);
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startNew = async () => {
    const data = await createChatConversation({ title: "New chat" });
    await loadConversations();
    setActiveId(data.conversation.conversationId);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeId) return;
    setSending(true);
    const content = input.trim();
    setInput("");
    try {
      const data = await sendChatMessage(activeId, content);
      setMessages((prev) => [
        ...prev,
        data.userMessage,
        data.assistantMessage,
      ]);
      await loadConversations();
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout
      title="AI Assistant"
      subtitle="Get help with Chrome extension architecture, APIs, and debugging"
    >
      <div className="flex h-[calc(100vh-12rem)] min-h-[480px] overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        <aside className="hidden w-56 shrink-0 border-r border-zinc-200/80 bg-zinc-50/50 p-3 md:block">
          <button
            type="button"
            onClick={startNew}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2 text-sm font-medium text-white"
          >
            <Plus size={14} />
            New chat
          </button>
          <ul className="space-y-1 overflow-y-auto">
            {conversations.map((c) => (
              <li key={c.conversationId}>
                <button
                  type="button"
                  onClick={() => setActiveId(c.conversationId)}
                  className={`w-full truncate rounded-lg px-3 py-2 text-left text-sm ${
                    activeId === c.conversationId
                      ? "bg-white font-medium text-zinc-900 shadow-sm"
                      : "text-zinc-600 hover:bg-white/80"
                  }`}
                >
                  {c.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {!activeId ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
              <MessageSquare className="text-zinc-300" size={40} />
              <p className="text-zinc-500">Start a conversation with the assistant</p>
              <button
                type="button"
                onClick={startNew}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
              >
                New chat
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-zinc-400" />
                  </div>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.messageId}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-100 text-zinc-800"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <form
                onSubmit={handleSend}
                className="border-t border-zinc-200/80 p-4 flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Manifest V3, permissions, debugging…"
                  className="flex-1 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
                >
                  {sending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Assistant;
