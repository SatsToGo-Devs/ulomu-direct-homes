import EscrowDashboard from '@/components/Escrow/EscrowDashboard';

export default function EscrowPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Escrow Account</h1>
      <EscrowDashboard />
    </div>
  );
}