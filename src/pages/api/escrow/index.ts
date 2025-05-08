import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const escrowAccount = await prisma.escrowAccount.findUnique({
        where: { userId: session.user.id },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });
      return res.status(200).json(escrowAccount);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch escrow account' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}