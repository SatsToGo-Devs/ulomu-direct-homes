
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEscrowData } from '@/hooks/useEscrowData';
import { CreditCard, Shield, DollarSign, Brain, Users, Home } from 'lucide-react';

interface EnhancedEscrowPaymentModalProps {
  trigger?: React.ReactNode;
  onPaymentComplete?: () => void;
}

const EnhancedPaymentForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();
  const { account, escrowRules } = useEscrowData();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [suggestedAmount, setSuggestedAmount] = useState<number | null>(null);
  const [selectedRule, setSelectedRule] = useState<any>(null);
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    description: '',
    recipientEmail: '',
    propertyId: '',
    payeeId: '',
    releaseCondition: '',
    serviceFeePercent: 10,
    autoReleaseDays: 7
  });

  useEffect(() => {
    fetchProperties();
    fetchVendors();
  }, []);

  useEffect(() => {
    // Auto-select escrow rule based on purpose
    if (formData.purpose) {
      const rule = escrowRules.find(r => 
        r.transaction_type.toLowerCase() === formData.purpose.toLowerCase()
      );
      if (rule) {
        setSelectedRule(rule);
        setFormData(prev => ({
          ...prev,
          releaseCondition: rule.release_condition,
          autoReleaseDays: rule.release_days
        }));
      }
    }
  }, [formData.purpose, escrowRules]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, name, address')
        .limit(10);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select(`
          *,
          profiles!inner(first_name, last_name)
        `)
        .eq('verification_status', 'VERIFIED')
        .order('trust_score', { ascending: false })
        .limit(10);

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const getAISuggestions = async () => {
    // AI-powered amount suggestions based on purpose and property
    if (formData.purpose === 'rent' && formData.propertyId) {
      try {
        const { data, error } = await supabase
          .from('units')
          .select('rent_amount')
          .eq('property_id', formData.propertyId)
          .limit(1)
          .single();

        if (!error && data) {
          setSuggestedAmount(data.rent_amount);
          setFormData(prev => ({ ...prev, amount: data.rent_amount.toString() }));
        }
      } catch (error) {
        console.error('Error getting rent suggestion:', error);
      }
    }
  };

  useEffect(() => {
    if (formData.purpose && formData.propertyId) {
      getAISuggestions();
    }
  }, [formData.purpose, formData.propertyId]);

  const calculateServiceFee = () => {
    const amount = parseFloat(formData.amount) || 0;
    return (amount * formData.serviceFeePercent) / 100;
  };

  const calculateTotalAmount = () => {
    const amount = parseFloat(formData.amount) || 0;
    const serviceFee = calculateServiceFee();
    return amount + serviceFee;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const amount = parseFloat(formData.amount);
      const serviceFee = calculateServiceFee();
      const totalAmount = calculateTotalAmount();

      // Create payment with enhanced data
      const { data: paymentData, error } = await supabase.functions.invoke('create-escrow-payment', {
        body: {
          amount: totalAmount,
          escrow_amount: amount,
          service_fee: serviceFee,
          purpose: formData.purpose,
          description: formData.description,
          recipient_email: formData.recipientEmail,
          property_id: formData.propertyId || null,
          payee_id: formData.payeeId || null,
          release_condition: formData.releaseCondition,
          auto_release_days: formData.autoReleaseDays,
          payment_type: 'escrow_enhanced'
        }
      });

      if (error) throw error;

      // Redirect to PayStack checkout
      window.open(paymentData.authorization_url, '_blank');

      toast({
        title: "Enhanced Escrow Payment Initiated",
        description: `₦${amount.toLocaleString()} will be held in escrow with ₦${serviceFee.toLocaleString()} service fee.`,
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Purpose Selection with AI Suggestions */}
      <div>
        <Label htmlFor="purpose">Payment Purpose</Label>
        <Select onValueChange={(value) => setFormData({ ...formData, purpose: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select payment purpose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rent">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Rent Payment
              </div>
            </SelectItem>
            <SelectItem value="deposit">Security Deposit</SelectItem>
            <SelectItem value="maintenance">Maintenance Work</SelectItem>
            <SelectItem value="service_charge">Service Charge</SelectItem>
            <SelectItem value="vendor_payment">Vendor Payment</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Property Selection */}
      {formData.purpose !== 'other' && (
        <div>
          <Label htmlFor="property">Property (Optional)</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, propertyId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name} - {property.address}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Amount with AI Suggestions */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">Escrow Amount (₦)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
            placeholder="0.00"
          />
          {suggestedAmount && (
            <div className="mt-1 text-sm text-blue-600 flex items-center gap-1">
              <Brain className="h-3 w-3" />
              AI Suggestion: ₦{suggestedAmount.toLocaleString()}
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="serviceFee">Service Fee (%)</Label>
          <Input
            id="serviceFee"
            type="number"
            min="5"
            max="15"
            value={formData.serviceFeePercent}
            onChange={(e) => setFormData({ ...formData, serviceFeePercent: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      {/* Recipient Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="recipientEmail">Recipient Email</Label>
          <Input
            id="recipientEmail"
            type="email"
            value={formData.recipientEmail}
            onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
            placeholder="recipient@example.com"
          />
        </div>
        {formData.purpose === 'vendor_payment' && (
          <div>
            <Label htmlFor="vendor">Select Verified Vendor</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, payeeId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Choose vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.user_id} value={vendor.user_id}>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {vendor.profiles?.first_name} {vendor.profiles?.last_name}
                      <Badge variant="outline">
                        Trust: {(vendor.trust_score * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Release Conditions */}
      <div>
        <Label htmlFor="releaseCondition">Release Condition</Label>
        <Select 
          value={formData.releaseCondition}
          onValueChange={(value) => setFormData({ ...formData, releaseCondition: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="How should funds be released?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MANUAL_RELEASE">Manual Release (Both parties confirm)</SelectItem>
            <SelectItem value="AUTOMATIC">Automatic (After specified days)</SelectItem>
            <SelectItem value="COMPLETION_CONFIRMED">Work Completion Confirmed</SelectItem>
            <SelectItem value="SCHEDULED_RELEASE">Scheduled Release Date</SelectItem>
            <SelectItem value="DISPUTE_RESOLUTION">Through Dispute Resolution</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.releaseCondition === 'AUTOMATIC' && (
        <div>
          <Label htmlFor="autoReleaseDays">Auto-release after (days)</Label>
          <Input
            id="autoReleaseDays"
            type="number"
            min="1"
            max="90"
            value={formData.autoReleaseDays}
            onChange={(e) => setFormData({ ...formData, autoReleaseDays: parseInt(e.target.value) })}
          />
        </div>
      )}

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Payment description and terms..."
          rows={3}
        />
      </div>

      {/* Enhanced Security Information */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Shield className="h-5 w-5" />
            Enhanced Escrow Protection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Escrow Amount:</span>
              <div className="text-lg font-bold text-green-600">₦{(parseFloat(formData.amount) || 0).toLocaleString()}</div>
            </div>
            <div>
              <span className="font-medium">Service Fee:</span>
              <div className="text-lg font-bold text-blue-600">₦{calculateServiceFee().toLocaleString()}</div>
            </div>
          </div>
          <div className="pt-2 border-t">
            <span className="font-medium">Total to Pay:</span>
            <div className="text-xl font-bold text-terracotta">₦{calculateTotalAmount().toLocaleString()}</div>
          </div>
          {selectedRule && (
            <div className="mt-3 p-2 bg-white rounded border">
              <div className="text-xs text-gray-600">
                <strong>Escrow Rule Applied:</strong> {selectedRule.release_condition}
                {selectedRule.auto_release && ` (Auto-release after ${selectedRule.release_days} days)`}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        disabled={loading || !formData.amount || !formData.purpose} 
        className="w-full bg-terracotta hover:bg-terracotta/90"
        size="lg"
      >
        {loading ? 'Processing...' : `Pay ₦${calculateTotalAmount().toLocaleString()} via Enhanced Escrow`}
      </Button>
    </form>
  );
};

const EnhancedEscrowPaymentModal = ({ trigger, onPaymentComplete }: EnhancedEscrowPaymentModalProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onPaymentComplete) {
      onPaymentComplete();
    }
  };

  const defaultTrigger = (
    <Button className="bg-terracotta hover:bg-terracotta/90" size="lg">
      <CreditCard className="h-5 w-5 mr-2" />
      Create Smart Escrow Payment
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-terracotta" />
            Enhanced Escrow Payment System
          </DialogTitle>
        </DialogHeader>
        <EnhancedPaymentForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedEscrowPaymentModal;
