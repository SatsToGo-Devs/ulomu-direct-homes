import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export function validateRequest(schema: z.ZodSchema) {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    try {
      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData;
      return next();
    } catch (error) {
      return res.status(400).json({ error: 'Invalid request data' });
    }
  };
}

export const schemas = {
  savingsGoal: z.object({
    targetAmount: z.number().positive(),
    goalName: z.string().min(1),
  }),
  payment: z.object({
    amount: z.number().positive(),
    invoiceId: z.string().uuid(),
  }),
};