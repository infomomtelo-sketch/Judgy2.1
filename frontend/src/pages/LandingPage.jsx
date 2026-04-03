import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Target, Brain, Shield } from 'lucide-react';

const JUDGY_AVATAR = "https://images.unsplash.com/photo-1654086763373-090dff157f5c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzZ8MHwxfHNlYXJjaHw0fHxzdGF0dWUlMjBzY3VscHR1cmUlMjBkYXJrJTIwZWRneXxlbnwwfHx8fDE3NzUxNTk2NTl8MA&ixlib=rb-4.1.0&q=85&w=400";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FF2E4C] flex items-center justify-center">
              <span className="font-display font-black text-lg sm:text-xl">J</span>
            </div>
            <span className="font-display font-bold text-base sm:text-xl tracking-tight hidden xs:block">THE JUDGY</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/tools" className="text-zinc-400 hover:text-white transition-colors text-sm uppercase tracking-wider">Tools</Link>
            <Link to="/pricing" className="text-zinc-400 hover:text-white transition-colors text-sm uppercase tracking-wider">Pricing</Link>
            <Link to="/wall" className="text-zinc-400 hover:text-white transition-colors text-sm uppercase tracking-wider">Wall</Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/5 text-xs sm:text-sm uppercase tracking-wider px-2 sm:px-4" data-testid="nav-signin-btn">
                Sign In
              </Button>
            </Link>
            <Link to="/chat">
              <Button className="bg-[#FF2E4C] hover:bg-[#E01F3D] text-white shadow-brutal text-xs sm:text-sm uppercase tracking-wider font-bold px-3 sm:px-4" data-testid="nav-start-btn">
                <span className="hidden sm:inline">Get Judged</span>
                <span className="sm:hidden">Start</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-1/4 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-[#FF2E4C]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 sm:w-[500px] h-64 sm:h-[500px] bg-[#FFB800]/5 blur-[150px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left - Content */}
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-block">
                <span className="tag-brutal text-[10px] sm:text-xs" data-testid="hero-tag">
                  AI That Doesn't Sugarcoat
                </span>
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-black leading-[0.9] tracking-tight">
                <span className="text-white">THE TRUTH</span>
                <br />
                <span className="text-gradient">HURTS.</span>
                <br />
                <span className="text-zinc-500">GOOD.</span>
              </h1>
              
              <p className="text-base sm:text-lg text-zinc-400 max-w-md leading-relaxed">
                Stop asking AI that agrees with everything. Get brutally honest advice from an AI that judges you, roasts you, and then actually helps you.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/chat" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="bg-[#FF2E4C] hover:bg-[#E01F3D] text-white shadow-brutal h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base uppercase tracking-wider font-bold w-full"
                    data-testid="hero-cta-btn"
                  >
                    Get Roasted
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/tools" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-zinc-700 hover:border-[#FF2E4C] hover:bg-[#FF2E4C]/10 text-white h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base uppercase tracking-wider font-bold w-full"
                    data-testid="hero-tools-btn"
                  >
                    Try Free Tools
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-6 sm:gap-12 pt-6 sm:pt-8 border-t border-zinc-800">
                <div>
                  <div className="stat-brutal text-2xl sm:text-5xl" data-testid="stat-roasts">10K+</div>
                  <div className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider mt-1">Roasts</div>
                </div>
                <div>
                  <div className="stat-brutal text-2xl sm:text-5xl" data-testid="stat-truths">100%</div>
                  <div className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider mt-1">Honest</div>
                </div>
                <div>
                  <div className="stat-brutal text-2xl sm:text-5xl" data-testid="stat-filter">0</div>
                  <div className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider mt-1">Filter</div>
                </div>
              </div>
            </div>

            {/* Right - Visual */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Terminal-style preview */}
                <div className="bg-[#141414] border border-zinc-800 p-6 space-y-4">
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-[#FF2E4C]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFB800]"></div>
                    <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
                  </div>
                  
                  <div className="space-y-4 font-mono text-sm">
                    <div className="flex gap-3">
                      <span className="text-[#FFB800]">you:</span>
                      <span className="text-zinc-300">Should I text my ex?</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-[#FF2E4C]">judgy:</span>
                      <span className="text-zinc-300">No. Delete their number. Touch grass. Get a hobby. The audacity of even asking this...</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-[#FFB800]">you:</span>
                      <span className="text-zinc-300">But what if they've changed?</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-[#FF2E4C]">judgy:</span>
                      <span className="text-zinc-300">They haven't. You know this. I know this. The universe knows this. Move on.</span>
                    </div>
                    <div className="h-4 w-2 bg-[#FF2E4C] animate-pulse"></div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 border border-[#FF2E4C]/30"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#FFB800]/20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <span className="tag-brutal mb-4 inline-block">Free Tools</span>
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight">
              VIRAL JUDGMENT TOOLS
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Roast My Bio */}
            <Link to="/tools" className="group" data-testid="tool-roast-card">
              <div className="card-brutal p-8 h-full">
                <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                  <Zap className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">ROAST MY BIO</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  Paste your dating or LinkedIn bio. Get absolutely destroyed. Then get it fixed.
                </p>
                <div className="flex items-center text-orange-500 text-sm font-bold uppercase tracking-wider">
                  Get Roasted <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Red Flag Detector */}
            <Link to="/tools" className="group" data-testid="tool-redflag-card">
              <div className="card-brutal p-8 h-full">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors">
                  <Target className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">RED FLAG DETECTOR</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  Paste that text conversation. Find every red flag you're pretending not to see.
                </p>
                <div className="flex items-center text-red-500 text-sm font-bold uppercase tracking-wider">
                  Expose Flags <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Who's Right */}
            <Link to="/tools" className="group" data-testid="tool-whos-right-card">
              <div className="card-brutal p-8 h-full">
                <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                  <Brain className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">WHO'S RIGHT?</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  Submit your argument. Get the verdict. Settle it once and for all.
                </p>
                <div className="flex items-center text-purple-500 text-sm font-bold uppercase tracking-wider">
                  Get Verdict <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-24 px-6 bg-[#0D0D0D] border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="tag-brutal mb-4 inline-block">Why The Judgy?</span>
              <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight mb-8">
                NOT YOUR AVERAGE
                <br />
                <span className="text-[#FF2E4C]">AI ASSISTANT</span>
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#FF2E4C]/10 border border-[#FF2E4C]/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-[#FF2E4C]" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg mb-1">BRUTALLY HONEST</h3>
                    <p className="text-zinc-400 text-sm">No sugarcoating. No fake positivity. Just the truth you need to hear.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#FFB800]/10 border border-[#FFB800]/30 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-[#FFB800]" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg mb-1">ACTUALLY HELPFUL</h3>
                    <p className="text-zinc-400 text-sm">Behind the roasts is real wisdom. We judge, then we guide.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg mb-1">REAL RESULTS</h3>
                    <p className="text-zinc-400 text-sm">Users make better decisions when they stop lying to themselves.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src={JUDGY_AVATAR} 
                alt="The Judgy" 
                className="w-full max-w-md mx-auto grayscale contrast-125 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
            READY TO FACE
            <br />
            <span className="text-[#FF2E4C]">THE TRUTH?</span>
          </h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-xl mx-auto">
            Most people can't handle honesty. That's why they keep making the same mistakes. Don't be most people.
          </p>
          <Link to="/chat">
            <Button 
              size="lg" 
              className="bg-[#FF2E4C] hover:bg-[#E01F3D] text-white shadow-brutal h-16 px-12 text-lg uppercase tracking-wider font-bold"
              data-testid="cta-judge-btn"
            >
              Judge Me Now
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </Link>
          <p className="mt-6 text-sm text-zinc-600 uppercase tracking-wider">
            Free to try • No filter • Real advice
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-900 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#FF2E4C] flex items-center justify-center">
                <span className="font-display font-black text-sm">J</span>
              </div>
              <span className="font-display font-bold tracking-tight">THE JUDGY</span>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-zinc-500">
              <Link to="/tools" className="hover:text-white transition-colors uppercase tracking-wider">Tools</Link>
              <Link to="/pricing" className="hover:text-white transition-colors uppercase tracking-wider">Pricing</Link>
              <Link to="/wall" className="hover:text-white transition-colors uppercase tracking-wider">Wall</Link>
              <a href="mailto:hello@thejudgy.com" className="hover:text-white transition-colors uppercase tracking-wider">Contact</a>
            </div>
            
            <div className="text-sm text-zinc-600">
              © 2025 The Judgy. No feelings were spared.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
