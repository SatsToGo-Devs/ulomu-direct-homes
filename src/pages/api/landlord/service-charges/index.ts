
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET service charges for a unit
  if (req.method === 'GET') {
    const { unitId } = req.query;

    if (!unitId) {
      return res.status(400).json({ error: 'Unit ID is required' });
    }

    try {
      // Check if this unit belongs to the landlord
      const unit = await prisma.unit.findFirst({
        where: {
          id: unitId as string,
          property: {
            landlordId: session.user.id
          }
        }
      });

      if (!unit) {
        return res.status(404).json({ error: 'Unit not found or you do not have permission' });
      }

      const serviceCharges = await prisma.serviceCharge.findMany({
        where: { unitId: unitId as string },
        orderBy: { createdAt: 'desc' }
      });

      return res.status(200).json(serviceCharges);
    } catch (error) {
      console.error('Error fetching service charges:', error);
      return res.status(500).json({ error: 'Failed to fetch service charges' });
    }
  }

  // POST - create a new service charge
  if (req.method === 'POST') {
    const { unitId, description, amount, frequency, nextDueDate } = req.body;

    if (!unitId || !description || !amount || !frequency || !nextDueDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Check if this unit belongs to the landlord
      const unit = await prisma.unit.findFirst({
        where: {
          id: unitId,
          property: {
            landlordId: session.user.id
          }
        }
      });

      if (!unit) {
        return res.status(404).json({ error: 'Unit not found or you do not have permission' });
      }

      const serviceCharge = await prisma.serviceCharge.create({
        data: {
          unitId,
          description,
          amount,
          frequency,
          nextDueDate: new Date(nextDueDate)
        }
      });

      return res.status(201).json(serviceCharge);
    } catch (error) {
      console.error('Error creating service charge:', error);
      return res.status(500).json({ error: 'Failed to create service charge' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
