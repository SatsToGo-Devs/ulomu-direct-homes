
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
    return res.status(400).json({ error: 'Invalid farm rental ID' });
  }

  try {
    // Check if this farm rental belongs to a property owned by the landlord
    const farmRental = await prisma.farmRental.findFirst({
      where: {
        id,
        property: {
          landlordId: session.user.id
        }
      },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            farmingType: true
          }
        },
        property: true
      }
    });

    if (!farmRental) {
      return res.status(404).json({ 
        error: 'Farm rental not found or you do not have permission' 
      });
    }

    // GET - Retrieve a specific farm rental
    if (req.method === 'GET') {
      return res.status(200).json(farmRental);
    }

    // PATCH - Update a farm rental's status
    if (req.method === 'PATCH') {
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      // Only allow valid status values
      if (!['ACTIVE', 'EXPIRED', 'TERMINATED'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }

      const updatedRental = await prisma.farmRental.update({
        where: { id },
        data: { status }
      });

      return res.status(200).json(updatedRental);
    }

    // DELETE - Remove a farm rental
    if (req.method === 'DELETE') {
      await prisma.farmRental.delete({
        where: { id }
      });

      return res.status(200).json({ success: true, message: 'Farm rental deleted successfully' });
    }
  } catch (error) {
    console.error(`Error handling farm rental ${req.method} request:`, error);
    return res.status(500).json({ error: `Failed to ${req.method?.toLowerCase()} farm rental` });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
