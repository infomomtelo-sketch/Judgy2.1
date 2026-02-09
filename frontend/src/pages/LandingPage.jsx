import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  MessageCircle, 
  Zap, 
  Crown, 
  Drama,
  ArrowRight,
  Check,
  Star,
  Coffee,
  Shirt,
  Users,
  Mic,
  ChevronDown,
  Mail,
  Heart,
  Shield,
  Clock
} from 'lucide-react';

// JudgyGPT Logo
const JUDGY_LOGO = "https://cdn.pixabay.com/photo/2022/02/13/08/20/woman-7010576_1280.png";

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary shadow-glow">
              <img src={JUDGY_LOGO} alt="JudgyGPT" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">JudgyGPT</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#merch" className="text-muted-foreground hover:text-foreground transition-colors">Merch</a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button className="gradient-primary">Get Roasted Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-6 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Your Brutally Honest AI Bestie
              </Badge>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                The AI That Keeps It{' '}
                <span className="text-gradient">Real</span> 💅
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl">
                Tired of boring, generic advice? JudgyGPT gives you the honest truth - 
                with personality. Think of it as your bestie who tells it like it is.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register">
                  <Button size="lg" className="gradient-primary text-lg px-8 h-14 shadow-glow">
                    Get Your First Roast Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                    See How It Works
                  </Button>
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 mt-8 justify-center lg:justify-start text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success" />
                  <span className="text-sm">No sugarcoating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span className="text-sm">Actually helpful</span>
                </div>
              </div>
            </div>

            {/* Right - Chat Preview */}
            <div className="relative">
              <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-md mx-auto">
                {/* Chat header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                    <img src={JUDGY_LOGO} alt="JudgyGPT" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">JudgyGPT</h3>
                    <p className="text-xs text-muted-foreground">Online • Ready to roast</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]">
                      <p className="text-sm">Should I text my ex?</p>
                    </div>
                  </div>

                  {/* JudgyGPT response */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-primary shrink-0">
                      <img src={JUDGY_LOGO} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                      <p className="text-sm text-foreground">
                        Oh, you want to open that can of worms again? Bless your brave little heart. 🙄
                      </p>
                      <p className="text-sm text-foreground mt-2">
                        <strong>Here&apos;s the real talk:</strong>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        1. Why do you actually want to text them?<br/>
                        2. What&apos;s the best case scenario here?<br/>
                        3. Are you ready for the worst case?
                      </p>
                      <p className="text-sm text-foreground mt-2">
                        Now spill - what&apos;s really going on? 👀
                      </p>
                    </div>
                  </div>
                </div>

                {/* Input preview */}
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-3">
                    <span className="text-muted-foreground text-sm">Spill the tea... ☕</span>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-pink-500 text-white rounded-full px-3 py-1 text-sm font-medium shadow-lg animate-bounce-soft">
                💅 Sassy
              </div>
              <div className="absolute -bottom-4 -left-4 bg-success text-white rounded-full px-3 py-1 text-sm font-medium shadow-lg">
                ✓ Helpful
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Other AIs Tell You What You <span className="line-through text-muted-foreground">Want</span> to Hear
          </h2>
          <p className="text-xl text-primary font-semibold mb-4">
            JudgyGPT Tells You What You NEED to Hear 💅
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            No more wishy-washy responses. No more "it depends." Get real advice from an AI 
            that&apos;s not afraid to call you out (lovingly, of course).
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Three Steps to Better Decisions
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <HowItWorksCard 
              step="1"
              emoji="☕"
              title="Spill the Tea"
              description="Tell JudgyGPT what's going on. The messier, the better. We don't judge... okay, we do, but that's the point."
            />
            <HowItWorksCard 
              step="2"
              emoji="🔥"
              title="Get Roasted"
              description="Receive honest, sassy feedback. It might sting a little, but you'll thank us later."
            />
            <HowItWorksCard 
              step="3"
              emoji="✨"
              title="Get Helped"
              description="Walk away with actionable advice and a new perspective. You've got this, bestie."
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              What Makes JudgyGPT Different
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<MessageCircle className="w-6 h-6" />}
              title="Real Talk"
              description="No sugarcoating, no generic responses"
            />
            <FeatureCard 
              icon={<Heart className="w-6 h-6" />}
              title="Tough Love"
              description="Sassy but always has your back"
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6" />}
              title="Witness Mode"
              description="Invite friends to watch (coming soon)"
              comingSoon
            />
            <FeatureCard 
              icon={<Mic className="w-6 h-6" />}
              title="Voice Chat"
              description="Talk to JudgyGPT directly (coming soon)"
              comingSoon
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Pick Your Sass Level 💅
            </h2>
            <p className="text-muted-foreground">From gentle roasts to full-on drama</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard 
              name="Judgement Lite"
              price="$0"
              description="Get a taste of the sass"
              features={["5 roasts per day", "Basic judgments", "24-hour history"]}
              cta="Start Free"
              icon={<Zap className="w-6 h-6" />}
            />
            <PricingCard 
              name="Talk to Me Nice"
              price="$6.99"
              description="For those who want more"
              features={["50 messages per day", "Priority responses", "7-day history", "Slightly nicer tone 😏"]}
              cta="Subscribe"
              popular
              icon={<Crown className="w-6 h-6" />}
            />
            <PricingCard 
              name="Bring the Whole Drama"
              price="$14.99"
              description="Unlimited sass for the bold"
              features={["Unlimited messages", "VIP priority", "30-day history", "Full dramatic experience 💅"]}
              cta="Go Full Drama"
              icon={<Drama className="w-6 h-6" />}
              premium
            />
          </div>

          {/* One-time purchases */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">One-time purchases also available:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Witness Pass - $4.99
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                Extra Invite - $2.99
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Merch Section */}
      <section id="merch" className="py-20 px-4 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-primary/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white">Coming Soon</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Wear the Judgment 👕☕
            </h2>
            <p className="text-muted-foreground">Rep the sass in style</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MerchCard 
              icon={<Coffee className="w-8 h-8" />}
              title="Coffee Mugs"
              tagline="Sipping tea & spilling truth 💅"
            />
            <MerchCard 
              icon={<Shirt className="w-8 h-8" />}
              title="T-Shirts"
              tagline="Professionally Judged ✓"
            />
            <MerchCard 
              icon="🧢"
              title="Hats"
              tagline="Currently being roasted"
              emoji
            />
            <MerchCard 
              icon="🎨"
              title="Stickers"
              tagline="Certified Drama 💅"
              emoji
            />
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" disabled className="opacity-75">
              <Mail className="w-5 h-5 mr-2" />
              Notify Me When Available
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Reviews</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              What People Are Saying
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard 
              quote="I asked if I should take my ex back. JudgyGPT said 'Bless your heart' and then gave me the most helpful advice I've ever received."
              author="Sarah M."
              rating={5}
            />
            <TestimonialCard 
              quote="Finally, an AI that doesn't sugarcoat everything. It's like having a brutally honest friend who actually gives good advice."
              author="Mike R."
              rating={5}
            />
            <TestimonialCard 
              quote="The sass is real, but so is the help. 10/10 would get roasted again."
              author="Jenny L."
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Questions? We&apos;ve Got Answers
            </h2>
          </div>

          <div className="space-y-4">
            <FaqItem 
              question="Is JudgyGPT actually mean?"
              answer="Nope! Think of it as tough love from your bestie. We're sassy, not cruel. Every roast comes with genuine, helpful advice."
              isOpen={openFaq === 0}
              onToggle={() => setOpenFaq(openFaq === 0 ? null : 0)}
            />
            <FaqItem 
              question="What can I ask JudgyGPT?"
              answer="Anything! Relationship drama, career decisions, life choices, that weird thing your roommate did - we're here for all of it."
              isOpen={openFaq === 1}
              onToggle={() => setOpenFaq(openFaq === 1 ? null : 1)}
            />
            <FaqItem 
              question="Is my conversation private?"
              answer="Absolutely. We only judge your life choices, not your data security. All conversations are encrypted and private."
              isOpen={openFaq === 2}
              onToggle={() => setOpenFaq(openFaq === 2 ? null : 2)}
            />
            <FaqItem 
              question="Can I switch plans?"
              answer="Yes! Upgrade or downgrade anytime. We won't judge... okay, we might judge a little if you downgrade. 😏"
              isOpen={openFaq === 3}
              onToggle={() => setOpenFaq(openFaq === 3 ? null : 3)}
            />
            <FaqItem 
              question="What's the Witness feature?"
              answer="Coming soon! You'll be able to invite friends to watch your conversations in real-time. Perfect for when you need backup or just want someone to see the drama unfold."
              isOpen={openFaq === 4}
              onToggle={() => setOpenFaq(openFaq === 4 ? null : 4)}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary shadow-glow mx-auto mb-6">
            <img src={JUDGY_LOGO} alt="JudgyGPT" className="w-full h-full object-cover" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to Get Roasted? 🔥
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands who trust JudgyGPT for brutally honest advice.
          </p>
          <Link to="/register">
            <Button size="lg" className="gradient-primary text-lg px-10 h-14 shadow-glow">
              Start Free - No Credit Card Required
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
                  <img src={JUDGY_LOGO} alt="JudgyGPT" className="w-full h-full object-cover" />
                </div>
                <span className="font-display font-bold text-xl text-foreground">JudgyGPT</span>
              </div>
              <p className="text-muted-foreground mb-4">
                The AI that keeps it real. Sassy advice, genuine help. 💅
              </p>
              <p className="text-sm text-muted-foreground">
                © 2025 JudgyGPT. All rights reserved.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#merch" className="hover:text-foreground transition-colors">Merch</a></li>
                <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
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

// Component: How It Works Card
const HowItWorksCard = ({ step, emoji, title, description }) => (
  <div className="text-center p-6">
    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-3xl">
      {emoji}
    </div>
    <div className="text-sm font-medium text-primary mb-2">Step {step}</div>
    <h3 className="font-display text-xl font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

// Component: Feature Card
const FeatureCard = ({ icon, title, description, comingSoon }) => (
  <Card className="p-6 text-center hover:shadow-lg transition-shadow">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${comingSoon ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
      {icon}
    </div>
    <h3 className="font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
    {comingSoon && <Badge variant="secondary" className="mt-2 text-xs">Coming Soon</Badge>}
  </Card>
);

// Component: Pricing Card
const PricingCard = ({ name, price, description, features, cta, popular, premium, icon }) => (
  <Card className={`p-6 flex flex-col relative ${popular ? 'border-2 border-primary shadow-lg scale-105' : ''} ${premium ? 'border-2 border-pink-500' : ''}`}>
    {popular && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <Badge className="gradient-primary text-primary-foreground">Most Popular</Badge>
      </div>
    )}
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${premium ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : popular ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
      {icon}
    </div>
    <h3 className="font-display text-xl font-semibold text-foreground">{name}</h3>
    <p className="text-sm text-muted-foreground mb-4">{description}</p>
    <div className="text-3xl font-bold text-foreground mb-4">{price}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
    <ul className="space-y-2 mb-6 flex-1">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check className="w-4 h-4 text-primary shrink-0" />
          {feature}
        </li>
      ))}
    </ul>
    <Link to="/register">
      <Button className={`w-full ${premium ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white' : popular ? 'gradient-primary' : ''}`} variant={popular || premium ? 'default' : 'outline'}>
        {cta}
      </Button>
    </Link>
  </Card>
);

// Component: Merch Card
const MerchCard = ({ icon, title, tagline, emoji }) => (
  <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-card/50 backdrop-blur">
    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4 text-3xl">
      {emoji ? icon : <span className="text-pink-500">{icon}</span>}
    </div>
    <h3 className="font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground">{tagline}</p>
  </Card>
);

// Component: Testimonial Card
const TestimonialCard = ({ quote, author, rating }) => (
  <Card className="p-6">
    <div className="flex gap-1 mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
      ))}
    </div>
    <p className="text-foreground mb-4">&ldquo;{quote}&rdquo;</p>
    <p className="text-sm text-muted-foreground">— {author}</p>
  </Card>
);

// Component: FAQ Item
const FaqItem = ({ question, answer, isOpen, onToggle }) => (
  <div className="border border-border rounded-lg overflow-hidden">
    <button
      className="w-full px-6 py-4 text-left flex items-center justify-between bg-card hover:bg-muted/50 transition-colors"
      onClick={onToggle}
    >
      <span className="font-medium text-foreground">{question}</span>
      <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && (
      <div className="px-6 py-4 bg-muted/30 border-t border-border">
        <p className="text-muted-foreground">{answer}</p>
      </div>
    )}
  </div>
);

export default LandingPage;
