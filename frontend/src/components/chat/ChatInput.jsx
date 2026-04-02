import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, ArrowRight, Loader2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const ChatInput = ({ onSendMessage, onContinue, isLoading, hasMessages, remainingMessages, onUpgrade }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isLimitReached = remainingMessages === 0;
  const isLowOnMessages = remainingMessages > 0 && remainingMessages <= 2;

  return (
    <div className="border-t border-zinc-800 bg-[#0D0D0D] p-4" data-testid="chat-input-container">
      <div className="max-w-3xl mx-auto">
        {/* Limit Reached Warning */}
        {isLimitReached && (
          <div className="mb-4 p-4 bg-[#141414] border border-[#FF2E4C]/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#FF2E4C] flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-display font-bold text-white mb-1 uppercase">Out of Roasts</h4>
                <p className="text-sm text-zinc-400 mb-3 font-mono">
                  You've used all your free roasts today. Upgrade to keep the judgment coming.
                </p>
                <Button 
                  className="bg-[#FF2E4C] hover:bg-[#E01F3D] text-white shadow-brutal font-bold uppercase text-sm"
                  onClick={() => navigate('/pricing')}
                  data-testid="upgrade-btn"
                >
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Low Messages Warning */}
        {isLowOnMessages && !isLimitReached && (
          <div className="flex items-center justify-center gap-3 mb-3 p-2 bg-zinc-900 border border-zinc-800">
            <Zap className="w-4 h-4 text-[#FFB800]" />
            <span className="text-sm text-zinc-400 font-mono">
              {remainingMessages} roast{remainingMessages > 1 ? 's' : ''} left
            </span>
            <button 
              onClick={() => navigate('/pricing')}
              className="text-sm text-[#FF2E4C] hover:text-white transition-colors font-bold uppercase"
            >
              Upgrade
            </button>
          </div>
        )}

        {/* Continue button */}
        {hasMessages && !isLoading && !isLimitReached && (
          <div className="flex justify-center mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onContinue}
              className="gap-2 border-zinc-700 hover:border-[#FF2E4C] hover:bg-[#FF2E4C]/10 text-zinc-400 hover:text-white uppercase tracking-wider text-xs font-bold"
              data-testid="continue-btn"
            >
              <ArrowRight className="w-4 h-4" />
              Continue
            </Button>
          </div>
        )}

        {/* Input form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className={cn(
            "flex items-end gap-2 bg-[#141414] border transition-colors",
            isLimitReached 
              ? "border-zinc-800 opacity-50" 
              : "border-zinc-800 focus-within:border-[#FF2E4C]"
          )}>
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLimitReached ? "Upgrade to continue..." : "Type your confession..."}
              disabled={isLoading || isLimitReached}
              className="flex-1 min-h-[52px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-zinc-600 py-4 px-4 font-mono text-sm"
              rows={1}
              data-testid="chat-input"
            />

            <div className="flex items-center gap-1 p-2">
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading || isLimitReached}
                className={cn(
                  "h-10 w-10 transition-colors",
                  input.trim() && !isLoading && !isLimitReached
                    ? "bg-[#FF2E4C] hover:bg-[#E01F3D] text-white shadow-brutal"
                    : "bg-zinc-800 text-zinc-600"
                )}
                data-testid="send-btn"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 px-1">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-mono">
              Enter to send • Shift+Enter for new line
            </p>
            
            {remainingMessages !== -1 && remainingMessages > 0 && (
              <span className={cn(
                "text-[10px] uppercase tracking-wider font-bold font-mono sm:hidden",
                isLowOnMessages ? "text-[#FFB800]" : "text-zinc-600"
              )}>
                {remainingMessages} left
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
