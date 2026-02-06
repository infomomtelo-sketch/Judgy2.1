import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquarePlus, PanelRightOpen, PanelRightClose, Sparkles, User, LogOut, Crown, CreditCard, Zap } from 'lucide-react';

const ChatHeader = ({ onNewChat, onToggleTools, isMobileToolsOpen, remainingMessages, isPro }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

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
        {/* Message Counter for Free Users */}
        {!isPro && remainingMessages !== -1 && (
          <Badge 
            variant="secondary" 
            className="hidden sm:flex gap-1 px-3 py-1 cursor-pointer hover:bg-secondary/80"
            onClick={() => navigate('/pricing')}
          >
            <Zap className="w-3 h-3" />
            {remainingMessages} left today
          </Badge>
        )}

        {/* Pro Badge */}
        {isPro && (
          <Badge className="hidden sm:flex gap-1 gradient-primary text-primary-foreground px-3 py-1">
            <Crown className="w-3 h-3" />
            Pro
          </Badge>
        )}

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

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => navigate('/pricing')} className="cursor-pointer">
              <CreditCard className="w-4 h-4 mr-2" />
              {isPro ? 'Manage Subscription' : 'Upgrade to Pro'}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default ChatHeader;
