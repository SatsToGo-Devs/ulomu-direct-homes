import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import PaymentProcessor from '@/components/Payment/PaymentProcessor';

export default function TenantDashboard() {
  const { data: session } = useSession();
  const [tenantInfo, setTenantInfo] = useState({
    unit: null,
    escrowBalance: 0,
    savingsGoals: [],
    pendingInvoices: []
  });

  useEffect(() => {
    const fetchTenantInfo = async () => {
      const response = await fetch('/api/tenant/info');
      const data = await response.json();
      setTenantInfo(data);
    };

    fetchTenantInfo();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tenant Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Your Unit</h2>
          {tenantInfo.unit ? (
            <div>
              <p>Property: {tenantInfo.unit.property.name}</p>
              <p>Unit: {tenantInfo.unit.unitNumber}</p>
              <p>Rent: ${tenantInfo.unit.rentAmount}</p>
            </div>
          ) : (
            <p>No unit assigned yet</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Escrow Balance</h2>
          <p className="text-2xl">${tenantInfo.escrowBalance}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Savings Goals</h2>
          {tenantInfo.savingsGoals.map(goal => (
            <div key={goal.id} className="mb-4">
              <p>Target: ${goal.targetAmount}</p>
              <p>Current: ${goal.currentAmount}</p>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Pending Payments</h2>
          {tenantInfo.pendingInvoices.map((invoice) => (
            <PaymentProcessor key={invoice.id} invoice={invoice} />
          ))}
          {tenantInfo.pendingInvoices.length === 0 && (
            <p className="text-gray-600">No pending payments</p>
          )}
        </div>
      </div>
    </div>
  );
}