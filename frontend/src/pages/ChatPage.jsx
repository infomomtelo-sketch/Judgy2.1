import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext';
import ChatHeader from '../components/chat/ChatHeader';
import ChatMessages from '../components/chat/ChatMessages';
import ChatInput from '../components/chat/ChatInput';
import ToolsPanel from '../components/chat/ToolsPanel';
import UpgradeModal from '../components/subscription/UpgradeModal';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    const stored = localStorage.getItem('chat_session_id');
    return stored || uuidv4();
  });
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
  const [remainingMessages, setRemainingMessages] = useState(-1);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { user, subscription, refreshSubscription, isPro } = useAuth();
  const navigate = useNavigate();

  // Save session ID to localStorage
  useEffect(() => {
    localStorage.setItem('chat_session_id', sessionId);
  }, [sessionId]);

  // Update remaining messages from subscription
  useEffect(() => {
    if (subscription) {
      setRemainingMessages(subscription.remaining_messages);
    }
  }, [subscription]);

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
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
  }, [sessionId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || isLoading) return;

    // Check if user has remaining messages (for free plan)
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
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        session_id: sessionId,
        message: content.trim()
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
      
      // Check if it's a limit exceeded error
      if (error.response?.status === 403) {
        setShowUpgradeModal(true);
        // Remove the user message we just added
        setMessages(prev => prev.slice(0, -1));
      } else {
        const errorMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isLoading, remainingMessages]);

  const handleContinue = useCallback(() => {
    sendMessage('Please continue');
  }, [sendMessage]);

  const handleNewChat = useCallback(async () => {
    try {
      await axios.delete(`${API}/chat/${sessionId}`);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
    
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setMessages([]);
    localStorage.setItem('chat_session_id', newSessionId);
    
    // Refresh subscription to get updated message count
    refreshSubscription();
  }, [sessionId, refreshSubscription]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0">
        <ChatHeader 
          onNewChat={handleNewChat}
          onToggleTools={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
          isMobileToolsOpen={isMobileToolsOpen}
          remainingMessages={remainingMessages}
          isPro={isPro}
        />
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <ChatMessages 
            messages={messages} 
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
          />
          
          <ChatInput 
            onSendMessage={sendMessage}
            onContinue={handleContinue}
            isLoading={isLoading}
            hasMessages={messages.length > 0}
            remainingMessages={remainingMessages}
            onUpgrade={() => setShowUpgradeModal(true)}
          />
        </div>
      </div>

      {/* Tools Panel - Right Side */}
      <ToolsPanel 
        isOpen={isMobileToolsOpen}
        onClose={() => setIsMobileToolsOpen(false)}
      />

      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => navigate('/pricing')}
      />
    </div>
  );
};

export default ChatPage;
