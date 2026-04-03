import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  PanelRightOpen, 
  PanelRightClose, 
  LogOut, 
  Zap,
  Users,
  Home,
  Share2,
  CreditCard,
  TrendingUp
} from 'lucide-react';

import { Coins } from 'lucide-react';

const ChatHeader = ({ onNewChat, onToggleLeft, onToggleRight, leftPanelOpen, rightPanelOpen, remainingMessages, isPremium }) => {
  const { user, logout, isFullDrama, tokens, addFreeTokens } = useAuth();
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
    <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-[#0D0D0D]" data-testid="chat-header">
      {/* Left Controls */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleLeft}
          className="text-zinc-500 hover:text-white hover:bg-zinc-800"
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
            className="text-zinc-500 hover:text-white hover:bg-zinc-800"
            title="Home"
            data-testid="home-btn"
          >
            <Home className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* Center - Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#FF2E4C] flex items-center justify-center">
          <span className="font-display font-black text-xl text-white">J</span>
        </div>
        <div className="text-center hidden sm:block">
          <h1 className="font-display text-lg font-bold text-white tracking-tight">THE JUDGY</h1>
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Brutal Honesty</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Token Counter */}
        <button 
          onClick={async () => {
            if (tokens <= 5) {
              // Add free tokens for now (will be replaced with purchase flow)
              try {
                await addFreeTokens();
              } catch (e) {
                console.error(e);
              }
            }
          }}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border border-zinc-700 hover:border-[#FFB800] transition-colors"
          data-testid="token-counter"
          title={tokens <= 5 ? "Click to get free tokens" : "Your token balance"}
        >
          <Coins className="w-3 h-3 text-[#FFB800]" />
          <span className="text-sm font-bold text-white">{tokens}</span>
          <span className="text-xs text-zinc-500 uppercase">tokens</span>
        </button>

        <Button 
          variant="ghost" 
          size="icon"
          onClick={onNewChat}
          className="text-zinc-500 hover:text-white hover:bg-zinc-800"
          title="New Chat"
          data-testid="new-chat-btn"
        >
          <MessageSquarePlus className="w-5 h-5" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleShare}
          className="text-zinc-500 hover:text-white hover:bg-zinc-800 hidden sm:flex"
          title="Share"
          data-testid="share-btn"
        >
          <Share2 className="w-5 h-5" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleRight}
          className="text-zinc-500 hover:text-white hover:bg-zinc-800"
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
            <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white hover:bg-zinc-800" data-testid="user-menu-trigger">
              <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{getInitials(user?.name)}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-[#141414] border-zinc-800 text-white">
            <DropdownMenuLabel className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF2E4C] flex items-center justify-center">
                  <span className="text-sm font-bold">{getInitials(user?.name)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{user?.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            
            {/* Current Plan Info */}
            <div className="px-2 py-2 mx-2 mb-2 bg-zinc-900 border border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 uppercase">Plan</span>
                <span className="text-xs font-bold text-[#FF2E4C]">
                  {user?.subscription_plan === 'premium' ? 'Full Drama' : 
                   user?.subscription_plan === 'standard' ? 'Standard' : 'Free'}
                </span>
              </div>
              {!isPremium && remainingMessages !== -1 && (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-zinc-500 uppercase">Roasts</span>
                  <span className="text-xs font-bold text-white">{remainingMessages} left</span>
                </div>
              )}
            </div>
            
            <DropdownMenuSeparator className="bg-zinc-800" />
            
            <DropdownMenuItem onClick={() => navigate('/')} className="cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800">
              <Home className="w-4 h-4 mr-2" />
              Home
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate('/pricing')} className="cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800">
              <CreditCard className="w-4 h-4 mr-2" />
              {isPremium ? 'Manage Plan' : 'Upgrade'}
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate('/tools')} className="cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800">
              <Zap className="w-4 h-4 mr-2" />
              Viral Tools
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate('/growth')} className="cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800">
              <TrendingUp className="w-4 h-4 mr-2" />
              Growth Hub
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-zinc-800" />
            
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-[#FF2E4C] hover:text-white hover:bg-[#FF2E4C] focus:bg-[#FF2E4C] focus:text-white">
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
