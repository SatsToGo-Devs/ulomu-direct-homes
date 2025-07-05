
import React from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, MessageSquare, TrendingUp, Sparkles } from 'lucide-react';
import ChatAssistant from './ChatAssistant';
import PredictionsPage from './PredictionsPage';
import PropertyInsightsDashboard from './PropertyInsightsDashboard';
import GenerativeAITools from './GenerativeAITools';

const RoleBasedAIHub = () => {
  const { userRoles, loading, isAdmin, isLandlord, isVendor, isTenant } = useUserRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta"></div>
      </div>
    );
  }

  // Get AI features based on user role
  const getAIFeatures = () => {
    const features = [];
    
    if (isAdmin()) {
      features.push(
        { id: 'chat', label: 'Admin AI Assistant', icon: MessageSquare, description: 'System management & analytics' },
        { id: 'predictions', label: 'System Predictions', icon: TrendingUp, description: 'Platform-wide insights' },
        { id: 'generator', label: 'Content Generator', icon: Sparkles, description: 'Admin content creation' }
      );
    }
    
    if (isLandlord()) {
      features.push(
        { id: 'chat', label: 'Property Manager AI', icon: MessageSquare, description: 'Property & tenant management' },
        { id: 'predictions', label: 'Property Insights', icon: TrendingUp, description: 'Maintenance & revenue forecasts' },
        { id: 'generator', label: 'Property Tools', icon: Sparkles, description: 'Listings & documents' }
      );
    }
    
    if (isVendor()) {
      features.push(
        { id: 'chat', label: 'Vendor Assistant', icon: MessageSquare, description: 'Job matching & support' },
        { id: 'predictions', label: 'Business Analytics', icon: TrendingUp, description: 'Earnings & demand forecasts' },
        { id: 'generator', label: 'Proposal Generator', icon: Sparkles, description: 'Quotes & work proposals' }
      );
    }
    
    if (isTenant()) {
      features.push(
        { id: 'chat', label: 'Tenant Helper', icon: MessageSquare, description: 'Maintenance & support' },
        { id: 'predictions', label: 'Cost Insights', icon: TrendingUp, description: 'Expense predictions' },
        { id: 'generator', label: 'Document Helper', icon: Sparkles, description: 'Forms & communications' }
      );
    }
    
    return features;
  };

  const aiFeatures = getAIFeatures();

  return (
    <div className="space-y-6">
      {/* AI Hub Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="h-8 w-8" />
          <h1 className="text-3xl font-bold">AI Hub</h1>
        </div>
        <p className="text-purple-100">
          Intelligent features designed specifically for your role as {userRoles.join(', ')}
        </p>
      </div>

      {/* AI Features Tabs */}
      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          {aiFeatures.map((feature) => (
            <TabsTrigger key={feature.id} value={feature.id} className="flex items-center gap-2">
              <feature.icon className="h-4 w-4" />
              {feature.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Conversational AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChatAssistant />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Predictive AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PredictionsPage />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Generative AI Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GenerativeAITools />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoleBasedAIHub;
