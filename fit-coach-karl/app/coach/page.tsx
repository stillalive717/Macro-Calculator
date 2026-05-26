"use client";

import { useState, useRef, useEffect } from "react";
import type { Profile } from "@/lib/macros";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const prompts = [
  "What should I eat before a strength session?",
  "Review my macro split — am I on track?",
  "How do I break through a squat plateau?",
  "What's the best way to add 5kg to my bench?",
  "How much protein do I actually need?",
  "Should I do cardio on rest days?",
];

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-lime flex items-center justify-center text-bg font-black text-xs mr-3 flex-shrink-0 mt-1">
          K
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
          isUser
            ? "bg-lime text-bg font-medium rounded-br-sm"
            : "bg-card border border-border text-text-primary rounded-bl-sm"
        }`}
        style={{ whiteSpace: "pre-wrap" }}
      >
        {msg.content}
      </div>
    </div>
  );
}

export default function Coach() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const p = localStorage.getItem("fck_profile");
    if (p) setProfile(JSON.parse(p));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages([...newMessages, assistantMsg]);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          profile,
        }),
      });

      if (!res.ok || !res.body) throw new Error("Failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: accumulated };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Something went wrong. Check that your ANTHROPIC_API_KEY is configured.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <main className="pt-16 h-screen flex flex-col bg-bg">
      <div className="max-w-3xl mx-auto w-full flex flex-col flex-1 px-4 sm:px-6 min-h-0">
        {/* Header */}
        <div className="py-6 flex-shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-lime flex items-center justify-center text-bg font-black">K</div>
            <div>
              <h1 className="font-black text-xl">Coach Karl</h1>
              <p className="text-xs text-text-secondary flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                AI powered · always available
              </p>
            </div>
          </div>
          {profile && (
            <p className="text-xs text-text-muted ml-13 mt-2 pl-1">
              Personalised for {profile.name} · {profile.goal} phase
            </p>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto min-h-0 pb-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-8 py-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-lime/10 border border-lime/20 flex items-center justify-center text-3xl mx-auto mb-4">💪</div>
                <h2 className="text-xl font-bold mb-2">What do you need today?</h2>
                <p className="text-text-secondary text-sm">Ask me anything about training, nutrition, or recovery.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {prompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="text-left px-4 py-3 rounded-xl border border-border bg-card text-sm text-text-secondary hover:text-text-primary hover:border-lime/30 transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-4">
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}
              {loading && messages[messages.length - 1]?.content === "" && (
                <div className="flex justify-start mb-4">
                  <div className="w-8 h-8 rounded-full bg-lime flex items-center justify-center text-bg font-black text-xs mr-3 flex-shrink-0">K</div>
                  <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-5 py-4">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-text-muted animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex-shrink-0 pb-6">
          <div className="flex gap-3 items-end bg-card border border-border rounded-2xl p-3 focus-within:border-lime/50 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask your coach..."
              rows={1}
              className="flex-1 bg-transparent resize-none focus:outline-none text-sm text-text-primary placeholder:text-text-muted leading-relaxed max-h-32 overflow-y-auto"
              style={{ fieldSizing: "content" } as React.CSSProperties}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-lime text-bg flex items-center justify-center font-bold text-lg hover:bg-lime-dark transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            >
              ↑
            </button>
          </div>
          <p className="text-xs text-text-muted text-center mt-2">Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </main>
  );
}
