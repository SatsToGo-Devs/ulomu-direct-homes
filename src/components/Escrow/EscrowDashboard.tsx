
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  Wallet, 
  Shield, 
  ArrowUpDown, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  TrendingUp,
  Lock,
  Wrench,
  User
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

interface MaintenanceWork {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  amount: number;
  escrowHeld: number;
  progress: number;
  vendor: string;
  createdAt: string;
  completedAt?: string;
}

export default function EscrowDashboard() {
  const [account, setAccount] = useState<EscrowAccount | null>(null);
  const [serviceCharges, setServiceCharges] = useState<ServiceCharge[]>([]);
  const [maintenanceWork, setMaintenanceWork] = useState<MaintenanceWork[]>([]);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [purpose, setPurpose] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const mockAccount: EscrowAccount = {
    id: '1',
    balance: 125000,
    frozenBalance: 85000,
    accountType: 'ESCROW',
    transactions: [
      {
        id: '1',
        amount: 45000,
        type: 'SERVICE_CHARGE',
        status: 'COMPLETED',
        purpose: 'Security Services',
        description: 'Monthly security service payment',
        createdAt: '2024-01-15T10:30:00Z',
        fromUser: { name: 'John Adebayo' },
        toUser: { name: 'SecureGuard Ltd' }
      },
      {
        id: '2',
        amount: 25000,
        type: 'MAINTENANCE',
        status: 'HELD',
        purpose: 'Plumbing Repair',
        description: 'Kitchen sink repair work',
        createdAt: '2024-01-14T14:20:00Z',
        fromUser: { name: 'Sarah Okafor' },
        toUser: { name: 'FixIt Plumbing' }
      },
      {
        id: '3',
        amount: 35000,
        type: 'SERVICE_CHARGE',
        status: 'COMPLETED',
        purpose: 'Cleaning Services',
        description: 'Monthly cleaning service',
        createdAt: '2024-01-12T09:15:00Z',
        fromUser: { name: 'Mike Johnson' },
        toUser: { name: 'CleanPro Services' }
      },
      {
        id: '4',
        amount: 15000,
        type: 'MAINTENANCE',
        status: 'PENDING',
        purpose: 'Electrical Work',
        description: 'Light fixture installation',
        createdAt: '2024-01-10T16:45:00Z',
        fromUser: { name: 'Grace Nwosu' },
        toUser: { name: 'ElectroFix Ltd' }
      },
      {
        id: '5',
        amount: 55000,
        type: 'SERVICE_CHARGE',
        status: 'COMPLETED',
        purpose: 'Generator Maintenance',
        description: 'Quarterly generator servicing',
        createdAt: '2024-01-08T11:30:00Z',
        fromUser: { name: 'John Adebayo' },
        toUser: { name: 'PowerTech Services' }
      }
    ]
  };

  const mockServiceCharges: ServiceCharge[] = [
    {
      id: '1',
      description: 'Security Services',
      amount: 45000,
      status: 'PAID',
      escrowHeld: 45000,
      unit: {
        unitNumber: '3B',
        property: { name: 'Marina Heights Apartment' }
      }
    },
    {
      id: '2',
      description: 'Cleaning Services',
      amount: 35000,
      status: 'PAID',
      escrowHeld: 35000,
      unit: {
        unitNumber: '12A',
        property: { name: 'Lekki Phase 2 Complex' }
      }
    },
    {
      id: '3',
      description: 'Waste Management',
      amount: 15000,
      status: 'PENDING',
      escrowHeld: 15000,
      unit: {
        unitNumber: '205',
        property: { name: 'Victoria Island Office' }
      }
    }
  ];

  const mockMaintenanceWork: MaintenanceWork[] = [
    {
      id: '1',
      title: 'Kitchen Sink Repair',
      description: 'Fix leaking kitchen sink and replace faucet',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      amount: 25000,
      escrowHeld: 25000,
      progress: 75,
      vendor: 'FixIt Plumbing',
      createdAt: '2024-01-14T14:20:00Z'
    },
    {
      id: '2',
      title: 'Light Fixture Installation',
      description: 'Install new LED light fixtures in living room',
      status: 'PENDING',
      priority: 'MEDIUM',
      amount: 15000,
      escrowHeld: 15000,
      progress: 0,
      vendor: 'ElectroFix Ltd',
      createdAt: '2024-01-10T16:45:00Z'
    },
    {
      id: '3',
      title: 'Air Conditioning Service',
      description: 'Complete AC unit maintenance and cleaning',
      status: 'COMPLETED',
      priority: 'LOW',
      amount: 20000,
      escrowHeld: 0,
      progress: 100,
      vendor: 'CoolAir Services',
      createdAt: '2024-01-05T09:30:00Z',
      completedAt: '2024-01-07T15:00:00Z'
    },
    {
      id: '4',
      title: 'Roof Waterproofing',
      description: 'Emergency roof leak repair and waterproofing',
      status: 'COMPLETED',
      priority: 'EMERGENCY',
      amount: 75000,
      escrowHeld: 0,
      progress: 100,
      vendor: 'RoofMasters Ltd',
      createdAt: '2024-01-02T08:00:00Z',
      completedAt: '2024-01-04T17:30:00Z'
    }
  ];

  useEffect(() => {
    setAccount(mockAccount);
    setServiceCharges(mockServiceCharges);
    setMaintenanceWork(mockMaintenanceWork);
  }, []);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setAmount('');
      setRecipient('');
      setPurpose('');
      setDescription('');
    }, 2000);
  };

  const releaseEscrowFunds = async (transactionId: string) => {
    console.log('Releasing funds for transaction:', transactionId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-forest text-white';
      case 'PENDING': return 'bg-gold text-white';
      case 'HELD': return 'bg-terracotta text-white';
      case 'FAILED': return 'bg-red-500 text-white';
      case 'IN_PROGRESS': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'EMERGENCY': return 'bg-red-500 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-gold text-white';
      case 'LOW': return 'bg-forest text-white';
      default: return 'bg-gray-500 text-white';
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
                    <TableHead>From/To</TableHead>
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
                      <TableCell className="capitalize">
                        <div className="flex items-center gap-2">
                          {transaction.type === 'SERVICE_CHARGE' ? (
                            <DollarSign className="h-4 w-4 text-terracotta" />
                          ) : (
                            <Wrench className="h-4 w-4 text-blue-600" />
                          )}
                          {transaction.type.replace('_', ' ')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <User className="h-3 w-3" />
                            {transaction.fromUser?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            → {transaction.toUser?.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ₦{transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.purpose}</TableCell>
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
                        <Badge className={getStatusColor(charge.status)}>
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
                <Wrench className="h-5 w-5 text-terracotta" />
                Maintenance Work Progress & Fund Releases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceWork.map((work) => (
                  <div key={work.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{work.title}</h4>
                        <p className="text-gray-600 text-sm">{work.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge className={getStatusColor(work.status)}>
                            {work.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(work.priority)}>
                            {work.priority}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Vendor: {work.vendor}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">₦{work.amount.toLocaleString()}</div>
                        <div className="text-sm text-blue-600">
                          Escrow: ₦{work.escrowHeld.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-gray-600">{work.progress}%</span>
                      </div>
                      <Progress value={work.progress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Started: {new Date(work.createdAt).toLocaleDateString()}</span>
                      {work.completedAt && (
                        <span>Completed: {new Date(work.completedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    
                    {work.status === 'COMPLETED' && work.escrowHeld === 0 && (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Funds released to vendor
                      </div>
                    )}
                    
                    {work.escrowHeld > 0 && work.progress === 100 && (
                      <Button 
                        size="sm"
                        className="bg-terracotta hover:bg-terracotta/90"
                      >
                        Release Escrow Funds
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
