import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, address, units } = req.body;
    const property = await prisma.property.create({
      data: {
        name,
        address,
        landlordId: req.user.id,
        units: {
          create: units.map((unit: any) => ({
            unitNumber: unit.unitNumber,
            rentAmount: unit.rentAmount,
            status: 'VACANT',
          })),
        },
      },
      include: {
        units: true,
      },
    });
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create property' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      where: {
        landlordId: req.user.id,
      },
      include: {
        units: {
          include: {
            tenant: true,
          },
        },
      },
    });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

export default router;