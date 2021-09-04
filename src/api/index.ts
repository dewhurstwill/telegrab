// Node Modules
import express from 'express';

// Importing the telementry route
import telementry from './telementry';

const router = express.Router();

// GET - /api/v1/
router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

// Consuming the telementry route
router.use('/t', telementry);

export default router;
