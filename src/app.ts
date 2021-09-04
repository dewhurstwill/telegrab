// Node Modules
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

const logger = morgan;

dotenv.config();

// Importing custom middleware
import { notFound, errorHandler } from './middlewares';

// Importing API routes
import api from './api';

const app = express();

// Configuring middleware in express
app.use(logger('dev', {
  skip: (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
      return res.statusCode < 400;
    }
    return false;
  }
}));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Adding root route to express
app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
  });
});

// Adding imported routes to express
app.use('/api/v1', api);

// Adding imported, custom middleware to express
app.use(notFound);
app.use(errorHandler);

export default app;
