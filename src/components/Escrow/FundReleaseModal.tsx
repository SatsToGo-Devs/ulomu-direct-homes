
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Lock, AlertCircle } from 'lucide-react';

interface EscrowTransaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  purpose?: string;
  description?: string;
  created_at: string;
}

interface FundReleaseModalProps {
  transaction: EscrowTransaction;
  onReleaseComplete: () => void;
}

const FundReleaseModal = ({ transaction, onReleaseComplete }: FundReleaseModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [releaseReason, setReleaseReason] = useState('');
  const { toast } = useToast();

  const handleReleaseFunds = async () => {
    try {
      setLoading(true);

      // Call the edge function to release escrow funds
      const { data, error } = await supabase.functions.invoke('release-escrow-funds', {
        body: {
          transaction_id: transaction.id,
          release_reason: releaseReason
        }
      });

      if (error) throw error;

      toast({
        title: "Funds Released",
        description: "The escrow funds have been successfully released.",
      });

      setOpen(false);
      onReleaseComplete();
    } catch (error: any) {
      console.error('Error releasing funds:', error);
      toast({
        title: "Release Failed",
        description: error.message || "Failed to release escrow funds",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={transaction.status !== 'HELD'}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Release Funds
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-gold" />
            Release Escrow Funds
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Transaction Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Amount:</span>
              <span className="font-bold">₦{transaction.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Type:</span>
              <Badge variant="outline">{transaction.type}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Status:</span>
              <Badge className="bg-gold text-white">{transaction.status}</Badge>
            </div>
            {transaction.purpose && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Purpose:</span>
                <span className="text-sm">{transaction.purpose}</span>
              </div>
            )}
          </div>

          {/* Warning Notice */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Important Notice</p>
                <p>Once funds are released, this action cannot be undone. Please ensure all conditions have been met before proceeding.</p>
              </div>
            </div>
          </div>

          {/* Release Reason */}
          <div>
            <Label htmlFor="releaseReason">Release Reason (Optional)</Label>
            <Textarea
              id="releaseReason"
              placeholder="Explain why the funds are being released..."
              value={releaseReason}
              onChange={(e) => setReleaseReason(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReleaseFunds}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Releasing...' : 'Release Funds'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FundReleaseModal;
