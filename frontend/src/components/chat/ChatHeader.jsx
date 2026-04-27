import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MessageSquarePlus, 
  PanelLeftOpen,
  PanelLeftClose,
  PanelRightClose, 
  LogOut, 
  Zap,
  Users,
  Home,
  Share2,
  CreditCard,
  TrendingUp,
  Coins,
  Sun,
  Moon
} from 'lucide-react';

const ChatHeader = ({ onNewChat, onToggleLeft, onToggleRight, leftPanelOpen, rightPanelOpen, remainingMessages, isPremium }) => {
  const { user, logout, isFullDrama, tokens, addFreeTokens } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'The Judgy - Brutally Honest AI',
        text: 'Get roasted and guided by The Judgy!',
        url: 'https://thejudgy.com'
      });
    } else {
      navigator.clipboard.writeText('https://thejudgy.com');
      alert('Link copied!');
    }
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
    <header className="flex items-center justify-between px-4 py-3 glass-header" data-testid="chat-header">
      {/* Left Controls */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleLeft}
          className="text-muted-foreground hover:text-foreground hover:bg-muted"
          data-testid="toggle-left-panel"
        >
          {leftPanelOpen ? (
            <PanelLeftClose className="w-5 h-5" />
          ) : (
            <PanelLeftOpen className="w-5 h-5" />
          )}
        </Button>
        
        <Link to="/">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
            title="Home"
            data-testid="home-btn"
          >
            <Home className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* Center - Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#FF2E4C] flex items-center justify-center rounded-sm">
          <span className="font-display font-bold text-xl text-white">J</span>
        </div>
        <div className="text-center hidden sm:block">
          <h1 className="font-display text-lg font-bold text-foreground tracking-tight">THE JUDGY</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Brutal Honesty</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground hover:bg-muted"
          data-testid="theme-toggle"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {/* Token Counter */}
        <button 
          onClick={async () => {
            if (tokens <= 5) {
              try {
                await addFreeTokens();
              } catch (e) {
                console.error(e);
              }
            }
          }}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted border border-border hover:border-[#FFB800] transition-colors rounded-md"
          data-testid="token-counter"
          title={tokens <= 5 ? "Click to get free tokens" : "Your token balance"}
        >
          <Coins className="w-3 h-3 text-[#FFB800]" />
          <span className="text-sm font-bold text-foreground">{tokens}</span>
          <span className="text-xs text-muted-foreground uppercase">tokens</span>
        </button>

        <Button 
          variant="ghost" 
          size="icon"
          onClick={onNewChat}
          className="text-muted-foreground hover:text-foreground hover:bg-muted"
          title="New Chat"
          data-testid="new-chat-btn"
        >
          <MessageSquarePlus className="w-5 h-5" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleShare}
          className="text-muted-foreground hover:text-foreground hover:bg-muted hidden sm:flex"
          title="Share"
          data-testid="share-btn"
        >
          <Share2 className="w-5 h-5" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleRight}
          className="text-muted-foreground hover:text-foreground hover:bg-muted"
          title="Toggle Witnesses"
          data-testid="toggle-right-panel"
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
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted" data-testid="user-menu-trigger">
              <div className="w-8 h-8 bg-muted border border-border flex items-center justify-center rounded-md">
                <span className="text-xs font-bold text-foreground">{getInitials(user?.name)}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-card border-border text-card-foreground">
            <DropdownMenuLabel className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF2E4C] flex items-center justify-center rounded-sm">
                  <span className="text-sm font-bold text-white">{getInitials(user?.name)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            
            {/* Token Info */}
            <div className="px-2 py-2 mx-2 mb-2 bg-muted border border-border rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase">Tokens</span>
                <span className="text-xs font-bold text-[#FFB800]">{tokens}</span>
              </div>
            </div>
            
            <DropdownMenuSeparator className="bg-border" />
            
            <DropdownMenuItem onClick={() => navigate('/')} className="cursor-pointer text-card-foreground hover:bg-muted focus:bg-muted">
              <Home className="w-4 h-4 mr-2" />
              Home
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate('/pricing')} className="cursor-pointer text-card-foreground hover:bg-muted focus:bg-muted">
              <CreditCard className="w-4 h-4 mr-2" />
              Get Tokens
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate('/tools')} className="cursor-pointer text-card-foreground hover:bg-muted focus:bg-muted">
              <Zap className="w-4 h-4 mr-2" />
              Viral Tools
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate('/growth')} className="cursor-pointer text-card-foreground hover:bg-muted focus:bg-muted">
              <TrendingUp className="w-4 h-4 mr-2" />
              Growth Hub
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-border" />
            
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10">
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
