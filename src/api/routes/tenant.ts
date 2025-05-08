import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/info', authenticateToken, async (req, res) => {
  try {
    const tenant = await prisma.user.findUnique({
      where: { id: req.user.id },
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
        tenantId: req.user.id,
        status: 'PENDING',
      },
    });

    res.json({
      unit: tenant?.rentedUnit,
      escrowBalance: tenant?.escrowAccount?.balance || 0,
      savingsGoals: tenant?.savingsGoals,
      pendingInvoices,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenant information' });
  }
});

export default router;