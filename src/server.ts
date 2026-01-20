import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

/* =======================
   CORS CONFIG (FIXED)
======================= */

const allowedOrigins = ['https://teammngr.netlify.app', 'http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server / postman / mobile apps
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('CORS not allowed'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// IMPORTANT: handle preflight
app.options('*', cors());

/* =======================
   MIDDLEWARES
======================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =======================
   ROUTES
======================= */

// example
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK' });
});

// your routes here
// app.use('/api/teammanager', teamManagerRoutes);

/* =======================
   SERVER
======================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
