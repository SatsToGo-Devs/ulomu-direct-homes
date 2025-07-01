
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  MessageCircle, 
  Wrench, 
  CreditCard, 
  Phone,
  Lightbulb
} from 'lucide-react';

interface ChatMessage {
  id: string;
  message_type: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  metadata?: any;
}

interface ChatAssistantProps {
  propertyId?: string;
  maintenanceRequestId?: string;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ 
  propertyId, 
  maintenanceRequestId 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadChatHistory();
      setupRealtimeSubscription();
    }
  }, [user, propertyId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = async () => {
    try {
      const query = supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });

      if (propertyId) {
        query.eq('property_id', propertyId);
      }
      if (maintenanceRequestId) {
        query.eq('maintenance_request_id', maintenanceRequestId);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;

      setMessages(data || []);

      // Add welcome message if no chat history
      if (!data || data.length === 0) {
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          message_type: 'assistant',
          content: "👋 Hi! I'm Ulomu's AI assistant. I'm here to help you with property management, maintenance requests, and any questions you might have. How can I assist you today?",
          created_at: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
        setSuggestions([
          "I need to report a maintenance issue",
          "How do I make a payment?",
          "Contact my landlord",
          "Check my property details"
        ]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          if (newMessage.message_type === 'assistant') {
            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (messageText?: string) => {
    const message = messageText || inputMessage.trim();
    if (!message || !user) return;

    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      message_type: 'user',
      content: message,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat-assistant', {
        body: {
          message,
          userId: user.id,
          propertyId,
          maintenanceRequestId
        }
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        message_type: 'assistant',
        content: data.message,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      }

    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Message Failed",
        description: "Unable to send message. Please try again.",
        variant: "destructive"
      });

      // Remove the user message if it failed
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
    setSuggestions([]);
  };

  const getActionButton = (content: string) => {
    if (content.toLowerCase().includes('maintenance')) {
      return (
        <Button size="sm" variant="outline" className="mt-2">
          <Wrench className="h-3 w-3 mr-1" />
          Create Request
        </Button>
      );
    }
    if (content.toLowerCase().includes('payment')) {
      return (
        <Button size="sm" variant="outline" className="mt-2">
          <CreditCard className="h-3 w-3 mr-1" />
          Make Payment
        </Button>
      );
    }
    if (content.toLowerCase().includes('contact')) {
      return (
        <Button size="sm" variant="outline" className="mt-2">
          <Phone className="h-3 w-3 mr-1" />
          Contact
        </Button>
      );
    }
    return null;
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-terracotta" />
          AI Assistant
          <Badge variant="secondary" className="ml-auto">
            <Bot className="h-3 w-3 mr-1" />
            Online
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.message_type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.message_type === 'user' 
                  ? 'bg-terracotta text-white' 
                  : 'bg-forest text-white'
              }`}>
                {message.message_type === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              
              <div className={`flex-1 max-w-[80%] ${
                message.message_type === 'user' ? 'text-right' : 'text-left'
              }`}>
                <div className={`inline-block p-3 rounded-lg ${
                  message.message_type === 'user'
                    ? 'bg-terracotta text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.message_type === 'assistant' && getActionButton(message.content)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-gray-100 rounded-lg rounded-bl-none p-3">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="px-4 py-2 border-t bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium text-gray-700">Quick Actions:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={isLoading}
            />
            <Button 
              onClick={() => sendMessage()} 
              disabled={!inputMessage.trim() || isLoading}
              className="bg-terracotta hover:bg-terracotta/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatAssistant;
