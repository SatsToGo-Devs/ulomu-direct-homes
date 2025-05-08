import express from 'express';
import authRoutes from './routes/auth';
import propertyRoutes from './routes/property';
import tenantRoutes from './routes/tenant';
import escrowRoutes from './routes/escrow';
import messageRoutes from './routes/message';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/messages', messageRoutes);

export default app;