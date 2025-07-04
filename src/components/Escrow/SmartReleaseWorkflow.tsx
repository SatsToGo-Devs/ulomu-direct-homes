
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useEscrowData, EscrowTransaction } from '@/hooks/useEscrowData';
import { supabase } from '@/integrations/supabase/client';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Camera, 
  MessageSquare, 
  Shield,
  Bot,
  FileText,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface SmartReleaseWorkflowProps {
  transaction: EscrowTransaction;
  onReleaseComplete?: () => void;
}

const SmartReleaseWorkflow = ({ transaction, onReleaseComplete }: SmartReleaseWorkflowProps) => {
  const { toast } = useToast();
  const { createDispute } = useEscrowData();
  const [loading, setLoading] = useState(false);
  const [evidence, setEvidence] = useState<string[]>([]);
  const [satisfactionRating, setSatisfactionRating] = useState<number | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [showDisputeModal, setShowDisputeModal] = useState(false);

  // Calculate release readiness score
  const calculateReleaseScore = () => {
    let score = 0;
    
    // Time-based scoring
    const daysSinceCreated = Math.floor(
      (new Date().getTime() - new Date(transaction.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceCreated >= 7) score += 30;
    if (daysSinceCreated >= 14) score += 20;
    
    // Evidence-based scoring
    if (evidence.length > 0) score += 25;
    if (evidence.length >= 3) score += 15;
    
    // Completion confirmation
    if (transaction.completion_confirmed) score += 40;
    
    // Satisfaction rating
    if (satisfactionRating && satisfactionRating >= 4) score += 20;
    
    return Math.min(score, 100);
  };

  const releaseScore = calculateReleaseScore();

  const handleAutoRelease = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('smart-release-funds', {
        body: {
          transaction_id: transaction.id,
          release_type: 'AUTO',
          evidence_urls: evidence,
          satisfaction_rating: satisfactionRating,
          completion_notes: completionNotes
        }
      });

      if (error) throw error;

      toast({
        title: "Funds Released Successfully",
        description: `₦${transaction.amount.toLocaleString()} has been released automatically.`,
      });

      if (onReleaseComplete) onReleaseComplete();
    } catch (error: any) {
      toast({
        title: "Release Failed",
        description: error.message || "Failed to release funds",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualRelease = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('smart-release-funds', {
        body: {
          transaction_id: transaction.id,
          release_type: 'MANUAL',
          evidence_urls: evidence,
          satisfaction_rating: satisfactionRating,
          completion_notes: completionNotes
        }
      });

      if (error) throw error;

      toast({
        title: "Release Request Sent",
        description: "Both parties need to confirm before funds are released.",
      });

      if (onReleaseComplete) onReleaseComplete();
    } catch (error: any) {
      toast({
        title: "Release Failed",
        description: error.message || "Failed to request release",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDispute = async () => {
    if (!disputeReason.trim()) {
      toast({
        title: "Dispute Reason Required",
        description: "Please provide a reason for the dispute",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await createDispute(transaction.id, disputeReason);
      
      toast({
        title: "Dispute Created",
        description: "Your dispute has been submitted and will be reviewed within 24 hours.",
      });

      setShowDisputeModal(false);
      if (onReleaseComplete) onReleaseComplete();
    } catch (error: any) {
      toast({
        title: "Dispute Failed",
        description: error.message || "Failed to create dispute",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addEvidence = (url: string) => {
    setEvidence(prev => [...prev, url]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'HELD': return 'bg-yellow-100 text-yellow-800';
      case 'PENDING': return 'bg-blue-100 text-blue-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReleaseRecommendation = () => {
    if (releaseScore >= 80) return { type: 'success', message: '✅ Ready for automatic release' };
    if (releaseScore >= 60) return { type: 'warning', message: '⚠️ Manual verification recommended' };
    return { type: 'error', message: '❌ More evidence needed before release' };
  };

  const recommendation = getReleaseRecommendation();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Smart Release Workflow
          </div>
          <Badge className={getStatusColor(transaction.status)}>
            {transaction.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Transaction Details */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="text-sm text-gray-600">Amount</div>
            <div className="text-lg font-bold">₦{transaction.amount.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Purpose</div>
            <div className="font-medium">{transaction.purpose}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Release Condition</div>
            <div className="font-medium">{transaction.release_condition}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Created</div>
            <div className="font-medium">{new Date(transaction.created_at).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Release Readiness Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-500" />
              <span className="font-medium">AI Release Readiness Score</span>
            </div>
            <span className="text-lg font-bold">{releaseScore}%</span>
          </div>
          <Progress value={releaseScore} className="h-3" />
          <div className={`p-3 rounded-lg ${
            recommendation.type === 'success' ? 'bg-green-50 border border-green-200' :
            recommendation.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <div className="font-medium">{recommendation.message}</div>
          </div>
        </div>

        {/* Evidence Collection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Work Evidence ({evidence.length})</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {evidence.map((url, index) => (
              <div key={index} className="p-2 bg-blue-50 rounded border">
                <FileText className="h-4 w-4 inline mr-2" />
                Evidence {index + 1}
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => addEvidence(`evidence_${Date.now()}.jpg`)}
            className="w-full"
          >
            <Camera className="h-4 w-4 mr-2" />
            Add Work Evidence
          </Button>
        </div>

        {/* Satisfaction Rating */}
        <div className="space-y-3">
          <Label>Work Satisfaction Rating</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant={satisfactionRating === rating ? "default" : "outline"}
                size="sm"
                onClick={() => setSatisfactionRating(rating)}
              >
                {rating} ⭐
              </Button>
            ))}
          </div>
        </div>

        {/* Completion Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Completion Notes</Label>
          <Textarea
            id="notes"
            value={completionNotes}
            onChange={(e) => setCompletionNotes(e.target.value)}
            placeholder="Describe the work completed and any observations..."
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {releaseScore >= 80 && (
            <Button
              onClick={handleAutoRelease}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Auto Release Funds
            </Button>
          )}
          
          <Button
            onClick={handleManualRelease}
            disabled={loading}
            variant="outline"
            className="flex-1"
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Request Release
          </Button>
          
          <Dialog open={showDisputeModal} onOpenChange={setShowDisputeModal}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="flex-1">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Raise Dispute
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Raise Dispute</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="disputeReason">Dispute Reason</Label>
                  <Textarea
                    id="disputeReason"
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="Explain why you're disputing this transaction..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleDispute} disabled={loading} className="flex-1">
                    Submit Dispute
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDisputeModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* AI Suggestions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-blue-800">AI Release Assistant</span>
            </div>
            <div className="text-sm text-blue-700">
              {releaseScore >= 80 && "✅ All conditions met. Funds can be released safely."}
              {releaseScore >= 60 && releaseScore < 80 && "⚠️ Consider adding more evidence or getting confirmation from the other party."}
              {releaseScore < 60 && "📸 Upload work photos and confirm completion to improve release score."}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default SmartReleaseWorkflow;
