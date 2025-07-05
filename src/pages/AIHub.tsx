
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleBasedAIHub from '@/components/AI/RoleBasedAIHub';
import { Brain } from 'lucide-react';

const AIHub = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8" />
              <h1 className="text-3xl font-bold">AI Hub</h1>
            </div>
            <p className="text-purple-100">Intelligent features powered by advanced AI technology</p>
          </div>
        </div>

        <main className="flex-1 bg-beige/20">
          <div className="container mx-auto px-4 py-8">
            <RoleBasedAIHub />
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default AIHub;
