import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Coins, User, Zap, Sun, Moon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { cn } from '@/lib/utils';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LandingPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => localStorage.getItem('anon_session_id') || uuidv4());
  const [remainingMessages, setRemainingMessages] = useState(5);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  
  const { isAuthenticated, user, tokens, refreshTokens } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('anon_session_id', sessionId);
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response;
      
      if (isAuthenticated) {
        response = await axios.post(`${API}/chat`, {
          session_id: sessionId,
          message: userMessage.content
        });
        refreshTokens();
      } else {
        response = await axios.post(`${API}/chat/anonymous`, {
          session_id: sessionId,
          message: userMessage.content
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
      console.error('Error sending message:', error);
      
      if (error.response?.status === 403) {
        setShowSignupPrompt(true);
      } else {
        const errorMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: 'Something went wrong. Try again.',
          timestamp: new Date(),
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isAuthenticated, sessionId, refreshTokens]);

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

  const quickPrompts = [
    "Should I text my ex?",
    "Roast my life choices",
    "Am I being underpaid?",
    "Give me tough love",
    "Rate my dating profile bio",
    "Am I the toxic one?",
    "Judge my morning routine",
    "Is my business idea stupid?"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" data-testid="landing-page">
      {/* Header */}
      <header className="glass-header px-4 py-3 flex items-center justify-between" data-testid="landing-header">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF2E4C] flex items-center justify-center rounded-sm">
            <span className="font-display font-bold text-lg text-white">J</span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-foreground">THE JUDGY</span>
        </div>
        
        <div className="flex items-center gap-2">
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
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-md">
                <Coins className="w-3 h-3 text-[#FFB800]" />
                <span className="text-sm font-bold text-foreground">{tokens}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/chat')}
                className="text-muted-foreground hover:text-foreground"
                data-testid="full-chat-btn"
              >
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
            </>
          )}
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 px-4">
          <div className="max-w-2xl mx-auto py-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                <div className="w-16 h-16 bg-[#FF2E4C] flex items-center justify-center rounded-sm mb-6">
                  <span className="font-display font-bold text-3xl text-white">J</span>
                </div>
                
                <h1 className="font-display text-3xl sm:text-5xl font-bold mb-3 text-foreground" data-testid="welcome-heading">
                  THE TRUTH <span className="text-[#FF2E4C]">HURTS.</span>
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-md">
                  Ask me anything. I'll give you brutally honest advice with zero sugarcoating.
                </p>
                
                {!isAuthenticated && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-md mb-8" data-testid="free-messages-badge">
                    <Zap className="w-3 h-3 text-[#FFB800]" />
                    <span className="text-xs text-muted-foreground">{remainingMessages} free messages — no signup needed</span>
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-2 max-w-xl">
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
              <div className="space-y-6">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={cn(
                      "flex gap-3 animate-slide-up",
                      message.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}
                    data-testid={`message-${message.role}`}
                  >
                    <div className={cn(
                      "w-8 h-8 shrink-0 flex items-center justify-center rounded-sm",
                      message.role === 'user' ? "bg-muted" : "bg-[#FF2E4C]"
                    )}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Zap className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={cn(
                      "max-w-[80%] px-4 py-3 text-sm rounded-lg",
                      message.role === 'user' 
                        ? "bg-primary/10 border border-primary/20 text-foreground" 
                        : message.isError 
                          ? "bg-destructive/10 border border-destructive/30 text-destructive"
                          : "bg-card border border-border text-card-foreground shadow-card"
                    )}>
                      {message.content}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-[#FF2E4C] flex items-center justify-center rounded-sm">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-card border border-border px-4 py-3 rounded-lg shadow-card">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                
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
                <h3 className="font-display font-bold text-foreground mb-1">Want more brutal honesty?</h3>
                <p className="text-sm text-muted-foreground">Sign up free and get 50 tokens to continue</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleGoogleSignIn}
                  className="bg-white hover:bg-gray-50 text-black font-bold flex items-center gap-2 border border-gray-200"
                  data-testid="google-signup-prompt-btn"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
                <Link to="/register">
                  <Button variant="outline" data-testid="email-signup-prompt-btn">
                    Email
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border bg-background/80 backdrop-blur-sm p-4" data-testid="chat-input-area">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end gap-2 bg-card border border-border focus-within:border-[#FF2E4C] rounded-lg transition-colors shadow-card">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything... I won't hold back."
                disabled={isLoading || (showSignupPrompt && !isAuthenticated)}
                className="flex-1 min-h-[48px] max-h-[150px] resize-none border-0 bg-transparent focus-visible:ring-0 text-foreground placeholder:text-muted-foreground py-3 px-4 text-sm"
                rows={1}
                data-testid="landing-chat-input"
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading || (showSignupPrompt && !isAuthenticated)}
                size="icon"
                className={cn(
                  "h-10 w-10 m-1 rounded-md transition-colors",
                  input.trim() && !isLoading
                    ? "bg-[#FF2E4C] hover:bg-[#E01F3D] text-white"
                    : "bg-muted text-muted-foreground"
                )}
                data-testid="landing-send-btn"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              Press Enter to send — Brutally honest AI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
