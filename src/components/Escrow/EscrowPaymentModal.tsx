
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Shield, DollarSign } from 'lucide-react';

interface EscrowPaymentModalProps {
  trigger?: React.ReactNode;
  onPaymentComplete?: () => void;
}

const PaymentForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    description: '',
    recipientEmail: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create payment intent through our edge function
      const { data: paymentData, error } = await supabase.functions.invoke('create-escrow-payment', {
        body: {
          amount: parseFloat(formData.amount),
          purpose: formData.purpose,
          description: formData.description,
          recipient_email: formData.recipientEmail
        }
      });

      if (error) throw error;

      // Redirect to PayStack checkout
      window.open(paymentData.authorization_url, '_blank');

      toast({
        title: "Payment Initiated",
        description: "You will be redirected to PayStack to complete your payment.",
      });

      onSuccess();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong with your payment.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">Amount (₦)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
            placeholder="0.00"
          />
        </div>
        <div>
          <Label htmlFor="purpose">Purpose</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, purpose: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select purpose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rent">Rent Payment</SelectItem>
              <SelectItem value="security_deposit">Security Deposit</SelectItem>
              <SelectItem value="maintenance">Maintenance Work</SelectItem>
              <SelectItem value="service_charge">Service Charge</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="recipientEmail">Recipient Email</Label>
        <Input
          id="recipientEmail"
          type="email"
          value={formData.recipientEmail}
          onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
          placeholder="landlord@example.com"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Payment description..."
          rows={3}
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 text-blue-700 mb-2">
          <Shield className="h-4 w-4" />
          <span className="font-medium">Escrow Protection</span>
        </div>
        <p className="text-sm text-blue-600">
          Your payment will be securely held in escrow until the agreed conditions are met.
          Funds will only be released to the recipient upon successful completion.
        </p>
      </div>

      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full bg-terracotta hover:bg-terracotta/90"
      >
        {loading ? 'Processing...' : `Pay ₦${formData.amount || '0.00'} via Escrow`}
      </Button>
    </form>
  );
};

const EscrowPaymentModal = ({ trigger, onPaymentComplete }: EscrowPaymentModalProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onPaymentComplete) {
      onPaymentComplete();
    }
  };

  const defaultTrigger = (
    <Button className="bg-terracotta hover:bg-terracotta/90">
      <CreditCard className="h-4 w-4 mr-2" />
      Make Escrow Payment
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-terracotta" />
            Secure Escrow Payment
          </DialogTitle>
        </DialogHeader>
        <PaymentForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default EscrowPaymentModal;
