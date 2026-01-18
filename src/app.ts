import express from 'express';
import cors from 'cors';
import router from './routes';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  }),
);
app.use(express.json());

// apis
app.use('/api', router);

export default app;
