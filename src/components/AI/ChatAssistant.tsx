
import React from 'react';
import EnhancedChatAssistant from './EnhancedChatAssistant';

interface ChatAssistantProps {
  propertyId?: string;
  maintenanceRequestId?: string;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ 
  propertyId, 
  maintenanceRequestId 
}) => {
  // Use the enhanced version which handles role-specific features
  return <EnhancedChatAssistant />;
};

export default ChatAssistant;
