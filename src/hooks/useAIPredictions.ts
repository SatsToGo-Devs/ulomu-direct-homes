
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface AIPrediction {
  id: string;
  user_id: string;
  property_id?: string;
  unit_id?: string;
  prediction_type: string;
  title: string;
  description: string;
  predicted_date?: string;
  confidence_score: number;
  estimated_cost?: number;
  prevention_actions?: string[];
  data_sources?: string[];
  status: string;
  created_at: string;
  properties?: { name: string };
  units?: { unit_number: string };
}

export interface AIGeneratedContent {
  id: string;
  user_id: string;
  content_type: string;
  original_prompt?: string;
  generated_content: string;
  context_data?: any;
  used_at?: string;
  feedback_rating?: number;
  created_at: string;
}

export const useAIPredictions = () => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [generatedContent, setGeneratedContent] = useState<AIGeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAIData();
    }
  }, [user]);

  const fetchAIData = async () => {
    try {
      setLoading(true);

      // Fetch predictions
      const { data: predictionsData, error: predictionsError } = await supabase
        .from('ai_predictions')
        .select(`
          *,
          properties(name),
          units(unit_number)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (predictionsError) throw predictionsError;
      setPredictions(predictionsData || []);

      // Fetch generated content
      const { data: contentData, error: contentError } = await supabase
        .from('ai_generated_content')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (contentError) throw contentError;
      setGeneratedContent(contentData || []);

    } catch (error) {
      console.error('Error fetching AI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePredictions = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-predictions', {
        body: {}
      });

      if (error) throw error;
      
      console.log('AI Predictions generated:', data);
      await fetchAIData(); // Refresh the data
      return data;
    } catch (error) {
      console.error('Error generating predictions:', error);
      throw error;
    }
  };

  const generateContent = async (prompt: string, contentType: string, contextData?: any) => {
    try {
      const { data, error } = await supabase
        .from('ai_generated_content')
        .insert([{
          user_id: user?.id,
          content_type: contentType,
          original_prompt: prompt,
          generated_content: `AI-generated ${contentType.toLowerCase()} based on: ${prompt}`,
          context_data: contextData
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchAIData();
      return data;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  };

  return {
    predictions,
    generatedContent,
    loading,
    fetchAIData,
    generatePredictions,
    generateContent,
  };
};
