import mongoose from 'mongoose';

import "./loadEnv.js";

import app from './app.js';
import courseRoutes from './routes/course.js';

const PORT = Number.parseInt(process.env.PORT, 10);

console.log('DEBUG: process.env.PORT =', process.env.PORT);
console.log('DEBUG: Parsed PORT =', PORT);

if (!Number.isFinite(PORT)) {
  throw new Error('PORT is missing or invalid in the root .env file');
}

app.use('/api', courseRoutes);

function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

if (mongoose.connection.readyState === 1) {
  startServer();
} else {
  mongoose.connection.once('connected', startServer);
  mongoose.connection.once('error', (error) => {
    console.error('Failed to start server:', error.message);
  });
}
