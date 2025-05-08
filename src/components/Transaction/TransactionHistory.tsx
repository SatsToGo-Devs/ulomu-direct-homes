import { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data);
    };

    fetchTransactions();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex justify-between items-center p-4 border rounded"
          >
            <div>
              <p className="font-medium">{transaction.type}</p>
              <p className="text-sm text-gray-600">
                {new Date(transaction.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-medium ${
                transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'DEPOSIT' ? '+' : '-'}${transaction.amount}
              </p>
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
  );
}