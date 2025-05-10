
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      // Fetch all users with userType 'FARMER'
      const farmers = await prisma.user.findMany({
        where: {
          userType: 'FARMER'
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          farmingType: true
        },
        orderBy: { name: 'asc' }
      });

      return res.status(200).json(farmers);
    } catch (error) {
      console.error('Error fetching farmers:', error);
      return res.status(500).json({ error: 'Failed to fetch farmers' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
