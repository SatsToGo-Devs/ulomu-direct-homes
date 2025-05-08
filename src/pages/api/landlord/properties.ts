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
      const properties = await prisma.property.findMany({
        where: { landlordId: session.user.id },
        include: {
          units: {
            include: {
              tenant: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
      return res.status(200).json(properties);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch properties' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, address, units } = req.body;
      const property = await prisma.property.create({
        data: {
          name,
          address,
          landlordId: session.user.id,
          units: {
            create: units,
          },
        },
      });
      return res.status(201).json(property);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create property' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}