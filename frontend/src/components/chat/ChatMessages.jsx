import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';
import WelcomeMessage from './WelcomeMessage';

const ChatMessages = ({ messages, isLoading, messagesEndRef }) => {
  return (
    <ScrollArea className="flex-1 px-4 py-6">
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
    </ScrollArea>
  );
};

export default ChatMessages;
