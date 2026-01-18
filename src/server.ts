import http from 'http';
import app from './app';
import { connectDB } from './config/db';

export const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const server = http.createServer(app);
    // initSocket(server);

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};
