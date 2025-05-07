import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/error.middlewares';
import healthRoutes from './routes/healthCheck.routes';
import { env } from './configs/env';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.get('/', (req, res) => {
  res.send('Welcome to Leetlab');
});

app.use('/api/v1/healthcheck', healthRoutes);

app.use(errorHandler);

export default app;
