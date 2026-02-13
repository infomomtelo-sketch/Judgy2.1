import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';
import WelcomeMessage from './WelcomeMessage';

const ChatMessages = ({ messages, isLoading, messagesEndRef }) => {
  return (
    <ScrollArea className="flex-1 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 chat-bg-animated">
        <div className="floating-shape floating-shape-1"></div>
        <div className="floating-shape floating-shape-2"></div>
        <div className="floating-shape floating-shape-3"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && !isLoading && (
            <WelcomeMessage />
          )}
          
          {messages.map((message, index) => (
            <ChatBubble 
              key={message.id} 
              message={message}
              isLast={index === messages.length - 1}
            />
          ))}
          
          {isLoading && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
