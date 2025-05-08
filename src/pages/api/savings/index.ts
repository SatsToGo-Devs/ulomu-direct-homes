import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { targetAmount, goalName } = req.body;
      const goal = await prisma.savingsGoal.create({
        data: {
          userId: session.user.id,
          targetAmount,
          currentAmount: 0,
          goalName,
          status: 'ACTIVE',
        },
      });
      return res.status(201).json(goal);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create savings goal' });
    }
  }

  if (req.method === 'GET') {
    try {
      const goals = await prisma.savingsGoal.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(goals);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch savings goals' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}