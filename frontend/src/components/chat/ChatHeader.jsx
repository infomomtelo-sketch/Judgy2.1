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
import { 
  MessageSquarePlus, 
  PanelRightOpen, 
  PanelRightClose, 
  Sparkles, 
  LogOut, 
  Crown, 
  CreditCard, 
  Zap,
  Building,
  Settings,
  HelpCircle
} from 'lucide-react';

const ChatHeader = ({ onNewChat, onToggleTools, isMobileToolsOpen, remainingMessages, isPro }) => {
  const { user, logout, isEnterprise } = useAuth();
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

  const getPlanBadge = () => {
    if (isEnterprise) {
      return (
        <Badge className="hidden sm:flex gap-1 bg-gradient-to-r from-accent to-success text-accent-foreground px-3 py-1">
          <Building className="w-3 h-3" />
          Enterprise
        </Badge>
      );
    }
    if (isPro) {
      return (
        <Badge className="hidden sm:flex gap-1 gradient-primary text-primary-foreground px-3 py-1">
          <Crown className="w-3 h-3" />
          Pro
        </Badge>
      );
    }
    return null;
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
        {!isPro && !isEnterprise && remainingMessages !== -1 && (
          <Badge 
            variant="secondary" 
            className="hidden sm:flex gap-1 px-3 py-1 cursor-pointer hover:bg-secondary/80 transition-colors"
            onClick={() => navigate('/pricing')}
          >
            <Zap className="w-3 h-3 text-primary" />
            <span className="font-medium">{remainingMessages}</span>
            <span className="text-muted-foreground">left today</span>
          </Badge>
        )}

        {/* Plan Badge */}
        {getPlanBadge()}

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
              <Avatar className="w-8 h-8 border-2 border-primary/20">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="pb-2">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            
            {/* Current Plan Info */}
            <div className="px-2 py-2 mx-2 mb-2 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Current Plan</span>
                <Badge variant="secondary" className="text-xs capitalize">
                  {user?.subscription_plan || 'Free'}
                </Badge>
              </div>
              {!isPro && !isEnterprise && remainingMessages !== -1 && (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">Messages today</span>
                  <span className="text-xs font-medium">{remainingMessages}/5</span>
                </div>
              )}
            </div>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => navigate('/pricing')} className="cursor-pointer">
              <CreditCard className="w-4 h-4 mr-2" />
              {isPro || isEnterprise ? 'Manage Subscription' : 'Upgrade to Pro'}
              {!isPro && !isEnterprise && (
                <Badge variant="secondary" className="ml-auto text-xs bg-primary/10 text-primary">
                  Popular
                </Badge>
              )}
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
