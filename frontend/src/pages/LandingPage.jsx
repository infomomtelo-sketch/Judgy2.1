import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Coins, User, Zap, Sun, Moon, Globe, Home, Code, TrendingUp, Dumbbell, ArrowDown, ChevronRight, MessageSquare, Flame, AlertTriangle, Scale, Users, Mic, Image } from 'lucide-react';
import { VoiceButton, ImageUploadButton, ImagePreview } from '../components/chat/MediaInputs';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { cn } from '@/lib/utils';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ICON_MAP = {
  Zap, Globe, Home, Code, TrendingUp, Dumbbell
};

const SAMPLE_CONVERSATIONS = {
  judgy: { q: "Should I text my ex?", a: "Oh honey, you already know the answer. Your ex is an ex for a reason. Put the phone down, go touch grass, and channel that energy into literally anything else." },
  translator: { q: "How do I say 'Where is the train station?' in Japanese?", a: "駅はどこですか？(Eki wa doko desu ka?) — Polite and perfect for asking directions. 'Eki' = station, 'doko' = where, 'desu ka' = is it?" },
  realtor: { q: "Is now a good time to buy a house?", a: "It depends on YOUR situation, not headlines. If you have stable income, 20% down, and plan to stay 5+ years — timing the market matters less than you think. Let's look at your numbers." },
  coder: { q: "How do I center a div?", a: "The eternal question. Use Flexbox:\n```css\ndisplay: flex;\njustify-content: center;\nalign-items: center;\n```\nDone. You're welcome." },
  social: { q: "How do I grow on TikTok?", a: "Hook viewers in the first 0.5 seconds. Post 3x daily. Ride trending sounds FAST. Reply to every comment in the first hour. The algorithm rewards speed and engagement." },
  fitness: { q: "I want to lose 20 lbs", a: "20 lbs in a healthy timeline = 10-20 weeks. Start here: calorie deficit of 500/day, 3x strength training, 10K steps daily. No crash diets. Consistency beats intensity every time." },
};

const LandingPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => localStorage.getItem('anon_session_id') || uuidv4());
  const [remainingMessages, setRemainingMessages] = useState(5);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState('judgy');
  const [experts, setExperts] = useState([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const chatSectionRef = useRef(null);
  
  const { isAuthenticated, user, tokens, refreshTokens } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('anon_session_id', sessionId);
  }, [sessionId]);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await axios.get(`${API}/experts`);
        setExperts(response.data);
      } catch (e) {
        console.error('Failed to load experts:', e);
      }
    };
    fetchExperts();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const scrollToChat = () => {
    chatSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectExpertAndScroll = (expertId) => {
    setSelectedExpert(expertId);
    setChatStarted(true);
    setMessages([]);
    setTimeout(() => scrollToChat(), 100);
  };

  const sendMessage = useCallback(async () => {
    if ((!input.trim() && !attachedImage) || isLoading) return;

    setChatStarted(true);
    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: input.trim() || '(Image sent)',
      timestamp: new Date(),
      hasImage: !!attachedImage
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    const currentImage = attachedImage;
    setInput('');
    setAttachedImage(null);
    setIsLoading(true);

    try {
      let response;
      
      if (currentImage) {
        const formData = new FormData();
        formData.append('file', currentImage);
        formData.append('message', currentInput);
        formData.append('session_id', `${sessionId}_${selectedExpert}`);
        formData.append('personality', selectedExpert);
        response = await axios.post(`${API}/chat/with-image`, formData);
      } else if (isAuthenticated) {
        response = await axios.post(`${API}/chat`, {
          session_id: `${sessionId}_${selectedExpert}`,
          message: userMessage.content,
          personality: selectedExpert
        });
        refreshTokens();
      } else {
        response = await axios.post(`${API}/chat/anonymous`, {
          session_id: `${sessionId}_${selectedExpert}`,
          message: userMessage.content,
          personality: selectedExpert
        });
        
        setRemainingMessages(response.data.remaining_messages);
        
        if (response.data.requires_signup) {
          setShowSignupPrompt(true);
        }
      }

      const aiMessage = {
        id: response.data.message_id,
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      if (error.response?.status === 403) {
        setShowSignupPrompt(true);
      } else {
        setMessages(prev => [...prev, {
          id: uuidv4(),
          role: 'assistant',
          content: 'Something went wrong. Try again.',
          timestamp: new Date(),
          isError: true
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isAuthenticated, sessionId, refreshTokens, selectedExpert, attachedImage]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleGoogleSignIn = () => {
    const redirectUrl = window.location.origin + '/chat';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const currentExpert = experts.find(e => e.name === EXPERT_PERSONAS_MAP[selectedExpert]) || {};

  const quickPrompts = QUICK_PROMPTS[selectedExpert] || QUICK_PROMPTS.judgy;

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="landing-page">
      {/* Header */}
      <header className="glass-header sticky top-0 z-20 px-4 py-3 flex items-center justify-between" data-testid="landing-header">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF2E4C] flex items-center justify-center rounded-sm">
            <span className="font-display font-bold text-lg text-white">J</span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-foreground">THE JUDGY</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
            data-testid="theme-toggle"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-md">
                <Coins className="w-3 h-3 text-[#FFB800]" />
                <span className="text-sm font-bold text-foreground">{tokens}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/chat')} className="text-muted-foreground hover:text-foreground" data-testid="full-chat-btn">
                Full Chat
              </Button>
            </>
          ) : (
            <>
              <span className="text-xs text-muted-foreground hidden sm:inline" data-testid="remaining-messages">
                {remainingMessages} free left
              </span>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm" data-testid="landing-signin-btn">
                  Sign In
                </Button>
              </Link>
              <Link to="/tools">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm hidden sm:inline-flex" data-testid="tools-link">
                  Tools
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      {!chatStarted && (
        <>
          <section className="py-16 sm:py-24 px-4 text-center" data-testid="hero-section">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF2E4C]/10 border border-[#FF2E4C]/20 rounded-full mb-6">
                <Zap className="w-3 h-3 text-[#FF2E4C]" />
                <span className="text-xs font-semibold text-[#FF2E4C] uppercase tracking-wider">AI Experts at your fingertips</span>
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-foreground leading-tight" data-testid="hero-heading">
                Free AI Experts.<br />
                <span className="text-[#FF2E4C]">Real Answers. No Signup.</span>
              </h1>
              
              <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                From code debugging AI to fitness coaching, language translation to real estate advice — pick your AI expert and start chatting. No signup required.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button 
                  onClick={scrollToChat}
                  size="lg" 
                  className="bg-[#FF2E4C] hover:bg-[#E01F3D] text-white h-12 px-8 text-sm uppercase tracking-wider font-bold"
                  data-testid="hero-cta"
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> Chat with AI Experts Free
                </Button>
                <span className="text-xs text-muted-foreground">5 free messages — no signup needed</span>
              </div>
            </div>
          </section>

          {/* MEET THE EXPERTS */}
          <section className="py-12 sm:py-16 px-4 border-t border-border" data-testid="experts-section">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">Meet Your AI Experts</h2>
                <p className="text-muted-foreground text-sm sm:text-base">Choose your expert. Each has a unique personality and deep expertise.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {experts.map((expert) => {
                  const expertKey = Object.keys(EXPERT_PERSONAS_MAP).find(k => EXPERT_PERSONAS_MAP[k] === expert.name) || 'judgy';
                  const IconComponent = ICON_MAP[expert.icon] || Zap;
                  const sample = SAMPLE_CONVERSATIONS[expertKey];
                  
                  return (
                    <button
                      key={expert.name}
                      onClick={() => selectExpertAndScroll(expertKey)}
                      className={cn(
                        "flex flex-col items-center p-4 sm:p-5 rounded-lg border transition-all hover:-translate-y-1 hover:shadow-elegant text-center group",
                        selectedExpert === expertKey
                          ? "border-[var(--expert-color)] bg-[var(--expert-color)]/5 shadow-elegant"
                          : "border-border bg-card"
                      )}
                      style={{ '--expert-color': expert.color }}
                      data-testid={`expert-card-${expertKey}`}
                      aria-label={`${expert.name} - ${expert.tagline}`}
                    >
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: expert.color }}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-display font-bold text-foreground text-sm mb-0.5">{expert.name}</h3>
                      <p className="text-[10px] text-muted-foreground leading-tight">{expert.tagline}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* SAMPLE CONVERSATIONS */}
          <section className="py-12 sm:py-16 px-4 border-t border-border bg-muted/30" data-testid="samples-section">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">See Them in Action</h2>
                <p className="text-muted-foreground text-sm sm:text-base">Real sample conversations with each expert</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {experts.slice(0, 6).map((expert) => {
                  const expertKey = Object.keys(EXPERT_PERSONAS_MAP).find(k => EXPERT_PERSONAS_MAP[k] === expert.name) || 'judgy';
                  const sample = SAMPLE_CONVERSATIONS[expertKey];
                  const IconComponent = ICON_MAP[expert.icon] || Zap;
                  
                  if (!sample) return null;
                  
                  return (
                    <div 
                      key={expert.name}
                      className="bg-card border border-border rounded-lg p-5 hover:shadow-elegant transition-all cursor-pointer"
                      onClick={() => selectExpertAndScroll(expertKey)}
                      data-testid={`sample-${expertKey}`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: expert.color }}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-display font-bold text-sm text-foreground">{expert.name}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="bg-primary/10 border border-primary/20 rounded-md px-3 py-2">
                          <p className="text-xs text-foreground font-medium">{sample.q}</p>
                        </div>
                        <div className="bg-muted border border-border rounded-md px-3 py-2">
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{sample.a}</p>
                        </div>
                      </div>
                      
                      <button className="mt-3 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all" style={{ color: expert.color }}>
                        Try this expert <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* VIRAL TOOLS */}
          <section className="py-12 sm:py-16 px-4 border-t border-border" data-testid="viral-tools-section">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">Viral Tools</h2>
                <p className="text-muted-foreground text-sm sm:text-base">Share-worthy results your friends will screenshot</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <Link to="/tools" className="group">
                  <div className="bg-card border border-border rounded-lg p-6 hover:shadow-elegant transition-all hover:-translate-y-1 text-center">
                    <div className="w-14 h-14 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Flame className="w-7 h-7 text-orange-500" />
                    </div>
                    <h3 className="font-display font-bold text-foreground mb-1">Roast My Bio</h3>
                    <p className="text-xs text-muted-foreground mb-3">Paste your dating/LinkedIn bio. Get roasted AND get a better version.</p>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF2E4C] group-hover:gap-2 flex items-center justify-center gap-1 transition-all">
                      Try it free <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>

                <Link to="/tools" className="group">
                  <div className="bg-card border border-border rounded-lg p-6 hover:shadow-elegant transition-all hover:-translate-y-1 text-center">
                    <div className="w-14 h-14 bg-red-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="w-7 h-7 text-red-500" />
                    </div>
                    <h3 className="font-display font-bold text-foreground mb-1">Red Flag Detector</h3>
                    <p className="text-xs text-muted-foreground mb-3">Paste a text convo. We'll find the red flags you're ignoring.</p>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF2E4C] group-hover:gap-2 flex items-center justify-center gap-1 transition-all">
                      Try it free <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>

                <Link to="/tools" className="group">
                  <div className="bg-card border border-border rounded-lg p-6 hover:shadow-elegant transition-all hover:-translate-y-1 text-center">
                    <div className="w-14 h-14 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Scale className="w-7 h-7 text-purple-500" />
                    </div>
                    <h3 className="font-display font-bold text-foreground mb-1">Who's Right?</h3>
                    <p className="text-xs text-muted-foreground mb-3">Present both sides of an argument. We'll deliver the verdict.</p>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF2E4C] group-hover:gap-2 flex items-center justify-center gap-1 transition-all">
                      Try it free <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* SOCIAL PROOF */}
          <section className="py-10 px-4 border-t border-border bg-muted/20" data-testid="social-proof">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-foreground">12K+</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Questions Asked</p>
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-foreground">6</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">AI Experts</p>
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-foreground">4.9</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">User Rating</p>
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-[#FF2E4C]">FREE</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">To Start</p>
                </div>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="py-12 sm:py-16 px-4 border-t border-border" data-testid="how-it-works">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">How It Works</h2>
                <p className="text-muted-foreground text-sm sm:text-base">Three steps to free expert advice</p>
              </div>
              
              <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6">
                <div className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-0 bg-card sm:bg-transparent border sm:border-0 border-border rounded-lg p-4 sm:p-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FF2E4C] flex items-center justify-center rounded-lg flex-shrink-0 sm:mx-auto sm:mb-4">
                    <span className="font-display font-bold text-xl sm:text-2xl text-white">1</span>
                  </div>
                  <div className="sm:text-center">
                    <h3 className="font-bold text-foreground mb-0.5 text-sm sm:text-base">Pick an AI Expert</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">Choose from 6 specialized AI assistants</p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-0 bg-card sm:bg-transparent border sm:border-0 border-border rounded-lg p-4 sm:p-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FFB800] flex items-center justify-center rounded-lg flex-shrink-0 sm:mx-auto sm:mb-4">
                    <span className="font-display font-bold text-xl sm:text-2xl text-black">2</span>
                  </div>
                  <div className="sm:text-center">
                    <h3 className="font-bold text-foreground mb-0.5 text-sm sm:text-base">Ask Anything Free</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">5 free messages. No signup. No credit card.</p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-0 bg-card sm:bg-transparent border sm:border-0 border-border rounded-lg p-4 sm:p-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-muted border border-border flex items-center justify-center rounded-lg flex-shrink-0 sm:mx-auto sm:mb-4">
                    <span className="font-display font-bold text-xl sm:text-2xl text-foreground">3</span>
                  </div>
                  <div className="sm:text-center">
                    <h3 className="font-bold text-foreground mb-0.5 text-sm sm:text-base">Get Expert Answers</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">Detailed, expert-level responses tailored to you</p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-10">
                <Button 
                  onClick={scrollToChat}
                  size="lg" 
                  className="bg-[#FF2E4C] hover:bg-[#E01F3D] text-white h-12 px-8 text-sm uppercase tracking-wider font-bold"
                >
                  <ArrowDown className="w-4 h-4 mr-2" /> Start Chatting Now
                </Button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* CHAT SECTION */}
      <section ref={chatSectionRef} className={cn("flex flex-col", chatStarted ? "flex-1 min-h-[calc(100vh-57px)]" : "min-h-[60vh] border-t border-border")} data-testid="chat-section">
        {/* Expert Selector Tabs */}
        <div className="border-b border-border bg-background/80 backdrop-blur-sm px-4 py-2 overflow-x-auto">
          <div className="max-w-2xl mx-auto flex items-center gap-1.5">
            {experts.map((expert) => {
              const expertKey = Object.keys(EXPERT_PERSONAS_MAP).find(k => EXPERT_PERSONAS_MAP[k] === expert.name) || 'judgy';
              const IconComponent = ICON_MAP[expert.icon] || Zap;
              
              return (
                <button
                  key={expert.name}
                  onClick={() => {
                    setSelectedExpert(expertKey);
                    setMessages([]);
                    setChatStarted(true);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap",
                    selectedExpert === expertKey
                      ? "text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  style={selectedExpert === expertKey ? { backgroundColor: expert.color } : {}}
                  data-testid={`expert-tab-${expertKey}`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{expert.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 px-4">
          <div className="max-w-2xl mx-auto py-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
                {experts.length > 0 && (() => {
                  const expert = experts.find(e => {
                    const key = Object.keys(EXPERT_PERSONAS_MAP).find(k => EXPERT_PERSONAS_MAP[k] === e.name);
                    return key === selectedExpert;
                  });
                  const IconComponent = expert ? (ICON_MAP[expert.icon] || Zap) : Zap;
                  
                  return (
                    <>
                      <div className="w-16 h-16 flex items-center justify-center rounded-lg mb-4" style={{ backgroundColor: expert?.color || '#FF2E4C' }}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1">
                        {expert?.name || 'The Judgy'}
                      </h2>
                      <p className="text-muted-foreground text-sm mb-1">{expert?.tagline}</p>
                      <p className="text-muted-foreground/60 text-xs mb-6 max-w-sm">{expert?.description}</p>
                    </>
                  );
                })()}

                {!isAuthenticated && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-md mb-6" data-testid="free-messages-badge">
                    <Zap className="w-3 h-3 text-[#FFB800]" />
                    <span className="text-xs text-muted-foreground">{remainingMessages} free messages</span>
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                  {quickPrompts.map((prompt, i) => (
                    <button 
                      key={i}
                      onClick={() => setInput(prompt)}
                      className="px-3 py-2 text-xs sm:text-sm bg-card border border-border hover:border-[#FF2E4C] text-muted-foreground hover:text-foreground transition-all rounded-md shadow-card"
                      data-testid={`quick-prompt-${i}`}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((message) => {
                  const expert = experts.find(e => {
                    const key = Object.keys(EXPERT_PERSONAS_MAP).find(k => EXPERT_PERSONAS_MAP[k] === e.name);
                    return key === selectedExpert;
                  });
                  const IconComponent = expert ? (ICON_MAP[expert.icon] || Zap) : Zap;
                  
                  return (
                    <div key={message.id} className={cn("flex gap-3 animate-slide-up", message.role === 'user' ? "flex-row-reverse" : "flex-row")} data-testid={`message-${message.role}`}>
                      <div className={cn("w-8 h-8 shrink-0 flex items-center justify-center rounded-sm", message.role === 'user' ? "bg-muted" : "")}
                        style={message.role !== 'user' ? { backgroundColor: expert?.color || '#FF2E4C' } : {}}
                      >
                        {message.role === 'user' ? (
                          <User className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <IconComponent className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={cn(
                        "max-w-[80%] px-4 py-3 text-sm rounded-lg whitespace-pre-wrap",
                        message.role === 'user' 
                          ? "bg-primary/10 border border-primary/20 text-foreground" 
                          : message.isError 
                            ? "bg-destructive/10 border border-destructive/30 text-destructive"
                            : "bg-card border border-border text-card-foreground shadow-card"
                      )}>
                        {message.content}
                      </div>
                    </div>
                  );
                })}
                
                {isLoading && (() => {
                  const expert = experts.find(e => {
                    const key = Object.keys(EXPERT_PERSONAS_MAP).find(k => EXPERT_PERSONAS_MAP[k] === e.name);
                    return key === selectedExpert;
                  });
                  const IconComponent = expert ? (ICON_MAP[expert.icon] || Zap) : Zap;
                  
                  return (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 flex items-center justify-center rounded-sm" style={{ backgroundColor: expert?.color || '#FF2E4C' }}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-card border border-border px-4 py-3 rounded-lg shadow-card flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  );
                })()}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Signup Prompt */}
        {showSignupPrompt && !isAuthenticated && (
          <div className="px-4 py-4 bg-[#FF2E4C]/5 border-t border-[#FF2E4C]/20" data-testid="signup-prompt">
            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-display font-bold text-foreground mb-1">Want more?</h3>
                <p className="text-sm text-muted-foreground">Sign up free and get 50 tokens to keep chatting with all experts</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleGoogleSignIn} className="bg-white hover:bg-gray-50 text-black font-bold flex items-center gap-2 border border-gray-200" data-testid="google-signup-prompt-btn">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Link to="/register">
                  <Button variant="outline" data-testid="email-signup-prompt-btn">Email</Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border bg-background/80 backdrop-blur-sm p-4" data-testid="chat-input-area">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end gap-2 bg-card border border-border focus-within:border-[#FF2E4C] rounded-lg transition-colors shadow-card">
              <div className="flex-1 min-w-0">
                {attachedImage && (
                  <div className="px-4 pt-3">
                    <ImagePreview file={attachedImage} onRemove={() => setAttachedImage(null)} />
                  </div>
                )}
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask ${experts.find(e => Object.keys(EXPERT_PERSONAS_MAP).find(k => EXPERT_PERSONAS_MAP[k] === e.name) === selectedExpert)?.name || 'The Judgy'} anything...`}
                  disabled={isLoading || (showSignupPrompt && !isAuthenticated)}
                  className="min-h-[48px] max-h-[150px] resize-none border-0 bg-transparent focus-visible:ring-0 text-foreground placeholder:text-muted-foreground py-3 px-4 text-sm"
                  rows={1}
                  data-testid="landing-chat-input"
                />
              </div>
              <div className="flex items-center gap-0.5 p-1.5">
                <VoiceButton onTranscription={(text) => setInput(prev => prev + text)} disabled={isLoading || (showSignupPrompt && !isAuthenticated)} />
                <ImageUploadButton onImageSelected={(file) => setAttachedImage(file)} disabled={isLoading || (showSignupPrompt && !isAuthenticated)} />
                <Button
                  onClick={sendMessage}
                  disabled={(!input.trim() && !attachedImage) || isLoading || (showSignupPrompt && !isAuthenticated)}
                  size="icon"
                  className={cn(
                    "h-10 w-10 rounded-md transition-colors",
                    (input.trim() || attachedImage) && !isLoading
                      ? "bg-[#FF2E4C] hover:bg-[#E01F3D] text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                  data-testid="landing-send-btn"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              Press Enter to send — Voice & image supported
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

// Mapping expert keys to display names (matches backend EXPERT_PERSONAS)
const EXPERT_PERSONAS_MAP = {
  judgy: "The Judgy",
  translator: "LinguaBot",
  realtor: "PropWhiz",
  coder: "CodeForge",
  social: "ViralMind",
  fitness: "IronCoach",
};

const QUICK_PROMPTS = {
  judgy: ["Should I text my ex?", "Roast my life choices", "Am I being underpaid?", "Am I the toxic one?"],
  translator: ["Translate 'hello' to 10 languages", "Teach me basic Japanese", "How do you say 'thank you' in Arabic?", "French vs Spanish - which is easier?"],
  realtor: ["Is now a good time to buy?", "How to negotiate a home price", "Rent vs buy - help me decide", "What red flags to look for in a house?"],
  coder: ["Explain async/await simply", "Review my code approach", "React vs Next.js for my project", "How to center a div (for real)"],
  social: ["How to grow on TikTok fast", "Write me a viral hook", "Best posting times in 2025", "Instagram Reels vs TikTok strategy"],
  fitness: ["I want to lose 20 lbs", "Home workout no equipment", "How much protein do I need?", "Beginner gym routine"],
};

export default LandingPage;
