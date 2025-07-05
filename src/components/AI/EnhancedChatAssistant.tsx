
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
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
  Lightbulb,
  Home,
  Users,
  Settings,
  TrendingUp
} from 'lucide-react';

interface ChatMessage {
  id: string;
  message_type: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  metadata?: any;
}

const EnhancedChatAssistant = () => {
  const { user } = useAuth();
  const { isAdmin, isLandlord, isVendor, isTenant } = useUserRole();
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
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getRoleSpecificWelcome = () => {
    if (isAdmin()) {
      return "👨‍💼 Hi! I'm your Admin AI Assistant. I can help you with system management, user analytics, platform monitoring, and administrative tasks. How can I assist you today?";
    } else if (isLandlord()) {
      return "🏠 Hi! I'm your Property Manager AI. I can help you with tenant management, property maintenance, rent collection, financial insights, and property optimization. What would you like to know?";
    } else if (isVendor()) {
      return "🔧 Hi! I'm your Vendor Assistant. I can help you with job opportunities, proposal creation, work scheduling, earnings optimization, and business growth. How can I help you succeed?";
    } else if (isTenant()) {
      return "🏡 Hi! I'm your Tenant Helper. I can assist you with maintenance requests, payment inquiries, lease questions, and communication with your landlord. What do you need help with?";
    }
    return "👋 Hi! I'm Ulomu's AI assistant. How can I help you today?";
  };

  const getRoleSpecificSuggestions = () => {
    if (isAdmin()) {
      return [
        "Show system performance metrics",
        "Generate user activity report", 
        "Help with platform maintenance",
        "Review security settings"
      ];
    } else if (isLandlord()) {
      return [
        "Analyze property performance",
        "Create tenant communication",
        "Schedule maintenance tasks",
        "Review rental income"
      ];
    } else if (isVendor()) {
      return [
        "Find new job opportunities",
        "Create work proposal",
        "Track earnings and performance",
        "Optimize service offerings"
      ];
    } else if (isTenant()) {
      return [
        "Report maintenance issue",
        "Check payment status",
        "Contact my landlord",
        "Ask about lease terms"
      ];
    }
    return [
      "General assistance",
      "Platform information",
      "Account help",
      "Technical support"
    ];
  };

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      const typedMessages = (data || []).map(msg => ({
        ...msg,
        message_type: msg.message_type as 'user' | 'assistant' | 'system'
      }));

      setMessages(typedMessages);

      if (!data || data.length === 0) {
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          message_type: 'assistant',
          content: getRoleSpecificWelcome(),
          created_at: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
        setSuggestions(getRoleSpecificSuggestions());
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('enhanced-chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          const newMessage = {
            ...payload.new,
            message_type: payload.new.message_type as 'user' | 'assistant' | 'system'
          } as ChatMessage;
          
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
      // Get user role context
      const roleContext = {
        isAdmin: isAdmin(),
        isLandlord: isLandlord(),
        isVendor: isVendor(),
        isTenant: isTenant()
      };

      const { data, error } = await supabase.functions.invoke('ai-chat-assistant', {
        body: {
          message,
          userId: user.id,
          roleContext
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
    if (content.toLowerCase().includes('payment') || content.toLowerCase().includes('rent')) {
      return (
        <Button size="sm" variant="outline" className="mt-2">
          <CreditCard className="h-3 w-3 mr-1" />
          Make Payment
        </Button>
      );
    }
    if (content.toLowerCase().includes('contact') || content.toLowerCase().includes('landlord')) {
      return (
        <Button size="sm" variant="outline" className="mt-2">
          <Phone className="h-3 w-3 mr-1" />
          Contact
        </Button>
      );
    }
    if (content.toLowerCase().includes('property') && isLandlord()) {
      return (
        <Button size="sm" variant="outline" className="mt-2">
          <Home className="h-3 w-3 mr-1" />
          Manage Property
        </Button>
      );
    }
    return null;
  };

  const getRoleIcon = () => {
    if (isAdmin()) return <Settings className="h-3 w-3 mr-1" />;
    if (isLandlord()) return <Home className="h-3 w-3 mr-1" />;
    if (isVendor()) return <Wrench className="h-3 w-3 mr-1" />;
    if (isTenant()) return <Users className="h-3 w-3 mr-1" />;
    return <Bot className="h-3 w-3 mr-1" />;
  };

  const getRoleColor = () => {
    if (isAdmin()) return 'bg-red-500';
    if (isLandlord()) return 'bg-green-500';
    if (isVendor()) return 'bg-orange-500';
    if (isTenant()) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-terracotta" />
          AI Assistant
          <Badge variant="secondary" className={`ml-auto ${getRoleColor()} text-white`}>
            {getRoleIcon()}
            {isAdmin() ? 'Admin' : isLandlord() ? 'Landlord' : isVendor() ? 'Vendor' : 'Tenant'} Mode
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

export default EnhancedChatAssistant;
