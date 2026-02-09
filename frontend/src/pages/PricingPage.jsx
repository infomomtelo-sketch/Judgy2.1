import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowLeft, Loader2, Crown, Zap, Drama, Shield, Clock, Headphones, MessageSquare, History, Sparkles } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// JudgyGPT Logo Image
const JUDGY_LOGO = "https://customer-assets.emergentagent.com/job_chat-assist-26/artifacts/ze789p6s_7DEC28F8-D66A-46B0-99EA-84F4FF846DBB.png";

const PricingPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  
  const { isAuthenticated, user, subscribe } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${API}/subscriptions/plans`);
        setPlans(response.data);
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) {
      navigate('/register', { state: { selectedPlan: planId } });
      return;
    }

    if (user?.subscription_plan === planId) return;

    setSubscribing(planId);
    try {
      await subscribe(planId);
      navigate('/chat');
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setSubscribing(null);
    }
  };

  const getPlanIcon = (planId) => {
    switch (planId) {
      case 'premium':
        return <Drama className="w-7 h-7" />;
      case 'standard':
        return <Crown className="w-7 h-7" />;
      default:
        return <Zap className="w-7 h-7" />;
    }
  };

  const getPlanColor = (planId) => {
    switch (planId) {
      case 'premium':
        return 'bg-gradient-to-br from-pink-500 to-purple-600 text-white';
      case 'standard':
        return 'gradient-primary text-primary-foreground shadow-glow';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getFeatureIcon = (feature) => {
    const lowerFeature = feature.toLowerCase();
    if (lowerFeature.includes('unlimited') || lowerFeature.includes('messages') || lowerFeature.includes('roasts')) return <MessageSquare className="w-4 h-4" />;
    if (lowerFeature.includes('priority') || lowerFeature.includes('vip')) return <Zap className="w-4 h-4" />;
    if (lowerFeature.includes('history')) return <History className="w-4 h-4" />;
    if (lowerFeature.includes('support')) return <Headphones className="w-4 h-4" />;
    if (lowerFeature.includes('drama') || lowerFeature.includes('nice')) return <Sparkles className="w-4 h-4" />;
    return <Check className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/chat" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary shadow-glow">
              <img 
                src={JUDGY_LOGO} 
                alt="JudgyGPT" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-display font-semibold text-foreground">JudgyGPT</span>
          </Link>
          
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button variant="ghost" onClick={() => navigate('/chat')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Chat
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link to="/register">
                  <Button className="gradient-primary">Get Started Free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <Badge variant="secondary" className="mb-4 px-4 py-1">
          <Sparkles className="w-3 h-3 mr-1" />
          Choose Your Drama Level
        </Badge>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
          Pick Your Sass Package 💅
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          From gentle roasts to full-on drama. Choose how much truth you can handle.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => {
            const isCurrentPlan = user?.subscription_plan === plan.id;
            const isPopular = plan.popular;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative flex flex-col transition-all duration-300 hover:shadow-xl ${
                  isPopular 
                    ? 'border-2 border-primary shadow-lg shadow-primary/10 scale-[1.02] lg:scale-105' 
                    : 'border-border hover:border-primary/30'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="gradient-primary text-primary-foreground px-6 py-1 text-sm shadow-lg">
                      <Crown className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2 pt-8">
                  <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${getPlanColor(plan.id)}`}>
                    {getPlanIcon(plan.id)}
                  </div>
                  <CardTitle className="text-2xl font-display">{plan.name}</CardTitle>
                  <CardDescription className="text-sm mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 pt-4">
                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-foreground">{plan.price_display}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    {plan.id === 'free' && (
                      <p className="text-sm text-muted-foreground mt-1">Free forever</p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isPopular ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'
                        }`}>
                          {getFeatureIcon(feature)}
                        </div>
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-6 pb-6">
                  <Button
                    className={`w-full h-12 text-base font-medium ${
                      plan.id === 'premium'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg'
                        : isPopular 
                          ? 'gradient-primary hover:opacity-90 shadow-lg' 
                          : isCurrentPlan 
                            ? 'bg-secondary text-secondary-foreground' 
                            : ''
                    }`}
                    variant={isPopular || plan.id === 'premium' ? 'default' : 'outline'}
                    disabled={isCurrentPlan || subscribing === plan.id}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {subscribing === plan.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : isCurrentPlan ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Current Plan
                      </>
                    ) : plan.id === 'free' ? (
                      'Get Started Free'
                    ) : plan.id === 'premium' ? (
                      <>
                        <Drama className="w-4 h-4 mr-2" />
                        Bring the Drama
                      </>
                    ) : (
                      <>
                        <Crown className="w-4 h-4 mr-2" />
                        Subscribe
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* One-time purchases */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h3 className="font-display text-xl font-semibold text-center mb-6">One-Time Purchases</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">Witness Pass</h4>
                  <p className="text-sm text-muted-foreground">Per session access</p>
                </div>
                <Badge variant="secondary" className="text-lg font-bold">$4.99</Badge>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">Extra Invite</h4>
                  <p className="text-sm text-muted-foreground">Invite a friend to witness</p>
                </div>
                <Badge variant="secondary" className="text-lg font-bold">$2.99</Badge>
              </div>
            </Card>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-success" />
              <span className="text-sm">Secure payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm">Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-accent" />
              <span className="text-sm">Support available</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <FaqItem 
              question="What's the difference between the plans?"
              answer="Judgement Lite gives you 5 roasts per day. Talk to Me Nice bumps you up to 50 with slightly nicer treatment. Bring the Whole Drama? Unlimited sass, no holding back."
            />
            <FaqItem 
              question="Can I switch plans?"
              answer="Absolutely! Upgrade or downgrade whenever you want. We won't judge... okay, we will, but that's the point."
            />
            <FaqItem 
              question="What's a Witness Pass?"
              answer="It's a one-time purchase that lets a friend watch your conversation in real-time. Perfect for when you need backup or just want someone to see the drama unfold."
            />
            <FaqItem 
              question="Is my data safe?"
              answer="Yes! We only judge your life choices, not your data security. All conversations are encrypted."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Ready to get roasted? 🔥
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands who trust JudgyGPT for brutally honest advice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="gradient-primary px-8">
                Start Free
              </Button>
            </Link>
            <Link to="/chat">
              <Button size="lg" variant="outline" className="px-8">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        className="w-full px-6 py-4 text-left flex items-center justify-between bg-card hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-foreground">{question}</span>
        <div className={`transform transition-transform ${isOpen ? 'rotate-45' : ''}`}>
          <span className="text-2xl text-muted-foreground">+</span>
        </div>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-muted/30 border-t border-border">
          <p className="text-muted-foreground">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default PricingPage;
