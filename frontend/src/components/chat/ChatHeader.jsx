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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquarePlus, 
  PanelLeftOpen,
  PanelLeftClose,
  PanelRightOpen, 
  PanelRightClose, 
  LogOut, 
  Crown, 
  CreditCard, 
  Zap,
  Drama,
  Users
} from 'lucide-react';

// JudgyGPT Logo Image
const JUDGY_LOGO = "https://customer-assets.emergentagent.com/job_chat-assist-26/artifacts/ze789p6s_7DEC28F8-D66A-46B0-99EA-84F4FF846DBB.png";

const ChatHeader = ({ onNewChat, onToggleLeft, onToggleRight, leftPanelOpen, rightPanelOpen, remainingMessages, isPremium }) => {
  const { user, logout, isFullDrama } = useAuth();
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
    if (isFullDrama) {
      return (
        <Badge className="hidden sm:flex gap-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1">
          <Drama className="w-3 h-3" />
          Full Drama
        </Badge>
      );
    }
    if (isPremium) {
      return (
        <Badge className="hidden sm:flex gap-1 gradient-primary text-primary-foreground px-3 py-1">
          <Crown className="w-3 h-3" />
          Talk to Me Nice
        </Badge>
      );
    }
    return null;
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
      {/* Left Toggle */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleLeft}
          className="text-muted-foreground hover:text-foreground"
        >
          {leftPanelOpen ? (
            <PanelLeftClose className="w-5 h-5" />
          ) : (
            <PanelLeftOpen className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Center - Logo with Image */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary shadow-glow bg-gradient-to-br from-primary/20 to-accent/20">
          <img 
            src={JUDGY_LOGO} 
            alt="JudgyGPT" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center">
          <h1 className="font-display text-lg font-semibold text-foreground">JudgyGPT</h1>
          <p className="text-xs text-muted-foreground">Sassy advice, real help 💅</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Message Counter for Free Users */}
        {!isPremium && remainingMessages !== -1 && (
          <Badge 
            variant="secondary" 
            className="hidden sm:flex gap-1 px-3 py-1 cursor-pointer hover:bg-secondary/80 transition-colors"
            onClick={() => navigate('/pricing')}
          >
            <Zap className="w-3 h-3 text-primary" />
            <span className="font-medium">{remainingMessages}</span>
            <span className="text-muted-foreground">left</span>
          </Badge>
        )}

        {/* Plan Badge */}
        {getPlanBadge()}

        <Button 
          variant="ghost" 
          size="icon"
          onClick={onNewChat}
          className="text-muted-foreground hover:text-foreground"
          title="New Chat"
        >
          <MessageSquarePlus className="w-5 h-5" />
        </Button>

        {/* Right Panel Toggle */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleRight}
          className="text-muted-foreground hover:text-foreground"
          title="Toggle Witnesses"
        >
          {rightPanelOpen ? (
            <PanelRightClose className="w-5 h-5" />
          ) : (
            <Users className="w-5 h-5" />
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
                <Badge variant="secondary" className="text-xs">
                  {user?.subscription_plan === 'premium' ? 'Full Drama' : 
                   user?.subscription_plan === 'standard' ? 'Talk to Me Nice' : 'Judgement Lite'}
                </Badge>
              </div>
              {!isPremium && remainingMessages !== -1 && (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">Roasts today</span>
                  <span className="text-xs font-medium">{remainingMessages} left</span>
                </div>
              )}
            </div>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => navigate('/pricing')} className="cursor-pointer">
              <CreditCard className="w-4 h-4 mr-2" />
              {isPremium ? 'Manage Plan' : 'Upgrade'}
              {!isPremium && (
                <Badge variant="secondary" className="ml-auto text-xs bg-primary/10 text-primary">
                  More sass
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
