import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { amount, toAccountId, description } = req.body;

      const fromAccount = await prisma.escrowAccount.findUnique({
        where: { userId: session.user.id },
      });

      if (!fromAccount) {
        return res.status(404).json({ error: 'Escrow account not found' });
      }

      if (fromAccount.balance < amount) {
        return res.status(400).json({ error: 'Insufficient funds' });
      }

      const transaction = await prisma.$transaction([
        prisma.escrowTransaction.create({
          data: {
            amount,
            type: 'TRANSFER',
            status: 'COMPLETED',
            fromAccountId: fromAccount.id,
            toAccountId,
            description,
          },
        }),
        prisma.escrowAccount.update({
          where: { id: fromAccount.id },
          data: { balance: { decrement: amount } },
        }),
        prisma.escrowAccount.update({
          where: { id: toAccountId },
          data: { balance: { increment: amount } },
        }),
      ]);

      return res.status(200).json(transaction);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to process transaction' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}