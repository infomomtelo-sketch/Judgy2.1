import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { X, User, Crown, Zap, Calendar, MessageSquare, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const LeftPanel = ({ isOpen, onClose, user, subscription }) => {
  const navigate = useNavigate();

  const getPlanName = () => {
    switch (user?.subscription_plan) {
      case 'premium': return 'Bring the Whole Drama';
      case 'standard': return 'Talk to Me Nice';
      default: return 'Judgement Lite';
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
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full w-72 bg-sidebar-bg border-r border-sidebar-border z-50",
          "transform transition-transform duration-300 ease-in-out",
          "lg:relative lg:transform-none",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:border-0 lg:overflow-hidden"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <h2 className="font-medium text-foreground">Your Profile</h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-20 h-20 mb-3 border-4 border-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xl font-bold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg text-foreground">{user?.name}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              
              <Badge className="mt-3 px-4 py-1" variant={user?.subscription_plan === 'premium' ? 'default' : 'secondary'}>
                {user?.subscription_plan === 'premium' && <Crown className="w-3 h-3 mr-1" />}
                {getPlanName()}
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="px-4 pb-4">
            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Stats</h4>
              
              {subscription?.remaining_messages !== -1 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">Roasts left</span>
                  </div>
                  <span className="font-semibold text-foreground">{subscription?.remaining_messages || 0}</span>
                </div>
              )}

              {subscription?.remaining_messages === -1 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">Roasts</span>
                  </div>
                  <span className="font-semibold text-primary">Unlimited 💅</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-accent" />
                  <span className="text-sm text-foreground">History</span>
                </div>
                <span className="font-semibold text-foreground">{subscription?.plan?.limits?.history_days || 1} days</span>
              </div>
            </div>
          </div>

          {/* Upgrade CTA */}
          {user?.subscription_plan === 'free' && (
            <div className="px-4 mt-auto pb-4">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-4">
                <h4 className="font-medium text-foreground mb-1">Want more sass?</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Upgrade for unlimited roasts and full drama access.
                </p>
                <Button 
                  className="w-full gradient-primary"
                  size="sm"
                  onClick={() => navigate('/pricing')}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border mt-auto">
            <p className="text-xs text-muted-foreground text-center">
              Member since {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default LeftPanel;
