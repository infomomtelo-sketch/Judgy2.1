import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';
import WelcomeMessage from './WelcomeMessage';

const ChatMessages = ({ messages, isLoading, messagesEndRef }) => {
  return (
    <ScrollArea className="flex-1 relative overflow-hidden bg-[#0A0A0A]">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `linear-gradient(rgba(255,46,76,0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,46,76,0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
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
