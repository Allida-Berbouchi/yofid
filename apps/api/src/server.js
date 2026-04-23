import mongoose from 'mongoose';

import app from './app.js';
import courseRoutes from './routes/course.js';

const PORT = process.env.PORT || 5000;

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
