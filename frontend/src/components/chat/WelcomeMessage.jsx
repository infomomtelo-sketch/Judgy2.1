import React from 'react';
import { Sparkles, MessageCircle, ListChecks, Lightbulb, Crown, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '@/components/ui/badge';

const WelcomeMessage = () => {
  const { user, isPro, isEnterprise } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl gradient-primary shadow-glow flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-primary-foreground" />
      </div>
      
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">
        Welcome to JudgyGPT
      </h1>
      <p className="text-muted-foreground text-center max-w-md mb-4">
        I&apos;m here to give you the advice you need (with a side of sass). Ask me anything - I&apos;ll be honest, helpful, and only slightly judgmental. 💅
      </p>

      {/* Plan Status */}
      {isPro || isEnterprise ? (
        <Badge className="mb-8 gradient-primary text-primary-foreground px-4 py-1">
          <Crown className="w-3 h-3 mr-1" />
          {isEnterprise ? 'Enterprise' : 'Pro'} Plan - Unlimited Messages
        </Badge>
      ) : (
        <Badge variant="secondary" className="mb-8 px-4 py-1">
          <Zap className="w-3 h-3 mr-1 text-primary" />
          Free Plan - 5 messages/day
        </Badge>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
        <FeatureCard 
          icon={<MessageCircle className="w-5 h-5" />}
          title="Ask Anything"
          description="Get help with any topic or task"
        />
        <FeatureCard 
          icon={<ListChecks className="w-5 h-5" />}
          title="Step-by-Step"
          description="Clear, organized instructions"
        />
        <FeatureCard 
          icon={<Lightbulb className="w-5 h-5" />}
          title="Continue"
          description="Request more details anytime"
        />
      </div>

      {/* Quick Start Suggestions */}
      <div className="mt-8 w-full max-w-xl">
        <p className="text-sm text-muted-foreground text-center mb-3">Try asking:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "How do I learn programming?",
            "Explain quantum computing",
            "Tips for productivity"
          ].map((suggestion, i) => (
            <span 
              key={i}
              className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-full cursor-pointer transition-colors text-muted-foreground hover:text-foreground"
            >
              {suggestion}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200">
      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary mb-3">
        {icon}
      </div>
      <h3 className="font-medium text-sm text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground text-center">{description}</p>
    </div>
  );
};

export default WelcomeMessage;
