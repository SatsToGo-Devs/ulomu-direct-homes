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
      const { unitId, tenantId, amount, dueDate, items } = req.body;
      
      const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber,
          unitId,
          tenantId,
          amount,
          dueDate: new Date(dueDate),
          status: 'PENDING',
          items: {
            create: items,
          },
        },
        include: {
          items: true,
          unit: true,
          tenant: true,
        },
      });

      return res.status(201).json(invoice);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create invoice' });
    }
  }

  if (req.method === 'GET') {
    try {
      const invoices = await prisma.invoice.findMany({
        where: {
          OR: [
            { tenantId: session.user.id },
            { unit: { property: { landlordId: session.user.id } } },
          ],
        },
        include: {
          items: true,
          unit: true,
          tenant: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(invoices);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch invoices' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}