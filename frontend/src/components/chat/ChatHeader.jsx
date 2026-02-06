import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, PanelRightOpen, PanelRightClose, Sparkles } from 'lucide-react';

const ChatHeader = ({ onNewChat, onToggleTools, isMobileToolsOpen }) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary shadow-glow">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-lg font-semibold text-foreground">AI Assistant</h1>
          <p className="text-xs text-muted-foreground">Step-by-step guidance</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onNewChat}
          className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>New Chat</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onNewChat}
          className="sm:hidden text-muted-foreground hover:text-foreground"
        >
          <MessageSquarePlus className="w-5 h-5" />
        </Button>

        {/* Mobile tools toggle */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleTools}
          className="lg:hidden text-muted-foreground hover:text-foreground"
        >
          {isMobileToolsOpen ? (
            <PanelRightClose className="w-5 h-5" />
          ) : (
            <PanelRightOpen className="w-5 h-5" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;
