import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Coins, Check, Sparkles, Zap } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PricingPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, tokens, addFreeTokens } = useAuth();
  const navigate = useNavigate();

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

  const handleGetFreeTokens = async () => {
    try {
      await addFreeTokens();
    } catch (error) {
      console.error('Failed to add tokens:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="glass-header sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FF2E4C] flex items-center justify-center">
              <span className="font-display font-black text-lg sm:text-xl">J</span>
            </div>
            <span className="font-display font-bold text-base sm:text-xl tracking-tight">THE JUDGY</span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                onClick={() => navigate('/chat')}
                className="text-zinc-400 hover:text-white text-sm"
                data-testid="back-to-chat-btn"
              >
                <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back to Chat</span>
                <span className="sm:hidden">Chat</span>
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-zinc-400 hover:text-white text-sm" data-testid="pricing-signin-btn">Sign in</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-[#FF2E4C] hover:bg-[#E01F3D] shadow-brutal text-sm" data-testid="pricing-start-btn">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 text-center border-b border-zinc-900">
        <span className="tag-brutal inline-block mb-4 sm:mb-6 text-[10px] sm:text-xs">Get Tokens</span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 sm:mb-6">
          FUEL YOUR
          <br />
          <span className="text-[#FFB800]">JUDGMENT</span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto">
          Each message costs 1 token. Get tokens to keep the brutal honesty flowing.
        </p>
        
        {/* Current Balance */}
        {isAuthenticated && (
          <div className="mt-6 sm:mt-8 inline-flex items-center gap-3 px-6 py-3 bg-[#FFB800]/10 border border-[#FFB800]/30">
            <Coins className="w-5 h-5 text-[#FFB800]" />
            <span className="text-xl sm:text-2xl font-bold text-[#FFB800]">{tokens}</span>
            <span className="text-sm text-zinc-400 uppercase">tokens available</span>
          </div>
        )}
      </section>

      {/* Free Tokens Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 border-b border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#FF2E4C]/10 to-[#FFB800]/10 border border-[#FFB800]/30 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FFB800] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">FREE TOKENS</h3>
                <p className="text-zinc-400 mb-4">
                  Running low? Get 10 free tokens instantly. Because everyone deserves a little judgment.
                </p>
                {isAuthenticated ? (
                  <Button 
                    onClick={handleGetFreeTokens}
                    className="bg-[#FFB800] hover:bg-[#E5A600] text-black shadow-brutal-yellow font-bold uppercase text-sm w-full sm:w-auto"
                    data-testid="get-free-tokens-btn"
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Get 10 Free Tokens
                  </Button>
                ) : (
                  <Link to="/register">
                    <Button className="bg-[#FFB800] hover:bg-[#E5A600] text-black shadow-brutal-yellow font-bold uppercase text-sm w-full sm:w-auto">
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
            <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight mb-2">
              TOKEN PACKAGES
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base">Coming soon - buy tokens to support The Judgy</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {packages.map((pkg, index) => (
              <div 
                key={pkg.id}
                className={`relative flex flex-col bg-[#141414] border p-6 sm:p-8 transition-transform hover:-translate-y-1 ${
                  index === 1 ? 'border-[#FFB800] shadow-brutal-yellow' : 'border-zinc-800'
                }`}
                data-testid={`package-${pkg.id}`}
              >
                {index === 1 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#FFB800] text-black text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1">
                      Best Value
                    </span>
                  </div>
                )}

                <div className="mb-4 sm:mb-6">
                  <h3 className="font-display text-lg sm:text-xl font-bold uppercase tracking-tight mb-1">
                    {pkg.name}
                  </h3>
                  {pkg.bonus && (
                    <span className="text-xs text-[#FFB800] font-bold">{pkg.bonus}</span>
                  )}
                </div>

                <div className="mb-4 sm:mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={`font-display text-3xl sm:text-4xl font-black ${
                      index === 1 ? 'text-[#FFB800]' : 'text-white'
                    }`}>
                      {pkg.tokens}
                    </span>
                    <span className="text-zinc-500 text-sm">tokens</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-zinc-400 mt-1">{pkg.price_display}</p>
                </div>

                <div className="flex-1 space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Check className="w-4 h-4 text-[#FFB800]" />
                    <span>{pkg.tokens} messages</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Check className="w-4 h-4 text-[#FFB800]" />
                    <span>Never expires</span>
                  </div>
                </div>

                <Button
                  disabled
                  className="w-full h-12 text-sm font-bold uppercase tracking-wider bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  data-testid={`buy-btn-${pkg.id}`}
                >
                  Coming Soon
                </Button>
              </div>
            ))}
          </div>

          <p className="text-center text-zinc-600 text-xs sm:text-sm mt-6 sm:mt-8">
            Payment integration coming soon. For now, enjoy free tokens!
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 border-t border-zinc-900 bg-[#0D0D0D]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-center mb-8 sm:mb-12 uppercase tracking-tight">
            How Tokens Work
          </h2>
          
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#FF2E4C] flex items-center justify-center mx-auto mb-4">
                <span className="font-display font-black text-xl sm:text-2xl">1</span>
              </div>
              <h3 className="font-bold text-white mb-2 text-sm sm:text-base">GET TOKENS</h3>
              <p className="text-zinc-500 text-xs sm:text-sm">Sign up and get 50 free tokens instantly</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#FFB800] flex items-center justify-center mx-auto mb-4">
                <span className="font-display font-black text-xl sm:text-2xl text-black">2</span>
              </div>
              <h3 className="font-bold text-white mb-2 text-sm sm:text-base">CHAT</h3>
              <p className="text-zinc-500 text-xs sm:text-sm">Each message costs just 1 token</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-4">
                <span className="font-display font-black text-xl sm:text-2xl">3</span>
              </div>
              <h3 className="font-bold text-white mb-2 text-sm sm:text-base">GET MORE</h3>
              <p className="text-zinc-500 text-xs sm:text-sm">Grab free tokens or buy packages</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight mb-4 sm:mb-6">
            READY FOR SOME
            <br />
            <span className="text-[#FF2E4C]">BRUTAL HONESTY?</span>
          </h2>
          <Link to={isAuthenticated ? "/chat" : "/register"}>
            <Button 
              size="lg" 
              className="bg-[#FF2E4C] hover:bg-[#E01F3D] text-white shadow-brutal h-12 sm:h-14 px-8 sm:px-12 text-sm sm:text-base uppercase tracking-wider font-bold"
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
