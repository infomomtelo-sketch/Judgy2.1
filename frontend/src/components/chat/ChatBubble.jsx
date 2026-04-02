import React from 'react';
import { User, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const ChatBubble = ({ message, isLast }) => {
  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <div 
      className={cn(
        "flex gap-4 animate-slide-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
      data-testid={`chat-bubble-${message.role}`}
    >
      {/* Avatar */}
      <div className={cn(
        "w-10 h-10 shrink-0 flex items-center justify-center",
        isUser 
          ? "bg-zinc-800 border border-zinc-700" 
          : "bg-[#FF2E4C]"
      )}>
        {isUser ? (
          <User className="w-5 h-5 text-zinc-400" />
        ) : (
          <Zap className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div 
        className={cn(
          "flex flex-col max-w-[85%] sm:max-w-[75%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/* Role label */}
        <span className={cn(
          "text-xs font-bold uppercase tracking-wider mb-2",
          isUser ? "text-zinc-500" : "text-[#FF2E4C]"
        )}>
          {isUser ? "you" : "judgy"}
        </span>
        
        <div 
          className={cn(
            "px-5 py-4 text-sm leading-relaxed font-mono",
            isUser 
              ? "bg-zinc-800 border border-zinc-700 text-white" 
              : isError
                ? "bg-red-500/10 border border-red-500/30 text-red-400"
                : "bg-[#141414] border border-zinc-800 text-zinc-200"
          )}
        >
          <MessageContent content={message.content} isAI={!isUser} />
        </div>
        
        {/* Timestamp */}
        <span className="text-[10px] text-zinc-600 mt-2 uppercase tracking-wider">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

const MessageContent = ({ content, isAI }) => {
  // Parse content for code blocks and formatting
  const parts = content.split(/(```[\s\S]*?```)/g);
  
  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const code = part.replace(/```(\w+)?\n?/g, '').replace(/```$/g, '');
          return (
            <pre 
              key={index} 
              className="bg-black/50 border border-zinc-800 p-3 text-xs overflow-x-auto font-mono text-[#FFB800]"
            >
              <code>{code}</code>
            </pre>
          );
        }
        
        // Handle line breaks and basic formatting
        return (
          <div key={index} className="whitespace-pre-wrap">
            {formatText(part, isAI)}
          </div>
        );
      })}
    </div>
  );
};

const formatText = (text, isAI) => {
  // Handle numbered lists
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Check for numbered list items
    const numberedMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (numberedMatch) {
      return (
        <div key={i} className="flex gap-2 my-1">
          <span className={cn("font-bold min-w-[1.5rem]", isAI ? "text-[#FF2E4C]" : "text-zinc-500")}>
            {numberedMatch[1]}.
          </span>
          <span>{formatInlineText(numberedMatch[2], isAI)}</span>
        </div>
      );
    }
    
    // Check for bullet points
    const bulletMatch = line.match(/^[-•]\s+(.+)/);
    if (bulletMatch) {
      return (
        <div key={i} className="flex gap-2 my-1">
          <span className={cn(isAI ? "text-[#FF2E4C]" : "text-zinc-500")}>▸</span>
          <span>{formatInlineText(bulletMatch[1], isAI)}</span>
        </div>
      );
    }
    
    return <span key={i}>{formatInlineText(line, isAI)}{i < lines.length - 1 ? '\n' : ''}</span>;
  });
};

const formatInlineText = (text, isAI) => {
  // Handle bold text **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className={cn("font-bold", isAI ? "text-[#FFB800]" : "text-white")}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

export default ChatBubble;
