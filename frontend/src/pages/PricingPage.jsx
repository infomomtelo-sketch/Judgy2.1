import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Check, ArrowLeft, Loader2, Crown, Zap, Building, X, Shield, Clock, Headphones, Code, Users, BarChart3, Infinity, MessageSquare, History, Palette } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PricingPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  
  const { isAuthenticated, user, subscribe, subscription } = useAuth();
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
      case 'pro':
        return <Crown className="w-7 h-7" />;
      case 'enterprise':
        return <Building className="w-7 h-7" />;
      default:
        return <Zap className="w-7 h-7" />;
    }
  };

  const getFeatureIcon = (feature) => {
    const lowerFeature = feature.toLowerCase();
    if (lowerFeature.includes('unlimited') || lowerFeature.includes('messages')) return <Infinity className="w-4 h-4" />;
    if (lowerFeature.includes('priority') || lowerFeature.includes('response')) return <Zap className="w-4 h-4" />;
    if (lowerFeature.includes('history')) return <History className="w-4 h-4" />;
    if (lowerFeature.includes('support')) return <Headphones className="w-4 h-4" />;
    if (lowerFeature.includes('api')) return <Code className="w-4 h-4" />;
    if (lowerFeature.includes('team') || lowerFeature.includes('collaboration')) return <Users className="w-4 h-4" />;
    if (lowerFeature.includes('analytics') || lowerFeature.includes('dashboard')) return <BarChart3 className="w-4 h-4" />;
    if (lowerFeature.includes('formatting') || lowerFeature.includes('advanced')) return <Palette className="w-4 h-4" />;
    if (lowerFeature.includes('custom') || lowerFeature.includes('integration')) return <Shield className="w-4 h-4" />;
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
            <div className="w-10 h-10 rounded-xl gradient-primary shadow-glow flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
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
          Pricing Plans
        </Badge>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Choose the perfect plan for your needs. Start free and upgrade as you grow. 
          All plans include our powerful AI assistant.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Tabs value={billingCycle} onValueChange={setBillingCycle} className="bg-muted rounded-lg p-1">
            <TabsList className="grid grid-cols-2 bg-transparent">
              <TabsTrigger value="monthly" className="data-[state=active]:bg-background rounded-md px-6">
                Monthly
              </TabsTrigger>
              <TabsTrigger value="yearly" className="data-[state=active]:bg-background rounded-md px-6">
                Yearly
                <Badge variant="secondary" className="ml-2 bg-success/10 text-success text-xs">
                  Save 20%
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => {
            const isCurrentPlan = user?.subscription_plan === plan.id;
            const isPopular = plan.popular;
            const yearlyPrice = plan.price > 0 ? Math.round(plan.price * 0.8 * 12 / 100) : 0;
            const displayPrice = billingCycle === 'yearly' && plan.price > 0 
              ? `$${(yearlyPrice / 12).toFixed(2)}`
              : plan.price_display;
            
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
                  <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                    plan.id === 'free' 
                      ? 'bg-muted text-muted-foreground' 
                      : plan.id === 'pro'
                        ? 'gradient-primary text-primary-foreground shadow-glow'
                        : 'bg-gradient-to-br from-accent to-success text-accent-foreground'
                  }`}>
                    {getPlanIcon(plan.id)}
                  </div>
                  <CardTitle className="text-2xl font-display">{plan.name}</CardTitle>
                  <CardDescription className="text-sm mt-2">
                    {plan.id === 'free' && 'Perfect for trying out'}
                    {plan.id === 'pro' && 'Best for individuals'}
                    {plan.id === 'enterprise' && 'For teams & businesses'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 pt-4">
                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-foreground">{displayPrice}</span>
                      <span className="text-muted-foreground">/{billingCycle === 'yearly' ? 'mo' : 'month'}</span>
                    </div>
                    {billingCycle === 'yearly' && plan.price > 0 && (
                      <p className="text-sm text-success mt-1">
                        ${yearlyPrice}/year (billed annually)
                      </p>
                    )}
                    {plan.id === 'free' && (
                      <p className="text-sm text-muted-foreground mt-1">Free forever</p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.id === 'pro' && (
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        Everything in Free, plus:
                      </p>
                    )}
                    {plan.id === 'enterprise' && (
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        Everything in Pro, plus:
                      </p>
                    )}
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
                      isPopular 
                        ? 'gradient-primary hover:opacity-90 shadow-lg' 
                        : isCurrentPlan 
                          ? 'bg-secondary text-secondary-foreground' 
                          : ''
                    }`}
                    variant={isPopular ? 'default' : 'outline'}
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
                    ) : (
                      <>
                        Subscribe to {plan.name}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
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
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <FaqItem 
              question="Can I switch plans later?"
              answer="Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any payments."
            />
            <FaqItem 
              question="What happens when I reach my daily limit on Free?"
              answer="You'll see an upgrade prompt. Your limit resets every 24 hours, or you can upgrade to Pro for unlimited messages."
            />
            <FaqItem 
              question="Is there a free trial for Pro?"
              answer="Our Free plan is essentially a trial! Use 5 messages per day to experience the AI assistant before upgrading."
            />
            <FaqItem 
              question="What payment methods do you accept?"
              answer="We accept all major credit cards (Visa, Mastercard, American Express) and PayPal through our secure payment processor."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of users who trust AI Assistant for step-by-step guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="gradient-primary px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/chat">
              <Button size="lg" variant="outline" className="px-8">
                View Demo
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
