require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const waitingListRoutes = require('./routes/waitingListRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ======================
// Security Middleware
// ======================
app.use(helmet()); // Adds security headers
app.use(express.json({ limit: '10kb' })); // Body size limit

// Rate limiting (100 requests per 15 mins)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// ======================
// CORS Configuration
// ======================
const allowedOrigins = [
  process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000', // Next.js frontend
  process.env.ADMIN_DASHBOARD_URL || 'http://localhost:3001'      // Admin dashboard
];

app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow requests with no origin (like Postman)
  
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // ✅ Explicitly allow credentials (cookies, auth)
  }));
  

// ======================
// Database Connection
// ======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ======================
// Route Configuration
// ======================
// Public API routes
app.use('/api/waiting-list', waitingListRoutes);
app.use('/api/auth', authRoutes);

// ======================
// Error Handling
// ======================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ======================
// Server Start
// ======================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});