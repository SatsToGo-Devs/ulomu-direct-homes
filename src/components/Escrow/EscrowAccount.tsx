import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface EscrowBalance {
  id: string;
  balance: number;
  pendingTransactions: Transaction[];
}

interface Transaction {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

export default function EscrowAccount() {
  const { data: session } = useSession();
  const [balance, setBalance] = useState<EscrowBalance | null>(null);
  const [amount, setAmount] = useState('');

  const fetchBalance = async () => {
    const response = await fetch('/api/escrow/balance');
    const data = await response.json();
    setBalance(data);
  };

  const handleDeposit = async () => {
    try {
      const response = await fetch('/api/escrow/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });
      if (response.ok) {
        fetchBalance();
        setAmount('');
      }
    } catch (error) {
      console.error('Failed to deposit:', error);
    }
  };

  const handlePayment = async (invoiceId: string, amount: number) => {
    try {
      const response = await fetch('/api/escrow/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId, amount }),
      });
      if (response.ok) {
        fetchBalance();
      }
    } catch (error) {
      console.error('Failed to process payment:', error);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Escrow Balance</h2>
        <p className="text-3xl font-bold mb-6">${balance?.balance || 0}</p>
        
        <div className="flex gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleDeposit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Deposit
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <div className="space-y-4">
          {balance?.pendingTransactions.map((transaction) => (
            <div key={transaction.id} className="flex justify-between items-center p-4 border rounded">
              <div>
                <p className="font-medium">{transaction.type}</p>
                <p className="text-sm text-gray-600">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${transaction.amount}</p>
                <p className={`text-sm ${
                  transaction.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {transaction.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}