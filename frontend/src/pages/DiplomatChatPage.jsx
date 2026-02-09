import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Loader2, 
  ArrowLeft, 
  Plus, 
  Scale,
  Heart,
  MessageCircle,
  Crown,
  Sparkles,
  Menu,
  X,
  User
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// The Diplomat Logo
const DIPLOMAT_LOGO = "https://customer-assets.emergentagent.com/job_ai-persona-hub-8/artifacts/k884xcbn_IMG_6765.png";

const DiplomatChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    const stored = localStorage.getItem('diplomat_session_id');
    return stored || uuidv4();
  });
  const [remainingMessages, setRemainingMessages] = useState(-1);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const { user, subscription, refreshSubscription, isPremium, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Save session ID
  useEffect(() => {
    localStorage.setItem('diplomat_session_id', sessionId);
  }, [sessionId]);

  // Update remaining messages
  useEffect(() => {
    if (subscription) {
      setRemainingMessages(subscription.remaining_messages);
    }
  }, [subscription]);

  // Load chat history
  useEffect(() => {
    const loadHistory = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await axios.get(`${API}/chat/${sessionId}/history`);
        if (response.data && response.data.length > 0) {
          setMessages(response.data.map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp)
          })));
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    loadHistory();
  }, [sessionId, isAuthenticated]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || isLoading) return;

    if (remainingMessages === 0) {
      setShowUpgradeModal(true);
      return;
    }

    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        session_id: sessionId,
        message: content.trim(),
        personality: 'diplomat'
      });

      const aiMessage = {
        id: response.data.message_id,
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setRemainingMessages(response.data.remaining_messages);
    } catch (error) {
      console.error('Error sending message:', error);
      
      if (error.response?.status === 403) {
        setShowUpgradeModal(true);
        setMessages(prev => prev.slice(0, -1));
      } else {
        const errorMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: 'Hmm, something went wrong on my end. Technical difficulties - not unlike my marriage. Try again? 😅',
          timestamp: new Date(),
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isLoading, remainingMessages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleNewChat = async () => {
    try {
      await axios.delete(`${API}/chat/${sessionId}`);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
    
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setMessages([]);
    localStorage.setItem('diplomat_session_id', newSessionId);
    refreshSubscription();
  };

  const suggestedQuestions = [
    "My partner and I had a fight. Help us not end up like you and JudgyGPT 😅",
    "She says I never listen. I say... wait, what?",
    "How do I rebuild trust after I messed up?",
    "Should we stay together or call it?"
  ];

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-pink-500 mb-6">
            <img src={DIPLOMAT_LOGO} alt="The Diplomat" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Meet The Diplomat</h1>
          <p className="text-gray-600 mb-6">JudgyGPT's ex-husband. Relationship wisdom with a side of self-deprecating humor.</p>
          <div className="space-y-3">
            <Link to="/login" className="block">
              <Button className="w-full bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600">
                Sign In
              </Button>
            </Link>
            <Link to="/register" className="block">
              <Button variant="outline" className="w-full border-pink-500/50 hover:border-pink-500">
                Create Account
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-pink-100 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-pink-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-500">
                  <img src={DIPLOMAT_LOGO} alt="The Diplomat" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">The Diplomat</h2>
                  <p className="text-xs text-pink-500">Marriage & Relationships</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <Button 
              onClick={handleNewChat}
              className="w-full bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Conversation
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-pink-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                <User className="w-4 h-4 text-pink-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Badge className={`${isPremium ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {subscription?.plan?.name || 'Free Plan'}
            </Badge>
            {remainingMessages >= 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {remainingMessages} messages remaining today
              </p>
            )}
          </div>

          {/* Navigation */}
          <div className="p-4 flex-1">
            <p className="text-xs font-medium text-gray-400 uppercase mb-3">Navigate</p>
            <div className="space-y-2">
              <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-pink-50 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Hub
              </Link>
              <Link to="/chat" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-pink-50 transition-colors">
                <MessageCircle className="w-4 h-4" />
                Talk to JudgyGPT
              </Link>
              <Link to="/pricing" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-pink-50 transition-colors">
                <Crown className="w-4 h-4" />
                Upgrade Plan
              </Link>
            </div>
          </div>

          {/* Footer Quote */}
          <div className="p-4 border-t border-pink-100">
            <p className="text-xs text-gray-400 italic">
              "She says I was too diplomatic. I say she never appreciated how I labeled the spice rack."
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-pink-50 rounded-lg"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-pink-500">
                <img src={DIPLOMAT_LOGO} alt="The Diplomat" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">The Diplomat</h1>
                <p className="text-xs text-pink-500">Online • Ready to help</p>
              </div>
            </div>
          </div>
          
          {remainingMessages >= 0 && (
            <Badge variant="outline" className="border-pink-200 text-pink-600">
              {remainingMessages} left today
            </Badge>
          )}
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-500 shadow-lg mb-6">
                <img src={DIPLOMAT_LOGO} alt="The Diplomat" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Hey there, friend.</h2>
              <p className="text-gray-600 mb-6 max-w-md">
                I'm The Diplomat - JudgyGPT's ex-husband. Yes, <em>that</em> ex. I bring relationship wisdom with a side of self-deprecating humor. What's on your mind?
              </p>
              
              <div className="grid gap-3 w-full max-w-md">
                {suggestedQuestions.map((question, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(question)}
                    className="p-3 text-left text-sm bg-white border border-pink-200 rounded-xl hover:border-pink-400 hover:bg-pink-50 transition-all"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-pink-500 shrink-0">
                        <img src={DIPLOMAT_LOGO} alt="The Diplomat" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white'
                          : 'bg-white border border-pink-100 text-gray-800'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-pink-500 shrink-0">
                      <img src={DIPLOMAT_LOGO} alt="The Diplomat" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white border border-pink-100 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-pink-500" />
                        <span className="text-sm text-gray-500">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-pink-100 bg-white/80 backdrop-blur-sm p-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What relationship drama can I help with today?"
                className="flex-1 px-4 py-3 bg-white border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 px-6"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            {messages.length > 0 && (
              <div className="mt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => sendMessage('Please continue')}
                  className="text-sm text-pink-500 hover:text-pink-600 hover:underline"
                  disabled={isLoading}
                >
                  Continue response →
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-pink-100 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-pink-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Need More Advice?</h3>
            <p className="text-gray-600 mb-6">
              You've used all your free messages today. Upgrade to keep the conversation going!
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/pricing')}
                className="w-full bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600"
              >
                <Crown className="w-4 h-4 mr-2" />
                View Plans
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setShowUpgradeModal(false)}
                className="w-full"
              >
                Maybe Later
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DiplomatChatPage;
