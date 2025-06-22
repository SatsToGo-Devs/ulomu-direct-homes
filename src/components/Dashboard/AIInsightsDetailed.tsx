
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb,
  Clock,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { AIInsight } from '@/hooks/useDashboardData';
import { formatDistanceToNow } from 'date-fns';

interface AIInsightsDetailedProps {
  insights: AIInsight[];
  onActionClick?: (insight: AIInsight) => void;
}

const AIInsightsDetailed = ({ insights, onActionClick }: AIInsightsDetailedProps) => {
  const getInsightIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'predictive':
        return AlertTriangle;
      case 'cost_optimization':
        return DollarSign;
      case 'scheduling':
        return Clock;
      case 'recommendation':
        return Lightbulb;
      default:
        return Brain;
    }
  };

  const getInsightColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-green-500 bg-green-50 border-green-200';
      default:
        return 'text-blue-500 bg-blue-50 border-blue-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (insights.length === 0) {
    return (
      <Card className="border-beige/50">
        <CardContent className="p-8 text-center">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h3>
          <p className="text-gray-600">
            Your AI insights will appear here as we analyze your property data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">AI Insights & Recommendations</h2>
        <Badge variant="outline" className="bg-terracotta/10 text-terracotta border-terracotta/20">
          {insights.length} Active Insights
        </Badge>
      </div>

      <div className="grid gap-6">
        {insights.map((insight) => {
          const IconComponent = getInsightIcon(insight.insight_type);
          const priorityStyle = getInsightColor(insight.priority);
          
          return (
            <Card key={insight.id} className={`border-l-4 ${priorityStyle}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${priorityStyle}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {insight.insight_type.replace('_', ' ')}
                        </Badge>
                        <Badge 
                          variant={insight.priority === 'HIGH' ? 'destructive' : 'outline'}
                          className="text-xs"
                        >
                          {insight.priority} Priority
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {Math.round(insight.confidence_score * 100)}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {insight.estimated_savings && (
                      <div className="text-sm font-medium text-green-600">
                        Potential Savings: {formatCurrency(insight.estimated_savings)}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(insight.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{insight.description}</p>
                
                {onActionClick && (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onActionClick(insight)}
                      className="text-terracotta border-terracotta hover:bg-terracotta hover:text-white"
                    >
                      Take Action
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-terracotta/5 to-gold/5 border-terracotta/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-terracotta/10">
              <TrendingUp className="h-6 w-6 text-terracotta" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total Potential Impact</h3>
              <p className="text-gray-600">
                Our AI has identified {insights.length} optimization opportunities that could save you{' '}
                <span className="font-semibold text-green-600">
                  {formatCurrency(insights.reduce((sum, insight) => sum + Number(insight.estimated_savings || 0), 0))}
                </span>{' '}
                annually.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsightsDetailed;
