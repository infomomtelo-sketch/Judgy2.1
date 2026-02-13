import React from 'react';
import { MessageCircle, ListChecks, Lightbulb, Crown, Zap, Drama, Flame, Target, Swords } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '@/components/ui/badge';

// JudgyGPT Logo Image
const JUDGY_LOGO = "https://customer-assets.emergentagent.com/job_chat-assist-26/artifacts/ze789p6s_7DEC28F8-D66A-46B0-99EA-84F4FF846DBB.png";

const WelcomeMessage = () => {
  const { user, isPremium, isFullDrama } = useAuth();

  const getPlanBadge = () => {
    if (isFullDrama) {
      return (
        <Badge className="mb-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1">
          <Drama className="w-3 h-3 mr-1" />
          Bring the Whole Drama - Unlimited 💅
        </Badge>
      );
    }
    if (isPremium) {
      return (
        <Badge className="mb-6 gradient-primary text-primary-foreground px-4 py-1">
          <Crown className="w-3 h-3 mr-1" />
          Talk to Me Nice - 50/day
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="mb-6 px-4 py-1">
        <Zap className="w-3 h-3 mr-1 text-primary" />
        Judgement Lite - 5 roasts/day
      </Badge>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 animate-fade-in">
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary shadow-glow mb-6 bg-gradient-to-br from-primary/20 to-accent/20">
        <img 
          src={JUDGY_LOGO} 
          alt="JudgyGPT" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <h1 className="font-display text-3xl font-bold text-foreground mb-2">
        Go Ahead... Test Me 💅
      </h1>
      <p className="text-muted-foreground text-center max-w-md mb-4">
        I dare you. Ask me anything. I&apos;ll give you the truth your friends are too nice to say.
      </p>

      {/* Plan Status */}
      {getPlanBadge()}

      {/* Challenge Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl mb-8">
        <ChallengeCard 
          icon={<Flame className="w-5 h-5 text-orange-500" />}
          title="Roast Me"
          description="If you can handle it"
          color="from-orange-500/10 to-red-500/10"
        />
        <ChallengeCard 
          icon={<Target className="w-5 h-5 text-blue-500" />}
          title="Real Talk"
          description="No sugarcoating"
          color="from-blue-500/10 to-cyan-500/10"
        />
        <ChallengeCard 
          icon={<Swords className="w-5 h-5 text-purple-500" />}
          title="Challenge Me"
          description="Try to stump me"
          color="from-purple-500/10 to-pink-500/10"
        />
      </div>

      {/* Quick Challenges */}
      <div className="w-full max-w-xl">
        <p className="text-sm text-muted-foreground text-center mb-3 flex items-center justify-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          Popular challenges:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "🔥 Roast my life choices",
            "💔 Should I text my ex?",
            "💰 Am I being underpaid?",
            "🎭 Judge my decisions",
            "💪 Give me tough love",
            "🤔 What should I do?"
          ].map((suggestion, i) => (
            <span 
              key={i}
              className="px-4 py-2 text-sm bg-muted hover:bg-primary/10 hover:border-primary/30 border border-transparent rounded-full cursor-pointer transition-all text-muted-foreground hover:text-foreground font-medium"
            >
              {suggestion}
            </span>
          ))}
        </div>
      </div>
      
      <p className="mt-8 text-xs text-muted-foreground">
        Type anything below and hit send. I&apos;m ready. Are you? 😏
      </p>
    </div>
  );
};

const ChallengeCard = ({ icon, title, description, color }) => {
  return (
    <div className={`flex flex-col items-center p-4 rounded-xl bg-gradient-to-br ${color} border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-200 cursor-pointer`}>
      <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center mb-3 shadow-sm">
        {icon}
      </div>
      <h3 className="font-semibold text-sm text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground text-center">{description}</p>
    </div>
  );
};

export default WelcomeMessage;
