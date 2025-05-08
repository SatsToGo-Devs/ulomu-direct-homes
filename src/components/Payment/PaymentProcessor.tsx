import { useState } from 'react';

interface Invoice {
  id: string;
  amount: number;
  status: string;
  dueDate: string;
}

export default function PaymentProcessor({ invoice }: { invoice: Invoice }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/escrow/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice.id,
          amount: invoice.amount,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Payment failed');
      }

      window.location.reload();
    } catch (error) {
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between mb-2">
        <span>Amount Due: ${invoice.amount}</span>
        <span>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</span>
      </div>
      
      {error && (
        <div className="text-red-500 mb-2">{error}</div>
      )}
      
      <button
        onClick={handlePayment}
        disabled={processing || invoice.status === 'PAID'}
        className={`w-full py-2 rounded ${
          invoice.status === 'PAID'
            ? 'bg-green-500 text-white'
            : processing
            ? 'bg-gray-400'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {invoice.status === 'PAID'
          ? 'Paid'
          : processing
          ? 'Processing...'
          : 'Pay Now'}
      </button>
    </div>
  );
}