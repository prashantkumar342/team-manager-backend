import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/index';

export function initServer(app: Express): void {
  app.use(cookieParser());

  app.use(
    cors({
      credentials: true,
      origin: process.env.APP_URL,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    }),
  );

  app.use(express.json());

  app.use('/api/teammanager', router);
}
