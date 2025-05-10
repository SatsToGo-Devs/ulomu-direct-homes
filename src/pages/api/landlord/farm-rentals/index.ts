
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET - fetch farm rentals
  if (req.method === 'GET') {
    try {
      // For landlords, fetch rentals for their properties
      const farmRentals = await prisma.farmRental.findMany({
        where: {
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
        },
        orderBy: { createdAt: 'desc' }
      });

      return res.status(200).json(farmRentals);
    } catch (error) {
      console.error('Error fetching farm rentals:', error);
      return res.status(500).json({ error: 'Failed to fetch farm rentals' });
    }
  }

  // POST - create a new farm rental
  if (req.method === 'POST') {
    const { propertyId, farmerId, startDate, endDate, rentAmount, farmingPurpose } = req.body;

    if (!propertyId || !farmerId || !startDate || !endDate || !rentAmount || !farmingPurpose) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Verify the property belongs to the landlord
      const property = await prisma.property.findFirst({
        where: {
          id: propertyId,
          landlordId: session.user.id,
          propertyType: 'AGRICULTURAL'
        }
      });

      if (!property) {
        return res.status(404).json({ 
          error: 'Agricultural property not found or you do not have permission' 
        });
      }

      // Verify the farmer exists
      const farmer = await prisma.user.findFirst({
        where: {
          id: farmerId,
          userType: 'FARMER'
        }
      });

      if (!farmer) {
        return res.status(404).json({ error: 'Farmer not found' });
      }

      // Create the farm rental
      const farmRental = await prisma.farmRental.create({
        data: {
          propertyId,
          farmerId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          rentAmount,
          farmingPurpose,
          status: 'ACTIVE'
        }
      });

      return res.status(201).json(farmRental);
    } catch (error) {
      console.error('Error creating farm rental:', error);
      return res.status(500).json({ error: 'Failed to create farm rental' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
