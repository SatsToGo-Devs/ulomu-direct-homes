import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || req.method !== 'POST') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { unitId, tenantEmail } = req.body;

    const tenant = await prisma.user.findUnique({
      where: { email: tenantEmail },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const unit = await prisma.unit.update({
      where: { id: unitId },
      data: {
        tenantId: tenant.id,
        status: 'OCCUPIED',
      },
    });

    res.status(200).json(unit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign unit' });
  }
}