import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const escrowAccount = await prisma.escrowAccount.findUnique({
      where: { userId: session.user.id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!escrowAccount) {
      const newAccount = await prisma.escrowAccount.create({
        data: {
          userId: session.user.id,
          balance: 0,
        },
        include: {
          transactions: true,
        },
      });
      return res.status(200).json(newAccount);
    }

    res.status(200).json(escrowAccount);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
}