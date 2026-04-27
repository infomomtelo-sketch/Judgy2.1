import React from 'react';
import { Zap, Target, Brain, ArrowRight, Coins } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const WelcomeMessage = () => {
  const { user, isPremium, isFullDrama } = useAuth();

  const getPlanBadge = () => {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-md mb-8">
        <Coins className="w-3 h-3 text-[#FFB800]" />
        <span className="text-xs font-bold text-[#FFB800] uppercase tracking-wider">{user?.tokens || 50} Tokens</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-fade-in" data-testid="welcome-message">
      {/* Logo */}
      <div className="w-20 h-20 bg-[#FF2E4C] flex items-center justify-center rounded-sm mb-8">
        <span className="font-display font-bold text-4xl text-white">J</span>
      </div>
      
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight text-center">
        READY TO GET
        <br />
        <span className="text-[#FF2E4C]">JUDGED?</span>
      </h1>
      
      <p className="text-muted-foreground text-center max-w-md mb-6 text-sm">
        No sugarcoating. No fake positivity. Just brutal honesty that actually helps you grow.
      </p>

      {getPlanBadge()}

      {/* Challenge Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-10">
        <ChallengeCard 
          icon={<Zap className="w-6 h-6 text-orange-500" />}
          title="ROAST ME"
          description="No filter"
          borderColor="border-orange-500/30"
        />
        <ChallengeCard 
          icon={<Target className="w-6 h-6 text-[#FF2E4C]" />}
          title="REAL TALK"
          description="Hard truths"
          borderColor="border-[#FF2E4C]/30"
        />
        <ChallengeCard 
          icon={<Brain className="w-6 h-6 text-purple-500" />}
          title="GUIDE ME"
          description="Actual advice"
          borderColor="border-purple-500/30"
        />
      </div>

      {/* Quick Prompts */}
      <div className="w-full max-w-xl">
        <p className="text-xs text-muted-foreground text-center mb-4 uppercase tracking-wider">Try asking:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Roast my life choices",
            "Should I text my ex?",
            "Am I being underpaid?",
            "Judge my decisions",
            "Give me tough love",
            "Rate my dating app bio",
            "Am I the toxic one?",
            "Is my side hustle dumb?"
          ].map((suggestion, i) => (
            <button 
              key={i}
              className="px-4 py-2 text-sm bg-card border border-border hover:border-[#FF2E4C] text-muted-foreground hover:text-foreground transition-all rounded-md shadow-card"
              data-testid={`prompt-${i}`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-10 flex items-center gap-2 text-muted-foreground">
        <span className="text-xs uppercase tracking-wider">Type below</span>
        <ArrowRight className="w-3 h-3" />
      </div>
    </div>
  );
};

const ChallengeCard = ({ icon, title, description, borderColor }) => {
  return (
    <div className={`flex flex-col items-center p-6 bg-card border ${borderColor} hover:shadow-elegant transition-all cursor-pointer rounded-lg`}>
      <div className="w-14 h-14 bg-muted border border-border flex items-center justify-center mb-4 rounded-md">
        {icon}
      </div>
      <h3 className="font-display font-bold text-foreground mb-1 uppercase tracking-tight">{title}</h3>
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{description}</p>
    </div>
  );
};

export default WelcomeMessage;
