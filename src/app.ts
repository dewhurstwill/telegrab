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
  const userAgent: string = req.headers['user-agent'];
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
  const search = `${ip}`.search(/\d/);
  ip = search > 0 ? ip.slice(search) : ip;
  if (
    userAgent.toLowerCase().startsWith('curl') || 
    userAgent.toLowerCase().startsWith('wget')
  ) return res.send(`${ip}`);
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
