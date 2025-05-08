import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const tenant = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        rentedUnit: {
          include: {
            property: true,
          },
        },
        escrowAccount: true,
        savingsGoals: {
          where: { status: 'ACTIVE' },
        },
      },
    });

    const pendingInvoices = await prisma.invoice.findMany({
      where: {
        tenantId: session.user.id,
        status: 'PENDING',
      },
    });

    res.status(200).json({
      unit: tenant.rentedUnit,
      escrowBalance: tenant.escrowAccount?.balance || 0,
      savingsGoals: tenant.savingsGoals,
      pendingInvoices,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenant information' });
  }
}