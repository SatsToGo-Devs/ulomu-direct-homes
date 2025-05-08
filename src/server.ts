import express from 'express';
import authRoutes from './api/routes/auth';
import propertyRoutes from './api/routes/property';
import tenantRoutes from './api/routes/tenant';
import escrowRoutes from './api/routes/escrow';
import messageRoutes from './api/routes/message';

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});