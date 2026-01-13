const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { initializeSocket } = require('./utils/socket');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load env vars FIRST
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

// CORS Configuration - MUST BE BEFORE OTHER MIDDLEWARE
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://gigflow-one.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

console.log('Allowed Origins:', allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all for now to debug
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Handle preflight requests
app.options('*', cors());

// Body parser
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/gigs', require('./routes/gigRoutes'));
app.use('/api/bids', require('./routes/bidRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'GigFlow API is running',
    allowedOrigins: allowedOrigins
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});