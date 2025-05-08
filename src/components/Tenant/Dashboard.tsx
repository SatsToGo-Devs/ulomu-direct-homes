import { useState, useEffect } from 'react';

interface TenantInfo {
  unit?: {
    unitNumber: string;
    property: {
      name: string;
      address: string;
    };
  };
  escrowBalance: number;
  pendingInvoices: any[];
}

export default function TenantDashboard() {
  const [tenantInfo, setTenantInfo] = useState<TenantInfo>({
    escrowBalance: 0,
    pendingInvoices: [],
  });

  useEffect(() => {
    const fetchTenantInfo = async () => {
      try {
        const response = await fetch('/api/tenant/info');
        const data = await response.json();
        setTenantInfo(data);
      } catch (error) {
        console.error('Failed to fetch tenant information:', error);
      }
    };

    fetchTenantInfo();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 bg-[#F5F0E6]">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-[#C45B39]">Your Rental Information</h2>
        {tenantInfo.unit ? (
          <div className="text-[#2C5530]">
            <p>Unit: {tenantInfo.unit.unitNumber}</p>
            <p>Property: {tenantInfo.unit.property.name}</p>
            <p>Address: {tenantInfo.unit.property.address}</p>
          </div>
        ) : (
          <p className="text-[#2C5530]">No unit currently assigned</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-[#C45B39]">Escrow Account</h2>
        <p className="text-2xl font-bold text-[#2C5530]">${tenantInfo.escrowBalance}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-[#C45B39]">Pending Invoices</h2>
        {tenantInfo.pendingInvoices.length > 0 ? (
          <div className="space-y-4">
            {tenantInfo.pendingInvoices.map((invoice) => (
              <div key={invoice.id} className="border border-[#D4A64A] p-4 rounded">
                <p className="text-[#2C5530]">Invoice #{invoice.invoiceNumber}</p>
                <p className="text-[#2C5530]">Amount: ${invoice.amount}</p>
                <p className="text-[#2C5530]">Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                <button
                  className="mt-2 bg-[#C45B39] text-[#F5F0E6] px-4 py-2 rounded hover:bg-[#2C5530] transition-colors duration-200"
                  onClick={() => {
                    // Add payment handling
                  }}
                >
                  Pay Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#2C5530]">No pending invoices</p>
        )}
      </div>
    </div>
  );
}
