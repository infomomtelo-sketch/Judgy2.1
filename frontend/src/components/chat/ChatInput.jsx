import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, ArrowRight, Loader2, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChatInput = ({ onSendMessage, onContinue, isLoading, hasMessages }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const { tokens, addFreeTokens } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading && tokens > 0) {
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

  const handleGetTokens = async () => {
    try {
      await addFreeTokens();
    } catch (e) {
      console.error('Failed to add tokens:', e);
    }
  };

  const isOutOfTokens = tokens <= 0;
  const isLowOnTokens = tokens > 0 && tokens <= 5;

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-sm p-4" data-testid="chat-input-container">
      <div className="max-w-3xl mx-auto">
        {/* Out of Tokens Warning */}
        {isOutOfTokens && (
          <div className="mb-4 p-4 bg-card border border-[#FFB800]/30 rounded-lg" data-testid="out-of-tokens-warning">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#FFB800] flex items-center justify-center flex-shrink-0 rounded-md">
                <Coins className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1">
                <h4 className="font-display font-bold text-foreground mb-1 uppercase">Out of Tokens</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  You need tokens to keep chatting. Get more to continue the judgment!
                </p>
                <div className="flex gap-2">
                  <Button 
                    className="bg-[#FFB800] hover:bg-[#E5A600] text-black font-bold uppercase text-sm"
                    onClick={handleGetTokens}
                    data-testid="get-tokens-btn"
                  >
                    Get Free Tokens
                  </Button>
                  <Button 
                    variant="outline"
                    className="text-sm"
                    onClick={() => navigate('/pricing')}
                    data-testid="buy-tokens-btn"
                  >
                    Buy Tokens
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Low Tokens Warning */}
        {isLowOnTokens && !isOutOfTokens && (
          <div className="flex items-center justify-center gap-3 mb-3 p-2 bg-muted border border-border rounded-md">
            <Coins className="w-4 h-4 text-[#FFB800]" />
            <span className="text-sm text-muted-foreground">
              {tokens} token{tokens > 1 ? 's' : ''} left
            </span>
            <button 
              onClick={handleGetTokens}
              className="text-sm text-[#FFB800] hover:text-foreground transition-colors font-bold uppercase"
            >
              Get More
            </button>
          </div>
        )}

        {/* Continue button */}
        {hasMessages && !isLoading && !isOutOfTokens && (
          <div className="flex justify-center mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onContinue}
              className="gap-2 hover:border-[#FF2E4C] hover:bg-[#FF2E4C]/5 text-muted-foreground hover:text-foreground uppercase tracking-wider text-xs font-bold"
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
            "flex items-end gap-2 bg-card border rounded-lg transition-colors shadow-card",
            isOutOfTokens 
              ? "border-border opacity-50" 
              : "border-border focus-within:border-[#FF2E4C]"
          )}>
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isOutOfTokens ? "Get tokens to continue..." : "Type your confession..."}
              disabled={isLoading || isOutOfTokens}
              className="flex-1 min-h-[52px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground py-4 px-4 text-sm"
              rows={1}
              data-testid="chat-input"
            />

            <div className="flex items-center gap-1 p-2">
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading || isOutOfTokens}
                className={cn(
                  "h-10 w-10 rounded-md transition-colors",
                  input.trim() && !isLoading && !isOutOfTokens
                    ? "bg-[#FF2E4C] hover:bg-[#E01F3D] text-white"
                    : "bg-muted text-muted-foreground"
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
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Enter to send — 1 token per message
            </p>
            
            {tokens > 0 && (
              <span className={cn(
                "text-[10px] uppercase tracking-wider font-bold sm:hidden",
                isLowOnTokens ? "text-[#FFB800]" : "text-muted-foreground"
              )}>
                {tokens} tokens
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
