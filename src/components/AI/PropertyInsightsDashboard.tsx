
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Loader2 } from 'lucide-react';

interface PropertyInsightsDashboardProps {
  propertyId: string;
  propertyName: string;
}

const PropertyInsightsDashboard = ({ propertyId, propertyName }: PropertyInsightsDashboardProps) => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateInsights = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-property-insights', {
        body: {
          property_id: propertyId,
          analysis_type: 'maintenance_prediction'
        }
      });

      if (error) throw error;

      setInsights(data.insights);
      
      toast({
        title: "AI Insights Generated",
        description: "Property analysis completed successfully.",
      });
    } catch (error) {
      console.error('Insights error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to generate property insights.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-terracotta" />
              AI Property Insights
            </CardTitle>
            <Badge variant="outline" className="text-terracotta border-terracotta">
              Powered by Gemini 1.5
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Property: {propertyName}</h3>
                <p className="text-sm text-gray-600">
                  Get predictive maintenance insights, cost optimization recommendations, and risk assessments
                </p>
              </div>
              <Button
                onClick={generateInsights}
                disabled={loading}
                className="bg-terracotta hover:bg-terracotta/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Generate Insights
                  </>
                )}
              </Button>
            </div>

            {insights && (
              <div className="mt-6 space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-gold" />
                  AI Analysis Results
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">
                    {insights}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Predictive Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              AI analyzes historical data to predict when maintenance will be needed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Identify potential issues before they become costly problems
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              Cost Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Get recommendations to reduce operational costs and improve efficiency
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyInsightsDashboard;
