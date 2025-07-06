
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAIRoleInsights } from '@/hooks/useAIRoleInsights';
import { 
  Brain, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Sparkles
} from 'lucide-react';

const AIInsightsWidget: React.FC = () => {
  const { insights, loading, dismissInsight, generateInsights } = useAIRoleInsights();

  const getImpactColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial': return <DollarSign className="h-4 w-4" />;
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Insights
        </CardTitle>
        <Button 
          onClick={generateInsights}
          size="sm" 
          variant="outline"
          className="flex items-center gap-1"
        >
          <Sparkles className="h-3 w-3" />
          Generate
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Brain className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No AI insights available</p>
            <Button 
              onClick={generateInsights} 
              size="sm" 
              className="mt-2 bg-terracotta hover:bg-terracotta/90"
            >
              Generate Insights
            </Button>
          </div>
        ) : (
          insights.slice(0, 3).map((insight) => (
            <div key={insight.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(insight.insight_category)}
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getImpactColor(insight.impact_level)}>
                    {insight.impact_level}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => dismissInsight(insight.id)}
                    className="h-6 w-6 p-0 hover:bg-red-50"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 line-clamp-2">
                {insight.description}
              </p>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  Confidence: {Math.round(insight.confidence_score * 100)}%
                </span>
                {insight.estimated_savings > 0 && (
                  <span className="text-green-600 font-medium">
                    Save: ${insight.estimated_savings.toLocaleString()}
                  </span>
                )}
              </div>
              
              {insight.recommended_actions.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium text-gray-700 mb-1">Quick Actions:</p>
                  <div className="flex flex-wrap gap-1">
                    {insight.recommended_actions.slice(0, 2).map((action, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsWidget;
