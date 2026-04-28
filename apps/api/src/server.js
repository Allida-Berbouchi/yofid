import mongoose from 'mongoose';

import "./loadEnv.js";

import app from './app.js';

const PORT = Number.parseInt(process.env.PORT, 10);

if (!Number.isFinite(PORT)) {
  throw new Error('PORT is missing or invalid in the root .env file');
}

function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on port : ${PORT}`);
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
