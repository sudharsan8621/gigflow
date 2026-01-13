const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { initializeSocket } = require('./utils/socket');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

initializeSocket(server);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/gigs', require('./routes/gigRoutes'));
app.use('/api/bids', require('./routes/bidRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GigFlow API is running' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});