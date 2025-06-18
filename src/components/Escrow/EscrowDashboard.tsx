
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Wallet, 
  Shield, 
  ArrowUpDown, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  TrendingUp,
  Lock
} from 'lucide-react';

interface EscrowAccount {
  id: string;
  balance: number;
  frozenBalance: number;
  accountType: string;
  transactions: EscrowTransaction[];
}

interface EscrowTransaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  purpose: string;
  description: string;
  createdAt: string;
  fromUser?: { name: string };
  toUser?: { name: string };
}

interface ServiceCharge {
  id: string;
  description: string;
  amount: number;
  status: string;
  escrowHeld: number;
  unit: {
    unitNumber: string;
    property: { name: string };
  };
}

export default function EscrowDashboard() {
  const [account, setAccount] = useState<EscrowAccount | null>(null);
  const [serviceCharges, setServiceCharges] = useState<ServiceCharge[]>([]);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [purpose, setPurpose] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccount = async () => {
    try {
      const response = await fetch('/api/escrow');
      const data = await response.json();
      setAccount(data);
    } catch (error) {
      console.error('Failed to fetch escrow account:', error);
    }
  };

  const fetchServiceCharges = async () => {
    try {
      const response = await fetch('/api/escrow/service-charges');
      const data = await response.json();
      setServiceCharges(data);
    } catch (error) {
      console.error('Failed to fetch service charges:', error);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/escrow/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          toUserId: recipient,
          purpose,
          description,
          type: 'TRANSFER'
        }),
      });

      if (response.ok) {
        fetchAccount();
        setAmount('');
        setRecipient('');
        setPurpose('');
        setDescription('');
      }
    } catch (error) {
      console.error('Failed to process transfer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const releaseEscrowFunds = async (transactionId: string) => {
    try {
      const response = await fetch(`/api/escrow/release/${transactionId}`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchAccount();
        fetchServiceCharges();
      }
    } catch (error) {
      console.error('Failed to release funds:', error);
    }
  };

  useEffect(() => {
    fetchAccount();
    fetchServiceCharges();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500';
      case 'PENDING': return 'bg-yellow-500';
      case 'HELD': return 'bg-blue-500';
      case 'FAILED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-terracotta" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-terracotta">
              ₦{account?.balance.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-gray-600">Available for transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Held in Escrow</CardTitle>
            <Lock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ₦{account?.frozenBalance.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-gray-600">Secured for transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Protected</CardTitle>
            <Shield className="h-4 w-4 text-forest" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-forest">
              ₦{((account?.balance || 0) + (account?.frozenBalance || 0)).toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">Total escrow value</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="transfer">Send Money</TabsTrigger>
          <TabsTrigger value="service-charges">Service Charges</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5 text-terracotta" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {account?.transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="capitalize">{transaction.type}</TableCell>
                      <TableCell className="font-medium">
                        ₦{transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.purpose || 'N/A'}</TableCell>
                      <TableCell>
                        {transaction.status === 'HELD' && (
                          <Button 
                            size="sm" 
                            onClick={() => releaseEscrowFunds(transaction.id)}
                            className="bg-terracotta hover:bg-terracotta/90"
                          >
                            Release
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer">
          <Card>
            <CardHeader>
              <CardTitle>Send Money via Escrow</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTransfer} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount (₦)</label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Recipient ID</label>
                    <Input
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="User ID or Email"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Purpose</label>
                  <select 
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select purpose</option>
                    <option value="SERVICE_CHARGE">Service Charge</option>
                    <option value="MAINTENANCE">Maintenance Work</option>
                    <option value="RENT">Rent Payment</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Payment description"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-terracotta hover:bg-terracotta/90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Send via Escrow'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="service-charges">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-terracotta" />
                Service Charges Transparency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Escrow Held</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceCharges.map((charge) => (
                    <TableRow key={charge.id}>
                      <TableCell>{charge.unit.property.name}</TableCell>
                      <TableCell>{charge.unit.unitNumber}</TableCell>
                      <TableCell>{charge.description}</TableCell>
                      <TableCell>₦{charge.amount.toLocaleString()}</TableCell>
                      <TableCell className="font-medium text-blue-600">
                        ₦{charge.escrowHeld.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={charge.status === 'PAID' ? 'bg-green-500' : 'bg-yellow-500'}>
                          {charge.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-terracotta" />
                Maintenance Escrow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Maintenance escrow tracking coming soon.</p>
                <p className="text-sm">This will show maintenance work progress and fund releases.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
