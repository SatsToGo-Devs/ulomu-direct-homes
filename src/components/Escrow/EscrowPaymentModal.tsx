
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { CreditCard, Shield, DollarSign } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

interface EscrowPaymentModalProps {
  trigger?: React.ReactNode;
}

const PaymentForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
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
    if (!stripe || !elements) return;

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

      // Confirm payment with Stripe
      const { error: confirmError } = await stripe.confirmCardPayment(paymentData.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      toast({
        title: "Payment Successful",
        description: "Funds have been held in escrow and will be released upon completion.",
      });

      onSuccess();
    } catch (error) {
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
          <Label htmlFor="amount">Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
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

      <div className="border rounded-lg p-3">
        <Label className="text-sm font-medium mb-2 block">Card Details</Label>
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
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
        disabled={!stripe || loading} 
        className="w-full bg-terracotta hover:bg-terracotta/90"
      >
        {loading ? 'Processing...' : `Pay $${formData.amount || '0.00'} via Escrow`}
      </Button>
    </form>
  );
};

const EscrowPaymentModal = ({ trigger }: EscrowPaymentModalProps) => {
  const [open, setOpen] = useState(false);

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
        <Elements stripe={stripePromise}>
          <PaymentForm onSuccess={() => setOpen(false)} />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};

export default EscrowPaymentModal;
