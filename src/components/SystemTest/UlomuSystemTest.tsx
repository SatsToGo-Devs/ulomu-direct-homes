
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAIPredictions } from '@/hooks/useAIPredictions';
import { useEscrowData } from '@/hooks/useEscrowData';
import { useMaintenanceData } from '@/hooks/useMaintenanceData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, Clock, TestTube } from 'lucide-react';

const UlomuSystemTest = () => {
  const { user } = useAuth();
  const { predictions, generatePredictions, loading: aiLoading } = useAIPredictions();
  const { account, transactions, loading: escrowLoading } = useEscrowData();
  const { requests, loading: maintenanceLoading } = useMaintenanceData();
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<Record<string, 'pending' | 'success' | 'error'>>({});
  const [testing, setTesting] = useState(false);

  const updateTestResult = (test: string, result: 'success' | 'error') => {
    setTestResults(prev => ({ ...prev, [test]: result }));
  };

  const runFullSystemTest = async () => {
    setTesting(true);
    setTestResults({});

    const tests = [
      { name: 'Authentication', key: 'auth' },
      { name: 'Database Connection', key: 'database' },
      { name: 'AI Chat Assistant', key: 'ai_chat' },
      { name: 'AI Predictions', key: 'ai_predictions' },
      { name: 'Escrow System', key: 'escrow' },
      { name: 'Maintenance System', key: 'maintenance' },
      { name: 'Property Management', key: 'properties' }
    ];

    // Initialize all tests as pending
    const initialResults: Record<string, 'pending' | 'success' | 'error'> = {};
    tests.forEach(test => {
      initialResults[test.key] = 'pending';
    });
    setTestResults(initialResults);

    // Test Authentication
    try {
      if (user) {
        updateTestResult('auth', 'success');
      } else {
        updateTestResult('auth', 'error');
      }
    } catch (error) {
      updateTestResult('auth', 'error');
    }

    // Test Database Connection
    try {
      const { data } = await supabase.from('profiles').select('id').limit(1);
      updateTestResult('database', 'success');
    } catch (error) {
      updateTestResult('database', 'error');
    }

    // Test AI Chat Assistant
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat-assistant', {
        body: {
          message: 'Hello, this is a test message',
          context: 'general',
          user_type: 'tenant'
        }
      });

      if (error) throw error;
      updateTestResult('ai_chat', 'success');
    } catch (error) {
      console.error('AI Chat test failed:', error);
      updateTestResult('ai_chat', 'error');
    }

    // Test AI Predictions
    try {
      await generatePredictions();
      updateTestResult('ai_predictions', 'success');
    } catch (error) {
      console.error('AI Predictions test failed:', error);
      updateTestResult('ai_predictions', 'error');
    }

    // Test Escrow System
    try {
      if (account) {
        updateTestResult('escrow', 'success');
      } else {
        updateTestResult('escrow', 'error');
      }
    } catch (error) {
      updateTestResult('escrow', 'error');
    }

    // Test Maintenance System
    try {
      updateTestResult('maintenance', 'success');
    } catch (error) {
      updateTestResult('maintenance', 'error');
    }

    // Test Property Management
    try {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user?.id)
        .limit(1);
      updateTestResult('properties', 'success');
    } catch (error) {
      updateTestResult('properties', 'error');
    }

    setTesting(false);
    
    toast({
      title: "System Test Complete",
      description: "All system components have been tested. Check results below.",
    });
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-terracotta" />
            Ulomu System Test Suite
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Test all system components to ensure everything is working correctly
            </p>
            <Button 
              onClick={runFullSystemTest} 
              disabled={testing}
              className="bg-terracotta hover:bg-terracotta/90"
            >
              {testing ? 'Testing...' : 'Run Full System Test'}
            </Button>
          </div>

          {Object.keys(testResults).length > 0 && (
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: 'Authentication', key: 'auth', description: 'User login and session management' },
                { name: 'Database Connection', key: 'database', description: 'Supabase database connectivity' },
                { name: 'AI Chat Assistant', key: 'ai_chat', description: 'OpenAI-powered chat functionality' },
                { name: 'AI Predictions', key: 'ai_predictions', description: 'Predictive maintenance insights' },
                { name: 'Escrow System', key: 'escrow', description: 'Secure payment processing' },
                { name: 'Maintenance System', key: 'maintenance', description: 'Maintenance request management' },
                { name: 'Property Management', key: 'properties', description: 'Property and unit management' }
              ].map((test) => (
                <div key={test.key} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{test.name}</h3>
                    <Badge className={getStatusColor(testResults[test.key] || 'pending')}>
                      {getStatusIcon(testResults[test.key] || 'pending')}
                      <span className="ml-1 capitalize">{testResults[test.key] || 'pending'}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{test.description}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Features Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Predictions:</span>
                <span className="font-medium">{predictions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Loading:</span>
                <span className={aiLoading ? 'text-orange-600' : 'text-green-600'}>
                  {aiLoading ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Escrow Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Balance:</span>
                <span className="font-medium">₦{account?.balance?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span>Transactions:</span>
                <span className="font-medium">{transactions.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Requests:</span>
                <span className="font-medium">{requests.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Loading:</span>
                <span className={maintenanceLoading ? 'text-orange-600' : 'text-green-600'}>
                  {maintenanceLoading ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UlomuSystemTest;
