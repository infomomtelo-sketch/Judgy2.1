import React from 'react';
import { Zap } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex gap-4 animate-fade-in">
      <div className="w-10 h-10 shrink-0 bg-[#FF2E4C] flex items-center justify-center rounded-sm">
        <Zap className="w-5 h-5 text-white" />
      </div>

      <div className="flex items-center gap-1.5 px-5 py-4 bg-card border border-border rounded-lg shadow-card">
        <div className="w-2 h-2 rounded-full bg-[#FF2E4C]/60 animate-bounce-soft" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-[#FF2E4C]/60 animate-bounce-soft" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-[#FF2E4C]/60 animate-bounce-soft" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};

export default TypingIndicator;
