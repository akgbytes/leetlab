import express from 'express';
import { errorHandler } from './middlewares/error.middlewares';

const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to Leetlab');
});

app.use(errorHandler);

export default app;
