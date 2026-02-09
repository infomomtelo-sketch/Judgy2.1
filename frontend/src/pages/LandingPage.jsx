import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  ArrowRight,
  Heart,
  MessageCircle,
  Scale,
  Gavel,
  ExternalLink,
  Mail
} from 'lucide-react';

// JudgyGPT Logo
const JUDGY_LOGO = "https://customer-assets.emergentagent.com/job_chat-assist-26/artifacts/ze789p6s_7DEC28F8-D66A-46B0-99EA-84F4FF846DBB.png";

// The Diplomat Logo
const DIPLOMAT_LOGO = "https://customer-assets.emergentagent.com/job_ai-persona-hub-8/artifacts/k884xcbn_IMG_6765.png";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary shadow-glow">
              <img src={JUDGY_LOGO} alt="JudgyGPT Online" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">JudgyGPT Online</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#personalities" className="text-muted-foreground hover:text-foreground transition-colors">Meet the AIs</a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Personalities with Attitude
          </Badge>
          
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Meet Your New AI{' '}
            <span className="text-gradient">Advisors</span> 💅
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Two unique AI personalities. One mission: Give you real advice with real personality. 
            Choose your vibe and get the honest guidance you deserve.
          </p>

          <a href="#personalities">
            <Button size="lg" className="gradient-primary text-lg px-8 h-14 shadow-glow">
              Choose Your Advisor
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </section>

      {/* Personalities Section */}
      <section id="personalities" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Choose Your AI</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Two Personalities, One Goal
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Different vibes, same mission: Honest advice that actually helps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* JudgyGPT Card */}
            <Card className="p-8 relative overflow-hidden border-2 border-primary/50 hover:border-primary hover:shadow-xl transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
              
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary shadow-glow">
                    <img src={JUDGY_LOGO} alt="JudgyGPT" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground">JudgyGPT</h3>
                    <p className="text-primary font-medium">Sassy Life Coach 💅</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">
                  Your brutally honest AI bestie. She tells it like it is - with sass, humor, and 
                  advice that actually works. Perfect for life decisions, career moves, and that 
                  thing you're overthinking.
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Gavel className="w-4 h-4 text-primary" />
                    <span className="text-foreground">Brutally honest advice</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span className="text-foreground">Sassy but supportive</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-foreground">Life, career & everything</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link to="/chat" className="flex-1">
                    <Button className="w-full gradient-primary">
                      Talk to JudgyGPT
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <a href="https://judgy.judgygptonline.com" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </Card>

            {/* The Diplomat Card */}
            <Card className="p-8 relative overflow-hidden border-2 border-pink-500/50 hover:border-pink-500 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-colors" />
              
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-pink-500 shadow-lg">
                    <img src={DIPLOMAT_LOGO} alt="The Diplomat" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground">The Diplomat</h3>
                    <p className="text-pink-500 font-medium">Marriage & Relationships 💔→💪</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">
                  JudgyGPT's ex-husband. Yes, <em>that</em> ex. He brings sitcom humor with 
                  couples-therapy wisdom. Perfect for marriage advice, relationship repair, 
                  and navigating love's messy middle.
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span className="text-foreground">Real marriage wisdom</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageCircle className="w-4 h-4 text-pink-500" />
                    <span className="text-foreground">Communication that works</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Scale className="w-4 h-4 text-pink-500" />
                    <span className="text-foreground">Stay, change, or part with dignity</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link to="/diplomat" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white">
                      Talk to The Diplomat
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <a href="https://chatgpt.com/g/g-6987ec32bdd48191b905193f05f3477e-the-diplomat" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="border-pink-500/50 hover:border-pink-500">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          </div>

          {/* Fun Callout */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-card border border-border rounded-2xl px-6 py-4 shadow-lg">
              <p className="text-muted-foreground italic">
                "She says I was too diplomatic. I say she never appreciated how I labeled the spice rack." 
                <span className="text-foreground font-medium ml-2">— The Diplomat</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">About Us</Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Why We Built This
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            We were tired of boring, generic AI advice. So we created AI personalities that 
            feel like talking to a real friend - one who's not afraid to call you out, but 
            always has your back. Whether you need life advice from JudgyGPT or relationship 
            wisdom from The Diplomat, we've got you covered.
          </p>
          
          <div className="grid sm:grid-cols-3 gap-6 mt-12">
            <div className="p-6 rounded-xl bg-muted/50">
              <div className="text-4xl mb-3">🎭</div>
              <h3 className="font-semibold text-foreground mb-2">Real Personality</h3>
              <p className="text-sm text-muted-foreground">Not another boring chatbot</p>
            </div>
            <div className="p-6 rounded-xl bg-muted/50">
              <div className="text-4xl mb-3">💡</div>
              <h3 className="font-semibold text-foreground mb-2">Actual Wisdom</h3>
              <p className="text-sm text-muted-foreground">Humor on surface, depth underneath</p>
            </div>
            <div className="p-6 rounded-xl bg-muted/50">
              <div className="text-4xl mb-3">❤️</div>
              <h3 className="font-semibold text-foreground mb-2">We Care</h3>
              <p className="text-sm text-muted-foreground">Sass comes from a place of love</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-pink-500/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to Get Real Advice? 🔥
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Pick your personality and start the conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chat">
              <Button size="lg" className="gradient-primary px-8 h-14">
                <Gavel className="w-5 h-5 mr-2" />
                JudgyGPT
              </Button>
            </Link>
            <Link to="/diplomat">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white px-8 h-14">
                <Scale className="w-5 h-5 mr-2" />
                The Diplomat
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-border py-12 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
                  <img src={JUDGY_LOGO} alt="JudgyGPT Online" className="w-full h-full object-cover" />
                </div>
                <span className="font-display font-bold text-xl text-foreground">JudgyGPT Online</span>
              </div>
              <p className="text-muted-foreground mb-4">
                AI personalities with real personality. 💅
              </p>
              <p className="text-sm text-muted-foreground">
                © 2025 JudgyGPT Online. All rights reserved.
              </p>
            </div>

            {/* Personalities */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Our AIs</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link to="/chat" className="hover:text-foreground transition-colors flex items-center gap-2">
                    <Gavel className="w-4 h-4" />
                    JudgyGPT
                  </Link>
                </li>
                <li>
                  <Link to="/diplomat" className="hover:text-foreground transition-colors flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    The Diplomat
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="mailto:hello@judgygptonline.com" className="hover:text-foreground transition-colors flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    hello@judgygptonline.com
                  </a>
                </li>
                <li>
                  <a href="mailto:support@judgygptonline.com" className="hover:text-foreground transition-colors flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    support@judgygptonline.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
