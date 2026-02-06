import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const ChatInput = ({ onSendMessage, onContinue, isLoading, hasMessages }) => {
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

  return (
    <div className="border-t border-border bg-card/80 backdrop-blur-sm p-4">
      <div className="max-w-3xl mx-auto">
        {/* Continue button */}
        {hasMessages && !isLoading && (
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
          <div className="flex items-end gap-2 p-2 rounded-2xl border border-border bg-background shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all duration-200">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={isLoading}
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
                disabled={!input.trim() || isLoading}
                className={cn(
                  "h-10 w-10 rounded-xl transition-all duration-200",
                  input.trim() && !isLoading
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

          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Press Enter to send, Shift + Enter for new line
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
