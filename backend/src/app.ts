import express from 'express';
import { errorHandler } from './middlewares/error.middlewares';
import healthRoutes from './routes/healthCheck.routes';

const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to Leetlab');
});

app.use('/api/v1/healthcheck', healthRoutes);

app.use(errorHandler);

export default app;
