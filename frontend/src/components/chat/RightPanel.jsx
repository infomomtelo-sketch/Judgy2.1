import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { X, Users, Eye, UserPlus, Sparkles, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock witnesses data - in a real app, this would come from backend
const MOCK_WITNESSES = [
  { id: 1, name: 'Sarah M.', status: 'watching', reactions: '😂' },
  { id: 2, name: 'Mike R.', status: 'watching', reactions: '🔥' },
  { id: 3, name: 'Jenny L.', status: 'away', reactions: '' },
];

const RightPanel = ({ isOpen, onClose }) => {
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
          "fixed right-0 top-0 h-full w-72 bg-sidebar-bg border-l border-sidebar-border z-50",
          "transform transition-transform duration-300 ease-in-out",
          "lg:relative lg:transform-none",
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0 lg:w-0 lg:border-0 lg:overflow-hidden"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              <h2 className="font-medium text-foreground">Witnesses</h2>
              <Badge variant="secondary" className="text-xs">
                {MOCK_WITNESSES.filter(w => w.status === 'watching').length}
              </Badge>
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

          {/* Witnesses List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {MOCK_WITNESSES.map((witness) => (
                <WitnessCard key={witness.id} witness={witness} />
              ))}
            </div>

            {/* Empty State / Coming Soon */}
            <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium text-foreground mb-1">Witness Feature</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Coming soon! Invite friends to witness your conversations and react in real-time.
              </p>
              <Badge variant="secondary" className="text-xs">
                <Crown className="w-3 h-3 mr-1" />
                Premium Feature
              </Badge>
            </div>
          </div>

          {/* Invite Button */}
          <div className="p-4 border-t border-sidebar-border">
            <Button 
              className="w-full" 
              variant="outline"
              disabled
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Witness
            </Button>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              $2.99 per extra invite
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

const WitnessCard = ({ witness }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="relative">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
            {getInitials(witness.name)}
          </AvatarFallback>
        </Avatar>
        {/* Status indicator */}
        <div className={cn(
          "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-sidebar-bg",
          witness.status === 'watching' ? 'bg-success' : 'bg-muted-foreground'
        )} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{witness.name}</p>
        <p className="text-xs text-muted-foreground">
          {witness.status === 'watching' ? 'Watching 👀' : 'Away'}
        </p>
      </div>

      {witness.reactions && (
        <span className="text-lg">{witness.reactions}</span>
      )}
    </div>
  );
};

export default RightPanel;
