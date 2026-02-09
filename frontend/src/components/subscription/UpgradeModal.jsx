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
import { Crown, Zap, MessageSquare, History, Sparkles, Check, Drama } from 'lucide-react';

const UpgradeModal = ({ isOpen, onClose, onUpgrade }) => {
  const navigate = useNavigate();

  const plans = [
    {
      id: 'standard',
      name: 'Talk to Me Nice',
      price: '$6.99',
      icon: <Crown className="w-5 h-5" />,
      features: ['50 messages/day', '7-day history', 'Slightly nicer tone 😏'],
      color: 'gradient-primary',
      popular: true
    },
    {
      id: 'premium',
      name: 'Bring the Whole Drama',
      price: '$14.99',
      icon: <Drama className="w-5 h-5" />,
      features: ['Unlimited messages', '30-day history', 'Full dramatic experience 💅'],
      color: 'bg-gradient-to-r from-pink-500 to-purple-600'
    }
  ];

  const handleUpgrade = () => {
    onClose();
    navigate('/pricing');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 rounded-2xl gradient-primary shadow-glow flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-primary-foreground" />
          </div>
          <Badge variant="secondary" className="mx-auto mb-2 bg-destructive/10 text-destructive">
            Daily Limit Reached
          </Badge>
          <DialogTitle className="text-2xl font-display">
            Out of Roasts! 🙈
          </DialogTitle>
          <DialogDescription className="text-base">
            You&apos;ve used all 5 free roasts today. Upgrade to keep the sass coming!
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`p-4 rounded-xl border ${plan.popular ? 'border-primary bg-primary/5' : 'border-border'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${plan.color} flex items-center justify-center text-primary-foreground`}>
                    {plan.icon}
                  </div>
                  <span className="font-medium text-foreground">{plan.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {plan.popular && (
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                      Popular
                    </Badge>
                  )}
                  <span className="font-bold text-foreground">{plan.price}/mo</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {plan.features.map((feature, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button 
            className="w-full h-12 text-base gradient-primary hover:opacity-90 shadow-lg"
            onClick={handleUpgrade}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            View All Plans
          </Button>
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={onClose}
          >
            Maybe later (resets in 24h)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
