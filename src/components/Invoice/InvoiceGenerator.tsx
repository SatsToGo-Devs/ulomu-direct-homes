import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';

interface InvoiceItem {
  description: string;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: string;
  items: InvoiceItem[];
  tenant: {
    name: string;
    email: string;
  };
  unit: {
    unitNumber: string;
    property: {
      name: string;
      address: string;
    };
  };
}

export default function InvoiceGenerator({ unitId, tenantId }: { unitId: string; tenantId: string }) {
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: 'Monthly Rent', amount: 0 },
  ]);
  const [dueDate, setDueDate] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const fetchInvoices = async () => {
    const response = await fetch('/api/invoices');
    const data = await response.json();
    setInvoices(data);
  };

  const addItem = () => {
    setItems([...items, { description: '', amount: 0 }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitId,
          tenantId,
          amount: totalAmount,
          dueDate,
          items,
        }),
      });

      if (response.ok) {
        fetchInvoices();
        setItems([{ description: 'Monthly Rent', amount: 0 }]);
        setDueDate('');
      }
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Generate New Invoice</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].description = e.target.value;
                    setItems(newItems);
                  }}
                  placeholder="Description"
                  className="flex-1 p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  value={item.amount}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].amount = parseFloat(e.target.value);
                    setItems(newItems);
                  }}
                  placeholder="Amount"
                  className="w-32 p-2 border rounded"
                  required
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
          >
            Add Item
          </button>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Generate Invoice
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Invoice History</h2>
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                <span className={`px-2 py-1 rounded text-sm ${
                  invoice.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {invoice.status}
                </span>
              </div>
              <p className="text-gray-600">Amount: ${invoice.amount}</p>
              <p className="text-gray-600">Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
              <div className="mt-2">
                <PDFDownloadLink
                  document={<InvoicePDF invoice={invoice} />}
                  fileName={`${invoice.invoiceNumber}.pdf`}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Download PDF
                </PDFDownloadLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}