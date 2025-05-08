import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface EscrowAccount {
  id: string;
  balance: number;
  transactions: EscrowTransaction[];
}

interface EscrowTransaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  description: string;
  createdAt: string;
}

export default function EscrowDashboard() {
  const { data: session } = useSession();
  const [account, setAccount] = useState<EscrowAccount | null>(null);
  const [amount, setAmount] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [description, setDescription] = useState('');

  const fetchAccount = async () => {
    const response = await fetch('/api/escrow');
    const data = await response.json();
    setAccount(data);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/escrow/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          toAccountId,
          description,
        }),
      });

      if (response.ok) {
        fetchAccount();
        setAmount('');
        setToAccountId('');
        setDescription('');
      }
    } catch (error) {
      console.error('Failed to process transfer:', error);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Escrow Account</h2>
        <p className="text-2xl font-bold">${account?.balance.toFixed(2)}</p>
      </div>

      <form onSubmit={handleTransfer} className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Make a Transfer</h3>
        <div className="space-y-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={toAccountId}
            onChange={(e) => setToAccountId(e.target.value)}
            placeholder="Recipient Account ID"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Transfer
          </button>
        </div>
      </form>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        <div className="space-y-2">
          {account?.transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-3 border rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className={transaction.type === 'DEPOSIT' ? 'text-green-500' : 'text-red-500'}>
                ${transaction.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}