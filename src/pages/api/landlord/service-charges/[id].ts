
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid service charge ID' });
  }

  // First, verify this service charge belongs to a unit owned by the landlord
  try {
    const serviceCharge = await prisma.serviceCharge.findFirst({
      where: {
        id,
        unit: {
          property: {
            landlordId: session.user.id
          }
        }
      },
      include: {
        unit: {
          include: {
            property: true
          }
        }
      }
    });

    if (!serviceCharge) {
      return res.status(404).json({ error: 'Service charge not found or you do not have permission' });
    }

    // DELETE - Remove a service charge
    if (req.method === 'DELETE') {
      await prisma.serviceCharge.delete({
        where: { id }
      });

      return res.status(200).json({ success: true, message: 'Service charge deleted successfully' });
    }

    // PATCH - Update a service charge
    if (req.method === 'PATCH') {
      const { description, amount, frequency, nextDueDate } = req.body;
      
      const updatedServiceCharge = await prisma.serviceCharge.update({
        where: { id },
        data: {
          ...(description && { description }),
          ...(amount && { amount }),
          ...(frequency && { frequency }),
          ...(nextDueDate && { nextDueDate: new Date(nextDueDate) })
        }
      });

      return res.status(200).json(updatedServiceCharge);
    }

    // GET - Retrieve a specific service charge
    if (req.method === 'GET') {
      return res.status(200).json(serviceCharge);
    }
  } catch (error) {
    console.error(`Error handling service charge ${req.method} request:`, error);
    return res.status(500).json({ error: `Failed to ${req.method?.toLowerCase()} service charge` });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
