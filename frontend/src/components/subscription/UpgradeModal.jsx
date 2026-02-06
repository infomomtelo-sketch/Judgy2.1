import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Zap, MessageCircle, History, Sparkles } from 'lucide-react';

const UpgradeModal = ({ isOpen, onClose, onUpgrade }) => {
  const benefits = [
    { icon: <MessageCircle className="w-4 h-4" />, text: 'Unlimited messages' },
    { icon: <Zap className="w-4 h-4" />, text: 'Priority AI responses' },
    { icon: <History className="w-4 h-4" />, text: 'Full chat history' },
    { icon: <Sparkles className="w-4 h-4" />, text: 'Advanced features' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl gradient-primary shadow-glow flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl font-display">
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription className="text-base">
            You&apos;ve reached your daily message limit. Upgrade to Pro for unlimited access.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {benefit.icon}
                </div>
                <span className="text-sm font-medium text-foreground">{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <p className="text-2xl font-bold text-foreground">
              $9.99<span className="text-sm font-normal text-muted-foreground">/month</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">Cancel anytime</p>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button 
            className="w-full gradient-primary hover:opacity-90"
            onClick={onUpgrade}
          >
            Upgrade Now
          </Button>
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={onClose}
          >
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
