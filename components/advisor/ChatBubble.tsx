import { cn } from '@/lib/utils';

// Single chat message bubble for user or AI
export function ChatBubble({
  message,
  role,
  rtl = false,
}: {
  message: string;
  role: 'user' | 'ai';
  rtl?: boolean;
}) {
  const userSide = rtl ? 'justify-start' : 'justify-end';
  const aiSide = rtl ? 'justify-end' : 'justify-start';

  return (
    <div className={cn('flex', role === 'user' ? userSide : aiSide)}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm',
          role === 'user'
            ? cn('bg-primary text-white', rtl ? 'rounded-tl-md' : 'rounded-tr-md')
            : cn('border border-border/60 bg-white text-gray-900', rtl ? 'rounded-tr-md' : 'rounded-tl-md'),
        )}
      >
        {message}
      </div>
    </div>
  );
}
