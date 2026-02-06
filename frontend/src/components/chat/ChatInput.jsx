import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Mic, ArrowRight, Loader2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const ChatInput = ({ onSendMessage, onContinue, isLoading, hasMessages, remainingMessages, onUpgrade }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
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

  return (
    <div className="border-t border-border bg-card/80 backdrop-blur-sm p-4">
      <div className="max-w-3xl mx-auto">
        {/* Limit Warning */}
        {isLimitReached && (
          <div className="flex items-center justify-center gap-2 mb-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <Zap className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">Daily limit reached.</span>
            <Button 
              variant="link" 
              size="sm" 
              className="text-primary p-0 h-auto"
              onClick={onUpgrade}
            >
              Upgrade to Pro
            </Button>
          </div>
        )}

        {/* Continue button */}
        {hasMessages && !isLoading && !isLimitReached && (
          <div className="flex justify-center mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onContinue}
              className="gap-2 text-primary border-primary/30 hover:bg-primary/5 hover:border-primary/50"
            >
              <ArrowRight className="w-4 h-4" />
              Continue
            </Button>
          </div>
        )}

        {/* Input form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className={cn(
            "flex items-end gap-2 p-2 rounded-2xl border bg-background shadow-sm transition-all duration-200",
            isLimitReached 
              ? "border-destructive/30 bg-destructive/5" 
              : "border-border focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50"
          )}>
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLimitReached ? "Upgrade to continue chatting..." : "Ask me anything..."}
              disabled={isLoading || isLimitReached}
              className="flex-1 min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground py-3 px-2"
              rows={1}
            />

            <div className="flex items-center gap-1 pb-1">
              {/* Mic button (inactive) */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled
                className="h-10 w-10 rounded-xl text-muted-foreground/50 cursor-not-allowed"
                title="Voice input coming soon"
              >
                <Mic className="w-5 h-5" />
              </Button>

              {/* Send button */}
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading || isLimitReached}
                className={cn(
                  "h-10 w-10 rounded-xl transition-all duration-200",
                  input.trim() && !isLoading && !isLimitReached
                    ? "gradient-primary shadow-glow hover:shadow-lg"
                    : "bg-muted text-muted-foreground"
                )}
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
            <p className="text-[10px] text-muted-foreground">
              Press Enter to send, Shift + Enter for new line
            </p>
            
            {/* Mobile message counter */}
            {remainingMessages !== -1 && remainingMessages > 0 && (
              <Badge variant="secondary" className="sm:hidden text-[10px] px-2 py-0">
                {remainingMessages} left
              </Badge>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
