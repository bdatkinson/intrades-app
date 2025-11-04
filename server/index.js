import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import nconf from 'nconf';

// Import routes
import authRoutes from './routes/auth.js';
import challengeRoutes from './routes/challenges.js';
import userRoutes from './routes/users.js';
import leaderboardRoutes from './routes/leaderboard.js';

// Load configuration
nconf.argv()
  .env()
  .file({ file: './server/config/config.json' })
  .defaults({
    PORT: 3000,
    NODE_ENV: 'development',
    MONGODB_URI: 'mongodb://localhost:27017/intrades',
    JWT_SECRET: 'your-super-secure-jwt-secret-change-this-in-production'
  });

const app = express();
const PORT = nconf.get('PORT');
const MONGODB_URI = nconf.get('MONGODB_URI');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'self\''],
      styleSrc: ['\'self\'', '\'unsafe-inline\''],
      scriptSrc: ['\'self\''],
      imgSrc: ['\'self\'', 'data:', 'https:']
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://intrades.com']
    : ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}));

// Compression and parsing middleware
app.use(compression());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (nconf.get('NODE_ENV') !== 'test') {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.message
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: nconf.get('NODE_ENV') === 'production' ? 'Something went wrong' : err.message
  });
});

// Database connection
mongoose.connect(MONGODB_URI, {
  // useNewUrlParser and useUnifiedTopology are no longer needed in newer versions
})
  .then(() => {
    console.log(`✅ Connected to MongoDB: ${MONGODB_URI}`);

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 InTrades server running on port ${PORT}`);
      console.log(`📱 Environment: ${nconf.get('NODE_ENV')}`);
      console.log(`🔧 Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async() => {
  console.log('\n🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

export default app;
