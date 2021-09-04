// Node Modules
import express from 'express';

// Importing routes
import telementry from './telementry';
import me from './me';

const router = express.Router();

// GET - /api/v1/
router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/t', telementry); // Consuming the telementry route
router.use('/me', me); // Consuming the me route

export default router;
