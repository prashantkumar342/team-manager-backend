import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { Server } from 'socket.io';
import { setupSocket } from './socket';
import { ENV } from './config/env';

export const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const server = http.createServer(app);
    // initSocket server;

    const io = new Server(server, {
      cors: {
        origin: process.env.APP_URL,
        credentials: true,
      },
    });

    // make io available in controllers
    app.locals.io = io;

    setupSocket(io);

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};
