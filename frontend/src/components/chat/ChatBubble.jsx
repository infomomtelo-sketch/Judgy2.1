import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const ChatBubble = ({ message, isLast }) => {
  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <div 
      className={cn(
        "flex gap-3 animate-slide-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <Avatar className={cn(
        "w-8 h-8 shrink-0",
        isUser 
          ? "bg-primary shadow-sm" 
          : "gradient-primary shadow-glow"
      )}>
        <AvatarFallback className={cn(
          "text-sm font-medium",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-transparent text-primary-foreground"
        )}>
          {isUser ? (
            <User className="w-4 h-4" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div 
        className={cn(
          "flex flex-col max-w-[85%] sm:max-w-[75%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div 
          className={cn(
            "px-4 py-3 rounded-2xl text-sm leading-relaxed",
            isUser 
              ? "bg-primary text-primary-foreground rounded-br-md" 
              : isError
                ? "bg-destructive/10 text-destructive border border-destructive/20 rounded-bl-md"
                : "bg-chat-ai border border-chat-ai-border text-foreground rounded-bl-md"
          )}
        >
          <MessageContent content={message.content} />
        </div>
        
        {/* Timestamp */}
        <span className="text-[10px] text-muted-foreground mt-1 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

const MessageContent = ({ content }) => {
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
              className="bg-background/50 rounded-lg p-3 text-xs overflow-x-auto font-mono"
            >
              <code>{code}</code>
            </pre>
          );
        }
        
        // Handle line breaks and basic formatting
        return (
          <div key={index} className="whitespace-pre-wrap">
            {formatText(part)}
          </div>
        );
      })}
    </div>
  );
};

const formatText = (text) => {
  // Handle numbered lists
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Check for numbered list items
    const numberedMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (numberedMatch) {
      return (
        <div key={i} className="flex gap-2 my-1">
          <span className="font-semibold text-primary min-w-[1.5rem]">
            {numberedMatch[1]}.
          </span>
          <span>{formatInlineText(numberedMatch[2])}</span>
        </div>
      );
    }
    
    // Check for bullet points
    const bulletMatch = line.match(/^[-•]\s+(.+)/);
    if (bulletMatch) {
      return (
        <div key={i} className="flex gap-2 my-1">
          <span className="text-primary">•</span>
          <span>{formatInlineText(bulletMatch[1])}</span>
        </div>
      );
    }
    
    return <span key={i}>{formatInlineText(line)}{i < lines.length - 1 ? '\n' : ''}</span>;
  });
};

const formatInlineText = (text) => {
  // Handle bold text **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
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
