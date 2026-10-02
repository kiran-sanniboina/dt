import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { seedDatabase } from './seed';
import authRoutes from './routes/authRoutes';
import academicRoutes from './routes/academicRoutes';
import projectRoutes from './routes/projectRoutes';
import ratingRoutes from './routes/ratingRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ratings', ratingRoutes);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    organization: 'Rajiv Gandhi University of Knowledge Technologies, Srikakulam',
    service: 'College Project Hub API',
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Global Error Handler]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Connect to Database, auto-seed if empty, and start server
connectDB().then(async () => {
  await seedDatabase(false);

  app.listen(PORT, () => {
    console.log(`\n==========================================================`);
    console.log(`🎓 College Project Hub Server running on http://localhost:${PORT}`);
    console.log(`   Organization : RGUKT Srikakulam (@rguktsklm.ac.in)`);
    console.log(`   Health Check : http://localhost:${PORT}/api/health`);
    console.log(`==========================================================\n`);
  });
});
