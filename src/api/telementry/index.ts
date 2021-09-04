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
let state = {
  stats: {
    byIp: {},
    byLocation: {},
  },
}

// GET - /api/v1/t/stats
router.get('/stats', (req, res) => {
  logger.success(`Checking: { stats }`)
  res.json({
    data: {
      invocations: {
        ...state.stats
      }
    }
  });
});

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

// GET - /api/v1/t/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const userAgent: string = req.headers['user-agent'];
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';

  const search = `${ip}`.search(/\d/);
  ip = search > 0 ? ip.slice(search) : ip;

  const geo = lookup(ip) || {};
  const { timezone } = geo;

  state.stats.byIp[`${ip}`] = Object.keys(state.stats.byIp).includes(`${ip}`) ? state.stats.byIp[`${ip}`] + 1 : 1
  state.stats.byLocation[timezone] = Object.keys(state.stats.byLocation).includes(timezone) ? state.stats.byLocation[timezone] + 1 : 1

  state[id].invocations.push({
    ip,
    geolocation: geo,
    userAgent
  });

  logger.success(`Invoked: { instance: ${id}, ip: ${ip}, geolocation: ${timezone || ''}, userAgent: ${userAgent || ''}}`)
  res.json({
    instance: id,
    invoked: true
  });
});

// GET - /api/v1/t/:id/show
router.get('/:id/show', (req, res) => {
  const { id } = req.params;
  logger.success(`Checking: { instance: ${id}, invocationCount: ${state[id].invocations.length} }`)
  res.json({
    instance: id,
    data: {
      invocations: {
        data: state[id].invocations,
        count: state[id].invocations.length
      }
    }
  });
});

export default router;
