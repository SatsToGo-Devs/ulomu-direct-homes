
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAIPredictions } from '@/hooks/useAIPredictions';
import { Brain, TrendingUp, AlertTriangle, Calendar, DollarSign, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PredictionsPage = () => {
  const { predictions, generatePredictions, loading } = useAIPredictions();
  const { toast } = useToast();
  const [generatingPredictions, setGeneratingPredictions] = useState(false);

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'MAINTENANCE': return <AlertTriangle className="h-4 w-4" />;
      case 'EXPENSE': return <DollarSign className="h-4 w-4" />;
      case 'REVENUE': return <TrendingUp className="h-4 w-4" />;
      case 'VACANCY': return <Calendar className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getPredictionColor = (type: string) => {
    switch (type) {
      case 'MAINTENANCE': return 'bg-red-500 text-white';
      case 'EXPENSE': return 'bg-terracotta text-white';
      case 'REVENUE': return 'bg-forest text-white';
      case 'VACANCY': return 'bg-gold text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-forest';
    if (score >= 0.6) return 'text-gold';
    return 'text-terracotta';
  };

  const handleGeneratePredictions = async () => {
    setGeneratingPredictions(true);
    try {
      await generatePredictions();
      toast({
        title: "Predictions Generated",
        description: "New AI predictions have been generated based on your property data.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate predictions.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPredictions(false);
    }
  };

  const predictionsByType = {
    MAINTENANCE: predictions.filter(p => p.prediction_type === 'MAINTENANCE'),
    EXPENSE: predictions.filter(p => p.prediction_type === 'EXPENSE'),
    REVENUE: predictions.filter(p => p.prediction_type === 'REVENUE'),
    VACANCY: predictions.filter(p => p.prediction_type === 'VACANCY'),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-forest">AI Predictions</h2>
          <p className="text-gray-600">Predictive insights for your properties</p>
        </div>
        <Button 
          onClick={handleGeneratePredictions} 
          disabled={generatingPredictions}
          className="bg-terracotta hover:bg-terracotta/90"
        >
          <Brain className="h-4 w-4 mr-2" />
          {generatingPredictions ? 'Generating...' : 'Generate New Predictions'}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {predictionsByType.MAINTENANCE.length}
            </div>
            <p className="text-xs text-gray-600">Upcoming issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-terracotta" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-terracotta">
              {predictionsByType.EXPENSE.length}
            </div>
            <p className="text-xs text-gray-600">Cost forecasts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-forest" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-forest">
              {predictionsByType.REVENUE.length}
            </div>
            <p className="text-xs text-gray-600">Income opportunities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vacancy</CardTitle>
            <Calendar className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gold">
              {predictionsByType.VACANCY.length}
            </div>
            <p className="text-xs text-gray-600">Occupancy insights</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Predictions</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="expense">Expenses</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="vacancy">Vacancy</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {predictions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Lightbulb className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Predictions Yet</h3>
                <p className="text-gray-600 text-center mb-4">
                  Generate AI predictions to get insights about your properties
                </p>
                <Button onClick={handleGeneratePredictions} className="bg-terracotta hover:bg-terracotta/90">
                  Generate Predictions
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {predictions.map((prediction) => (
                <Card key={prediction.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${getPredictionColor(prediction.prediction_type)} bg-opacity-10`}>
                          {getPredictionIcon(prediction.prediction_type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{prediction.title}</h3>
                          <p className="text-gray-600">{prediction.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPredictionColor(prediction.prediction_type)}>
                          {prediction.prediction_type}
                        </Badge>
                        <span className={`font-medium ${getConfidenceColor(prediction.confidence_score)}`}>
                          {Math.round(prediction.confidence_score * 100)}%
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      {prediction.predicted_date && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Predicted Date:</span>
                          <p className="text-sm">{new Date(prediction.predicted_date).toLocaleDateString()}</p>
                        </div>
                      )}
                      {prediction.estimated_cost && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Estimated Cost:</span>
                          <p className="text-sm font-medium">₦{prediction.estimated_cost.toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    {prediction.prevention_actions && prediction.prevention_actions.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Prevention Actions:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {prediction.prevention_actions.map((action, index) => (
                            <li key={index} className="text-sm text-gray-600">{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {prediction.data_sources && prediction.data_sources.length > 0 && (
                      <div>
                        <span className="text-xs text-gray-500">
                          Based on: {prediction.data_sources.join(', ')}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {Object.entries(predictionsByType).map(([type, typePredictions]) => (
          <TabsContent key={type.toLowerCase()} value={type.toLowerCase()} className="space-y-4">
            {typePredictions.map((prediction) => (
              <Card key={prediction.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{prediction.title}</h3>
                      <p className="text-gray-600">{prediction.description}</p>
                    </div>
                    <span className={`font-medium ${getConfidenceColor(prediction.confidence_score)}`}>
                      {Math.round(prediction.confidence_score * 100)}% Confidence
                    </span>
                  </div>
                  {prediction.prevention_actions && prediction.prevention_actions.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Recommended Actions:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {prediction.prevention_actions.map((action, index) => (
                          <li key={index} className="text-sm text-gray-600">{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PredictionsPage;
