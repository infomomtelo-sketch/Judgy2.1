import React from 'react';
import { Sparkles, MessageCircle, ListChecks, Lightbulb } from 'lucide-react';

const WelcomeMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl gradient-primary shadow-glow flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-primary-foreground" />
      </div>
      
      <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
        Welcome to AI Assistant
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        I'm here to provide step-by-step guidance on any topic. Ask me anything and I'll break it down into clear, manageable steps.
      </p>

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
