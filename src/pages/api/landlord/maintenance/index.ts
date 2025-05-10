
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET - fetch maintenance requests
  if (req.method === 'GET') {
    const { propertyId } = req.query;

    try {
      const whereClause = {
        property: {
          landlordId: session.user.id
        },
        ...(propertyId && { propertyId: propertyId as string })
      };

      const maintenanceRequests = await prisma.maintenanceRequest.findMany({
        where: whereClause,
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          property: {
            select: {
              id: true,
              name: true,
              address: true
            }
          }
        },
        orderBy: [
          { status: 'asc' }, // PENDING first, then IN_PROGRESS, etc.
          { priority: 'desc' }, // EMERGENCY first, then HIGH, etc.
          { createdAt: 'desc' } // Newest first
        ]
      });

      return res.status(200).json(maintenanceRequests);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      return res.status(500).json({ error: 'Failed to fetch maintenance requests' });
    }
  }

  // POST - create a new maintenance request
  if (req.method === 'POST') {
    const { propertyId, title, description, priority } = req.body;

    if (!propertyId || !title || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Check if the property exists and belongs to the tenant's rented units
      const property = await prisma.property.findFirst({
        where: {
          id: propertyId,
          units: {
            some: {
              tenantId: session.user.id
            }
          }
        }
      });

      if (!property) {
        return res.status(404).json({ error: 'Property not found or you do not have permission' });
      }

      const maintenanceRequest = await prisma.maintenanceRequest.create({
        data: {
          propertyId,
          tenantId: session.user.id,
          title,
          description,
          priority: priority || 'MEDIUM',
          status: 'PENDING'
        }
      });

      return res.status(201).json(maintenanceRequest);
    } catch (error) {
      console.error('Error creating maintenance request:', error);
      return res.status(500).json({ error: 'Failed to create maintenance request' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
