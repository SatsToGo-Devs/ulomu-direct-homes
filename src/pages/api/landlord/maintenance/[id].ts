
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
    return res.status(400).json({ error: 'Invalid maintenance request ID' });
  }

  // Check if this maintenance request belongs to a property owned by the landlord
  // or was submitted by the tenant (for GET requests)
  try {
    const isLandlord = await prisma.maintenanceRequest.findFirst({
      where: {
        id,
        property: {
          landlordId: session.user.id
        }
      }
    });

    const isTenant = await prisma.maintenanceRequest.findFirst({
      where: {
        id,
        tenantId: session.user.id
      }
    });

    // For GET requests, allow both landlord and the tenant who submitted it
    if (req.method === 'GET' && !isLandlord && !isTenant) {
      return res.status(404).json({ error: 'Maintenance request not found or you do not have permission' });
    }

    // For other methods, only allow the landlord
    if (req.method !== 'GET' && !isLandlord) {
      return res.status(403).json({ error: 'You do not have permission to modify this maintenance request' });
    }

    // PATCH - Update a maintenance request
    if (req.method === 'PATCH') {
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const updatedRequest = await prisma.maintenanceRequest.update({
        where: { id },
        data: { status }
      });

      return res.status(200).json(updatedRequest);
    }

    // GET - Retrieve a specific maintenance request
    if (req.method === 'GET') {
      const maintenanceRequest = await prisma.maintenanceRequest.findUnique({
        where: { id },
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          property: true
        }
      });

      if (!maintenanceRequest) {
        return res.status(404).json({ error: 'Maintenance request not found' });
      }

      return res.status(200).json(maintenanceRequest);
    }

    // DELETE - Remove a maintenance request (only if it's PENDING and the tenant created it)
    if (req.method === 'DELETE') {
      if (isTenant) {
        // Check if the request is still PENDING
        if (isTenant.status !== 'PENDING') {
          return res.status(400).json({ 
            error: 'Cannot delete maintenance request that is already being processed' 
          });
        }
      }

      await prisma.maintenanceRequest.delete({
        where: { id }
      });

      return res.status(200).json({ success: true, message: 'Maintenance request deleted successfully' });
    }

  } catch (error) {
    console.error(`Error handling maintenance request ${req.method} request:`, error);
    return res.status(500).json({ error: `Failed to ${req.method?.toLowerCase()} maintenance request` });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
