import express from 'express';
import env from './configs/env';

const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to Leetlab');
});

console.log(env);

export default app;
