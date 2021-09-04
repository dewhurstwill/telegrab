// Node modules
import express from 'express';
import { nanoid } from 'nanoid';
import { lookup } from 'geoip-lite';


// Local
import * as logger from '../../logger';

const router = express.Router();

const baseState = {
  invocations: [],
}
let state = {}

// GET - /api/v1/t/start
router.get('/start', (req, res) => {
  const id = nanoid(6);
  state[id] = {
    ...baseState
  }
  logger.success(`Created: { instance: ${id} }`)
  res.json({
    instance: id
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const userAgent = req.headers['user-agent'];
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const geo = lookup(ip) || '';
  state[id].invocations.push({
    ip,
    geolocation: geo,
    userAgent
  });
  logger.success(`Invoked: { instance: ${id}, ip: ${ip}, geolocation: ${geo}, userAgent: ${userAgent}}`)
  res.json({
    instance: id,
    invoked: true
  });
});

export default router;
