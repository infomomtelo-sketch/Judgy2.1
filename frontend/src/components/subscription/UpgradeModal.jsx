import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, MessageSquare, History, Sparkles, Infinity, Headphones, Check } from 'lucide-react';

const UpgradeModal = ({ isOpen, onClose, onUpgrade }) => {
  const navigate = useNavigate();

  const benefits = [
    { icon: <Infinity className="w-5 h-5" />, text: 'Unlimited messages', highlight: true },
    { icon: <Zap className="w-5 h-5" />, text: 'Priority AI responses' },
    { icon: <History className="w-5 h-5" />, text: '30-day chat history' },
    { icon: <Headphones className="w-5 h-5" />, text: 'Email support' },
    { icon: <Sparkles className="w-5 h-5" />, text: 'Advanced formatting' },
  ];

  const handleUpgrade = () => {
    onClose();
    navigate('/pricing');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto w-20 h-20 rounded-2xl gradient-primary shadow-glow flex items-center justify-center mb-4">
            <Crown className="w-10 h-10 text-primary-foreground" />
          </div>
          <Badge variant="secondary" className="mx-auto mb-2 bg-destructive/10 text-destructive">
            Daily Limit Reached
          </Badge>
          <DialogTitle className="text-2xl font-display">
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription className="text-base">
            You&apos;ve used all 5 free messages today. Upgrade to Pro for unlimited access and premium features.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Price Card */}
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-lg text-foreground">Pro Plan</h3>
                <p className="text-sm text-muted-foreground">Best for individuals</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-foreground">$9.99</p>
                <p className="text-sm text-muted-foreground">/month</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    benefit.highlight 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {benefit.icon}
                  </div>
                  <span className={`text-sm ${benefit.highlight ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                    {benefit.text}
                  </span>
                  {benefit.highlight && (
                    <Badge variant="secondary" className="ml-auto bg-success/10 text-success text-xs">
                      Most wanted
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4 text-success" />
            <span>30-day money-back guarantee</span>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button 
            className="w-full h-12 text-base gradient-primary hover:opacity-90 shadow-lg"
            onClick={handleUpgrade}
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro - $9.99/mo
          </Button>
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={onClose}
          >
            Maybe later (limit resets in 24h)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
