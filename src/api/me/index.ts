// Node modules
import express from 'express';
import { nanoid } from 'nanoid';
import { lookup } from 'geoip-lite';

// Local
import * as logger from '../../logger';

const router = express.Router();

// GET - /api/v1/me
router.get('/', (req, res) => {
  const userAgent: string = req.headers['user-agent'];
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';

  const search = `${ip}`.search(/\d/);
  ip = search > 0 ? ip.slice(search) : ip;

  const geo = lookup(ip) || {};
  const { timezone } = geo;

  logger.success(`User Invoked: { ip: ${ip}, geolocation: ${timezone || ''}, userAgent: ${userAgent || ''}}`);

  if (
    userAgent.toLowerCase().startsWith('curl') || 
    userAgent.toLowerCase().startsWith('wget')
  ) return res.send(`${ip}`);

  res.json({
    instance: `User Invoked`,
    invoked: true,
    ip,
    geoLocation: timezone,
    userAgent
  });
});

export default router;
