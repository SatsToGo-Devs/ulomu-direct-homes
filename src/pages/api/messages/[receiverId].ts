import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { receiverId } = req.query;

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: session.user.id, receiverId: receiverId as string },
            { senderId: receiverId as string, receiverId: session.user.id },
          ],
        },
        include: {
          sender: {
            select: { name: true },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}