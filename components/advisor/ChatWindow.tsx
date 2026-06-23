'use client';

import { useState } from 'react';
import { Bot, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatBubble } from '@/components/advisor/ChatBubble';
import { useAiChat } from '@/lib/hooks';
import { cn } from '@/lib/utils';

type Message = { role: 'user' | 'ai'; text: string };

const QUICK_PROMPTS = {
  en: [
    'How can I save more this month?',
    'Where am I overspending?',
    'Help me set a food budget',
  ],
  ur: [
    'Is month zyada bachat kaise karun?',
    'Zayada kharch kahan ho raha hai?',
    'Food budget set karne mein madad karo',
  ],
};

// AI chat interface with bilingual RTL support
export function ChatWindow() {
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const chat = useAiChat();
  const isUrdu = language === 'ur';

  const sendMessage = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setInput('');
    chat.mutate(
      { message: msg, language },
      {
        onSuccess: (res) =>
          setMessages((prev) => [...prev, { role: 'ai', text: res.data.data.reply }]),
        onError: () =>
          setMessages((prev) => [
            ...prev,
            {
              role: 'ai',
              text: isUrdu
                ? 'Maaf kijiye, abhi jawab nahi de sakta. Thodi der baad try karein.'
                : 'Sorry, I could not respond right now. Please try again in a moment.',
            },
          ]),
      },
    );
  };

  return (
    <div
      className={cn(
        'flex h-[520px] flex-col overflow-hidden rounded-3xl bg-card shadow-card transition-shadow duration-200 hover:shadow-card-hover',
        isUrdu && 'font-serif',
      )}
    >
      <div className="flex items-center justify-between border-b border-border/60 bg-surface/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
            <Bot size={16} className="text-primary" />
          </div>
          <span className="text-sm font-semibold text-gray-900">Chat with HisaabAI</span>
        </div>
        <div className="flex gap-1 rounded-xl bg-surface p-1">
          {(['en', 'ur'] as const).map((lang) => (
            <Button
              key={lang}
              type="button"
              size="xs"
              variant={language === lang ? 'default' : 'ghost'}
              className={cn('min-w-[52px] rounded-lg', language !== lang && 'shadow-none')}
              onClick={() => setLanguage(lang)}
            >
              {lang === 'en' ? 'EN' : 'اردو'}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Bot size={26} className="text-primary" />
            </div>
            <p className="font-medium text-gray-900">
              {isUrdu ? 'Apne kharchay ke bare mein poochhein' : 'Ask about your spending'}
            </p>
            <p className="mt-1 max-w-xs text-xs text-muted">
              {isUrdu
                ? 'Budget, bachat, ya category ke tips — kuch bhi pooch sakte hain'
                : 'Get advice on budgets, savings, or category-specific tips'}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {QUICK_PROMPTS[language].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <ChatBubble key={i} message={msg.text} role={msg.role} rtl={isUrdu} />
          ))
        )}
        {chat.isPending && (
          <p className="text-sm text-muted">{isUrdu ? 'جواب لکھ رہے ہیں...' : 'AI is typing...'}</p>
        )}
      </div>

      <div className="flex gap-2 border-t border-border/60 bg-surface/30 p-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isUrdu ? 'اپنا سوال لکھیں...' : 'Ask about your spending...'}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          dir={isUrdu ? 'rtl' : 'ltr'}
          className="rounded-xl border-border/60 bg-white"
        />
        <Button onClick={() => sendMessage()} disabled={chat.isPending || !input.trim()} className="gap-1.5 rounded-xl">
          <Send size={16} /> Send
        </Button>
      </div>
    </div>
  );
}
