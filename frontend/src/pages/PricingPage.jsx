import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Check, ArrowLeft, Loader2, Crown, Zap, Building } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PricingPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  
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
        return <Crown className="w-6 h-6" />;
      case 'enterprise':
        return <Building className="w-6 h-6" />;
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  const getPlanGradient = (planId) => {
    switch (planId) {
      case 'pro':
        return 'from-primary to-accent';
      case 'enterprise':
        return 'from-accent to-success';
      default:
        return 'from-muted-foreground to-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/chat" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary shadow-glow flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-foreground">AI Assistant</span>
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
                  <Button className="gradient-primary">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your needs. Start free and upgrade as you grow.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const isCurrentPlan = user?.subscription_plan === plan.id;
            const isPopular = plan.popular;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative flex flex-col ${
                  isPopular 
                    ? 'border-primary shadow-lg shadow-primary/10 scale-105' 
                    : 'border-border'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="gradient-primary text-primary-foreground px-4">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${getPlanGradient(plan.id)} flex items-center justify-center text-primary-foreground mb-4`}>
                    {getPlanIcon(plan.id)}
                  </div>
                  <CardTitle className="text-2xl font-display">{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-4xl font-bold text-foreground">{plan.price_display}</span>
                    <span className="text-muted-foreground">/{plan.interval}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-4">
                  <Button
                    className={`w-full ${
                      isPopular 
                        ? 'gradient-primary hover:opacity-90' 
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
                      'Current Plan'
                    ) : plan.id === 'free' ? (
                      'Get Started'
                    ) : (
                      'Subscribe'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* FAQ or additional info */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            All paid plans include a 30-day money-back guarantee.{' '}
            <Link to="/chat" className="text-primary hover:underline">
              Try free first
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
