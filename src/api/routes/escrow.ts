import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/deposit', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    
    const result = await prisma.$transaction(async (prisma) => {
      const account = await prisma.escrowAccount.upsert({
        where: { userId: req.user.id },
        create: {
          userId: req.user.id,
          balance: amount,
        },
        update: {
          balance: { increment: amount },
        },
      });

      const transaction = await prisma.transaction.create({
        data: {
          escrowAccountId: account.id,
          amount,
          type: 'DEPOSIT',
          status: 'COMPLETED',
        },
      });

      return { account, transaction };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process deposit' });
  }
});

router.post('/pay', authenticateToken, async (req, res) => {
  try {
    const { invoiceId, amount } = req.body;
    
    const result = await prisma.$transaction(async (prisma) => {
      const account = await prisma.escrowAccount.findUnique({
        where: { userId: req.user.id },
      });

      if (!account || account.balance < amount) {
        throw new Error('Insufficient funds');
      }

      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: 'PAID' },
      });

      const transaction = await prisma.transaction.create({
        data: {
          escrowAccountId: account.id,
          amount,
          type: 'PAYMENT',
          status: 'COMPLETED',
          invoiceId,
        },
      });

      await prisma.escrowAccount.update({
        where: { id: account.id },
        data: { balance: { decrement: amount } },
      });

      return transaction;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

export default router;