import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Send, Loader2, Coins, User, Zap, Sun, Moon, Globe, Home, Code, 
  TrendingUp, Dumbbell, MessageSquarePlus, LogOut, Share2, CreditCard,
  ArrowRight
} from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ICON_MAP = { Zap, Globe, Home, Code, TrendingUp, Dumbbell };
const EXPERT_KEY_MAP = {
  "The Judgy": "judgy", "LinguaBot": "translator", "PropWhiz": "realtor",
  "CodeForge": "coder", "ViralMind": "social", "IronCoach": "fitness",
};

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState('judgy');
  const [experts, setExperts] = useState([]);
  const [baseSessionId] = useState(() => {
    const stored = localStorage.getItem('chat_session_id');
    return stored || uuidv4();
  });
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  
  const { user, refreshTokens, tokens, logout, addFreeTokens } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const sessionId = `${baseSessionId}_${selectedExpert}`;

  useEffect(() => {
    localStorage.setItem('chat_session_id', baseSessionId);
  }, [baseSessionId]);

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

  // Load chat history when expert changes
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await axios.get(`${API}/chat/${sessionId}/history`);
        if (response.data && response.data.length > 0) {
          setMessages(response.data.map(msg => ({
            id: msg.id, role: msg.role, content: msg.content,
            timestamp: new Date(msg.timestamp)
          })));
        } else {
          setMessages([]);
        }
      } catch (error) {
        setMessages([]);
      }
    };
    loadHistory();
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || tokens <= 0) return;

    const userMessage = { id: uuidv4(), role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        session_id: sessionId,
        message: userMessage.content,
        personality: selectedExpert
      });
      setMessages(prev => [...prev, {
        id: response.data.message_id, role: 'assistant',
        content: response.data.response, timestamp: new Date()
      }]);
      refreshTokens();
    } catch (error) {
      if (error.response?.status === 403) {
        setMessages(prev => prev.slice(0, -1));
        refreshTokens();
      } else {
        setMessages(prev => [...prev, {
          id: uuidv4(), role: 'assistant', content: 'Something went wrong. Try again.',
          timestamp: new Date(), isError: true
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, tokens, sessionId, selectedExpert, refreshTokens]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleNewChat = () => {
    const newId = uuidv4();
    localStorage.setItem('chat_session_id', newId);
    window.location.reload();
  };

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const currentExpert = experts.find(e => {
    const key = Object.entries(EXPERT_KEY_MAP).find(([name]) => name === e.name)?.[1];
    return key === selectedExpert;
  });
  const CurrentIcon = currentExpert ? (ICON_MAP[currentExpert.icon] || Zap) : Zap;

  const isOutOfTokens = tokens <= 0;

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background" data-testid="chat-page">
      {/* Header */}
      <header className="glass-header px-4 py-3 flex items-center justify-between" data-testid="chat-header">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted" data-testid="home-btn">
              <Home className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Center - Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-sm" style={{ backgroundColor: currentExpert?.color || '#FF2E4C' }}>
            <CurrentIcon className="w-5 h-5 text-white" />
          </div>
          <div className="text-center hidden sm:block">
            <h1 className="font-display text-base font-bold text-foreground tracking-tight">{currentExpert?.name || 'The Judgy'}</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{currentExpert?.tagline || 'Brutal Honesty'}</p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground hover:bg-muted" data-testid="theme-toggle">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted border border-border hover:border-[#FFB800] transition-colors rounded-md" data-testid="token-counter"
            onClick={async () => { if (tokens <= 5) { try { await addFreeTokens(); } catch (e) {} } }}
          >
            <Coins className="w-3 h-3 text-[#FFB800]" />
            <span className="text-sm font-bold text-foreground">{tokens}</span>
            <span className="text-xs text-muted-foreground uppercase">tokens</span>
          </button>

          <Button variant="ghost" size="icon" onClick={handleNewChat} className="text-muted-foreground hover:text-foreground hover:bg-muted" title="New Chat" data-testid="new-chat-btn">
            <MessageSquarePlus className="w-5 h-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted" data-testid="user-menu-trigger">
                <div className="w-8 h-8 bg-muted border border-border flex items-center justify-center rounded-md">
                  <span className="text-xs font-bold text-foreground">{getInitials(user?.name)}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border text-card-foreground">
              <DropdownMenuLabel>
                <p className="font-bold text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem onClick={() => navigate('/')} className="cursor-pointer"><Home className="w-4 h-4 mr-2" />Home</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/pricing')} className="cursor-pointer"><CreditCard className="w-4 h-4 mr-2" />Get Tokens</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/tools')} className="cursor-pointer"><Zap className="w-4 h-4 mr-2" />Viral Tools</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer"><TrendingUp className="w-4 h-4 mr-2" />Admin</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive"><LogOut className="w-4 h-4 mr-2" />Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Expert Selector Tabs */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm px-4 py-2 overflow-x-auto" data-testid="expert-tabs">
        <div className="max-w-3xl mx-auto flex items-center gap-1.5">
          {experts.map((expert) => {
            const expertKey = Object.entries(EXPERT_KEY_MAP).find(([name]) => name === expert.name)?.[1] || 'judgy';
            const IconComponent = ICON_MAP[expert.icon] || Zap;
            return (
              <button
                key={expert.name}
                onClick={() => { setSelectedExpert(expertKey); setMessages([]); }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap",
                  selectedExpert === expertKey ? "text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted"
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

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 px-4">
          <div className="max-w-3xl mx-auto py-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                <div className="w-16 h-16 flex items-center justify-center rounded-lg mb-4" style={{ backgroundColor: currentExpert?.color || '#FF2E4C' }}>
                  <CurrentIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1">{currentExpert?.name || 'The Judgy'}</h2>
                <p className="text-muted-foreground text-sm mb-1">{currentExpert?.tagline}</p>
                <p className="text-muted-foreground/60 text-xs mb-6 max-w-sm">{currentExpert?.description}</p>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-md mb-6">
                  <Coins className="w-3 h-3 text-[#FFB800]" />
                  <span className="text-xs font-bold text-[#FFB800] uppercase tracking-wider">{tokens} Tokens</span>
                </div>

                <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                  {(QUICK_PROMPTS[selectedExpert] || QUICK_PROMPTS.judgy).map((prompt, i) => (
                    <button key={i} onClick={() => setInput(prompt)} className="px-3 py-2 text-xs sm:text-sm bg-card border border-border hover:border-[#FF2E4C] text-muted-foreground hover:text-foreground transition-all rounded-md shadow-card" data-testid={`prompt-${i}`}>
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((message) => (
                  <div key={message.id} className={cn("flex gap-3 animate-slide-up", message.role === 'user' ? "flex-row-reverse" : "flex-row")} data-testid={`chat-bubble-${message.role}`}>
                    <div className={cn("w-8 h-8 shrink-0 flex items-center justify-center rounded-sm", message.role === 'user' ? "bg-muted" : "")}
                      style={message.role !== 'user' ? { backgroundColor: currentExpert?.color || '#FF2E4C' } : {}}
                    >
                      {message.role === 'user' ? <User className="w-4 h-4 text-muted-foreground" /> : <CurrentIcon className="w-4 h-4 text-white" />}
                    </div>
                    <div className={cn(
                      "max-w-[80%] px-4 py-3 text-sm rounded-lg whitespace-pre-wrap",
                      message.role === 'user' ? "bg-primary/10 border border-primary/20 text-foreground"
                        : message.isError ? "bg-destructive/10 border border-destructive/30 text-destructive"
                        : "bg-card border border-border text-card-foreground shadow-card"
                    )}>
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-sm" style={{ backgroundColor: currentExpert?.color || '#FF2E4C' }}>
                      <CurrentIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-card border border-border px-4 py-3 rounded-lg shadow-card flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border bg-background/80 backdrop-blur-sm p-4" data-testid="chat-input-container">
          <div className="max-w-3xl mx-auto">
            {/* Out of Tokens */}
            {isOutOfTokens && (
              <div className="mb-4 p-4 bg-card border border-[#FFB800]/30 rounded-lg" data-testid="out-of-tokens-warning">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FFB800] flex items-center justify-center flex-shrink-0 rounded-md">
                    <Coins className="w-6 h-6 text-black" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display font-bold text-foreground mb-1 uppercase">Out of Tokens</h4>
                    <p className="text-sm text-muted-foreground mb-3">Get more tokens to keep chatting!</p>
                    <div className="flex gap-2">
                      <Button className="bg-[#FFB800] hover:bg-[#E5A600] text-black font-bold text-sm" onClick={async () => { try { await addFreeTokens(); } catch (e) {} }}>Get Free Tokens</Button>
                      <Button variant="outline" className="text-sm" onClick={() => navigate('/pricing')}>Buy Tokens</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Continue button */}
            {messages.length > 0 && !isLoading && !isOutOfTokens && (
              <div className="flex justify-center mb-3">
                <Button variant="outline" size="sm" onClick={() => { setInput('Please continue'); setTimeout(sendMessage, 100); }}
                  className="gap-2 hover:border-[#FF2E4C] hover:bg-[#FF2E4C]/5 text-muted-foreground hover:text-foreground uppercase tracking-wider text-xs font-bold" data-testid="continue-btn">
                  <ArrowRight className="w-4 h-4" /> Continue
                </Button>
              </div>
            )}

            <div className={cn("flex items-end gap-2 bg-card border rounded-lg transition-colors shadow-card", isOutOfTokens ? "border-border opacity-50" : "border-border focus-within:border-[#FF2E4C]")}>
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isOutOfTokens ? "Get tokens to continue..." : `Ask ${currentExpert?.name || 'The Judgy'} anything...`}
                disabled={isLoading || isOutOfTokens}
                className="flex-1 min-h-[52px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground py-4 px-4 text-sm"
                rows={1}
                data-testid="chat-input"
              />
              <div className="flex items-center gap-1 p-2">
                <Button type="button" size="icon" onClick={sendMessage} disabled={!input.trim() || isLoading || isOutOfTokens}
                  className={cn("h-10 w-10 rounded-md transition-colors", input.trim() && !isLoading && !isOutOfTokens ? "bg-[#FF2E4C] hover:bg-[#E01F3D] text-white" : "bg-muted text-muted-foreground")}
                  data-testid="send-btn"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Enter to send — 1 token per message</p>
              {tokens > 0 && <span className={cn("text-[10px] uppercase tracking-wider font-bold sm:hidden", tokens <= 5 ? "text-[#FFB800]" : "text-muted-foreground")}>{tokens} tokens</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QUICK_PROMPTS = {
  judgy: ["Should I text my ex?", "Roast my life choices", "Am I being underpaid?", "Am I the toxic one?"],
  translator: ["Translate 'hello' to 10 languages", "Teach me basic Japanese", "How do you say 'thank you' in Arabic?", "French vs Spanish?"],
  realtor: ["Is now a good time to buy?", "How to negotiate a home price", "Rent vs buy?", "Red flags in a house listing?"],
  coder: ["Explain async/await simply", "Review my code approach", "React vs Next.js?", "How to center a div?"],
  social: ["How to grow on TikTok", "Write me a viral hook", "Best posting times?", "Instagram vs TikTok strategy?"],
  fitness: ["I want to lose 20 lbs", "Home workout no equipment", "How much protein?", "Beginner gym routine"],
};

export default ChatPage;
