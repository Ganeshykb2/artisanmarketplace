// ./server.js
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import dbConnect from './config/dbConnect.js';
import adminRoutes from './routes/adminRoutes.js';
import artistRoutes from './routes/artistRoutes.js';
import customerRoutes from './routes/customerRoutes.js'; // Add customer routes
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'; // Add payment routes
import cartRoutes from './routes/cartRoutes.js';
import { validToken } from './middlewares/validToken.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Body Parsing Middleware with error handling
app.use(express.json({ limit: '10mb', strict: true }));

// Logging incoming requests (POST and PUT only)
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Incoming Request Headers:', req.headers);
    console.log('Request Method:', req.method);
    console.log('Request Path:', req.path);

    let rawBody = '';
    req.on('data', (chunk) => {
      rawBody += chunk;
    });

    req.on('end', () => {
      console.log('Raw Request Body:', rawBody);
      try {
        JSON.parse(rawBody);
        console.log('JSON is valid');
      } catch (parseError) {
        console.error('JSON Parsing Error in Raw Body:', parseError);
      }
    });
  }
  next();
});

// Connect to the database
dbConnect();

// Use Routes
app.use('/api/admins', adminRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/customers', customerRoutes); // customer routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/carts', cartRoutes);

app.get('/api/vaild-token', validToken); // Valid Token

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ 
    message: 'Something went wrong', 
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  console.log('Route not found');
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
