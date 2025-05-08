import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function MainNav() {
  const { data: session } = useSession();
  const userType = session?.user?.type; // We need to add this to the session

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-4 items-center">
            {userType === 'landlord' && (
              <>
                <Link href="/landlord/dashboard">Dashboard</Link>
                <Link href="/messages">Messages</Link>
                <Link href="/invoices">Invoices</Link>
              </>
            )}
            {userType === 'tenant' && (
              <>
                <Link href="/tenant/dashboard">Dashboard</Link>
                <Link href="/messages">Messages</Link>
                <Link href="/savings">Rent Savings</Link>
                <Link href="/escrow">Escrow Account</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}