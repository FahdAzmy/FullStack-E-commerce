'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, MessageCircle, Send, Bot, User, Loader2, Sparkles, RotateCcw } from 'lucide-react';
import { Outfit } from 'next/font/google';
import { usePathname } from 'next/navigation';

const outfit = Outfit({ subsets: ['latin'] });

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  'What products do you offer?',
  'How do I track my order?',
  'What payment methods are accepted?',
  'How do I create an account?',
];

/* ─── Simple markdown-to-JSX renderer ─── */
function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headings
    if (line.startsWith('## ')) {
      elements.push(<p key={key++} className="font-semibold text-[13px] mt-3 mb-1 text-black">{line.slice(3)}</p>);
      continue;
    }
    if (line.startsWith('# ')) {
      elements.push(<p key={key++} className="font-bold text-[14px] mt-3 mb-1 text-black">{line.slice(2)}</p>);
      continue;
    }

    // Bullet points
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const content = line.slice(2);
      elements.push(
        <div key={key++} className="flex gap-2 my-0.5">
          <span className="mt-1.5 h-1 w-1 rounded-full bg-current shrink-0 opacity-60" />
          <span>{formatInline(content)}</span>
        </div>
      );
      continue;
    }

    // Numbered list
    const numbered = line.match(/^(\d+)\.\s(.+)/);
    if (numbered) {
      elements.push(
        <div key={key++} className="flex gap-2 my-0.5">
          <span className="shrink-0 font-medium text-[11px] opacity-60 mt-0.5">{numbered[1]}.</span>
          <span>{formatInline(numbered[2])}</span>
        </div>
      );
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<div key={key++} className="h-1.5" />);
      continue;
    }

    // Normal paragraph
    elements.push(<p key={key++} className="my-0.5">{formatInline(line)}</p>);
  }

  return elements;
}

function formatInline(text: string): React.ReactNode {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    // Inline code
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-black/10 rounded px-1 text-[11px] font-mono">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setHasGreeted(true);
      setMessages([
        {
          role: 'assistant',
          content:
            "Hello! I'm the **VESTIGE AI Assistant**. I'm here to help you discover our curated collection, answer questions about your orders, or guide you through anything on our site.\n\nWhat can I help you with today?",
        },
      ]);
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, hasGreeted]);

  const sendMessage = useCallback(
    async (messageText?: string) => {
      const text = (messageText ?? input).trim();
      if (!text || isLoading) return;

      const userMessage: Message = { role: 'user', content: text };
      const updatedMessages = [...messages, userMessage];

      setMessages(updatedMessages);
      setInput('');
      setIsLoading(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: updatedMessages }),
        });
        const data = await res.json();

        if (data.error) {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: `⚠️ ${data.error}` },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: data.message },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: '⚠️ Connection error. Please check your internet and try again.' },
        ]);
      } finally {
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    },
    [input, isLoading, messages]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          "Hello! I'm the **VESTIGE AI Assistant**. I'm here to help you discover our curated collection, answer questions about your orders, or guide you through anything on our site.\n\nWhat can I help you with today?",
      },
    ]);
    setInput('');
  };

  const showSuggestions = messages.length <= 1 && !isLoading;

  if (pathname === '/') {
    return null;
  }

  return (
    <>
      {/* ── Floating Toggle Button ── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? 'Close AI chat' : 'Open AI chat'}
        className={`
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full
          bg-black text-white
          flex items-center justify-center
          shadow-2xl shadow-black/30
          transition-all duration-300 ease-out
          hover:scale-110 hover:shadow-black/50
          active:scale-95
          ${isOpen ? 'rotate-0' : 'rotate-0'}
        `}
        style={{ fontFamily: outfit.style.fontFamily }}
      >
        {isOpen ? (
          <X className="h-5 w-5 transition-transform duration-200" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-emerald-400 rounded-full animate-pulse" />
          </div>
        )}
      </button>

      {/* ── Chat Panel ── */}
      <div
        className={`
          fixed bottom-24 right-6 z-50
          w-[360px] max-w-[calc(100vw-3rem)]
          bg-[#fbf9f5] border border-[#c4c7c7]/40
          shadow-2xl shadow-black/20
          flex flex-col
          transition-all duration-300 ease-out origin-bottom-right
          ${isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
          }
        `}
        style={{ height: '520px', fontFamily: outfit.style.fontFamily }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#c4c7c7]/40 bg-black text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-400 rounded-full border-2 border-black" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">VESTIGE AI</p>
              <p className="text-[10px] text-white/60 uppercase tracking-[0.12em]">Always here to help</p>
            </div>
          </div>
          <button
            onClick={resetChat}
            title="Reset conversation"
            className="text-white/50 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              {/* Avatar */}
              <div
                className={`
                  w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5
                  ${msg.role === 'assistant' ? 'bg-black text-white' : 'bg-[#efeeea] text-black border border-[#c4c7c7]/50'}
                `}
              >
                {msg.role === 'assistant' ? (
                  <Bot className="h-3.5 w-3.5" />
                ) : (
                  <User className="h-3.5 w-3.5" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`
                  max-w-[78%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed
                  ${msg.role === 'assistant'
                    ? 'bg-[#efeeea] text-black rounded-tl-sm'
                    : 'bg-black text-white rounded-tr-sm'
                  }
                `}
              >
                {msg.role === 'assistant' ? (
                  <div className="space-y-0.5">{renderMarkdown(msg.content)}</div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-2.5 flex-row animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="bg-[#efeeea] rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-black/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 bg-black/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 bg-black/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {/* Suggestion chips */}
          {showSuggestions && (
            <div className="space-y-2 pt-1 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
              <p className="text-[10px] text-[#747878] uppercase tracking-[0.12em] ml-10">Suggested questions</p>
              <div className="ml-10 flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-[11px] px-3 py-1.5 border border-[#c4c7c7]/60 text-[#444748] hover:border-black hover:text-black hover:bg-[#efeeea] transition-all duration-200 rounded-full"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 py-3 border-t border-[#c4c7c7]/40 bg-[#fbf9f5] shrink-0">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about our products, orders..."
              rows={1}
              disabled={isLoading}
              className="
                flex-1 resize-none bg-[#efeeea] border-0 rounded-xl
                px-4 py-3 text-[13px] text-black placeholder-[#747878]
                focus:outline-none focus:ring-1 focus:ring-black/20
                transition-all duration-200
                max-h-24 leading-relaxed
                disabled:opacity-50
              "
              style={{
                fontFamily: outfit.style.fontFamily,
                scrollbarWidth: 'none',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 96)}px`;
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="
                w-10 h-10 rounded-xl bg-black text-white
                flex items-center justify-center shrink-0
                transition-all duration-200
                hover:bg-[#333] active:scale-95
                disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-black
              "
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-[10px] text-[#747878] text-center mt-2 tracking-wide">
            Powered by AI - VESTIGE
          </p>
        </div>
      </div>
    </>
  );
}
