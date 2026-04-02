import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check, ArrowLeft, Loader2, ArrowRight, Shield, Zap, AlertCircle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PricingPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  
  const { isAuthenticated, user, subscribe, refreshSubscription } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const success = urlParams.get('success');
    const cancelled = urlParams.get('cancelled');

    if (cancelled) {
      setPaymentError('Payment was cancelled. You can try again when ready.');
      window.history.replaceState({}, '', '/pricing');
    }

    if (sessionId && success) {
      pollPaymentStatus(sessionId);
    }
  }, []);

  const pollPaymentStatus = async (sessionId, attempts = 0) => {
    const maxAttempts = 10;
    const pollInterval = 2000;

    if (attempts >= maxAttempts) {
      setPaymentError('Payment verification timed out. Please check your email for confirmation.');
      return;
    }

    try {
      const response = await axios.get(`${API}/checkout/status/${sessionId}`);
      
      if (response.data.payment_status === 'paid') {
        setPaymentSuccess(true);
        await refreshSubscription();
        window.history.replaceState({}, '', '/pricing');
        setTimeout(() => navigate('/chat'), 2000);
        return;
      } else if (response.data.status === 'expired') {
        setPaymentError('Payment session expired. Please try again.');
        window.history.replaceState({}, '', '/pricing');
        return;
      }

      setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), pollInterval);
    } catch (error) {
      console.error('Error checking payment status:', error);
      if (attempts < maxAttempts) {
        setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), pollInterval);
      }
    }
  };

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

  const handleSubscribeClick = (plan) => {
    if (!isAuthenticated) {
      navigate('/register', { state: { selectedPlan: plan.id } });
      return;
    }

    if (user?.subscription_plan === plan.id) return;

    if (plan.id === 'free') {
      handleConfirmSubscribe(plan);
      return;
    }

    setSelectedPlan(plan);
    setShowConfirmModal(true);
  };

  const handleConfirmSubscribe = async (plan) => {
    const planToUse = plan || selectedPlan;
    setSubscribing(planToUse.id);
    setShowConfirmModal(false);
    setPaymentError(null);
    
    try {
      if (planToUse.id === 'free') {
        await subscribe(planToUse.id);
        navigate('/chat');
        return;
      }

      const response = await axios.post(`${API}/checkout/create`, {
        plan_id: planToUse.id,
        origin_url: window.location.origin
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      } else if (response.data.success) {
        navigate('/chat');
      }
    } catch (error) {
      console.error('Subscription failed:', error);
      setPaymentError(error.response?.data?.detail || 'Payment failed. Please try again.');
    } finally {
      setSubscribing(null);
      setSelectedPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF2E4C]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="glass-header sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF2E4C] flex items-center justify-center">
              <span className="font-display font-black text-xl">J</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">THE JUDGY</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                onClick={() => navigate('/chat')}
                className="text-zinc-400 hover:text-white"
                data-testid="back-to-chat-btn"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Chat
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-zinc-400 hover:text-white" data-testid="pricing-signin-btn">Sign in</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-[#FF2E4C] hover:bg-[#E01F3D] shadow-brutal" data-testid="pricing-start-btn">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center border-b border-zinc-900">
        {paymentSuccess && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center gap-3 text-emerald-400">
              <Check className="w-6 h-6" />
              <div className="text-left">
                <p className="font-bold">Payment Successful!</p>
                <p className="text-sm opacity-80">Redirecting you to chat...</p>
              </div>
            </div>
          </div>
        )}

        {paymentError && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <div className="text-left">
                <p className="font-bold">Payment Issue</p>
                <p className="text-sm opacity-80">{paymentError}</p>
              </div>
            </div>
          </div>
        )}

        <span className="tag-brutal inline-block mb-6">Choose Your Level</span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
          HOW MUCH TRUTH
          <br />
          <span className="text-[#FF2E4C]">CAN YOU HANDLE?</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl mx-auto">
          From light roasts to full destruction. Pick your poison.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const isCurrentPlan = user?.subscription_plan === plan.id;
            const isPopular = plan.popular;
            const isPremium = plan.id === 'premium';
            
            return (
              <div 
                key={plan.id}
                className={`relative flex flex-col bg-[#141414] border ${
                  isPopular ? 'border-[#FF2E4C] shadow-brutal' : isPremium ? 'border-[#FFB800]' : 'border-zinc-800'
                } p-8 transition-transform hover:-translate-y-1`}
                data-testid={`plan-card-${plan.id}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-[#FF2E4C] text-white text-xs font-bold uppercase tracking-wider px-4 py-1">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-8">
                  <h3 className="font-display text-2xl font-bold mb-2 uppercase tracking-tight">
                    {plan.name}
                  </h3>
                  <p className="text-zinc-500 text-sm">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className={`font-display text-5xl font-black ${
                      isPopular ? 'text-[#FF2E4C]' : isPremium ? 'text-[#FFB800]' : 'text-white'
                    }`}>
                      {plan.price_display}
                    </span>
                    <span className="text-zinc-500 text-sm">/month</span>
                  </div>
                  {plan.id === 'free' && (
                    <p className="text-zinc-600 text-xs mt-1 uppercase tracking-wider">Free forever</p>
                  )}
                </div>

                {/* Features */}
                <div className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${
                        isPopular ? 'text-[#FF2E4C]' : isPremium ? 'text-[#FFB800]' : 'text-zinc-500'
                      }`}>
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-zinc-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full h-14 text-base font-bold uppercase tracking-wider ${
                    isCurrentPlan 
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : isPopular 
                        ? 'bg-[#FF2E4C] hover:bg-[#E01F3D] text-white shadow-brutal'
                        : isPremium
                          ? 'bg-[#FFB800] hover:bg-[#E5A600] text-black shadow-brutal-yellow'
                          : 'bg-transparent border border-zinc-700 hover:border-[#FF2E4C] text-white'
                  }`}
                  disabled={isCurrentPlan || subscribing === plan.id}
                  onClick={() => handleSubscribeClick(plan)}
                  data-testid={`subscribe-btn-${plan.id}`}
                >
                  {subscribing === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : plan.id === 'free' ? (
                    'Start Free'
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-zinc-500">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span className="text-sm uppercase tracking-wider">Secure payments</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#FFB800]" />
            <span className="text-sm uppercase tracking-wider">Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 border-t border-zinc-900">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-black text-center mb-12 uppercase tracking-tight">
            Questions?
          </h2>
          <div className="space-y-4">
            <FaqItem 
              question="What's the difference between the plans?"
              answer="Free gives you 5 roasts per day - enough to test the waters. Standard bumps you to 50 with priority responses. Premium? Unlimited judgment, no mercy."
            />
            <FaqItem 
              question="Can I switch plans?"
              answer="Upgrade or downgrade whenever. We're judgy about your decisions, not your subscription changes."
            />
            <FaqItem 
              question="Is my data safe?"
              answer="We judge your life choices, not your data security. All conversations are encrypted and private."
            />
            <FaqItem 
              question="What if I want a refund?"
              answer="Cancel anytime. No questions asked. Though we might judge you for leaving."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-zinc-900 bg-[#0D0D0D]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight mb-6">
            STOP OVERTHINKING.
            <br />
            <span className="text-[#FF2E4C]">START GETTING JUDGED.</span>
          </h2>
          <Link to="/chat">
            <Button 
              size="lg" 
              className="bg-[#FF2E4C] hover:bg-[#E01F3D] text-white shadow-brutal h-14 px-12 text-base uppercase tracking-wider font-bold"
              data-testid="cta-bottom-btn"
            >
              Get Roasted Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Payment Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="bg-[#141414] border-zinc-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-display font-bold uppercase">
              Confirm Subscription
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-400">
              You're about to subscribe to <strong className="text-white">{selectedPlan?.name}</strong>
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="py-4">
              <div className="bg-[#0A0A0A] border border-zinc-800 p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-zinc-500 text-sm uppercase">Plan</span>
                  <span className="font-bold">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-zinc-500 text-sm uppercase">Price</span>
                  <span className="font-bold">{selectedPlan.price_display}/month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-sm uppercase">Billing</span>
                  <span className="font-bold">Monthly</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-400">
                  Secure payment via Stripe. Cancel anytime.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col gap-2 sm:flex-col">
            <Button 
              className="w-full bg-[#FF2E4C] hover:bg-[#E01F3D] shadow-brutal font-bold uppercase"
              onClick={() => handleConfirmSubscribe(null)}
              disabled={subscribing}
              data-testid="confirm-subscribe-btn"
            >
              {subscribing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Confirm Subscription'
              )}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-zinc-400 hover:text-white"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-zinc-800 bg-[#141414]">
      <button
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        data-testid={`faq-${question.substring(0, 20).replace(/\s/g, '-').toLowerCase()}`}
      >
        <span className="font-bold text-white">{question}</span>
        <div className={`transform transition-transform ${isOpen ? 'rotate-45' : ''}`}>
          <span className="text-2xl text-[#FF2E4C]">+</span>
        </div>
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-zinc-800">
          <p className="text-zinc-400">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default PricingPage;
