
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatAssistant from "@/components/AI/ChatAssistant";
import ProtectedRoute from "@/components/ProtectedRoute";
import { MessageCircle } from "lucide-react";

const ChatAssistantPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="bg-gradient-to-r from-terracotta to-forest text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-8 w-8" />
              <h1 className="text-3xl font-bold">AI Chat Assistant</h1>
            </div>
            <p className="text-white/90">Get instant help with property management and maintenance</p>
          </div>
        </div>

        <main className="flex-1 bg-beige/20 dark:bg-gray-900 py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <ChatAssistant />
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default ChatAssistantPage;
