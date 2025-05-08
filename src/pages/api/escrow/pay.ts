import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || req.method !== 'POST') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { invoiceId, amount } = req.body;

    const result = await prisma.$transaction(async (prisma) => {
      const escrowAccount = await prisma.escrowAccount.findUnique({
        where: { userId: session.user.id },
      });

      if (!escrowAccount || escrowAccount.balance < amount) {
        throw new Error('Insufficient funds');
      }

      const invoice = await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: 'PAID' },
      });

      const transaction = await prisma.transaction.create({
        data: {
          escrowAccountId: escrowAccount.id,
          amount,
          type: 'PAYMENT',
          status: 'COMPLETED',
          invoiceId,
        },
      });

      await prisma.escrowAccount.update({
        where: { id: escrowAccount.id },
        data: { balance: { decrement: amount } },
      });

      return { invoice, transaction };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process payment' });
  }
}