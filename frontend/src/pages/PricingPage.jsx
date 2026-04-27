import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Coins, Check, Sparkles, Sun, Moon, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PricingPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { isAuthenticated, user, tokens, addFreeTokens, refreshTokens } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(`${API}/tokens/packages`);
        setPackages(response.data);
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Poll payment status on return from Stripe
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const success = searchParams.get('success');
    
    if (sessionId && success === 'true' && isAuthenticated) {
      pollPaymentStatus(sessionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isAuthenticated]);

  const pollPaymentStatus = async (sessionId, attempts = 0) => {
    const maxAttempts = 6;
    const pollInterval = 2000;

    if (attempts >= maxAttempts) {
      return;
    }

    try {
      const response = await axios.get(`${API}/tokens/checkout/status/${sessionId}`);
      
      if (response.data.payment_status === 'paid') {
        setPaymentSuccess(true);
        refreshTokens();
        return;
      }
      
      // Continue polling
      setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), pollInterval);
    } catch (error) {
      console.error('Error polling payment status:', error);
      setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), pollInterval);
    }
  };

  const handleBuyTokens = async (packageId) => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    setPurchaseLoading(packageId);
    try {
      const response = await axios.post(`${API}/tokens/checkout`, {
        package_id: packageId,
        origin_url: window.location.origin
      });
      
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setPurchaseLoading(null);
    }
  };

  const handleGetFreeTokens = async () => {
    try {
      await addFreeTokens();
    } catch (error) {
      console.error('Failed to add tokens:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="glass-header sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FF2E4C] flex items-center justify-center rounded-sm">
              <span className="font-display font-bold text-lg sm:text-xl text-white">J</span>
            </div>
            <span className="font-display font-bold text-base sm:text-xl tracking-tight text-foreground">THE JUDGY</span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
              data-testid="theme-toggle"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                onClick={() => navigate('/chat')}
                className="text-muted-foreground hover:text-foreground text-sm"
                data-testid="back-to-chat-btn"
              >
                <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back to Chat</span>
                <span className="sm:hidden">Chat</span>
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-sm" data-testid="pricing-signin-btn">Sign in</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-[#FF2E4C] hover:bg-[#E01F3D] text-white text-sm" data-testid="pricing-start-btn">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Payment Success Banner */}
      {paymentSuccess && (
        <div className="bg-success/10 border-b border-success/30 p-4" data-testid="payment-success">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="font-bold text-success">Payment successful! Tokens have been added to your account.</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 text-center border-b border-border">
        <span className="tag-elegant inline-block mb-4 sm:mb-6 text-[10px] sm:text-xs">Get Tokens</span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6 text-foreground">
          FUEL YOUR
          <br />
          <span className="text-[#FFB800]">JUDGMENT</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          Each message costs 1 token. Get tokens to keep the brutal honesty flowing.
        </p>
        
        {isAuthenticated && (
          <div className="mt-6 sm:mt-8 inline-flex items-center gap-3 px-6 py-3 bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-md">
            <Coins className="w-5 h-5 text-[#FFB800]" />
            <span className="text-xl sm:text-2xl font-bold text-[#FFB800]">{tokens}</span>
            <span className="text-sm text-muted-foreground uppercase">tokens available</span>
          </div>
        )}
      </section>

      {/* Free Tokens Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#FF2E4C]/5 border border-[#FFB800]/30 p-6 sm:p-8 rounded-lg">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FFB800] flex items-center justify-center flex-shrink-0 rounded-md">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-2">FREE TOKENS</h3>
                <p className="text-muted-foreground mb-4">
                  Running low? Get 10 free tokens instantly. Because everyone deserves a little judgment.
                </p>
                {isAuthenticated ? (
                  <Button 
                    onClick={handleGetFreeTokens}
                    className="bg-[#FFB800] hover:bg-[#E5A600] text-black font-bold uppercase text-sm w-full sm:w-auto"
                    data-testid="get-free-tokens-btn"
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Get 10 Free Tokens
                  </Button>
                ) : (
                  <Link to="/register">
                    <Button className="bg-[#FFB800] hover:bg-[#E5A600] text-black font-bold uppercase text-sm w-full sm:w-auto">
                      Sign Up & Get 50 Free
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Token Packages */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-foreground">
              TOKEN PACKAGES
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">One-time purchase. Tokens never expire.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {packages.map((pkg, index) => (
              <div 
                key={pkg.id}
                className={`relative flex flex-col bg-card border p-6 sm:p-8 transition-transform hover:-translate-y-1 rounded-lg ${
                  index === 1 ? 'border-[#FFB800] shadow-elegant' : 'border-border'
                }`}
                data-testid={`package-${pkg.id}`}
              >
                {index === 1 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#FFB800] text-black text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      Best Value
                    </span>
                  </div>
                )}

                <div className="mb-4 sm:mb-6">
                  <h3 className="font-display text-lg sm:text-xl font-bold uppercase tracking-tight mb-1 text-foreground">
                    {pkg.name}
                  </h3>
                  {pkg.bonus && (
                    <span className="text-xs text-[#FFB800] font-bold">{pkg.bonus}</span>
                  )}
                </div>

                <div className="mb-4 sm:mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={`font-display text-3xl sm:text-4xl font-bold ${
                      index === 1 ? 'text-[#FFB800]' : 'text-foreground'
                    }`}>
                      {pkg.tokens}
                    </span>
                    <span className="text-muted-foreground text-sm">tokens</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-muted-foreground mt-1">{pkg.price_display}</p>
                </div>

                <div className="flex-1 space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-[#FFB800]" />
                    <span>{pkg.tokens} messages</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-[#FFB800]" />
                    <span>Never expires</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleBuyTokens(pkg.id)}
                  disabled={purchaseLoading === pkg.id}
                  className={`w-full h-12 text-sm font-bold uppercase tracking-wider ${
                    index === 1 
                      ? 'bg-[#FFB800] hover:bg-[#E5A600] text-black' 
                      : 'bg-[#FF2E4C] hover:bg-[#E01F3D] text-white'
                  }`}
                  data-testid={`buy-btn-${pkg.id}`}
                >
                  {purchaseLoading === pkg.id ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" />Processing...</>
                  ) : (
                    `Buy ${pkg.tokens} Tokens`
                  )}
                </Button>
              </div>
            ))}
          </div>

          <p className="text-center text-muted-foreground text-xs sm:text-sm mt-6 sm:mt-8">
            Secure payment powered by Stripe. All purchases are one-time, no subscriptions.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 border-t border-border bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 uppercase tracking-tight text-foreground">
            How Tokens Work
          </h2>
          
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#FF2E4C] flex items-center justify-center mx-auto mb-4 rounded-md">
                <span className="font-display font-bold text-xl sm:text-2xl text-white">1</span>
              </div>
              <h3 className="font-bold text-foreground mb-2 text-sm sm:text-base">GET TOKENS</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Sign up and get 50 free tokens instantly</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#FFB800] flex items-center justify-center mx-auto mb-4 rounded-md">
                <span className="font-display font-bold text-xl sm:text-2xl text-black">2</span>
              </div>
              <h3 className="font-bold text-foreground mb-2 text-sm sm:text-base">CHAT</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Each message costs just 1 token</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted border border-border flex items-center justify-center mx-auto mb-4 rounded-md">
                <span className="font-display font-bold text-xl sm:text-2xl text-foreground">3</span>
              </div>
              <h3 className="font-bold text-foreground mb-2 text-sm sm:text-base">GET MORE</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Buy token packs or grab free tokens</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-4 sm:mb-6 text-foreground">
            READY FOR SOME
            <br />
            <span className="text-[#FF2E4C]">BRUTAL HONESTY?</span>
          </h2>
          <Link to={isAuthenticated ? "/chat" : "/register"}>
            <Button 
              size="lg" 
              className="bg-[#FF2E4C] hover:bg-[#E01F3D] text-white h-12 sm:h-14 px-8 sm:px-12 text-sm sm:text-base uppercase tracking-wider font-bold"
              data-testid="cta-btn"
            >
              {isAuthenticated ? "Start Chatting" : "Get 50 Free Tokens"}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
