import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, ArrowRight, Loader2, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../context/AuthContext';

const ChatInput = ({ onSendMessage, onContinue, isLoading, hasMessages }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const { tokens, addFreeTokens } = useAuth();

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
    <div className="border-t border-zinc-800 bg-[#0D0D0D] p-4" data-testid="chat-input-container">
      <div className="max-w-3xl mx-auto">
        {/* Out of Tokens Warning */}
        {isOutOfTokens && (
          <div className="mb-4 p-4 bg-[#141414] border border-[#FFB800]/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#FFB800] flex items-center justify-center flex-shrink-0">
                <Coins className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1">
                <h4 className="font-display font-bold text-white mb-1 uppercase">Out of Tokens</h4>
                <p className="text-sm text-zinc-400 mb-3 font-mono">
                  You need tokens to keep chatting. Get more to continue!
                </p>
                <Button 
                  className="bg-[#FFB800] hover:bg-[#E5A600] text-black shadow-brutal-yellow font-bold uppercase text-sm"
                  onClick={handleGetTokens}
                  data-testid="get-tokens-btn"
                >
                  Get Free Tokens
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Low Tokens Warning */}
        {isLowOnTokens && !isOutOfTokens && (
          <div className="flex items-center justify-center gap-3 mb-3 p-2 bg-zinc-900 border border-zinc-800">
            <Coins className="w-4 h-4 text-[#FFB800]" />
            <span className="text-sm text-zinc-400 font-mono">
              {tokens} token{tokens > 1 ? 's' : ''} left
            </span>
            <button 
              onClick={handleGetTokens}
              className="text-sm text-[#FFB800] hover:text-white transition-colors font-bold uppercase"
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
            isOutOfTokens 
              ? "border-zinc-800 opacity-50" 
              : "border-zinc-800 focus-within:border-[#FF2E4C]"
          )}>
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isOutOfTokens ? "Get tokens to continue..." : "Type your confession..."}
              disabled={isLoading || isOutOfTokens}
              className="flex-1 min-h-[52px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-zinc-600 py-4 px-4 font-mono text-sm"
              rows={1}
              data-testid="chat-input"
            />

            <div className="flex items-center gap-1 p-2">
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading || isOutOfTokens}
                className={cn(
                  "h-10 w-10 transition-colors",
                  input.trim() && !isLoading && !isOutOfTokens
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
              Enter to send • 1 token per message
            </p>
            
            {tokens > 0 && (
              <span className={cn(
                "text-[10px] uppercase tracking-wider font-bold font-mono sm:hidden",
                isLowOnTokens ? "text-[#FFB800]" : "text-zinc-600"
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
