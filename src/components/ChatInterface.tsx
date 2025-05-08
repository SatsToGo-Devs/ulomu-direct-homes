
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Send } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

interface ChatInterfaceProps {
  recipientName: string;
  recipientId: string;
  propertyId?: string;
  propertyTitle?: string;
}

const ChatInterface = ({
  recipientName,
  recipientId,
  propertyId,
  propertyTitle
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: recipientName,
      content: "Hello, I'm interested in your property. Is it still available?",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      isOwn: false
    },
    {
      id: "2",
      sender: "You",
      content: "Yes, it's still available! When would you like to view it?",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      isOwn: true
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: "You",
        content: newMessage,
        timestamp: new Date(),
        isOwn: true
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-forest text-white">
            <span>{recipientName.charAt(0)}</span>
          </Avatar>
          <div>
            <div>{recipientName}</div>
            {propertyTitle && (
              <div className="text-sm text-gray-500">Re: {propertyTitle}</div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg ${
                message.isOwn
                  ? "bg-terracotta text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <p>{message.content}</p>
              <div
                className={`text-xs mt-1 ${
                  message.isOwn ? "text-white/70" : "text-gray-500"
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="flex w-full gap-2">
          <Textarea
            placeholder="Type your message..."
            className="flex-1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            className="bg-terracotta hover:bg-terracotta/90" 
            onClick={handleSendMessage}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
