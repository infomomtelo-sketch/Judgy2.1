import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sparkles } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex gap-3 animate-fade-in">
      <Avatar className="w-8 h-8 shrink-0 gradient-primary shadow-glow">
        <AvatarFallback className="bg-transparent text-primary-foreground">
          <Sparkles className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex items-center gap-1 px-4 py-3 bg-chat-ai border border-chat-ai-border rounded-2xl rounded-bl-md">
        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce-soft" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce-soft" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce-soft" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};

export default TypingIndicator;
