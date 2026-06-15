import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`⚠️  Unhandled Rejection:`, err.message);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`⚠️  Uncaught Exception:`, err.message);
});

const app = express();

// ======================
// 🔌 Connect to MongoDB
// ======================
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`⚠️  MongoDB Connection Error: ${error.message}`);
    console.log('⚠️  Server will continue without database connection...');
    return false;
  }
};

// ======================
// 🧱 Middleware
// ======================
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ======================
// 📁 Static Folder (Uploads)
// ======================
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// ======================
// 🧪 Test Route
// ======================
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ======================
// 🚀 API Routes
// ======================
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// ======================
// 💳 PayPal Config
// ======================
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

// ======================
// ❌ Error Middleware
// ======================
app.use(notFound);
app.use(errorHandler);

// ── Connect to DB then start or export ──────────────────────
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  // Local development — connect then listen
  const startServer = async () => {
    const dbConnected = await connectDB()
    if (!dbConnected) {
      console.error('⚠️  Database connection failed. Exiting...')
      process.exit(1)
    }
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    })
  }
  startServer().catch(err => {
    console.error('⚠️  Failed to start server:', err.message)
    process.exit(1)
  })
} else {
  // Production (Vercel) — connect on first request
  connectDB()
}

// ── Export for Vercel serverless ─────────────────────────────
export default app