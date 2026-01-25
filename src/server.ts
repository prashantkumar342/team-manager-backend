import http from 'http';
import cors from 'cors';
import { connectDB } from './config/db';
import { Server } from 'socket.io';
import { setupSocket } from './socket';
import { ENV } from './config/env';
import cookieParser from 'cookie-parser';
import express from 'express';
import router from './routes';
import { initServer } from './app';

export const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const app = express();

    initServer(app);

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

startServer();
