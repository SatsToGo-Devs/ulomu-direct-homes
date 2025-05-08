import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content, receiverId } = req.body;
    const message = await prisma.message.create({
      data: {
        content,
        senderId: req.user.id,
        receiverId,
      },
      include: {
        sender: {
          select: { name: true },
        },
      },
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

router.get('/:receiverId', authenticateToken, async (req, res) => {
  try {
    const { receiverId } = req.params;
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId },
          { senderId: receiverId, receiverId: req.user.id },
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
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;