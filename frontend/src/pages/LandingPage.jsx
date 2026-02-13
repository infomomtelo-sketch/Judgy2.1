import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  ArrowRight,
  MessageCircle,
  Gavel,
  Mail
} from 'lucide-react';

// JudgyGPT Logo
const JUDGY_LOGO = "https://customer-assets.emergentagent.com/job_chat-assist-26/artifacts/ze789p6s_7DEC28F8-D66A-46B0-99EA-84F4FF846DBB.png";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary shadow-glow">
              <img src={JUDGY_LOGO} alt="JudgyGPT" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">JudgyGPT</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/chat">
              <Button className="gradient-primary">Start Chatting</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Your Sassy AI Bestie
          </Badge>
          
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Go ahead...{' '}
            <span className="text-gradient">Test Me</span> 💅
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Think you can stump me? Ask me anything. I dare you. 
            Brutally honest advice with zero filter - your ego might not survive.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chat">
              <Button size="lg" className="gradient-primary text-lg px-8 h-14 shadow-glow">
                Try Me, I Dare You
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                See What I Can Do
              </Button>
            </Link>
          </div>
          
          {/* Challenge Prompts */}
          <div className="mt-12 max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground mb-4">🔥 Popular challenges:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link to="/chat">
                <Badge variant="secondary" className="px-4 py-2 cursor-pointer hover:bg-primary/10 transition-colors">
                  "Roast my life choices"
                </Badge>
              </Link>
              <Link to="/chat">
                <Badge variant="secondary" className="px-4 py-2 cursor-pointer hover:bg-primary/10 transition-colors">
                  "Should I text my ex?"
                </Badge>
              </Link>
              <Link to="/chat">
                <Badge variant="secondary" className="px-4 py-2 cursor-pointer hover:bg-primary/10 transition-colors">
                  "Give me tough love"
                </Badge>
              </Link>
              <Link to="/chat">
                <Badge variant="secondary" className="px-4 py-2 cursor-pointer hover:bg-primary/10 transition-colors">
                  "Judge my decisions"
                </Badge>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Why JudgyGPT?</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Not Your Average AI
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Finally, an AI that gives you real talk instead of generic advice.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Gavel className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Brutally Honest</h3>
              <p className="text-sm text-muted-foreground">
                No sugar-coating. Just real advice that actually helps.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Sassy But Supportive</h3>
              <p className="text-sm text-muted-foreground">
                Tough love from someone who's got your back.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Actually Helpful</h3>
              <p className="text-sm text-muted-foreground">
                Under all that sass is real wisdom you can use.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">About</Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Why I Built This
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            I was tired of boring, generic AI advice. So I created an AI personality that 
            feels like talking to a real friend - one who's not afraid to call you out, but 
            always has your back.
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
              <h3 className="font-semibold text-foreground mb-2">I Care</h3>
              <p className="text-sm text-muted-foreground">Sass comes from a place of love</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Still Scared? 😏
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Most people can't handle the truth. Can you?
          </p>
          <Link to="/chat">
            <Button size="lg" className="gradient-primary px-8 h-14 text-lg">
              <Gavel className="w-5 h-5 mr-2" />
              Test Me Now
            </Button>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Free to try • No filter • Real advice
          </p>
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
                  <img src={JUDGY_LOGO} alt="JudgyGPT" className="w-full h-full object-cover" />
                </div>
                <span className="font-display font-bold text-xl text-foreground">JudgyGPT</span>
              </div>
              <p className="text-muted-foreground mb-4">
                AI with real personality. 💅
              </p>
              <p className="text-sm text-muted-foreground">
                © 2025 JudgyGPT. All rights reserved.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link to="/chat" className="hover:text-foreground transition-colors">
                    Start Chatting
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-foreground transition-colors">
                    Create Account
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
