import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || req.method !== 'POST') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { amount } = req.body;

    const transaction = await prisma.$transaction(async (prisma) => {
      const account = await prisma.escrowAccount.update({
        where: { userId: session.user.id },
        data: { balance: { increment: amount } },
      });

      const transaction = await prisma.transaction.create({
        data: {
          escrowAccountId: account.id,
          amount,
          type: 'DEPOSIT',
          status: 'COMPLETED',
        },
      });

      return transaction;
    });

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process deposit' });
  }
}